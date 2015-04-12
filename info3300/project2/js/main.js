/** Javascript main file **/
(function ($) {
  'use strict';
  $(function() {
    //Variable declarations

    //Distinct color for each fuel type; generated using http://phrogz.net/css/distinct-colors.html
    var fuelColor = {
      'Wind' : '#F28100',
      'Coal' : '#F2C200',
      'Geothermal' : '#A3CC00',
      'Hydroelectric Conventional' : '#66FF00',
      'Natural Gas' : '#00BF4D',
      'Other Biomass' : '#00FFCC',
      'Nuclear' : '#00D6E6',
      'Other Gases' : '#0091D9',
      'Petroleum' : '#0066FF',
      'Pumped Storage' : '#4400FF',
      'Solar Thermal and Photovoltaic' : '#D900CA',
      'Wood and Wood Derived Fuels' : '#FF0088',
      'Other' : '#FF0022'
    };



    //Color scales generated using http://highintegritydesign.com/tools/tinter-shader/.
    //Element 0 of each chloropleth scale is the complementary color of the primary fuel color in fuelColor object;
    //Complementary colors found using http://serennu.com/colour/colourcalculator.php
    var chloroplethScales = {
      'Wind' : {
        9 : '#321900',
        8 : '#623300',
        7 : '#924D00',
        6 : '#C26700',
        5 : '#F28100',
        4 : '#F49B34',
        3 : '#F6B568',
        2 : '#F8CF9C',
        1 : '#FAE9D0',
        0 : '#0071F2'
      },
      'Coal' : {
        9 : '#322A00',
        8 : '#625000',
        7 : '#927600',
        6 : '#C29C00',
        5 : '#F2C200',
        4 : '#F4CE34',
        3 : '#F6DA68',
        2 : '#F8E69C',
        1 : '#FAF2D0',
        0 : '#0030F2'
      },
      'Geothermal' : {
        9 : '#232C00',
        8 : '#435400',
        7 : '#637C00',
        6 : '#83A400',
        5 : '#A3CC00',
        4 : '#B5D634',
        3 : '#C7E068',
        2 : '#D9EA9C',
        1 : '#EBF4D0',
        0 : '#2900CC'
      },
      'Hydroelectric Conventional' : {
        9 : '#162F00',
        8 : '#2A6300',
        7 : '#3E9700',
        6 : '#52CB00',
        5 : '#66FF00',
        4 : '#B1FF82',
        3 : '#CFFFB6',
        2 : '#DEFFD0',
        1 : '#EDFFEA',
        0 : '#9900FF'
      },
      'Natural Gas' : {
        9 : '#00270D',
        8 : '#004D1D',
        7 : '#00732D',
        6 : '#00993D',
        5 : '#00BF4D',
        4 : '#34CB71',
        3 : '#68D795',
        2 : '#9CE3B9',
        1 : '#D0EFDD',
        0 : '#BF0071'
      },
      'Other Biomass' : {
        9 : '#002F2C',
        8 : '#006354',
        7 : '#00977C',
        6 : '#00CBA4',
        5 : '#00FFCC',
        4 : '#68FFE0',
        3 : '#B6FFEF',
        2 : '#D0FFF4',
        1 : '#EAFFF9',
        0 : '#FF0032'
      },
      'Nuclear' : {
        9 : '#002E2E',
        8 : '#00585C',
        7 : '#00828A',
        6 : '#00ACB8',
        5 : '#00D6E6',
        4 : '#68E6F2',
        3 : '#9CEEF8',
        2 : '#B6F2FB',
        1 : '#EAFAFF',
        0 : '#E61000'
      },
      'Other Gases' : {
        9 : '#001929',
        8 : '#003755',
        7 : '#005581',
        6 : '#0073AD',
        5 : '#0091D9',
        4 : '#34A7E1',
        3 : '#68BDE9',
        2 : '#9CD3F1',
        1 : '#D0E9F9',
        0 : '#D94800'
      },
      'Petroleum' : {
        9 : '#00162F',
        8 : '#002A63',
        7 : '#003E97',
        6 : '#0052CB',
        5 : '#0066FF',
        4 : '#3484FF',
        3 : '#68A2FF',
        2 : '#9CC0FF',
        1 : '#D0DEFF',
        0 : '#FF9900'
      },
      'Pumped Storage' : {
        9 : '#0C002F',
        8 : '#1A0063',
        7 : '#280097',
        6 : '#3600CB',
        5 : '#4400FF',
        4 : '#6A34FF',
        3 : '#9068FF',
        2 : '#B69CFF',
        1 : '#DCD0FF',
        0 : '#BAFF00'
      },
      'Solar Thermal and Photovoltaic': {
        9 : '#29002A',
        8 : '#550052',
        7 : '#81007A',
        6 : '#AD00A2',
        5 : '#D900CA',
        4 : '#E54ED9',
        3 : '#ED82E3',
        2 : '#F5B6ED',
        1 : '#FDEAF7',
        0 : '#00D90F'
      },
      'Wood and Wood Derived Fuels': {
        9 : '#2F0018',
        8 : '#630034',
        7 : '#970050',
        6 : '#CB006C',
        5 : '#FF0088',
        4 : '#FF4EAC',
        3 : '#FF68B8',
        2 : '#FFB6DC',
        1 : '#FFEAF4',
        0 : '#00FF76'
      },
      'Other': {
        9 : '#2F000A',
        8 : '#630010',
        7 : '#970016',
        6 : '#CB001C',
        5 : '#FF0022',
        4 : '#FF344E',
        3 : '#FF687A',
        2 : '#FF9CA6',
        1 : '#FFD0D2',
        0 : '#00FFDC'
      }
    };

    var fuelTypes = Object.keys(fuelColor);
    var width = 1080, height = 575;
    var projection = d3.geo.albersUsa().translate([470,255]);
    var path = d3.geo.path().projection(projection);
    var quantizeScale = d3.scale.quantize()
      .domain([0, 600])
      .range(d3.range(1,10));
    var currYear = '2000';
    var currState = 36; //New York
    var currEnergy = 'Coal';
    var drawDominant = true;
    var legendWidth = 350;
    var legendHeight = 400;
    var yearMin = 1990;
    var yearMax = 2010;
    var tick = 100 / (yearMax-yearMin);
    var statesObj = {};



    /****************************************************
     *             Function Declarations                *
     ****************************************************/

    /**
     * Place commas in integers by hundreds.
     * Source- http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
     */
    var numberWithCommas = function (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Returns an object containing the dominant energy source for each state in a given year
    var getDominantEnergyObject = function(powerData, year, statesObj) {
      var energySourceObj = {};
      var currYearData = powerData[year];
      for (var state in statesObj) {
        if (statesObj.hasOwnProperty(state)) {
          var currDominantSource = 'NaN';
          var currDominantAmt = Number.NEGATIVE_INFINITY;
          var currState = statesObj[state];
          if (+currState.id <= 56) {
            var currStateData = currYearData[currState.code];
            for (var energyType in currStateData) {
              if (currStateData.hasOwnProperty(energyType) && (energyType !== 'Total')) {
                var currEnergy = +currStateData[energyType].replace(/,/g, '');
                if (currEnergy > currDominantAmt) {
                  currDominantAmt = currEnergy;
                  currDominantSource = energyType;
                }
              }
            }
            energySourceObj[currState.code] = currDominantSource;
          }
        }
      }
      return energySourceObj;
    };

    // Returns an object containing the quantiles for each state in a given year for a given energy source
    var getChloroplethEnergyObject = function (powerData, year, statesObj, energyType, scale) {
      var energyQuantObj = {};
      var currYearData = powerData[year];
      for (var state in statesObj) {
        if (statesObj.hasOwnProperty(state)) {
          var currState = statesObj[state];
          if (+currState.id <= 56) {
            var currStateData = currYearData[currState.code][energyType];
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
            energyQuantObj[currState.code] = currQuant;
          }
        }
      }
      return energyQuantObj;
    };

    // Draws a scale at the bottom of the map representing the chloropleth quantiles for a given energy source
    var drawChloroplethScale = function (energy) {
      var legendTextArray = ['Negative', 'Least', 'Most'];
      var chLegendHeight = 200;
      var chLegendWidth = 720;
      var chLegend = svg.append('g')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', chLegendHeight)
        .attr('width', chLegendWidth)
        .attr('class', 'chLegend');

      var chLegendRect = chLegend.selectAll('rect')
        .data(Object.keys(chloroplethScales[energy]))
        .enter();

      chLegendRect.append('rect')
        .attr('x', function(d, i) {
          return 50+((i/10) * chLegendWidth);
        })
        .attr('y', 550)
        .attr('height', 20)
        .attr('width', chLegendWidth/10)
        .style('fill', function(d, i) {
          return chloroplethScales[energy][d];
        });

      var chText = chLegend.selectAll('text')
        .data(legendTextArray)
        .enter()
        .append('text')
        .attr('x', function(d, i) {
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
        .attr('y', 535)
        .text(function(d, i) {
          return d;
        });
    };

    // Colors the map based on the dominant energy or chloropleth data
    var colorMap = function (powerData, year, statesObj, colorObj, isDominant, energyType, scale) {
      var energyObj;
      if (isDominant) {
        energyObj = getDominantEnergyObject(powerData, year, statesObj);
      } else {
        energyObj = getChloroplethEnergyObject(powerData, year, statesObj, energyType, scale);
      }
      var tooltip = d3.select('#map > .vizTooltip');
      var svg = d3.select('#map > svg');
      var g = svg.select('g.states');
      var states = d3.json('us.json', function(error, US) {
        g.selectAll('path').data([]).exit().remove();
        g.remove();
        svg.append('g')
          .selectAll('path')
          .data(topojson.feature(US,US.objects.states).features)
          .enter().append('path')
          .attr('d', path)
          .attr('class', 'states')
          .on('mouseover', function(d, i){
          tooltip.text(statesObj[d.id].name);
          return tooltip.style('visibility', 'visible');
        })
        .on('mousemove', function(){
          return tooltip.style('top', (event.pageY-10)+'px').style('left',(event.pageX+10)+'px');
        })
        .on('mouseout', function(){
          return tooltip.style('visibility', 'hidden');
        })
        .on('click', function(d){
          $('#pieChart > svg').remove();
          $('#totalPieChart > svg').remove();
          displayPieChart('pieChart', powerData, year, statesObj[d.id].code);
          displayPieChart('totalPieChart', powerData, year);
           // get state abbreviation
          $('#stateName').html(statesObj[d.id].name);
          d3.select(d3.event.target).classed('highlight', true);
        })
        .style('fill',function(d) {
          var colorFill;
          if (isDominant) {
            var energySource = energyObj[statesObj[d.id].code];
            colorFill = colorObj[energySource];
          } else {
            var energyQuant = energyObj[statesObj[d.id].code];
            colorFill = colorObj[energyType][energyQuant];
          }
          return colorFill;
        })
        .style('cursor', 'pointer')
        .style('stroke','black')
        .style('stroke-opacity',0.33);
        if (!isDominant) {
          drawChloroplethScale(energyType);
        }
      });
    };

    /** 
      * Get pie chart data for a given year for a given state.
      * Only returns data that is 0 or positive
      */
    var getPieChartDataByState = function (powerData, year, state) {
      var returnData = [];
      var added = 0;
      var curValue = 0;
      var d = powerData[year][state]; // data of state and year.
      for (var typePower in d) {
        if (d.hasOwnProperty(typePower)) {
          curValue = parseInt(d[typePower].replace(/,/g, ''), 10);
          if (curValue >= 0) {
            returnData.push({'label': typePower, 'value': curValue});
          }
        }
      }
      return returnData;
    };

    /**
      * Get pie chart data for all states in a given year.
      */
    var getPieChartDataByYear = function (powerData, year) {
      var powerObj = {};
      var returnData = [];
      var added = 0;
      var d = powerData[year]; // data of state and year.
      for (var state in d) {
        if (d.hasOwnProperty(state)) {
          if (state !== 'US-TOTAL') {
            var stateData = getPieChartDataByState(powerData, year, state);
            for (var i = 0; i < stateData.length; i++) {
              var powerCurr = stateData[i];
              if (!powerObj[powerCurr.label]) {
                powerObj[powerCurr.label] = powerCurr.value;
              } else {
                powerObj[powerCurr.label] += powerCurr.value;
              }
            }
          }
        }
      }
      Object.keys(powerObj).forEach(function (typePower) {
        returnData.push({'label': typePower, 'value': powerObj[typePower]});
      });
      return returnData;
    };

    /**
      * Displays pie chart on the given elementID. If a state is provided,
      * generates data for the given year for that state. If no state is
      * provided, generates data over all states. 
      */
    var displayPieChart = function (elementID, powerData, year, state) {
      var data;
      if (state) {
        data = getPieChartDataByState(powerData, year, state);
      } else {
        data = getPieChartDataByYear(powerData, year);
      }
      var newData = [];
      var w = 300;                        //width
      var h = 300;                        //height
      var r = 120;                        //radius

      var arc = d3.svg.arc().outerRadius(r);

      var pie = d3.layout.pie()
        .value(function(d) {
          return d.value;
        });

      var total = 0;
      for (var obj in data) {
        if (data[obj].label !== 'Total') {
          newData.push(data[obj]);
          total += data[obj].value;
        }
      }

      var vis = d3.select('#' + elementID)
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', 'translate(' + 132 + ',' + 132 + ')');

      var tooltip = d3.select('#' + elementID + '> .vizTooltip');

      //this selects all <g> elements with class slice (there aren't any yet)
      var arcs = vis.selectAll('g.slice')
        .data(pie(newData)) // associate the generated pie data (an array of arcs, each having
               // startAngle, endAngle and value properties) 
        .enter()   //this will create <g> elements for every 'extra' data element that should
               // be associated with a selection. The result is creating a <g> for every 
               // object in the data array
        .append('g') // create a group to hold each slice (we will have a <path> and 
                 // a <text> element associated with each slice)
        .attr('class', 'slice');    //allow us to style things in the slices (like text)

      arcs.append('path')
        .attr('fill', function(d, i) {
          var t = newData[i].label;
          return fuelColor[t];
        }) //set the color for each slice to be chosen from the color function defined above
        .on('mouseover', function(d, i){
          tooltip.text(d.data['label'] + ': ' + numberWithCommas(d.data['value']) + ' MW');
          tooltip.style('visibility', 'visible');
        })
        .on('mousemove', function(){
          return tooltip.style('top', (event.pageY-10)+'px').style('left',(event.pageX+10)+'px');
        })
        .on('mouseout', function(){
          return tooltip.style('visibility', 'hidden');
        })
        .attr('d', arc); //this creates the actual SVG path using the associated data (pie) with the arc drawing function

      arcs.append('text') //add a label to each slice
        .attr('transform', function(d) {  //set the label's origin to the center of the arc
          //we have to make sure to set these before calling arc.centroid
          d.innerRadius = 0;
          d.outerRadius = r;
          return 'translate(' + arc.centroid(d) + ')';        //this gives us a pair of coordinates like [50, 50]
        })
        .on('mouseover', function(d, i){
          tooltip.text(d.data['label'] + ': ' + numberWithCommas(d.data['value']) + ' MW');
          return tooltip.style('visibility', 'visible');
        })
        .on('mousemove', function(){
          return tooltip.style('top', (event.pageY-10)+'px').style('left',(event.pageX+10)+'px');
        })
        .on('mouseout', function(){
          return tooltip.style('visibility', 'hidden');
        })
        .attr('text-anchor', 'middle') //center the text on its origin
        .text(function(d, i) {
          var percentage = Math.round(newData[i].value / total * 100);
          // console.log(newData[i].label, percentage, fuelColor[newData[i].label])
          if (percentage < 5) {
            return '';
          } else {
            return percentage + '%';
          }
        }); //get the label from our original data array
    };

    //Create base svg
    var svg = d3.select('#map')
      .append('svg')
      .attr('width',width)
      .attr('height',height)
      .attr('class','svgView');

    // Create legend
    var legend = svg.append('g')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', 200)
      .attr('width', 200)
      .attr('class', 'svgView')
      .attr('transform', 'translate([500,0])');

    var legendCircle = legend.selectAll('circle')
      .data(fuelTypes).enter()
      .append("circle")
      .attr("cx", width - 260)
      .attr("r", 8)
      .style("cursor", "pointer")
      .attr("cy", function(d, i) {
        return (legendWidth - 100) + i*25;
      })
      .style("fill", function(d, i) {
        return fuelColor[fuelTypes[i]];
      });

    var legendText = legend.selectAll('text')
      .data(fuelTypes).enter()
      .append("text")
      .attr("x", width - 240)
      .attr("y", function(d, i) {
        return (legendWidth - 95) + i*25;
      })
      .style("cursor", "pointer")
      .text(function(d, i) {
        return fuelTypes[i];
      });

    d3.csv('us_names.csv', function (stateNameData) {
      d3.json('generation_annual.json', function (error, powerData) {
        if (error) {
          return console.warn(error);
        }
        stateNameData.forEach(function(d) {
          statesObj[d.id] = d;
        });

        $('#stateName').html(statesObj[currState].name);
        displayPieChart('pieChart', powerData, currYear, statesObj[currState].code);
        displayPieChart('totalPieChart', powerData, currYear);
        colorMap(powerData, currYear, statesObj, fuelColor, drawDominant);

        legendCircle.on("click", function(d) {
          drawDominant = false;
          currEnergy = d;
          colorMap(powerData, currYear, statesObj, chloroplethScales, drawDominant, currEnergy, quantizeScale);
          $(".resetButton").css("display", "block");
        });
        legendText.on("click", function(d) {
          drawDominant = false;
          currEnergy = d;
          colorMap(powerData, currYear, statesObj, chloroplethScales, drawDominant, currEnergy, quantizeScale);
          $(".resetButton").css("display", "block");
        });
      });
    });
  });
})(jQuery);

