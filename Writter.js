module.exports =

function reader(data,file) {

  var output = new Buffer(0);

  packages  = generateValidPackages(data);

  for(key in Object.keys(packages))
    output = Buffer.concat([output, packages[key]]);

  require('fs').writeFileSync('Message.raw', output);

  console.log("Message Saved");

};

function generateValidPackages(data){

  var valid_packages = [];

  for(location = 0; location < data.length; location += 12 + LEN ){

    var SEQ  = data.slice(location, location + 4); // 0 to 4
    var CHK  = data.slice(location + 4, location + 8); // 4 to 8
    var LEN  = data.readInt32BE(location + 8); // 8 Value
    var PCM  = data.slice(location + 12, location + 12 + LEN); // The actual data.

    if ( verifyChecksum(SEQ, CHK, PCM) ) valid_packages[SEQ.readInt32BE(0)] = PCM;;
  }

  return valid_packages;

}


function verifyChecksum(SEQ, CHK, DATA) {

  var SQC = new Buffer(4);  SEQ.copy(SQC); // Force copy 4 bytes.

  for(var i = 0; i < DATA.length; i += 4) {

    var slice = DATA.slice(i, i + 4);
    var correction = new Buffer([171, 171, 171, 171]); // 0xAB --> 171 Decimal

    for(var a = 0; a < slice.length; ++a)
      correction[a] = slice[a];

    for(var b = 0; b < 4; ++b)
      SQC[b] = SQC[b] ^ correction[b]; // XOR'ing

  };

  return SQC.readInt32BE(0) == CHK.readInt32BE(0);

}
