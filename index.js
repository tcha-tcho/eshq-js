var querystring = require('querystring');
var crypto      = require('crypto');
var http        = require('http');
var url_parser  = require("url");
var EventEmitter = process.EventEmitter;

module.exports = function(options) {

  var errors = [];
  var key    = (options.key    || errors.push("Key is needed \n"));
  var secret = (options.secret || errors.push("Secret is needed \n"));
  var url    = (options.url    || "http://app.eventsourcehq.com")

  if (errors.length > 0) throw errors; //eshq-js errors

  //private functions
  var merge = function(a, b) {
    for (var i in b) {a[i] = b[i];}
    return a;
  }
  function token(time) {
    var str = String([key,secret,time].join(":"))
    return crypto.createHash('sha1').update(str).digest('hex');
  }
  function credentials() {
    var time = Math.floor(new Date().getTime() / 1000);
    return {"key":key, "timestamp":String(time), "token":token(String(time))}
  }
  function post(path,data,callback) {
    data = querystring.stringify(merge(data,credentials()));
    var callback = callback;
    var eshq_url   = url_parser.parse(url);
    var response_ready;
    var options = {
      host: eshq_url.host
      ,port: 80
      ,path: path
      ,method: 'POST'
      ,headers: {'Content-Type': 'application/x-www-form-urlencoded','Content-Length':data.length}
    };
    var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function(d) {
        response_ready = d;
      });
      function done(){callback(response_ready) }
      response.on('end', done);
    }).on('error', function(e) {
      console.error(e);
    });
    request.write(data);
    request.end();
  }
  function body_parser(req,callback){
    var body = '';
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      callback(querystring.parse(body));
    });
  }


  //public methods
  return {
    open: function(data,callback) {
      post("/socket", data, callback)
    },
    send: function(data,callback) {
      post("/event", data, callback)
    },
    listen: function (app, options, fn) {
      var self = this;
      app.use(function(req,res,next){
        if (req._parsedUrl.pathname == '/eshq/socket') {
          body_parser(req,function(data){
            self.open(data,function(response){
              res.send(response)
            })
          })
        } else if (req._parsedUrl.pathname == '/eshq/event') {
          body_parser(req,function(data){
            self.send(data,function(response){
              res.send(response)
            })
          })
        }else{
          next();
        };
      })
      return this
    }

  }
}
