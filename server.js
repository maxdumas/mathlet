var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var express = require('express');

var CLIENT_ID = '779474889021-s8k5l1dk1ncom768qvn28nlh6795b254.apps.googleusercontent.com',
    CLIENT_SECRET = 'OI3zKRY4LSTd5jtDFrXoqkAH',
    REDIRECT_URL = 'http://localhost:3000/authorize',
    SCOPE = 'https://www.googleapis.com/auth/drive.file';

var auth = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var url = auth.generateAuthUrl({ scope: SCOPE });

var app = express();

app.get('/', function(req, res, next) {
  if(!auth.credentials || Object.keys(auth.credentials).length === 0) {
    res.redirect(url);
  } else {
    next();
  }
});

app.use(express.static('public'));

app.get('/authorize', function (req, res) {
  var code = req.query.code;
  auth.getToken(code, function(err, tokens) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    auth.credentials = tokens;
    res.redirect('/');
    // upload();
  });
});

app.post('/save', function(req, res) {
  console.log('File saved!');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// var upload = function() {
//   var drive = google.drive({ version: 'v2', auth: auth });
//   drive.files.insert({
//     resource: {
//       title: 'My Document',
//       mimeType: 'text/plain'
//     },
//     media: {
//       mimeType: 'text/plain',
//       body: 'Hello World!'
//     }
// }, console.log);
// };
