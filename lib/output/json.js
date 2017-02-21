
module.exports = {

	begin: function(plan){
		console.log('{ "plan": [');
	},

	end: function(plan){
		console.log(']}');
	},

	stats: function(plan){
		console.log('"stats": {}}');
	},

	inter: function( plan, offset ){
		if( offset < plan.tests.length ){
			console.log(',');
		}
	},

	show: function( test ){
		console.log( JSON.stringify( test, null, 2 ) );
	}
}
