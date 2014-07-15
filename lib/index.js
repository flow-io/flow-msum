(function() {
    'use strict';

// REQUIRED MODULES //

var // through module 
through = require( 'through' );

// FUNCTIONS //

// **getBuffer(W)**
// create buffer array, size W, to hold section of stream to operate on
// pre-initialize elements to zero

    function getBuffer(W) {
	var buffer = new Array(W);
	for (var i = 0; i < W; i++) buffer[i] = 0;
	return buffer;
    } //end getBuffer

// **onData(W)**
// calculates moving sum, invoked on receiving new data

    function onData(W) {
	var buffer = getBuffer(W), 
	full = false, dropVal,
	sum = 0, delta = 0, N = 0; 

	// **onData(newVal)** (within onData(W))
	// calculates sum of values in moving window (buffer array)

	return function onData(newVal) {
	    // Initial filling of buffer array (continue until W elements filled)
	    if (!full) {
		buffer[N] = newVal; //set array element N to new data value

		sum += newVal; //add newVal to running sum
		N += 1; //increment N

		if (N===W) { //stop once W elements added to buffer
		    full = true;
		    this.queue(sum); // 
		}
		return;
	    } // buffer array width W filled

	    // Update buffer: drop old value, add new
	    dropVal = buffer.shift(); //drop current first element, label
	    buffer.push(newVal); // add element containing newVal to end of array
	    // Calculate moving sum
	    delta = newVal - dropVal; // find diff between new element and dropped one 
	    sum += delta; // i.e. sum = sum - dropped + new
	    // Queue value
	    this.queue(sum);

	};//end onData(newVal) function
    }//end onData(W) function

// STREAM //

// **Stream()**
// Stream constructor

    function Stream() {
	this._window = 5; //default window size
	return this;
    } //end Stream() function


// **METHOD** window(value)
// Set window size if value provided. Return window size if not provided.
    Stream.prototype.window = function(value) {
	if (!arguments.length) {
	    return this._window;
	}
	if(typeof value !== 'number' || value !== value) {
	    throw new Error('window()::invalid input argument. Window must be numeric.');
	}
	this._window = value;
	return this;
    }; // end METHOD window()

// **METHOD** stream()
// Returns a through stream for calc the moving sum.
    Stream.prototype.stream = function(){
	return through(onData(this._window));
    }; // end METHOD stream()

// **EXPORTS**

    module.exports = function createStream() {
	return new Stream();
    };

})();