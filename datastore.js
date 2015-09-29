(function(){

	"use strict";

	var utils = require('./utils.js');
	var DATA  = {};

	exports.getData			= getData;
	exports.setData			= setData;


	/**
	 * @return store value for path
	 */
	function getData(path){
		return utils.getPathValue(DATA, path);
	}


	/**
	 * Stores as a value at given path
	 */
	function setData(path, value){
		return utils.setPathValue(DATA, path, value);
	}



}());