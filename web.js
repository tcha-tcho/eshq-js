var keys = {
   "ESHQ_KEY"            : process.env.ESHQ_KEY
  ,"ESHQ_SECRET"         : process.env.ESHQ_SECRET
  ,"ESHQ_URL"            : process.env.ESHQ_URL
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
  return crypto.createHash('sha1').update(str).digest('hex');
}
function credentials() {
  var time = Math.floor(new Date().getTime() / 1000);
  return {"key":keys.ESHQ_KEY, "timestamp":String(time), "token":token(String(time))}
}
function post(path,data,callback) {
  data = querystring.stringify(merge(data,credentials()));
  // data = JSON.stringify(merge(data,credentials()));
  console.log(data)
  var eshq_url   = require("url").parse(keys.ESHQ_URL);

  var response_ready;
  var options = {
    host: eshq_url.host,
    port: 80,
    path: path,
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded','Content-Length':data.length}
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
  "channel": "some-channel"
},function(res){
  console.log("open a channel")
  console.log(res)
})

send_msg({
  "channel": "some-channel" // Required
  ,"data": {'msg': 'data'} // Required
  //,"id": "event-id" // optional
  //,"name": "event-name" // optional
},function(res){
  console.log("sending a message")
  console.log(res)
})