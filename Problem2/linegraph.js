/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;

    margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    width = 960 - margin.left - margin.right;

    height = 500 - margin.bottom - margin.top;

    bbVis = {
        x: 0 + 100,
        y: 10,
        w: width - 100,
        h: height - 100
    };

    dataSet = [];

    svg = d3.select("#vis").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });


    d3.csv("timeline.csv", function(data) {
 
    var columns = Object.keys(data[0]);
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < columns.length; j++) {
            data[i][columns[j]] = parseInt(data[i][columns[j]]);
        };
    };
    // this one creates visualization of data without the intermediate points
        return createVis(data);
    // this one will interpolate all the points

    });

    createVis = function(data) {
        var columns = Object.keys(data[0]).slice(1);
        console.log(columns);
        var xAxis, xScale, yAxis,  yScale;

          xScale = d3.scale.linear().domain([0,2050]).range([bbVis.x, bbVis.w]);  // define the right domain generically
          yScale = d3.scale.linear().domain([30000000,10000000000]).range([bbVis.h,0]);
		  // example that translates to the bottom left of our vis space:
		  var visFrame = svg.append("g").attr({
		      "transform": "translate(" + bbVis.x + "," + (bbVis.y + bbVis.h) + ")",
		  	  //....
			  
		  });
		  
		  // visFrame.append("rect");
		  //....
		  
//        yScale = .. // define the right y domain and range -- use bbVis
        line = function(col) 
        {return d3.svg.line()
            .x(function(d) { return xScale(d.year);})
            .y(function(d) { return yScale(d[col]);})
        };

        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (bbVis.h + bbVis.y) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+bbVis.x+"," + bbVis.y+ ")")
      .call(yAxis);
      // add some label text

    colorScale = d3.scale.ordinal().range(["grey","steelblue", "green", "orange", "red"])

    for (var i = 0; i < columns.length; i++) {
        var col = columns[i];

    svg.append("path")
      .datum(data.filter(function(d){return d[col] >-1;}))
      .attr("class", "line")
      .attr("stroke", function(d){console.log(colorScale(col)); return colorScale(col);})
      .attr("d", line(col));
    };
var years = data.map(function(d){return d.year;});

console.log(years.length);
var data_matrix = [];

for (var i =0; i < columns.length;i++)
{
    var arr = data.map(function(d){return d[columns[i]];});
    data_matrix.push(arr);
}
console.log(data_matrix);

radFilter = function(num){
    if (num>-1)
                return 1;
            else
                return 0;
}
for (var i =0; i < columns.length;i++)
{
    var filteredYr = [];
    var startInd = -1;
    var stopInd = 0;
    for (var j = 0; j < years.length; j++) {
        if (data_matrix[i][j] > -1)
            filteredYr.push(years[j]);
        else
            if (startInd == j-1)
                startInd = j;

    };
    var filteredData = data_matrix[i].filter(function(d){return d>-1;});
    var newScale = d3.scale.linear().domain(filteredYr).range(filteredData.map(function(d){return yScale(d);}));
svg.append('g').selectAll('.points')
        .data(data_matrix[i])
        .enter()
        .append("circle")
        .attr("class", 'point')
        .attr("stroke","none")
        .attr("fill",colorScale(columns[i]))
        .attr("fill-opacity", function(d){if (d>-1) return 1; else return 0.25;}) // this differentiates
        .attr("r", function(d,num){if (num >startInd) return 1.5; else return 0;})
        .attr("cx", function(d, num){ return xScale(years[num]);})
        .attr("cy", function(d,num){return newScale(years[num]);})
        .on('mouseover',   function(){d3.select(this).attr('r', 3);})
        .on('mouseout', function(){d3.select(this).attr('r', 1.5);})
}
    };
    