/*
Name: Ruby Bron
Studenid: 12474223
Data sources: 
	https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/tourists.json
	https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/ppp.json
	https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/gdp.json
This file creates a scatterplot, the only problem is that I can't access the API. 
So I created the scatterplot with the data available on the courses website.
I did leave the function that should get data from the API available for use, but I haven't been able to test if it works the same. 
*/

window.onload = function() {
	// this function is called when the webpage is opened and calls the function that eventually creates a scatterplot from API data 
	getDataPC();
};

function getDataPC() {
	// data needed for scatterplot local data is used because of a block by the APIserver
	var tourismInbound = "data/tourists.json";
	var purchasingPowerParities = "data/ppp.json";
	var grossDomesticProduct = "data/gdp.json";

	// variables needed to create scatter data
	var xAxis = 1; 
	var yAxis = 2;
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
	// this function acquires the data from an API 

	// API links
	var tourismInboundAPI = "https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=2009&endTime=2017"
	var purchasingPowerParitiesAPI = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions"
	var grossDomesticProductAPI = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"
	
	// requests json files
	var requests = [d3.json(tourismInboundAPI), d3.json(purchasingPowerParitiesAPI), d3.json(grossDomesticProductAPI)];

	// variables needed to create scatter data
	var xAxis = 1; 
	var yAxis = 2;
	var year = 2012;

	// loads the data, transforms it and than creates a scatterplot with it
	Promise.all(requests).then(function(response) {
		TI = formatTI(response[0]);
		PPP = formatPPP(response[1]);
		GDP = formatGDP(response[2]);
		data = [TI, PPP, GDP];

		var dataTransformed = transformData(data);
		var scatterData = createPlotData(dataTransformed, year, xAxis, yAxis);
		var scatterPlot = createScatter(scatterData, xAxis, yAxis);
	}).catch(function(e) {
		console.log(e);
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
	valuesXY = [];
	countries = [];
	countriesAll = [];
	for (var country in transformedData[year]) {
		x = transformedData[year][country][variableX];
		y = transformedData[year][country][variableY];
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

	// size variables 
    var w = 960;
    var h = 540;
    var padding = 100;
    var legendRectSize = 10;
    var legendSpacing = 5;

    // create colour scale
    var color = d3.interpolateRdYlBu;

	// create graph scales
    var xScale = d3.scaleLog()
    	 		   .domain([d3.min(data[0], xy => xy[0]), d3.max(data[0], xy => xy[0])])
	     		   .range([padding, w - padding * 2]);

	var yScale = d3.scaleLog()
		 		   .domain([d3.min(data[0], xy => xy[1]), d3.max(data[0], xy => xy[1])])
	     		   .range([h - padding, padding]);

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

    // create labels
	svg.selectAll("text")
	   .data(data[0])
	   .enter()
	   .append("text")
	   .text(function(d, i) {
	   		return countries[i];
	   })
	   .attr("x", function(d) {
        	return xScale(d[0]);
   	   })
   	   .attr("y", function(d) {
        	return yScale(d[1]);
   	   })
   	   .attr("font-family", "sans-serif")
   	   .attr("font-size", "11px")
   	   .attr("fill", "Black");


	// make axis visible
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis);     

    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis);     		  
};



function formatTI(data) {
/********
 * Transforms response of OECD request for inbound tourism.
 * https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=2008&endTime=2017
 **/

    // Save data
    let originalData = data;

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output object, an object with each country being a key and an array
    // as value
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["Time"] = obs.name;
                tempObj["Datapoint"] = data[0];
                tempObj["Indicator"] = originalData.structure.dimensions.series[1].values[0].name;

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else {
                  dataObject[tempObj["Country"]].push(tempObj);
                };
            }
        });
    });

    // return the finished product!
    console.log(dataObject);
    return dataObject;
};


function formatPPP(data) {
/********
 * Transforms response of OECD request for purchasing parity power.
 * https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2018&dimensionAtObservation=allDimensions
 **/

    // Save data
    let originalData = data;

    // access data
    let dataHere = data.dataSets[0].observations;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.observation;
    let seriesLength = series.length;

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        observation.values.forEach(function(obs, index){
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of elements seperated by ':'
                let tempString = string.split(":")
                tempString.forEach(function(s, index){
                    tempObj[varArray[index].name] = varArray[index].values[s].name;
                });

                tempObj["Datapoint"] = data[0];
                tempObj["Indicator"] = obs.name;

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else {
                  dataObject[tempObj["Country"]].push(tempObj);
                };

            }
        });
    });

    // return the finished product!
    console.log(dataObject);
    return dataObject;
};

function formatGDP(data) {
/********
 * Transforms response of OECD request for GDP.
 * https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions
 **/

    // Save data
    let originalData = data;

    // access data
    let dataHere = data.dataSets[0].observations;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.observation;
    let seriesLength = series.length;

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        observation.values.forEach(function(obs, index){
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of elements seperated by ':'
                let tempString = string.split(":")
                tempString.forEach(function(s, index){
                    tempObj[varArray[index].name] = varArray[index].values[s].name;
                });

                tempObj["Datapoint"] = data[0];

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
                    dataObject[tempObj["Country"]].push(tempObj);
                };

            }
        });
    });

    // return the finished product!
    console.log(dataObject);
    return dataObject;
};
