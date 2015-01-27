var read   = require('./Reader');
var write  = require('./Writter');


var config = {
  url:  process.env.URL   || 'challenge2.airtime.com',
  port: process.env.PORT  || 2323,
  user: process.env.USER  || 'alnavarro@gmail.com',
}

reader( config.url, config.port, config.port ).then( writter );
