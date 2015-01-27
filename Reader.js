
var net = require('net');
var Q   = require("q");

module.exports =

function(url,port,user){
  var deferred   = Q.defer();
  var connection = new net.Socket();
  var buffer     = new Buffer(0, 'binary');

  connection.connect(port,url);

  connection.on('data', function(data) {

    var array_data = data.toString().split(":");

    if(array_data[0] === 'WHORU' ){  // "IAM:<challenge number>:<user email address>:at\n"
      connection.write( ['IAM', array_data[1].replace(/\n/gi, '') , user ,'at'].join(':') + "\n" );
      return;
    }

    if (array_data[0] === 'SUCCESS' ) return;// Dismiss PKG, start transfer.

    buffer = Buffer.concat([buffer, new Buffer(data, 'binary')]);


  });

  connection.on('end', function(data) {
    console.log('File Transmited, size:', buffer.length);
    deferred.resolve(buffer);
  })

  return deferred.promise;

}
