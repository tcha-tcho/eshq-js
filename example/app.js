var express = require('express')
  , app = express()
  , eshq = require('../')({
     key            : "9ccf66d2-1a3e-4f83-8d19-63fd7b920100"
    ,secret         : "a8ffc2c7-d238-439b-b364-71c84cdd64c4"
  })

eshq.open({
  channel: "some-channel"
},function(res){
  console.log("openning a channel")
  console.log(res)
})

eshq.send({
  channel: "some-channel" // Required
  ,data: {'msg': String(new Date().getTime()) } // Required
  ,"id": "event-id" // optional
  ,"name": "event-name" // optional
},function(res){
  console.log("sending a message")
  console.log(res)
})




app.set('views',__dirname + '/views');

// render 'index' into 'boilerplate':
app.get('/',function(req,res,next){
  // res.render('index', { what: 'best', who: 'me', muppets: [ 'Kermit', 'Fozzie', 'Gonzo' ] });
});

app.get('/foo.js', function(req,res,next){
	res.sendfile('foo.js');
})

app.get('/foo.css', function(req,res,next){
	res.sendfile('foo.css');
})

app.listen(3000);
