var express = require('express'),
	request = require('request'),
	mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/hydro_pi_scheduler');

var app = express();
app.use(express.bodyParser());
var StatonSchema = mongoose.Schema({
    stationID: Number,
    name: String,
    region: String,
    status: Boolean,
    available: Boolean
});
var StationModel = mongoose.model('station', StatonSchema);
var endpoint = "http://127.0.0.1:8081/stations/";
var findStation = function (station){
	console.log("s", station.stationID);
		StationModel.find({stationID: station.stationID}, function (err, found){
			if(err){
				console.log("Find err", err);
			}

			var tmpStation;
			if(found.length){
				tmpStation = found[0];
				console.log(tmpStation);
			} else {
				console.log("cr", station);
				tmpStation = new StationModel(station);
				tmpStation.save();
			}
		});

}


request(endpoint, function (error, response, body){
	var data = JSON.parse(body),
		dLen = data.length;

	while(dLen--){
		findStation(data[dLen]);
		
	}
});


app.get('/stations', function(req, res) {
	StationModel.find(function(err, data){
		if(err){
			console.log(err);
		}

		res.send(data);
	});
});

app.get('/stations/:id', function(req, res) {

	StationModel.find({_id: req.params.id}, function (err, found){
		if(found.length){
			res.send(found[0]);
		} else {
			res.send({});
		}
	});
});


app.put('/stations/:id', function(req, res) {

	StationModel.find({_id: req.params.id}, function (err, found){

		if(found.length){
			var data = req.body,
				station = found[0],
				status = [true, "true", "1"].indexOf(data.status) > -1 ? true : false;



			if(typeof data.status != "undefined"){
				request.put({
					headers: {'content-type' : 'application/x-www-form-urlencoded'},
					url:     endpoint + station.stationID,
					body:    "status=" + (status?1:0)
				}, function(error, response, body){
					if(!error){
						station.status = status;
						station.save();
						res.send(station);
					}
				});
			}

			var keys = Object.keys(data),
				kLen = keys.length;
			while(kLen--){
				var key = keys[kLen];
				if(key != "status"){
					station[key] = data[key];
				}
			}

			station.save();
			res.send(station);
		} else {

			res.send({});
		}
	});
});

module.exports = app;
