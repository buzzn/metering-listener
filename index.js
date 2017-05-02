'use strict';
require('dotenv').config()
var extend = require('util')._extend
const mqtt = require('mqtt')
const MongoClient = require('mongodb').MongoClient
const time = require('time');
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_HOST)

mqttClient.on('connect', function () {
  mqttClient.subscribe(process.env.MQTT_TOPIC)
})

MongoClient.connect(process.env.MONGODB_HOST, function(err, db) {
  console.log("Connected correctly to server");
  mqttClient.on('message', (topic, message) => {
    try {

      let json = extend(JSON.parse(message.toString()),{timestamp: time.time()})
      insertDocuments(json, db, console.log);
    } catch (e) {
      console.log("not JSON");
    }
  })
});


let insertDocuments = (message, db, callback) => {
  const collection = db.collection(process.env.MONGODB_COLLECTION);
  collection.insertOne(message, (err, result) => {
    callback(result);
  });
}
