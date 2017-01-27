var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var db;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(urlencodedParser);
app.use(bodyParser.json());
//app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public"));

app.use(function (req, res, next) {
  console.log(req.headers);
  console.log(req.body);
  next();
})

MongoClient.connect("mongodb://localhost:27017/sensor_test", function(err, connection) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  
  db = connection;

  app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
  });

});

app.get('/', function (req, res) {
  cursor = db.collection('sensors').find({}).sort({time: -1}).limit(10);
  
  var text = 'Last 10 sensor measurings: <br>\n'
  
  cursor.each( function(err, item) {
    //assert.equal(err, null);
    if (item != null) { 
      time = new Date(item.time);
      substring = "Sensor: " + item.sensor + "  ::  " + time.getDate() + "-" + time.getMonth()+1 + "-" + time.getFullYear() + " " +
                  time.getHours() + ":" + time.getMinutes() +
                  "  ::  " + item.temperature + " C; " + item.humidity + " % <br>\n"
      text += substring  
    } else {
        res.send(text);
    }
  });
});

app.get('/api/sensors', function (req, res) {
  if (req.body.sensor == "get") {

  } else {
    var docs = []
    cursor = db.collection('sensors').find({}); // .find({sensor: req.body.sensor}).sort({time: 1});
    cursor.each( function(err, item) {
      if (item != null) { 
        time = new Date(item.time);
        time_text = time.getDate() + "-" + time.getMonth()+1 + "-" + time.getFullYear() + " " +
                  time.getHours() + ":" + time.getMinutes();
        item.time = time_text;
        docs.push(item);
        console.log(item);
      } else {
        res.send(docs);
      }
    });
  }
});

app.post('/sensors', function (req, res) {
  db.collection('sensors').insert({
    "sensor": req.body.sensor,
    "temperature": req.body.temp,
    "humidity": req.body.humi,
    "time": new Date()
  }, function(err, records) {
       console.log(err);
       console.log(records);
  });
  //console.log(db.getLastError());
  res.send("yay");
});

