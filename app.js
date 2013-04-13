



var app = require('./scheduler');
app.listen(3001);
console.log("Express server listening on port %d in %s mode", app.port, app.settings.env);
