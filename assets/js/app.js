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
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// Load data from .csv file
d3.csv("assets/data/data.csv").then(function(data) {

    // Print the data
    console.log(data);
    });
  