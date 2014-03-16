var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 100,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

bbOverview = {
    x: margin.left,
    y: 10,
    w: width,
    h: 80
};

bbDetail = {
    x: margin.left,
    y: 150,
    w: width,
    h: 400
};

dataSet = [];

svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });


d3.csv("unHealth.csv", function(data) {
        var parseTime = d3.time.format("%B %Y").parse

        
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.count = parseInt(d.count);
        });
        console.log(data);
    createOverview(data);
    createDetails(data);

    brush = d3.svg.brush().x(xOverviewScale).on("brush", brushed);
});

createOverview = function (data) {
    var xAxis, xScale, yAxis,  yScale;
    overview = svg.append("g");
    xScale = d3.time.scale().range([bbOverview.x, bbOverview.w]);  // define the right domain generically
    yScale = d3.scale.linear().domain([0,300000]).range([bbOverview.h,0]);
    xScale.domain(d3.extent(data, function(d) { return d.date; }));

 var line = d3.svg.line()
        .x(function(d) { return xScale(d.date);})
        .y(function(d) { return yScale(d.count);});
    
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    overview.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (bbOverview.h) + ")")
      .call(xAxis);

    overview.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+bbOverview.x+"," + 0+ ")")
      .call(yAxis);

  overview.append("path")
      .datum(data)
      .attr("class", "path overviewPath")
      .attr("d", line);

overview.selectAll('.point')
    .data(data)
    .enter()
    .append("circle")
    .attr("class", 'point')
     .attr("r", 2)
    .attr("cx", function(d){return xScale(d.date);})
    .attr("cy", function(d){return yScale(d.count);})
    .on('mouseover',   function(){d3.select(this).attr('r', 4);})
    .on('mouseout', function(){d3.select(this).attr('r', 2);})
    // .on('click', (d, i) -> console.log d, i)


}

createDetails = function(data){
   var xAxis, xScale, yAxis,  yScale;
   detail = svg.append("g");
    xScale = d3.time.scale().range([bbDetail.x, bbDetail.w]);  // define the right domain generically
    yScale = d3.scale.linear().domain([0,300000]).range([bbDetail.h,bbDetail.y]);
    xScale.domain(d3.extent(data, function(d) { return d.date; }));

 var line = d3.svg.line()
        .x(function(d) { return xScale(d.date);})
        .y(function(d) { return yScale(d.count);});
    
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    detail.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (bbDetail.h) + ")")
      .call(xAxis);

    detail.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+bbDetail.x+"," + 0+ ")")
      .call(yAxis);

  detail.append("path")
      .datum(data)
      .attr("class", "path deailPath")
      .attr("d", line);
paths = detail.select("path.deailPath");

detail.selectAll('.point')
    .data(data)
    .enter()
    .append("circle")
    .attr("class", 'point')
     .attr("r", 2)
    .attr("cx", function(d){return xScale(d.date);})
    .attr("cy", function(d){return yScale(d.count);})
    .on('mouseover',   function(){d3.select(this).attr('r', 4);})
    .on('mouseout', function(){d3.select(this).attr('r', 2);})

var area = d3.svg.area()
    .x(function(d){return xScale(d.date);})
    .y0(bbDetail.h)
    .y1(function(d){return yScale(d.count);});
    detail.append("path")
        .datum(data)
        .attr("class", "detailArea")
        .attr("d",area);
}
var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

