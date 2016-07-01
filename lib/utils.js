(function(){

	exports.getValue     = getValue;
	exports.getPathValue = getPathValue;
	exports.setPathValue = setPathValue;

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


	/**
	 * Retrieve a property vith object notation as dynamic string
	 */
	function getPathValue(src, path){
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


	/**
	 * Set a property vith object notation as dynamic string
	 */
	function setPathValue(dest, path, value){
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