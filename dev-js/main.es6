/* exported arrayFind */
import { arrayFind } from '../js-exports/polyfills';
 
(function(){
"use strict";

  /*var species = {
    B: "Halibut",
    C: "Sablefish",
    D: "Dungeness crab",
    E: "Hair Crab",
    F: "Freshwater fish",
    G: "Herring roe",
    H: "Herring (food/bait)",
    I: "Ling cod",
    J: "Geoduck clams",
    K: "King crab",
    L: "Herring spawn on kelp",
    M: "Misc. saltwater finfish",
    N: "Snails",
    O: "Octopus/squid",
    P: "Shrimp",
    Q: "Sea cucumber",
    R: "Clams",
    S: "Salmon",
    T: "Tanner crab",
    TB: "Tanner Bairdi crab",
    U: "Sea urchin",
    W: "Scallops",
    Y: "Rockfish"
  };

  var gear = {"1":"PURSE SEINE","2":"VESSEL TO 80'","4":"SET GILLNET","5":"HAND TROLL","6":"LONGLINE VESSEL UNDER 60'","7":"OTTER TRAWL","8":"FISH WHEEL","9":"POT GEAR VESSEL UNDER 60'","10":"RING NET","11":"DIVING GEAR","12":"DIVE/HAND PICK","17":"BEAM TRAWL","18":"SHOVEL","21":"POUND","23":"MECHANICAL DIGGER","25":"DINGLEBAR TROLL","26":"MECHANICAL JIG","34":"GILLNET","37":"PAIR TRAWL","61":"LONGLINE VESSEL 60' OR OVER","77":"GILLNET","91":"POT GEAR VESSEL 60' OR OVER"};

  var regions = {"A":"SOUTHEAST","B":"STATEWIDE","D":"YAKUTAT","E":"PRINCE WILLIAM SOUND","J":"WESTWARD","L":"CHIGNIK","M":"ALASKA PENINSULA","Q":"BERING SEA","T":"BRISTOL BAY","X":"KOTZEBUE","H":"COOK INLET","S":"SECURITY COVE","V":"CAPE AVINOF","Z":"NORTON SOUND","K":"KODIAK","O":"DUTCH HARBOR","OA":"ALEUTIAN CDQAPICDA","OB":"ALEUTIAN CDQBBEDC","OC":"ALEUTIAN CDQCBSFA","OD":"ALEUTIAN CDQCVRF","OE":"ALEUTIAN CDQNSEDC","OF":"ALEUTIAN CDQYDFDA","OG":"ALEUTIAN ISLANDS ACAACDC","QA":"BERING SEA CDQAPICDA","QB":"BERING SEA CDQBBEDC","QC":"BERING SEA CDQCBSFA","QD":"BERING SEA CDQCVRF","QE":"BERING SEA CDQNSEDC","QF":"BERING SEA CDQYDFDA","TA":"BRISTOL BAY CDQAPICDA","TB":"BRISTOL BAY CDQBBEDC","TC":"BRISTOL BAY CDQCBSFA","TD":"BRISTOL BAY CDQCVRF","TE":"BRISTOL BAY CDQNSEDC","TF":"BRISTOL BAY CDQYDFDA","ZE":"NORTON SOUND CDQNSEDC","ZF":"NORTON SOUND CDQYDFDA","G":"GOA","AB":"STATEWIDE","AG":"GOA","BB":"STATEWIDE","BG":"GOA","FB":"STATEWIDE","FG":"GOA","GB":"STATEWIDE","GG":"GOA","HB":"STATEWIDE","HG":"GOA","IB":"STATEWIDE","IG":"GOA","F":"ATKA/AMLIA ISLANDS","R":"ADAK","AFW":"FEDERAL WATERS","ASW":"STATE WATERS","BFW":"FEDERAL WATERS","BSW":"STATE WATERS"};
*/
  /*var margin = {top: 30, right: 0, bottom: 10, left: 60},
      width = 850,
      height = 850;*/

  //var colors = ['#30653a','#7d4f00','#4e597d','#2a616e','#a3301e','#81447f','#005fa9'];

 // var x = d3.scaleBand().range([0, width]);
      //y = d3.scaleBand().range([0, height]),
      //z = d3.scalePow().exponent(0.2).domain([0,100]).range([0,1]);

  var fishNodes = null,
      fishLinks = null;

  var margin = { // expressed as percentages
      top:0,
      right:0,
      bottom:0,
      left:0
    },
    width = 100 - margin.right - margin.left,
    height = 100 - margin.top - margin.bottom,
    outerRadius = Math.min(width, height) * 0.5 - 3,
    innerRadius = outerRadius - 3;

  var threshold = 20;

  d3.csv('matrix-headers.csv', function(data){
    console.log(data);
    fishLinks = data;
    goGate();
  });
  d3.csv('fisheries-nodes.csv', function(data){
    console.log(data);
    data.forEach(function(each){
      for (var key in each){
        if ( each.hasOwnProperty(key) ){
          if ( !isNaN(+each[key]) ){ 
            each[key] = +each[key];
          }
        }
      }
    });
    fishNodes = data;
    goGate();
  });

  function goGate(){
    if ( fishNodes !== null && fishLinks !== null ){
      go();
    } else {
      return;
    }
  }

  var newLinks = [],
  network = {};
  
  function go(){
    function isMatch(key){
      return fishNodes.find(function(obj){
        return obj.name === key;
      });
    }
    fishLinks.forEach(function(each,i){
      for (var key in each){
        if ( each.hasOwnProperty(key) ){
          let match = isMatch(key);
          
          let index = match.index;
          if (index !== i && each[key] !== "0" ){ // if source and target are not the same
            newLinks.push({
              source: i,
              target: index, 
              value: +each[key]
            });
          }
        }
      }
    }); // end forEach
    network.nodes = fishNodes;
    network.links = newLinks;
    render(network);
  } // end go()

  function render(network) {
    console.log(network);
    var nodes = network.nodes,
        n = nodes.length,
        matrix = d3.range(n).map(() => d3.range(n).map(() => 0)); // create square matrix with all values = 0

    // Compute index per node.
  /*  nodes.forEach(function(node, i) {
      node.index = i;
      node.count = 0;
      matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
    });*/
   // console.log(matrix);
    // Convert links to matrix; count character occurrences.
    network.links.forEach(function(link) {
      matrix[link.source][link.target] = link.value;
      matrix[link.target][link.source] = link.value;
     // matrix[link.source][link.source] = link.value;
     // matrix[link.target][link.target] = link.value;
     // nodes[link.source].count += link.value;
     // nodes[link.target].count += link.value;
    });

    console.log(matrix);
    var svg = d3.select('body')
      .append('svg')
      .attr('width', '100%')
      .attr('xmlns','http://www.w3.org/2000/svg')
      .attr('version','1.1')
      .attr('viewBox', '0 0 100 100')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var chord = d3.chord()
      .padAngle(0)
      .sortSubgroups(d3.descending);

    console.log(chord(matrix));
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var ribbon = d3.ribbon()
        .radius(innerRadius);

    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var formatValue = d3.formatPrefix(",.0", 1e3);

    var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .datum(chord(matrix));

    var group = g.append("g")
        .attr("class", "groups")
      .selectAll("g")
      .data(function(chords) { console.log(chords); return chords.groups; })
      .enter().append("g");

    group.append("path")
        .attr('class','arcs')
        .style("fill", function(d) { console.log(d); return color(d.index); })
        .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
        .attr("d", arc);

    var groupTick = group.selectAll(".group-tick")
      .data(function(d) { return groupTicks(d, 1e3); })
      .enter().append("g")
        .attr("class", "group-tick")
        .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; });

    groupTick.append("line")
        .attr("x2", 0.6);

groupTick
  .filter(function(d) { return d.value % 5e3 === 0; })
  .append("text")
    .attr("x", 0.8)
    .attr("dy", ".35em")
    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) { return formatValue(d.value); });

g.append("g")
    .attr("class", "ribbons")
    .selectAll("path")
    .data(function(chords) { return chords; })
    .enter().append("path")
      .attr("d", d => {
        if ( d.source.value > threshold || d.target.value > threshold ){
          return ribbon(d);
        }
      })
      .style("fill", function(d) { return color(d.target.index); })
      .style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); });

// Returns an array of tick angles and values for a given group and step.
function groupTicks(d, step) {
  var k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, step).map(function(value) {
    return {value: value, angle: value * k + d.startAngle};
  });
}

   /* function setOrder(primary,secondary){
      function returnOrder(field){
        if ( field === 'count'){
          return d3.descending;
        } else {
          return d3.ascending;
        }
      }
      return d3.range(n).sort(function(a, b) { return returnOrder(primary)(nodes[a][primary], nodes[b][primary]) || returnOrder(secondary)(nodes[a][secondary], nodes[b][secondary]);});
    }*/
    

    // The default sort order.
    //x.domain(setOrder('cluster','species'));
  }
})();