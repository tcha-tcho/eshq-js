var app = require('express')()
  , eshq = require('../')({
     key    : "key"
    ,secret : "secret"
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
  fs.readFile(__dirname + '/views/index.html', 'utf8', function(err, text){
    res.send(text);
  });
});

app.listen(3000);
