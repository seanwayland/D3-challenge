
Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}



var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var csvName = "minwage_crime.csv"
var xAxisString = "minimum_wage_2018"
var yAxisString = "total_crime_per_100K_pop"
var xAxisLabel = "state minimum wage for 2018 in US Dollars"
var yAxisLabel = "state total crime per 100k people"
// Import Data
d3.csv(csvName).then(function(dataSet) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    dataSet.forEach(function(data) {
       // data.minimum_wage_2018 = +data.minimum_wage_2018;
        data.xAxis = (Object.byString(data, xAxisString))
        data.yAxis = (Object.byString(data, yAxisString))

        //console.log(data.xAxis)
        //data.total_crime_per_100K_pop = +data.total_crime_per_100K_pop;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(dataSet, d => d.xAxis)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(dataSet, d => d.yAxis)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.xAxis))
        .attr("cy", d => yLinearScale(d.yAxis))
        .attr("r", "5")
        .attr("fill", "red")
        .attr("opacity", ".8");

    // Step 6: Initialize tool tip
    // ==============================





    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>y value: ${d.yAxis}<br>x value: ${d.xAxis}`);
        });


    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================


    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });




    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text(yAxisLabel);

    chartGroup.append("text")
        .attr("transform", `translate(${width / 3.5}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text(xAxisLabel);
}).catch(function(error) {
    console.log(error);
});
