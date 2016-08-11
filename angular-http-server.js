#!/usr/bin/env node

var http = require("http");
var fs = require("fs");

// function sendFile(fname) {}

var server = http.createServer(function (req, res) {
    var possibleFilename = req.url.slice(1) || "dummy";
    possibleFilename = possibleFilename.split('?')[0];

    fs.stat(possibleFilename, function (err, stats) {

        var fileBuffer;
        var fileExtension = possibleFilename.split('.');

        if (!err && stats.isFile()) {

            // we need last part of array in case of e.g. xxxx.min.css
            fileExtension = fileExtension[fileExtension.length - 1];

            console.log("Sending file: %s", possibleFilename);
            fileBuffer = fs.readFileSync(possibleFilename);
            var contentType = fileExtension == 'svg' 
                        ? 'image/svg+xml'
                        : 'text/' + fileExtension;
            res.writeHead(200, { 'Content-Type': contentType});
        }
        else {
            var isNgTemplate = fileExtension[fileExtension.length - 2] == 'ng';
            if(isNgTemplate){
                console.log("Route %s is ng-template, so 404", possibleFilename);
                fileBuffer = '404 Not Found';
                res.writeHead(404,  { 'Content-Type': 'text/html' });
            }else{
                console.log("Route %s, replacing with index.html", possibleFilename);
                fileBuffer = fs.readFileSync("index.html");
                res.writeHead(200, { 'Content-Type': 'text/html' });    
            }
        }

        res.write(fileBuffer);
        res.end();
    });
});

server.listen(8080, function () { return console.log("Listening on 8080"); });
