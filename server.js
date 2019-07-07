const cors = require("cors");
const vhost = require("vhost");
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var ObjectId = require("mongodb").ObjectID;

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const url = "mongodb://localhost:27017";
const dbName = "map";
const client = new MongoClient(url);
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/nschneider.info/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/nschneider.info/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/nschneider.info/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.static(path.join(__dirname, "nschneider.info", "build")));
//app.use(express.static(path.join(__dirname, "orna.world", "build")));
app.use(vhost("nschneider.info", require("./nschneider.info/app")));
app.use(vhost("orna.world", require("./orna.world/app")));

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  app.post("/dbw", function(req, res) {
    res.send("Ok");
    db.collection("featureCollection").insertOne(req.body, function(
      err,
      result
    ) {
      if (err) {
        console.log(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

  app.post("/dbu", function(req, res) {
    db.collection("featureCollection").updateOne(
      { _id: ObjectId(req.body.id) },
      { $set: { coordinates: req.body.coordinates } },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.sendStatus(200);
        }
      }
    );
  });

  app.get("/dbr", function(req, res) {
    db.collection("featureCollection")
      .find()
      .toArray(function(err, data) {
        if (err) throw err;
        res.send(data);
      });
  });

  app.post("/dbd", function(req, res) {
    console.log(req.body.id)
    db.collection("featureCollection").deleteOne(
      { _id: ObjectId(req.body.id) },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.sendStatus(200);
        }
      }
    );
  });
});
// Starting both http & https servers

http
  .createServer(function(req, res) {
    res.writeHead(301, {
      Location: "https://" + req.headers["host"] + req.url
    });
    res.end();
  })
  .listen(80);

httpsServer.listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
