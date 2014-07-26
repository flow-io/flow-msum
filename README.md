flow-msum
========

Transform stream which returns the sum within a moving window in a stream of numeric data.

## Installation

+ Clone flow-msum.
+ In top level of flow-msum directory,

```bash
$ npm install
```

## Examples

```javascript
// Required modules
var eventStream = require('event-stream');
var sumStream = require('flow-msum');

// Create array containing random numbers
var arSize = 50;
var randoms = [arSize];
for (var i = 0; i < arSize; i++) {
    randoms[i] = Math.floor(Math.random() * 100);
}

// Create readable stream from array
var randStream = eventStream.readArray(randoms);

// Create a new moving sum stream
var myStream = sumStream().stream();

// Pipe the data
randStream.pipe(myStream)
    .pipe(eventStream.map(function(d,clbk){
	clbk(null,d.toString()+' ');
    }))
    .pipe(process.stdout);
```

To run the example code from the top-level application directory,
```bash
$ node ./examples/index.js
```

## Tests

Unit tests use the Mocha test framework with Chai assertions.

Assuming you have globally installed Mocha, execute the following command in the top-level application directory to run the tests:
```bash
$ mocha
```

All new feature development should have corresponding unit tests to validate correct functionality. 

## License

MIT license.

## Copyright

Copyright © 2014.




