var margin = {top: 150, right: 50, bottom: 50, left: 50},
    margin2 = {top: 10, right: 50, bottom: 400, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2,0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");
    yAxis2 = d3.svg.axis().scale(y2).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);
         
var parseTime = d3.time.format("%B %Y").parse;

 var line1 = d3.svg.line()
        .x(function(d) { return x(d.date);})
        .y(function(d) { return y(d.count);});


var line2 = d3.svg.line()
        .x(function(d) { return x2(d.date);})
        .y(function(d) { return y2(d.count);});
var area = d3.svg.area()
    .interpolate("linear")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.count); });

var area2 = d3.svg.area()
    .interpolate("linear")
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.count); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("unHealth.csv", type, function(error, data) {


  x.domain(d3.extent(data.map(function(d) { return d.date; })));
  y.domain([0, d3.max(data.map(function(d) { return d.count; }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());


// normal stuff
  focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
 

  focus.append("path")
      .datum(data)
      .attr("class", "path overviewPath")
      .attr("d", line1);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);

focus.selectAll('.point')
    .append("g")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", 'point')
     .attr("r", 2)
    .attr("cx", function(d){return x(d.date);})
    .attr("cy", function(d){return y(d.count);})
    .on('mouseover',   function(){d3.select(this).attr('r', 4);})
    .on('mouseout', function(){d3.select(this).attr('r', 2);})

  context.append("path")
      .datum(data)
      .attr("class", "path overviewPath")
      .attr("d", line2);

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.selectAll('.point')
    .append("g")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", 'point')
     .attr("r", 2)
    .attr("cx", function(d){return x2(d.date);})
    .attr("cy", function(d){return y2(d.count);})
    .on('mouseover',   function(){d3.select(this).attr('r', 4);})
    .on('mouseout', function(){d3.select(this).attr('r', 2);})
//end of normal stuff

  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);


});

function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select(".area").attr("d", area);
  focus.select(".x.axis").call(xAxis);
  focus.select(".overviewPath").attr("d",line1);
  focus.selectAll("circle").attr("cx", function(d){return x(d.date);})
    .attr("cy", function(d){return y(d.count);});
}

function type(d) {
  d.date = parseTime(d.date);
  d.count = +d.count;
  return d;
}