process.env.PORT = 3000;

const fetch = require("fetch");
const express = require("express");
const xml = require("xml");
const parseString = require("xml2js").parseString;
const cors = require("cors");
const app = express();


app.use(cors());


function saneJson(obj) {
	const saneObj = {};
	const keyList = Object.keys(obj);
	if(obj._) {
		return obj._;
	}
	keyList.forEach(k => {
		if(typeof obj[k] === "object" && k !== "$" && obj[k] !== "_") {
			saneObj[k] = saneJson(obj[k]);
		}
	});
	return saneObj;
};




app.get("*",(req,res) => {
	let q = req.params;




	

	const params = q["0"].split("/");

	const query = params[1];
	const type = params[2]
	fetch.fetchUrl(`http://zoeken.oba.nl/api/v1/search/?authorization=1e19898c87464e239192c8bfe422f280&q="${query}"&facet=type(${type})&refine=true&pagesize=20&rctx=ASXIwQ2CMBQG4L$8GCSM4MkJml5cx7yWYgqFltIecAjDBE7l3atjaOLlO3wC1KKGysPEOXaLtvdhUyNrv3EsoyGBZmI3C0KbS2TzV9DJXZM1a7Qp8s2SqoC93@vq8SRRvS70eR$BOmgGcJYphCy9W4rr5O$astqEw$zFFw==`, function(err,meta,body) {
		parseString(body.toString(),{explicitArray:false},(err, p) => {
			if(err) throw err;
			const results =  p.aquabrowser.results ? p.aquabrowser.results.result : null;
			const prettyResults = [];

			if(results == null) {
				res.send("No data has been found")
			}else {
				results.forEach(i => {
				prettyResults.push(saneJson(i));
				})
				if(results !== undefined) {
					res.set("Content-Type", "text/json");
					res.send(JSON.stringify(prettyResults));
				}else {
					res.send("foo-bar")
				}		
			}
					
		})
	})
})




app.listen(process.env.PORT, function() {
	console.log("running on port: " + process.env.PORT)
})