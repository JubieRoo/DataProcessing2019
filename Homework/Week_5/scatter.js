/*
Name: Ruby Bron
Studenid: 12474223
Data source: 
This file contains all the functions to create a scatterplot
*/

window.onload = function() {
	// opens the json files and calls other functions working with that datafile

	// data needed for scatterplot local data is used because of a block by the APIserver
	var tourismInbound = "data/tourists.json";
	var purchasingPowerParities = "data/ppp.json";
	var grossDomesticProduct = "data/gdp.json";

	// loads the data then executes functions using it
	Promise.all([
		d3.json(tourismInbound),
		d3.json(purchasingPowerParities),
		d3.json(grossDomesticProduct)
		]).then(function(data) {
			var dataTransformed = transformData(data);
			var scatterData = createPlotData(data, 2012, 2);
			var scatterPlot = createScatter(data);
		}
	);
};


function getDataAPI() {
	// this function acquires the data from an API 

	// API links
	var tourismInbound = "https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=2009&endTime=2017"
	var purchasingPowerParities = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions"
	var grossDomesticProduct = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"
	// requests json files
	var requests = [d3.json(tourismInbound), d3.json(purchasingPowerParities), d3.json(grossDomesticProduct)];

	// waits till requests are fulfilled and then executes a function
	// (response[0]["dataSets"][0]["series"]["0:0"]) <-- voor vinden data API
	Promise.all(requests).then(function(response) {
		formatTI(response[0]);
		formatPPP(response[1]);
		formatGDP(response[2]);
	}).catch(function(e){
		console.log(e);
    	throw(e);
	});
};


function transformData(data) {
	var countryInformation = {};
	for (var dataset in data) {
		for (var country in data[dataset]) {
			for (var element in data[dataset][country]) {
				if (data[dataset][country][element]["Year"] == undefined)
					console.log(data[dataset][country][element]["Time"])
				else 
					console.log(data[dataset][country][element]["Year"])
			}
		}
	}
	return data;
};


function createPlotData(transformedData, year, variableX, variableY) {
	// transformedData = data[variable];

	// for (var country in dataset) {
	// 	console.log(country);
	// 	for (var element in dataset[country]) {
	// 		console.log(dataset[country][element].Year);
	// 	}
	// }	


	return [];
}


function createScatter(data) {
	var data = [
                	[5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
                	[410, 12], [475, 44], [25, 67], [85, 21], [220, 88], [600, 150]
              	  ];

    var w = 500;
    var h = 300;
    var padding = 30;

	// create scales
    var xScale = d3.scaleLinear()
		 		   .domain([0, d3.max(data, function(d) { return d[0]; })])
	     		   .range([padding, w - padding * 2]);

	var yScale = d3.scaleLinear()
		 		   .domain([0, d3.max(data, function(d) { return d[1]; })])
	     		   .range([h - padding, padding]);

	var rScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) { return d[1]; })])
                   .range([2, 5]);
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
	   .data(data)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
        	return xScale(d[0]);
   	   })
   	   .attr("cy", function(d) {
        	return yScale(d[1]);
   	   })
       .attr("r", function(d) {
    		return rScale(d[1]);
	   })
	   .attr("fill", "None")
	   .attr("stroke", "black");

    // create labels
	// svg.selectAll("text")
	//    .data(dataset)
	//    .enter()
	//    .append("text")
	//    .text(function(d) {
	//    		return "Australia";
	//    })
	//    .attr("x", function(d) {
 //        	return xScale(d[0]);
 //   	   })
 //   	   .attr("y", function(d) {
 //        	return yScale(d[1]);
 //   	   })
 //   	   .attr("font-family", "sans-serif")
 //   	   .attr("font-size", "11px")
 //   	   .attr("fill", "red");

	// create X axis
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis);

    // create Y axis
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis);     		  
};



function formatTI() {
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
    return dataObject;
};

function formatGDP() {
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
    return dataObject;
};
