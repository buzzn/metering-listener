'use strict';
require('dotenv').config()
var extend = require('util')._extend
const mqtt = require('mqtt')
const MongoClient = require('mongodb').MongoClient
const time = require('time');
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_HOST)

mqttClient.on('connect', function () {
  console.log('connect to topic: ' + process.env.MQTT_TOPIC )
  mqttClient.subscribe(process.env.MQTT_TOPIC)
})

MongoClient.connect(process.env.MONGODB_HOST, function(err, db) {
  console.log("Connected correctly to host: "+ process.env.MONGODB_HOST);
  mqttClient.on('message', (topic, message) => {
    try {
      let json = extend(JSON.parse(message.toString()),{timestamp: time.time()})
      insertDocuments(json, db, (doc) => {
        console.log(doc.ops)
      })
    } catch (e) {
      console.log("error: " + e);
    }
  })
});


let insertDocuments = (message, db, callback) => {
  const collection = db.collection(process.env.MONGODB_COLLECTION);
  collection.insertOne(message, (err, result) => {
    callback(result);
  });
}
