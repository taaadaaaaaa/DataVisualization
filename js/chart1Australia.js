// Set up the data for the waterfall chart
d3.csv("./csv/AustraliaData1.csv").then(function(data)
{
    waterfallChart(data);
})

// Draw waterfall chart
function waterfallChart(data)
{
    // Set up the dimensions of the chart
    const margin = {top: 70, right: 30, bottom: 60, left: 80}
    const width = document.querySelector('.col-4').offsetWidth  - margin.left - margin.right;
    const height = document.querySelector('#chart1').offsetHeight * 0.8 - margin.top - margin.bottom;

    // Calculate the starting and ending values for each data point
    let initial = 0;
    for (let i = 0; i < data.length; i++)
    {
        // Adjust the value of the first bar to rescale the chart
        if (i == 0)
        {
            data[i].start = initial + 130000;
            initial += (+data[i].Total);
            data[i].end = initial;
        }
        else
        {
            data[i].start = initial;
            initial += (+data[i].Total - +data[i-1].Total);
            data[i].end = initial;
        }
    }

    // Set up the x and y scales for the chart
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.Year))
        .paddingInner(0.1);
        
    const y = d3.scaleLinear()
        .domain([130000, d3.max(data, (d) => +d.end) *1.02 ])
        .range([height, 0]);

    // Create the SVG element and set its dimensions
    const svgAus = d3
    .select("#chart1")
    .append("svg")
    .attr("id", "Australia")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add the chart title
    svgAus.append("text")
    .attr("id", "chart-title")
    .attr("x", width / 2)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .text("Population Growth in Australia")
    .style("font-size", "24px")
    .style("font-weight", 700)
    ;

    // Add the x-axis labels to the chart
    svgAus.append("g")
        .attr("id", "x-axis")
        .style("font-size", "14px")
        .attr("font-family","Times New Roman")
        .call(d3.axisBottom(x))
        .attr("transform", `translate(0, ${height})`)
        .style("font-weight", 550)
        .style("color", "#777");

    // Add the y-axis labels to the chart
    svgAus.append("g")
        .style("font-size", "14px")
        .attr("font-family","Times New Roman")
        .call(d3.axisLeft(y)
                    .tickFormat(d3.format(".2s"))
                    .ticks(data.length * 2))
        .selectAll(".tick text")
        .style("color", "#777") 
        // Hide the 0 value of the y-axis
        .style("visibility", (d, i, nodes) =>
        {
            if (i === 0)
            {
                return "hidden"; 
            }
            else
            {
                return "visible"; 
            }
        })
        .style("font-weight", 550);

    // Add the x-axis label
    svgAus.append("text")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .text("CENSUS YEARS")
        .style("font-size", "18px")
        .style("font-weight", 700)
        .attr("font-family","Times New Roman");

    // Add the y axis label
    svgAus.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -70)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("NUMBER OF PEOPLE")
        .attr("font-family","Times New Roman")
        .attr("font-size", "18px")
        .style("font-weight", 700);

    // Add the bars to the chart
    svgAus.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("id", (d) => d.Year)
        .attr("class", (d,i) => "bar " + ((i > 0 && +d.Total < +data[i-1].Total) ? "negative" : "positive")) // Assign the bar of the chart to customize the bar color on CSs.
        .attr("x", (d) => x(d.Year))
        .attr("y", (d) => y(Math.max(d.start, d.end)))
        .attr("width", x.bandwidth())
        // Apply effect that when user hover a bar, other bars will faded
    .on("mouseover", function (event, d)
        {
            // Show a small box about the bar's value being hover on
            d3.select(this).append("title").text(`${d.Year}: ${d3.format(",")(+d.Total)}`);

            // Emphasize the bar being hovered on
            d3.select(this).style("opacity", 1);
            svgAus.selectAll(".bar:not(:hover)").style("opacity", 0.1);

            // Check the class of the bar being hovered on
            const isNegative = d3.select(this).classed("negative");

            // Calculate the label position based on the class
            const labelPosition = isNegative ? y(d.end) + 20 : y(d.end) - 10;

            // Add the label for the bar
            svgAus.append("text")
                .attr("id", "hover-label")
                .attr("x", x(d.Year) + x.bandwidth() / 2)
                .attr("y", labelPosition)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .text(d3.format(",")(d.Total));

            // Add the circle on the line at the point being hovered
            const circle = svgAus.append("circle")
                .attr("class", "line-circle")
                .attr("r", 4)
                .style("opacity", 0)
                .attr("cx", x(d.Year) + x.bandwidth() / 2)
                .attr("cy", y(d.Total))
                .style("opacity", 1);

            // Retrieve the id of the current bar to define the year's data in order to draw the pie chart
            const wantedYear = d3.select(this).attr("id");

            // Draw the pie chart demonstrates the data of the year that the hovered bar represent
            pieChartData(wantedYear).then(function(data)
            {
                pieChart(data, wantedYear);
            });
        })
    // When the user not hover on that bar anymore, make every other bars normal again
    .on("mouseout", function (event, d)
        {
            // Make all the bar opacity turn back to normal when mouseout
            svgAus.selectAll(".bar").style("opacity", 1);

            // Remove the label of the bar being hovered on of the bar chart
            svgAus.select("#hover-label").remove();

            // Remove the pie chart when mouseout
            d3.selectAll(".subChart").remove();
            
            // Remove the circle on the line of the bar chart when mouseout
            d3.select(".line-circle").remove();
            
        })
    .transition()
    .duration(1000)
    .attr("height", (d) => Math.abs(y(d.start) - y(d.end)));

    // Append line to the chart
    const line = d3.line()
                    .x(function(d) {return x(d.Year)})
                    .y(function(d) {return y(d.Total)});

    // Draw the line on the chart
    svgAus.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#1260cc")
        .attr("stroke-width", "1")
        .attr("transform", `translate(${x.bandwidth() / 2},0)`)
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Create an arrow for y-axis
    svgAus.append('path')
        .attr('class', 'arrow')
        .attr('d', 'M0,-5L10,0L0,5')
        .style('fill', '#999')
        .style("transform", "rotate(-90deg)");

    // Create an arrow for x-axis
    svgAus.append('path')
        .attr('class', 'arrow')
        .attr('d', 'M0,-5L10,0L0,5')
        .style('fill', '#999')
        .attr("transform", `translate(${width}, ${height})`);
}

// // Draw pie chart
function pieChart(data, year)
{
    // Extract the values from the data object
    const labels = Object.keys(data);
    const values = Object.values(data).map(Number);

    // Set up the dimensions of the pie chart
    const width = document.querySelector('.col-3').offsetWidth;
    const height = document.querySelector('.col-3').offsetWidth * 0.8;

    const radius = Math.min(width, height) / 2;

    // Create the SVG element for pie chart
    const pieSvgAus = d3.select("#subchart1")
        .append("svg")
        .attr("class","subChart")
        .attr("width", width)
        .attr("height", height * 2)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2 + 80})`);

    // Define the color scale
    const color = d3.scaleOrdinal(["#7fc97f","#beaed4","#fdc086","#f0027f","#bf5b17","#666666"]);

    // Define the pie layout
    const pie = d3.pie()
                  .value(d => d)
                  .sort(null);

    // Generate the pie chart
    const path = d3.arc()
                   .outerRadius(radius - 10)
                   .innerRadius(radius / 2);

    const arcs = pieSvgAus.selectAll("arc")
                    .data(pie(values))
                    .enter()
                    .append("g")
                    .attr("class", "arc");

    // Append the path to the created arc on the values retrieved
    arcs.append("path")
        .attr("d", path)
        .attr("fill", (d, i) => color(i))
        .style("opacity", 0)
        .transition()
        .duration(400)
        .style("opacity", 1);

    // Append label for each arc created
    arcs.append("text")
        .attr("transform", d => `translate(${path.centroid(d)})`)  
        .text((d, i) => `${values[i].toFixed(2)}%`)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold");

    // // Add a container for the legends for the pie chart ( positioned at the bottom of the pie chart)
    const legendGroup = pieSvgAus.append("g")
        .attr("class","pieChartLegend")
        .attr("transform", `translate(${-width/2}, ${height / 2})`);

    // Create individual legend container
    const legend = legendGroup.selectAll(".legend")
        .data(labels)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    // Create the rectangle contain the color to show the label for the arcs
    legend.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", (d, i) => color(i));

    // Create the label's category for the arcs
    legend.append("text")
        .attr("class", "pie-legend")
        .text((d) => d)
        .attr("fill", (d, i) => color(i))
        .attr("x", 20)
        .attr("y", 15)
        .attr("font-size", "0.95rem");

    // Append the title for the pie chart
    pieSvgAus.append("text")
        .attr("class", "chartTitle")
        .attr("x", 0)
        .attr("y", `${-radius - 50}`) // Adjust the vertical position of the title as needed
        .attr("text-anchor", "middle")
        .text(`Immigration Reasons to Australia in ${year}`)
        .style("font-weight", 700);
};

// Function retrieve the data for the pie chart
function pieChartData(year)
{
    // Retrieve the data from the csv file
    return d3.csv("./csv/AustraliaData1.csv").then(function (data)
    {
        // Take the data for the pie chart based on the required year
        const filteredData = data.find((row) => row.Year === year);

        const extractedData =
        {
            Skill: parseFloat(filteredData["%skill"]),
            Family: parseFloat(filteredData["%family"]),
            SpecialEligibility: parseFloat(filteredData["%special"]),
        };

        return extractedData;
    });
}