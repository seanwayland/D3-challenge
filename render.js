/**
 *
 * function which redraws graph based on chart number requested
 */
var render = function(chartNumber) {

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



    switch(chartNumber)
    {
        case(3):
            var csvName = "minwage_crime.csv"
            var xAxisString = "minimum_wage_2018"
            var yAxisString = "total_crime_per_100K_pop"
            var xAxisLabel = "state minimum wage for 2018 in US Dollars"
            var yAxisLabel = "state total crime per 100k people"
            var chartTitle = "Total crime per 100k people VS state minimum wage "


                break
        case(1):
             csvName = "minwage_poverty.csv"
             xAxisString = "minimum_wage_2018"
             yAxisString = "poverty_rate_2017"
             xAxisLabel = "state minimum wage for 2018 in US Dollars"
             yAxisLabel = "poverty rate in 2017"
             chartTitle = "Percentage living in Poverty VS state minimum wage "
            break
        case(2):
            csvName = "minwage_unemployment.csv"
            xAxisString = "minimum_wage_2018"
            yAxisString = "percentage_of_labor_force_unemployed_2019"
            xAxisLabel = "state minimum wage for 2018 in US Dollars"
            yAxisLabel = "labor force unemployed % in 2017"
            chartTitle = "Percentage of labor force Unemployed VS state minimum wage "
            break
        case(6):
            csvName = "unionism_crime.csv"
            xAxisString = "union_representation_percent_2018"
            yAxisString = "total_crime_per_100K_pop"
            xAxisLabel = "percentage of labor union represented"
            yAxisLabel = "crime per 100k of population"
            chartTitle = "crime rate VS Union representation "
            break
        case(4):
            csvName = "unionism_poverty.csv"
            xAxisString = "union_representation_percent_2018"
            yAxisString = "poverty_rate_2017"
            xAxisLabel = "percentage of labor union represented"
            yAxisLabel = "poverty rate in 2017"
            chartTitle = " poverty level VS Union representation "
            break
        case(5):
            csvName = "unionism_unemployment.csv"
            xAxisString = "union_representation_percent_2018"
            yAxisString = "percentage_of_labor_force_unemployed_2019"
            xAxisLabel = "percentage of labor union represented"
            yAxisLabel = "labor force unemployed % in 2017"
            chartTitle = " Unemployment VS Union representation "
            break
        case(9):
            csvName = "welfare_crime.csv"
            xAxisString = "weekly_welfare_dollars_2020"
            yAxisString = "total_crime_per_100k_pop"
            xAxisLabel = "weekly welfare payment in 2020"
            yAxisLabel = "crime rate per 100k population"
            chartTitle = " Crime Rate VS Welfare level "
            break
        case(7):
            csvName = "welfare_poverty.csv"
            xAxisString = "weekly_welfare_dollars_2020"
            yAxisString = "poverty_rate_2017"
            xAxisLabel = "weekly welfare payment in 2020"
            yAxisLabel = "2017 poverty rate "
            chartTitle = "poverty rate  VS Welfare level   "
            break
        case(8):
            csvName = "welfare_unemployment.csv"
            xAxisString = "weekly_welfare_dollars_2020"
            yAxisString = "percentage_of_labor_force_unemployed_2019"
            xAxisLabel = "weekly welfare payment in 2020"
            yAxisLabel = "% labor force unemployed 2019 "
            chartTitle = " poverty rate VS Welfare level "
            break



    }

    d3.select("svg").remove();




// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var title = d3.select(".chart-title");
    var equation = d3.select(".equation");
    var rval = d3.select(".r-value");


    title.html(chartTitle);


// Import Data
    d3.csv(csvName).then(function (dataSet) {
        var dataArray = []
        var maxX = 0.0;
        var minX = 1000000.0;
        // Step 1: Parse Data/Cast as numbers
        // ==============================
        dataSet.forEach(function (data) {
            // data.minimum_wage_2018 = +data.minimum_wage_2018;
            data.xAxis = +(Object.byString(data, xAxisString))
            data.yAxis = +(Object.byString(data, yAxisString))
            dataArray.push([+data.xAxis, +data.yAxis])
            if (+data.xAxis > maxX) {
                maxX = +data.xAxis
            }
            if (+data.xAxis < minX) {
                minX = +data.xAxis
            }

        });

        /**
         * calculate linear regression
         */
        console.log(dataArray)
        // get slope and intercept values
        var linearReg = ss.linearRegression(dataArray)
        console.log(linearReg)
        // get function for convert x value into y vale
        var linearRegressionLine = ss.linearRegressionLine(linearReg)
        console.log(linearRegressionLine)

        // calculate r squared value
        var rValString = "R squared value is: " + ss.rSquared(dataArray, linearRegressionLine)


        // calculate regression line function
        if (linearReg.b > 0) {
            var regressionLineFunction = "Linear Regression Line: y = " + linearReg.m + "x + " + linearReg.b
        } else {
            var regressionLineFunction = "Linear Regression Line: y = " + linearReg.m + "x " + linearReg.b
        }
        console.log(regressionLineFunction)
        equation.html(regressionLineFunction);
        rval.html(rValString);


        /** get a couple of points for regression line
         *
         */
        var regressionPoints = []

        // any x value
        //var lineXPointOne = dataArray[0][0]
        var lineXPointOne = minX
        // largest x value
        var lineXPointTwo = maxX

        var lineYPointOne = linearRegressionLine(lineXPointOne)
        var lineYPointTwo = linearRegressionLine(lineXPointTwo)

        regressionPoints.push({x: lineXPointOne, y: lineYPointOne})
        regressionPoints.push({x: lineXPointTwo, y: lineYPointTwo})


        console.log(regressionPoints)


        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet, d => d.xAxis)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(dataSet, d => d.yAxis)])
            .range([height, 0]);

        /** create D3 line for regression line
         *
         */

        var regressionLine = d3.line()
            .x(regressionPoints, d => xLinearScale(d.x))
            .y(regressionPoints, d => yLinearScale(d.y))


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
            .html(function (d) {
                return (`${d.state}<br>y value: ${d.yAxis}<br>x value: ${d.xAxis}`);
            });


        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================


        circlesGroup.on("click", function (data) {
            toolTip.show(data, this);
        })
            // onmouseout event
            .on("mouseout", function (data, index) {
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

        /***
         * append regression line to SVG
         */

        chartGroup.append("path")
            .datum(regressionPoints)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line = d3.line()
                .x(function (d) {
                    return xLinearScale(d.x);
                }) // set the x values for the line generator
                .y(function (d) {
                    return yLinearScale(d.y);
                }) // set the y values for the line generator
            )

        chartGroup.append("text")
            .attr("transform", `translate(${width / 3.5}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text(xAxisLabel);


    }).catch(function (error) {
        console.log(error);
    });

}
