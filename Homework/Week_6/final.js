/*
Name: Ruby Bron
Studenid: 12474223
Data source: https://www.kaggle.com/new-york-state/nys-biodiversity-by-county
This file contains the script for the creation of the plots (choropleth and bar-chart)
*/

window.onload = function() {
	// starts the base functions to create a choropleth and bar-chart plot
	var biodiversityData = "../biodiversity-by-county-distribution-of-animals-plants-and-natural-communities.csv";
	var map = "https://gist.githubusercontent.com/markmarkoh/8717334/raw/a226c312c4eb70de3ae3eed99e9337fb64edcee3/newyork-with-counties.json"
	var countyArea = "../countyArea.csv"
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
		makeChoropleth(choroplethData, barchartData);
		makeBarchart(barchartData, "Suffolk");
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


function makeChoropleth(mapData, barData) {
	// makes a custom map 
	var dataset = {};
	var onlyValues = mapData.map(function(obj){ return obj[1]; });
    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    var paletteScale = d3v5.scaleLinear()
            			   .domain([minValue,maxValue])
            			   .range(["#e5f5e0","#31a354"]);

    mapData.forEach(function(item){
        var iso = item[0],
            value = item[1];
        dataset[iso] = { numberOfSpecies: value, fillColor: paletteScale(value) };
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
	                '<br>Species per state: <strong>', data.numberOfSpecies, '</strong>',
	                '</div>'].join('');
        	}
    	},
		scope: "subunits-ny",
		data: dataset,
		done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                updateBarChart(barData, geography.properties.name);
            })
        }
	}); 

	// Width and height
	var w = 500,
		h = 500;

	// Padding
	var barPadding = 1,
		chartPaddingTop = 50,
		chartPaddingBot = 150
		chartPaddingX = 50;

	// open svg
	var svg = d3v5.select("svg")

	// chart Title
    svg.append("text")
       .attr("class", "choropleth-title")             
       .attr('x', w - chartPaddingX)
       .attr('y', 0 + chartPaddingTop)
       .style("text-anchor", "end")
       .style("font-size", "20px")
       .style("font-weight", "bold")
       .text("Species density of the state New York");

    // legend
   	map.legend()
};




function makeBarchart(barData, countyName) {
	// Creates a svg with a barchart

	// Some variables that we use later on
	var county = barData[countyName];

	// Creates two arrays to hold species and names
	var dataset = [];
	var groupNames = [];
	for (var value in county) {
		dataset.push(county[value]);
		groupNames.push(value);
	}

	// Width and height
	var w = 500,
		h = 500;

	// Padding
	var barPadding = 1,
		chartPaddingTop = 50,
		chartPaddingBot = 150
		chartPaddingX = 50;

	// Lenght of dataset
	var dataLength = dataset.length;

	// Create SVG element
	var svg = d3v5.select("#bar-chart")
				  .append("svg")
				  .attr("width", w)
				  .attr("height", h);

	// Create rectangle elements
	var bars = svg.selectAll("rect")
   	    		  .data(dataset)
   	   			  .enter()
   	   			  .append("rect");

   	// create X/Y scales
   	var yScale = d3v5.scaleSqrt()
   					 .domain([0, d3v5.max(dataset)])
   					 .range([h - chartPaddingBot, chartPaddingTop]);
	var xScale = d3v5.scaleBand()
					 .domain(groupNames)
					 .range([chartPaddingX, w - chartPaddingX])
					 .paddingInner([0.1])
					 .paddingOuter([0.3])
					 .align([0.5]);			

    // Tooltip
	var div = d3v5.select('#bar-chart')
				  .append('div')
				  .attr('class', 'tooltip')
				  .style('opacity', 0);

   	// Draws the bars with data input
	bars.attr("x", function(d, i) {
			return xScale(groupNames[i]);
		})
		.attr("y", function(d) {
			return yScale(d);
		})
		.attr("width", xScale.bandwidth())
		.attr("height", function(d) {
			return h - yScale(d) - chartPaddingBot;
		})
		.attr("fill", "#31a354")
		.on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", 1);		
            div.html(": " +d)	
                .style("left", 135 + "px")		
                .style("top", 9 + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });


	// initialize axis
	var yAxis = d3v5.axisLeft(yScale)
					.ticks(10);
	var xAxis = d3v5.axisBottom(xScale)
					.ticks(groupNames.lenght);

	// create the Y-axis 
	svg.append("g")
       .attr("class", "y-axis")
       .attr("transform", "translate(" + chartPaddingX + ",0)")
       .call(yAxis);

    // create Y label
	svg.append("text") 
	   .attr("class", "y-label")            
       .attr('x', 0)
       .attr('y', chartPaddingTop / 2)
       .style("text-anchor", "start")
       .text("Number of species");

    // create the X-axis
    svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", "translate(0," + (h - chartPaddingBot) + ")")
       .call(xAxis)
       .selectAll("text")
       .attr("y", 0)
       .attr("x", 9)
       .attr("dy", ".35em")
       .attr("transform", "rotate(90)")
       .style("text-anchor", "start");

    // create X label
    svg.append("text")
       .attr("class", "x-label")             
       .attr('x', w / 2 - chartPaddingX)
       .attr('y', h - chartPaddingTop / 2)
       .style("text-anchor", "start")
       .text("Taxon group");

    // chart Title
    svg.append("text")             
       .attr('x', w - chartPaddingX)
       .attr('y', chartPaddingTop)
       .style("text-anchor", "end")
       .style("font-size", "20px")
       .style("font-weight", "bold")
       .text("Distribution of species in");

    // corresponding county label
    svg.append("text")
       .attr("class", "county-label")             
       .attr('x', w - chartPaddingX)
       .attr('y', chartPaddingTop * 2)
       .style("text-anchor", "end")
       .style("font-size", "40px")
       .text(countyName);
};


function updateBarChart(barData, countyName) {
	var county = barData[countyName];
	var dataset = [],
		groupNames = [];

	for (var value in county) {
		dataset.push(county[value]);
		groupNames.push(value);
	}

	// Width and height
	var w = 500,
		h = 500;

	// Padding
	var barPadding = 1,
		chartPaddingTop = 50,
		chartPaddingBot = 150
		chartPaddingX = 50;

	// Lenghts
	var dataLength = dataset.length;
	var duration = 1000;

   	// create X/Y scales
   	var yScale = d3v5.scaleSqrt()
   					 .domain([0, d3v5.max(dataset)])
   					 .range([h - chartPaddingBot, chartPaddingTop]);
	var xScale = d3v5.scaleBand()
					 .domain(groupNames)
					 .range([chartPaddingX, w - chartPaddingX])
					 .paddingInner([0.1])
					 .paddingOuter([0.3])
					 .align([0.5]);			

	// Update rectangles
	var bars = d3v5.selectAll("rect")
				   .data(dataset);
	bars.enter()
		.append("rect")
		.attr('class', "bar")
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('y', h)
		.merge(bars)
        .transition()
        .duration(duration)
		.attr("x", function(d, i) {
			return xScale(groupNames[i]);
		})
		.attr("y", function(d) {
			return yScale(d);
		})
		.attr("width", xScale.bandwidth())
		.attr("height", function(d) {
			return h - yScale(d) - chartPaddingBot;
		})
		.attr("fill", "#31a354");

	// hide unused groups
	bars.exit()
        .transition()
        .duration(duration)
        .attr('height', 0)
        .attr('y', h - chartPaddingBot);
};
