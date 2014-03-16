/**
 * Created by hen on 2/20/14.
 */
    var filteredYr, minArr,maxArr, bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width,xAxis, xScale, yAxis,  yScale;

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
        
          xScale = d3.scale.linear().domain([0,2050]).range([bbVis.x, bbVis.w]);  // define the right domain generically
          yScale = d3.scale.linear().domain([0,10000000000]).range([bbVis.h,0]);
		  // example that translates to the bottom left of our vis space:
		  var visFrame = svg.append("g").attr({
		      "transform": "translate(" + bbVis.x + "," + (bbVis.y + bbVis.h) + ")",
		  	  //....
			  
		  });
		  
		  // visFrame.append("rect");
		  //....

//        yScale = .. // define the right y domain and range -- use bbVis


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
    var years = data.map(function(d){return d.year;});

    var data_matrix = [];

    for (var i =0; i < columns.length;i++)
    {
        var arr = data.map(function(d){return d[columns[i]];});
        data_matrix.push(arr);
    }
    var avgData = [];
    filteredYr = [];
    minArr = [];
    maxArr = [];

    for(var j=0; j < data.length; j++)
    {
        var filteredArr = [];
        for (var i =0; i < columns.length;i++)
        {
            if (data[j][columns[i]] >-1)
                filteredArr.push(data[j][columns[i]]);
        }

        var num=0;
        var sum=0;
        for (var i = 0; i < filteredArr.length; i++) {
            sum += filteredArr[i];
            num +=1;
        };

        var min = Math.min.apply(null,filteredArr);
        var max = Math.max.apply(null, filteredArr);
        

        if (num >0){
            avgData.push(sum/num);
            filteredYr.push(years[j]);
            console.log(max-min);
            minArr.push(min);
            maxArr.push(max);
        }
    }

    line = d3.svg.line()
        .x(function(d,num) { return xScale(filteredYr[num]);})
        .y(function(d) { return yScale(d);});


var area = d3.svg.area()
    .x(function(d,num){return xScale(filteredYr[num]);})

    // area
    // .y0(function(d,num){ return yScale(d + 10000000000* (1- minArr[num]/parseFloat(d)) );})
    // .y1(function(d,num){return  yScale( d + 10000000000* (1- maxArr[num]/parseFloat(d)) );});

    area
    .y0(function(d,num){ return 16* yScale(d) - 15* yScale(minArr[num]);})
    .y1(function(d,num){return  -14*yScale(d) + 15* yScale(minArr[num]);});
    
    
    svg.append("g").append("path")
        .datum(avgData)
        .attr("class", "dataArea")
        .attr("d",area);

    svg.append("path")
      .datum(avgData)
      .attr("class", "line")
      .attr("d", line);



var points = svg.selectAll('.point')
        .data(avgData)
        .enter()
        .append("g")
        .attr("class","node")

    points
        .append("circle")
        .attr("class", 'point')
        .attr("stroke","none")
        .attr("fill", "steelblue")
        .attr("r", 1.5)
        .attr("cx", function(d, num){return xScale(filteredYr[num]);})
        .attr("cy", function(d){return yScale(d) ;})

   points
        .append("text")
        .style("position", "absolute")
        .attr("x", function(d, num){return xScale(filteredYr[num]);})
        .attr("y", function(d){return yScale(d) ;})
        .style("z-index", 10)
        .style("visibility", "hidden")
        .text(function(d){return d;});

    points
        .on('mouseover',   function(){
            var sel = d3.select(this);
            sel.select("circle").attr('r', 2);
            sel.select("text").style("visibility", "visible");
        })
        .on('mouseout', function(){
            var sel = d3.select(this);
            sel.attr('r', 1);
            sel.select("text").style("visibility", "hidden");
        })

    };

    function normalDiff () {
    var area = d3.svg.area()
    .x(function(d,num){return xScale(filteredYr[num]);})
    area
    .y0(function(d,num){ return 16* yScale(d) - 15* yScale(minArr[num]);})
    .y1(function(d,num){return  -14*yScale(d) + 15* yScale(minArr[num]);});

        svg.select(".dataArea")
        .attr("d",area);
    }
    
function percentageDiff () {
    var area = d3.svg.area()
    .x(function(d,num){return xScale(filteredYr[num]);})
    area
    .y0(function(d,num){ return yScale(d + 5000000000* (1- minArr[num]/parseFloat(d)) );})
    .y1(function(d,num){return  yScale( d + 5000000000* (1- maxArr[num]/parseFloat(d)) );});

        svg.select(".dataArea")
        .attr("d",area);
    }