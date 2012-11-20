# eshq-js

Node.js module for [EventSource HQ](http://eventsourcehq.com) services.

## Installation

    $ npm install eshq-js --save

(`--save` automatically writes to your `package.json` file, tell your friends)


## Usage

Run `node app.js` from `examples` and open `localhost:3000` to see a working example.

Given a channel, `some-channel`:

    ESHQ.send(
        :channel => "messages",
        :name => "notification",
        :data => "You should sign up for EventSource HQ!"
    )

And a layout, `test.html`:

    <!DOCTYPE html>
    <html>
    <head>
      <script type="text/javascript" src="./eshq.js"></script>
      <script type="text/javascript">
        var es = new ESHQ("some-channel");

        es.addEventListener("notification", function(e) {
          console.log(e.data);
        });
      </script>
    </head>
    <body>

    </body>
    </html>

You get the following result:

    HTTP/1.1 200 OK
    Content-Type: text/event-stream

    data: This is an event

    event: notification
    data: This is a notification

    id: 12345
    data: This is an event with an id

    data: Multiline event
    data: Line 2


## Features

### `Fast, Easy and Reliable`

EventSource HQ is hosted on EC2 and built for performance and scalability. Any Server Sent events implementation requires handling thousands of concurrent open connections. Traditional web servers are not built for this. EventSource HQ takes all the pain away from having to install, configure and manage a parallel infrastructure.

### `Supports All Browsers`

The EventSource HQ client library takes care of all cross-browser support issues. Firefox, Chrome, Safari, Opera and Safari Mobile all support EventSource out of the box. For Internet Explorer, Webkit for Android and older browsers EventSource HQ handles all the tricky fallbacks for you. Just send events and we'll get them to your users.

### `Fully Open Source`

The software behind EventSource HQ is being developed as a fully open-source project. The core of EventSource HQ is the Haskell based "EventSource Broker" that bridges between the message exchange RabbitMQ and EventSource. All source code is available on Github and you can always move to a self-hosted install if you prefer administrating your own infrastructure.


## TODO

 - More Tests!
 - More templates.
 - Better, safer syntax.


## Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:

    $ npm install -d

then run the tests:

    $ npm test


## Backwards Compatibility

[Browser Support](http://www.eventsourcehq.com/browser-support)

## Credits

This library is a fork from Mathias Biilmann [ruby-gem library](https://github.com/eshq/eshq-gem), and the partial function remains relatively untouched from there. Mathias is still updating his library and We will try to maintain this one up-to-date.

The port syntax comes from [Tcha-Tcho](https://github.com/tcha-tcho)


## License

(The MIT License)

Copyright (c) 2012 Mathias Biilmann &lt;mathiasch@eventsourcehq.com&gt;
Copyright (c) 2012 Tcha-Tcho &lt;tchatcho66@hotmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
