var bbDetail, bbOverview, dataSet, svg, xAxis1, xAxis2, xScale, yScale, xScale2, yScale2, detail;

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

var area = d3.svg.area()
    .interpolate("linear")
    .x(function(d) { return xScale(d.date); })
    .y0(bbOverview.h)
    .y1(function(d) { return yScale(d.count); });


  var area2 = d3.svg.area()
    .interpolate("linear")
    .x(function(d) { return xScale2(d.date); })
    .y0(bbDetail.h)
    .y1(function(d) { return yScale2(d.count); });

svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var brush = d3.svg.brush().x(xScale).on("brush", brushed);

d3.csv("unHealth.csv", function(data) {
        var parseTime = d3.time.format("%B %Y").parse

        
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.count = parseInt(d.count);
        });
    createDetails(data);       
    createOverview(data);


});

createOverview = function (data) {
    var yAxis;
    overview = svg.append("g");
    xScale = d3.time.scale().range([bbOverview.x, bbOverview.w]);  // define the right domain generically
    yScale = d3.scale.linear().domain([0,300000]).range([bbOverview.h,0]);
    xScale.domain(d3.extent(data, function(d) { return d.date; }));

 var line = d3.svg.line()
        .x(function(d) { return xScale(d.date);})
        .y(function(d) { return yScale(d.count);});
    
    xAxis1 = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    // xAx = xAxis1;

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

     overview.append("path")
      .datum(data)
      .attr("class", "area detailArea")
      .attr("d", area);

    overview.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (bbOverview.h) + ")")
      .call(xAxis1);



    overview.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+bbOverview.x+"," + 0+ ")")
      .call(yAxis);

  overview.append("path")
      .datum(data)
      .attr("class", "path overviewPath")
      .attr("d", line);

overview.selectAll('.point')
    .append("g")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", 'point')
     .attr("r", 2)
    .attr("cx", function(d){return xScale(d.date);})
    .attr("cy", function(d){return yScale(d.count);})
    .on('mouseover',   function(){d3.select(this).attr('r', 4);})
    .on('mouseout', function(){d3.select(this).attr('r', 2);})
svg.append("g").attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("height", height + 7)
      .attr("transform", "translate(20,100)");

}

createDetails = function(data){
   var yAxis;
   detail = svg.append("g");
    xScale2 = d3.time.scale().range([bbDetail.x, bbDetail.w]);  // define the right domain generically
    yScale2 = d3.scale.linear().domain([0,300000]).range([bbDetail.h,bbDetail.y]);
    xScale2.domain(d3.extent(data, function(d) { return d.date; }));

 var line = d3.svg.line()
        .x(function(d) { return xScale2(d.date);})
        .y(function(d) { return yScale2(d.count);});
    
    xAxis2 = d3.svg.axis()
        .scale(xScale2)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(yScale2)
        .orient("left");

    detail.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (bbDetail.h) + ")")
      .call(xAxis2);

    detail.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+bbDetail.x+"," + 0+ ")")
      .call(yAxis);

  detail.append("path")
      .datum(data)
      .attr("class", "path deailPath")
      .attr("d", line);

detail.selectAll('.point')
    .data(data)
    .enter()
    .append("circle")
    .attr("class", 'point')
     .attr("r", 2)
    .attr("cx", function(d){return xScale2(d.date);})
    .attr("cy", function(d){return yScale2(d.count);})
    .on('mouseover',   function(){d3.select(this).attr('r', 4);})
    .on('mouseout', function(){d3.select(this).attr('r', 2);})

// var area = d3.svg.area()
//     .x(function(d){return xScale2(d.date);})
//     .y0(bbDetail.h)
//     .y1(function(d){return yScale2(d.count);});

  // var area2 = d3.svg.area()
  //   .interpolate("linear")
  //   .x(function(d) { return xScale2(d.date); })
  //   .y0(bbDetail.h)
  //   .y1(function(d) { return yScale2(d.count); });

    detail.append("path")
        .datum(data)
        .attr("class", "area detailArea")
        .attr("d",area2);
}

function brushed() {
  xScale2.domain(brush.empty() ? xScale.domain() : brush.extent());
  detail.select(".area").attr("d", area2);
  detail.select(".x.axis").call(xAxis2);
}
