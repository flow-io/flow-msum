// Required modules
var eventStream = require('event-stream');
var sumStream = require('./lib');

// Create array containing random numbers
var arSize = 50;
var randoms = [arSize];
for (var i = 0; i < arSize; i++) {
    randoms[i] = Math.floor(Math.random() * 100);
}

// Create readable stream from array
var randStream = eventStream.readArray(randoms);

// Create a new moving-sum stream, specify a window size
var myStream = sumStream().window(7).stream();

// Pipe the data
randStream.pipe(myStream)
    .pipe(eventStream.map(function(d,clbk){
	clbk(null,d.toString()+' ');
    }))
    .pipe(process.stdout);