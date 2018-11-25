const url = require('url')
const qs = require('querystring')
	
module.exports = {
  serverHandle: function (req, res) {
  	const route = url.parse(req.url)
	const path = route.pathname 
	const params = qs.parse(route.query)
	
	res.writeHead(200);

	if (path === '/hello' && 'name' in params &&  (params['name'] == 'Lisa' || params['name'] == 'lisa')) {
		res.writeHead(200);
		res.write('<h1> My name is ' + params['name'] + '.</h1> <p> I am 22 years old and studying at ECE Paris.</p><p>I am taking an Asynchronous Server Technologies Class.</p>')

		// res.write('<h3> My name is ' + params['name'] + '.</h3> <p>I am 22 years old and studying at ECE Paris.</p></br> <p>I am taking an Asynchronous Server Technologies Class.</p>')
	}
	else if (path === '/hello' && 'name' in params) {
		res.write('<h1>Hello ' + params['name'] + '!</h1>')
	} 
	else if (path === '/'){
		res.writeHead(200);
		res.write('<h1> Welcome!</h1> <ul><li> If you want this page to say hello go to <a href="/hello?name=">/hello?name=</a><b>[your name]</b></li> <li>If you want a short description of me go to <a href="/hello?name=Lisa">/hello?name=Lisa</a></li>')
	}
	else {
		res.writeHead(404)
		res.write('<h1>PAGE NOT FOUND.</h1>')
	}

	res.end();

  } 
}