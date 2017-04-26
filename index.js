'use strict';
require('dotenv').config()

const mqtt = require('mqtt')
const MongoClient = require('mongodb').MongoClient

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_HOST)

mqttClient.on('connect', function () {
  mqttClient.subscribe(process.env.MQTT_TOPIC)
})

MongoClient.connect(process.env.MONGODB_HOST, function(err, db) {
  console.log("Connected correctly to server");
  mqttClient.on('message', (topic, message) => {
    try {
      let json = JSON.parse(message.toString());
      insertDocuments(json, db, console.log);
    } catch (e) {
      console.log("not JSON");
    }
  })
});


let insertDocuments = (message, db, callback) => {
  const collection = db.collection('readings');
  collection.insertOne(message, (err, result) => {
    callback(result);
  });
}
