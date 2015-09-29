(function(){

	"use strict";

	var DATA = {};
	exports.getData			= getData;
	exports.setData			= setData;
	exports.getValue		= getValue;
	exports.getStorableVar	= getStorableVar;
	exports.setStorableVar	= setStorableVar;
	exports.setFragment		= setFragment;


	/**
	 * @return store value for path
	 */
	function getData(path){
		return getStorableVar(DATA, path);
	}


	/**
	 * Stores as a value at gien path
	 */
	function setData(path, value){
		setStorableVar( DATA, path, value );
	}


	/**
	 * Retrieves a value, either a value or a function was passed as parameter.
	 * Useful to generate values at runetime
	 */
	function getValue(value){
		if( typeof( value ) === 'function' ){
			value = value();
		}

		return value;
	}



	function getStorableVar(src, path){
		var val;

		if ( path === '.' ){
			return src;
		}

		try {
			eval('val = src["'+ path.split('.').join('"]["')+'"]');/* jshint ignore:line */
		} catch(e){
			val = undefined;
		}

		return val;
	}

	function setStorableVar(dest, path, value){
		var parts = path.split('.'),
			cumul = [];

		for(var i in parts){
			cumul.push(parts[i]);

			if ( dest[parts[i]] === undefined ) {
				setFragment(dest, cumul, {});
			}
		}

		setFragment(dest, parts, value);

		return value;
	}

	function setFragment(dest, parts, value){

		var code = 'dest["'+ parts.join('"]["')+'"] = value;';
		
		eval( code );/* jshint ignore:line */

		return value;
	}

}());