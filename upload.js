var express = require("express");
var multer = require("multer");
var app = express();
var fs = require("fs");
var fileNames = fs.readdirSync(__dirname + '/uploads');
var mime = require("mime");
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + "." +  mime.extension(file.mimetype));
	}
});

var upload = multer({storage: storage}).single('video');

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.post('/uploadVideo', function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			console.log("Error uploading file.");
		}
		console.log("File has been uploaded.");
		if ((req.file + "") !== "undefined") {
			rename(req.file.filename, req.file.originalname);
		}
	});
});

function rename(filename, originalname) {
	fs.rename('./uploads/' + filename, './uploads/' + originalname, function(err) {
		if (err) {
			console.log("Error.");
			return;
		}
		fileNames.push(originalname);
	});
}

var isUploaded = false;

app.get('/watch', function(req, res) {	
	isUploaded = false;
	
	var videoId = req.query.v + "";
	
	for (var i = 0; i < fileNames.length; i++) {
		if (videoId.toLowerCase === fileNames[i].toLowerCase) {
			isUploaded = true;
			break;
		}
	}
	
	if (isUploaded) {
		res.sendFile(__dirname + "/uploads/" + videoId);
	} else {
		res.end("That video does not exist.");
	}
});

app.listen(1337);