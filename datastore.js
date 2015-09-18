var DATA = {};
exports.getData			= getData;
exports.getValue		= getValue;
exports.store 			= store;
exports.getStorableVar	= getStorableVar;
exports.setStorableVar	= setStorableVar;
exports.setFragment 	= setFragment;


function getData(key){
	return getStorableVar(DATA, key);
}


function getValue(value){
	if( typeof( value ) === 'function' ){
		value = value();
	}

	return value;
}

function setData(key, value){
	setStorableVar( DATA, key, value );
}

function store(req, response, body){

	var data = JSON.parse(body);

	for(var i=0; i<req.store.length; i++){

		setData( req.store[i].dest, getStorableVar(data, req.store[i].src) )
	}	
}

function getStorableVar(src, path){
	var val;

	if ( path === '.' ){
		return src;
	}

	try {
		eval('val = src["'+ path.split('.').join('"]["')+'"]');
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

	eval( code );  // jshint ignore:line

	return value;
}
