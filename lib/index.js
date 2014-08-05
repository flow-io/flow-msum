/**
*
*      STREAM: moving sum
*
*
*      DESCRIPTION:
*            - Transform stream which calculates a sliding-window sum (moving-sum) over a numeric data stream.
*
*
*      NOTES:
*           [1]
*
*
*      TODO:
*           [1]
*
*
*      HISTORY:
*           - 2014/07/15: Created. [RJSmith].
*
*
*      DEPENDENCIES:
*           [1] through2
*
*
*      LICENSE:
*           MIT
*
*
*      Copyright (c) 2014. Rebekah Smith.
* 
*
*      AUTHOR:
*           Rebekah Smith. rebekahjs17@googlemail.com. 2014. 
*
*/

(function() {
    'use strict';

    // MODULES //

    var through2 = require( 'through2' );
    

    // FUNCTIONS //

    /**
    * FUNCTION: getBuffer(W)
    *   Returns a buffer array, each element pre-initialized to 0.
    * 
    * @private
    * @param {Number} W - buffer size
    * @returns {Array} buffer
    */
    function getBuffer(W) {
        var buffer = new Array(W);
        for (var i = 0; i < W; i++) {
            buffer[i] = 0;
        }
        return buffer;
    } // end FUNCTION getBuffer()

    /**
    * FUNCTION: onData(W)
    *   Returns a callback which calculates a moving sum when invoked upon receiving new data.
    * 
    * @private
    * @param {Number} W - window size
    * @returns {Function} callback
    */
    function onData(W) {
        var buffer = getBuffer(W),
            full = false,
            dropVal,
            sum = 0,
            delta = 0,
            N = 0;

        /**
        * FUNCTION: onData(newVal, encoding, clbk)
        *   Data event handler. Calculates the moving sum.
        *
        * @private
        * @param {Number} newVal - streamed data value
        * @param {String} encoding
        * @param {Function} clbk - callback to invoke after finding a sum. Function accepts two arguments: [ error, chunk ].
        */
        return function onData(newVal, encoding, clbk) {
            // Fill buffer of size W
            if (!full) {
                buffer[N] = newVal;

                sum += newVal;
                N += 1;

                if (N===W) {
                    full = true;
                    this.push(sum);
                }
                clbk();
                return;
            }

            // Update buffer: (drop old value, add new)
            dropVal = buffer.shift();
            buffer.push(newVal);

            // Calculate moving sum:
            delta = newVal - dropVal;
            sum += delta;

            clbk(null, sum);
        }; // end FUNCTION onData(newVal)
    } // end FUNCTION onData(W)


    // STREAM //

    /**
    * FUNCTION: Stream()
    * Stream constructor
    *
    * @constructor
    * @returns {Stream} Stream instance
    */
    function Stream() {
        this._window = 5;
        return this;
    } //end FUNCTION Stream()

    /**
    * METHOD: window(value)
    *   Windows size setter/getter. If a value is provided, sets the window size. If no value is provided, returns the window size.
    *
    * @param {Number} value - window size
    * @returns {Stream|Number} stream instance or window size
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
    *   Returns a through stream which calculates a sliding-window sum.
    * 
    * @returns {object} through stream 
    */
    Stream.prototype.stream = function(){
        return through2({'objectMode': true}, onData(this._window));
    }; // end METHOD stream()


    // EXPORTS //

    module.exports = function createStream() {
        return new Stream();
    };

})();