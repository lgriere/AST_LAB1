import express = require('express')
import bodyparser = require('body-parser')
import morgan = require('morgan')
import { MetricsHandler, Metric } from './metrics'
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './users'
import path = require('path')

const LevelStore = levelSession(session)

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')
const dbUser: UserHandler = new UserHandler('./db/users')

const app = express()
const port: string = process.env.PORT || '8080'

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.use(morgan('dev'))

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

app.set('views', __dirname + '/../views')
app.set('view engine', 'ejs')

app.use('/', express.static(path.join(__dirname, '/../node_modules/jquery/dist')))
app.use('/', express.static(path.join(__dirname, '/../node_modules/bootstrap/dist')))

/*
	Authentication
*/

const authRouter = express.Router()

authRouter.get('/login', (req:any, res: any) => {
	res.render('login')
})

authRouter.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

authRouter.get('/signup', (req:any, res: any) => {
	res.render('signup')
})

authRouter.get('/logout', (req:any, res: any) => {
	if(req.session.loggedIn) {
		delete req.session.loggedIn
		delete req.session.user
	}
	res.redirect('/login')
})

app.use(authRouter)

/* 
	Users 
*/

const userRouter = express.Router()

  userRouter.post('/', (req: any, res: any, next: any) => {
	dbUser.get(req.body.username, (err: Error |null, result? :User) => {
	if(!err || result !== undefined) {
		res.status(409).send("user already exists")
	}
	else {
		const { username, password, email } = req.body
		const u = new User(username, password, email)
		dbUser.save(u, (err: Error | null) => {
		  if (err) next(err)
		  res.satus(201).send("user saved")
		})
	}
	})
  })

  userRouter.get('/:username', (req: any, res: any, next: any) => {
    dbUser.get(req.params.username, (err: Error | null, result?: User) => {
      if (err || result === undefined) {
		res.status(404).send("user not found")
	  } else {
        res.status(200).json(result)
      }
    })
  })
  
  userRouter.delete('/:username', function (req: any, res: any, next: any) {
	  dbUser.get(req.params.username, function (err: Error | null) {
		if (err) next(err)
		res.status(200).send()
	  })
	})

app.use('/user', userRouter)

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}


app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})

/*
	Metrics
*/

const metricsRouter = express.Router()

metricsRouter.use(function (req: any, res: any, next: any) {
  console.log('metrics router: '  + req.method + ' on ' + req.url)
  next()
})

metricsRouter.get('/:id', (req: any, res: any,  next : any) => {
  dbMet.get(req.params.id, (err: Error | null, result?: Metric[]) => {
    if (err) next(err)
    if (result === undefined) {
      res.write('no result')
      res.send()
    } else res.json(result)
  })
})

metricsRouter.post('/:id', (req: any, res: any, next: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) next(err)
    res.status(200).send()
  })
})

metricsRouter.delete('/:id', (req: any, res: any, next: any) => {
  dbMet.remove(req.params.id, (err: Error | null) => {
    if (err) next(err)
    res.status(200).send()
  })
})

app.use('/metrics', authCheck, metricsRouter)

/* 
	Error handling
*/

app.use(function (err: Error, req: any, res: any, next: any) {
	console.log('Got an error')
	console.error(err.stack)
	res.status(500).send('Something broke!')
})

app.listen(port, (err: Error) => {
  if (err) throw err
  console.log(`server is listening on port ${port}`)
})