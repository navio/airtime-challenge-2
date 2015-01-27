var messenger = require('./Messenger');
var reader  = require('./Reader');


var config = {
  url: process.env.URL || 'challenge2.airtime.com',
  port: process.env.PORT || 2323,
  user: process.env.USER || 'alnavarro@gmail.com',
  file: process.env.FILE || 'file.raw'
}

messenger( config.url, config.port, config.port ).then( reader );
