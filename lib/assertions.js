(function(){

  "use strict";

  var ds = require('./datastore.js');
  var utils = require('./utils.js');
  var cheerio = require('cheerio');


  /**
   * Checks status code
   * @param int expected A HTTP status code
   */
 exports.httpStatusIs = httpStatusIs;


function setName(test, name){
  if(!test.name) {
    test.name = name;
  }
}

 function httpStatusIs( expected ){

    return function( response, body ){

      setName(this, "HTTP status code is «"+ expected+"»");
      expected = utils.getValue( expected );

      var code = parseInt(response.statusCode, 10),
        result = code  === expected;

      if ( ! result ){
        /*jshint validthis:true */
        this.debug = {expected: expected, actual: code, data: body};
      }

      return result;
    };
  };


  exports.headerIsEqual = function(name, expected) {
    return function( response, body ) {
      setName(this, "HTTP header «"+name+"» value is «"+ expected+"»");
      expected = utils.getValue( expected );
      var actual = response.headers[name];

      var result = (actual === expected);

      if ( ! result ){
        /*jshint validthis:true */
        this.debug = {expected: expected, actual: actual, data: response.headers};
      }

      return result;
    };
  };


  exports.isJSON = function(){

    return function( response, body ){

      setName(this, "body is a JSON object");

      try{
        return ( typeof JSON.parse( body ) == 'object' );
      } catch(e){
        this.debug = {body: body};
        return false;
      }
    }
  };


  /**
   * Checks a given `key path` value against an expectation
   * @param String path String representation of how you would acces the property
   *  eg: myobject.property.sub_property
   * @param Mixed expected
   */
  function compareValue(compareFunction, autoName, path, expected) {
    return function(response, body) {
      setName(this, "["+ path+"] is "+autoName+" «"+ expected.toString()+"»")

      expected = utils.getValue( expected );

      var oBody = JSON.parse(body);
      var actual = utils.getPathValue(oBody, path);
      var result = compareFunction(actual, expected);

      if( ! result ){
        this.debug = {expected: expected, actual: actual, data: oBody};
      }

      return result;
    }
  }

  exports.isNotEqual = function(path, expected) {
    return compareValue(
      (a, b) => a !== b,
      'greater than',
      path,
      expected
    );
  }

  exports.isEqual = function(path, expected) {
    return compareValue(
      (a, b) => a === b,
      'greater than',
      path,
      expected
    );
  }

  exports.lowerThan = function(path, expected) {
    return compareValue(
      (a, b) => a < b,
      'lower than',
      path,
      expected
    );
  }

  exports.greaterThan = function(path, expected) {
    return compareValue(
      (a, b) => a > b,
      'greater than',
      path,
      expected
    );
  }

  /**
   * Checks if response JSON contains the given key path
   * (even if the value is null or false)
   * @param String path
   */
  exports.hasKey = function( path  ){

    return function( response, body ){
      setName(this, "has key «"+ path+"»" );

      var oBody = JSON.parse(body);
      var result = utils.getPathValue(oBody, path);

      if( result === undefined ){
        this.debug = {expected: path, found: utils.getPathValue(oBody, path), data: oBody};
        return false;
      }

      return true;
    };
  };



  /**
   * Checks if given path is of expected type
   * @param String path
   * @param String type String reprensentation of the type
   * @TODO Rename this assertion ?
   */
  exports.isOfType = function( path, expected  ){

    return function( response, body ){
      setName(this, "["+ path+"] is of type «"+ expected+"»");

      expected = utils.getValue( expected );

      var oBody = JSON.parse(body);
      var value = utils.getPathValue(oBody, path);

      var actual = typeof(value);
      var result = ( actual === expected );

      if( ! result ){
        this.debug = {expected: expected, actual: actual, data: oBody};
      }

      return result;
    };
  };


  /**
   * Checks array length...
   * @param String path
   * @param Int length
   * @TODO Rename this assertion ?
   */
  exports.arrayLengthIs = function(path, length){

    return function( response, body ){

      setName(this, "length of ["+ path+"] is equal to «"+ length +"»");

      var value = JSON.parse(body);

      if ( path ) {
        value = utils.getPathValue(value, path);
      }

      if (value.length === length ) {
        return true;
      } else {
        this.debug = {expected: length, actual: value.length, data: value};
        return false;
      }
    };
  };

  /**
   * Checks if an array at path contains execpted value
   * @param String path
   * @param Mixed value
   * @TODO Rename this assertion ?
   */
  exports.arrayHasValue = function( path, value ){

    return function( response, body ){
      setName(this, "["+ path+"] has value «"+ expected.toString()+"»");

      var data = JSON.parse(body);
      var value = utils.getValue( value );

      data = utils.getPathValue(data, path);

      for ( var key in data ){
        if ( data[key] == value ){
          return true;
        }
      }

      this.debug = {expected: value, actual: null, data: data};
      return false;
    };
  };

  /**
   * Checks if an array at path does NOT contain (un)execpted value
   * @param String path
   * @param Mixed value
   * @TODO Rename this assertion ?
   */
  exports.arrayDontHaveValue = function( path, value ){
    return function( response, body ){
      setName(this, "["+ path+"] don't have value «"+ expected.toString()+"»");
      var data = JSON.parse(body);
      var value = utils.getValue( value );

      data = utils.getPathValue(data, path);

      for ( var key in data ){
        if ( data[key] == value ){
          this.debug = {expected: value, actual: value, data: data};
          return false;
        }
      }
      return true;
    };
  };

  exports.selectorValueIs = function(selector, expected) {
    return function( response, body ) {
      setName(this, "Selector `"+ selector +"` has value «"+ expected.toString()+"»");
      var $ = cheerio.load(body);
      expected = utils.getValue( expected );

      if (typeof selector === 'function') {
        var actual = selector($);
      } else {
        var actual = $(selector).text();
      }

      console.log(actual+ ' === '+ expected);

      var result = (actual === expected);

      if( ! result ){
        this.debug = {expected: expected, actual: actual, data: body};
      }

      return result;
    };
  }

}());
