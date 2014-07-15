
// REQUIRED MODULES //

var // Expectation library:
chai = require('chai'),
utils = require('./utils'), // test utilities
mStream = require('./../lib'); // to be tested

// VARIABLES //

var expect = chai.expect,
assert = chai.assert;

// TESTS //

describe('msum', function tests() {
    'use strict';

// Test 1
    it('should export a factory function', function test() {
	expect(mStream).to.be.a('function');
    });

// Test 2
    it('should provide a method to get the window size', function test() {
	var tStream = mStream();
	expect(tStream.window()).to.be.a('number'); //why not mStream.window()
    });

// Test 3
    it('should provide a method to set the window size', function test() {
	var tStream = mStream();
	tStream.window(42);
	assert.strictEqual(tStream.window(),42);
    });

// Test 4
    it('should not allow a non-numeric window size', function test() {
	var tStream = mStream();

	expect( badValue('5') ).to.throw(Error); // q
	expect( badValue([]) ).to.throw(Error); 
	expect( badValue({}) ).to.throw(Error); 
	expect( badValue(null) ).to.throw(Error); 
	expect( badValue(undefined) ).to.throw(Error); 
	expect( badValue(NaN) ).to.throw(Error); 
	expect( badValue(false) ).to.throw(Error);

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
	// Expected values of rolling sum in window
	expected = [9,11,14,16,19,21,24,26];
	// Create a new sum stream
	tStream = mStream()
	    .window(WINDOW)
	    .stream();
	// Mock reading from the stream
	utils.readStream(tStream,onRead);
	// Mock piping a data to the stream
	utils.writeStream(data,tStream);

	return;

	// **Function** onRead: check for errors, comp streamed data to exp data
	function onRead(error,actual) {
	    expect(error).to.not.exist;

	    assert.lengthOf(actual,data.length-WINDOW+1);
	    assert.closeTo( actual[0], expected[0], 0.001);
	    assert.closeTo( actual[1], expected[1], 0.001);
	    assert.closeTo( actual[2], expected[2], 0.001);
	    assert.closeTo( actual[3], expected[3], 0.001);
	    assert.closeTo( actual[4], expected[4], 0.001);
	    assert.closeTo( actual[5], expected[5], 0.001);
	    assert.closeTo( actual[6], expected[6], 0.001);
	    assert.closeTo( actual[7], expected[7], 0.001);

	    done();

	} //end onRead

    }); //end sum test

// Test 6
    it('should calc sum of piped data in arb window size', function test(done) {

	var data, expected, tStream, WINDOW = 3;

	// Simulate some data
	data = [1,1,2,2,3,3,4,4,5,5,6,6];
	// Expected values of rolling sum in window
	expected = [4,5,7,8,10,11,13,14,16,17];
	// Create a new sum stream
	tStream = mStream()
	    .window(WINDOW)
	    .stream();
	// Mock reading from the stream
	utils.readStream(tStream,onRead);
	// Mock piping a data to the stream
	utils.writeStream(data,tStream);

	return;

	// **Function** onRead: check for errors, comp streamed data to exp data
	function onRead(error,actual) {
	    expect(error).to.not.exist;

	    assert.lengthOf(actual,data.length-WINDOW+1);
	    assert.closeTo( actual[0], expected[0], 0.001);
	    assert.closeTo( actual[1], expected[1], 0.001);
	    assert.closeTo( actual[2], expected[2], 0.001);
	    assert.closeTo( actual[3], expected[3], 0.001);
	    assert.closeTo( actual[4], expected[4], 0.001);
	    assert.closeTo( actual[5], expected[5], 0.001);
	    assert.closeTo( actual[6], expected[6], 0.001);
	    assert.closeTo( actual[7], expected[7], 0.001);
	    assert.closeTo( actual[8], expected[8], 0.001);
	    assert.closeTo( actual[9], expected[9], 0.001);

	    done();
	} //end onRead
    }); //end any window size test

      }); //end description of tests

