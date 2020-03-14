"use strict";
const xml2json = require("xml-to-json-stream")({attributeMode:true});
const https = require("https");
const fs = require("fs");

//TODO read in args to see which mode
//--xml
//--kml
//--json (--xml then thru the xml2json lib above)
//--csv
//--tsv

//--help
//--version
var displayType = "XML"; //default to xml
var convertXML2JSON = false;

switch(process.argv[2]){
	case undefined:
	case "--help":
		console.log("Usage: node dump_iau_nomenclature.js [OPTIONS]\nOPTIONS: --xml --json --csv --tsv --kml --help --version");
		process.exit();
		break;
	case "--version":
		console.log("iau_nomenclature Version 1.0.0");
		process.exit();
		break;
	case "--xml":
		displayType = "XML";
		break;
	case "--json":
		displayType = "XML";
		convertXML2JSON = true;
		break;
	case "--csv":
		displayType = "CSV";
		break;
	case "--tsv":
		displayType = "TSV";
		break;
	case "--kml":
		displayType = "KML";
		break;
	default:
		console.log("Unknown option "+process.argv[2]);
		console.log("Usage: node dump_iau_nomenclature.js [OPTIONS]\nOPTIONS: --xml --json --csv --tsv --kml --help --version");
		break;
}

const PATH_PREFIX = "/nomenclature/SearchResults;jsessionid=";
//TODO keep this updated, try to get from github nad if it fails default to local version
const TARGETS = [
	//Mercury System
	"MERCURY",
	//Venus System
	"VENUS",
	//Earth System
	"MOON",
	//Martian System
	"MARS",
	"PHOBOS",
	"DEIMOS",
	//Asteroid Belt
	"BENNU",
	"CERES",
	"DACTYL",
	"EROS",
	"GASPRA",
	"IDA",
	"ITOKAWA",
	"LUTETIA",
	"MATHILDE",
	"RYUGU",
	"STEINS",
	"VESTA",
	//Jupiter System
	"AMALTHEA",
	"THEBE",
	"IO",
	"EUROPA",
	"GANYMEDE",
	"CALLISTO",
	//Saturn System
	"EPIMETHEUS",
	"JANUS",
	"MIMAS",
	"ENCELADUS",
	"TETHYS",
	"DIONE",
	"RHEA",
	"TITAN",
	"HYPERION",
	"IAPETUS",
	"PHOEBE",
	//Uranus System
	"PUCK",
	"MIRANDA",
	"ARIEL",
	"UMBRIEL",
	"TITIANA",
	"OBERON",
	//Neptune
	"PROTEUS",
	"TRITON",
	//Dwarf Planets
		//Plutonian System
		"PLUTO",
		"CHARON"
];

getJSessionId( (id) => {
	var options = {
		hostname : "planetarynames.wr.usgs.gov",
		port : 443,
		method : "POST",
		headers : {
			"Content-type" : "application/x-www-form-urlencoded"
		}
	};
	for(var i=0; i < TARGETS.length; i++){
		(function(i){
			options.path = PATH_PREFIX + id;
			var reqBody = "target="+TARGETS[i]+"&displayType="+displayType;
			options.headers["Content-Length"] = Buffer.byteLength(reqBody);
			var req = https.request(options, (res) => {
				var resBody = "";
				res.on("data", (data) => {
					resBody += data.toString();
				});
				res.on("end", () => {
					if(displayType === "XML" && convertXML2JSON){
						xml2json.xmlToJson(resBody, (err, json) =>{
							if(err){
								console.log("Unable to parse XML from "+TARGETS[i]);
							}else{
								fs.writeFileSync(sensibleCase(TARGETS[i])+".json", JSON.stringify(json), "utf8");

							}
						});
					}else{
						fs.writeFileSync(sensibleCase(TARGETS[i])+"."+displayType.toLowerCase(), resBody, "utf8");
					}
				});	
			});
			req.write(reqBody);
			req.end();
		})(i);
	}
});

function getJSessionId(callback){
	var resBody = "";
	var options = {
		hostname : "planetarynames.wr.usgs.gov",
		port : 443,
		method : "GET",
		path : "/"
	};
	var req = https.request(options, (res) => {
		res.on("data", (data) =>{
			resBody += data.toString();
		});
		res.on("end", () => {
			var jsessionid = resBody.split("jsessionid=")[1].split("\"")[0];
			callback(jsessionid);
		}); 
	});
	req.end();
}

function sensibleCase(str){
	return str[0].toUpperCase() + str.substr(1).toLowerCase();
}
