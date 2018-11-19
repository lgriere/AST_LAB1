// Import a module
express = require('express')
app = express()
path = require('path')
app.use(express.static(path.join(__dirname, 'public')))
app.set('port', 8080)
app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');

app.listen(
  app.get('port'),
  () => console.log(`server listening on ${app.get('port')}`)
)

app.get( '/',
  (req, res) => res.render('explanations.ejs')
)

app.get('/hello/:name',
  (req, res) => {
    if(req.params.name === "Lisa"){
		res.render('introduction.ejs', {name: req.params.name})	
	}
    else {
		res.render('hello.ejs', {name: req.params.name})
    }
  }
)

/*
app.post('/', (req, res) => {
  // POST
})

app
  .put('/', function (req, res) {
    // PUT
  })
  
app.delete('/', (req, res) => {
    // DELETE
  })
  */


