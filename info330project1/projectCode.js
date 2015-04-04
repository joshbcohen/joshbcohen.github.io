var width = 960, height = 600;
var gulfWidth = 800, gulfHeight = 400;

var projection = d3.geo.albersUsa();

var projectionGulf = d3.geo.albersUsa()
           .scale(5000)
           .translate([(gulfWidth/2)-250, (gulfHeight/2)-800]);


var path = d3.geo.path().projection(projection);

var pathGulf = d3.geo.path().projection(projectionGulf);

var svg = d3.select("#map")
      .append("svg")
      .attr("width",width)
      .attr("height",height)
      .attr("class","svgView");

var centerCurr = projection.translate();

var svgGulf = d3.select("#gulfmap")
        .append("svg")
        .attr("width", gulfWidth)
        .attr("height", gulfHeight)
        .attr("class","svgView");


var g = svg.append("g");

var gGulf = svgGulf.append("g");

var sizes = [];

var states = d3.json("us.json", function(error, US) {
  g.append("g")
   .selectAll("path")
   .data(topojson.feature(US,US.objects.states).features)
   .enter().append("path")
   .attr("d", path)
   .style("fill","#dddddd")
   .style("stroke","black")
   .style("stroke-opacity",0.33);
});

var statesGulf = d3.json("us.json", function(error, US) {
  gGulf.append("g")
     .selectAll("path")
     .data(topojson.feature(US,US.objects.states).features)
     .enter().append("path")
     .attr("d", pathGulf)
     .style("fill","#dddddd")
     .style("stroke","black")
     .style("stroke-opacity",0.33);
});

var coords = [];
d3.json("pollution.json", function(error, pollution) {
  var logScale = d3.scale.log().range([0,6]).base(100);
  pollution.data.forEach(function(arr){
    var latitudeLongitude = arr[49];

    var newCoord, svgCoord, substance, spillSize;
    if (latitudeLongitude[1]) {
      newCoord = [latitudeLongitude[2], latitudeLongitude[1]];
      substance = arr[23];
      spillSize = arr[27];
    } else {
      newCoord = [arr[23],arr[22]];
      substance = arr[18];
      spillSize = arr[24];
    }

    svgCoord = projection(newCoord);
    svgCoordGulf = projectionGulf(newCoord);

    sizes.push(parseFloat(spillSize));
    
    var color;
    if (substance === 'OIL') {
      color = "#0000ff";
    } else if (substance === 'CHEMICAL') {
      color = "#ff0000";
    } else {
      color = "#00ff00";
    }

    var opacity = ((substance !== "OIL") && (substance !== "CHEMICAL")) ? 0.5 : 0.15;

    if (spillSize > 0) {
      spillSizeLog = parseFloat(spillSize) + 1;
      var circRad;

      if (svgCoord) {//Projection returns null for coordinates not within the US- only plot actual data points
        circRad = logScale(spillSizeLog);
        svg.append("circle")
          .attr("cx", svgCoord[0])
          .attr("cy", svgCoord[1])
          .attr("r",circRad)
          .attr("fill", color)
          .style("fill-opacity", opacity);
      }

      if (svgCoordGulf) {
        circRad = logScale(spillSizeLog);
        svgGulf.append("circle")
             .attr("cx", svgCoordGulf[0])
             .attr("cy", svgCoordGulf[1])
             .attr("r",circRad)
             .attr("fill", color)
             .style("fill-opacity", opacity);
      }
    }
  });
});

// legend

var myText = ["Oil", "Chemical", "Other"];
var myColors = ["#0000ff", "#ff0000", "#00ff00"];


var legend = svg.append("g")
  .attr("x", 800)
  .attr("y", 200)
  .attr("height", 100)
  .attr("width", 100);

var legendBox = legend.append("rect")
  .attr("x", 820)
  .attr("y", 378)
  .attr("height", 72)
  .attr("width", 115)
  .attr("id", "legendBox");

var legendCircle = legend.selectAll('circle').data(myColors);

legendCircle.enter()
  .append("circle")
  .attr("cx", 840)
  .attr("r", 8);

legendCircle
  .attr("cy", function(d, i) {
      return 396 + i*20;
  })
  .style("fill", function(d, i) {
      return myColors[i];
  });

var legendText = legend.selectAll('text').data(myText);

legendText.enter()
  .append("text")
  .attr("x", 860);

legendText
  .attr("y", function(d, i) {
      return 400 + i*20;
  })
  .text(function(d, i) {
      return myText[i];
  });
var rectX = (centerCurr[0] - (((gulfWidth/2)-250)*(projection.scale()/projectionGulf.scale())));
var rectY = (centerCurr[1] - (((gulfHeight/2)-800)*(projection.scale()/projectionGulf.scale())));
var rectHeight = (gulfHeight * (projection.scale()/projectionGulf.scale()));
var rectWidth = (gulfWidth * (projection.scale()/projectionGulf.scale()));
svg.append("rect")
  .attr("x",rectX)
  .attr("y",rectY)
  .attr("width", rectWidth)
  .attr("height", rectHeight)
  .style("fill","none")
  .style("stroke","black");

svg.append("line")
   .attr("x1", rectX)
   .attr("x2",rectX-525)
   .attr("y1", rectY + rectHeight)
   .attr("y2", rectY + rectHeight + 200)
   .style("stroke","black");

svg.append("line")
   .attr("x1", rectX+rectWidth)
   .attr("x2", rectX+rectWidth + 375)
   .attr("y1", rectY + rectHeight)
   .attr("y2", rectY + rectHeight + 200)
   .style("stroke","black");

svgGulf.append("text")
  .attr("x",20)
  .attr("y",30)
  .text("Gulf Coast Inset")
  .attr("font-family","sans-serif")
  .attr("font-size","20px")
  .attr("fill","black");
