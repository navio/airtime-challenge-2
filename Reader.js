module.exports =

function reader(data) {

  var output_file = new Buffer(0);

  valid_packages = generateValidPackages(data);

  output_file = valid_packages.join('');

  require('fs').writeFileSync('ubiquity.raw', output_file);

  console.log("%s packages found", Object.keys(valid_packages).length);

};

function generateValidPackages(data){

  var valid_packages = [];

  for(location = 0; location < data.length; location += 12 + LEN ){

    var SEQ  = data.slice(location, location + 4); // 0 to

    var CHK  = data.slice(location + 4, location + 8);

    var LEN  = data.readInt32BE(location + 8);

    var PCM  = data.slice(location + 12, location + 12 + LEN);

    if ( verifyChecksum(SEQ, CHK, PCM) ) valid_packages.push(PCM);
  }

  return valid_packages;

}


function verifyChecksum(SEQ, CHK, DATA) {

  var SQC = new Buffer(4);

  SEQ.copy(SQC);

  for(var i = 0; i < DATA.length; i+=4) {

    var slice = DATA.slice(i, i+4);

    var correction = new Buffer([171, 171, 171, 171]);

    for(var j = 0; j < slice.length; ++j) correction[j] = slice[j];

    for(var k = 0; k < 4; ++k) SQC[k] = SQC[k] ^ correction[k];

  };

  return SQC.readInt32BE(0) == CHK.readInt32BE(0);
}
