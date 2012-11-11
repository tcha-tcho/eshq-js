
var keys = {
   "ESHQ_KEY"            : "9ccf66d2-1a3e-4f83-8d19-63fd7b920100"
  ,"ESHQ_SECRET"         : "a8ffc2c7-d238-439b-b364-71c84cdd64c4"
  ,"ESHQ_URL"            : "http://app.eventsourcehq.com"
}

var querystring = require('querystring');
var crypto = require('crypto');
var http = require('http');

var merge = function(a, b) {
  for (var i in b) {a[i] = b[i];}
  return a;
}
function open_msg_channel(data,callback) { // return a socket
  post("/socket", data, callback)
}
function send_msg(data,callback){
  post("/event", data, callback)
}
function token(time) {
  var str = String([keys.ESHQ_KEY,keys.ESHQ_SECRET,time].join(":"))
  return crypto.createHmac('sha1',str).update(str).digest('hex');  
}
function credentials() {
  var now = new Date(); 
  var time = String(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  )).slice(0,10)+".000000s";
  return {"key":keys.ESHQ_KEY, "timestamp":time, "token":token(time)}
}
function post(path,data,callback) {
  data = querystring.stringify(merge(data,credentials()));
  var eshq_url   = require("url").parse(keys.ESHQ_URL);

  var response_ready;
  var options = {
    host: eshq_url.host,
    port: 80,
    path: path,
    method: 'POST'
    ,headers: {'Content-Type': 'application/json'}
  };
  var request = http.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(d) {
      response_ready = d;
    });
    function done(){
      callback(response_ready)
    }
    response.on('end', done);
  }).on('error', function(e) {
    console.error(e);
  });

  request.write(data);
  request.end();

}

open_msg_channel({
  "channel": "some-channel", // Required
  "data": "{/'msg/': /'data/'}", // Required
  "id": "event-id", // optional
  "name": "event-name" // optional
},function(res){
  console.log("open a channel")
  console.log(res)
})

send_msg({
  "channel": "some-channel", // Required
  "data": "{/'msg/': /'data/'}", // Required
  "id": "event-id", // optional
  "name": "event-name" // optional
},function(res){
  console.log("sending a message")
  console.log(res)
})
