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
			var transformedData = transformData(data);
			var choroplethData = createChoroplethData(transformedData);
			createChoropleth(choroplethMap, choroplethData);	
		});
	});
};



function transformData(data) {
	// transforms the data into a usuable format
	var resultSmall = {};
	var diversity = {};
	var taxonPerCounty = {};

	for (var datapoint in data) {
		var county = data[datapoint].County;
		var category = data[datapoint].Category;
		var taxGroup = data[datapoint]["Taxonomic Group"];
		var species = data[datapoint]["Scientific Name"];

		if (!resultSmall[county]) {
			resultSmall[county] = [];
		}
		resultSmall[county].push(species);
	}
	for (var county in resultSmall) {
		if (!diversity[county]) {
			diversity[county] = [];
		}
		diversity[county] = resultSmall[county].length;
	}
	console.log(resultSmall, diversity);

	return diversity;
};


function createChoroplethData(data) {
	return data;
};


function makeMap(cMap) {
// makes a custom map 
	var map = new Datamap({
		element: document.getElementById('container'),
		geographyConfig: {dataUrl: "https://gist.githubusercontent.com/markmarkoh/8717334/raw/a226c312c4eb70de3ae3eed99e9337fb64edcee3/newyork-with-counties.json"},
		scope: "subunits-ny",
		setProjection: function(element, options) {
			var projection = d3v3.geo.equirectangular()
								 	 .center([-76, 43])
								 	 .scale(3000)
								 	 .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
			var path = d3v3.geo.path()
							   .projection(projection);
			return {path: path, projection: projection};
		},
		fills: {
			HIGH: 'red',
			defaultFill: 'green'
		},
		data: {
			'071': {
				fillKey: 'HIGH'
			}
		}
	});
};


function createChoropleth(map, data) {
};
	
