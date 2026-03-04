// Hint: This is a great place to declare your global variables
var femaleData;
var maleData;
const countries = ["Argentina", "Belgium", "Egypt", "Germany", "India"];
var prevCountry = "Initial";

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
    
   // This will load your CSV files and store them into two arrays.
   Promise.all([d3.csv('data/females_data.csv'),d3.csv('data/males_data.csv')])
        .then(function (values) {
            console.log('Loaded the females_data.csv and males_data.csv');
            var femaleDataAll = values[0];
            var maleDataAll = values[1];

            // female data
            femaleData = []
            for (let i = 0; i < femaleDataAll.length; i++) {
                femaleData.push( {
                    "Year": femaleDataAll[i]["Year"],
                    "Argentina": parseFloat(femaleDataAll[i][countries[0]]),
                    "Belgium": parseFloat(femaleDataAll[i][countries[1]]),
                    "Egypt": parseFloat(femaleDataAll[i][countries[2]]),
                    "Germany": parseFloat(femaleDataAll[i][countries[3]]),
                    "India": parseFloat(femaleDataAll[i][countries[4]]),
                });
                
            }
            // male data
            maleData = []
            for (let i = 0; i < maleDataAll.length; i++) {
                maleData.push( {
                    "Year": maleDataAll[i]["Year"],
                    "Argentina": parseFloat(maleDataAll[i][countries[0]]),
                    "Belgium": parseFloat(maleDataAll[i][countries[1]]),
                    "Egypt": parseFloat(maleDataAll[i][countries[2]]),
                    "Germany": parseFloat(maleDataAll[i][countries[3]]),
                    "India": parseFloat(maleDataAll[i][countries[4]]),
                });
                
            }
            // draw lollipop chart at start
            drawLollipopChart(countries[0]);
        });

    
});



function handleCountryChange(){
    var selectedCountry = document.getElementById("countryDropdown").value;
    console.log('change country' + selectedCountry);
    drawLollipopChart(selectedCountry);
}

function addlegendNTitles(svg, width, height, margin){
    // Add legend
    var legend = svg.append('g')
    .attr('transform', 'translate(' + (width - 200) + ', 0)');

    legend.append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#FF10F0') // Female color
    .attr('y', -13);

    legend.append('text')
    .attr('x', 20)
    .attr('y', 0)
    .text('Female Employment Rate')
    .style('font-size', '14px');

    legend.append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', '#0000FF') // Male color
    .attr('y', 12);

    legend.append('text')
    .attr('x', 20)
    .attr('y', 25)
    .text('Male Employment Rate')
    .style('font-size', '14px');

    // Add x-axis title
    svg.append('text')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height + margin.bottom ) + ')')
    .style('text-anchor', 'middle')
    .text('Year')
    .style('font-size', '16px'); 

    // Add y-axis title
    svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Employment Rate')
    .style('font-size', '16px'); 
}

function drawLollipopChart(country) {
    console.log('trace:drawLolliPopChart() ' + country);

    
    // get max value
    var maxDataFemale = d3.max(femaleData, function(d) { return d[country]; });
    var maxDataMale = d3.max(maleData, function(d) { return d[country]; });
    

    var margin = {top: 40, right: 20, bottom: 40, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    
    var svg = d3.select('#myDataVis').select('svg');

    if ( svg.empty() ) {
        // append the svg object to the body of the page
        svg = d3.select("#myDataVis")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // X axis
        var x = d3.scaleTime()
        .range([ 0, width ])
        .domain([new Date(1990,0,1), new Date(2023,0,1)]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)")
            .style("text-anchor", "end");
        
        
        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0,Math.max(maxDataFemale, maxDataMale)])
        .range([ height, 0]);
        svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
        
        prevCountry = country;

        // add Legend
        addlegendNTitles(svg, width, height, margin);

        // Female data
        // Lines
        var femaleLines = svg.selectAll("myline")
        .data(femaleData)
        .enter()
        .append("line")
            .attr("class", "femaleLine")
            .attr("x1", function(d) { return x(new Date(d['Year'],0,1)) + 5; })
            .attr("x2", function(d) { return x(new Date(d['Year'],0,1)) + 5; })
            .attr("y1", function(d) { return y(d[country]); })
            .attr("y2", y(0))
            .attr("stroke", "#FF10F0");

        // Circles
        var femaleCircle = svg.selectAll("mycircle")
        .data(femaleData)
        .enter()
        .append("circle")
            .attr("class", "femaleCircle")
            .attr("cx", function(d) { return x(new Date(d['Year'],0,1)) + 5; })
            .attr("cy", function(d) { return y(d[country]); })
            .attr("r", "4")
            .style("fill", "#FF10F0")
            .attr("stroke", "#FF10F0");

        // Male data
        // Lines
        var maleLines = svg.selectAll("myline")
        .data(maleData)
        .enter()
        .append("line")
            .attr("class", "maleLine")
            .attr("x1", function(d) { return x(new Date(d['Year'],0,1)) - 5; })
            .attr("x2", function(d) { return x(new Date(d['Year'],0,1)) - 5; })
            .attr("y1", function(d) { return y(d[prevCountry]); })
            .attr("y2", y(0))
            .attr("stroke", "#0000FF");

        // Circles
        var maleCircles = svg.selectAll("mycircle")
        .data(maleData)
        .enter()
        .append("circle")
            .attr("class", "maleCircle")
            .attr("cx", function(d) { return x(new Date(d['Year'],0,1)) - 5; })
            .attr("cy", function(d) { return y(d[prevCountry]); })
            .attr("r", "4")
            .style("fill", "#0000FF")
            .attr("stroke", "#0000FF");

        console.log(maleLines);

    }
    else {
        var x = d3.scaleTime()
        .range([ 0, width ])
        .domain([new Date(1990,0,1), new Date(2023,0,1)]);

        var y = d3.scaleLinear()
        .domain([0,Math.max(maxDataFemale, maxDataMale)])
        .range([ height, 0]);

        svg.selectAll(".y-axis")
        .transition()
        .duration(2000)
        .call(d3.axisLeft(y));

        svg.selectAll(".femaleLine")
        .data(femaleData)
        .transition()
        .duration(2000)
        .attr("y1", function(d) { return y(d[country]); });

        svg.selectAll(".femaleCircle")
        .data(femaleData)
        .transition()
        .duration(2000)
        .attr("cy", function(d) { return y(d[country]); });

        svg.selectAll(".maleLine")
        .data(maleData)
        .transition()
        .duration(2000)
        .attr("y1", function(d) { return y(d[country]); });
  
    
        svg.selectAll(".maleCircle")
        .data(maleData)
        .transition()
        .duration(2000)
        .attr("cy", function(d) { return y(d[country]); });
    }
    
    // set previous country
    prevCountry = country;
    
}


