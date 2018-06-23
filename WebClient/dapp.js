var express = require("express");  
var app = express();  

/* http://localhost:8080/zscTestLogin.html */
app.use(express.static("./"));

/* http://localhost:8080 */
app.get("/", function(req, res){
	res.sendFile(__dirname + "/zscTestLogin.html");
});

app.listen(8080);