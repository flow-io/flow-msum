var eventStream = require('event-stream'),
	sumStream = require('./../lib');

// Create an array containing random numbers:
var randoms = new Array( 50 );
for (var i = 0; i < randoms.length; i++) {
    randoms[i] = Math.floor(Math.random() * 100);
}

// Create a readable stream from an array:
var randStream = eventStream.readArray(randoms);

// Create a new moving-sum stream:
var myStream = sumStream()
	.window(7)
	.stream();

// Pipe the data:
randStream.pipe(myStream)
    .pipe(eventStream.map(function(d,clbk){
		clbk(null,d.toString()+'\n');
    }))
    .pipe(process.stdout);