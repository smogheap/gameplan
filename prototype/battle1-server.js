/*

host with:
    node battle1-server.js <ip>

play with several clients at:
    http://0.0.0.0:8080

 */


var http = require("http");
var path = require("path");
var fs = require("fs");

var STATE = {};

http.createServer(function (req, res) {
	if(req.url && req.url[0] === ".") {
		res.writeHead(403, { "Content-Type": "text/html" });
		res.end("<h1>403 Not Allowed</h1>", "utf-8");
		return;
	}
	var filePath = "./battle1/" + req.url;
	if(filePath == "./battle/") {
		filePath = "./battle/index.html";
	}
	var extname = path.extname(filePath);

	if(req.url === "/updatestate" && req.method === "POST") {
		var data = [];
		req.on("data", function(chunk) {
			//console.log("chunk:", chunk.toString());
			data.push(chunk.toString());
		});
		req.on("end", function() {
			if(!data.length) {
				res.writeHead(400, {
					"Content-Type": "text/plain"
				});
				res.end("400 Bad Request");
				return;
			}
			STATE = JSON.parse(data.join(""));
			console.log(STATE);
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.write(JSON.stringify(STATE, null, "    "));
			res.end()
		});
		return;
	}

	fs.readFile(filePath, function(error, content) {
		if(error) {
			if(error.code == "ENOENT") {
				res.writeHead(404, { "Content-Type": "text/html" });
				res.end("<h1>404 Not Found</h1>", "utf-8");
			} else if(error.code == "EISDIR") {
				res.writeHead(301, { "Location": req.url + "index.html" });
				res.end("redirecting...", "utf-8");
			} else {
				res.writeHead(500);
				res.end("error code: " + error.code, "utf-8");
			}
		} else {
			var contentType = "text/plain";
			switch(extname) {
			case ".js":
				contentType = "text/javascript";
				break;
			case ".css":
				contentType = "text/css";
				break;
			case ".json":
				contentType = "application/json";
				break;
			case ".png":
				contentType = "image/png";
				break;
			case ".jpg":
				contentType = "image/jpg";
				break;
			case ".wav":
				contentType = "audio/wav";
				break;
			case ".html":
				contentType = "text/html";
				break;
			}
			res.writeHead(200, { "Content-Type": contentType });
			res.end(content, "utf-8");
		}
	});
}).listen(8080);
console.log("running at http://127.0.0.1:8080");
