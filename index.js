#!/usr/bin/env babel-node
 // --debug-brk


var parsedArgs = require('minimist')(process.argv.slice(2)),
	csv = require("fast-csv"),
	Promise = require("bluebird"),
	_ = require("lodash"),
	fs = require("fs");

var target = parsedArgs._;

function usage() {
	console.log("missing file, ex:")
	console.log("  index.js ./teams.csv")
}

if (!target || target == "") {
	usage();
	process.exit(0)
}

const filename = `${target}`
new Promise(function(resolve, reject){
	var teams = []
	var stream = fs.createReadStream(filename),
		index = 0,
		updates = [];
	csv.fromStream(stream, {
		headers: true
	}).on("data", function(data) {
		if (data.name && data.name.trim() != '') {
			teams.push(data);
		}
		index = index + 1;
	}).on("end", function() {
		resolve(teams)
	}).on("error", function(err){
		reject(err)
	});
}).then((teams)=>{
	var indexed = _.map(teams, (team)=> {
		return {
			...team,
			index: Math.random()*10000000
		}
	})
	var sorted = _.sortBy(indexed, (team)=> {
		return team.index
	})
	console.log("teams order is:")
	_.each(sorted, (team,index) => {
		console.log(`${index+1}: ${team.name}`)
	})
})
