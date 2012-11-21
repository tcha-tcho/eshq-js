var app = require('express')()
  , eshq = require('../')({
     key    : "9ccf66d2-1a3e-4f83-8d19-63fd7b920100"
    ,secret : "a8ffc2c7-d238-439b-b364-71c84cdd64c4"
  }).listen(app)

setInterval(function(){
  eshq.send({
    channel: "some-channel" // Required
    ,data: String(new Date().getTime()) // Required
    ,"name": "notification" // optional
    ,"id": "event-id" // optional
  },function(res){
    console.log("sending a message")
  })
},3000)

var fs = require('fs');
app.get('/',function(req,res,next){
  fs.readfile(__dirname + '/views/index.html', 'utf8', function(err, text){
    res.send(text);
  });
});

app.listen(3000);
