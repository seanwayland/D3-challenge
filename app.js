/** function to pass string in and select object keys
 *
 */

Object.byString = function (o, s) {
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

/**
 *
 set up page
 */

var combinedSelection = 1
render(combinedSelection)

var xAxisSelection = 1
var yAxisSelection = 1

var wageButton = d3.select("#wage");
var unionButton = d3.select("#union");
var welfareButton = d3.select("#welfare");
var povertyButton = d3.select("#poverty");
var unemploymentButton = d3.select("#unemployment");
var crimeButton = d3.select("#crime");

wageButton.on("click", function() {
    xAxisSelection = 1
 combinedSelection  = (xAxisSelection-1)*3 + yAxisSelection
    console.log(xAxisSelection)
    console.log(yAxisSelection)
    console.log(combinedSelection)
    render(combinedSelection)

});

unionButton.on("click", function() {


    xAxisSelection = 2
    combinedSelection  = (xAxisSelection-1)*3 + yAxisSelection
    console.log(xAxisSelection)
    console.log(yAxisSelection)
    console.log(combinedSelection)
    render(combinedSelection)


});

welfareButton.on("click", function() {
    xAxisSelection = 3
    combinedSelection  = (xAxisSelection-1)*3 + yAxisSelection
    console.log(xAxisSelection)
    console.log(yAxisSelection)
    console.log(combinedSelection)
    render(combinedSelection)
});

povertyButton.on("click", function() {
    yAxisSelection = 1
    combinedSelection  = (xAxisSelection-1)*3 + yAxisSelection
    console.log(xAxisSelection)
    console.log(yAxisSelection)
    console.log(combinedSelection)
    render(combinedSelection)
});

unemploymentButton.on("click", function() {
    yAxisSelection = 2
    combinedSelection  = (xAxisSelection-1)*3 + yAxisSelection
    console.log(xAxisSelection)
    console.log(yAxisSelection)
    console.log(combinedSelection)
    render(combinedSelection)

});


crimeButton.on("click", function() {
    yAxisSelection = 3
    combinedSelection  = (xAxisSelection-1)*3 + yAxisSelection
    console.log(xAxisSelection)
    console.log(yAxisSelection)
    console.log(combinedSelection)
    render(combinedSelection)


});








