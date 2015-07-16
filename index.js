var app = require('./lib/app.js');

app.listen(3000);
app.setProxyUrl('https://google.de');

console.log("Server is listening on Port: ", 3000);

module.exports.app;
