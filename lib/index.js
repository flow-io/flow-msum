/**
*
*      STREAM: moving sum
*
*
*      DESCRIPTION:
*         - Calculates the sum of streamed numeric data in a moving window of chosen size
*
*      NOTES:
*        
*
*      TODO:
*        
*
*      HISTORY:
*         - 2014/07/15: Created. [RJSmith]
*      
*      DEPENDENCIES:
*         [1] through
*
*      LICENSE:
*         MIT
*
*      Copyright (c) 2014.
* 
*
*      AUTHOR:
*         Rebekah Smith.       
*
*/

(function() {
    'use strict';

    // **MODULES** //

    var // through module 
       through = require( 'through' );

    // **FUNCTIONS** //

    /**
     * FUNCTION: getBuffer(W)
     * Returns a buffer array, each element pre-initialised to 0
     * 
     * @private
     * @param {number} W - buffer size
     * @returns {array} buffer
     */

    function getBuffer(W) {
	var buffer = new Array(W);
	for (var i = 0; i < W; i++) {buffer[i] = 0;}
	return buffer;
    } // end FUNCTION getBuffer()


    /**
     * FUNCTION: onData(W)
     * Invoked upon receiving new data
     * Returns a callback which calculates a moving sum
     *
     * @private
     * @param {number} W - window size
     * @returns {function} callback
     */

    function onData(W) {
	var buffer = getBuffer(W), 
	full = false, 
	dropVal,    // value leaving the buffer
	sum = 0,    // sum of values in buffer
	delta = 0,  // difference between buffer's new value and dropVal
	N = 0;      // buffer element


	/**
	 * FUNCTION: onData(newVal)
	 * data event handler. Calculates the moving sum.
	 *
	 * @private
	 * @param {number} newVal - new streamed data value
	 */

	return function onData(newVal) {
	    // Fill buffer of size W
	    if (!full) {
		buffer[N] = newVal; // set array element N to new data value

		sum += newVal;      // add newVal to running sum
		N += 1;             // increment N

		if (N===W) {        // check if W elements in buffer
		    full = true;
		    this.queue(sum);// add sum to output 
		}
		return;
	    } // buffer array size W filled

	    // Update buffer: drop old value, add new
	    dropVal = buffer.shift(); 
	    buffer.push(newVal);

	    // Calculate moving sum
	    delta = newVal - dropVal;
	    sum += delta;

	    // Queue current sum
	    this.queue(sum);

	}; // end FUNCTION onData(newVal)
    } // end FUNCTION onData(W)


    // **STREAM** //

    /**
     * FUNCTION: Stream()
     * Stream constructor
     *
     * @returns {object} Stream instance
     */

    function Stream() {
	this._window = 5; //default window size
	return this;
    } //end Stream() function


    /**
     * METHOD: window(value)
     * Set/get window size.
     *
     * @param {number} value - window size
     * @returns {object|number} instance object or window size
     */

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


    /**
     * METHOD: stream()
     * Returns a through stream for the moving sum
     */
    Stream.prototype.stream = function(){
	return through(onData(this._window));
    }; // end METHOD stream()


    // **EXPORTS** //

    module.exports = function createStream() {
	return new Stream();
    };

})();