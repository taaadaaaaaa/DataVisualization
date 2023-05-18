// set the dimensions and margins of the graph
var
w = 500,
h = 600;

// append the chart object to the body of the page
var chart = d3.select("#chart2")
.append("svg")
.attr("width", w + 190)
.attr("height", h + 60)
.append("g")
.attr("transform","translate(" + 200 + "," + 0 + ")");

// Parse the Data
d3.csv("../csv/data.csv").then(function(data) {
data.forEach(function(d) {
    d.max = +d.max;
});

// Search fot max or min value of the data to set the chart axis
var max = d3.max(data, function(d) { return d.max; })
var min = d3.min(data, function(d) { return d.min; })

// Add X axis
var x = d3.scaleLinear()
.domain([min - 1, max + 3])
.range([ 0, w]);
chart.append("g")
.attr("transform", "translate(0," + h + ")")
.call(d3.axisBottom(x))
.attr("font-family","Times New Roman")
.attr("font-size", "14");

// Y axis
var y = d3.scaleBand()
.range([ 0, h])
.domain(data.map(function(d) { return d.expense; }))
.padding(1);
chart.append("g")
.call(d3.axisLeft(y))
.attr("font-family","Times New Roman")
.attr("font-size", "14");

// Add the x axis label
chart.append("text")
    .attr("text-anchor", "end")
    .attr("x", w/2)
    .attr("y", h + 45)
    .text("AUD")
    .style("font-size", "18px")
    .attr("font-family","Times New Roman")
    .attr("font-weight", "bold");
    
// Add the y axis label
chart.append("text")
    .attr("text-anchor", "start")
    .attr("x", -130)
    .attr("y", 15)
    .text("Expenses")
    .attr("font-family","Times New Roman")
    .attr("font-weight", "bold")
    .attr("font-size", "18px");
    
// Lines 1
chart.selectAll("myline")
.data(data)
.enter()
.append("line")
.attr("x1", function(d) { return x(d.min); })
.attr("x2", function(d) { return x(d.current); })
.attr("x3", function(d) { return x(d.max); })
.attr("y1", function(d) { return y(d.expense); })
.attr("y2", function(d) { return y(d.expense); })
.attr("y3", function(d) { return y(d.expense); })
.attr("stroke", "grey")
.attr("stroke-width", "1px");

// Lines
chart.selectAll("myline")
.data(data)
.enter()
.append("line")
.attr("x1", function(d) { return x(d.current); })
.attr("x2", function(d) { return x(d.max); })
.attr("y1", function(d) { return y(d.expense); })
.attr("y2", function(d) { return y(d.expense); })
.attr("stroke", "grey")
.attr("stroke-width", "1px");

// Circles of Min expense value
chart.selectAll("mycircle")
.data(data)
.enter()
.append("circle")
.attr("class","circle")
.attr("cx", function(d) { return x(d.min); })
.attr("cy", function(d) { return y(d.expense); })
.attr("r", "4")
.style("fill", "#0000b3")
.style('opacity', 1)
.on("mouseover", function (event, d) {
  // Remove any existing tooltips
    chart.selectAll(".tooltip").remove();
  d3.select(this)
    .attr("r", 6);
  chart.selectAll("circle:not(:hover)")
    .transition()
    .duration(200)
    .style('opacity', 0.2);
  // Show data value when it being hovered on
  chart.append("text")
    .attr("class", "tooltip")
    .attr("x", 10)
    .attr("y", y(d.expense) - 20)
    .text(`${d.expense}'s minimum cost: ${d.min}`)
    .style("font-size", "14px")
    .attr("font-family","Times New Roman");
  })
// When the user not hover on that bar anymore, make every other bars normal again
.on('mouseout', function(event, d) {
  // set the opacity of non-hovered circles back to normal
  d3.select(this)
  .attr("r", 4);
  chart.selectAll("circle:not(:hover)")
    .transition()
    .duration(200)
    .style('opacity', 1)});
  // Hide the tooltip
  chart.select(".tooltip").remove();

// Circles of Current expense value
chart.selectAll("mycircle")
.data(data)
.enter()
.append("circle")
.attr("class","circle")
.attr("cx", function(d) { return x(d.current); })
.attr("cy", function(d) { return y(d.expense); })
.attr("r", "4")
.style("fill", "#009fff")
.style('opacity', 1)
.on("mouseover", function (event, d) {
  // Remove any existing tooltips
  chart.selectAll(".tooltip").remove();
  d3.select(this)
    .attr("r", 6);
  // Set all the non-hover dot to normal status
  chart.selectAll("circle:not(:hover)")
    .transition()
    .duration(200)
    .style('opacity', 0.2);
  // Show data value when it being hovered on
  chart.append("text")
    .attr("class", "tooltip")
    .attr("x", 10)
    .attr("y", y(d.expense) - 20)
    .text(`${d.expense}'s currently cost: ${d.current}`)
    .style("font-size", "14px")
    .attr("font-family","Times New Roman");
  })
// When the user not hover on that bar anymore, make every other bars normal again
.on('mouseout', function(event, d) {
  // set the opacity of non-hovered circles back to normal
  d3.select(this)
  .attr("r", 4);
  // Set all the non-hover dot to normal status
  chart.selectAll("circle:not(:hover)")
    .transition()
    .duration(200)
    .style('opacity', 1)});
  // Hide the tooltip
  chart.select(".tooltip").remove();

// Circles of Max money value
chart.selectAll("mycircle")
.data(data)
.enter()
.append("circle")
.attr("class","circle")
.attr("cx", function(d) { return x(d.max); })
.attr("cy", function(d) { return y(d.expense); })
.attr("r", "4")
.style("fill", "#00ffff")
.style('opacity', 1)
.on("mouseover", function (event, d) {
  // Remove any existing tooltips
  chart.selectAll(".tooltip").remove();
  d3.select(this)
    .attr("r", 6);
  // Set all the non-hover dot to normal status
  chart.selectAll("circle:not(:hover)")
    .transition()
    .duration(200)
    .style('opacity', 0.2);
  // Show data value when it being hovered on
  chart.append("text")
    .attr("class", "tooltip")
    .attr("x", 20)
    .attr("y", y(d.expense) - 20)
    .text(`${d.expense}'s maximum cost: ${d.max}`)
    .style("font-size", "14px")
    .attr("font-family","Times New Roman");
  })
// When the user not hover on that bar anymore, make every other bars normal again
.on('mouseout', function(event, d) {
  // set the opacity of non-hovered circles back to normal
  d3.select(this)
  .attr("r", 4);
  // Set all the non-hover dot to normal status
  chart.selectAll("circle:not(:hover)")
    .transition()
    .duration(200)
    .style('opacity', 1)});
  // Hide the tooltip
  chart.select(".tooltip").remove();
},)