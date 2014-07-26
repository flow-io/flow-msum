
// MODULES //

var chai = require('chai'),          // Expectation library
    utils = require('./utils'),      // Test utilities
    sumStream = require('./../lib'); // Module to be tested

// VARIABLES //

var expect = chai.expect,
    assert = chai.assert;

// TESTS //

describe('moving sum', function tests() {
    'use strict';

    // Test 1
    it('should export a factory function', function test() {
		expect(sumStream).to.be.a('function');
    });

    // Test 2
    it('should provide a method to set/get the window size', function test() {
		var tStream = sumStream();
		expect(tStream.window).to.be.a('function');
    });

    // Test 3
    it('should set the window size', function test() {
		var tStream = sumStream();
		tStream.window(42);
		assert.strictEqual(tStream.window(),42);
    });

    // Test 4
    it('should not allow a non-numeric window size', function test() {
		var tStream = sumStream();

		expect( badValue('5') ).to.throw(Error);
		expect( badValue([]) ).to.throw(Error);
		expect( badValue({}) ).to.throw(Error);
		expect( badValue(null) ).to.throw(Error);
		expect( badValue(undefined) ).to.throw(Error);
		expect( badValue(NaN) ).to.throw(Error);
		expect( badValue(false) ).to.throw(Error);
		expect( badValue(function(){}) ).to.throw(Error);

		function badValue(value) {
			return function() {
				tStream.window(value);
			};
		}
    }); //end non-numeric window

    // Test 5
    it('should calculate the sum of the data in the window', function test(done) {
		var data, expected, tStream, WINDOW = 5;

		// Simulate some data
		data = [1,1,2,2,3,3,4,4,5,5,6,6];

		// Expected values of sum in moving window
		expected = [9,11,14,16,19,21,24,26];

		// Create a new sum stream
		tStream = sumStream()
			.window(WINDOW)
			.stream();

		// Mock reading from the stream
		utils.readStream(tStream,onRead);

		// Mock piping to the stream
		utils.writeStream(data,tStream);

		return;

		/**
		 * FUNCTION: onRead(error, actual)
		 * Read event handler. Checks for errors. Compares streamed and expected data.
		 */
		function onRead(error,actual) {
			expect(error).to.not.exist;

			assert.lengthOf(actual,data.length-WINDOW+1);

			for ( var i = 0; i < expected.length; i++ ) {
				assert.closeTo( actual[i], expected[i], 0.001 );
			}

			done();

		} // end FUNCTION onRead
    });

    // Test 6
    it('should calculate the sum of piped data using an arbitrary window size', function test(done) {
		var data, expected, tStream, WINDOW = 3;

		// Simulate some data
		data = [1,1,2,2,3,3,4,4,5,5,6,6];

		// Expected values of sum in moving window
		expected = [4,5,7,8,10,11,13,14,16,17];

		// Create a new sum stream
		tStream = sumStream()
			.window(WINDOW)
			.stream();

		// Mock reading from the stream
		utils.readStream(tStream,onRead);

		// Mock piping to the stream
		utils.writeStream(data,tStream);

		return;

		/**
		* FUNCTION: onRead(error, actual)
		* Read event handler. Check for errors. Compare streamed and expected data.
		*/
		function onRead(error,actual) {
			expect(error).to.not.exist;

			assert.lengthOf(actual,data.length-WINDOW+1);

			for ( var i = 0; i < expected.length; i++ ) {
				assert.closeTo( actual[i], expected[i], 0.001 );
			}

			done();
		} // end FUNCTION onRead()
	});

}); //end test descriptions

