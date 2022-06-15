var express = require('express');
var router = express.Router();
var request = require('request');

var mqtt = require('mqtt');
var mqtt_broker = process.env.MQTT_BROKER;
var mesh_controller = process.env.MESH_CONTROLLER;

var options = {
    host: mqtt_broker,
    port: process.env.MQTT_PORT,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS
};

var client = mqtt.connect(options);
var isConnected = "";

client.on('connect', function () {
    console.log("Connected to Broker: " + mqtt_broker);
    isConnected = "Connected to Broker: " + mqtt_broker;
    client.subscribe('/RD/NODE/COMMAND/RESPONSE');
});

client.on('message', function (topic, payload) {

    var data = JSON.parse((payload.toString()));

    // Config Fetched
    switch (data.status) {
        case 'config_fetched':
            request.put({
                    url: mesh_controller + '/cake3/rd_cake/meshes/node_config_fetch.json',
                    form: data
                },
                function (err, res, body) {
                    if (err) {
                        console.error('Error Occurred: ' + err);
                    }

                    console.log(body);
                }
            );
            break;
	case 'fetched':
            request.put({
	    	url: mesh_controller + '/cake3/rd_cake/node-actions/node-command.json',
		form: data
	    },
	    function (err, res, body) {
	        if (err) {
		    console.error('Error Occurred: ' + err);
		}
                console.log(body);
					                    }
           );
	    break;	    
	case 'replied':
            request.put({
	    	url: mesh_controller + '/cake3/rd_cake/node-actions/node-reply.json',
		form: data
	    },
	    function (err, res, body) {
	        if (err) {
		    console.error('Error Occurred: ' + err);
		}
                console.log(body);
					                    }
           );
	    break;	    
        default:
            request.put({
                    url: mesh_controller + '/cake3/rd_cake/node-actions/node_command.json',
                    form: data
                },
                function (err, res, body) {
                    if (err) {
                        console.error('Error Occurred: ' + err);
                    }

                    console.log(body);
                }
            );
            break;
    }
});

router.get('/', function (req, res, next) {
    res.send(isConnected);
});

router.post('/config', function(req, res){
    var data = JSON.parse(req.body.message);
    var message = JSON.stringify(data);

    client.publish('/RD/NODE/' + data.mesh_id + '/COMMAND', message);
    console.log("Published command to node: " + data.mac);
    res.json(message);
});

router.post('/mesh/command', function(req, res){
    //var data = JSON.parse(req.body.message);
    var data = req.body.message;
    var message = JSON.stringify(data);
	console.log(message);
    client.publish('/RD/MESH/' + data.node_id + '/COMMAND', message);
    console.log("Published command to Mesh node: " + data.mac);
    res.json(message);
});

router.post('/ap/command', function(req, res){
    //var data = JSON.parse(req.body.message);
    var data = req.body.message;
    var message = JSON.stringify(data);
	console.log(message);
    client.publish('/RD/AP/' + data.ap_id + '/COMMAND', message);
    console.log("Published command to AP: " + data.mac);
    res.json(message);
});

module.exports = router;
