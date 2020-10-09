// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 1026;
var svgHeight = 700;

// Define the chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 100,
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

// Setup second SVG for correlation area
var svg2Width = 1026;
var svg2Height = 100;

// Define the chart's margins as an object
var margin2 = {
    top: 40,
    right: 10,
    bottom: 10,
    left: 10
  };

// Define dimensions of the chart area
var dataWidth = svg2Width - margin.left - margin.right;
var dataHeight = svg2Height - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg2 = d3.select("#linRegress")
  .append("svg")
  .attr("width", svg2Width)
  .attr("height", svg2Height)
  .attr("fill", "white");

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
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight})`);

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
        .attr("x", -(chartHeight / 2))
        .attr("y", -40)
        .attr("value", "healthcare") // value to grab for event listener
        .text("Lacks Healthcare (%)")
        .classed("active", true);

    var smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(chartHeight / 2))
        .attr("y", -60)
        .attr("value", "smokes") // value to grab for event listener
        .text("Smokes (%)")
        .classed("inactive", true);

    var obeseLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(chartHeight / 2))
        .attr("y", -80)
        .attr("value", "obesity") // value to grab for event listener
        .text("Obese (%)")
        .classed("inactive", true);

    
    // Append a group area, then set its margins
    var statsGroup = svg2.selectAll("text")
        .data([1])
        .enter()
        .append("text")
        .attr("transform", `translate(${margin2.left}, ${margin2.right})`);

    // set x y variables for corrCoeff and linRegress
    var xArr = statesData.map(function(data) {
        return data[xLabel];
    });
    var yArr = statesData.map(function(data) {
        return data[yLabel];
    });

    var createLine = d3.line()
        .x(data => xLinearScale(data.x))
        .y(data => yLinearScale(data.y));

    var regressPoints = regressionSetup(statesData, xLabel, yLabel, xArr);

    var plotRegress = chartGroup.append("path")
        .attr("class", "plot")
        .attr("stroke", "purple")
        .attr("stroke-width", "1")
        .attr("fill", "none")
        .attr("d", createLine(regressPoints));

    // Setup corrCoeff
    var corrCoeff = pearson(xArr, yArr);

    // Add the SVG text element to SVG2
    var statsText = statsGroup
        .attr("x", 50)
        .attr("y", 50)
        .text("Correlation Coefficient: " + corrCoeff.toFixed(6))
        .attr("fill", "black");
        
  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
    var value = d3.select(this).attr("value");
    if (value !== xLabel) {
      // replaces xLabel with value
      xLabel = value;

      var xArr = statesData.map(function(data) {
        return data[xLabel];
      });
      // updates scales for new data
      xLinearScale = xScale(statesData, xLabel);
      yLinearScale = yScale(statesData, yLabel);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesLoc = renderXCircles(circlesLoc, xLinearScale, xLabel);

      // updates circles text with new x values
      circlesLabel = renderXText(circlesLabel, xLinearScale, xLabel);

      // updates new linear regression line
      plotRegress = renderRegression(statesData, plotRegress, xLinearScale, yLinearScale, xLabel, yLabel, xArr);

      // update correlation coefficient
      var corrCoeff = pearson(xArr, yArr);

      var statsText = statsGroup
        .attr("x", 50)
        .attr("y", 50)
        .text("Correlation Coefficient: " + corrCoeff.toFixed(6))
        .attr("fill", "black");

      // updates tooltips with new info
      circlesGroup = updateToolTip(circlesGroup, xLabel, yLabel);

      // changes classes to change bold text
      if (xLabel === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (xLabel === "income") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
  });
  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== yLabel) {

      // replaces yLabel with value
      yLabel = value;
      var yArr = statesData.map(function(data) {
        return data[yLabel];
      });
      // updates scales for new data
      xLinearScale = xScale(statesData, xLabel);
      yLinearScale = yScale(statesData, yLabel);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesXY = renderYCircles(circlesLoc, yLinearScale, yLabel);

      // updates circles text with new y values
      circlesLabel = renderYText(circlesLabel, yLinearScale, yLabel);

      // updates tooltips with new info
      circlesGroup = updateToolTip(circlesGroup, xLabel, yLabel);
      
      // updates linear regression line
      plotRegress = renderRegression(statesData, plotRegress, xLinearScale, yLinearScale, xLabel, yLabel, xArr);

      // update correlation coefficient
      var corrCoeff = pearson(xArr, yArr);
      var statsText = statsGroup
        .attr("x", 50)
        .attr("y", 50)
        .text("Correlation Coefficient: " + corrCoeff.toFixed(6))
        .attr("fill", "black");
      // changes classes to change bold text
      if (yLabel === "smokes") {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (yLabel === "obesity"){
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
  });
// initial tooltips
circlesGroup = updateToolTip(circlesGroup, xLabel, yLabel);
});
