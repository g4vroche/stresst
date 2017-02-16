var http = require('http');
var test = require("../../lib/stresst");

var suite = {
  base_uri: "http://localhost:3000",
  tests: [
    {
      method: 'GET',
      uri: '/nonExistant',
      asserts: [
        {test: test.if.httpStatusIs(404)},
        {test: test.if.headerIsEqual('x-foo', 'bar')},
      ]
    },
    {
      method: 'GET',
      uri: '/test',
      asserts: [
        {test: test.if.httpStatusIs(200)},
        {test: test.if.isJSON()},
        {test: test.if.isEqual('message', 'This is a test')},
        // {
        //   name: 'Failing test',
        //   test: test.if.isEqual('message', 'Fail'),
        // },
      ],
    },
    {
      method: 'GET',
      uri: '/html',
      asserts: [
        {test: test.if.httpStatusIs(200)},
        {test: test.if.selectorValueIs('h1', 'title')},
        {test: test.if.selectorValueIs($ => $('.foo').text(), 'bar')},
      ],
    },
    {
      method: 'GET',
      uri: '/complex',
      asserts: [
        {test: test.if.greaterThan('fiz.boo.0', 41)}
      ]
    }
  ],
};


var data = {
  default: {
    status: 404,
    message: 'Not Found',
  },

  '/test': {
    status: 200,
    message: 'This is a test',
  },

  '/complex': {
    status: 200,
    foo: 'bar',
    fiz: {
      boo: [
        42,
        {
          baz: 'fizz',
          testFloat: 3.14,
        }
      ]
    },
  },
  '/html': '<html><head></head><body><h1>title</h1><div class="foo" rel="baz">bar</div></body></html>',

  '/value/42' : {
    status: 200,
    message: 'You did it!',
  },

};

var server = http.createServer(function incoming(req, res) {
  var response = data.default;

  if (data[req.url] !== undefined) {
    response = data[req.url];
  }

  res.setHeader('X-foo', 'bar');

  if (typeof response === 'object') {
    res.statusCode = response.status;

    return res.end(JSON.stringify(response));
  }

  return res.end(response);

});

server.listen(3000, function () {
  console.log('Listening on port 3000');

  console.log('Let\'s run tests');
  test.run( suite, test.outputCli, function(a, b){
    console.log('Done')
    server.close();
  }, function(a, b) {
    console.log('fail');
  });

});
