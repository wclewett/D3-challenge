// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("fill", "white");

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set initial axis names
var xLabel = "poverty"
var yLabel = "healthcare"

// Load data from .csv file
d3.csv("assets/data/data.csv").then(function(data) {

    var statesData = data;
    // Print the data
    console.log(statesData);

    // Parse data and cast to numeric
    statesData.forEach(function(data) {
        data.poverty    = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age        = +data.age;
        data.smokes     = +data.smokes;
        data.obesity    = +data.obesity;
        data.income     = +data.income;
      });
    
    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the xLinearScale function
    var xLinearScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([d3.min(statesData, data => data[xLabel]) - 2, d3.max(statesData, data => data[xLabel]) + 2]);

    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the yLinearScale function
    var yLinearScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([d3.min(statesData, data => data[yLabel]) - 2, d3.max(statesData, data => data[yLabel]) + 2]);

    // Initialize axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
      
    // Append x and y axes to the chart
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Create scatterplot and append initial circles
    var circlesGroup = chartGroup.selectAll("g circle")
        .data(statesData)
        .enter()
        .append("g")

    // Append (x, y) locations for circles
    var circlesLoc = circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[xLabel]))
        .attr("cy", d => yLinearScale(d[yLabel]))
        .attr("r", 17)
        .classed("stateCircle", true);   

    // Add labels for circles
    var circlesLabel = circlesGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d[xLabel]))
        .attr("dy", d => yLinearScale(d[yLabel]) + 5)
        .classed("stateText", true);

    // Create group for xAxis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty") // value to grab for event listener
        .text("In Poverty (%)")
        .classed("active", true);

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age") // value to grab for event listener
        .text("Age (Median)")
        .classed("inactive", true);

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income") // value to grab for event listener
        .text("Household Income (Median)")
        .classed("inactive", true);

    // Create group for yAxis labels
    var ylabelsGroup = chartGroup.append("g");

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -40)
        .attr("value", "healthcare") // value to grab for event listener
        .text("Lacks Healthcare (%)")
        .classed("active", true);

    var smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("value", "smokes") // value to grab for event listener
        .text("Smokes (%)")
        .classed("inactive", true);

    var obeseLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -80)
        .attr("value", "obesity") // value to grab for event listener
        .text("Obese (%)")
        .classed("inactive", true);

    });
