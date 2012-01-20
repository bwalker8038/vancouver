var express = require('express'),
    app  = express.createServer(),
    
    jade = require('jade'),
    BackboneDNode = require('backbone-dnode'),
    dnode = require('dnode'),
    redis = require('redis'),

    datastore = redis.createClient(),
    pub = redis.createClient(),
    sub = redis.createClient();

redis.debug_mode = false;

app.configure(function() {
  app.use(express.bodyParser())
  app.use(express.cookieParser())
  app.use(express.methodOverride())

  app.use(express.static(__dirname))
  app.use(express.static(__dirname + '/../../../node_modules/backbone-dnode/browser/'))
  app.use(express.static(__dirname + '/static'))

  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.set('view options', {
  layout: false
});


app.get('/', function(req,res) {
  res.render('index.jade')
});


app.listen(8000, function() {
  console.log("Express app running on port: " + app.address().port);
});


function errorHandler(client, conn) {
  conn.on('error', function(e) {
    console.log('Conn Error: ', e.stack)
  })  
};


dnode()
  .use(errorHandler)
  .use(BackboneDNode.pubsub())
  .use(BackboneDNode.crud({
    database: datastore
  }))
  .listen(app);
