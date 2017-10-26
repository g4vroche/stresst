
var clc = require('cli-color');


module.exports = {

	begin: function(plan){
		this.write("##########################################################");
		this.write("Running test suite: "+ plan.name );
	},

	end: function(plan){},

	inter: function( plan, offset ){},

	stats: function( stats ){

		var result = (stats.success? clc.green.bold('PASSED') : clc.red.bold("FAILED") );

		this.write("");
		this.write("");
		this.write("##########################################################");
		this.write("Test plan "+result);
		this.write("");
		this.write("Tested "+ clc.bold(stats.endpointscount) +" different endpoints, with "+ clc.bold(stats.calls) +" HTTP calls, validating "+ clc.bold(stats.asserts) +" assertions ");
		this.write("");
	},

	write: function(){
		console.log.apply( this, this.write.arguments );
	},


	show: function( test ){
		this.write("----------------------------------------------------------");
		this.write("");
		this.write( clc.bold( test.title ) );
		this.write("==========================================================");
		this.write( test.method+'/ '	+ test.uri);

		if ( test.asserts ){

			for (var i=0; i<test.asserts.length; i++){
				result = ( test.asserts[i].result ) ? clc.green.bold('OK') : clc.red.bold('FAIL');

				this.write( ' * '+ test.asserts[i].name +': '+ result );

				if( ! test.asserts[i].result ) {
					if ( test.asserts[i].debug ){
						this.write( '    Debug: ', JSON.stringify(test.asserts[i].debug) );
					}

					return;
				}
			}
		}
	}
};
