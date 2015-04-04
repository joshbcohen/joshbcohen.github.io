/** Javascript main file **/

(function ($) {
  /****************************************************
   *             Variable Declarations                *
   ****************************************************/

  //Distinct color for each fuel type; generated using http://phrogz.net/css/distinct-colors.html
  var fuelColor = {
    "Wind" : "#F28100",
    "Coal" : "#F2C200",
    "Geothermal" : "#A3CC00",
    "Hydroelectric Conventional" : "#66FF00",
    "Natural Gas" : "#00BF4D",
    "Other Biomass" : "#00FFCC",
    "Nuclear" : "#00D6E6",
    "Other Gases" : "#0091D9",
    "Petroleum" : "#0066FF",
    "Pumped Storage" : "#4400FF",
    "Solar Thermal and Photovoltaic" : "#D900CA",
    "Wood and Wood Derived Fuels" : "#FF0088",
    "Other" : "#FF0022"
  };



  //Color scales generated using http://highintegritydesign.com/tools/tinter-shader/.
  //Element 0 of each chloropleth scale is the complementary color of the primary fuel color in fuelColor object;
  //Complementary colors found using http://serennu.com/colour/colourcalculator.php
  var chloroplethScales = {
    "Wind" : {
      9 : "#321900",
      8 : "#623300",
      7 : "#924D00",
      6 : "#C26700",
      5 : "#F28100",
      4 : "#F49B34",
      3 : "#F6B568",
      2 : "#F8CF9C",
      1 : "#FAE9D0",
      0 : "#0071F2"
    },
    "Coal" : {
      9 : "#322A00",
      8 : "#625000",
      7 : "#927600",
      6 : "#C29C00",
      5 : "#F2C200",
      4 : "#F4CE34",
      3 : "#F6DA68",
      2 : "#F8E69C",
      1 : "#FAF2D0",
      0 : "#0030F2"
    },
    "Geothermal" : {
      9 : "#232C00",
      8 : "#435400",
      7 : "#637C00",
      6 : "#83A400",
      5 : "#A3CC00",
      4 : "#B5D634",
      3 : "#C7E068",
      2 : "#D9EA9C",
      1 : "#EBF4D0",
      0 : "#2900CC"
    },
    "Hydroelectric Conventional" : {
      9 : "#162F00",
      8 : "#2A6300",
      7 : "#3E9700",
      6 : "#52CB00",
      5 : "#66FF00",
      4 : "#B1FF82",
      3 : "#CFFFB6",
      2 : "#DEFFD0",
      1 : "#EDFFEA",
      0 : "#9900FF"
    },
    "Natural Gas" : {
      9 : "#00270D",
      8 : "#004D1D",
      7 : "#00732D",
      6 : "#00993D",
      5 : "#00BF4D",
      4 : "#34CB71",
      3 : "#68D795",
      2 : "#9CE3B9",
      1 : "#D0EFDD",
      0 : "#BF0071"
    },
    "Other Biomass" : {
      9 : "#002F2C",
      8 : "#006354",
      7 : "#00977C",
      6 : "#00CBA4",
      5 : "#00FFCC",
      4 : "#68FFE0",
      3 : "#B6FFEF",
      2 : "#D0FFF4",
      1 : "#EAFFF9",
      0 : "#FF0032"
    },
    "Nuclear" : {
      9 : "#002E2E",
      8 : "#00585C",
      7 : "#00828A",
      6 : "#00ACB8",
      5 : "#00D6E6",
      4 : "#68E6F2",
      3 : "#9CEEF8",
      2 : "#B6F2FB",
      1 : "#EAFAFF",
      0 : "#E61000"
    },
    "Other Gases" : {
      9 : "#001929",
      8 : "#003755",
      7 : "#005581",
      6 : "#0073AD",
      5 : "#0091D9",
      4 : "#34A7E1",
      3 : "#68BDE9",
      2 : "#9CD3F1",
      1 : "#D0E9F9",
      0 : "#D94800"
    },
    "Petroleum" : {
      9 : "#00162F",
      8 : "#002A63",
      7 : "#003E97",
      6 : "#0052CB",
      5 : "#0066FF",
      4 : "#3484FF",
      3 : "#68A2FF",
      2 : "#9CC0FF",
      1 : "#D0DEFF",
      0 : "#FF9900"
    },
    "Pumped Storage" : {
      9 : "#0C002F",
      8 : "#1A0063",
      7 : "#280097",
      6 : "#3600CB",
      5 : "#4400FF",
      4 : "#6A34FF",
      3 : "#9068FF",
      2 : "#B69CFF",
      1 : "#DCD0FF",
      0 : "#BAFF00"
    },
    "Solar Thermal and Photovoltaic": {
      9 : "#29002A",
      8 : "#550052",
      7 : "#81007A",
      6 : "#AD00A2",
      5 : "#D900CA",
      4 : "#E54ED9",
      3 : "#ED82E3",
      2 : "#F5B6ED",
      1 : "#FDEAF7",
      0 : "#00D90F"
    },
    "Wood and Wood Derived Fuels": {
      9 : "#2F0018",
      8 : "#630034",
      7 : "#970050",
      6 : "#CB006C",
      5 : "#FF0088",
      4 : "#FF4EAC",
      3 : "#FF68B8",
      2 : "#FFB6DC",
      1 : "#FFEAF4",
      0 : "#00FF76"
    },
    "Other": {
      9 : "#2F000A",
      8 : "#630010",
      7 : "#970016",
      6 : "#CB001C",
      5 : "#FF0022",
      4 : "#FF344E",
      3 : "#FF687A",
      2 : "#FF9CA6",
      1 : "#FFD0D2",
      0 : "#00FFDC"
    }
  };

  var fuelTypes = Object.keys(fuelColor);
  var width = 1080, height = 575;
  var projection = d3.geo.albersUsa().translate([470,255]);
  var path = d3.geo.path().projection(projection);
  var svg = d3.select("#map")
    .append("svg")
    .attr("width",width)
    .attr("height",height)
    .attr("class","svgView");
  var g = svg.append("g");
  var statesArray = {};
  var stateNames = d3.csv("us_names.csv", function(data) {
    data.forEach(function(d) {
      statesArray[d.id] = d;
    });
  });
  var quantizeScale = d3.scale.quantize()
    .domain([0, 600])
    .range(d3.range(1,10));


  function getQuantiles() {
    var arr = [];
    for(var i = 1; i <= 200000000; i++) {
      if(quantizeScale(Math.pow(i, (1/3))) > quantizeScale(Math.pow((i-1), (1/3)))) {
        console.log(i, quantizeScale(Math.pow(i, 1/3)));
      }
    }
  }

  var theYear = "2000";
  var theState = 36; //New York
  var theEnergy = "Coal";
  var testArray = {};
  var drawDominant = true;



  /****************************************************
   *             Function Declarations                *
   ****************************************************/

  /**
   * Place commas in integers by hundreds
   */
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function getDominantEnergyYear(energySourceObj, energyColorObj, statesObj, year, updateCallback, colorCallback) {
    var updateDominantEnergy = d3.json("generation_annual.json", function(error, powerData) {
      var currYearData = powerData[year];
      for (var state in statesObj) {
        var currDominantSource = "NaN";
        var currDominantAmt = Number.NEGATIVE_INFINITY;
        if (statesArray.hasOwnProperty(state)) {
          var currState = statesObj[state];
          if (+currState.id <= 56) {
            var currStateData = currYearData[currState.code]["Total Electric Power Industry"];
            for (var energyType in currStateData) {
              if (currStateData.hasOwnProperty(energyType) && (energyType !== 'Total')) {
                var currEnergy = +currStateData[energyType].replace(/,/g, '');
                if (currEnergy > currDominantAmt) {
                  currDominantAmt = currEnergy;
                  currDominantSource = energyType;
                }
              }
            }
            updateCallback(energySourceObj, currState.code, currDominantSource);
          }
        }
      }
      colorCallback(energySourceObj, energyColorObj, statesObj, year);
    });
  }


  function updateDominantEnergyYear(energySourceObj, currStateCode, currDominantSource) {
    energySourceObj[currStateCode] = currDominantSource;
  }

  function colorStatesByDominantEnergy(energySourceObj, energyColorObj, statesObj, year) {
    var tooltip = d3.select("#map")
      .append("div")
      .attr("id", "pieChartToolTip");

    var states = d3.json("us.json", function(error, US) {
      g.selectAll("path").data([]).exit().remove();
      g.append("g")
        .selectAll("path")
        .data(topojson.feature(US,US.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .attr('class', 'states')
        .on("mouseover", function(d, i){
        tooltip.text(statesObj[d.id].name);
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){
        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      })
      .on('click', function(d){
        theState = d.id;
        document.getElementById('pieChart').innerHTML="";
        document.getElementById('totalPieChart').innerHTML="";
        displayStatePieChart(year, statesObj[d.id].code);
        displayStatePieChartByYear(year);
         // get state abbreviation
        document.getElementById('stateName').innerHTML=statesObj[d.id].name;
        d3.select(d3.event.target).classed("highlight", true);
      })
      .style("fill",function(d) {
        var energySource = energySourceObj[statesObj[d.id].code];
        var colorFill = energyColorObj[energySource];
        return colorFill;
      })
      .style("cursor", "pointer")
      .style("stroke","black")
      .style("stroke-opacity",0.33);
    });
  }

  function dominantWrapper(year) {
    var energyObjUpdate = {};
    getDominantEnergyYear(energyObjUpdate, fuelColor, statesArray, year, updateDominantEnergyYear, colorStatesByDominantEnergy);
  }

  function getChloroplethDataYear(energyQuantObj, energyChloroplethColorObj, statesObj, year, energyType, scale, updateCallback, colorCallback) {
    var updateChloroplethEnergy = d3.json("generation_annual.json", function(error, powerData) {
      var currYearData = powerData[year];
      // console.log(currYearData);
      for(var state in statesArray) {
        if (statesArray.hasOwnProperty(state)) {
          var currState = statesArray[state];
          if (+currState.id <= 56) {
            var currStateData = currYearData[currState.code]["Total Electric Power Industry"][energyType];
            var currEnergy;
            if(currStateData) {
              currEnergy = +currStateData.replace(/,/g, '');
            } else {
              currEnergy = 0;
            }
            var currQuant;
            if (currEnergy >= 0) {
              currQuant = scale(Math.pow(currEnergy, (1/3)));
            } else {
              currQuant = 0;
            }
            updateCallback(energyQuantObj, currState.code, currQuant);
          }
        }
      }
      colorCallback(energyQuantObj, energyChloroplethColorObj, statesObj, year, energyType);
    });
  }

  function updateChloroplethDataYear(energyQuantObj, currStateCode, currQuant) {
    energyQuantObj[currStateCode] = currQuant;
  }

  function colorStatesChloropleth(energyQuantObj, energyChloroplethColorObj, statesObj, year, energyType) {
    var tooltip = d3.select("#map")
    .append("div")
    .attr("id", "pieChartToolTip");

    var states = d3.json("us.json", function(error, US) {
      g.selectAll("path").data([]).exit().remove();
      g.append("g")
       .selectAll("path")
       .data(topojson.feature(US,US.objects.states).features)
       .enter().append("path")
       .attr("d", path)
       .attr('class', 'states')
       .on("mouseover", function(d, i){
        tooltip.text(statesObj[d.id].name);
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){
        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      })
      .on('click', function(d){
        theState = d.id;
        document.getElementById('pieChart').innerHTML="";
        document.getElementById('totalPieChart').innerHTML="";
        displayStatePieChart(year, statesObj[d.id].code);
        displayStatePieChartByYear(year);
         // get state abbreviation
        document.getElementById('stateName').innerHTML=statesObj[d.id].name;
        d3.select(d3.event.target).classed("highlight", true);
      })
      .style("fill",function(d) {
        var energyQuant = energyQuantObj[statesObj[d.id].code];
        var colorFill = energyChloroplethColorObj[energyType][energyQuant];
        return colorFill;
      })
      .style("cursor", "pointer")
      .style("stroke","black")
      .style("stroke-opacity",0.33);
    });
  }

  function chloroplethWrapper(year, energyType, scale) {
    var energyQuantUpdate = {};
    getChloroplethDataYear(energyQuantUpdate, chloroplethScales, statesArray, year, energyType, scale, updateChloroplethDataYear, colorStatesChloropleth);
    drawChloroplethScale(energyType);
  }

  dominantWrapper(theYear);

  var annualData; // the annual data stores generation_annual.json

  d3.json("generation_annual.json", function(error, json) {
    if (error) return console.warn(error);
    annualData = json;
    document.getElementById('stateName').innerHTML=statesArray[theState].name;
    displayStatePieChart(theYear, statesArray[theState].code);
    displayStatePieChartByYear(theYear);
  });

  // Pie chart
  // generate data for pie chart.
  function getPieChartData(year, state) {
    returnData = [];
    var added = 0;
    var curValue = 0;
    var d = annualData[year][state]; // data of state and year.
    for (var typePower in d) {
      // returnData.push({"label": d[typePower][0], "value": d[typePower][0]});
      
      for (var prop in d[typePower]) {
        
        // console.log(prop);
        for (var obj in returnData) {
          // energy already exists in returnData
          if (returnData[obj].label === prop) {
            added = 1;
            curValue = parseInt(d[typePower][prop].replace(/,/g, ''), 10);
            if (curValue > 0) {
              returnData[obj].value += curValue;
            }
          }
        }
        if (added === 0) {
          curValue = parseInt(d[typePower][prop].replace(/,/g, ''), 10);
          if (curValue >= 0) {
            returnData.push({"label": prop, "value": curValue});
          }
          
        }
        added = 0;
      }
      // returnData.push(d[typePower]);
      // console.log(d[typePower]);
    }
    return returnData;
  }

  /**
   * Get pie chart data for all states in a given year.
   */
  function getPieChartDataByYear(year) {
    returnData = [];
    var added = 0;
    var curValue = 0;
    var d = annualData[year]; // data of state and year.

    for (var state in d) {
      
      for (var typePower in d[state]) {

        for (var prop in d[state][typePower]) {
          
          // console.log(prop);
          for (var obj in returnData) {
            // energy already exists in returnData
            if (returnData[obj].label === prop) {
              added = 1;
              // console.log(returnData[obj].label + " " + prop);
              curValue = parseInt(d[state][typePower][prop].replace(/,/g, ''), 10);
              if (curValue > 0) {
                returnData[obj].value += curValue;
              }
              
            }
          }
          if (added === 0) {
            curValue = parseInt(d[state][typePower][prop].replace(/,/g, ''), 10);
            if (curValue >= 0) {
              returnData.push({"label": prop, "value": curValue});
            }
          }
          added = 0;
        }
      }
    }
    return returnData;
  }

  /**
   * Displays Pie char by year and state
   */
  function displayStatePieChart(year, state) {
    var data = getPieChartData(year, state);
    var newData = [];
    var w = 300,                        //width
    h = 300,                            //height
    r = 120;                            //radius


    var vis = d3.select("#pieChart")
      .append("svg:svg")
      .data([newData])
      .attr("width", w)
      .attr("height", h)
      .append("svg:g")
      .attr("transform", "translate(" + 132 + "," + 132 + ")");

    var arc = d3.svg.arc().outerRadius(r);

    var pie = d3.layout.pie()
      .value(function(d) {
        return d.value;
      });

    var total = 0;
    for (var obj in data) {
      if (data[obj].label !== "Total") {
        newData.push(data[obj]);
        // console.log(data[obj]);
        total += data[obj].value;
      }
    }

    var tooltip = d3.select("#pieChart")
      .append("div")
      .attr("id", "pieChartToolTip");

    //this selects all <g> elements with class slice (there aren't any yet)
    var arcs = vis.selectAll("g.slice")
      .data(pie) // associate the generated pie data (an array of arcs, each having
             // startAngle, endAngle and value properties) 
      .enter()   //this will create <g> elements for every "extra" data element that should
             // be associated with a selection. The result is creating a <g> for every 
             // object in the data array
      .append("svg:g") // create a group to hold each slice (we will have a <path> and 
               // a <text> element associated with each slice)
      .attr("class", "slice");    //allow us to style things in the slices (like text)

    arcs.append("svg:path")
      .attr("fill", function(d, i) {
        var t = newData[i].label;
        return fuelColor[t];
      }) //set the color for each slice to be chosen from the color function defined above
      .on("mouseover", function(d, i){
        // console.log(d.data);
        tooltip.text(d.data["label"] + ": " + numberWithCommas(d.data["value"]) + " MW");
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){
        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      })
      .attr("d", arc); //this creates the actual SVG path using the associated data (pie) with the arc drawing function

    arcs.append("svg:text") //add a label to each slice
      .attr("transform", function(d) {  //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
      })
      .on("mouseover", function(d, i){
        // console.log(d.data);
        tooltip.text(d.data["label"] + ": " + numberWithCommas(d.data["value"]) + " MW");
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){
        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .text(function(d, i) {
        var percentage = Math.round(newData[i].value / total * 100);
        // console.log(newData[i].label, percentage, fuelColor[newData[i].label])
        if (percentage < 5) {
          return "";
        } else {
          return percentage + "%";
        }
      }); //get the label from our original data array
  }

  /**
   * Displays Pie char by year.
   */
  function displayStatePieChartByYear(year) {
    var data = getPieChartDataByYear(year);
    var newData = [];
    var w = 300,                        //width
    h = 300,                            //height
    r = 120;                          //radius

    var vis = d3.select("#totalPieChart")
      .append("svg:svg")
      .data([newData])
      .attr("width", w)
      .attr("height", h)
      .append("svg:g")
      .attr("transform", "translate(" + 132 + "," + 132 + ")");

    var arc = d3.svg.arc().outerRadius(r);

    var pie = d3.layout.pie()
      .value(function(d) {
        return d.value;
      });

    var total = 0;
    for (var obj in data) {
      if (data[obj].label !== "Total") {
        newData.push(data[obj]);
        // console.log(data[obj]);
        total += data[obj].value;
      }
    }

    var tooltip = d3.select("#pieChart")
      .append("div")
      .attr("id", "pieChartToolTip");

    //this selects all <g> elements with class slice (there aren't any yet)
    var arcs = vis.selectAll("g.slice")
      .data(pie) // associate the generated pie data (an array of arcs, each having
             // startAngle, endAngle and value properties) 
      .enter()   //this will create <g> elements for every "extra" data element that should
             // be associated with a selection. The result is creating a <g> for every 
             // object in the data array
      .append("svg:g") // create a group to hold each slice (we will have a <path> and 
               // a <text> element associated with each slice)
      .attr("class", "slice");    //allow us to style things in the slices (like text)

    arcs.append("svg:path")
      .on("mouseover", function(d, i){
        // console.log(d.data);
        tooltip.text(d.data["label"] + ": " + numberWithCommas(d.data["value"]) + " MW");
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){
        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      })
      .attr("fill", function(d, i) {
        var t = newData[i].label;
        return fuelColor[t];
      }) //set the color for each slice to be chosen from the color function defined above
      .attr("d", arc); //this creates the actual SVG path using the associated data (pie) with the arc drawing function

    arcs.append("svg:text")                                 //add a label to each slice
      .attr("transform", function(d) {                    //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .on("mouseover", function(d, i){
        tooltip.text(d.data["label"] + ": " + numberWithCommas(d.data["value"]) + " MW");
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){
        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      })
      .text(function(d, i) {
        // var percentage = Math.round((newData[i].value / total) * 10) / 10;
        var percentage = Math.round(newData[i].value / total * 100);
        if (percentage < 5) {
          return "";
        } else {
          return percentage + "%";
        }
      }); //get the label from our original data array
  }


  /****************************************************
   *             Legends Code                         *
   ****************************************************/

  var legendWidth = 350;
  var legendHeight = 400;

  var legend = svg.append("g")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", 200)
      .attr("width", 200)
      .attr("class", "svgView")
      .attr("transform", "translate([500,0])");

  var legendCircle = legend.selectAll('circle').data(fuelTypes);

  legendCircle.enter()
    .append("circle")
    .attr("cx", width - 260)
    .attr("r", 8);

  legendCircle
    .style("cursor", "pointer")
    .attr("cy", function(d, i) {
      return (legendWidth - 100) + i*25;
    })
    .on("click", function(d, i) {
      theEnergy = d;
      chloroplethWrapper(theYear, theEnergy, quantizeScale);
      drawDominant = false;
      $(".resetButton").css("display", "block");

    })
    .style("fill", function(d, i) {
      return fuelColor[fuelTypes[i]];
    });

  var legendText = legend.selectAll('text').data(fuelTypes);

  legendText.enter()
    .append("text")
    .attr("x", width - 240);

  legendText
    .attr("y", function(d, i) {
      return (legendWidth - 95) + i*25;
    })
    .text(function(d, i) {
      return fuelTypes[i];
    })
    .style("cursor", "pointer")
    .on("click", function(d, i) {
      theEnergy = d;
      chloroplethWrapper(theYear, theEnergy, quantizeScale);
      $(".resetButton").css("display", "block");
      drawDominant = false;
    });

  // jquery for slider
  function drawChloroplethScale(energy) {
    var legendTextArray = ["Negative", "Least", "Most"];
    var chLegendHeight = 200;
    var chLegendWidth = 720;
    var chLegend = svg.append("g")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", chLegendHeight)
      .attr("width", chLegendWidth)
      .attr("class", "chLegend");

    var chLegendRect = chLegend.selectAll('rect')
      .data(Object.keys(chloroplethScales[energy]))
      .enter();

    chLegendRect.append("rect")
      .attr("x", function(d, i) {
        return 50+((i/10) * chLegendWidth);
      })
      .attr("y", 550)
      .attr("height", 20)
      .attr("width", chLegendWidth/10)
      .style("fill", function(d, i) {
        return chloroplethScales[energy][d];
      });

    var chText = chLegend.selectAll("text")
      .data(legendTextArray)
      .enter()
      .append("text")
      .attr("x", function(d, i) {
        var x;
        if (i === 0) {
          x = 50;
        } else if (i === 1) {
          x = 50 + ((1/10) * chLegendWidth);
        } else {
          x = 50 + ((9.5/10) * chLegendWidth);
        }
        return x;
      })
      .attr("y", 535)
      .text(function(d, i) {
        return d;
      });
  }

  $(function() {
    $("#yearSlider").slider({
      min: 1990,
      max: 2010,
      value: 2000,
      slide: function(event, ui) {
        $("#pieChart").html("");
        $("#totalPieChart").html("");
        theYear=ui.value;
        svg.selectAll("g.chLegend").data([]).exit().remove();
        if(drawDominant) {
          dominantWrapper(theYear);
        } else {
          chloroplethWrapper(theYear, theEnergy, quantizeScale);
        }
        displayStatePieChart(theYear, statesArray[theState].code);
        displayStatePieChartByYear(theYear);

        $("#currYear").text("Year: " + ui.value);
        return;
      }
    });
    setSliderTicks();
    $(".resetButton").on("click", function() {
      if (!drawDominant) {
        drawDominant = true;
        svg.selectAll("g.chLegend").data([]).exit().remove();
        dominantWrapper(theYear);
        $(".resetButton").css("display", "none");
      }
    });
  });

  function setSliderTicks() {
    var min = 1990;
    var max = 2010;
    var tick = 100 / (max-min);
    $("#yearSlider").find(".sliderTick").remove();
    for (var i = 0; i <= (max-min); i++) {
      var tickMarkHTML;
      if ((i === 0)||(i === max-min)) {
        tickMarkHTML = "<span class=\"sliderTick\"><br/>" + (i + min) + "</span>";
      } else {
        tickMarkHTML = "<span class=\"sliderTick\">|<br/>" + (i + min) + "</span>";
      }
      $(tickMarkHTML)
        .css("left", (i * tick) + "%")
        .appendTo($("#yearSliderTicks"));
    }
  }
})(jQuery);

