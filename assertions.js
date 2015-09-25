

(function(){

	"use strict";
	
var ds = require('./datastore.js');


exports.httpStatusIs = function( expected ){

	return function( response, body ){
		expected = ds.getValue( expected );

		var code = parseInt(response.statusCode, 10),
			result = code  === expected;

		if ( ! result ){
			/*jshint validthis:true */
			this.debug = {expected: expected, actual: code, data: body};
		}

		return result;
	};
};


exports.isJSON = function( response, body ){
	try{
		return ( typeof JSON.parse( body ) == 'object' );
	} catch(e){
		this.debug = {body: body};
		return false;
	}
	
};

exports.JsonEqual = function( path, expected  ){
		
	return function( response, body ){
		expected = ds.getValue( expected );

		oBody = JSON.parse(body);
		actual = ds.getStorableVar(oBody, path);

		result = ( actual === expected );

		if( ! result ){
			this.debug = {expected: expected, actual: actual, data: oBody};
		}

		return result;
	};
};



exports.JsonNotEqual = function( path, unexpected ){
	return function( response, body ){
		unexpected = ds.getValue( unexpected );
	
		oBody = JSON.parse(body);
		actual = ds.getStorableVar(oBody, path);

		result = ( actual !== unexpected );

		if( ! result ){
			this.debug = {unexpected: unexpected, actual: actual, data: oBody};
		}

		return result;
	};
};

exports.JsonHas = function( path  ){

	return function( response, body ){

		oBody = JSON.parse(body);
		result = ds.getStorableVar(oBody, path);

		if( result === undefined ){
			this.debug = {expected: path, found: ds.getStorableVar(oBody, path), data: oBody};
			return false;
		}

		return true;
	};
};


exports.JsonType = function( path, expected  ){

	return function( response, body ){
		expected = ds.getValue( expected );

		oBody = JSON.parse(body);
		value = ds.getStorableVar(oBody, path);

		actual = typeof(value);

		result = ( actual === expected );

		if( ! result ){
			this.debug = {expected: expected, actual: actual, data: oBody};
		}

		return result;
	};
};


exports.ArrayLength = function( length, path ){

	return function( response, body ){
		length = ds.getValue( length );

		value = JSON.parse(body);
		if ( path ) {
			value = ds.getStorableVar(value, path);
		}

		if (value.length === length ) {
			return true;
		} else {
			this.debug = {expected: length, actual: value.length, data: value};
			return false;
		}
	};
};

exports.JsonContains = function( path, value ){
	return function( response, body ){
		var data = JSON.parse(body);

		value = ds.getValue( value );

		data = ds.getStorableVar(data, path);

		for ( var key in data ){
			if ( data[key] == value ){
				return true;
			}
		}

		this.debug = {expected: value, actual: null, data: data};
		return false;
	};
};

exports.JsonNotContains = function( path, value ){
	return function( response, body ){
		var data = JSON.parse(body);
		value = ds.getValue( value );
		data = ds.getStorableVar(data, path);

		for ( var key in data ){
			if ( data[key] == value ){
				this.debug = {expected: value, actual: value, data: data};
				return false;
			}
		}
		return true;
	};
};

}());