/*
Name: Ruby Bron
Studenid: 12474223
Data source: https://www.kaggle.com/new-york-state/nys-biodiversity-by-county
This file contains the script for the creation of the plots (chloropleth and bar-chart)
*/

window.onload = function() {
	var localData = "biodiversity-by-county-distribution-of-animals-plants-and-natural-communities.csv"
	var choroplethMap = "us-albers-counties.json"
	openData(localData, choroplethMap);
	makeMap(choroplethMap);
};


function openData(data, choroplethMap) {
	d3v5.csv(data).then(function(data) {
		d3v5.json(choroplethMap).then(function(choroplethMap) {
			console.log(data[0].County, data[0].Category, data[0]["Taxonomic Group"]);
			var transformedData = transformData(data);
			var choroplethData = createChoroplethData(transformedData);
			createChoropleth(choroplethMap, choroplethData);	
		});
	});
};



function transformData(data) {
	console.log(data);
	return data;
};


function createChoroplethData(data) {
	console.log(data[2]);
	return data;
};


function makeMap(map) {
	var width = 960,
    	height = 500,
    	centered;

	var projection =  d3v3.geoAlbersUsa()
	    .scale(1370)
	    .translate([width / 2, height / 2]);

	var path = d3.geoPath()
	    .projection(projection);

	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);


	d3.json(map,function(json){
	    svg.selectAll("path")
	       .attr("id", "state_fips")
	       .data(topojson.feature(json, json.objects.collection).features.filter(function(d) { return d.properties.state_fips == 36; }))
	       .enter()
	       .append("path")
	       .attr("d", path)
	       .attr("stroke","white")
	       .attr("fill", "gray");
	});
};


function createChoropleth(map, data) {
	console.log(data[3]);
	var map = new Datamap({element: document.getElementById('container')});
};
	
