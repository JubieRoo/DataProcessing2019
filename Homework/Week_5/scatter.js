/*
Name: Ruby Bron
Studenid: 12474223
Data sources: 
	https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/tourists.json
	https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/ppp.json
	https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/gdp.json
This file creates a scatterplot, the only problem is that I can't access the API. 
So I created the scatterplot with the data available on the course its website.
I did leave the function that should get data from the API available for later use, but I haven't been able to test if it works the same. 
*/

window.onload = function() {
	/*
	this function is called when the webpage is opened and calls the function that eventually creates a scatterplot from API data 
	*/
	getDataPC();
};

function getDataPC() {
	// data needed for scatterplot local data is used because of a block by the APIserver
	var tourismInbound = "data/tourists.json";
	var purchasingPowerParities = "data/ppp.json";
	var grossDomesticProduct = "data/gdp.json";

	// variables needed to create scatter data will become user input

	var TI = ["Tourism Inbound", 0],
	    PPP = ["Purchasing Power Parities", 1],
	    GDP = ["Gross Domestic Product", 2];

	var xAxis = TI; 
	var yAxis = PPP;
	var year = 2012;

	// loads the data, transforms it and than creates a scatterplot with it
	Promise.all([
		d3.json(tourismInbound),
		d3.json(purchasingPowerParities),
		d3.json(grossDomesticProduct)
		]).then(function(data) {
			var dataTransformed = transformData(data);
			var scatterData = createPlotData(dataTransformed, year, xAxis, yAxis);
			var scatterPlot = createScatter(scatterData, xAxis, yAxis);
		}
	);
};


function getDataAPI() {
	/* 
	this function acquires the data from an API
	*/
	// API links
	var tourismInboundAPI = "https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=2009&endTime=2017"
	var purchasingPowerParitiesAPI = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions"
	var grossDomesticProductAPI = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"
	
	// requests json files
	var requests = [d3.json(tourismInboundAPI), d3.json(purchasingPowerParitiesAPI), d3.json(grossDomesticProductAPI)];

	// variables needed to create scatter data
	var TI = ["Tourism Inbound", 0],
	    PPP = ["Purchasing Power Parities", 1],
	    GDP = ["Gross Domestic Product", 2];
	
	var year = 2012,
	    xAxis = TI,
	    yAxis = PPP;

	// loads the data, transforms it and than creates a scatterplot with it
	Promise.all(requests).then(function(response) {

		// format data
		var TI = formatTI(response[0]),
		    PPP = formatPPP(response[1]),
		    GDP = formatGDP(response[2]);

		// create list of formatted data
		var data = [TI, PPP, GDP];

		// transforms the data to the prefered format
		var dataTransformed = transformData(data);

		// transforms the data to coordinates for the scatterplot
		var scatterData = createPlotData(dataTransformed, year, xAxis, yAxis);

		// creates the actual scatterplot
		var scatterPlot = createScatter(scatterData, xAxis, yAxis);
	}).catch(function(e) {
    	throw(e);
	});
};


function transformData(data) {
	var countryInformation = {};
	var result = {};

	for (var dataset in data) {
		for (var country in data[dataset]) {
			for (var element in data[dataset][country]) {
				// create local variables for dictionary
				var year = data[dataset][country][element].Year || data[dataset][country][element].Time;
				var country = data[dataset][country][element]["Country"];
				var datapoint = data[dataset][country][element]["Datapoint"];

				// creates a dictionary structure: {year: {country: [var1, var2, var3]}}
				if (!result[year]) {
					result[year] = {};
				}
				if (!result[year][country]) {
					result[year][country] = [NaN, NaN, NaN];
				}
				result[year][country][dataset] = datapoint;	
			}	
		}
	}
	return result;
};


function createPlotData(transformedData, year, variableX, variableY) {
	/*
	This creates the coordinates and labels for the plot data
	*/
	valuesXY = [];
	countries = [];
	countriesAll = [];

	for (var country in transformedData[year]) {
		x = transformedData[year][country][variableX[1]];
		y = transformedData[year][country][variableY[1]];
		if (!Number.isNaN(x) && !Number.isNaN(y)) {
			valuesXY.push([x, y]);
			countries.push(country);
		};
		countriesAll.push(country);
	}

	return [valuesXY, countries, countriesAll];
}


function createScatter(data, x, y) {
	/*
	this function creates a scatterplot complete with legend and scales on a svg element
	*/

	// country data
	var countries = data[1];

	// axis labelnames
	var xLabel = x[0],
	    yLabel = y[0];
	x = x[1],
	y = y[1];

	// size variables 
    var w = 960,
        h = 540,
        paddingX = 150,
        paddingY = 50,
        legendRectSize = 10,
        legendSpacing = 3;

    // create colour scale
    var color = d3.interpolateRdYlBu;

	// create graph scales
    var xScale = d3.scaleLog()
    	 		   .domain([d3.min(data[0], xy => xy[0]), d3.max(data[0], xy => xy[0])])
	     		   .range([paddingX, w - paddingX * 2]);

	var yScale = d3.scaleLog()
		 		   .domain([d3.min(data[0], xy => xy[1]), d3.max(data[0], xy => xy[1])])
	     		   .range([h - paddingY, paddingY]);

	var rScale = d3.scaleLinear()
                   .domain([0, d3.max(data[0], function(d) { return d[1]; })])
                   .range([2, 10]);

    // create axis
    var xAxis = d3.axisBottom(xScale)
    			  .ticks(5);
    var yAxis = d3.axisLeft(yScale)
    			  .ticks(5);

 	// create SVG element
	var svg = d3.select("body")
            	.append("svg")
            	 .attr("width", w)
            	 .attr("height", h);

	// create circles
	svg.selectAll("circle")
	   .data(data[0])
       .enter()
       .append("circle")
       .attr("cx", function(d) {
        	return xScale(d[0]);
   	   })
   	   .attr("cy", function(d) {
        	return yScale(d[1]);
   	   })
       .attr("r", 5)
	   .attr("fill", function(d, i) {
	   		return color(i / countries.length)
	   })
	   .attr("stroke", "black");

 //    // create labels
	// svg.selectAll("text")
	//    .data(data[0])
	//    .enter()
	//    .append("text")
	//    .text(function(d, i) {
	//    		return countries[i];
	//    })
	//    .attr("x", function(d) {
 //        	return xScale(d[0]);
 //   	   })
 //   	   .attr("y", function(d) {
 //        	return yScale(d[1]);
 //   	   })
 //   	   .attr("font-family", "sans-serif")
 //   	   .attr("font-size", "11px")
 //   	   .attr("fill", "Black");

   	// create legend class
   	var legend = svg.selectAll('.legend')
   					.data(countries)
   					.enter()
   					.append('g')
   					.attr('class', 'legend')
   					.attr('transform', function(d, i) {
   						var height = legendRectSize + legendSpacing;
   						var offset = height * countries.length / 2;
   						var horizontal = legendRectSize;
   						var vertical = i * height - offset + paddingX * 1.75;
   						return 'translate(' + horizontal + ',' + vertical + ')';
   					});

   	// create the colored squares of the legend
   	legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', function(d, i) {
          	return color(i / countries.length)
          })
          .style('stroke', 'black');
    
    // create the labels of the legend
    legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { return d; }); 


	// create the X-axis
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (h - paddingY) + ")")
       .call(xAxis); 

    // create the X label
 	svg.append("text")             
       .attr('x', h - paddingX)
       .attr('y', h)
       .style("text-anchor", "middle")
       .text(xLabel);

    // create the Y-axis
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + paddingX + ",0)")
       .call(yAxis);   

    // create Y label  
    svg.append("text")             
       .attr('x', paddingX)
       .attr('y', paddingY / 2)
       .style("text-anchor", "middle")
       .text(yLabel);

    // create graph title
    svg.append("text")             
       .attr('x', w / 2)
       .attr('y', paddingY / 4)
       .style("text-anchor", "middle")
       .text(xLabel + " tegenover " + yLabel);		  
};


function switchXAxis() {

};
