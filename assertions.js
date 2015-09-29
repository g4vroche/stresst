(function(){

  "use strict";

  var ds = require('./datastore.js');
  var utils = require('./utils.js');


  /**
   * Checks status code
   * @param int expected A HTTP status code
   */
  exports.httpStatusIs = function( expected ){

    return function( response, body ){
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


  exports.isJSON = function( response, body ){
    try{
      return ( typeof JSON.parse( body ) == 'object' );
    } catch(e){
      this.debug = {body: body};
      return false;
    }
  };


  /**
   * Checks a given `key path` value against an expectation
   * @param String path String representation of how you would acces the property
   *  eg: myobject.property.sub_property
   * @param Mixed expected
   */
  exports.JsonEqual = function( path, expected  ){
      
    return function( response, body ){
      expected = utils.getValue( expected );

      var oBody = JSON.parse(body);
      var actual = utils.getPathValue(oBody, path);

      var result = ( actual === expected );

      if( ! result ){
        this.debug = {expected: expected, actual: actual, data: oBody};
      }

      return result;
    };
  };


  /**
   * Checks a given `key path` value is NOT equal to an (un)expectation
   * @param String path String representation of how you would acces the property
   *  eg: myobject.property.sub_property
   * @param Mixed unexpected
   */
  exports.JsonNotEqual = function( path, unexpected ){
    return function( response, body ){
      unexpected = utils.getValue( unexpected );
    
      var oBody = JSON.parse(body);
      var actual = utils.getPathValue(oBody, path);

      var result = ( actual !== unexpected );

      if( ! result ){
        this.debug = {unexpected: unexpected, actual: actual, data: oBody};
      }

      return result;
    };
  };

  /**
   * Checks if response JSON contains the given key path
   * (even if the value is null or false)
   * @param String path
   */
  exports.JsonHas = function( path  ){

    return function( response, body ){

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
  exports.JsonType = function( path, expected  ){

    return function( response, body ){
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
   * @param Int length
   * @param String path
   * @TODO : Parameters order doesn't match others assertions
   * @TODO Rename this assertion ?
   */
  exports.ArrayLength = function( length, path ){

    return function( response, body ){
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
  exports.JsonContains = function( path, value ){
    return function( response, body ){
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
  exports.JsonNotContains = function( path, value ){
    return function( response, body ){
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

}());