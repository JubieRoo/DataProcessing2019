/*
Name: Ruby Bron
Studenid: 12474223
Data source: https://www.kaggle.com/new-york-state/nys-biodiversity-by-county
This file contains the script for the creation of the plots (chloropleth and bar-chart)
*/

window.onload = function() {
	var localData = "biodiversity-by-county-distribution-of-animals-plants-and-natural-communities.csv"
	var choroplethMap = '/datamaps/NY-36-new-york-counties.json'
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


function makeMap(cMap) {
	var map = new Datamap({
		element: document.getElementById('container'),
		geographyConfig: {dataUrl: 'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/NY-36-new-york-counties.json'},
		scope: 'cb_2015_new_york_county_20m',
		setProjection: function(element, options) {
			var projection = d3v3.geo.equirectangular()
								 	 .center([-76, 43])
								 	 .scale(3000)
								 	 .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
			var path = d3v3.geo.path()
							   .projection(projection);
			return {path: path, projection: projection};
		}
	});
};


function createChoropleth(map, data) {
	console.log(data[3])
};
	
