/*
Name: Ruby Bron
Studenid: 12474223
Data source: https://www.kaggle.com/new-york-state/nys-biodiversity-by-county
This file contains the script for the creation of the plots (choropleth and bar-chart)
*/

window.onload = function() {
	// starts the base functions to create a choropleth and bar-chart plot
	var biodiversityData = "biodiversity-by-county-distribution-of-animals-plants-and-natural-communities.csv";
	var map = "https://gist.githubusercontent.com/markmarkoh/8717334/raw/a226c312c4eb70de3ae3eed99e9337fb64edcee3/newyork-with-counties.json"
	var countyArea = "countyArea.csv"
	openData(biodiversityData, map, countyArea);
};


function openData(biodiversityData, map, countyArea) {
	Promise.all([
		d3v5.csv(biodiversityData),
		d3v5.csv(countyArea),
		d3v5.json(map)
	]).then(function(data) {
		var countyIsID = countyToID(data[2]);
		var transformedData = transformData(data[0], data[1], countyIsID);
		var choroplethData = transformedData[0];
		var barchartData = transformedData[1];
		makeChoropleth(choroplethData);
		makeBarchart(barchartData);
	});
};


function transformData(data, countyArea, countiesID) {
	// transforms the data into a usuable format
	var speciesPerCounty = {};
	var speciesPerGroupPerCounty = {};
	var diversityPerID = [];

	// creates two datasets
	// one with all species per county
	// the other with all species per taxGroup
	for (var datapoint in data) {
		var county = data[datapoint].County;
		// var category = data[datapoint].Category; <-- needed if I would like to change between categories
		var taxGroup = data[datapoint]["Taxonomic Group"];
		var species = data[datapoint]["Scientific Name"];

		// make object with {county:[species]}
		if (!speciesPerCounty[county]) {
			speciesPerCounty[county] = [];
		}
		speciesPerCounty[county].push(species);

		// make object with {county:{taxGroup:[species]}}
		if (!speciesPerGroupPerCounty[county]) {
			speciesPerGroupPerCounty[county] = {};
		}
		if (!speciesPerGroupPerCounty[county][taxGroup]) {
			speciesPerGroupPerCounty[county][taxGroup] = [];
		}
		speciesPerGroupPerCounty[county][taxGroup].push(species);
	}

	// replace species by number of species per county
	for (var county in speciesPerCounty) {
		speciesPerCounty[county] = speciesPerCounty[county].length;
	}

	// replace species by number of species per taxongroup per county for bar-chart
	for (var county in speciesPerGroupPerCounty) {
		for (var taxGroup in speciesPerGroupPerCounty[county])
		speciesPerGroupPerCounty[county][taxGroup] = speciesPerGroupPerCounty[county][taxGroup].length;
	}

	// replace county name with ID number
	for (var numberOfSpecies in speciesPerCounty) {
		for (var countyID in countiesID) {
			if (numberOfSpecies == countyID) {
				diversityPerID.push([countiesID[countyID], speciesPerCounty[numberOfSpecies]]);
			}
		}
	}

	// return [0] for choropleth data and [1] for barchart data
	return [diversityPerID, speciesPerGroupPerCounty];
};


function countyToID(map) {
	var countyIsID = [];
	var counties = map.objects["subunits-ny"].geometries;
	for (var countyIndex in counties) {
		county = counties[countyIndex].properties.name;
		id = counties[countyIndex].id;

		if (!countyIsID[county]) {
			countyIsID[county] = [];
		}
		countyIsID[county] = id;
	}
	return countyIsID;
};


function makeChoropleth(mapData) {
// makes a custom map 
	var dataset = {};
	var onlyValues = mapData.map(function(obj){ return obj[1]; });
    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    var paletteScale = d3v5.scaleLinear()
            			   .domain([minValue,maxValue])
            			   .range(["#EFEFFF","#02386F"]);

    mapData.forEach(function(item){ //
        // item example value ["USA", 70]
        var iso = item[0],
            value = item[1];
        dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
    });

	var map = new Datamap({
		element: document.getElementById('choropleth'),
		setProjection: function(element, options) {
			var projection = d3v3.geo.equirectangular()
								 	 .center([-76, 43])
								 	 .scale(3000)
								 	 .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
			var path = d3v3.geo.path()
							   .projection(projection);
			return {path: path, projection: projection};
		},
		geographyConfig: {dataUrl: "https://gist.githubusercontent.com/markmarkoh/8717334/raw/a226c312c4eb70de3ae3eed99e9337fb64edcee3/newyork-with-counties.json",
			popupTemplate: function(geo, data) {
	            // tooltip content
	            return ['<div class="hoverinfo">',
	                '<strong>', geo.properties.name, '</strong>',
	                '<br>Species per state: <strong>', data.numberOfThings, '</strong>',
	                '</div>'].join('');
        	}
    	},
		scope: "subunits-ny",
		data: dataset,
		// show desired information in tooltip
        
	});
};


function makeBarchart(barData) {
	console.log(barData);
};
