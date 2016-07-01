
var stresst      = require('stresst');
var fs = require('fs');
var path = require('path');
var suite_file = process.argv[2];
var output_type = (process.argv[3] ? process.argv[3] : 'cli');


if( fs.lstatSync(suite_file).isDirectory() ) {

  fs.readdir( suite_file, function(err, files){
    runMultiSuite( suite_file, files );
  });

} else{
  runSuite( suite_file, output_type );
}


function runMultiSuite( suite_path, suiteFileList ){

  file = suiteFileList.shift();

  if (file.indexOf( 'suite.js' ) > -1 ){
    filePath = path.normalize( suite_path +'/' + file );
    
    console.log( filePath );

    runSuite( filePath , output_type, function(){
      console.log('run suite Callback');
      console.log( suite_path );

      if ( suiteFileList.length > 0 )  {
        runMultiSuite( suite_path, suiteFileList );
      }
    } );
  } else if ( suiteFileList.length > 0 ) {
    runMultiSuite( suite_path, suiteFileList );
  }
}


function runSuite( file , output_type, callback){

  var  suite = require( './'+ file ).suite;


  var output;
  switch ( output_type ) {
    case 'json':
      output = stresst.outputJSON;
    break; 

    default:
      output = stresst.outputCli;
    break;
    
  }

  stresst.run( suite, output, callback );
}

