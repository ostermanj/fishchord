(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _polyfills = require('../js-exports/polyfills');

(function () {
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
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
      width = 100 - margin.right - margin.left,
      height = 100 - margin.top - margin.bottom,
      outerRadius = Math.min(width, height) * 0.5 - 3,
      innerRadius = outerRadius - 3;

  var threshold = 20;

  d3.csv('matrix-headers.csv', function (data) {
    console.log(data);
    fishLinks = data;
    goGate();
  });
  d3.csv('fisheries-nodes.csv', function (data) {
    console.log(data);
    data.forEach(function (each) {
      for (var key in each) {
        if (each.hasOwnProperty(key)) {
          if (!isNaN(+each[key])) {
            each[key] = +each[key];
          }
        }
      }
    });
    fishNodes = data;
    goGate();
  });

  function goGate() {
    if (fishNodes !== null && fishLinks !== null) {
      go();
    } else {
      return;
    }
  }

  var newLinks = [],
      network = {};

  function go() {
    function isMatch(key) {
      return fishNodes.find(function (obj) {
        return obj.name === key;
      });
    }
    fishLinks.forEach(function (each, i) {
      for (var key in each) {
        if (each.hasOwnProperty(key)) {
          var match = isMatch(key);

          var index = match.index;
          if (index !== i && each[key] !== "0") {
            // if source and target are not the same
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
        matrix = d3.range(n).map(function () {
      return d3.range(n).map(function () {
        return 0;
      });
    }); // create square matrix with all values = 0

    // Compute index per node.
    /*  nodes.forEach(function(node, i) {
        node.index = i;
        node.count = 0;
        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
      });*/
    // console.log(matrix);
    // Convert links to matrix; count character occurrences.
    network.links.forEach(function (link) {
      matrix[link.source][link.target] = link.value;
      matrix[link.target][link.source] = link.value;
      // matrix[link.source][link.source] = link.value;
      // matrix[link.target][link.target] = link.value;
      // nodes[link.source].count += link.value;
      // nodes[link.target].count += link.value;
    });

    console.log(matrix);
    var svg = d3.select('body').append('svg').attr('width', '100%').attr('xmlns', 'http://www.w3.org/2000/svg').attr('version', '1.1').attr('viewBox', '0 0 100 100').append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var chord = d3.chord().padAngle(0).sortSubgroups(d3.descending);

    console.log(chord(matrix));
    var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    var ribbon = d3.ribbon().radius(innerRadius);

    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var formatValue = d3.formatPrefix(",.0", 1e3);

    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").datum(chord(matrix));

    var group = g.append("g").attr("class", "groups").selectAll("g").data(function (chords) {
      console.log(chords);return chords.groups;
    }).enter().append("g");

    group.append("path").attr('class', 'arcs').style("fill", function (d) {
      console.log(d);return color(d.index);
    }).style("stroke", function (d) {
      return d3.rgb(color(d.index)).darker();
    }).attr("d", arc);

    var groupTick = group.selectAll(".group-tick").data(function (d) {
      return groupTicks(d, 1e3);
    }).enter().append("g").attr("class", "group-tick").attr("transform", function (d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)";
    });

    groupTick.append("line").attr("x2", 0.6);

    groupTick.filter(function (d) {
      return d.value % 5e3 === 0;
    }).append("text").attr("x", 0.8).attr("dy", ".35em").attr("transform", function (d) {
      return d.angle > Math.PI ? "rotate(180) translate(-16)" : null;
    }).style("text-anchor", function (d) {
      return d.angle > Math.PI ? "end" : null;
    }).text(function (d) {
      return formatValue(d.value);
    });

    g.append("g").attr("class", "ribbons").selectAll("path").data(function (chords) {
      return chords;
    }).enter().append("path").attr("d", function (d) {
      if (d.source.value > threshold || d.target.value > threshold) {
        return ribbon(d);
      }
    }).style("fill", function (d) {
      return color(d.target.index);
    }).style("stroke", function (d) {
      return d3.rgb(color(d.target.index)).darker();
    });

    // Returns an array of tick angles and values for a given group and step.
    function groupTicks(d, step) {
      var k = (d.endAngle - d.startAngle) / d.value;
      return d3.range(0, d.value, step).map(function (value) {
        return { value: value, angle: value * k + d.startAngle };
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
})(); /* exported arrayFind */

},{"../js-exports/polyfills":2}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * SVG focus 
 * Copyright(c) 2017, John Osterman
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
 * associated documentation files (the "Software"), to deal in the Software without restriction, including 
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
 * following conditions:

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO 
 * EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE 
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// IE/Edge (perhaps others) does not allow programmatic focusing of SVG Elements (via `focus()`). Same for `blur()`.

var SVGFocus = exports.SVGFocus = function () {
  if ('focus' in SVGElement.prototype === false) {
    SVGElement.prototype.focus = HTMLElement.prototype.focus;
  }
  if ('blur' in SVGElement.prototype === false) {
    SVGElement.prototype.blur = HTMLElement.prototype.blur;
  }
}();

/**
 * innerHTML property for SVGElement
 * Copyright(c) 2010, Jeff Schiller
 *
 * Licensed under the Apache License, Version 2
 *
 * Works in a SVG document in Chrome 6+, Safari 5+, Firefox 4+ and IE9+.
 * Works in a HTML5 document in Chrome 7+, Firefox 4+ and IE9+.
 * Does not work in Opera since it doesn't support the SVGElement interface yet.
 *
 * I haven't decided on the best name for this property - thus the duplication.
 */
// edited by John Osterman to declare the variable `sXML`, which was referenced without being declared
// which failed silently in implicit strict mode of an export

// most browsers allow setting innerHTML of svg elements but IE does not (not an HTML element)
// this polyfill provides that. necessary for d3 method `.html()` on svg elements

var SVGInnerHTML = exports.SVGInnerHTML = function () {
  var serializeXML = function serializeXML(node, output) {
    var nodeType = node.nodeType;
    if (nodeType == 3) {
      // TEXT nodes.
      // Replace special XML characters with their entities.
      output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
    } else if (nodeType == 1) {
      // ELEMENT nodes.
      // Serialize Element nodes.
      output.push('<', node.tagName);
      if (node.hasAttributes()) {
        var attrMap = node.attributes;
        for (var i = 0, len = attrMap.length; i < len; ++i) {
          var attrNode = attrMap.item(i);
          output.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
        }
      }
      if (node.hasChildNodes()) {
        output.push('>');
        var childNodes = node.childNodes;
        for (var i = 0, len = childNodes.length; i < len; ++i) {
          serializeXML(childNodes.item(i), output);
        }
        output.push('</', node.tagName, '>');
      } else {
        output.push('/>');
      }
    } else if (nodeType == 8) {
      // TODO(codedread): Replace special characters with XML entities?
      output.push('<!--', node.nodeValue, '-->');
    } else {
      // TODO: Handle CDATA nodes.
      // TODO: Handle ENTITY nodes.
      // TODO: Handle DOCUMENT nodes.
      throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
    }
  };
  // The innerHTML DOM property for SVGElement.
  if ('innerHTML' in SVGElement.prototype === false) {
    Object.defineProperty(SVGElement.prototype, 'innerHTML', {
      get: function get() {
        var output = [];
        var childNode = this.firstChild;
        while (childNode) {
          serializeXML(childNode, output);
          childNode = childNode.nextSibling;
        }
        return output.join('');
      },
      set: function set(markupText) {
        console.log(this);
        // Wipe out the current contents of the element.
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        }

        try {
          // Parse the markup into valid nodes.
          var dXML = new DOMParser();
          dXML.async = false;
          // Wrap the markup into a SVG node to ensure parsing works.
          console.log(markupText);
          var sXML = '<svg xmlns="http://www.w3.org/2000/svg">' + markupText + '</svg>';
          console.log(sXML);
          var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement;

          // Now take each node, import it and append to this element.
          var childNode = svgDocElement.firstChild;
          while (childNode) {
            this.appendChild(this.ownerDocument.importNode(childNode, true));
            childNode = childNode.nextSibling;
          }
        } catch (e) {
          throw new Error('Error parsing XML string');
        };
      }
    });

    // The innerSVG DOM property for SVGElement.
    Object.defineProperty(SVGElement.prototype, 'innerSVG', {
      get: function get() {
        return this.innerHTML;
      },
      set: function set(markupText) {
        this.innerHTML = markupText;
      }
    });
  }
}();

// https://tc39.github.io/ecma262/#sec-array.prototype.find
var arrayFind = exports.arrayFind = function () {
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function value(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return undefined.
        return undefined;
      }
    });
  }
}();

// Copyright (C) 2011-2012 Software Languages Lab, Vrije Universiteit Brussel
// This code is dual-licensed under both the Apache License and the MPL

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is a shim for the ES-Harmony reflection module
 *
 * The Initial Developer of the Original Code is
 * Tom Van Cutsem, Vrije Universiteit Brussel.
 * Portions created by the Initial Developer are Copyright (C) 2011-2012
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 */

// ----------------------------------------------------------------------------

// This file is a polyfill for the upcoming ECMAScript Reflect API,
// including support for Proxies. See the draft specification at:
// http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api
// http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

// For an implementation of the Handler API, see handlers.js, which implements:
// http://wiki.ecmascript.org/doku.php?id=harmony:virtual_object_api

// This implementation supersedes the earlier polyfill at:
// code.google.com/p/es-lab/source/browse/trunk/src/proxies/DirectProxies.js

// This code was tested on tracemonkey / Firefox 12
//  (and should run fine on older Firefox versions starting with FF4)
// The code also works correctly on
//   v8 --harmony_proxies --harmony_weakmaps (v3.6.5.1)

// Language Dependencies:
//  - ECMAScript 5/strict
//  - "old" (i.e. non-direct) Harmony Proxies
//  - Harmony WeakMaps
// Patches:
//  - Object.{freeze,seal,preventExtensions}
//  - Object.{isFrozen,isSealed,isExtensible}
//  - Object.getPrototypeOf
//  - Object.keys
//  - Object.prototype.valueOf
//  - Object.prototype.isPrototypeOf
//  - Object.prototype.toString
//  - Object.prototype.hasOwnProperty
//  - Object.getOwnPropertyDescriptor
//  - Object.defineProperty
//  - Object.defineProperties
//  - Object.getOwnPropertyNames
//  - Object.getOwnPropertySymbols
//  - Object.getPrototypeOf
//  - Object.setPrototypeOf
//  - Object.assign
//  - Function.prototype.toString
//  - Date.prototype.toString
//  - Array.isArray
//  - Array.prototype.concat
//  - Proxy
// Adds new globals:
//  - Reflect

// Direct proxies can be created via Proxy(target, handler)

// ----------------------------------------------------------------------------

var reflect = exports.reflect = function (global) {
  // function-as-module pattern
  "use strict";

  // === Direct Proxies: Invariant Enforcement ===

  // Direct proxies build on non-direct proxies by automatically wrapping
  // all user-defined proxy handlers in a Validator handler that checks and
  // enforces ES5 invariants.

  // A direct proxy is a proxy for an existing object called the target object.

  // A Validator handler is a wrapper for a target proxy handler H.
  // The Validator forwards all operations to H, but additionally
  // performs a number of integrity checks on the results of some traps,
  // to make sure H does not violate the ES5 invariants w.r.t. non-configurable
  // properties and non-extensible, sealed or frozen objects.

  // For each property that H exposes as own, non-configurable
  // (e.g. by returning a descriptor from a call to getOwnPropertyDescriptor)
  // the Validator handler defines those properties on the target object.
  // When the proxy becomes non-extensible, also configurable own properties
  // are checked against the target.
  // We will call properties that are defined on the target object
  // "fixed properties".

  // We will name fixed non-configurable properties "sealed properties".
  // We will name fixed non-configurable non-writable properties "frozen
  // properties".

  // The Validator handler upholds the following invariants w.r.t. non-configurability:
  // - getOwnPropertyDescriptor cannot report sealed properties as non-existent
  // - getOwnPropertyDescriptor cannot report incompatible changes to the
  //   attributes of a sealed property (e.g. reporting a non-configurable
  //   property as configurable, or reporting a non-configurable, non-writable
  //   property as writable)
  // - getPropertyDescriptor cannot report sealed properties as non-existent
  // - getPropertyDescriptor cannot report incompatible changes to the
  //   attributes of a sealed property. It _can_ report incompatible changes
  //   to the attributes of non-own, inherited properties.
  // - defineProperty cannot make incompatible changes to the attributes of
  //   sealed properties
  // - deleteProperty cannot report a successful deletion of a sealed property
  // - hasOwn cannot report a sealed property as non-existent
  // - has cannot report a sealed property as non-existent
  // - get cannot report inconsistent values for frozen data
  //   properties, and must report undefined for sealed accessors with an
  //   undefined getter
  // - set cannot report a successful assignment for frozen data
  //   properties or sealed accessors with an undefined setter.
  // - get{Own}PropertyNames lists all sealed properties of the target.
  // - keys lists all enumerable sealed properties of the target.
  // - enumerate lists all enumerable sealed properties of the target.
  // - if a property of a non-extensible proxy is reported as non-existent,
  //   then it must forever be reported as non-existent. This applies to
  //   own and inherited properties and is enforced in the
  //   deleteProperty, get{Own}PropertyDescriptor, has{Own},
  //   get{Own}PropertyNames, keys and enumerate traps

  // Violation of any of these invariants by H will result in TypeError being
  // thrown.

  // Additionally, once Object.preventExtensions, Object.seal or Object.freeze
  // is invoked on the proxy, the set of own property names for the proxy is
  // fixed. Any property name that is not fixed is called a 'new' property.

  // The Validator upholds the following invariants regarding extensibility:
  // - getOwnPropertyDescriptor cannot report new properties as existent
  //   (it must report them as non-existent by returning undefined)
  // - defineProperty cannot successfully add a new property (it must reject)
  // - getOwnPropertyNames cannot list new properties
  // - hasOwn cannot report true for new properties (it must report false)
  // - keys cannot list new properties

  // Invariants currently not enforced:
  // - getOwnPropertyNames lists only own property names
  // - keys lists only enumerable own property names
  // Both traps may list more property names than are actually defined on the
  // target.

  // Invariants with regard to inheritance are currently not enforced.
  // - a non-configurable potentially inherited property on a proxy with
  //   non-mutable ancestry cannot be reported as non-existent
  // (An object with non-mutable ancestry is a non-extensible object whose
  // [[Prototype]] is either null or an object with non-mutable ancestry.)

  // Changes in Handler API compared to previous harmony:proxies, see:
  // http://wiki.ecmascript.org/doku.php?id=strawman:direct_proxies
  // http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

  // ----------------------------------------------------------------------------

  // ---- WeakMap polyfill ----

  // TODO: find a proper WeakMap polyfill

  // define an empty WeakMap so that at least the Reflect module code
  // will work in the absence of WeakMaps. Proxy emulation depends on
  // actual WeakMaps, so will not work with this little shim.

  if (typeof WeakMap === "undefined") {
    global.WeakMap = function () {};
    global.WeakMap.prototype = {
      get: function get(k) {
        return undefined;
      },
      set: function set(k, v) {
        throw new Error("WeakMap not supported");
      }
    };
  }

  // ---- Normalization functions for property descriptors ----

  function isStandardAttribute(name) {
    return (/^(get|set|value|writable|enumerable|configurable)$/.test(name)
    );
  }

  // Adapted from ES5 section 8.10.5
  function toPropertyDescriptor(obj) {
    if (Object(obj) !== obj) {
      throw new TypeError("property descriptor should be an Object, given: " + obj);
    }
    var desc = {};
    if ('enumerable' in obj) {
      desc.enumerable = !!obj.enumerable;
    }
    if ('configurable' in obj) {
      desc.configurable = !!obj.configurable;
    }
    if ('value' in obj) {
      desc.value = obj.value;
    }
    if ('writable' in obj) {
      desc.writable = !!obj.writable;
    }
    if ('get' in obj) {
      var getter = obj.get;
      if (getter !== undefined && typeof getter !== "function") {
        throw new TypeError("property descriptor 'get' attribute must be " + "callable or undefined, given: " + getter);
      }
      desc.get = getter;
    }
    if ('set' in obj) {
      var setter = obj.set;
      if (setter !== undefined && typeof setter !== "function") {
        throw new TypeError("property descriptor 'set' attribute must be " + "callable or undefined, given: " + setter);
      }
      desc.set = setter;
    }
    if ('get' in desc || 'set' in desc) {
      if ('value' in desc || 'writable' in desc) {
        throw new TypeError("property descriptor cannot be both a data and an " + "accessor descriptor: " + obj);
      }
    }
    return desc;
  }

  function isAccessorDescriptor(desc) {
    if (desc === undefined) return false;
    return 'get' in desc || 'set' in desc;
  }
  function isDataDescriptor(desc) {
    if (desc === undefined) return false;
    return 'value' in desc || 'writable' in desc;
  }
  function isGenericDescriptor(desc) {
    if (desc === undefined) return false;
    return !isAccessorDescriptor(desc) && !isDataDescriptor(desc);
  }

  function toCompletePropertyDescriptor(desc) {
    var internalDesc = toPropertyDescriptor(desc);
    if (isGenericDescriptor(internalDesc) || isDataDescriptor(internalDesc)) {
      if (!('value' in internalDesc)) {
        internalDesc.value = undefined;
      }
      if (!('writable' in internalDesc)) {
        internalDesc.writable = false;
      }
    } else {
      if (!('get' in internalDesc)) {
        internalDesc.get = undefined;
      }
      if (!('set' in internalDesc)) {
        internalDesc.set = undefined;
      }
    }
    if (!('enumerable' in internalDesc)) {
      internalDesc.enumerable = false;
    }
    if (!('configurable' in internalDesc)) {
      internalDesc.configurable = false;
    }
    return internalDesc;
  }

  function isEmptyDescriptor(desc) {
    return !('get' in desc) && !('set' in desc) && !('value' in desc) && !('writable' in desc) && !('enumerable' in desc) && !('configurable' in desc);
  }

  function isEquivalentDescriptor(desc1, desc2) {
    return sameValue(desc1.get, desc2.get) && sameValue(desc1.set, desc2.set) && sameValue(desc1.value, desc2.value) && sameValue(desc1.writable, desc2.writable) && sameValue(desc1.enumerable, desc2.enumerable) && sameValue(desc1.configurable, desc2.configurable);
  }

  // copied from http://wiki.ecmascript.org/doku.php?id=harmony:egal
  function sameValue(x, y) {
    if (x === y) {
      // 0 === -0, but they are not identical
      return x !== 0 || 1 / x === 1 / y;
    }

    // NaN !== NaN, but they are identical.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is a NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN("foo") => true
    return x !== x && y !== y;
  }

  /**
   * Returns a fresh property descriptor that is guaranteed
   * to be complete (i.e. contain all the standard attributes).
   * Additionally, any non-standard enumerable properties of
   * attributes are copied over to the fresh descriptor.
   *
   * If attributes is undefined, returns undefined.
   *
   * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
   */
  function normalizeAndCompletePropertyDescriptor(attributes) {
    if (attributes === undefined) {
      return undefined;
    }
    var desc = toCompletePropertyDescriptor(attributes);
    // Note: no need to call FromPropertyDescriptor(desc), as we represent
    // "internal" property descriptors as proper Objects from the start
    for (var name in attributes) {
      if (!isStandardAttribute(name)) {
        Object.defineProperty(desc, name, { value: attributes[name],
          writable: true,
          enumerable: true,
          configurable: true });
      }
    }
    return desc;
  }

  /**
   * Returns a fresh property descriptor whose standard
   * attributes are guaranteed to be data properties of the right type.
   * Additionally, any non-standard enumerable properties of
   * attributes are copied over to the fresh descriptor.
   *
   * If attributes is undefined, will throw a TypeError.
   *
   * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
   */
  function normalizePropertyDescriptor(attributes) {
    var desc = toPropertyDescriptor(attributes);
    // Note: no need to call FromGenericPropertyDescriptor(desc), as we represent
    // "internal" property descriptors as proper Objects from the start
    for (var name in attributes) {
      if (!isStandardAttribute(name)) {
        Object.defineProperty(desc, name, { value: attributes[name],
          writable: true,
          enumerable: true,
          configurable: true });
      }
    }
    return desc;
  }

  // store a reference to the real ES5 primitives before patching them later
  var prim_preventExtensions = Object.preventExtensions,
      prim_seal = Object.seal,
      prim_freeze = Object.freeze,
      prim_isExtensible = Object.isExtensible,
      prim_isSealed = Object.isSealed,
      prim_isFrozen = Object.isFrozen,
      prim_getPrototypeOf = Object.getPrototypeOf,
      prim_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
      prim_defineProperty = Object.defineProperty,
      prim_defineProperties = Object.defineProperties,
      prim_keys = Object.keys,
      prim_getOwnPropertyNames = Object.getOwnPropertyNames,
      prim_getOwnPropertySymbols = Object.getOwnPropertySymbols,
      prim_assign = Object.assign,
      prim_isArray = Array.isArray,
      prim_concat = Array.prototype.concat,
      prim_isPrototypeOf = Object.prototype.isPrototypeOf,
      prim_hasOwnProperty = Object.prototype.hasOwnProperty;

  // these will point to the patched versions of the respective methods on
  // Object. They are used within this module as the "intrinsic" bindings
  // of these methods (i.e. the "original" bindings as defined in the spec)
  var Object_isFrozen, Object_isSealed, Object_isExtensible, Object_getPrototypeOf, Object_getOwnPropertyNames;

  /**
   * A property 'name' is fixed if it is an own property of the target.
   */
  function isFixed(name, target) {
    return {}.hasOwnProperty.call(target, name);
  }
  function isSealed(name, target) {
    var desc = Object.getOwnPropertyDescriptor(target, name);
    if (desc === undefined) {
      return false;
    }
    return desc.configurable === false;
  }
  function isSealedDesc(desc) {
    return desc !== undefined && desc.configurable === false;
  }

  /**
   * Performs all validation that Object.defineProperty performs,
   * without actually defining the property. Returns a boolean
   * indicating whether validation succeeded.
   *
   * Implementation transliterated from ES5.1 section 8.12.9
   */
  function isCompatibleDescriptor(extensible, current, desc) {
    if (current === undefined && extensible === false) {
      return false;
    }
    if (current === undefined && extensible === true) {
      return true;
    }
    if (isEmptyDescriptor(desc)) {
      return true;
    }
    if (isEquivalentDescriptor(current, desc)) {
      return true;
    }
    if (current.configurable === false) {
      if (desc.configurable === true) {
        return false;
      }
      if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
        return false;
      }
    }
    if (isGenericDescriptor(desc)) {
      return true;
    }
    if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
      if (current.configurable === false) {
        return false;
      }
      return true;
    }
    if (isDataDescriptor(current) && isDataDescriptor(desc)) {
      if (current.configurable === false) {
        if (current.writable === false && desc.writable === true) {
          return false;
        }
        if (current.writable === false) {
          if ('value' in desc && !sameValue(desc.value, current.value)) {
            return false;
          }
        }
      }
      return true;
    }
    if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
      if (current.configurable === false) {
        if ('set' in desc && !sameValue(desc.set, current.set)) {
          return false;
        }
        if ('get' in desc && !sameValue(desc.get, current.get)) {
          return false;
        }
      }
    }
    return true;
  }

  // ES6 7.3.11 SetIntegrityLevel
  // level is one of "sealed" or "frozen"
  function setIntegrityLevel(target, level) {
    var ownProps = Object_getOwnPropertyNames(target);
    var pendingException = undefined;
    if (level === "sealed") {
      var l = +ownProps.length;
      var k;
      for (var i = 0; i < l; i++) {
        k = String(ownProps[i]);
        try {
          Object.defineProperty(target, k, { configurable: false });
        } catch (e) {
          if (pendingException === undefined) {
            pendingException = e;
          }
        }
      }
    } else {
      // level === "frozen"
      var l = +ownProps.length;
      var k;
      for (var i = 0; i < l; i++) {
        k = String(ownProps[i]);
        try {
          var currentDesc = Object.getOwnPropertyDescriptor(target, k);
          if (currentDesc !== undefined) {
            var desc;
            if (isAccessorDescriptor(currentDesc)) {
              desc = { configurable: false };
            } else {
              desc = { configurable: false, writable: false };
            }
            Object.defineProperty(target, k, desc);
          }
        } catch (e) {
          if (pendingException === undefined) {
            pendingException = e;
          }
        }
      }
    }
    if (pendingException !== undefined) {
      throw pendingException;
    }
    return Reflect.preventExtensions(target);
  }

  // ES6 7.3.12 TestIntegrityLevel
  // level is one of "sealed" or "frozen"
  function testIntegrityLevel(target, level) {
    var isExtensible = Object_isExtensible(target);
    if (isExtensible) return false;

    var ownProps = Object_getOwnPropertyNames(target);
    var pendingException = undefined;
    var configurable = false;
    var writable = false;

    var l = +ownProps.length;
    var k;
    var currentDesc;
    for (var i = 0; i < l; i++) {
      k = String(ownProps[i]);
      try {
        currentDesc = Object.getOwnPropertyDescriptor(target, k);
        configurable = configurable || currentDesc.configurable;
        if (isDataDescriptor(currentDesc)) {
          writable = writable || currentDesc.writable;
        }
      } catch (e) {
        if (pendingException === undefined) {
          pendingException = e;
          configurable = true;
        }
      }
    }
    if (pendingException !== undefined) {
      throw pendingException;
    }
    if (level === "frozen" && writable === true) {
      return false;
    }
    if (configurable === true) {
      return false;
    }
    return true;
  }

  // ---- The Validator handler wrapper around user handlers ----

  /**
   * @param target the object wrapped by this proxy.
   * As long as the proxy is extensible, only non-configurable properties
   * are checked against the target. Once the proxy becomes non-extensible,
   * invariants w.r.t. non-extensibility are also enforced.
   *
   * @param handler the handler of the direct proxy. The object emulated by
   * this handler is validated against the target object of the direct proxy.
   * Any violations that the handler makes against the invariants
   * of the target will cause a TypeError to be thrown.
   *
   * Both target and handler must be proper Objects at initialization time.
   */
  function Validator(target, handler) {
    // for non-revokable proxies, these are const references
    // for revokable proxies, on revocation:
    // - this.target is set to null
    // - this.handler is set to a handler that throws on all traps
    this.target = target;
    this.handler = handler;
  }

  Validator.prototype = {

    /**
     * If getTrap returns undefined, the caller should perform the
     * default forwarding behavior.
     * If getTrap returns normally otherwise, the return value
     * will be a callable trap function. When calling the trap function,
     * the caller is responsible for binding its |this| to |this.handler|.
     */
    getTrap: function getTrap(trapName) {
      var trap = this.handler[trapName];
      if (trap === undefined) {
        // the trap was not defined,
        // perform the default forwarding behavior
        return undefined;
      }

      if (typeof trap !== "function") {
        throw new TypeError(trapName + " trap is not callable: " + trap);
      }

      return trap;
    },

    // === fundamental traps ===

    /**
     * If name denotes a fixed property, check:
     *   - whether targetHandler reports it as existent
     *   - whether the returned descriptor is compatible with the fixed property
     * If the proxy is non-extensible, check:
     *   - whether name is not a new property
     * Additionally, the returned descriptor is normalized and completed.
     */
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(name) {
      "use strict";

      var trap = this.getTrap("getOwnPropertyDescriptor");
      if (trap === undefined) {
        return Reflect.getOwnPropertyDescriptor(this.target, name);
      }

      name = String(name);
      var desc = trap.call(this.handler, this.target, name);
      desc = normalizeAndCompletePropertyDescriptor(desc);

      var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
      var extensible = Object.isExtensible(this.target);

      if (desc === undefined) {
        if (isSealedDesc(targetDesc)) {
          throw new TypeError("cannot report non-configurable property '" + name + "' as non-existent");
        }
        if (!extensible && targetDesc !== undefined) {
          // if handler is allowed to return undefined, we cannot guarantee
          // that it will not return a descriptor for this property later.
          // Once a property has been reported as non-existent on a non-extensible
          // object, it should forever be reported as non-existent
          throw new TypeError("cannot report existing own property '" + name + "' as non-existent on a non-extensible object");
        }
        return undefined;
      }

      // at this point, we know (desc !== undefined), i.e.
      // targetHandler reports 'name' as an existing property

      // Note: we could collapse the following two if-tests into a single
      // test. Separating out the cases to improve error reporting.

      if (!extensible) {
        if (targetDesc === undefined) {
          throw new TypeError("cannot report a new own property '" + name + "' on a non-extensible object");
        }
      }

      if (name !== undefined) {
        if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
          throw new TypeError("cannot report incompatible property descriptor " + "for property '" + name + "'");
        }
      }

      if (desc.configurable === false) {
        if (targetDesc === undefined || targetDesc.configurable === true) {
          // if the property is configurable or non-existent on the target,
          // but is reported as a non-configurable property, it may later be
          // reported as configurable or non-existent, which violates the
          // invariant that if the property might change or disappear, the
          // configurable attribute must be true.
          throw new TypeError("cannot report a non-configurable descriptor " + "for configurable or non-existent property '" + name + "'");
        }
        if ('writable' in desc && desc.writable === false) {
          if (targetDesc.writable === true) {
            // if the property is non-configurable, writable on the target,
            // but is reported as non-configurable, non-writable, it may later
            // be reported as non-configurable, writable again, which violates
            // the invariant that a non-configurable, non-writable property
            // may not change state.
            throw new TypeError("cannot report non-configurable, writable property '" + name + "' as non-configurable, non-writable");
          }
        }
      }

      return desc;
    },

    /**
     * In the direct proxies design with refactored prototype climbing,
     * this trap is deprecated. For proxies-as-prototypes, instead
     * of calling this trap, the get, set, has or enumerate traps are
     * called instead.
     *
     * In this implementation, we "abuse" getPropertyDescriptor to
     * support trapping the get or set traps for proxies-as-prototypes.
     * We do this by returning a getter/setter pair that invokes
     * the corresponding traps.
     *
     * While this hack works for inherited property access, it has some
     * quirks:
     *
     * In Firefox, this trap is only called after a prior invocation
     * of the 'has' trap has returned true. Hence, expect the following
     * behavior:
     * <code>
     * var child = Object.create(Proxy(target, handler));
     * child[name] // triggers handler.has(target, name)
     * // if that returns true, triggers handler.get(target, name, child)
     * </code>
     *
     * On v8, the 'in' operator, when applied to an object that inherits
     * from a proxy, will call getPropertyDescriptor and walk the proto-chain.
     * That calls the below getPropertyDescriptor trap on the proxy. The
     * result of the 'in'-operator is then determined by whether this trap
     * returns undefined or a property descriptor object. That is why
     * we first explicitly trigger the 'has' trap to determine whether
     * the property exists.
     *
     * This has the side-effect that when enumerating properties on
     * an object that inherits from a proxy in v8, only properties
     * for which 'has' returns true are returned:
     *
     * <code>
     * var child = Object.create(Proxy(target, handler));
     * for (var prop in child) {
     *   // only enumerates prop if (prop in child) returns true
     * }
     * </code>
     */
    getPropertyDescriptor: function getPropertyDescriptor(name) {
      var handler = this;

      if (!handler.has(name)) return undefined;

      return {
        get: function get() {
          return handler.get(this, name);
        },
        set: function set(val) {
          if (handler.set(this, name, val)) {
            return val;
          } else {
            throw new TypeError("failed assignment to " + name);
          }
        },
        enumerable: true,
        configurable: true
      };
    },

    /**
     * If name denotes a fixed property, check for incompatible changes.
     * If the proxy is non-extensible, check that new properties are rejected.
     */
    defineProperty: function defineProperty(name, desc) {
      // TODO(tvcutsem): the current tracemonkey implementation of proxies
      // auto-completes 'desc', which is not correct. 'desc' should be
      // normalized, but not completed. Consider:
      // Object.defineProperty(proxy, 'foo', {enumerable:false})
      // This trap will receive desc =
      //  {value:undefined,writable:false,enumerable:false,configurable:false}
      // This will also set all other attributes to their default value,
      // which is unexpected and different from [[DefineOwnProperty]].
      // Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329

      var trap = this.getTrap("defineProperty");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.defineProperty(this.target, name, desc);
      }

      name = String(name);
      var descObj = normalizePropertyDescriptor(desc);
      var success = trap.call(this.handler, this.target, name, descObj);
      success = !!success; // coerce to Boolean

      if (success === true) {

        var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
        var extensible = Object.isExtensible(this.target);

        // Note: we could collapse the following two if-tests into a single
        // test. Separating out the cases to improve error reporting.

        if (!extensible) {
          if (targetDesc === undefined) {
            throw new TypeError("cannot successfully add a new property '" + name + "' to a non-extensible object");
          }
        }

        if (targetDesc !== undefined) {
          if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
            throw new TypeError("cannot define incompatible property " + "descriptor for property '" + name + "'");
          }
          if (isDataDescriptor(targetDesc) && targetDesc.configurable === false && targetDesc.writable === true) {
            if (desc.configurable === false && desc.writable === false) {
              // if the property is non-configurable, writable on the target
              // but was successfully reported to be updated to
              // non-configurable, non-writable, it can later be reported
              // again as non-configurable, writable, which violates
              // the invariant that non-configurable, non-writable properties
              // cannot change state
              throw new TypeError("cannot successfully define non-configurable, writable " + " property '" + name + "' as non-configurable, non-writable");
            }
          }
        }

        if (desc.configurable === false && !isSealedDesc(targetDesc)) {
          // if the property is configurable or non-existent on the target,
          // but is successfully being redefined as a non-configurable property,
          // it may later be reported as configurable or non-existent, which violates
          // the invariant that if the property might change or disappear, the
          // configurable attribute must be true.
          throw new TypeError("cannot successfully define a non-configurable " + "descriptor for configurable or non-existent property '" + name + "'");
        }
      }

      return success;
    },

    /**
     * On success, check whether the target object is indeed non-extensible.
     */
    preventExtensions: function preventExtensions() {
      var trap = this.getTrap("preventExtensions");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.preventExtensions(this.target);
      }

      var success = trap.call(this.handler, this.target);
      success = !!success; // coerce to Boolean
      if (success) {
        if (Object_isExtensible(this.target)) {
          throw new TypeError("can't report extensible object as non-extensible: " + this.target);
        }
      }
      return success;
    },

    /**
     * If name denotes a sealed property, check whether handler rejects.
     */
    delete: function _delete(name) {
      "use strict";

      var trap = this.getTrap("deleteProperty");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.deleteProperty(this.target, name);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name);
      res = !!res; // coerce to Boolean

      var targetDesc;
      if (res === true) {
        targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
        if (targetDesc !== undefined && targetDesc.configurable === false) {
          throw new TypeError("property '" + name + "' is non-configurable " + "and can't be deleted");
        }
        if (targetDesc !== undefined && !Object_isExtensible(this.target)) {
          // if the property still exists on a non-extensible target but
          // is reported as successfully deleted, it may later be reported
          // as present, which violates the invariant that an own property,
          // deleted from a non-extensible object cannot reappear.
          throw new TypeError("cannot successfully delete existing property '" + name + "' on a non-extensible object");
        }
      }

      return res;
    },

    /**
     * The getOwnPropertyNames trap was replaced by the ownKeys trap,
     * which now also returns an array (of strings or symbols) and
     * which performs the same rigorous invariant checks as getOwnPropertyNames
     *
     * See issue #48 on how this trap can still get invoked by external libs
     * that don't use the patched Object.getOwnPropertyNames function.
     */
    getOwnPropertyNames: function getOwnPropertyNames() {
      // Note: removed deprecation warning to avoid dependency on 'console'
      // (and on node, should anyway use util.deprecate). Deprecation warnings
      // can also be annoying when they are outside of the user's control, e.g.
      // when an external library calls unpatched Object.getOwnPropertyNames.
      // Since there is a clean fallback to `ownKeys`, the fact that the
      // deprecated method is still called is mostly harmless anyway.
      // See also issues #65 and #66.
      // console.warn("getOwnPropertyNames trap is deprecated. Use ownKeys instead");
      return this.ownKeys();
    },

    /**
     * Checks whether the trap result does not contain any new properties
     * if the proxy is non-extensible.
     *
     * Any own non-configurable properties of the target that are not included
     * in the trap result give rise to a TypeError. As such, we check whether the
     * returned result contains at least all sealed properties of the target
     * object.
     *
     * Additionally, the trap result is normalized.
     * Instead of returning the trap result directly:
     *  - create and return a fresh Array,
     *  - of which each element is coerced to a String
     *
     * This trap is called a.o. by Reflect.ownKeys, Object.getOwnPropertyNames
     * and Object.keys (the latter filters out only the enumerable own properties).
     */
    ownKeys: function ownKeys() {
      var trap = this.getTrap("ownKeys");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.ownKeys(this.target);
      }

      var trapResult = trap.call(this.handler, this.target);

      // propNames is used as a set of strings
      var propNames = Object.create(null);
      var numProps = +trapResult.length;
      var result = new Array(numProps);

      for (var i = 0; i < numProps; i++) {
        var s = String(trapResult[i]);
        if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
          // non-extensible proxies don't tolerate new own property names
          throw new TypeError("ownKeys trap cannot list a new " + "property '" + s + "' on a non-extensible object");
        }

        propNames[s] = true;
        result[i] = s;
      }

      var ownProps = Object_getOwnPropertyNames(this.target);
      var target = this.target;
      ownProps.forEach(function (ownProp) {
        if (!propNames[ownProp]) {
          if (isSealed(ownProp, target)) {
            throw new TypeError("ownKeys trap failed to include " + "non-configurable property '" + ownProp + "'");
          }
          if (!Object.isExtensible(target) && isFixed(ownProp, target)) {
            // if handler is allowed to report ownProp as non-existent,
            // we cannot guarantee that it will never later report it as
            // existent. Once a property has been reported as non-existent
            // on a non-extensible object, it should forever be reported as
            // non-existent
            throw new TypeError("ownKeys trap cannot report existing own property '" + ownProp + "' as non-existent on a non-extensible object");
          }
        }
      });

      return result;
    },

    /**
     * Checks whether the trap result is consistent with the state of the
     * wrapped target.
     */
    isExtensible: function isExtensible() {
      var trap = this.getTrap("isExtensible");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.isExtensible(this.target);
      }

      var result = trap.call(this.handler, this.target);
      result = !!result; // coerce to Boolean
      var state = Object_isExtensible(this.target);
      if (result !== state) {
        if (result) {
          throw new TypeError("cannot report non-extensible object as extensible: " + this.target);
        } else {
          throw new TypeError("cannot report extensible object as non-extensible: " + this.target);
        }
      }
      return state;
    },

    /**
     * Check whether the trap result corresponds to the target's [[Prototype]]
     */
    getPrototypeOf: function getPrototypeOf() {
      var trap = this.getTrap("getPrototypeOf");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.getPrototypeOf(this.target);
      }

      var allegedProto = trap.call(this.handler, this.target);

      if (!Object_isExtensible(this.target)) {
        var actualProto = Object_getPrototypeOf(this.target);
        if (!sameValue(allegedProto, actualProto)) {
          throw new TypeError("prototype value does not match: " + this.target);
        }
      }

      return allegedProto;
    },

    /**
     * If target is non-extensible and setPrototypeOf trap returns true,
     * check whether the trap result corresponds to the target's [[Prototype]]
     */
    setPrototypeOf: function setPrototypeOf(newProto) {
      var trap = this.getTrap("setPrototypeOf");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.setPrototypeOf(this.target, newProto);
      }

      var success = trap.call(this.handler, this.target, newProto);

      success = !!success;
      if (success && !Object_isExtensible(this.target)) {
        var actualProto = Object_getPrototypeOf(this.target);
        if (!sameValue(newProto, actualProto)) {
          throw new TypeError("prototype value does not match: " + this.target);
        }
      }

      return success;
    },

    /**
     * In the direct proxies design with refactored prototype climbing,
     * this trap is deprecated. For proxies-as-prototypes, for-in will
     * call the enumerate() trap. If that trap is not defined, the
     * operation is forwarded to the target, no more fallback on this
     * fundamental trap.
     */
    getPropertyNames: function getPropertyNames() {
      throw new TypeError("getPropertyNames trap is deprecated");
    },

    // === derived traps ===

    /**
     * If name denotes a fixed property, check whether the trap returns true.
     */
    has: function has(name) {
      var trap = this.getTrap("has");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.has(this.target, name);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name);
      res = !!res; // coerce to Boolean

      if (res === false) {
        if (isSealed(name, this.target)) {
          throw new TypeError("cannot report existing non-configurable own " + "property '" + name + "' as a non-existent " + "property");
        }
        if (!Object.isExtensible(this.target) && isFixed(name, this.target)) {
          // if handler is allowed to return false, we cannot guarantee
          // that it will not return true for this property later.
          // Once a property has been reported as non-existent on a non-extensible
          // object, it should forever be reported as non-existent
          throw new TypeError("cannot report existing own property '" + name + "' as non-existent on a non-extensible object");
        }
      }

      // if res === true, we don't need to check for extensibility
      // even for a non-extensible proxy that has no own name property,
      // the property may have been inherited

      return res;
    },

    /**
     * If name denotes a fixed non-configurable, non-writable data property,
     * check its return value against the previously asserted value of the
     * fixed property.
     */
    get: function get(receiver, name) {

      // experimental support for invoke() trap on platforms that
      // support __noSuchMethod__
      /*
      if (name === '__noSuchMethod__') {
        var handler = this;
        return function(name, args) {
          return handler.invoke(receiver, name, args);
        }
      }
      */

      var trap = this.getTrap("get");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.get(this.target, name, receiver);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name, receiver);

      var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
      // check consistency of the returned value
      if (fixedDesc !== undefined) {
        // getting an existing property
        if (isDataDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.writable === false) {
          // own frozen data property
          if (!sameValue(res, fixedDesc.value)) {
            throw new TypeError("cannot report inconsistent value for " + "non-writable, non-configurable property '" + name + "'");
          }
        } else {
          // it's an accessor property
          if (isAccessorDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.get === undefined) {
            if (res !== undefined) {
              throw new TypeError("must report undefined for non-configurable " + "accessor property '" + name + "' without getter");
            }
          }
        }
      }

      return res;
    },

    /**
     * If name denotes a fixed non-configurable, non-writable data property,
     * check that the trap rejects the assignment.
     */
    set: function set(receiver, name, val) {
      var trap = this.getTrap("set");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.set(this.target, name, val, receiver);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name, val, receiver);
      res = !!res; // coerce to Boolean

      // if success is reported, check whether property is truly assignable
      if (res === true) {
        var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
        if (fixedDesc !== undefined) {
          // setting an existing property
          if (isDataDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.writable === false) {
            if (!sameValue(val, fixedDesc.value)) {
              throw new TypeError("cannot successfully assign to a " + "non-writable, non-configurable property '" + name + "'");
            }
          } else {
            if (isAccessorDescriptor(fixedDesc) && fixedDesc.configurable === false && // non-configurable
            fixedDesc.set === undefined) {
              // accessor with undefined setter
              throw new TypeError("setting a property '" + name + "' that has " + " only a getter");
            }
          }
        }
      }

      return res;
    },

    /**
     * Any own enumerable non-configurable properties of the target that are not
     * included in the trap result give rise to a TypeError. As such, we check
     * whether the returned result contains at least all sealed enumerable properties
     * of the target object.
     *
     * The trap should return an iterator.
     *
     * However, as implementations of pre-direct proxies still expect enumerate
     * to return an array of strings, we convert the iterator into an array.
     */
    enumerate: function enumerate() {
      var trap = this.getTrap("enumerate");
      if (trap === undefined) {
        // default forwarding behavior
        var trapResult = Reflect.enumerate(this.target);
        var result = [];
        var nxt = trapResult.next();
        while (!nxt.done) {
          result.push(String(nxt.value));
          nxt = trapResult.next();
        }
        return result;
      }

      var trapResult = trap.call(this.handler, this.target);

      if (trapResult === null || trapResult === undefined || trapResult.next === undefined) {
        throw new TypeError("enumerate trap should return an iterator, got: " + trapResult);
      }

      // propNames is used as a set of strings
      var propNames = Object.create(null);

      // var numProps = +trapResult.length;
      var result = []; // new Array(numProps);

      // trapResult is supposed to be an iterator
      // drain iterator to array as current implementations still expect
      // enumerate to return an array of strings
      var nxt = trapResult.next();

      while (!nxt.done) {
        var s = String(nxt.value);
        if (propNames[s]) {
          throw new TypeError("enumerate trap cannot list a " + "duplicate property '" + s + "'");
        }
        propNames[s] = true;
        result.push(s);
        nxt = trapResult.next();
      }

      /*for (var i = 0; i < numProps; i++) {
        var s = String(trapResult[i]);
        if (propNames[s]) {
          throw new TypeError("enumerate trap cannot list a "+
                              "duplicate property '"+s+"'");
        }
         propNames[s] = true;
        result[i] = s;
      } */

      var ownEnumerableProps = Object.keys(this.target);
      var target = this.target;
      ownEnumerableProps.forEach(function (ownEnumerableProp) {
        if (!propNames[ownEnumerableProp]) {
          if (isSealed(ownEnumerableProp, target)) {
            throw new TypeError("enumerate trap failed to include " + "non-configurable enumerable property '" + ownEnumerableProp + "'");
          }
          if (!Object.isExtensible(target) && isFixed(ownEnumerableProp, target)) {
            // if handler is allowed not to report ownEnumerableProp as an own
            // property, we cannot guarantee that it will never report it as
            // an own property later. Once a property has been reported as
            // non-existent on a non-extensible object, it should forever be
            // reported as non-existent
            throw new TypeError("cannot report existing own property '" + ownEnumerableProp + "' as non-existent on a " + "non-extensible object");
          }
        }
      });

      return result;
    },

    /**
     * The iterate trap is deprecated by the enumerate trap.
     */
    iterate: Validator.prototype.enumerate,

    /**
     * Any own non-configurable properties of the target that are not included
     * in the trap result give rise to a TypeError. As such, we check whether the
     * returned result contains at least all sealed properties of the target
     * object.
     *
     * The trap result is normalized.
     * The trap result is not returned directly. Instead:
     *  - create and return a fresh Array,
     *  - of which each element is coerced to String,
     *  - which does not contain duplicates
     *
     * FIXME: keys trap is deprecated
     */
    /*
    keys: function() {
      var trap = this.getTrap("keys");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.keys(this.target);
      }
       var trapResult = trap.call(this.handler, this.target);
       // propNames is used as a set of strings
      var propNames = Object.create(null);
      var numProps = +trapResult.length;
      var result = new Array(numProps);
       for (var i = 0; i < numProps; i++) {
       var s = String(trapResult[i]);
       if (propNames[s]) {
         throw new TypeError("keys trap cannot list a "+
                             "duplicate property '"+s+"'");
       }
       if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
         // non-extensible proxies don't tolerate new own property names
         throw new TypeError("keys trap cannot list a new "+
                             "property '"+s+"' on a non-extensible object");
       }
        propNames[s] = true;
       result[i] = s;
      }
       var ownEnumerableProps = Object.keys(this.target);
      var target = this.target;
      ownEnumerableProps.forEach(function (ownEnumerableProp) {
        if (!propNames[ownEnumerableProp]) {
          if (isSealed(ownEnumerableProp, target)) {
            throw new TypeError("keys trap failed to include "+
                                "non-configurable enumerable property '"+
                                ownEnumerableProp+"'");
          }
          if (!Object.isExtensible(target) &&
              isFixed(ownEnumerableProp, target)) {
              // if handler is allowed not to report ownEnumerableProp as an own
              // property, we cannot guarantee that it will never report it as
              // an own property later. Once a property has been reported as
              // non-existent on a non-extensible object, it should forever be
              // reported as non-existent
              throw new TypeError("cannot report existing own property '"+
                                  ownEnumerableProp+"' as non-existent on a "+
                                  "non-extensible object");
          }
        }
      });
       return result;
    },
    */

    /**
     * New trap that reifies [[Call]].
     * If the target is a function, then a call to
     *   proxy(...args)
     * Triggers this trap
     */
    apply: function apply(target, thisBinding, args) {
      var trap = this.getTrap("apply");
      if (trap === undefined) {
        return Reflect.apply(target, thisBinding, args);
      }

      if (typeof this.target === "function") {
        return trap.call(this.handler, target, thisBinding, args);
      } else {
        throw new TypeError("apply: " + target + " is not a function");
      }
    },

    /**
     * New trap that reifies [[Construct]].
     * If the target is a function, then a call to
     *   new proxy(...args)
     * Triggers this trap
     */
    construct: function construct(target, args, newTarget) {
      var trap = this.getTrap("construct");
      if (trap === undefined) {
        return Reflect.construct(target, args, newTarget);
      }

      if (typeof target !== "function") {
        throw new TypeError("new: " + target + " is not a function");
      }

      if (newTarget === undefined) {
        newTarget = target;
      } else {
        if (typeof newTarget !== "function") {
          throw new TypeError("new: " + newTarget + " is not a function");
        }
      }
      return trap.call(this.handler, target, args, newTarget);
    }
  };

  // ---- end of the Validator handler wrapper handler ----

  // In what follows, a 'direct proxy' is a proxy
  // whose handler is a Validator. Such proxies can be made non-extensible,
  // sealed or frozen without losing the ability to trap.

  // maps direct proxies to their Validator handlers
  var directProxies = new WeakMap();

  // patch Object.{preventExtensions,seal,freeze} so that
  // they recognize fixable proxies and act accordingly
  Object.preventExtensions = function (subject) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      if (vhandler.preventExtensions()) {
        return subject;
      } else {
        throw new TypeError("preventExtensions on " + subject + " rejected");
      }
    } else {
      return prim_preventExtensions(subject);
    }
  };
  Object.seal = function (subject) {
    setIntegrityLevel(subject, "sealed");
    return subject;
  };
  Object.freeze = function (subject) {
    setIntegrityLevel(subject, "frozen");
    return subject;
  };
  Object.isExtensible = Object_isExtensible = function Object_isExtensible(subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      return vHandler.isExtensible();
    } else {
      return prim_isExtensible(subject);
    }
  };
  Object.isSealed = Object_isSealed = function Object_isSealed(subject) {
    return testIntegrityLevel(subject, "sealed");
  };
  Object.isFrozen = Object_isFrozen = function Object_isFrozen(subject) {
    return testIntegrityLevel(subject, "frozen");
  };
  Object.getPrototypeOf = Object_getPrototypeOf = function Object_getPrototypeOf(subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      return vHandler.getPrototypeOf();
    } else {
      return prim_getPrototypeOf(subject);
    }
  };

  // patch Object.getOwnPropertyDescriptor to directly call
  // the Validator.prototype.getOwnPropertyDescriptor trap
  // This is to circumvent an assertion in the built-in Proxy
  // trapping mechanism of v8, which disallows that trap to
  // return non-configurable property descriptors (as per the
  // old Proxy design)
  Object.getOwnPropertyDescriptor = function (subject, name) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      return vhandler.getOwnPropertyDescriptor(name);
    } else {
      return prim_getOwnPropertyDescriptor(subject, name);
    }
  };

  // patch Object.defineProperty to directly call
  // the Validator.prototype.defineProperty trap
  // This is to circumvent two issues with the built-in
  // trap mechanism:
  // 1) the current tracemonkey implementation of proxies
  // auto-completes 'desc', which is not correct. 'desc' should be
  // normalized, but not completed. Consider:
  // Object.defineProperty(proxy, 'foo', {enumerable:false})
  // This trap will receive desc =
  //  {value:undefined,writable:false,enumerable:false,configurable:false}
  // This will also set all other attributes to their default value,
  // which is unexpected and different from [[DefineOwnProperty]].
  // Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329
  // 2) the current spidermonkey implementation does not
  // throw an exception when this trap returns 'false', but instead silently
  // ignores the operation (this is regardless of strict-mode)
  // 2a) v8 does throw an exception for this case, but includes the rather
  //     unhelpful error message:
  // 'Proxy handler #<Object> returned false from 'defineProperty' trap'
  Object.defineProperty = function (subject, name, desc) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      var normalizedDesc = normalizePropertyDescriptor(desc);
      var success = vhandler.defineProperty(name, normalizedDesc);
      if (success === false) {
        throw new TypeError("can't redefine property '" + name + "'");
      }
      return subject;
    } else {
      return prim_defineProperty(subject, name, desc);
    }
  };

  Object.defineProperties = function (subject, descs) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      var names = Object.keys(descs);
      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var normalizedDesc = normalizePropertyDescriptor(descs[name]);
        var success = vhandler.defineProperty(name, normalizedDesc);
        if (success === false) {
          throw new TypeError("can't redefine property '" + name + "'");
        }
      }
      return subject;
    } else {
      return prim_defineProperties(subject, descs);
    }
  };

  Object.keys = function (subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      var ownKeys = vHandler.ownKeys();
      var result = [];
      for (var i = 0; i < ownKeys.length; i++) {
        var k = String(ownKeys[i]);
        var desc = Object.getOwnPropertyDescriptor(subject, k);
        if (desc !== undefined && desc.enumerable === true) {
          result.push(k);
        }
      }
      return result;
    } else {
      return prim_keys(subject);
    }
  };

  Object.getOwnPropertyNames = Object_getOwnPropertyNames = function Object_getOwnPropertyNames(subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      return vHandler.ownKeys();
    } else {
      return prim_getOwnPropertyNames(subject);
    }
  };

  // fixes issue #71 (Calling Object.getOwnPropertySymbols() on a Proxy
  // throws an error)
  if (prim_getOwnPropertySymbols !== undefined) {
    Object.getOwnPropertySymbols = function (subject) {
      var vHandler = directProxies.get(subject);
      if (vHandler !== undefined) {
        // as this shim does not support symbols, a Proxy never advertises
        // any symbol-valued own properties
        return [];
      } else {
        return prim_getOwnPropertySymbols(subject);
      }
    };
  }

  // fixes issue #72 ('Illegal access' error when using Object.assign)
  // Object.assign polyfill based on a polyfill posted on MDN: 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/\
  //  Global_Objects/Object/assign
  // Note that this polyfill does not support Symbols, but this Proxy Shim
  // does not support Symbols anyway.
  if (prim_assign !== undefined) {
    Object.assign = function (target) {

      // check if any argument is a proxy object
      var noProxies = true;
      for (var i = 0; i < arguments.length; i++) {
        var vHandler = directProxies.get(arguments[i]);
        if (vHandler !== undefined) {
          noProxies = false;
          break;
        }
      }
      if (noProxies) {
        // not a single argument is a proxy, perform built-in algorithm
        return prim_assign.apply(Object, arguments);
      }

      // there is at least one proxy argument, use the polyfill

      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  }

  // returns whether an argument is a reference to an object,
  // which is legal as a WeakMap key.
  function isObject(arg) {
    var type = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
    return type === 'object' && arg !== null || type === 'function';
  };

  // a wrapper for WeakMap.get which returns the undefined value
  // for keys that are not objects (in which case the underlying
  // WeakMap would have thrown a TypeError).
  function safeWeakMapGet(map, key) {
    return isObject(key) ? map.get(key) : undefined;
  };

  // returns a new function of zero arguments that recursively
  // unwraps any proxies specified as the |this|-value.
  // The primitive is assumed to be a zero-argument method
  // that uses its |this|-binding.
  function makeUnwrapping0ArgMethod(primitive) {
    return function builtin() {
      var vHandler = safeWeakMapGet(directProxies, this);
      if (vHandler !== undefined) {
        return builtin.call(vHandler.target);
      } else {
        return primitive.call(this);
      }
    };
  };

  // returns a new function of 1 arguments that recursively
  // unwraps any proxies specified as the |this|-value.
  // The primitive is assumed to be a 1-argument method
  // that uses its |this|-binding.
  function makeUnwrapping1ArgMethod(primitive) {
    return function builtin(arg) {
      var vHandler = safeWeakMapGet(directProxies, this);
      if (vHandler !== undefined) {
        return builtin.call(vHandler.target, arg);
      } else {
        return primitive.call(this, arg);
      }
    };
  };

  Object.prototype.valueOf = makeUnwrapping0ArgMethod(Object.prototype.valueOf);
  Object.prototype.toString = makeUnwrapping0ArgMethod(Object.prototype.toString);
  Function.prototype.toString = makeUnwrapping0ArgMethod(Function.prototype.toString);
  Date.prototype.toString = makeUnwrapping0ArgMethod(Date.prototype.toString);

  Object.prototype.isPrototypeOf = function builtin(arg) {
    // bugfix thanks to Bill Mark:
    // built-in isPrototypeOf does not unwrap proxies used
    // as arguments. So, we implement the builtin ourselves,
    // based on the ECMAScript 6 spec. Our encoding will
    // make sure that if a proxy is used as an argument,
    // its getPrototypeOf trap will be called.
    while (true) {
      var vHandler2 = safeWeakMapGet(directProxies, arg);
      if (vHandler2 !== undefined) {
        arg = vHandler2.getPrototypeOf();
        if (arg === null) {
          return false;
        } else if (sameValue(arg, this)) {
          return true;
        }
      } else {
        return prim_isPrototypeOf.call(this, arg);
      }
    }
  };

  Array.isArray = function (subject) {
    var vHandler = safeWeakMapGet(directProxies, subject);
    if (vHandler !== undefined) {
      return Array.isArray(vHandler.target);
    } else {
      return prim_isArray(subject);
    }
  };

  function isProxyArray(arg) {
    var vHandler = safeWeakMapGet(directProxies, arg);
    if (vHandler !== undefined) {
      return Array.isArray(vHandler.target);
    }
    return false;
  }

  // Array.prototype.concat internally tests whether one of its
  // arguments is an Array, by checking whether [[Class]] == "Array"
  // As such, it will fail to recognize proxies-for-arrays as arrays.
  // We patch Array.prototype.concat so that it "unwraps" proxies-for-arrays
  // by making a copy. This will trigger the exact same sequence of
  // traps on the proxy-for-array as if we would not have unwrapped it.
  // See <https://github.com/tvcutsem/harmony-reflect/issues/19> for more.
  Array.prototype.concat = function () /*...args*/{
    var length;
    for (var i = 0; i < arguments.length; i++) {
      if (isProxyArray(arguments[i])) {
        length = arguments[i].length;
        arguments[i] = Array.prototype.slice.call(arguments[i], 0, length);
      }
    }
    return prim_concat.apply(this, arguments);
  };

  // setPrototypeOf support on platforms that support __proto__

  var prim_setPrototypeOf = Object.setPrototypeOf;

  // patch and extract original __proto__ setter
  var __proto__setter = function () {
    var protoDesc = prim_getOwnPropertyDescriptor(Object.prototype, '__proto__');
    if (protoDesc === undefined || typeof protoDesc.set !== "function") {
      return function () {
        throw new TypeError("setPrototypeOf not supported on this platform");
      };
    }

    // see if we can actually mutate a prototype with the generic setter
    // (e.g. Chrome v28 doesn't allow setting __proto__ via the generic setter)
    try {
      protoDesc.set.call({}, {});
    } catch (e) {
      return function () {
        throw new TypeError("setPrototypeOf not supported on this platform");
      };
    }

    prim_defineProperty(Object.prototype, '__proto__', {
      set: function set(newProto) {
        return Object.setPrototypeOf(this, Object(newProto));
      }
    });

    return protoDesc.set;
  }();

  Object.setPrototypeOf = function (target, newProto) {
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      if (handler.setPrototypeOf(newProto)) {
        return target;
      } else {
        throw new TypeError("proxy rejected prototype mutation");
      }
    } else {
      if (!Object_isExtensible(target)) {
        throw new TypeError("can't set prototype on non-extensible object: " + target);
      }
      if (prim_setPrototypeOf) return prim_setPrototypeOf(target, newProto);

      if (Object(newProto) !== newProto || newProto === null) {
        throw new TypeError("Object prototype may only be an Object or null: " + newProto);
        // throw new TypeError("prototype must be an object or null")
      }
      __proto__setter.call(target, newProto);
      return target;
    }
  };

  Object.prototype.hasOwnProperty = function (name) {
    var handler = safeWeakMapGet(directProxies, this);
    if (handler !== undefined) {
      var desc = handler.getOwnPropertyDescriptor(name);
      return desc !== undefined;
    } else {
      return prim_hasOwnProperty.call(this, name);
    }
  };

  // ============= Reflection module =============
  // see http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api

  var Reflect = global.Reflect = {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, name) {
      return Object.getOwnPropertyDescriptor(target, name);
    },
    defineProperty: function defineProperty(target, name, desc) {

      // if target is a proxy, invoke its "defineProperty" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.defineProperty(target, name, desc);
      }

      // Implementation transliterated from [[DefineOwnProperty]]
      // see ES5.1 section 8.12.9
      // this is the _exact same algorithm_ as the isCompatibleDescriptor
      // algorithm defined above, except that at every place it
      // returns true, this algorithm actually does define the property.
      var current = Object.getOwnPropertyDescriptor(target, name);
      var extensible = Object.isExtensible(target);
      if (current === undefined && extensible === false) {
        return false;
      }
      if (current === undefined && extensible === true) {
        Object.defineProperty(target, name, desc); // should never fail
        return true;
      }
      if (isEmptyDescriptor(desc)) {
        return true;
      }
      if (isEquivalentDescriptor(current, desc)) {
        return true;
      }
      if (current.configurable === false) {
        if (desc.configurable === true) {
          return false;
        }
        if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
          return false;
        }
      }
      if (isGenericDescriptor(desc)) {
        // no further validation necessary
      } else if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
        if (current.configurable === false) {
          return false;
        }
      } else if (isDataDescriptor(current) && isDataDescriptor(desc)) {
        if (current.configurable === false) {
          if (current.writable === false && desc.writable === true) {
            return false;
          }
          if (current.writable === false) {
            if ('value' in desc && !sameValue(desc.value, current.value)) {
              return false;
            }
          }
        }
      } else if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
        if (current.configurable === false) {
          if ('set' in desc && !sameValue(desc.set, current.set)) {
            return false;
          }
          if ('get' in desc && !sameValue(desc.get, current.get)) {
            return false;
          }
        }
      }
      Object.defineProperty(target, name, desc); // should never fail
      return true;
    },
    deleteProperty: function deleteProperty(target, name) {
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.delete(name);
      }

      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc === undefined) {
        return true;
      }
      if (desc.configurable === true) {
        delete target[name];
        return true;
      }
      return false;
    },
    getPrototypeOf: function getPrototypeOf(target) {
      return Object.getPrototypeOf(target);
    },
    setPrototypeOf: function setPrototypeOf(target, newProto) {

      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.setPrototypeOf(newProto);
      }

      if (Object(newProto) !== newProto || newProto === null) {
        throw new TypeError("Object prototype may only be an Object or null: " + newProto);
      }

      if (!Object_isExtensible(target)) {
        return false;
      }

      var current = Object.getPrototypeOf(target);
      if (sameValue(current, newProto)) {
        return true;
      }

      if (prim_setPrototypeOf) {
        try {
          prim_setPrototypeOf(target, newProto);
          return true;
        } catch (e) {
          return false;
        }
      }

      __proto__setter.call(target, newProto);
      return true;
    },
    preventExtensions: function preventExtensions(target) {
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.preventExtensions();
      }
      prim_preventExtensions(target);
      return true;
    },
    isExtensible: function isExtensible(target) {
      return Object.isExtensible(target);
    },
    has: function has(target, name) {
      return name in target;
    },
    get: function get(target, name, receiver) {
      receiver = receiver || target;

      // if target is a proxy, invoke its "get" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.get(receiver, name);
      }

      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc === undefined) {
        var proto = Object.getPrototypeOf(target);
        if (proto === null) {
          return undefined;
        }
        return Reflect.get(proto, name, receiver);
      }
      if (isDataDescriptor(desc)) {
        return desc.value;
      }
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return desc.get.call(receiver);
    },
    // Reflect.set implementation based on latest version of [[SetP]] at
    // http://wiki.ecmascript.org/doku.php?id=harmony:proto_climbing_refactoring
    set: function set(target, name, value, receiver) {
      receiver = receiver || target;

      // if target is a proxy, invoke its "set" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.set(receiver, name, value);
      }

      // first, check whether target has a non-writable property
      // shadowing name on receiver
      var ownDesc = Object.getOwnPropertyDescriptor(target, name);

      if (ownDesc === undefined) {
        // name is not defined in target, search target's prototype
        var proto = Object.getPrototypeOf(target);

        if (proto !== null) {
          // continue the search in target's prototype
          return Reflect.set(proto, name, value, receiver);
        }

        // Rev16 change. Cf. https://bugs.ecmascript.org/show_bug.cgi?id=1549
        // target was the last prototype, now we know that 'name' is not shadowed
        // by an existing (accessor or data) property, so we can add the property
        // to the initial receiver object
        // (this branch will intentionally fall through to the code below)
        ownDesc = { value: undefined,
          writable: true,
          enumerable: true,
          configurable: true };
      }

      // we now know that ownDesc !== undefined
      if (isAccessorDescriptor(ownDesc)) {
        var setter = ownDesc.set;
        if (setter === undefined) return false;
        setter.call(receiver, value); // assumes Function.prototype.call
        return true;
      }
      // otherwise, isDataDescriptor(ownDesc) must be true
      if (ownDesc.writable === false) return false;
      // we found an existing writable data property on the prototype chain.
      // Now update or add the data property on the receiver, depending on
      // whether the receiver already defines the property or not.
      var existingDesc = Object.getOwnPropertyDescriptor(receiver, name);
      if (existingDesc !== undefined) {
        var updateDesc = { value: value,
          // FIXME: it should not be necessary to describe the following
          // attributes. Added to circumvent a bug in tracemonkey:
          // https://bugzilla.mozilla.org/show_bug.cgi?id=601329
          writable: existingDesc.writable,
          enumerable: existingDesc.enumerable,
          configurable: existingDesc.configurable };
        Object.defineProperty(receiver, name, updateDesc);
        return true;
      } else {
        if (!Object.isExtensible(receiver)) return false;
        var newDesc = { value: value,
          writable: true,
          enumerable: true,
          configurable: true };
        Object.defineProperty(receiver, name, newDesc);
        return true;
      }
    },
    /*invoke: function(target, name, args, receiver) {
      receiver = receiver || target;
       var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.invoke(receiver, name, args);
      }
       var fun = Reflect.get(target, name, receiver);
      return Function.prototype.apply.call(fun, receiver, args);
    },*/
    enumerate: function enumerate(target) {
      var handler = directProxies.get(target);
      var result;
      if (handler !== undefined) {
        // handler.enumerate should return an iterator directly, but the
        // iterator gets converted to an array for backward-compat reasons,
        // so we must re-iterate over the array
        result = handler.enumerate(handler.target);
      } else {
        result = [];
        for (var name in target) {
          result.push(name);
        };
      }
      var l = +result.length;
      var idx = 0;
      return {
        next: function next() {
          if (idx === l) return { done: true };
          return { done: false, value: result[idx++] };
        }
      };
    },
    // imperfect ownKeys implementation: in ES6, should also include
    // symbol-keyed properties.
    ownKeys: function ownKeys(target) {
      return Object_getOwnPropertyNames(target);
    },
    apply: function apply(target, receiver, args) {
      // target.apply(receiver, args)
      return Function.prototype.apply.call(target, receiver, args);
    },
    construct: function construct(target, args, newTarget) {
      // return new target(...args);

      // if target is a proxy, invoke its "construct" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.construct(handler.target, args, newTarget);
      }

      if (typeof target !== "function") {
        throw new TypeError("target is not a function: " + target);
      }
      if (newTarget === undefined) {
        newTarget = target;
      } else {
        if (typeof newTarget !== "function") {
          throw new TypeError("newTarget is not a function: " + target);
        }
      }

      return new (Function.prototype.bind.apply(newTarget, [null].concat(args)))();
    }
  };

  // feature-test whether the Proxy global exists, with
  // the harmony-era Proxy.create API
  if (typeof Proxy !== "undefined" && typeof Proxy.create !== "undefined") {

    var primCreate = Proxy.create,
        primCreateFunction = Proxy.createFunction;

    var revokedHandler = primCreate({
      get: function get() {
        throw new TypeError("proxy is revoked");
      }
    });

    global.Proxy = function (target, handler) {
      // check that target is an Object
      if (Object(target) !== target) {
        throw new TypeError("Proxy target must be an Object, given " + target);
      }
      // check that handler is an Object
      if (Object(handler) !== handler) {
        throw new TypeError("Proxy handler must be an Object, given " + handler);
      }

      var vHandler = new Validator(target, handler);
      var proxy;
      if (typeof target === "function") {
        proxy = primCreateFunction(vHandler,
        // call trap
        function () {
          var args = Array.prototype.slice.call(arguments);
          return vHandler.apply(target, this, args);
        },
        // construct trap
        function () {
          var args = Array.prototype.slice.call(arguments);
          return vHandler.construct(target, args);
        });
      } else {
        proxy = primCreate(vHandler, Object.getPrototypeOf(target));
      }
      directProxies.set(proxy, vHandler);
      return proxy;
    };

    global.Proxy.revocable = function (target, handler) {
      var proxy = new Proxy(target, handler);
      var revoke = function revoke() {
        var vHandler = directProxies.get(proxy);
        if (vHandler !== null) {
          vHandler.target = null;
          vHandler.handler = revokedHandler;
        }
        return undefined;
      };
      return { proxy: proxy, revoke: revoke };
    };

    // add the old Proxy.create and Proxy.createFunction methods
    // so old code that still depends on the harmony-era Proxy object
    // is not broken. Also ensures that multiple versions of this
    // library should load fine
    global.Proxy.create = primCreate;
    global.Proxy.createFunction = primCreateFunction;
  } else {
    // Proxy global not defined, or old API not available
    if (typeof Proxy === "undefined") {
      // Proxy global not defined, add a Proxy function stub
      global.Proxy = function (_target, _handler) {
        throw new Error("proxies not supported on this platform. On v8/node/iojs, make sure to pass the --harmony_proxies flag");
      };
    }
    // Proxy global defined but old API not available
    // presumably Proxy global already supports new API, leave untouched
  }

  // for node.js modules, export every property in the Reflect object
  // as part of the module interface
  if (typeof exports !== 'undefined') {
    Object.keys(Reflect).forEach(function (key) {
      exports[key] = Reflect[key];
    });
  }

  // function-as-module pattern
}(typeof exports !== 'undefined' ? global : undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYtanMvbWFpbi5lczYiLCJqcy1leHBvcnRzL3BvbHlmaWxscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0E7O0FBRUEsQ0FBQyxZQUFVO0FBQ1g7O0FBRUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QkE7Ozs7QUFJQTs7QUFFRDtBQUNLO0FBQ0E7O0FBRUosTUFBSSxZQUFZLElBQWhCO0FBQUEsTUFDSSxZQUFZLElBRGhCOztBQUdBLE1BQUksU0FBUyxFQUFFO0FBQ1gsU0FBSSxDQURLO0FBRVQsV0FBTSxDQUZHO0FBR1QsWUFBTyxDQUhFO0FBSVQsVUFBSztBQUpJLEdBQWI7QUFBQSxNQU1FLFFBQVEsTUFBTSxPQUFPLEtBQWIsR0FBcUIsT0FBTyxJQU50QztBQUFBLE1BT0UsU0FBUyxNQUFNLE9BQU8sR0FBYixHQUFtQixPQUFPLE1BUHJDO0FBQUEsTUFRRSxjQUFjLEtBQUssR0FBTCxDQUFTLEtBQVQsRUFBZ0IsTUFBaEIsSUFBMEIsR0FBMUIsR0FBZ0MsQ0FSaEQ7QUFBQSxNQVNFLGNBQWMsY0FBYyxDQVQ5Qjs7QUFXQSxNQUFJLFlBQVksRUFBaEI7O0FBRUEsS0FBRyxHQUFILENBQU8sb0JBQVAsRUFBNkIsVUFBUyxJQUFULEVBQWM7QUFDekMsWUFBUSxHQUFSLENBQVksSUFBWjtBQUNBLGdCQUFZLElBQVo7QUFDQTtBQUNELEdBSkQ7QUFLQSxLQUFHLEdBQUgsQ0FBTyxxQkFBUCxFQUE4QixVQUFTLElBQVQsRUFBYztBQUMxQyxZQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsU0FBSyxPQUFMLENBQWEsVUFBUyxJQUFULEVBQWM7QUFDekIsV0FBSyxJQUFJLEdBQVQsSUFBZ0IsSUFBaEIsRUFBcUI7QUFDbkIsWUFBSyxLQUFLLGNBQUwsQ0FB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LFdBQU8sS0FBUCxDQUFhLGNBQWIsR0FBOEIsa0JBQTlCO0FBRUQsR0E3REQsTUE2RE87QUFDTDtBQUNBLFFBQUksT0FBTyxLQUFQLEtBQWlCLFdBQXJCLEVBQWtDO0FBQ2hDO0FBQ0EsYUFBTyxLQUFQLEdBQWUsVUFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTRCO0FBQ3pDLGNBQU0sSUFBSSxLQUFKLENBQVUsdUdBQVYsQ0FBTjtBQUNELE9BRkQ7QUFHRDtBQUNEO0FBQ0E7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsTUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0M7QUFDbEMsV0FBTyxJQUFQLENBQVksT0FBWixFQUFxQixPQUFyQixDQUE2QixVQUFVLEdBQVYsRUFBZTtBQUMxQyxjQUFRLEdBQVIsSUFBZSxRQUFRLEdBQVIsQ0FBZjtBQUNELEtBRkQ7QUFHRDs7QUFFRDtBQUNDLENBcGlFdUIsQ0FvaUV0QixPQUFPLE9BQVAsS0FBbUIsV0FBbkIsR0FBaUMsTUFBakMsWUFwaUVzQixDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIGV4cG9ydGVkIGFycmF5RmluZCAqL1xuaW1wb3J0IHsgYXJyYXlGaW5kIH0gZnJvbSAnLi4vanMtZXhwb3J0cy9wb2x5ZmlsbHMnO1xuIFxuKGZ1bmN0aW9uKCl7XG5cInVzZSBzdHJpY3RcIjtcblxuICAvKnZhciBzcGVjaWVzID0ge1xuICAgIEI6IFwiSGFsaWJ1dFwiLFxuICAgIEM6IFwiU2FibGVmaXNoXCIsXG4gICAgRDogXCJEdW5nZW5lc3MgY3JhYlwiLFxuICAgIEU6IFwiSGFpciBDcmFiXCIsXG4gICAgRjogXCJGcmVzaHdhdGVyIGZpc2hcIixcbiAgICBHOiBcIkhlcnJpbmcgcm9lXCIsXG4gICAgSDogXCJIZXJyaW5nIChmb29kL2JhaXQpXCIsXG4gICAgSTogXCJMaW5nIGNvZFwiLFxuICAgIEo6IFwiR2VvZHVjayBjbGFtc1wiLFxuICAgIEs6IFwiS2luZyBjcmFiXCIsXG4gICAgTDogXCJIZXJyaW5nIHNwYXduIG9uIGtlbHBcIixcbiAgICBNOiBcIk1pc2MuIHNhbHR3YXRlciBmaW5maXNoXCIsXG4gICAgTjogXCJTbmFpbHNcIixcbiAgICBPOiBcIk9jdG9wdXMvc3F1aWRcIixcbiAgICBQOiBcIlNocmltcFwiLFxuICAgIFE6IFwiU2VhIGN1Y3VtYmVyXCIsXG4gICAgUjogXCJDbGFtc1wiLFxuICAgIFM6IFwiU2FsbW9uXCIsXG4gICAgVDogXCJUYW5uZXIgY3JhYlwiLFxuICAgIFRCOiBcIlRhbm5lciBCYWlyZGkgY3JhYlwiLFxuICAgIFU6IFwiU2VhIHVyY2hpblwiLFxuICAgIFc6IFwiU2NhbGxvcHNcIixcbiAgICBZOiBcIlJvY2tmaXNoXCJcbiAgfTtcblxuICB2YXIgZ2VhciA9IHtcIjFcIjpcIlBVUlNFIFNFSU5FXCIsXCIyXCI6XCJWRVNTRUwgVE8gODAnXCIsXCI0XCI6XCJTRVQgR0lMTE5FVFwiLFwiNVwiOlwiSEFORCBUUk9MTFwiLFwiNlwiOlwiTE9OR0xJTkUgVkVTU0VMIFVOREVSIDYwJ1wiLFwiN1wiOlwiT1RURVIgVFJBV0xcIixcIjhcIjpcIkZJU0ggV0hFRUxcIixcIjlcIjpcIlBPVCBHRUFSIFZFU1NFTCBVTkRFUiA2MCdcIixcIjEwXCI6XCJSSU5HIE5FVFwiLFwiMTFcIjpcIkRJVklORyBHRUFSXCIsXCIxMlwiOlwiRElWRS9IQU5EIFBJQ0tcIixcIjE3XCI6XCJCRUFNIFRSQVdMXCIsXCIxOFwiOlwiU0hPVkVMXCIsXCIyMVwiOlwiUE9VTkRcIixcIjIzXCI6XCJNRUNIQU5JQ0FMIERJR0dFUlwiLFwiMjVcIjpcIkRJTkdMRUJBUiBUUk9MTFwiLFwiMjZcIjpcIk1FQ0hBTklDQUwgSklHXCIsXCIzNFwiOlwiR0lMTE5FVFwiLFwiMzdcIjpcIlBBSVIgVFJBV0xcIixcIjYxXCI6XCJMT05HTElORSBWRVNTRUwgNjAnIE9SIE9WRVJcIixcIjc3XCI6XCJHSUxMTkVUXCIsXCI5MVwiOlwiUE9UIEdFQVIgVkVTU0VMIDYwJyBPUiBPVkVSXCJ9O1xuXG4gIHZhciByZWdpb25zID0ge1wiQVwiOlwiU09VVEhFQVNUXCIsXCJCXCI6XCJTVEFURVdJREVcIixcIkRcIjpcIllBS1VUQVRcIixcIkVcIjpcIlBSSU5DRSBXSUxMSUFNIFNPVU5EXCIsXCJKXCI6XCJXRVNUV0FSRFwiLFwiTFwiOlwiQ0hJR05JS1wiLFwiTVwiOlwiQUxBU0tBIFBFTklOU1VMQVwiLFwiUVwiOlwiQkVSSU5HIFNFQVwiLFwiVFwiOlwiQlJJU1RPTCBCQVlcIixcIlhcIjpcIktPVFpFQlVFXCIsXCJIXCI6XCJDT09LIElOTEVUXCIsXCJTXCI6XCJTRUNVUklUWSBDT1ZFXCIsXCJWXCI6XCJDQVBFIEFWSU5PRlwiLFwiWlwiOlwiTk9SVE9OIFNPVU5EXCIsXCJLXCI6XCJLT0RJQUtcIixcIk9cIjpcIkRVVENIIEhBUkJPUlwiLFwiT0FcIjpcIkFMRVVUSUFOIENEUUFQSUNEQVwiLFwiT0JcIjpcIkFMRVVUSUFOIENEUUJCRURDXCIsXCJPQ1wiOlwiQUxFVVRJQU4gQ0RRQ0JTRkFcIixcIk9EXCI6XCJBTEVVVElBTiBDRFFDVlJGXCIsXCJPRVwiOlwiQUxFVVRJQU4gQ0RRTlNFRENcIixcIk9GXCI6XCJBTEVVVElBTiBDRFFZREZEQVwiLFwiT0dcIjpcIkFMRVVUSUFOIElTTEFORFMgQUNBQUNEQ1wiLFwiUUFcIjpcIkJFUklORyBTRUEgQ0RRQVBJQ0RBXCIsXCJRQlwiOlwiQkVSSU5HIFNFQSBDRFFCQkVEQ1wiLFwiUUNcIjpcIkJFUklORyBTRUEgQ0RRQ0JTRkFcIixcIlFEXCI6XCJCRVJJTkcgU0VBIENEUUNWUkZcIixcIlFFXCI6XCJCRVJJTkcgU0VBIENEUU5TRURDXCIsXCJRRlwiOlwiQkVSSU5HIFNFQSBDRFFZREZEQVwiLFwiVEFcIjpcIkJSSVNUT0wgQkFZIENEUUFQSUNEQVwiLFwiVEJcIjpcIkJSSVNUT0wgQkFZIENEUUJCRURDXCIsXCJUQ1wiOlwiQlJJU1RPTCBCQVkgQ0RRQ0JTRkFcIixcIlREXCI6XCJCUklTVE9MIEJBWSBDRFFDVlJGXCIsXCJURVwiOlwiQlJJU1RPTCBCQVkgQ0RRTlNFRENcIixcIlRGXCI6XCJCUklTVE9MIEJBWSBDRFFZREZEQVwiLFwiWkVcIjpcIk5PUlRPTiBTT1VORCBDRFFOU0VEQ1wiLFwiWkZcIjpcIk5PUlRPTiBTT1VORCBDRFFZREZEQVwiLFwiR1wiOlwiR09BXCIsXCJBQlwiOlwiU1RBVEVXSURFXCIsXCJBR1wiOlwiR09BXCIsXCJCQlwiOlwiU1RBVEVXSURFXCIsXCJCR1wiOlwiR09BXCIsXCJGQlwiOlwiU1RBVEVXSURFXCIsXCJGR1wiOlwiR09BXCIsXCJHQlwiOlwiU1RBVEVXSURFXCIsXCJHR1wiOlwiR09BXCIsXCJIQlwiOlwiU1RBVEVXSURFXCIsXCJIR1wiOlwiR09BXCIsXCJJQlwiOlwiU1RBVEVXSURFXCIsXCJJR1wiOlwiR09BXCIsXCJGXCI6XCJBVEtBL0FNTElBIElTTEFORFNcIixcIlJcIjpcIkFEQUtcIixcIkFGV1wiOlwiRkVERVJBTCBXQVRFUlNcIixcIkFTV1wiOlwiU1RBVEUgV0FURVJTXCIsXCJCRldcIjpcIkZFREVSQUwgV0FURVJTXCIsXCJCU1dcIjpcIlNUQVRFIFdBVEVSU1wifTtcbiovXG4gIC8qdmFyIG1hcmdpbiA9IHt0b3A6IDMwLCByaWdodDogMCwgYm90dG9tOiAxMCwgbGVmdDogNjB9LFxuICAgICAgd2lkdGggPSA4NTAsXG4gICAgICBoZWlnaHQgPSA4NTA7Ki9cblxuICAvL3ZhciBjb2xvcnMgPSBbJyMzMDY1M2EnLCcjN2Q0ZjAwJywnIzRlNTk3ZCcsJyMyYTYxNmUnLCcjYTMzMDFlJywnIzgxNDQ3ZicsJyMwMDVmYTknXTtcblxuIC8vIHZhciB4ID0gZDMuc2NhbGVCYW5kKCkucmFuZ2UoWzAsIHdpZHRoXSk7XG4gICAgICAvL3kgPSBkMy5zY2FsZUJhbmQoKS5yYW5nZShbMCwgaGVpZ2h0XSksXG4gICAgICAvL3ogPSBkMy5zY2FsZVBvdygpLmV4cG9uZW50KDAuMikuZG9tYWluKFswLDEwMF0pLnJhbmdlKFswLDFdKTtcblxuICB2YXIgZmlzaE5vZGVzID0gbnVsbCxcbiAgICAgIGZpc2hMaW5rcyA9IG51bGw7XG5cbiAgdmFyIG1hcmdpbiA9IHsgLy8gZXhwcmVzc2VkIGFzIHBlcmNlbnRhZ2VzXG4gICAgICB0b3A6MCxcbiAgICAgIHJpZ2h0OjAsXG4gICAgICBib3R0b206MCxcbiAgICAgIGxlZnQ6MFxuICAgIH0sXG4gICAgd2lkdGggPSAxMDAgLSBtYXJnaW4ucmlnaHQgLSBtYXJnaW4ubGVmdCxcbiAgICBoZWlnaHQgPSAxMDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbSxcbiAgICBvdXRlclJhZGl1cyA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQpICogMC41IC0gMyxcbiAgICBpbm5lclJhZGl1cyA9IG91dGVyUmFkaXVzIC0gMztcblxuICB2YXIgdGhyZXNob2xkID0gMjA7XG5cbiAgZDMuY3N2KCdtYXRyaXgtaGVhZGVycy5jc3YnLCBmdW5jdGlvbihkYXRhKXtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBmaXNoTGlua3MgPSBkYXRhO1xuICAgIGdvR2F0ZSgpO1xuICB9KTtcbiAgZDMuY3N2KCdmaXNoZXJpZXMtbm9kZXMuY3N2JywgZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVhY2gpe1xuICAgICAgZm9yICh2YXIga2V5IGluIGVhY2gpe1xuICAgICAgICBpZiAoIGVhY2guaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgIGlmICggIWlzTmFOKCtlYWNoW2tleV0pICl7IFxuICAgICAgICAgICAgZWFjaFtrZXldID0gK2VhY2hba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBmaXNoTm9kZXMgPSBkYXRhO1xuICAgIGdvR2F0ZSgpO1xuICB9KTtcblxuICBmdW5jdGlvbiBnb0dhdGUoKXtcbiAgICBpZiAoIGZpc2hOb2RlcyAhPT0gbnVsbCAmJiBmaXNoTGlua3MgIT09IG51bGwgKXtcbiAgICAgIGdvKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICB2YXIgbmV3TGlua3MgPSBbXSxcbiAgbmV0d29yayA9IHt9O1xuICBcbiAgZnVuY3Rpb24gZ28oKXtcbiAgICBmdW5jdGlvbiBpc01hdGNoKGtleSl7XG4gICAgICByZXR1cm4gZmlzaE5vZGVzLmZpbmQoZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgcmV0dXJuIG9iai5uYW1lID09PSBrZXk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZmlzaExpbmtzLmZvckVhY2goZnVuY3Rpb24oZWFjaCxpKXtcbiAgICAgIGZvciAodmFyIGtleSBpbiBlYWNoKXtcbiAgICAgICAgaWYgKCBlYWNoLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICBsZXQgbWF0Y2ggPSBpc01hdGNoKGtleSk7XG4gICAgICAgICAgXG4gICAgICAgICAgbGV0IGluZGV4ID0gbWF0Y2guaW5kZXg7XG4gICAgICAgICAgaWYgKGluZGV4ICE9PSBpICYmIGVhY2hba2V5XSAhPT0gXCIwXCIgKXsgLy8gaWYgc291cmNlIGFuZCB0YXJnZXQgYXJlIG5vdCB0aGUgc2FtZVxuICAgICAgICAgICAgbmV3TGlua3MucHVzaCh7XG4gICAgICAgICAgICAgIHNvdXJjZTogaSxcbiAgICAgICAgICAgICAgdGFyZ2V0OiBpbmRleCwgXG4gICAgICAgICAgICAgIHZhbHVlOiArZWFjaFtrZXldXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTsgLy8gZW5kIGZvckVhY2hcbiAgICBuZXR3b3JrLm5vZGVzID0gZmlzaE5vZGVzO1xuICAgIG5ldHdvcmsubGlua3MgPSBuZXdMaW5rcztcbiAgICByZW5kZXIobmV0d29yayk7XG4gIH0gLy8gZW5kIGdvKClcblxuICBmdW5jdGlvbiByZW5kZXIobmV0d29yaykge1xuICAgIGNvbnNvbGUubG9nKG5ldHdvcmspO1xuICAgIHZhciBub2RlcyA9IG5ldHdvcmsubm9kZXMsXG4gICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgIG1hdHJpeCA9IGQzLnJhbmdlKG4pLm1hcCgoKSA9PiBkMy5yYW5nZShuKS5tYXAoKCkgPT4gMCkpOyAvLyBjcmVhdGUgc3F1YXJlIG1hdHJpeCB3aXRoIGFsbCB2YWx1ZXMgPSAwXG5cbiAgICAvLyBDb21wdXRlIGluZGV4IHBlciBub2RlLlxuICAvKiAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlLCBpKSB7XG4gICAgICBub2RlLmluZGV4ID0gaTtcbiAgICAgIG5vZGUuY291bnQgPSAwO1xuICAgICAgbWF0cml4W2ldID0gZDMucmFuZ2UobikubWFwKGZ1bmN0aW9uKGopIHsgcmV0dXJuIHt4OiBqLCB5OiBpLCB6OiAwfTsgfSk7XG4gICAgfSk7Ki9cbiAgIC8vIGNvbnNvbGUubG9nKG1hdHJpeCk7XG4gICAgLy8gQ29udmVydCBsaW5rcyB0byBtYXRyaXg7IGNvdW50IGNoYXJhY3RlciBvY2N1cnJlbmNlcy5cbiAgICBuZXR3b3JrLmxpbmtzLmZvckVhY2goZnVuY3Rpb24obGluaykge1xuICAgICAgbWF0cml4W2xpbmsuc291cmNlXVtsaW5rLnRhcmdldF0gPSBsaW5rLnZhbHVlO1xuICAgICAgbWF0cml4W2xpbmsudGFyZ2V0XVtsaW5rLnNvdXJjZV0gPSBsaW5rLnZhbHVlO1xuICAgICAvLyBtYXRyaXhbbGluay5zb3VyY2VdW2xpbmsuc291cmNlXSA9IGxpbmsudmFsdWU7XG4gICAgIC8vIG1hdHJpeFtsaW5rLnRhcmdldF1bbGluay50YXJnZXRdID0gbGluay52YWx1ZTtcbiAgICAgLy8gbm9kZXNbbGluay5zb3VyY2VdLmNvdW50ICs9IGxpbmsudmFsdWU7XG4gICAgIC8vIG5vZGVzW2xpbmsudGFyZ2V0XS5jb3VudCArPSBsaW5rLnZhbHVlO1xuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2cobWF0cml4KTtcbiAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KCdib2R5JylcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCAnMTAwJScpXG4gICAgICAuYXR0cigneG1sbnMnLCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycpXG4gICAgICAuYXR0cigndmVyc2lvbicsJzEuMScpXG4gICAgICAuYXR0cigndmlld0JveCcsICcwIDAgMTAwIDEwMCcpXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBtYXJnaW4ubGVmdCArICcsJyArIG1hcmdpbi50b3AgKyAnKScpO1xuXG4gICAgdmFyIGNob3JkID0gZDMuY2hvcmQoKVxuICAgICAgLnBhZEFuZ2xlKDApXG4gICAgICAuc29ydFN1Ymdyb3VwcyhkMy5kZXNjZW5kaW5nKTtcblxuICAgIGNvbnNvbGUubG9nKGNob3JkKG1hdHJpeCkpO1xuICAgIHZhciBhcmMgPSBkMy5hcmMoKVxuICAgICAgICAuaW5uZXJSYWRpdXMoaW5uZXJSYWRpdXMpXG4gICAgICAgIC5vdXRlclJhZGl1cyhvdXRlclJhZGl1cyk7XG5cbiAgICB2YXIgcmliYm9uID0gZDMucmliYm9uKClcbiAgICAgICAgLnJhZGl1cyhpbm5lclJhZGl1cyk7XG5cbiAgICB2YXIgY29sb3IgPSBkMy5zY2FsZU9yZGluYWwoZDMuc2NoZW1lQ2F0ZWdvcnkyMCk7XG4gICAgdmFyIGZvcm1hdFZhbHVlID0gZDMuZm9ybWF0UHJlZml4KFwiLC4wXCIsIDFlMyk7XG5cbiAgICB2YXIgZyA9IHN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB3aWR0aCAvIDIgKyBcIixcIiArIGhlaWdodCAvIDIgKyBcIilcIilcbiAgICAuZGF0dW0oY2hvcmQobWF0cml4KSk7XG5cbiAgICB2YXIgZ3JvdXAgPSBnLmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImdyb3Vwc1wiKVxuICAgICAgLnNlbGVjdEFsbChcImdcIilcbiAgICAgIC5kYXRhKGZ1bmN0aW9uKGNob3JkcykgeyBjb25zb2xlLmxvZyhjaG9yZHMpOyByZXR1cm4gY2hvcmRzLmdyb3VwczsgfSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZChcImdcIik7XG5cbiAgICBncm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsJ2FyY3MnKVxuICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgY29uc29sZS5sb2coZCk7IHJldHVybiBjb2xvcihkLmluZGV4KTsgfSlcbiAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQzLnJnYihjb2xvcihkLmluZGV4KSkuZGFya2VyKCk7IH0pXG4gICAgICAgIC5hdHRyKFwiZFwiLCBhcmMpO1xuXG4gICAgdmFyIGdyb3VwVGljayA9IGdyb3VwLnNlbGVjdEFsbChcIi5ncm91cC10aWNrXCIpXG4gICAgICAuZGF0YShmdW5jdGlvbihkKSB7IHJldHVybiBncm91cFRpY2tzKGQsIDFlMyk7IH0pXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJncm91cC10aWNrXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwicm90YXRlKFwiICsgKGQuYW5nbGUgKiAxODAgLyBNYXRoLlBJIC0gOTApICsgXCIpIHRyYW5zbGF0ZShcIiArIG91dGVyUmFkaXVzICsgXCIsMClcIjsgfSk7XG5cbiAgICBncm91cFRpY2suYXBwZW5kKFwibGluZVwiKVxuICAgICAgICAuYXR0cihcIngyXCIsIDAuNik7XG5cbmdyb3VwVGlja1xuICAuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudmFsdWUgJSA1ZTMgPT09IDA7IH0pXG4gIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoXCJ4XCIsIDAuOClcbiAgICAuYXR0cihcImR5XCIsIFwiLjM1ZW1cIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmFuZ2xlID4gTWF0aC5QSSA/IFwicm90YXRlKDE4MCkgdHJhbnNsYXRlKC0xNilcIiA6IG51bGw7IH0pXG4gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5hbmdsZSA+IE1hdGguUEkgPyBcImVuZFwiIDogbnVsbDsgfSlcbiAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBmb3JtYXRWYWx1ZShkLnZhbHVlKTsgfSk7XG5cbmcuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJyaWJib25zXCIpXG4gICAgLnNlbGVjdEFsbChcInBhdGhcIilcbiAgICAuZGF0YShmdW5jdGlvbihjaG9yZHMpIHsgcmV0dXJuIGNob3JkczsgfSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAuYXR0cihcImRcIiwgZCA9PiB7XG4gICAgICAgIGlmICggZC5zb3VyY2UudmFsdWUgPiB0aHJlc2hvbGQgfHwgZC50YXJnZXQudmFsdWUgPiB0aHJlc2hvbGQgKXtcbiAgICAgICAgICByZXR1cm4gcmliYm9uKGQpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjb2xvcihkLnRhcmdldC5pbmRleCk7IH0pXG4gICAgICAuc3R5bGUoXCJzdHJva2VcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZDMucmdiKGNvbG9yKGQudGFyZ2V0LmluZGV4KSkuZGFya2VyKCk7IH0pO1xuXG4vLyBSZXR1cm5zIGFuIGFycmF5IG9mIHRpY2sgYW5nbGVzIGFuZCB2YWx1ZXMgZm9yIGEgZ2l2ZW4gZ3JvdXAgYW5kIHN0ZXAuXG5mdW5jdGlvbiBncm91cFRpY2tzKGQsIHN0ZXApIHtcbiAgdmFyIGsgPSAoZC5lbmRBbmdsZSAtIGQuc3RhcnRBbmdsZSkgLyBkLnZhbHVlO1xuICByZXR1cm4gZDMucmFuZ2UoMCwgZC52YWx1ZSwgc3RlcCkubWFwKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGFuZ2xlOiB2YWx1ZSAqIGsgKyBkLnN0YXJ0QW5nbGV9O1xuICB9KTtcbn1cblxuICAgLyogZnVuY3Rpb24gc2V0T3JkZXIocHJpbWFyeSxzZWNvbmRhcnkpe1xuICAgICAgZnVuY3Rpb24gcmV0dXJuT3JkZXIoZmllbGQpe1xuICAgICAgICBpZiAoIGZpZWxkID09PSAnY291bnQnKXtcbiAgICAgICAgICByZXR1cm4gZDMuZGVzY2VuZGluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZDMuYXNjZW5kaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZDMucmFuZ2Uobikuc29ydChmdW5jdGlvbihhLCBiKSB7IHJldHVybiByZXR1cm5PcmRlcihwcmltYXJ5KShub2Rlc1thXVtwcmltYXJ5XSwgbm9kZXNbYl1bcHJpbWFyeV0pIHx8IHJldHVybk9yZGVyKHNlY29uZGFyeSkobm9kZXNbYV1bc2Vjb25kYXJ5XSwgbm9kZXNbYl1bc2Vjb25kYXJ5XSk7fSk7XG4gICAgfSovXG4gICAgXG5cbiAgICAvLyBUaGUgZGVmYXVsdCBzb3J0IG9yZGVyLlxuICAgIC8veC5kb21haW4oc2V0T3JkZXIoJ2NsdXN0ZXInLCdzcGVjaWVzJykpO1xuICB9XG59KSgpOyIsIi8qKlxuICogU1ZHIGZvY3VzIFxuICogQ29weXJpZ2h0KGMpIDIwMTcsIEpvaG4gT3N0ZXJtYW5cbiAqXG4gKiBNSVQgTGljZW5zZVxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgXG4gKiBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgXG4gKiB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgXG4gKiBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBcbiAqIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBcbiAqIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBcbiAqIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4gLy8gSUUvRWRnZSAocGVyaGFwcyBvdGhlcnMpIGRvZXMgbm90IGFsbG93IHByb2dyYW1tYXRpYyBmb2N1c2luZyBvZiBTVkcgRWxlbWVudHMgKHZpYSBgZm9jdXMoKWApLiBTYW1lIGZvciBgYmx1cigpYC5cblxuIGV4cG9ydCBjb25zdCBTVkdGb2N1cyA9IChmdW5jdGlvbigpe1xuICAgIGlmICggJ2ZvY3VzJyBpbiBTVkdFbGVtZW50LnByb3RvdHlwZSA9PT0gZmFsc2UgKSB7XG4gICAgICBTVkdFbGVtZW50LnByb3RvdHlwZS5mb2N1cyA9IEhUTUxFbGVtZW50LnByb3RvdHlwZS5mb2N1cztcbiAgICB9XG4gICAgaWYgKCAnYmx1cicgaW4gU1ZHRWxlbWVudC5wcm90b3R5cGUgPT09IGZhbHNlICkge1xuICAgICAgU1ZHRWxlbWVudC5wcm90b3R5cGUuYmx1ciA9IEhUTUxFbGVtZW50LnByb3RvdHlwZS5ibHVyO1xuICAgIH1cbiB9KSgpO1xuXG5cblxuXG4vKipcbiAqIGlubmVySFRNTCBwcm9wZXJ0eSBmb3IgU1ZHRWxlbWVudFxuICogQ29weXJpZ2h0KGMpIDIwMTAsIEplZmYgU2NoaWxsZXJcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMlxuICpcbiAqIFdvcmtzIGluIGEgU1ZHIGRvY3VtZW50IGluIENocm9tZSA2KywgU2FmYXJpIDUrLCBGaXJlZm94IDQrIGFuZCBJRTkrLlxuICogV29ya3MgaW4gYSBIVE1MNSBkb2N1bWVudCBpbiBDaHJvbWUgNyssIEZpcmVmb3ggNCsgYW5kIElFOSsuXG4gKiBEb2VzIG5vdCB3b3JrIGluIE9wZXJhIHNpbmNlIGl0IGRvZXNuJ3Qgc3VwcG9ydCB0aGUgU1ZHRWxlbWVudCBpbnRlcmZhY2UgeWV0LlxuICpcbiAqIEkgaGF2ZW4ndCBkZWNpZGVkIG9uIHRoZSBiZXN0IG5hbWUgZm9yIHRoaXMgcHJvcGVydHkgLSB0aHVzIHRoZSBkdXBsaWNhdGlvbi5cbiAqL1xuLy8gZWRpdGVkIGJ5IEpvaG4gT3N0ZXJtYW4gdG8gZGVjbGFyZSB0aGUgdmFyaWFibGUgYHNYTUxgLCB3aGljaCB3YXMgcmVmZXJlbmNlZCB3aXRob3V0IGJlaW5nIGRlY2xhcmVkXG4vLyB3aGljaCBmYWlsZWQgc2lsZW50bHkgaW4gaW1wbGljaXQgc3RyaWN0IG1vZGUgb2YgYW4gZXhwb3J0XG5cbi8vIG1vc3QgYnJvd3NlcnMgYWxsb3cgc2V0dGluZyBpbm5lckhUTUwgb2Ygc3ZnIGVsZW1lbnRzIGJ1dCBJRSBkb2VzIG5vdCAobm90IGFuIEhUTUwgZWxlbWVudClcbi8vIHRoaXMgcG9seWZpbGwgcHJvdmlkZXMgdGhhdC4gbmVjZXNzYXJ5IGZvciBkMyBtZXRob2QgYC5odG1sKClgIG9uIHN2ZyBlbGVtZW50c1xuXG5leHBvcnQgY29uc3QgU1ZHSW5uZXJIVE1MID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgc2VyaWFsaXplWE1MID0gZnVuY3Rpb24obm9kZSwgb3V0cHV0KSB7XG4gICAgdmFyIG5vZGVUeXBlID0gbm9kZS5ub2RlVHlwZTtcbiAgICBpZiAobm9kZVR5cGUgPT0gMykgeyAvLyBURVhUIG5vZGVzLlxuICAgICAgLy8gUmVwbGFjZSBzcGVjaWFsIFhNTCBjaGFyYWN0ZXJzIHdpdGggdGhlaXIgZW50aXRpZXMuXG4gICAgICBvdXRwdXQucHVzaChub2RlLnRleHRDb250ZW50LnJlcGxhY2UoLyYvLCAnJmFtcDsnKS5yZXBsYWNlKC88LywgJyZsdDsnKS5yZXBsYWNlKCc+JywgJyZndDsnKSk7XG4gICAgfSBlbHNlIGlmIChub2RlVHlwZSA9PSAxKSB7IC8vIEVMRU1FTlQgbm9kZXMuXG4gICAgICAvLyBTZXJpYWxpemUgRWxlbWVudCBub2Rlcy5cbiAgICAgIG91dHB1dC5wdXNoKCc8Jywgbm9kZS50YWdOYW1lKTtcbiAgICAgIGlmIChub2RlLmhhc0F0dHJpYnV0ZXMoKSkge1xuICAgICAgICB2YXIgYXR0ck1hcCA9IG5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGF0dHJNYXAubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICB2YXIgYXR0ck5vZGUgPSBhdHRyTWFwLml0ZW0oaSk7XG4gICAgICAgICAgb3V0cHV0LnB1c2goJyAnLCBhdHRyTm9kZS5uYW1lLCAnPVxcJycsIGF0dHJOb2RlLnZhbHVlLCAnXFwnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChub2RlLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICBvdXRwdXQucHVzaCgnPicpO1xuICAgICAgICB2YXIgY2hpbGROb2RlcyA9IG5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICBzZXJpYWxpemVYTUwoY2hpbGROb2Rlcy5pdGVtKGkpLCBvdXRwdXQpO1xuICAgICAgICB9XG4gICAgICAgIG91dHB1dC5wdXNoKCc8LycsIG5vZGUudGFnTmFtZSwgJz4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dC5wdXNoKCcvPicpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZVR5cGUgPT0gOCkge1xuICAgICAgLy8gVE9ETyhjb2RlZHJlYWQpOiBSZXBsYWNlIHNwZWNpYWwgY2hhcmFjdGVycyB3aXRoIFhNTCBlbnRpdGllcz9cbiAgICAgIG91dHB1dC5wdXNoKCc8IS0tJywgbm9kZS5ub2RlVmFsdWUsICctLT4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETzogSGFuZGxlIENEQVRBIG5vZGVzLlxuICAgICAgLy8gVE9ETzogSGFuZGxlIEVOVElUWSBub2Rlcy5cbiAgICAgIC8vIFRPRE86IEhhbmRsZSBET0NVTUVOVCBub2Rlcy5cbiAgICAgIHRocm93ICdFcnJvciBzZXJpYWxpemluZyBYTUwuIFVuaGFuZGxlZCBub2RlIG9mIHR5cGU6ICcgKyBub2RlVHlwZTtcbiAgICB9XG4gIH1cbiAgLy8gVGhlIGlubmVySFRNTCBET00gcHJvcGVydHkgZm9yIFNWR0VsZW1lbnQuXG4gIGlmICggJ2lubmVySFRNTCcgaW4gU1ZHRWxlbWVudC5wcm90b3R5cGUgPT09IGZhbHNlICl7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNWR0VsZW1lbnQucHJvdG90eXBlLCAnaW5uZXJIVE1MJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICB2YXIgY2hpbGROb2RlID0gdGhpcy5maXJzdENoaWxkO1xuICAgICAgICB3aGlsZSAoY2hpbGROb2RlKSB7XG4gICAgICAgICAgc2VyaWFsaXplWE1MKGNoaWxkTm9kZSwgb3V0cHV0KTtcbiAgICAgICAgICBjaGlsZE5vZGUgPSBjaGlsZE5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uKG1hcmt1cFRleHQpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XG4gICAgICAgIC8vIFdpcGUgb3V0IHRoZSBjdXJyZW50IGNvbnRlbnRzIG9mIHRoZSBlbGVtZW50LlxuICAgICAgICB3aGlsZSAodGhpcy5maXJzdENoaWxkKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBQYXJzZSB0aGUgbWFya3VwIGludG8gdmFsaWQgbm9kZXMuXG4gICAgICAgICAgdmFyIGRYTUwgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgICAgICAgZFhNTC5hc3luYyA9IGZhbHNlO1xuICAgICAgICAgIC8vIFdyYXAgdGhlIG1hcmt1cCBpbnRvIGEgU1ZHIG5vZGUgdG8gZW5zdXJlIHBhcnNpbmcgd29ya3MuXG4gICAgICAgICAgY29uc29sZS5sb2cobWFya3VwVGV4dCk7XG4gICAgICAgICAgdmFyIHNYTUwgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+JyArIG1hcmt1cFRleHQgKyAnPC9zdmc+JztcbiAgICAgICAgICBjb25zb2xlLmxvZyhzWE1MKTtcbiAgICAgICAgICB2YXIgc3ZnRG9jRWxlbWVudCA9IGRYTUwucGFyc2VGcm9tU3RyaW5nKHNYTUwsICd0ZXh0L3htbCcpLmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgICAgIC8vIE5vdyB0YWtlIGVhY2ggbm9kZSwgaW1wb3J0IGl0IGFuZCBhcHBlbmQgdG8gdGhpcyBlbGVtZW50LlxuICAgICAgICAgIHZhciBjaGlsZE5vZGUgPSBzdmdEb2NFbGVtZW50LmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgd2hpbGUoY2hpbGROb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMub3duZXJEb2N1bWVudC5pbXBvcnROb2RlKGNoaWxkTm9kZSwgdHJ1ZSkpO1xuICAgICAgICAgICAgY2hpbGROb2RlID0gY2hpbGROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBwYXJzaW5nIFhNTCBzdHJpbmcnKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFRoZSBpbm5lclNWRyBET00gcHJvcGVydHkgZm9yIFNWR0VsZW1lbnQuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNWR0VsZW1lbnQucHJvdG90eXBlLCAnaW5uZXJTVkcnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbm5lckhUTUw7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbihtYXJrdXBUZXh0KSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gbWFya3VwVGV4dDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSkoKTtcblxuXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZFxuZXhwb3J0IGNvbnN0IGFycmF5RmluZCA9IChmdW5jdGlvbigpe1xuICBpZiAoIUFycmF5LnByb3RvdHlwZS5maW5kKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ2ZpbmQnLCB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgICAgLy8gMS4gTGV0IE8gYmUgPyBUb09iamVjdCh0aGlzIHZhbHVlKS5cbiAgICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widGhpc1wiIGlzIG51bGwgb3Igbm90IGRlZmluZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvID0gT2JqZWN0KHRoaXMpO1xuXG4gICAgICAgIC8vIDIuIExldCBsZW4gYmUgPyBUb0xlbmd0aCg/IEdldChPLCBcImxlbmd0aFwiKSkuXG4gICAgICAgIHZhciBsZW4gPSBvLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICAvLyAzLiBJZiBJc0NhbGxhYmxlKHByZWRpY2F0ZSkgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwcmVkaWNhdGUgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA0LiBJZiB0aGlzQXJnIHdhcyBzdXBwbGllZCwgbGV0IFQgYmUgdGhpc0FyZzsgZWxzZSBsZXQgVCBiZSB1bmRlZmluZWQuXG4gICAgICAgIHZhciB0aGlzQXJnID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIC8vIDUuIExldCBrIGJlIDAuXG4gICAgICAgIHZhciBrID0gMDtcblxuICAgICAgICAvLyA2LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cbiAgICAgICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgICAgICAvLyBhLiBMZXQgUGsgYmUgISBUb1N0cmluZyhrKS5cbiAgICAgICAgICAvLyBiLiBMZXQga1ZhbHVlIGJlID8gR2V0KE8sIFBrKS5cbiAgICAgICAgICAvLyBjLiBMZXQgdGVzdFJlc3VsdCBiZSBUb0Jvb2xlYW4oPyBDYWxsKHByZWRpY2F0ZSwgVCwgwqsga1ZhbHVlLCBrLCBPIMK7KSkuXG4gICAgICAgICAgLy8gZC4gSWYgdGVzdFJlc3VsdCBpcyB0cnVlLCByZXR1cm4ga1ZhbHVlLlxuICAgICAgICAgIHZhciBrVmFsdWUgPSBvW2tdO1xuICAgICAgICAgIGlmIChwcmVkaWNhdGUuY2FsbCh0aGlzQXJnLCBrVmFsdWUsIGssIG8pKSB7XG4gICAgICAgICAgICByZXR1cm4ga1ZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBlLiBJbmNyZWFzZSBrIGJ5IDEuXG4gICAgICAgICAgaysrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gNy4gUmV0dXJuIHVuZGVmaW5lZC5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSkoKTsgXG5cbi8vIENvcHlyaWdodCAoQykgMjAxMS0yMDEyIFNvZnR3YXJlIExhbmd1YWdlcyBMYWIsIFZyaWplIFVuaXZlcnNpdGVpdCBCcnVzc2VsXG4vLyBUaGlzIGNvZGUgaXMgZHVhbC1saWNlbnNlZCB1bmRlciBib3RoIHRoZSBBcGFjaGUgTGljZW5zZSBhbmQgdGhlIE1QTFxuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLyogVmVyc2lvbjogTVBMIDEuMVxuICpcbiAqIFRoZSBjb250ZW50cyBvZiB0aGlzIGZpbGUgYXJlIHN1YmplY3QgdG8gdGhlIE1vemlsbGEgUHVibGljIExpY2Vuc2UgVmVyc2lvblxuICogMS4xICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqIGh0dHA6Ly93d3cubW96aWxsYS5vcmcvTVBML1xuICpcbiAqIFNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbiAqIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZVxuICogZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcmlnaHRzIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGVcbiAqIExpY2Vuc2UuXG4gKlxuICogVGhlIE9yaWdpbmFsIENvZGUgaXMgYSBzaGltIGZvciB0aGUgRVMtSGFybW9ueSByZWZsZWN0aW9uIG1vZHVsZVxuICpcbiAqIFRoZSBJbml0aWFsIERldmVsb3BlciBvZiB0aGUgT3JpZ2luYWwgQ29kZSBpc1xuICogVG9tIFZhbiBDdXRzZW0sIFZyaWplIFVuaXZlcnNpdGVpdCBCcnVzc2VsLlxuICogUG9ydGlvbnMgY3JlYXRlZCBieSB0aGUgSW5pdGlhbCBEZXZlbG9wZXIgYXJlIENvcHlyaWdodCAoQykgMjAxMS0yMDEyXG4gKiB0aGUgSW5pdGlhbCBEZXZlbG9wZXIuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogQ29udHJpYnV0b3Iocyk6XG4gKlxuICovXG5cbiAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAvLyBUaGlzIGZpbGUgaXMgYSBwb2x5ZmlsbCBmb3IgdGhlIHVwY29taW5nIEVDTUFTY3JpcHQgUmVmbGVjdCBBUEksXG4gLy8gaW5jbHVkaW5nIHN1cHBvcnQgZm9yIFByb3hpZXMuIFNlZSB0aGUgZHJhZnQgc3BlY2lmaWNhdGlvbiBhdDpcbiAvLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OnJlZmxlY3RfYXBpXG4gLy8gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpkaXJlY3RfcHJveGllc1xuXG4gLy8gRm9yIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBIYW5kbGVyIEFQSSwgc2VlIGhhbmRsZXJzLmpzLCB3aGljaCBpbXBsZW1lbnRzOlxuIC8vIGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6dmlydHVhbF9vYmplY3RfYXBpXG5cbiAvLyBUaGlzIGltcGxlbWVudGF0aW9uIHN1cGVyc2VkZXMgdGhlIGVhcmxpZXIgcG9seWZpbGwgYXQ6XG4gLy8gY29kZS5nb29nbGUuY29tL3AvZXMtbGFiL3NvdXJjZS9icm93c2UvdHJ1bmsvc3JjL3Byb3hpZXMvRGlyZWN0UHJveGllcy5qc1xuXG4gLy8gVGhpcyBjb2RlIHdhcyB0ZXN0ZWQgb24gdHJhY2Vtb25rZXkgLyBGaXJlZm94IDEyXG4vLyAgKGFuZCBzaG91bGQgcnVuIGZpbmUgb24gb2xkZXIgRmlyZWZveCB2ZXJzaW9ucyBzdGFydGluZyB3aXRoIEZGNClcbiAvLyBUaGUgY29kZSBhbHNvIHdvcmtzIGNvcnJlY3RseSBvblxuIC8vICAgdjggLS1oYXJtb255X3Byb3hpZXMgLS1oYXJtb255X3dlYWttYXBzICh2My42LjUuMSlcblxuIC8vIExhbmd1YWdlIERlcGVuZGVuY2llczpcbiAvLyAgLSBFQ01BU2NyaXB0IDUvc3RyaWN0XG4gLy8gIC0gXCJvbGRcIiAoaS5lLiBub24tZGlyZWN0KSBIYXJtb255IFByb3hpZXNcbiAvLyAgLSBIYXJtb255IFdlYWtNYXBzXG4gLy8gUGF0Y2hlczpcbiAvLyAgLSBPYmplY3Que2ZyZWV6ZSxzZWFsLHByZXZlbnRFeHRlbnNpb25zfVxuIC8vICAtIE9iamVjdC57aXNGcm96ZW4saXNTZWFsZWQsaXNFeHRlbnNpYmxlfVxuIC8vICAtIE9iamVjdC5nZXRQcm90b3R5cGVPZlxuIC8vICAtIE9iamVjdC5rZXlzXG4gLy8gIC0gT2JqZWN0LnByb3RvdHlwZS52YWx1ZU9mXG4gLy8gIC0gT2JqZWN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mXG4gLy8gIC0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuIC8vICAtIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbiAvLyAgLSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXG4gLy8gIC0gT2JqZWN0LmRlZmluZVByb3BlcnR5XG4gLy8gIC0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXNcbiAvLyAgLSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuIC8vICAtIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbiAvLyAgLSBPYmplY3QuZ2V0UHJvdG90eXBlT2ZcbiAvLyAgLSBPYmplY3Quc2V0UHJvdG90eXBlT2ZcbiAvLyAgLSBPYmplY3QuYXNzaWduXG4gLy8gIC0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nXG4gLy8gIC0gRGF0ZS5wcm90b3R5cGUudG9TdHJpbmdcbiAvLyAgLSBBcnJheS5pc0FycmF5XG4gLy8gIC0gQXJyYXkucHJvdG90eXBlLmNvbmNhdFxuIC8vICAtIFByb3h5XG4gLy8gQWRkcyBuZXcgZ2xvYmFsczpcbiAvLyAgLSBSZWZsZWN0XG5cbiAvLyBEaXJlY3QgcHJveGllcyBjYW4gYmUgY3JlYXRlZCB2aWEgUHJveHkodGFyZ2V0LCBoYW5kbGVyKVxuXG4gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgY29uc3QgcmVmbGVjdCA9IChmdW5jdGlvbihnbG9iYWwpeyAvLyBmdW5jdGlvbi1hcy1tb2R1bGUgcGF0dGVyblxuXCJ1c2Ugc3RyaWN0XCI7XG4gXG4vLyA9PT0gRGlyZWN0IFByb3hpZXM6IEludmFyaWFudCBFbmZvcmNlbWVudCA9PT1cblxuLy8gRGlyZWN0IHByb3hpZXMgYnVpbGQgb24gbm9uLWRpcmVjdCBwcm94aWVzIGJ5IGF1dG9tYXRpY2FsbHkgd3JhcHBpbmdcbi8vIGFsbCB1c2VyLWRlZmluZWQgcHJveHkgaGFuZGxlcnMgaW4gYSBWYWxpZGF0b3IgaGFuZGxlciB0aGF0IGNoZWNrcyBhbmRcbi8vIGVuZm9yY2VzIEVTNSBpbnZhcmlhbnRzLlxuXG4vLyBBIGRpcmVjdCBwcm94eSBpcyBhIHByb3h5IGZvciBhbiBleGlzdGluZyBvYmplY3QgY2FsbGVkIHRoZSB0YXJnZXQgb2JqZWN0LlxuXG4vLyBBIFZhbGlkYXRvciBoYW5kbGVyIGlzIGEgd3JhcHBlciBmb3IgYSB0YXJnZXQgcHJveHkgaGFuZGxlciBILlxuLy8gVGhlIFZhbGlkYXRvciBmb3J3YXJkcyBhbGwgb3BlcmF0aW9ucyB0byBILCBidXQgYWRkaXRpb25hbGx5XG4vLyBwZXJmb3JtcyBhIG51bWJlciBvZiBpbnRlZ3JpdHkgY2hlY2tzIG9uIHRoZSByZXN1bHRzIG9mIHNvbWUgdHJhcHMsXG4vLyB0byBtYWtlIHN1cmUgSCBkb2VzIG5vdCB2aW9sYXRlIHRoZSBFUzUgaW52YXJpYW50cyB3LnIudC4gbm9uLWNvbmZpZ3VyYWJsZVxuLy8gcHJvcGVydGllcyBhbmQgbm9uLWV4dGVuc2libGUsIHNlYWxlZCBvciBmcm96ZW4gb2JqZWN0cy5cblxuLy8gRm9yIGVhY2ggcHJvcGVydHkgdGhhdCBIIGV4cG9zZXMgYXMgb3duLCBub24tY29uZmlndXJhYmxlXG4vLyAoZS5nLiBieSByZXR1cm5pbmcgYSBkZXNjcmlwdG9yIGZyb20gYSBjYWxsIHRvIGdldE93blByb3BlcnR5RGVzY3JpcHRvcilcbi8vIHRoZSBWYWxpZGF0b3IgaGFuZGxlciBkZWZpbmVzIHRob3NlIHByb3BlcnRpZXMgb24gdGhlIHRhcmdldCBvYmplY3QuXG4vLyBXaGVuIHRoZSBwcm94eSBiZWNvbWVzIG5vbi1leHRlbnNpYmxlLCBhbHNvIGNvbmZpZ3VyYWJsZSBvd24gcHJvcGVydGllc1xuLy8gYXJlIGNoZWNrZWQgYWdhaW5zdCB0aGUgdGFyZ2V0LlxuLy8gV2Ugd2lsbCBjYWxsIHByb3BlcnRpZXMgdGhhdCBhcmUgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdFxuLy8gXCJmaXhlZCBwcm9wZXJ0aWVzXCIuXG5cbi8vIFdlIHdpbGwgbmFtZSBmaXhlZCBub24tY29uZmlndXJhYmxlIHByb3BlcnRpZXMgXCJzZWFsZWQgcHJvcGVydGllc1wiLlxuLy8gV2Ugd2lsbCBuYW1lIGZpeGVkIG5vbi1jb25maWd1cmFibGUgbm9uLXdyaXRhYmxlIHByb3BlcnRpZXMgXCJmcm96ZW5cbi8vIHByb3BlcnRpZXNcIi5cblxuLy8gVGhlIFZhbGlkYXRvciBoYW5kbGVyIHVwaG9sZHMgdGhlIGZvbGxvd2luZyBpbnZhcmlhbnRzIHcuci50LiBub24tY29uZmlndXJhYmlsaXR5OlxuLy8gLSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgY2Fubm90IHJlcG9ydCBzZWFsZWQgcHJvcGVydGllcyBhcyBub24tZXhpc3RlbnRcbi8vIC0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGNhbm5vdCByZXBvcnQgaW5jb21wYXRpYmxlIGNoYW5nZXMgdG8gdGhlXG4vLyAgIGF0dHJpYnV0ZXMgb2YgYSBzZWFsZWQgcHJvcGVydHkgKGUuZy4gcmVwb3J0aW5nIGEgbm9uLWNvbmZpZ3VyYWJsZVxuLy8gICBwcm9wZXJ0eSBhcyBjb25maWd1cmFibGUsIG9yIHJlcG9ydGluZyBhIG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZVxuLy8gICBwcm9wZXJ0eSBhcyB3cml0YWJsZSlcbi8vIC0gZ2V0UHJvcGVydHlEZXNjcmlwdG9yIGNhbm5vdCByZXBvcnQgc2VhbGVkIHByb3BlcnRpZXMgYXMgbm9uLWV4aXN0ZW50XG4vLyAtIGdldFByb3BlcnR5RGVzY3JpcHRvciBjYW5ub3QgcmVwb3J0IGluY29tcGF0aWJsZSBjaGFuZ2VzIHRvIHRoZVxuLy8gICBhdHRyaWJ1dGVzIG9mIGEgc2VhbGVkIHByb3BlcnR5LiBJdCBfY2FuXyByZXBvcnQgaW5jb21wYXRpYmxlIGNoYW5nZXNcbi8vICAgdG8gdGhlIGF0dHJpYnV0ZXMgb2Ygbm9uLW93biwgaW5oZXJpdGVkIHByb3BlcnRpZXMuXG4vLyAtIGRlZmluZVByb3BlcnR5IGNhbm5vdCBtYWtlIGluY29tcGF0aWJsZSBjaGFuZ2VzIHRvIHRoZSBhdHRyaWJ1dGVzIG9mXG4vLyAgIHNlYWxlZCBwcm9wZXJ0aWVzXG4vLyAtIGRlbGV0ZVByb3BlcnR5IGNhbm5vdCByZXBvcnQgYSBzdWNjZXNzZnVsIGRlbGV0aW9uIG9mIGEgc2VhbGVkIHByb3BlcnR5XG4vLyAtIGhhc093biBjYW5ub3QgcmVwb3J0IGEgc2VhbGVkIHByb3BlcnR5IGFzIG5vbi1leGlzdGVudFxuLy8gLSBoYXMgY2Fubm90IHJlcG9ydCBhIHNlYWxlZCBwcm9wZXJ0eSBhcyBub24tZXhpc3RlbnRcbi8vIC0gZ2V0IGNhbm5vdCByZXBvcnQgaW5jb25zaXN0ZW50IHZhbHVlcyBmb3IgZnJvemVuIGRhdGFcbi8vICAgcHJvcGVydGllcywgYW5kIG11c3QgcmVwb3J0IHVuZGVmaW5lZCBmb3Igc2VhbGVkIGFjY2Vzc29ycyB3aXRoIGFuXG4vLyAgIHVuZGVmaW5lZCBnZXR0ZXJcbi8vIC0gc2V0IGNhbm5vdCByZXBvcnQgYSBzdWNjZXNzZnVsIGFzc2lnbm1lbnQgZm9yIGZyb3plbiBkYXRhXG4vLyAgIHByb3BlcnRpZXMgb3Igc2VhbGVkIGFjY2Vzc29ycyB3aXRoIGFuIHVuZGVmaW5lZCBzZXR0ZXIuXG4vLyAtIGdldHtPd259UHJvcGVydHlOYW1lcyBsaXN0cyBhbGwgc2VhbGVkIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldC5cbi8vIC0ga2V5cyBsaXN0cyBhbGwgZW51bWVyYWJsZSBzZWFsZWQgcHJvcGVydGllcyBvZiB0aGUgdGFyZ2V0LlxuLy8gLSBlbnVtZXJhdGUgbGlzdHMgYWxsIGVudW1lcmFibGUgc2VhbGVkIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldC5cbi8vIC0gaWYgYSBwcm9wZXJ0eSBvZiBhIG5vbi1leHRlbnNpYmxlIHByb3h5IGlzIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudCxcbi8vICAgdGhlbiBpdCBtdXN0IGZvcmV2ZXIgYmUgcmVwb3J0ZWQgYXMgbm9uLWV4aXN0ZW50LiBUaGlzIGFwcGxpZXMgdG9cbi8vICAgb3duIGFuZCBpbmhlcml0ZWQgcHJvcGVydGllcyBhbmQgaXMgZW5mb3JjZWQgaW4gdGhlXG4vLyAgIGRlbGV0ZVByb3BlcnR5LCBnZXR7T3dufVByb3BlcnR5RGVzY3JpcHRvciwgaGFze093bn0sXG4vLyAgIGdldHtPd259UHJvcGVydHlOYW1lcywga2V5cyBhbmQgZW51bWVyYXRlIHRyYXBzXG5cbi8vIFZpb2xhdGlvbiBvZiBhbnkgb2YgdGhlc2UgaW52YXJpYW50cyBieSBIIHdpbGwgcmVzdWx0IGluIFR5cGVFcnJvciBiZWluZ1xuLy8gdGhyb3duLlxuXG4vLyBBZGRpdGlvbmFsbHksIG9uY2UgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zLCBPYmplY3Quc2VhbCBvciBPYmplY3QuZnJlZXplXG4vLyBpcyBpbnZva2VkIG9uIHRoZSBwcm94eSwgdGhlIHNldCBvZiBvd24gcHJvcGVydHkgbmFtZXMgZm9yIHRoZSBwcm94eSBpc1xuLy8gZml4ZWQuIEFueSBwcm9wZXJ0eSBuYW1lIHRoYXQgaXMgbm90IGZpeGVkIGlzIGNhbGxlZCBhICduZXcnIHByb3BlcnR5LlxuXG4vLyBUaGUgVmFsaWRhdG9yIHVwaG9sZHMgdGhlIGZvbGxvd2luZyBpbnZhcmlhbnRzIHJlZ2FyZGluZyBleHRlbnNpYmlsaXR5OlxuLy8gLSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgY2Fubm90IHJlcG9ydCBuZXcgcHJvcGVydGllcyBhcyBleGlzdGVudFxuLy8gICAoaXQgbXVzdCByZXBvcnQgdGhlbSBhcyBub24tZXhpc3RlbnQgYnkgcmV0dXJuaW5nIHVuZGVmaW5lZClcbi8vIC0gZGVmaW5lUHJvcGVydHkgY2Fubm90IHN1Y2Nlc3NmdWxseSBhZGQgYSBuZXcgcHJvcGVydHkgKGl0IG11c3QgcmVqZWN0KVxuLy8gLSBnZXRPd25Qcm9wZXJ0eU5hbWVzIGNhbm5vdCBsaXN0IG5ldyBwcm9wZXJ0aWVzXG4vLyAtIGhhc093biBjYW5ub3QgcmVwb3J0IHRydWUgZm9yIG5ldyBwcm9wZXJ0aWVzIChpdCBtdXN0IHJlcG9ydCBmYWxzZSlcbi8vIC0ga2V5cyBjYW5ub3QgbGlzdCBuZXcgcHJvcGVydGllc1xuXG4vLyBJbnZhcmlhbnRzIGN1cnJlbnRseSBub3QgZW5mb3JjZWQ6XG4vLyAtIGdldE93blByb3BlcnR5TmFtZXMgbGlzdHMgb25seSBvd24gcHJvcGVydHkgbmFtZXNcbi8vIC0ga2V5cyBsaXN0cyBvbmx5IGVudW1lcmFibGUgb3duIHByb3BlcnR5IG5hbWVzXG4vLyBCb3RoIHRyYXBzIG1heSBsaXN0IG1vcmUgcHJvcGVydHkgbmFtZXMgdGhhbiBhcmUgYWN0dWFsbHkgZGVmaW5lZCBvbiB0aGVcbi8vIHRhcmdldC5cblxuLy8gSW52YXJpYW50cyB3aXRoIHJlZ2FyZCB0byBpbmhlcml0YW5jZSBhcmUgY3VycmVudGx5IG5vdCBlbmZvcmNlZC5cbi8vIC0gYSBub24tY29uZmlndXJhYmxlIHBvdGVudGlhbGx5IGluaGVyaXRlZCBwcm9wZXJ0eSBvbiBhIHByb3h5IHdpdGhcbi8vICAgbm9uLW11dGFibGUgYW5jZXN0cnkgY2Fubm90IGJlIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudFxuLy8gKEFuIG9iamVjdCB3aXRoIG5vbi1tdXRhYmxlIGFuY2VzdHJ5IGlzIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0IHdob3NlXG4vLyBbW1Byb3RvdHlwZV1dIGlzIGVpdGhlciBudWxsIG9yIGFuIG9iamVjdCB3aXRoIG5vbi1tdXRhYmxlIGFuY2VzdHJ5LilcblxuLy8gQ2hhbmdlcyBpbiBIYW5kbGVyIEFQSSBjb21wYXJlZCB0byBwcmV2aW91cyBoYXJtb255OnByb3hpZXMsIHNlZTpcbi8vIGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPXN0cmF3bWFuOmRpcmVjdF9wcm94aWVzXG4vLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmRpcmVjdF9wcm94aWVzXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gLS0tLSBXZWFrTWFwIHBvbHlmaWxsIC0tLS1cblxuLy8gVE9ETzogZmluZCBhIHByb3BlciBXZWFrTWFwIHBvbHlmaWxsXG5cbi8vIGRlZmluZSBhbiBlbXB0eSBXZWFrTWFwIHNvIHRoYXQgYXQgbGVhc3QgdGhlIFJlZmxlY3QgbW9kdWxlIGNvZGVcbi8vIHdpbGwgd29yayBpbiB0aGUgYWJzZW5jZSBvZiBXZWFrTWFwcy4gUHJveHkgZW11bGF0aW9uIGRlcGVuZHMgb25cbi8vIGFjdHVhbCBXZWFrTWFwcywgc28gd2lsbCBub3Qgd29yayB3aXRoIHRoaXMgbGl0dGxlIHNoaW0uXG5pZiAodHlwZW9mIFdlYWtNYXAgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgZ2xvYmFsLldlYWtNYXAgPSBmdW5jdGlvbigpe307XG4gIGdsb2JhbC5XZWFrTWFwLnByb3RvdHlwZSA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGssdikgeyB0aHJvdyBuZXcgRXJyb3IoXCJXZWFrTWFwIG5vdCBzdXBwb3J0ZWRcIik7IH1cbiAgfTtcbn1cblxuLy8gLS0tLSBOb3JtYWxpemF0aW9uIGZ1bmN0aW9ucyBmb3IgcHJvcGVydHkgZGVzY3JpcHRvcnMgLS0tLVxuXG5mdW5jdGlvbiBpc1N0YW5kYXJkQXR0cmlidXRlKG5hbWUpIHtcbiAgcmV0dXJuIC9eKGdldHxzZXR8dmFsdWV8d3JpdGFibGV8ZW51bWVyYWJsZXxjb25maWd1cmFibGUpJC8udGVzdChuYW1lKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIEVTNSBzZWN0aW9uIDguMTAuNVxuZnVuY3Rpb24gdG9Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqKSB7XG4gIGlmIChPYmplY3Qob2JqKSAhPT0gb2JqKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInByb3BlcnR5IGRlc2NyaXB0b3Igc2hvdWxkIGJlIGFuIE9iamVjdCwgZ2l2ZW46IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqKTtcbiAgfVxuICB2YXIgZGVzYyA9IHt9O1xuICBpZiAoJ2VudW1lcmFibGUnIGluIG9iaikgeyBkZXNjLmVudW1lcmFibGUgPSAhIW9iai5lbnVtZXJhYmxlOyB9XG4gIGlmICgnY29uZmlndXJhYmxlJyBpbiBvYmopIHsgZGVzYy5jb25maWd1cmFibGUgPSAhIW9iai5jb25maWd1cmFibGU7IH1cbiAgaWYgKCd2YWx1ZScgaW4gb2JqKSB7IGRlc2MudmFsdWUgPSBvYmoudmFsdWU7IH1cbiAgaWYgKCd3cml0YWJsZScgaW4gb2JqKSB7IGRlc2Mud3JpdGFibGUgPSAhIW9iai53cml0YWJsZTsgfVxuICBpZiAoJ2dldCcgaW4gb2JqKSB7XG4gICAgdmFyIGdldHRlciA9IG9iai5nZXQ7XG4gICAgaWYgKGdldHRlciAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBnZXR0ZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInByb3BlcnR5IGRlc2NyaXB0b3IgJ2dldCcgYXR0cmlidXRlIG11c3QgYmUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FsbGFibGUgb3IgdW5kZWZpbmVkLCBnaXZlbjogXCIrZ2V0dGVyKTtcbiAgICB9XG4gICAgZGVzYy5nZXQgPSBnZXR0ZXI7XG4gIH1cbiAgaWYgKCdzZXQnIGluIG9iaikge1xuICAgIHZhciBzZXR0ZXIgPSBvYmouc2V0O1xuICAgIGlmIChzZXR0ZXIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygc2V0dGVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm9wZXJ0eSBkZXNjcmlwdG9yICdzZXQnIGF0dHJpYnV0ZSBtdXN0IGJlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImNhbGxhYmxlIG9yIHVuZGVmaW5lZCwgZ2l2ZW46IFwiK3NldHRlcik7XG4gICAgfVxuICAgIGRlc2Muc2V0ID0gc2V0dGVyO1xuICB9XG4gIGlmICgnZ2V0JyBpbiBkZXNjIHx8ICdzZXQnIGluIGRlc2MpIHtcbiAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjIHx8ICd3cml0YWJsZScgaW4gZGVzYykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInByb3BlcnR5IGRlc2NyaXB0b3IgY2Fubm90IGJlIGJvdGggYSBkYXRhIGFuZCBhbiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NvciBkZXNjcmlwdG9yOiBcIitvYmopO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzYztcbn1cblxuZnVuY3Rpb24gaXNBY2Nlc3NvckRlc2NyaXB0b3IoZGVzYykge1xuICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAoJ2dldCcgaW4gZGVzYyB8fCAnc2V0JyBpbiBkZXNjKTtcbn1cbmZ1bmN0aW9uIGlzRGF0YURlc2NyaXB0b3IoZGVzYykge1xuICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAoJ3ZhbHVlJyBpbiBkZXNjIHx8ICd3cml0YWJsZScgaW4gZGVzYyk7XG59XG5mdW5jdGlvbiBpc0dlbmVyaWNEZXNjcmlwdG9yKGRlc2MpIHtcbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gIWlzQWNjZXNzb3JEZXNjcmlwdG9yKGRlc2MpICYmICFpc0RhdGFEZXNjcmlwdG9yKGRlc2MpO1xufVxuXG5mdW5jdGlvbiB0b0NvbXBsZXRlUHJvcGVydHlEZXNjcmlwdG9yKGRlc2MpIHtcbiAgdmFyIGludGVybmFsRGVzYyA9IHRvUHJvcGVydHlEZXNjcmlwdG9yKGRlc2MpO1xuICBpZiAoaXNHZW5lcmljRGVzY3JpcHRvcihpbnRlcm5hbERlc2MpIHx8IGlzRGF0YURlc2NyaXB0b3IoaW50ZXJuYWxEZXNjKSkge1xuICAgIGlmICghKCd2YWx1ZScgaW4gaW50ZXJuYWxEZXNjKSkgeyBpbnRlcm5hbERlc2MudmFsdWUgPSB1bmRlZmluZWQ7IH1cbiAgICBpZiAoISgnd3JpdGFibGUnIGluIGludGVybmFsRGVzYykpIHsgaW50ZXJuYWxEZXNjLndyaXRhYmxlID0gZmFsc2U7IH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoISgnZ2V0JyBpbiBpbnRlcm5hbERlc2MpKSB7IGludGVybmFsRGVzYy5nZXQgPSB1bmRlZmluZWQ7IH1cbiAgICBpZiAoISgnc2V0JyBpbiBpbnRlcm5hbERlc2MpKSB7IGludGVybmFsRGVzYy5zZXQgPSB1bmRlZmluZWQ7IH1cbiAgfVxuICBpZiAoISgnZW51bWVyYWJsZScgaW4gaW50ZXJuYWxEZXNjKSkgeyBpbnRlcm5hbERlc2MuZW51bWVyYWJsZSA9IGZhbHNlOyB9XG4gIGlmICghKCdjb25maWd1cmFibGUnIGluIGludGVybmFsRGVzYykpIHsgaW50ZXJuYWxEZXNjLmNvbmZpZ3VyYWJsZSA9IGZhbHNlOyB9XG4gIHJldHVybiBpbnRlcm5hbERlc2M7XG59XG5cbmZ1bmN0aW9uIGlzRW1wdHlEZXNjcmlwdG9yKGRlc2MpIHtcbiAgcmV0dXJuICEoJ2dldCcgaW4gZGVzYykgJiZcbiAgICAgICAgICEoJ3NldCcgaW4gZGVzYykgJiZcbiAgICAgICAgICEoJ3ZhbHVlJyBpbiBkZXNjKSAmJlxuICAgICAgICAgISgnd3JpdGFibGUnIGluIGRlc2MpICYmXG4gICAgICAgICAhKCdlbnVtZXJhYmxlJyBpbiBkZXNjKSAmJlxuICAgICAgICAgISgnY29uZmlndXJhYmxlJyBpbiBkZXNjKTtcbn1cblxuZnVuY3Rpb24gaXNFcXVpdmFsZW50RGVzY3JpcHRvcihkZXNjMSwgZGVzYzIpIHtcbiAgcmV0dXJuIHNhbWVWYWx1ZShkZXNjMS5nZXQsIGRlc2MyLmdldCkgJiZcbiAgICAgICAgIHNhbWVWYWx1ZShkZXNjMS5zZXQsIGRlc2MyLnNldCkgJiZcbiAgICAgICAgIHNhbWVWYWx1ZShkZXNjMS52YWx1ZSwgZGVzYzIudmFsdWUpICYmXG4gICAgICAgICBzYW1lVmFsdWUoZGVzYzEud3JpdGFibGUsIGRlc2MyLndyaXRhYmxlKSAmJlxuICAgICAgICAgc2FtZVZhbHVlKGRlc2MxLmVudW1lcmFibGUsIGRlc2MyLmVudW1lcmFibGUpICYmXG4gICAgICAgICBzYW1lVmFsdWUoZGVzYzEuY29uZmlndXJhYmxlLCBkZXNjMi5jb25maWd1cmFibGUpO1xufVxuXG4vLyBjb3BpZWQgZnJvbSBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWxcbmZ1bmN0aW9uIHNhbWVWYWx1ZSh4LCB5KSB7XG4gIGlmICh4ID09PSB5KSB7XG4gICAgLy8gMCA9PT0gLTAsIGJ1dCB0aGV5IGFyZSBub3QgaWRlbnRpY2FsXG4gICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICB9XG5cbiAgLy8gTmFOICE9PSBOYU4sIGJ1dCB0aGV5IGFyZSBpZGVudGljYWwuXG4gIC8vIE5hTnMgYXJlIHRoZSBvbmx5IG5vbi1yZWZsZXhpdmUgdmFsdWUsIGkuZS4sIGlmIHggIT09IHgsXG4gIC8vIHRoZW4geCBpcyBhIE5hTi5cbiAgLy8gaXNOYU4gaXMgYnJva2VuOiBpdCBjb252ZXJ0cyBpdHMgYXJndW1lbnQgdG8gbnVtYmVyLCBzb1xuICAvLyBpc05hTihcImZvb1wiKSA9PiB0cnVlXG4gIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZyZXNoIHByb3BlcnR5IGRlc2NyaXB0b3IgdGhhdCBpcyBndWFyYW50ZWVkXG4gKiB0byBiZSBjb21wbGV0ZSAoaS5lLiBjb250YWluIGFsbCB0aGUgc3RhbmRhcmQgYXR0cmlidXRlcykuXG4gKiBBZGRpdGlvbmFsbHksIGFueSBub24tc3RhbmRhcmQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mXG4gKiBhdHRyaWJ1dGVzIGFyZSBjb3BpZWQgb3ZlciB0byB0aGUgZnJlc2ggZGVzY3JpcHRvci5cbiAqXG4gKiBJZiBhdHRyaWJ1dGVzIGlzIHVuZGVmaW5lZCwgcmV0dXJucyB1bmRlZmluZWQuXG4gKlxuICogU2VlIGFsc286IGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6cHJveGllc19zZW1hbnRpY3NcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplQW5kQ29tcGxldGVQcm9wZXJ0eURlc2NyaXB0b3IoYXR0cmlidXRlcykge1xuICBpZiAoYXR0cmlidXRlcyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgdmFyIGRlc2MgPSB0b0NvbXBsZXRlUHJvcGVydHlEZXNjcmlwdG9yKGF0dHJpYnV0ZXMpO1xuICAvLyBOb3RlOiBubyBuZWVkIHRvIGNhbGwgRnJvbVByb3BlcnR5RGVzY3JpcHRvcihkZXNjKSwgYXMgd2UgcmVwcmVzZW50XG4gIC8vIFwiaW50ZXJuYWxcIiBwcm9wZXJ0eSBkZXNjcmlwdG9ycyBhcyBwcm9wZXIgT2JqZWN0cyBmcm9tIHRoZSBzdGFydFxuICBmb3IgKHZhciBuYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAoIWlzU3RhbmRhcmRBdHRyaWJ1dGUobmFtZSkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXNjLCBuYW1lLFxuICAgICAgICB7IHZhbHVlOiBhdHRyaWJ1dGVzW25hbWVdLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzYztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnJlc2ggcHJvcGVydHkgZGVzY3JpcHRvciB3aG9zZSBzdGFuZGFyZFxuICogYXR0cmlidXRlcyBhcmUgZ3VhcmFudGVlZCB0byBiZSBkYXRhIHByb3BlcnRpZXMgb2YgdGhlIHJpZ2h0IHR5cGUuXG4gKiBBZGRpdGlvbmFsbHksIGFueSBub24tc3RhbmRhcmQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mXG4gKiBhdHRyaWJ1dGVzIGFyZSBjb3BpZWQgb3ZlciB0byB0aGUgZnJlc2ggZGVzY3JpcHRvci5cbiAqXG4gKiBJZiBhdHRyaWJ1dGVzIGlzIHVuZGVmaW5lZCwgd2lsbCB0aHJvdyBhIFR5cGVFcnJvci5cbiAqXG4gKiBTZWUgYWxzbzogaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpwcm94aWVzX3NlbWFudGljc1xuICovXG5mdW5jdGlvbiBub3JtYWxpemVQcm9wZXJ0eURlc2NyaXB0b3IoYXR0cmlidXRlcykge1xuICB2YXIgZGVzYyA9IHRvUHJvcGVydHlEZXNjcmlwdG9yKGF0dHJpYnV0ZXMpO1xuICAvLyBOb3RlOiBubyBuZWVkIHRvIGNhbGwgRnJvbUdlbmVyaWNQcm9wZXJ0eURlc2NyaXB0b3IoZGVzYyksIGFzIHdlIHJlcHJlc2VudFxuICAvLyBcImludGVybmFsXCIgcHJvcGVydHkgZGVzY3JpcHRvcnMgYXMgcHJvcGVyIE9iamVjdHMgZnJvbSB0aGUgc3RhcnRcbiAgZm9yICh2YXIgbmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKCFpc1N0YW5kYXJkQXR0cmlidXRlKG5hbWUpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVzYywgbmFtZSxcbiAgICAgICAgeyB2YWx1ZTogYXR0cmlidXRlc1tuYW1lXSxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc2M7XG59XG5cbi8vIHN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSByZWFsIEVTNSBwcmltaXRpdmVzIGJlZm9yZSBwYXRjaGluZyB0aGVtIGxhdGVyXG52YXIgcHJpbV9wcmV2ZW50RXh0ZW5zaW9ucyA9ICAgICAgICBPYmplY3QucHJldmVudEV4dGVuc2lvbnMsXG4gICAgcHJpbV9zZWFsID0gICAgICAgICAgICAgICAgICAgICBPYmplY3Quc2VhbCxcbiAgICBwcmltX2ZyZWV6ZSA9ICAgICAgICAgICAgICAgICAgIE9iamVjdC5mcmVlemUsXG4gICAgcHJpbV9pc0V4dGVuc2libGUgPSAgICAgICAgICAgICBPYmplY3QuaXNFeHRlbnNpYmxlLFxuICAgIHByaW1faXNTZWFsZWQgPSAgICAgICAgICAgICAgICAgT2JqZWN0LmlzU2VhbGVkLFxuICAgIHByaW1faXNGcm96ZW4gPSAgICAgICAgICAgICAgICAgT2JqZWN0LmlzRnJvemVuLFxuICAgIHByaW1fZ2V0UHJvdG90eXBlT2YgPSAgICAgICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuICAgIHByaW1fZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgICBwcmltX2RlZmluZVByb3BlcnR5ID0gICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcbiAgICBwcmltX2RlZmluZVByb3BlcnRpZXMgPSAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzLFxuICAgIHByaW1fa2V5cyA9ICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMsXG4gICAgcHJpbV9nZXRPd25Qcm9wZXJ0eU5hbWVzID0gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgICBwcmltX2dldE93blByb3BlcnR5U3ltYm9scyA9ICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gICAgcHJpbV9hc3NpZ24gPSAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduLFxuICAgIHByaW1faXNBcnJheSA9ICAgICAgICAgICAgICAgICAgQXJyYXkuaXNBcnJheSxcbiAgICBwcmltX2NvbmNhdCA9ICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5jb25jYXQsXG4gICAgcHJpbV9pc1Byb3RvdHlwZU9mID0gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLmlzUHJvdG90eXBlT2YsXG4gICAgcHJpbV9oYXNPd25Qcm9wZXJ0eSA9ICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vLyB0aGVzZSB3aWxsIHBvaW50IHRvIHRoZSBwYXRjaGVkIHZlcnNpb25zIG9mIHRoZSByZXNwZWN0aXZlIG1ldGhvZHMgb25cbi8vIE9iamVjdC4gVGhleSBhcmUgdXNlZCB3aXRoaW4gdGhpcyBtb2R1bGUgYXMgdGhlIFwiaW50cmluc2ljXCIgYmluZGluZ3Ncbi8vIG9mIHRoZXNlIG1ldGhvZHMgKGkuZS4gdGhlIFwib3JpZ2luYWxcIiBiaW5kaW5ncyBhcyBkZWZpbmVkIGluIHRoZSBzcGVjKVxudmFyIE9iamVjdF9pc0Zyb3plbixcbiAgICBPYmplY3RfaXNTZWFsZWQsXG4gICAgT2JqZWN0X2lzRXh0ZW5zaWJsZSxcbiAgICBPYmplY3RfZ2V0UHJvdG90eXBlT2YsXG4gICAgT2JqZWN0X2dldE93blByb3BlcnR5TmFtZXM7XG5cbi8qKlxuICogQSBwcm9wZXJ0eSAnbmFtZScgaXMgZml4ZWQgaWYgaXQgaXMgYW4gb3duIHByb3BlcnR5IG9mIHRoZSB0YXJnZXQuXG4gKi9cbmZ1bmN0aW9uIGlzRml4ZWQobmFtZSwgdGFyZ2V0KSB7XG4gIHJldHVybiAoe30pLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBuYW1lKTtcbn1cbmZ1bmN0aW9uIGlzU2VhbGVkKG5hbWUsIHRhcmdldCkge1xuICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgcmV0dXJuIGRlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZTtcbn1cbmZ1bmN0aW9uIGlzU2VhbGVkRGVzYyhkZXNjKSB7XG4gIHJldHVybiBkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5jb25maWd1cmFibGUgPT09IGZhbHNlO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGFsbCB2YWxpZGF0aW9uIHRoYXQgT2JqZWN0LmRlZmluZVByb3BlcnR5IHBlcmZvcm1zLFxuICogd2l0aG91dCBhY3R1YWxseSBkZWZpbmluZyB0aGUgcHJvcGVydHkuIFJldHVybnMgYSBib29sZWFuXG4gKiBpbmRpY2F0aW5nIHdoZXRoZXIgdmFsaWRhdGlvbiBzdWNjZWVkZWQuXG4gKlxuICogSW1wbGVtZW50YXRpb24gdHJhbnNsaXRlcmF0ZWQgZnJvbSBFUzUuMSBzZWN0aW9uIDguMTIuOVxuICovXG5mdW5jdGlvbiBpc0NvbXBhdGlibGVEZXNjcmlwdG9yKGV4dGVuc2libGUsIGN1cnJlbnQsIGRlc2MpIHtcbiAgaWYgKGN1cnJlbnQgPT09IHVuZGVmaW5lZCAmJiBleHRlbnNpYmxlID09PSBmYWxzZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoY3VycmVudCA9PT0gdW5kZWZpbmVkICYmIGV4dGVuc2libGUgPT09IHRydWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNFbXB0eURlc2NyaXB0b3IoZGVzYykpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNFcXVpdmFsZW50RGVzY3JpcHRvcihjdXJyZW50LCBkZXNjKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChjdXJyZW50LmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICBpZiAoZGVzYy5jb25maWd1cmFibGUgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCdlbnVtZXJhYmxlJyBpbiBkZXNjICYmIGRlc2MuZW51bWVyYWJsZSAhPT0gY3VycmVudC5lbnVtZXJhYmxlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmIChpc0dlbmVyaWNEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzRGF0YURlc2NyaXB0b3IoY3VycmVudCkgIT09IGlzRGF0YURlc2NyaXB0b3IoZGVzYykpIHtcbiAgICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChpc0RhdGFEZXNjcmlwdG9yKGN1cnJlbnQpICYmIGlzRGF0YURlc2NyaXB0b3IoZGVzYykpIHtcbiAgICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoY3VycmVudC53cml0YWJsZSA9PT0gZmFsc2UgJiYgZGVzYy53cml0YWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudC53cml0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYyAmJiAhc2FtZVZhbHVlKGRlc2MudmFsdWUsIGN1cnJlbnQudmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChpc0FjY2Vzc29yRGVzY3JpcHRvcihjdXJyZW50KSAmJiBpc0FjY2Vzc29yRGVzY3JpcHRvcihkZXNjKSkge1xuICAgIGlmIChjdXJyZW50LmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgIGlmICgnc2V0JyBpbiBkZXNjICYmICFzYW1lVmFsdWUoZGVzYy5zZXQsIGN1cnJlbnQuc2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoJ2dldCcgaW4gZGVzYyAmJiAhc2FtZVZhbHVlKGRlc2MuZ2V0LCBjdXJyZW50LmdldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gRVM2IDcuMy4xMSBTZXRJbnRlZ3JpdHlMZXZlbFxuLy8gbGV2ZWwgaXMgb25lIG9mIFwic2VhbGVkXCIgb3IgXCJmcm96ZW5cIlxuZnVuY3Rpb24gc2V0SW50ZWdyaXR5TGV2ZWwodGFyZ2V0LCBsZXZlbCkge1xuICB2YXIgb3duUHJvcHMgPSBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICB2YXIgcGVuZGluZ0V4Y2VwdGlvbiA9IHVuZGVmaW5lZDtcbiAgaWYgKGxldmVsID09PSBcInNlYWxlZFwiKSB7XG4gICAgdmFyIGwgPSArb3duUHJvcHMubGVuZ3RoO1xuICAgIHZhciBrO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICBrID0gU3RyaW5nKG93blByb3BzW2ldKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGssIHsgY29uZmlndXJhYmxlOiBmYWxzZSB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHBlbmRpbmdFeGNlcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHBlbmRpbmdFeGNlcHRpb24gPSBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGxldmVsID09PSBcImZyb3plblwiXG4gICAgdmFyIGwgPSArb3duUHJvcHMubGVuZ3RoO1xuICAgIHZhciBrO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICBrID0gU3RyaW5nKG93blByb3BzW2ldKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBjdXJyZW50RGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrKTtcbiAgICAgICAgaWYgKGN1cnJlbnREZXNjICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZGVzYztcbiAgICAgICAgICBpZiAoaXNBY2Nlc3NvckRlc2NyaXB0b3IoY3VycmVudERlc2MpKSB7XG4gICAgICAgICAgICBkZXNjID0geyBjb25maWd1cmFibGU6IGZhbHNlIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVzYyA9IHsgY29uZmlndXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IGZhbHNlIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgaywgZGVzYyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAocGVuZGluZ0V4Y2VwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcGVuZGluZ0V4Y2VwdGlvbiA9IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHBlbmRpbmdFeGNlcHRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IHBlbmRpbmdFeGNlcHRpb247XG4gIH1cbiAgcmV0dXJuIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGFyZ2V0KTtcbn1cblxuLy8gRVM2IDcuMy4xMiBUZXN0SW50ZWdyaXR5TGV2ZWxcbi8vIGxldmVsIGlzIG9uZSBvZiBcInNlYWxlZFwiIG9yIFwiZnJvemVuXCJcbmZ1bmN0aW9uIHRlc3RJbnRlZ3JpdHlMZXZlbCh0YXJnZXQsIGxldmVsKSB7XG4gIHZhciBpc0V4dGVuc2libGUgPSBPYmplY3RfaXNFeHRlbnNpYmxlKHRhcmdldCk7XG4gIGlmIChpc0V4dGVuc2libGUpIHJldHVybiBmYWxzZTtcbiAgXG4gIHZhciBvd25Qcm9wcyA9IE9iamVjdF9nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gIHZhciBwZW5kaW5nRXhjZXB0aW9uID0gdW5kZWZpbmVkO1xuICB2YXIgY29uZmlndXJhYmxlID0gZmFsc2U7XG4gIHZhciB3cml0YWJsZSA9IGZhbHNlO1xuICBcbiAgdmFyIGwgPSArb3duUHJvcHMubGVuZ3RoO1xuICB2YXIgaztcbiAgdmFyIGN1cnJlbnREZXNjO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgIGsgPSBTdHJpbmcob3duUHJvcHNbaV0pO1xuICAgIHRyeSB7XG4gICAgICBjdXJyZW50RGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrKTtcbiAgICAgIGNvbmZpZ3VyYWJsZSA9IGNvbmZpZ3VyYWJsZSB8fCBjdXJyZW50RGVzYy5jb25maWd1cmFibGU7XG4gICAgICBpZiAoaXNEYXRhRGVzY3JpcHRvcihjdXJyZW50RGVzYykpIHtcbiAgICAgICAgd3JpdGFibGUgPSB3cml0YWJsZSB8fCBjdXJyZW50RGVzYy53cml0YWJsZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAocGVuZGluZ0V4Y2VwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBlbmRpbmdFeGNlcHRpb24gPSBlO1xuICAgICAgICBjb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAocGVuZGluZ0V4Y2VwdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgcGVuZGluZ0V4Y2VwdGlvbjtcbiAgfVxuICBpZiAobGV2ZWwgPT09IFwiZnJvemVuXCIgJiYgd3JpdGFibGUgPT09IHRydWUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGNvbmZpZ3VyYWJsZSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gLS0tLSBUaGUgVmFsaWRhdG9yIGhhbmRsZXIgd3JhcHBlciBhcm91bmQgdXNlciBoYW5kbGVycyAtLS0tXG5cbi8qKlxuICogQHBhcmFtIHRhcmdldCB0aGUgb2JqZWN0IHdyYXBwZWQgYnkgdGhpcyBwcm94eS5cbiAqIEFzIGxvbmcgYXMgdGhlIHByb3h5IGlzIGV4dGVuc2libGUsIG9ubHkgbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0aWVzXG4gKiBhcmUgY2hlY2tlZCBhZ2FpbnN0IHRoZSB0YXJnZXQuIE9uY2UgdGhlIHByb3h5IGJlY29tZXMgbm9uLWV4dGVuc2libGUsXG4gKiBpbnZhcmlhbnRzIHcuci50LiBub24tZXh0ZW5zaWJpbGl0eSBhcmUgYWxzbyBlbmZvcmNlZC5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlciB0aGUgaGFuZGxlciBvZiB0aGUgZGlyZWN0IHByb3h5LiBUaGUgb2JqZWN0IGVtdWxhdGVkIGJ5XG4gKiB0aGlzIGhhbmRsZXIgaXMgdmFsaWRhdGVkIGFnYWluc3QgdGhlIHRhcmdldCBvYmplY3Qgb2YgdGhlIGRpcmVjdCBwcm94eS5cbiAqIEFueSB2aW9sYXRpb25zIHRoYXQgdGhlIGhhbmRsZXIgbWFrZXMgYWdhaW5zdCB0aGUgaW52YXJpYW50c1xuICogb2YgdGhlIHRhcmdldCB3aWxsIGNhdXNlIGEgVHlwZUVycm9yIHRvIGJlIHRocm93bi5cbiAqXG4gKiBCb3RoIHRhcmdldCBhbmQgaGFuZGxlciBtdXN0IGJlIHByb3BlciBPYmplY3RzIGF0IGluaXRpYWxpemF0aW9uIHRpbWUuXG4gKi9cbmZ1bmN0aW9uIFZhbGlkYXRvcih0YXJnZXQsIGhhbmRsZXIpIHtcbiAgLy8gZm9yIG5vbi1yZXZva2FibGUgcHJveGllcywgdGhlc2UgYXJlIGNvbnN0IHJlZmVyZW5jZXNcbiAgLy8gZm9yIHJldm9rYWJsZSBwcm94aWVzLCBvbiByZXZvY2F0aW9uOlxuICAvLyAtIHRoaXMudGFyZ2V0IGlzIHNldCB0byBudWxsXG4gIC8vIC0gdGhpcy5oYW5kbGVyIGlzIHNldCB0byBhIGhhbmRsZXIgdGhhdCB0aHJvd3Mgb24gYWxsIHRyYXBzXG4gIHRoaXMudGFyZ2V0ICA9IHRhcmdldDtcbiAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbn1cblxuVmFsaWRhdG9yLnByb3RvdHlwZSA9IHtcblxuICAvKipcbiAgICogSWYgZ2V0VHJhcCByZXR1cm5zIHVuZGVmaW5lZCwgdGhlIGNhbGxlciBzaG91bGQgcGVyZm9ybSB0aGVcbiAgICogZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yLlxuICAgKiBJZiBnZXRUcmFwIHJldHVybnMgbm9ybWFsbHkgb3RoZXJ3aXNlLCB0aGUgcmV0dXJuIHZhbHVlXG4gICAqIHdpbGwgYmUgYSBjYWxsYWJsZSB0cmFwIGZ1bmN0aW9uLiBXaGVuIGNhbGxpbmcgdGhlIHRyYXAgZnVuY3Rpb24sXG4gICAqIHRoZSBjYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIGJpbmRpbmcgaXRzIHx0aGlzfCB0byB8dGhpcy5oYW5kbGVyfC5cbiAgICovXG4gIGdldFRyYXA6IGZ1bmN0aW9uKHRyYXBOYW1lKSB7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmhhbmRsZXJbdHJhcE5hbWVdO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIHRoZSB0cmFwIHdhcyBub3QgZGVmaW5lZCxcbiAgICAgIC8vIHBlcmZvcm0gdGhlIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRyYXAgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcih0cmFwTmFtZSArIFwiIHRyYXAgaXMgbm90IGNhbGxhYmxlOiBcIit0cmFwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJhcDtcbiAgfSxcblxuICAvLyA9PT0gZnVuZGFtZW50YWwgdHJhcHMgPT09XG5cbiAgLyoqXG4gICAqIElmIG5hbWUgZGVub3RlcyBhIGZpeGVkIHByb3BlcnR5LCBjaGVjazpcbiAgICogICAtIHdoZXRoZXIgdGFyZ2V0SGFuZGxlciByZXBvcnRzIGl0IGFzIGV4aXN0ZW50XG4gICAqICAgLSB3aGV0aGVyIHRoZSByZXR1cm5lZCBkZXNjcmlwdG9yIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgZml4ZWQgcHJvcGVydHlcbiAgICogSWYgdGhlIHByb3h5IGlzIG5vbi1leHRlbnNpYmxlLCBjaGVjazpcbiAgICogICAtIHdoZXRoZXIgbmFtZSBpcyBub3QgYSBuZXcgcHJvcGVydHlcbiAgICogQWRkaXRpb25hbGx5LCB0aGUgcmV0dXJuZWQgZGVzY3JpcHRvciBpcyBub3JtYWxpemVkIGFuZCBjb21wbGV0ZWQuXG4gICAqL1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgfVxuXG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKTtcbiAgICB2YXIgZGVzYyA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICBkZXNjID0gbm9ybWFsaXplQW5kQ29tcGxldGVQcm9wZXJ0eURlc2NyaXB0b3IoZGVzYyk7XG5cbiAgICB2YXIgdGFyZ2V0RGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcy50YXJnZXQsIG5hbWUpO1xuICAgIHZhciBleHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSh0aGlzLnRhcmdldCk7XG5cbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoaXNTZWFsZWREZXNjKHRhcmdldERlc2MpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IG5vbi1jb25maWd1cmFibGUgcHJvcGVydHkgJ1wiK25hbWUrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCInIGFzIG5vbi1leGlzdGVudFwiKTtcbiAgICAgIH1cbiAgICAgIGlmICghZXh0ZW5zaWJsZSAmJiB0YXJnZXREZXNjICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBpZiBoYW5kbGVyIGlzIGFsbG93ZWQgdG8gcmV0dXJuIHVuZGVmaW5lZCwgd2UgY2Fubm90IGd1YXJhbnRlZVxuICAgICAgICAgIC8vIHRoYXQgaXQgd2lsbCBub3QgcmV0dXJuIGEgZGVzY3JpcHRvciBmb3IgdGhpcyBwcm9wZXJ0eSBsYXRlci5cbiAgICAgICAgICAvLyBPbmNlIGEgcHJvcGVydHkgaGFzIGJlZW4gcmVwb3J0ZWQgYXMgbm9uLWV4aXN0ZW50IG9uIGEgbm9uLWV4dGVuc2libGVcbiAgICAgICAgICAvLyBvYmplY3QsIGl0IHNob3VsZCBmb3JldmVyIGJlIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudFxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IGV4aXN0aW5nIG93biBwcm9wZXJ0eSAnXCIrbmFtZStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiJyBhcyBub24tZXhpc3RlbnQgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIGF0IHRoaXMgcG9pbnQsIHdlIGtub3cgKGRlc2MgIT09IHVuZGVmaW5lZCksIGkuZS5cbiAgICAvLyB0YXJnZXRIYW5kbGVyIHJlcG9ydHMgJ25hbWUnIGFzIGFuIGV4aXN0aW5nIHByb3BlcnR5XG5cbiAgICAvLyBOb3RlOiB3ZSBjb3VsZCBjb2xsYXBzZSB0aGUgZm9sbG93aW5nIHR3byBpZi10ZXN0cyBpbnRvIGEgc2luZ2xlXG4gICAgLy8gdGVzdC4gU2VwYXJhdGluZyBvdXQgdGhlIGNhc2VzIHRvIGltcHJvdmUgZXJyb3IgcmVwb3J0aW5nLlxuXG4gICAgaWYgKCFleHRlbnNpYmxlKSB7XG4gICAgICBpZiAodGFyZ2V0RGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IGEgbmV3IG93biBwcm9wZXJ0eSAnXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSArIFwiJyBvbiBhIG5vbi1leHRlbnNpYmxlIG9iamVjdFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIWlzQ29tcGF0aWJsZURlc2NyaXB0b3IoZXh0ZW5zaWJsZSwgdGFyZ2V0RGVzYywgZGVzYykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgaW5jb21wYXRpYmxlIHByb3BlcnR5IGRlc2NyaXB0b3IgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3IgcHJvcGVydHkgJ1wiK25hbWUrXCInXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoZGVzYy5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICBpZiAodGFyZ2V0RGVzYyA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldERlc2MuY29uZmlndXJhYmxlID09PSB0cnVlKSB7XG4gICAgICAgIC8vIGlmIHRoZSBwcm9wZXJ0eSBpcyBjb25maWd1cmFibGUgb3Igbm9uLWV4aXN0ZW50IG9uIHRoZSB0YXJnZXQsXG4gICAgICAgIC8vIGJ1dCBpcyByZXBvcnRlZCBhcyBhIG5vbi1jb25maWd1cmFibGUgcHJvcGVydHksIGl0IG1heSBsYXRlciBiZVxuICAgICAgICAvLyByZXBvcnRlZCBhcyBjb25maWd1cmFibGUgb3Igbm9uLWV4aXN0ZW50LCB3aGljaCB2aW9sYXRlcyB0aGVcbiAgICAgICAgLy8gaW52YXJpYW50IHRoYXQgaWYgdGhlIHByb3BlcnR5IG1pZ2h0IGNoYW5nZSBvciBkaXNhcHBlYXIsIHRoZVxuICAgICAgICAvLyBjb25maWd1cmFibGUgYXR0cmlidXRlIG11c3QgYmUgdHJ1ZS5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcImNhbm5vdCByZXBvcnQgYSBub24tY29uZmlndXJhYmxlIGRlc2NyaXB0b3IgXCIgK1xuICAgICAgICAgIFwiZm9yIGNvbmZpZ3VyYWJsZSBvciBub24tZXhpc3RlbnQgcHJvcGVydHkgJ1wiICsgbmFtZSArIFwiJ1wiKTtcbiAgICAgIH1cbiAgICAgIGlmICgnd3JpdGFibGUnIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRhcmdldERlc2Mud3JpdGFibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAvLyBpZiB0aGUgcHJvcGVydHkgaXMgbm9uLWNvbmZpZ3VyYWJsZSwgd3JpdGFibGUgb24gdGhlIHRhcmdldCxcbiAgICAgICAgICAvLyBidXQgaXMgcmVwb3J0ZWQgYXMgbm9uLWNvbmZpZ3VyYWJsZSwgbm9uLXdyaXRhYmxlLCBpdCBtYXkgbGF0ZXJcbiAgICAgICAgICAvLyBiZSByZXBvcnRlZCBhcyBub24tY29uZmlndXJhYmxlLCB3cml0YWJsZSBhZ2Fpbiwgd2hpY2ggdmlvbGF0ZXNcbiAgICAgICAgICAvLyB0aGUgaW52YXJpYW50IHRoYXQgYSBub24tY29uZmlndXJhYmxlLCBub24td3JpdGFibGUgcHJvcGVydHlcbiAgICAgICAgICAvLyBtYXkgbm90IGNoYW5nZSBzdGF0ZS5cbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgXCJjYW5ub3QgcmVwb3J0IG5vbi1jb25maWd1cmFibGUsIHdyaXRhYmxlIHByb3BlcnR5ICdcIiArIG5hbWUgK1xuICAgICAgICAgICAgXCInIGFzIG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZXNjO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbiB0aGUgZGlyZWN0IHByb3hpZXMgZGVzaWduIHdpdGggcmVmYWN0b3JlZCBwcm90b3R5cGUgY2xpbWJpbmcsXG4gICAqIHRoaXMgdHJhcCBpcyBkZXByZWNhdGVkLiBGb3IgcHJveGllcy1hcy1wcm90b3R5cGVzLCBpbnN0ZWFkXG4gICAqIG9mIGNhbGxpbmcgdGhpcyB0cmFwLCB0aGUgZ2V0LCBzZXQsIGhhcyBvciBlbnVtZXJhdGUgdHJhcHMgYXJlXG4gICAqIGNhbGxlZCBpbnN0ZWFkLlxuICAgKlxuICAgKiBJbiB0aGlzIGltcGxlbWVudGF0aW9uLCB3ZSBcImFidXNlXCIgZ2V0UHJvcGVydHlEZXNjcmlwdG9yIHRvXG4gICAqIHN1cHBvcnQgdHJhcHBpbmcgdGhlIGdldCBvciBzZXQgdHJhcHMgZm9yIHByb3hpZXMtYXMtcHJvdG90eXBlcy5cbiAgICogV2UgZG8gdGhpcyBieSByZXR1cm5pbmcgYSBnZXR0ZXIvc2V0dGVyIHBhaXIgdGhhdCBpbnZva2VzXG4gICAqIHRoZSBjb3JyZXNwb25kaW5nIHRyYXBzLlxuICAgKlxuICAgKiBXaGlsZSB0aGlzIGhhY2sgd29ya3MgZm9yIGluaGVyaXRlZCBwcm9wZXJ0eSBhY2Nlc3MsIGl0IGhhcyBzb21lXG4gICAqIHF1aXJrczpcbiAgICpcbiAgICogSW4gRmlyZWZveCwgdGhpcyB0cmFwIGlzIG9ubHkgY2FsbGVkIGFmdGVyIGEgcHJpb3IgaW52b2NhdGlvblxuICAgKiBvZiB0aGUgJ2hhcycgdHJhcCBoYXMgcmV0dXJuZWQgdHJ1ZS4gSGVuY2UsIGV4cGVjdCB0aGUgZm9sbG93aW5nXG4gICAqIGJlaGF2aW9yOlxuICAgKiA8Y29kZT5cbiAgICogdmFyIGNoaWxkID0gT2JqZWN0LmNyZWF0ZShQcm94eSh0YXJnZXQsIGhhbmRsZXIpKTtcbiAgICogY2hpbGRbbmFtZV0gLy8gdHJpZ2dlcnMgaGFuZGxlci5oYXModGFyZ2V0LCBuYW1lKVxuICAgKiAvLyBpZiB0aGF0IHJldHVybnMgdHJ1ZSwgdHJpZ2dlcnMgaGFuZGxlci5nZXQodGFyZ2V0LCBuYW1lLCBjaGlsZClcbiAgICogPC9jb2RlPlxuICAgKlxuICAgKiBPbiB2OCwgdGhlICdpbicgb3BlcmF0b3IsIHdoZW4gYXBwbGllZCB0byBhbiBvYmplY3QgdGhhdCBpbmhlcml0c1xuICAgKiBmcm9tIGEgcHJveHksIHdpbGwgY2FsbCBnZXRQcm9wZXJ0eURlc2NyaXB0b3IgYW5kIHdhbGsgdGhlIHByb3RvLWNoYWluLlxuICAgKiBUaGF0IGNhbGxzIHRoZSBiZWxvdyBnZXRQcm9wZXJ0eURlc2NyaXB0b3IgdHJhcCBvbiB0aGUgcHJveHkuIFRoZVxuICAgKiByZXN1bHQgb2YgdGhlICdpbictb3BlcmF0b3IgaXMgdGhlbiBkZXRlcm1pbmVkIGJ5IHdoZXRoZXIgdGhpcyB0cmFwXG4gICAqIHJldHVybnMgdW5kZWZpbmVkIG9yIGEgcHJvcGVydHkgZGVzY3JpcHRvciBvYmplY3QuIFRoYXQgaXMgd2h5XG4gICAqIHdlIGZpcnN0IGV4cGxpY2l0bHkgdHJpZ2dlciB0aGUgJ2hhcycgdHJhcCB0byBkZXRlcm1pbmUgd2hldGhlclxuICAgKiB0aGUgcHJvcGVydHkgZXhpc3RzLlxuICAgKlxuICAgKiBUaGlzIGhhcyB0aGUgc2lkZS1lZmZlY3QgdGhhdCB3aGVuIGVudW1lcmF0aW5nIHByb3BlcnRpZXMgb25cbiAgICogYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBhIHByb3h5IGluIHY4LCBvbmx5IHByb3BlcnRpZXNcbiAgICogZm9yIHdoaWNoICdoYXMnIHJldHVybnMgdHJ1ZSBhcmUgcmV0dXJuZWQ6XG4gICAqXG4gICAqIDxjb2RlPlxuICAgKiB2YXIgY2hpbGQgPSBPYmplY3QuY3JlYXRlKFByb3h5KHRhcmdldCwgaGFuZGxlcikpO1xuICAgKiBmb3IgKHZhciBwcm9wIGluIGNoaWxkKSB7XG4gICAqICAgLy8gb25seSBlbnVtZXJhdGVzIHByb3AgaWYgKHByb3AgaW4gY2hpbGQpIHJldHVybnMgdHJ1ZVxuICAgKiB9XG4gICAqIDwvY29kZT5cbiAgICovXG4gIGdldFByb3BlcnR5RGVzY3JpcHRvcjogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBoYW5kbGVyID0gdGhpcztcblxuICAgIGlmICghaGFuZGxlci5oYXMobmFtZSkpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZXIuZ2V0KHRoaXMsIG5hbWUpO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgIGlmIChoYW5kbGVyLnNldCh0aGlzLCBuYW1lLCB2YWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZmFpbGVkIGFzc2lnbm1lbnQgdG8gXCIrbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogSWYgbmFtZSBkZW5vdGVzIGEgZml4ZWQgcHJvcGVydHksIGNoZWNrIGZvciBpbmNvbXBhdGlibGUgY2hhbmdlcy5cbiAgICogSWYgdGhlIHByb3h5IGlzIG5vbi1leHRlbnNpYmxlLCBjaGVjayB0aGF0IG5ldyBwcm9wZXJ0aWVzIGFyZSByZWplY3RlZC5cbiAgICovXG4gIGRlZmluZVByb3BlcnR5OiBmdW5jdGlvbihuYW1lLCBkZXNjKSB7XG4gICAgLy8gVE9ETyh0dmN1dHNlbSk6IHRoZSBjdXJyZW50IHRyYWNlbW9ua2V5IGltcGxlbWVudGF0aW9uIG9mIHByb3hpZXNcbiAgICAvLyBhdXRvLWNvbXBsZXRlcyAnZGVzYycsIHdoaWNoIGlzIG5vdCBjb3JyZWN0LiAnZGVzYycgc2hvdWxkIGJlXG4gICAgLy8gbm9ybWFsaXplZCwgYnV0IG5vdCBjb21wbGV0ZWQuIENvbnNpZGVyOlxuICAgIC8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm94eSwgJ2ZvbycsIHtlbnVtZXJhYmxlOmZhbHNlfSlcbiAgICAvLyBUaGlzIHRyYXAgd2lsbCByZWNlaXZlIGRlc2MgPVxuICAgIC8vICB7dmFsdWU6dW5kZWZpbmVkLHdyaXRhYmxlOmZhbHNlLGVudW1lcmFibGU6ZmFsc2UsY29uZmlndXJhYmxlOmZhbHNlfVxuICAgIC8vIFRoaXMgd2lsbCBhbHNvIHNldCBhbGwgb3RoZXIgYXR0cmlidXRlcyB0byB0aGVpciBkZWZhdWx0IHZhbHVlLFxuICAgIC8vIHdoaWNoIGlzIHVuZXhwZWN0ZWQgYW5kIGRpZmZlcmVudCBmcm9tIFtbRGVmaW5lT3duUHJvcGVydHldXS5cbiAgICAvLyBCdWcgZmlsZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTYwMTMyOVxuXG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJkZWZpbmVQcm9wZXJ0eVwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRoaXMudGFyZ2V0LCBuYW1lLCBkZXNjKTtcbiAgICB9XG5cbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgIHZhciBkZXNjT2JqID0gbm9ybWFsaXplUHJvcGVydHlEZXNjcmlwdG9yKGRlc2MpO1xuICAgIHZhciBzdWNjZXNzID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQsIG5hbWUsIGRlc2NPYmopO1xuICAgIHN1Y2Nlc3MgPSAhIXN1Y2Nlc3M7IC8vIGNvZXJjZSB0byBCb29sZWFuXG5cbiAgICBpZiAoc3VjY2VzcyA9PT0gdHJ1ZSkge1xuXG4gICAgICB2YXIgdGFyZ2V0RGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcy50YXJnZXQsIG5hbWUpO1xuICAgICAgdmFyIGV4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlKHRoaXMudGFyZ2V0KTtcblxuICAgICAgLy8gTm90ZTogd2UgY291bGQgY29sbGFwc2UgdGhlIGZvbGxvd2luZyB0d28gaWYtdGVzdHMgaW50byBhIHNpbmdsZVxuICAgICAgLy8gdGVzdC4gU2VwYXJhdGluZyBvdXQgdGhlIGNhc2VzIHRvIGltcHJvdmUgZXJyb3IgcmVwb3J0aW5nLlxuXG4gICAgICBpZiAoIWV4dGVuc2libGUpIHtcbiAgICAgICAgaWYgKHRhcmdldERlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3Qgc3VjY2Vzc2Z1bGx5IGFkZCBhIG5ldyBwcm9wZXJ0eSAnXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lICsgXCInIHRvIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0YXJnZXREZXNjICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCFpc0NvbXBhdGlibGVEZXNjcmlwdG9yKGV4dGVuc2libGUsIHRhcmdldERlc2MsIGRlc2MpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCBkZWZpbmUgaW5jb21wYXRpYmxlIHByb3BlcnR5IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdG9yIGZvciBwcm9wZXJ0eSAnXCIrbmFtZStcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRGF0YURlc2NyaXB0b3IodGFyZ2V0RGVzYykgJiZcbiAgICAgICAgICAgIHRhcmdldERlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgdGFyZ2V0RGVzYy53cml0YWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKGRlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSAmJiBkZXNjLndyaXRhYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAvLyBpZiB0aGUgcHJvcGVydHkgaXMgbm9uLWNvbmZpZ3VyYWJsZSwgd3JpdGFibGUgb24gdGhlIHRhcmdldFxuICAgICAgICAgICAgICAvLyBidXQgd2FzIHN1Y2Nlc3NmdWxseSByZXBvcnRlZCB0byBiZSB1cGRhdGVkIHRvXG4gICAgICAgICAgICAgIC8vIG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZSwgaXQgY2FuIGxhdGVyIGJlIHJlcG9ydGVkXG4gICAgICAgICAgICAgIC8vIGFnYWluIGFzIG5vbi1jb25maWd1cmFibGUsIHdyaXRhYmxlLCB3aGljaCB2aW9sYXRlc1xuICAgICAgICAgICAgICAvLyB0aGUgaW52YXJpYW50IHRoYXQgbm9uLWNvbmZpZ3VyYWJsZSwgbm9uLXdyaXRhYmxlIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgLy8gY2Fubm90IGNoYW5nZSBzdGF0ZVxuICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgIFwiY2Fubm90IHN1Y2Nlc3NmdWxseSBkZWZpbmUgbm9uLWNvbmZpZ3VyYWJsZSwgd3JpdGFibGUgXCIgK1xuICAgICAgICAgICAgICAgIFwiIHByb3BlcnR5ICdcIiArIG5hbWUgKyBcIicgYXMgbm9uLWNvbmZpZ3VyYWJsZSwgbm9uLXdyaXRhYmxlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGRlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSAmJiAhaXNTZWFsZWREZXNjKHRhcmdldERlc2MpKSB7XG4gICAgICAgIC8vIGlmIHRoZSBwcm9wZXJ0eSBpcyBjb25maWd1cmFibGUgb3Igbm9uLWV4aXN0ZW50IG9uIHRoZSB0YXJnZXQsXG4gICAgICAgIC8vIGJ1dCBpcyBzdWNjZXNzZnVsbHkgYmVpbmcgcmVkZWZpbmVkIGFzIGEgbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0eSxcbiAgICAgICAgLy8gaXQgbWF5IGxhdGVyIGJlIHJlcG9ydGVkIGFzIGNvbmZpZ3VyYWJsZSBvciBub24tZXhpc3RlbnQsIHdoaWNoIHZpb2xhdGVzXG4gICAgICAgIC8vIHRoZSBpbnZhcmlhbnQgdGhhdCBpZiB0aGUgcHJvcGVydHkgbWlnaHQgY2hhbmdlIG9yIGRpc2FwcGVhciwgdGhlXG4gICAgICAgIC8vIGNvbmZpZ3VyYWJsZSBhdHRyaWJ1dGUgbXVzdCBiZSB0cnVlLlxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiY2Fubm90IHN1Y2Nlc3NmdWxseSBkZWZpbmUgYSBub24tY29uZmlndXJhYmxlIFwiICtcbiAgICAgICAgICBcImRlc2NyaXB0b3IgZm9yIGNvbmZpZ3VyYWJsZSBvciBub24tZXhpc3RlbnQgcHJvcGVydHkgJ1wiICtcbiAgICAgICAgICBuYW1lICsgXCInXCIpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHN1Y2Nlc3M7XG4gIH0sXG5cbiAgLyoqXG4gICAqIE9uIHN1Y2Nlc3MsIGNoZWNrIHdoZXRoZXIgdGhlIHRhcmdldCBvYmplY3QgaXMgaW5kZWVkIG5vbi1leHRlbnNpYmxlLlxuICAgKi9cbiAgcHJldmVudEV4dGVuc2lvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwicHJldmVudEV4dGVuc2lvbnNcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0aGlzLnRhcmdldCk7XG4gICAgfVxuXG4gICAgdmFyIHN1Y2Nlc3MgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCk7XG4gICAgc3VjY2VzcyA9ICEhc3VjY2VzczsgLy8gY29lcmNlIHRvIEJvb2xlYW5cbiAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgaWYgKE9iamVjdF9pc0V4dGVuc2libGUodGhpcy50YXJnZXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCByZXBvcnQgZXh0ZW5zaWJsZSBvYmplY3QgYXMgbm9uLWV4dGVuc2libGU6IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1Y2Nlc3M7XG4gIH0sXG5cbiAgLyoqXG4gICAqIElmIG5hbWUgZGVub3RlcyBhIHNlYWxlZCBwcm9wZXJ0eSwgY2hlY2sgd2hldGhlciBoYW5kbGVyIHJlamVjdHMuXG4gICAqL1xuICBkZWxldGU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImRlbGV0ZVByb3BlcnR5XCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGhpcy50YXJnZXQsIG5hbWUpO1xuICAgIH1cblxuICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgdmFyIHJlcyA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICByZXMgPSAhIXJlczsgLy8gY29lcmNlIHRvIEJvb2xlYW5cblxuICAgIHZhciB0YXJnZXREZXNjO1xuICAgIGlmIChyZXMgPT09IHRydWUpIHtcbiAgICAgIHRhcmdldERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICAgIGlmICh0YXJnZXREZXNjICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RGVzYy5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm9wZXJ0eSAnXCIgKyBuYW1lICsgXCInIGlzIG5vbi1jb25maWd1cmFibGUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbmQgY2FuJ3QgYmUgZGVsZXRlZFwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0YXJnZXREZXNjICE9PSB1bmRlZmluZWQgJiYgIU9iamVjdF9pc0V4dGVuc2libGUodGhpcy50YXJnZXQpKSB7XG4gICAgICAgIC8vIGlmIHRoZSBwcm9wZXJ0eSBzdGlsbCBleGlzdHMgb24gYSBub24tZXh0ZW5zaWJsZSB0YXJnZXQgYnV0XG4gICAgICAgIC8vIGlzIHJlcG9ydGVkIGFzIHN1Y2Nlc3NmdWxseSBkZWxldGVkLCBpdCBtYXkgbGF0ZXIgYmUgcmVwb3J0ZWRcbiAgICAgICAgLy8gYXMgcHJlc2VudCwgd2hpY2ggdmlvbGF0ZXMgdGhlIGludmFyaWFudCB0aGF0IGFuIG93biBwcm9wZXJ0eSxcbiAgICAgICAgLy8gZGVsZXRlZCBmcm9tIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0IGNhbm5vdCByZWFwcGVhci5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcImNhbm5vdCBzdWNjZXNzZnVsbHkgZGVsZXRlIGV4aXN0aW5nIHByb3BlcnR5ICdcIiArIG5hbWUgK1xuICAgICAgICAgIFwiJyBvbiBhIG5vbi1leHRlbnNpYmxlIG9iamVjdFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGUgZ2V0T3duUHJvcGVydHlOYW1lcyB0cmFwIHdhcyByZXBsYWNlZCBieSB0aGUgb3duS2V5cyB0cmFwLFxuICAgKiB3aGljaCBub3cgYWxzbyByZXR1cm5zIGFuIGFycmF5IChvZiBzdHJpbmdzIG9yIHN5bWJvbHMpIGFuZFxuICAgKiB3aGljaCBwZXJmb3JtcyB0aGUgc2FtZSByaWdvcm91cyBpbnZhcmlhbnQgY2hlY2tzIGFzIGdldE93blByb3BlcnR5TmFtZXNcbiAgICpcbiAgICogU2VlIGlzc3VlICM0OCBvbiBob3cgdGhpcyB0cmFwIGNhbiBzdGlsbCBnZXQgaW52b2tlZCBieSBleHRlcm5hbCBsaWJzXG4gICAqIHRoYXQgZG9uJ3QgdXNlIHRoZSBwYXRjaGVkIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIGZ1bmN0aW9uLlxuICAgKi9cbiAgZ2V0T3duUHJvcGVydHlOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgLy8gTm90ZTogcmVtb3ZlZCBkZXByZWNhdGlvbiB3YXJuaW5nIHRvIGF2b2lkIGRlcGVuZGVuY3kgb24gJ2NvbnNvbGUnXG4gICAgLy8gKGFuZCBvbiBub2RlLCBzaG91bGQgYW55d2F5IHVzZSB1dGlsLmRlcHJlY2F0ZSkuIERlcHJlY2F0aW9uIHdhcm5pbmdzXG4gICAgLy8gY2FuIGFsc28gYmUgYW5ub3lpbmcgd2hlbiB0aGV5IGFyZSBvdXRzaWRlIG9mIHRoZSB1c2VyJ3MgY29udHJvbCwgZS5nLlxuICAgIC8vIHdoZW4gYW4gZXh0ZXJuYWwgbGlicmFyeSBjYWxscyB1bnBhdGNoZWQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMuXG4gICAgLy8gU2luY2UgdGhlcmUgaXMgYSBjbGVhbiBmYWxsYmFjayB0byBgb3duS2V5c2AsIHRoZSBmYWN0IHRoYXQgdGhlXG4gICAgLy8gZGVwcmVjYXRlZCBtZXRob2QgaXMgc3RpbGwgY2FsbGVkIGlzIG1vc3RseSBoYXJtbGVzcyBhbnl3YXkuXG4gICAgLy8gU2VlIGFsc28gaXNzdWVzICM2NSBhbmQgIzY2LlxuICAgIC8vIGNvbnNvbGUud2FybihcImdldE93blByb3BlcnR5TmFtZXMgdHJhcCBpcyBkZXByZWNhdGVkLiBVc2Ugb3duS2V5cyBpbnN0ZWFkXCIpO1xuICAgIHJldHVybiB0aGlzLm93bktleXMoKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHRyYXAgcmVzdWx0IGRvZXMgbm90IGNvbnRhaW4gYW55IG5ldyBwcm9wZXJ0aWVzXG4gICAqIGlmIHRoZSBwcm94eSBpcyBub24tZXh0ZW5zaWJsZS5cbiAgICpcbiAgICogQW55IG93biBub24tY29uZmlndXJhYmxlIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldCB0aGF0IGFyZSBub3QgaW5jbHVkZWRcbiAgICogaW4gdGhlIHRyYXAgcmVzdWx0IGdpdmUgcmlzZSB0byBhIFR5cGVFcnJvci4gQXMgc3VjaCwgd2UgY2hlY2sgd2hldGhlciB0aGVcbiAgICogcmV0dXJuZWQgcmVzdWx0IGNvbnRhaW5zIGF0IGxlYXN0IGFsbCBzZWFsZWQgcHJvcGVydGllcyBvZiB0aGUgdGFyZ2V0XG4gICAqIG9iamVjdC5cbiAgICpcbiAgICogQWRkaXRpb25hbGx5LCB0aGUgdHJhcCByZXN1bHQgaXMgbm9ybWFsaXplZC5cbiAgICogSW5zdGVhZCBvZiByZXR1cm5pbmcgdGhlIHRyYXAgcmVzdWx0IGRpcmVjdGx5OlxuICAgKiAgLSBjcmVhdGUgYW5kIHJldHVybiBhIGZyZXNoIEFycmF5LFxuICAgKiAgLSBvZiB3aGljaCBlYWNoIGVsZW1lbnQgaXMgY29lcmNlZCB0byBhIFN0cmluZ1xuICAgKlxuICAgKiBUaGlzIHRyYXAgaXMgY2FsbGVkIGEuby4gYnkgUmVmbGVjdC5vd25LZXlzLCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICAgKiBhbmQgT2JqZWN0LmtleXMgKHRoZSBsYXR0ZXIgZmlsdGVycyBvdXQgb25seSB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcykuXG4gICAqL1xuICBvd25LZXlzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcIm93bktleXNcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRoaXMudGFyZ2V0KTtcbiAgICB9XG5cbiAgICB2YXIgdHJhcFJlc3VsdCA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0KTtcblxuICAgIC8vIHByb3BOYW1lcyBpcyB1c2VkIGFzIGEgc2V0IG9mIHN0cmluZ3NcbiAgICB2YXIgcHJvcE5hbWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB2YXIgbnVtUHJvcHMgPSArdHJhcFJlc3VsdC5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheShudW1Qcm9wcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVByb3BzOyBpKyspIHtcbiAgICAgIHZhciBzID0gU3RyaW5nKHRyYXBSZXN1bHRbaV0pO1xuICAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHRoaXMudGFyZ2V0KSAmJiAhaXNGaXhlZChzLCB0aGlzLnRhcmdldCkpIHtcbiAgICAgICAgLy8gbm9uLWV4dGVuc2libGUgcHJveGllcyBkb24ndCB0b2xlcmF0ZSBuZXcgb3duIHByb3BlcnR5IG5hbWVzXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJvd25LZXlzIHRyYXAgY2Fubm90IGxpc3QgYSBuZXcgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eSAnXCIrcytcIicgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgICB9XG5cbiAgICAgIHByb3BOYW1lc1tzXSA9IHRydWU7XG4gICAgICByZXN1bHRbaV0gPSBzO1xuICAgIH1cblxuICAgIHZhciBvd25Qcm9wcyA9IE9iamVjdF9nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMudGFyZ2V0KTtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgb3duUHJvcHMuZm9yRWFjaChmdW5jdGlvbiAob3duUHJvcCkge1xuICAgICAgaWYgKCFwcm9wTmFtZXNbb3duUHJvcF0pIHtcbiAgICAgICAgaWYgKGlzU2VhbGVkKG93blByb3AsIHRhcmdldCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwib3duS2V5cyB0cmFwIGZhaWxlZCB0byBpbmNsdWRlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJub24tY29uZmlndXJhYmxlIHByb3BlcnR5ICdcIitvd25Qcm9wK1wiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIU9iamVjdC5pc0V4dGVuc2libGUodGFyZ2V0KSAmJlxuICAgICAgICAgICAgaXNGaXhlZChvd25Qcm9wLCB0YXJnZXQpKSB7XG4gICAgICAgICAgICAvLyBpZiBoYW5kbGVyIGlzIGFsbG93ZWQgdG8gcmVwb3J0IG93blByb3AgYXMgbm9uLWV4aXN0ZW50LFxuICAgICAgICAgICAgLy8gd2UgY2Fubm90IGd1YXJhbnRlZSB0aGF0IGl0IHdpbGwgbmV2ZXIgbGF0ZXIgcmVwb3J0IGl0IGFzXG4gICAgICAgICAgICAvLyBleGlzdGVudC4gT25jZSBhIHByb3BlcnR5IGhhcyBiZWVuIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudFxuICAgICAgICAgICAgLy8gb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3QsIGl0IHNob3VsZCBmb3JldmVyIGJlIHJlcG9ydGVkIGFzXG4gICAgICAgICAgICAvLyBub24tZXhpc3RlbnRcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJvd25LZXlzIHRyYXAgY2Fubm90IHJlcG9ydCBleGlzdGluZyBvd24gcHJvcGVydHkgJ1wiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25Qcm9wK1wiJyBhcyBub24tZXhpc3RlbnQgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSB0cmFwIHJlc3VsdCBpcyBjb25zaXN0ZW50IHdpdGggdGhlIHN0YXRlIG9mIHRoZVxuICAgKiB3cmFwcGVkIHRhcmdldC5cbiAgICovXG4gIGlzRXh0ZW5zaWJsZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJpc0V4dGVuc2libGVcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGhpcy50YXJnZXQpO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCk7XG4gICAgcmVzdWx0ID0gISFyZXN1bHQ7IC8vIGNvZXJjZSB0byBCb29sZWFuXG4gICAgdmFyIHN0YXRlID0gT2JqZWN0X2lzRXh0ZW5zaWJsZSh0aGlzLnRhcmdldCk7XG4gICAgaWYgKHJlc3VsdCAhPT0gc3RhdGUpIHtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgbm9uLWV4dGVuc2libGUgb2JqZWN0IGFzIGV4dGVuc2libGU6IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHJlcG9ydCBleHRlbnNpYmxlIG9iamVjdCBhcyBub24tZXh0ZW5zaWJsZTogXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSB0cmFwIHJlc3VsdCBjb3JyZXNwb25kcyB0byB0aGUgdGFyZ2V0J3MgW1tQcm90b3R5cGVdXVxuICAgKi9cbiAgZ2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwiZ2V0UHJvdG90eXBlT2ZcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0aGlzLnRhcmdldCk7XG4gICAgfVxuXG4gICAgdmFyIGFsbGVnZWRQcm90byA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0KTtcblxuICAgIGlmICghT2JqZWN0X2lzRXh0ZW5zaWJsZSh0aGlzLnRhcmdldCkpIHtcbiAgICAgIHZhciBhY3R1YWxQcm90byA9IE9iamVjdF9nZXRQcm90b3R5cGVPZih0aGlzLnRhcmdldCk7XG4gICAgICBpZiAoIXNhbWVWYWx1ZShhbGxlZ2VkUHJvdG8sIGFjdHVhbFByb3RvKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicHJvdG90eXBlIHZhbHVlIGRvZXMgbm90IG1hdGNoOiBcIiArIHRoaXMudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYWxsZWdlZFByb3RvO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJZiB0YXJnZXQgaXMgbm9uLWV4dGVuc2libGUgYW5kIHNldFByb3RvdHlwZU9mIHRyYXAgcmV0dXJucyB0cnVlLFxuICAgKiBjaGVjayB3aGV0aGVyIHRoZSB0cmFwIHJlc3VsdCBjb3JyZXNwb25kcyB0byB0aGUgdGFyZ2V0J3MgW1tQcm90b3R5cGVdXVxuICAgKi9cbiAgc2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uKG5ld1Byb3RvKSB7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJzZXRQcm90b3R5cGVPZlwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHJldHVybiBSZWZsZWN0LnNldFByb3RvdHlwZU9mKHRoaXMudGFyZ2V0LCBuZXdQcm90byk7XG4gICAgfVxuXG4gICAgdmFyIHN1Y2Nlc3MgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCwgbmV3UHJvdG8pO1xuXG4gICAgc3VjY2VzcyA9ICEhc3VjY2VzcztcbiAgICBpZiAoc3VjY2VzcyAmJiAhT2JqZWN0X2lzRXh0ZW5zaWJsZSh0aGlzLnRhcmdldCkpIHtcbiAgICAgIHZhciBhY3R1YWxQcm90byA9IE9iamVjdF9nZXRQcm90b3R5cGVPZih0aGlzLnRhcmdldCk7XG4gICAgICBpZiAoIXNhbWVWYWx1ZShuZXdQcm90bywgYWN0dWFsUHJvdG8pKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm90b3R5cGUgdmFsdWUgZG9lcyBub3QgbWF0Y2g6IFwiICsgdGhpcy50YXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdWNjZXNzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbiB0aGUgZGlyZWN0IHByb3hpZXMgZGVzaWduIHdpdGggcmVmYWN0b3JlZCBwcm90b3R5cGUgY2xpbWJpbmcsXG4gICAqIHRoaXMgdHJhcCBpcyBkZXByZWNhdGVkLiBGb3IgcHJveGllcy1hcy1wcm90b3R5cGVzLCBmb3ItaW4gd2lsbFxuICAgKiBjYWxsIHRoZSBlbnVtZXJhdGUoKSB0cmFwLiBJZiB0aGF0IHRyYXAgaXMgbm90IGRlZmluZWQsIHRoZVxuICAgKiBvcGVyYXRpb24gaXMgZm9yd2FyZGVkIHRvIHRoZSB0YXJnZXQsIG5vIG1vcmUgZmFsbGJhY2sgb24gdGhpc1xuICAgKiBmdW5kYW1lbnRhbCB0cmFwLlxuICAgKi9cbiAgZ2V0UHJvcGVydHlOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImdldFByb3BlcnR5TmFtZXMgdHJhcCBpcyBkZXByZWNhdGVkXCIpO1xuICB9LFxuXG4gIC8vID09PSBkZXJpdmVkIHRyYXBzID09PVxuXG4gIC8qKlxuICAgKiBJZiBuYW1lIGRlbm90ZXMgYSBmaXhlZCBwcm9wZXJ0eSwgY2hlY2sgd2hldGhlciB0aGUgdHJhcCByZXR1cm5zIHRydWUuXG4gICAqL1xuICBoYXM6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImhhc1wiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHJldHVybiBSZWZsZWN0Lmhhcyh0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgfVxuXG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKTtcbiAgICB2YXIgcmVzID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQsIG5hbWUpO1xuICAgIHJlcyA9ICEhcmVzOyAvLyBjb2VyY2UgdG8gQm9vbGVhblxuXG4gICAgaWYgKHJlcyA9PT0gZmFsc2UpIHtcbiAgICAgIGlmIChpc1NlYWxlZChuYW1lLCB0aGlzLnRhcmdldCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgZXhpc3Rpbmcgbm9uLWNvbmZpZ3VyYWJsZSBvd24gXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eSAnXCIrIG5hbWUgKyBcIicgYXMgYSBub24tZXhpc3RlbnQgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eVwiKTtcbiAgICAgIH1cbiAgICAgIGlmICghT2JqZWN0LmlzRXh0ZW5zaWJsZSh0aGlzLnRhcmdldCkgJiZcbiAgICAgICAgICBpc0ZpeGVkKG5hbWUsIHRoaXMudGFyZ2V0KSkge1xuICAgICAgICAgIC8vIGlmIGhhbmRsZXIgaXMgYWxsb3dlZCB0byByZXR1cm4gZmFsc2UsIHdlIGNhbm5vdCBndWFyYW50ZWVcbiAgICAgICAgICAvLyB0aGF0IGl0IHdpbGwgbm90IHJldHVybiB0cnVlIGZvciB0aGlzIHByb3BlcnR5IGxhdGVyLlxuICAgICAgICAgIC8vIE9uY2UgYSBwcm9wZXJ0eSBoYXMgYmVlbiByZXBvcnRlZCBhcyBub24tZXhpc3RlbnQgb24gYSBub24tZXh0ZW5zaWJsZVxuICAgICAgICAgIC8vIG9iamVjdCwgaXQgc2hvdWxkIGZvcmV2ZXIgYmUgcmVwb3J0ZWQgYXMgbm9uLWV4aXN0ZW50XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgZXhpc3Rpbmcgb3duIHByb3BlcnR5ICdcIituYW1lK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCInIGFzIG5vbi1leGlzdGVudCBvbiBhIG5vbi1leHRlbnNpYmxlIG9iamVjdFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiByZXMgPT09IHRydWUsIHdlIGRvbid0IG5lZWQgdG8gY2hlY2sgZm9yIGV4dGVuc2liaWxpdHlcbiAgICAvLyBldmVuIGZvciBhIG5vbi1leHRlbnNpYmxlIHByb3h5IHRoYXQgaGFzIG5vIG93biBuYW1lIHByb3BlcnR5LFxuICAgIC8vIHRoZSBwcm9wZXJ0eSBtYXkgaGF2ZSBiZWVuIGluaGVyaXRlZFxuXG4gICAgcmV0dXJuIHJlcztcbiAgfSxcblxuICAvKipcbiAgICogSWYgbmFtZSBkZW5vdGVzIGEgZml4ZWQgbm9uLWNvbmZpZ3VyYWJsZSwgbm9uLXdyaXRhYmxlIGRhdGEgcHJvcGVydHksXG4gICAqIGNoZWNrIGl0cyByZXR1cm4gdmFsdWUgYWdhaW5zdCB0aGUgcHJldmlvdXNseSBhc3NlcnRlZCB2YWx1ZSBvZiB0aGVcbiAgICogZml4ZWQgcHJvcGVydHkuXG4gICAqL1xuICBnZXQ6IGZ1bmN0aW9uKHJlY2VpdmVyLCBuYW1lKSB7XG5cbiAgICAvLyBleHBlcmltZW50YWwgc3VwcG9ydCBmb3IgaW52b2tlKCkgdHJhcCBvbiBwbGF0Zm9ybXMgdGhhdFxuICAgIC8vIHN1cHBvcnQgX19ub1N1Y2hNZXRob2RfX1xuICAgIC8qXG4gICAgaWYgKG5hbWUgPT09ICdfX25vU3VjaE1ldGhvZF9fJykge1xuICAgICAgdmFyIGhhbmRsZXIgPSB0aGlzO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5hbWUsIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZXIuaW52b2tlKHJlY2VpdmVyLCBuYW1lLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgKi9cblxuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwiZ2V0XCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRoaXMudGFyZ2V0LCBuYW1lLCByZWNlaXZlcik7XG4gICAgfVxuXG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKTtcbiAgICB2YXIgcmVzID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQsIG5hbWUsIHJlY2VpdmVyKTtcblxuICAgIHZhciBmaXhlZERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICAvLyBjaGVjayBjb25zaXN0ZW5jeSBvZiB0aGUgcmV0dXJuZWQgdmFsdWVcbiAgICBpZiAoZml4ZWREZXNjICE9PSB1bmRlZmluZWQpIHsgLy8gZ2V0dGluZyBhbiBleGlzdGluZyBwcm9wZXJ0eVxuICAgICAgaWYgKGlzRGF0YURlc2NyaXB0b3IoZml4ZWREZXNjKSAmJlxuICAgICAgICAgIGZpeGVkRGVzYy5jb25maWd1cmFibGUgPT09IGZhbHNlICYmXG4gICAgICAgICAgZml4ZWREZXNjLndyaXRhYmxlID09PSBmYWxzZSkgeyAvLyBvd24gZnJvemVuIGRhdGEgcHJvcGVydHlcbiAgICAgICAgaWYgKCFzYW1lVmFsdWUocmVzLCBmaXhlZERlc2MudmFsdWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgaW5jb25zaXN0ZW50IHZhbHVlIGZvciBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9uLXdyaXRhYmxlLCBub24tY29uZmlndXJhYmxlIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUrXCInXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBpdCdzIGFuIGFjY2Vzc29yIHByb3BlcnR5XG4gICAgICAgIGlmIChpc0FjY2Vzc29yRGVzY3JpcHRvcihmaXhlZERlc2MpICYmXG4gICAgICAgICAgICBmaXhlZERlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgZml4ZWREZXNjLmdldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKHJlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibXVzdCByZXBvcnQgdW5kZWZpbmVkIGZvciBub24tY29uZmlndXJhYmxlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFjY2Vzc29yIHByb3BlcnR5ICdcIituYW1lK1wiJyB3aXRob3V0IGdldHRlclwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJZiBuYW1lIGRlbm90ZXMgYSBmaXhlZCBub24tY29uZmlndXJhYmxlLCBub24td3JpdGFibGUgZGF0YSBwcm9wZXJ0eSxcbiAgICogY2hlY2sgdGhhdCB0aGUgdHJhcCByZWplY3RzIHRoZSBhc3NpZ25tZW50LlxuICAgKi9cbiAgc2V0OiBmdW5jdGlvbihyZWNlaXZlciwgbmFtZSwgdmFsKSB7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJzZXRcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGhpcy50YXJnZXQsIG5hbWUsIHZhbCwgcmVjZWl2ZXIpO1xuICAgIH1cblxuICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgdmFyIHJlcyA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0LCBuYW1lLCB2YWwsIHJlY2VpdmVyKTtcbiAgICByZXMgPSAhIXJlczsgLy8gY29lcmNlIHRvIEJvb2xlYW5cblxuICAgIC8vIGlmIHN1Y2Nlc3MgaXMgcmVwb3J0ZWQsIGNoZWNrIHdoZXRoZXIgcHJvcGVydHkgaXMgdHJ1bHkgYXNzaWduYWJsZVxuICAgIGlmIChyZXMgPT09IHRydWUpIHtcbiAgICAgIHZhciBmaXhlZERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICAgIGlmIChmaXhlZERlc2MgIT09IHVuZGVmaW5lZCkgeyAvLyBzZXR0aW5nIGFuIGV4aXN0aW5nIHByb3BlcnR5XG4gICAgICAgIGlmIChpc0RhdGFEZXNjcmlwdG9yKGZpeGVkRGVzYykgJiZcbiAgICAgICAgICAgIGZpeGVkRGVzYy5jb25maWd1cmFibGUgPT09IGZhbHNlICYmXG4gICAgICAgICAgICBmaXhlZERlc2Mud3JpdGFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaWYgKCFzYW1lVmFsdWUodmFsLCBmaXhlZERlc2MudmFsdWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHN1Y2Nlc3NmdWxseSBhc3NpZ24gdG8gYSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJub24td3JpdGFibGUsIG5vbi1jb25maWd1cmFibGUgcHJvcGVydHkgJ1wiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lK1wiJ1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGlzQWNjZXNzb3JEZXNjcmlwdG9yKGZpeGVkRGVzYykgJiZcbiAgICAgICAgICAgICAgZml4ZWREZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UgJiYgLy8gbm9uLWNvbmZpZ3VyYWJsZVxuICAgICAgICAgICAgICBmaXhlZERlc2Muc2V0ID09PSB1bmRlZmluZWQpIHsgICAgICAvLyBhY2Nlc3NvciB3aXRoIHVuZGVmaW5lZCBzZXR0ZXJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJzZXR0aW5nIGEgcHJvcGVydHkgJ1wiK25hbWUrXCInIHRoYXQgaGFzIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBvbmx5IGEgZ2V0dGVyXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFueSBvd24gZW51bWVyYWJsZSBub24tY29uZmlndXJhYmxlIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldCB0aGF0IGFyZSBub3RcbiAgICogaW5jbHVkZWQgaW4gdGhlIHRyYXAgcmVzdWx0IGdpdmUgcmlzZSB0byBhIFR5cGVFcnJvci4gQXMgc3VjaCwgd2UgY2hlY2tcbiAgICogd2hldGhlciB0aGUgcmV0dXJuZWQgcmVzdWx0IGNvbnRhaW5zIGF0IGxlYXN0IGFsbCBzZWFsZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzXG4gICAqIG9mIHRoZSB0YXJnZXQgb2JqZWN0LlxuICAgKlxuICAgKiBUaGUgdHJhcCBzaG91bGQgcmV0dXJuIGFuIGl0ZXJhdG9yLlxuICAgKlxuICAgKiBIb3dldmVyLCBhcyBpbXBsZW1lbnRhdGlvbnMgb2YgcHJlLWRpcmVjdCBwcm94aWVzIHN0aWxsIGV4cGVjdCBlbnVtZXJhdGVcbiAgICogdG8gcmV0dXJuIGFuIGFycmF5IG9mIHN0cmluZ3MsIHdlIGNvbnZlcnQgdGhlIGl0ZXJhdG9yIGludG8gYW4gYXJyYXkuXG4gICAqL1xuICBlbnVtZXJhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwiZW51bWVyYXRlXCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgdmFyIHRyYXBSZXN1bHQgPSBSZWZsZWN0LmVudW1lcmF0ZSh0aGlzLnRhcmdldCk7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICB2YXIgbnh0ID0gdHJhcFJlc3VsdC5uZXh0KCk7XG4gICAgICB3aGlsZSAoIW54dC5kb25lKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKFN0cmluZyhueHQudmFsdWUpKTtcbiAgICAgICAgbnh0ID0gdHJhcFJlc3VsdC5uZXh0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHZhciB0cmFwUmVzdWx0ID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQpO1xuICAgIFxuICAgIGlmICh0cmFwUmVzdWx0ID09PSBudWxsIHx8XG4gICAgICAgIHRyYXBSZXN1bHQgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICB0cmFwUmVzdWx0Lm5leHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImVudW1lcmF0ZSB0cmFwIHNob3VsZCByZXR1cm4gYW4gaXRlcmF0b3IsIGdvdDogXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRyYXBSZXN1bHQpOyAgICBcbiAgICB9XG4gICAgXG4gICAgLy8gcHJvcE5hbWVzIGlzIHVzZWQgYXMgYSBzZXQgb2Ygc3RyaW5nc1xuICAgIHZhciBwcm9wTmFtZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIFxuICAgIC8vIHZhciBudW1Qcm9wcyA9ICt0cmFwUmVzdWx0Lmxlbmd0aDtcbiAgICB2YXIgcmVzdWx0ID0gW107IC8vIG5ldyBBcnJheShudW1Qcm9wcyk7XG4gICAgXG4gICAgLy8gdHJhcFJlc3VsdCBpcyBzdXBwb3NlZCB0byBiZSBhbiBpdGVyYXRvclxuICAgIC8vIGRyYWluIGl0ZXJhdG9yIHRvIGFycmF5IGFzIGN1cnJlbnQgaW1wbGVtZW50YXRpb25zIHN0aWxsIGV4cGVjdFxuICAgIC8vIGVudW1lcmF0ZSB0byByZXR1cm4gYW4gYXJyYXkgb2Ygc3RyaW5nc1xuICAgIHZhciBueHQgPSB0cmFwUmVzdWx0Lm5leHQoKTtcbiAgICBcbiAgICB3aGlsZSAoIW54dC5kb25lKSB7XG4gICAgICB2YXIgcyA9IFN0cmluZyhueHQudmFsdWUpO1xuICAgICAgaWYgKHByb3BOYW1lc1tzXSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZW51bWVyYXRlIHRyYXAgY2Fubm90IGxpc3QgYSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImR1cGxpY2F0ZSBwcm9wZXJ0eSAnXCIrcytcIidcIik7XG4gICAgICB9XG4gICAgICBwcm9wTmFtZXNbc10gPSB0cnVlO1xuICAgICAgcmVzdWx0LnB1c2gocyk7XG4gICAgICBueHQgPSB0cmFwUmVzdWx0Lm5leHQoKTtcbiAgICB9XG4gICAgXG4gICAgLypmb3IgKHZhciBpID0gMDsgaSA8IG51bVByb3BzOyBpKyspIHtcbiAgICAgIHZhciBzID0gU3RyaW5nKHRyYXBSZXN1bHRbaV0pO1xuICAgICAgaWYgKHByb3BOYW1lc1tzXSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZW51bWVyYXRlIHRyYXAgY2Fubm90IGxpc3QgYSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImR1cGxpY2F0ZSBwcm9wZXJ0eSAnXCIrcytcIidcIik7XG4gICAgICB9XG5cbiAgICAgIHByb3BOYW1lc1tzXSA9IHRydWU7XG4gICAgICByZXN1bHRbaV0gPSBzO1xuICAgIH0gKi9cblxuICAgIHZhciBvd25FbnVtZXJhYmxlUHJvcHMgPSBPYmplY3Qua2V5cyh0aGlzLnRhcmdldCk7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgIG93bkVudW1lcmFibGVQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChvd25FbnVtZXJhYmxlUHJvcCkge1xuICAgICAgaWYgKCFwcm9wTmFtZXNbb3duRW51bWVyYWJsZVByb3BdKSB7XG4gICAgICAgIGlmIChpc1NlYWxlZChvd25FbnVtZXJhYmxlUHJvcCwgdGFyZ2V0KSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJlbnVtZXJhdGUgdHJhcCBmYWlsZWQgdG8gaW5jbHVkZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9uLWNvbmZpZ3VyYWJsZSBlbnVtZXJhYmxlIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bkVudW1lcmFibGVQcm9wK1wiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIU9iamVjdC5pc0V4dGVuc2libGUodGFyZ2V0KSAmJlxuICAgICAgICAgICAgaXNGaXhlZChvd25FbnVtZXJhYmxlUHJvcCwgdGFyZ2V0KSkge1xuICAgICAgICAgICAgLy8gaWYgaGFuZGxlciBpcyBhbGxvd2VkIG5vdCB0byByZXBvcnQgb3duRW51bWVyYWJsZVByb3AgYXMgYW4gb3duXG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSwgd2UgY2Fubm90IGd1YXJhbnRlZSB0aGF0IGl0IHdpbGwgbmV2ZXIgcmVwb3J0IGl0IGFzXG4gICAgICAgICAgICAvLyBhbiBvd24gcHJvcGVydHkgbGF0ZXIuIE9uY2UgYSBwcm9wZXJ0eSBoYXMgYmVlbiByZXBvcnRlZCBhc1xuICAgICAgICAgICAgLy8gbm9uLWV4aXN0ZW50IG9uIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0LCBpdCBzaG91bGQgZm9yZXZlciBiZVxuICAgICAgICAgICAgLy8gcmVwb3J0ZWQgYXMgbm9uLWV4aXN0ZW50XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHJlcG9ydCBleGlzdGluZyBvd24gcHJvcGVydHkgJ1wiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25FbnVtZXJhYmxlUHJvcCtcIicgYXMgbm9uLWV4aXN0ZW50IG9uIGEgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9uLWV4dGVuc2libGUgb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGUgaXRlcmF0ZSB0cmFwIGlzIGRlcHJlY2F0ZWQgYnkgdGhlIGVudW1lcmF0ZSB0cmFwLlxuICAgKi9cbiAgaXRlcmF0ZTogVmFsaWRhdG9yLnByb3RvdHlwZS5lbnVtZXJhdGUsXG5cbiAgLyoqXG4gICAqIEFueSBvd24gbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQgdGhhdCBhcmUgbm90IGluY2x1ZGVkXG4gICAqIGluIHRoZSB0cmFwIHJlc3VsdCBnaXZlIHJpc2UgdG8gYSBUeXBlRXJyb3IuIEFzIHN1Y2gsIHdlIGNoZWNrIHdoZXRoZXIgdGhlXG4gICAqIHJldHVybmVkIHJlc3VsdCBjb250YWlucyBhdCBsZWFzdCBhbGwgc2VhbGVkIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldFxuICAgKiBvYmplY3QuXG4gICAqXG4gICAqIFRoZSB0cmFwIHJlc3VsdCBpcyBub3JtYWxpemVkLlxuICAgKiBUaGUgdHJhcCByZXN1bHQgaXMgbm90IHJldHVybmVkIGRpcmVjdGx5LiBJbnN0ZWFkOlxuICAgKiAgLSBjcmVhdGUgYW5kIHJldHVybiBhIGZyZXNoIEFycmF5LFxuICAgKiAgLSBvZiB3aGljaCBlYWNoIGVsZW1lbnQgaXMgY29lcmNlZCB0byBTdHJpbmcsXG4gICAqICAtIHdoaWNoIGRvZXMgbm90IGNvbnRhaW4gZHVwbGljYXRlc1xuICAgKlxuICAgKiBGSVhNRToga2V5cyB0cmFwIGlzIGRlcHJlY2F0ZWRcbiAgICovXG4gIC8qXG4gIGtleXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwia2V5c1wiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHJldHVybiBSZWZsZWN0LmtleXModGhpcy50YXJnZXQpO1xuICAgIH1cblxuICAgIHZhciB0cmFwUmVzdWx0ID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQpO1xuXG4gICAgLy8gcHJvcE5hbWVzIGlzIHVzZWQgYXMgYSBzZXQgb2Ygc3RyaW5nc1xuICAgIHZhciBwcm9wTmFtZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHZhciBudW1Qcm9wcyA9ICt0cmFwUmVzdWx0Lmxlbmd0aDtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KG51bVByb3BzKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtUHJvcHM7IGkrKykge1xuICAgICB2YXIgcyA9IFN0cmluZyh0cmFwUmVzdWx0W2ldKTtcbiAgICAgaWYgKHByb3BOYW1lc1tzXSkge1xuICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJrZXlzIHRyYXAgY2Fubm90IGxpc3QgYSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZHVwbGljYXRlIHByb3BlcnR5ICdcIitzK1wiJ1wiKTtcbiAgICAgfVxuICAgICBpZiAoIU9iamVjdC5pc0V4dGVuc2libGUodGhpcy50YXJnZXQpICYmICFpc0ZpeGVkKHMsIHRoaXMudGFyZ2V0KSkge1xuICAgICAgIC8vIG5vbi1leHRlbnNpYmxlIHByb3hpZXMgZG9uJ3QgdG9sZXJhdGUgbmV3IG93biBwcm9wZXJ0eSBuYW1lc1xuICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJrZXlzIHRyYXAgY2Fubm90IGxpc3QgYSBuZXcgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcInByb3BlcnR5ICdcIitzK1wiJyBvbiBhIG5vbi1leHRlbnNpYmxlIG9iamVjdFwiKTtcbiAgICAgfVxuXG4gICAgIHByb3BOYW1lc1tzXSA9IHRydWU7XG4gICAgIHJlc3VsdFtpXSA9IHM7XG4gICAgfVxuXG4gICAgdmFyIG93bkVudW1lcmFibGVQcm9wcyA9IE9iamVjdC5rZXlzKHRoaXMudGFyZ2V0KTtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgb3duRW51bWVyYWJsZVByb3BzLmZvckVhY2goZnVuY3Rpb24gKG93bkVudW1lcmFibGVQcm9wKSB7XG4gICAgICBpZiAoIXByb3BOYW1lc1tvd25FbnVtZXJhYmxlUHJvcF0pIHtcbiAgICAgICAgaWYgKGlzU2VhbGVkKG93bkVudW1lcmFibGVQcm9wLCB0YXJnZXQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImtleXMgdHJhcCBmYWlsZWQgdG8gaW5jbHVkZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9uLWNvbmZpZ3VyYWJsZSBlbnVtZXJhYmxlIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bkVudW1lcmFibGVQcm9wK1wiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIU9iamVjdC5pc0V4dGVuc2libGUodGFyZ2V0KSAmJlxuICAgICAgICAgICAgaXNGaXhlZChvd25FbnVtZXJhYmxlUHJvcCwgdGFyZ2V0KSkge1xuICAgICAgICAgICAgLy8gaWYgaGFuZGxlciBpcyBhbGxvd2VkIG5vdCB0byByZXBvcnQgb3duRW51bWVyYWJsZVByb3AgYXMgYW4gb3duXG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSwgd2UgY2Fubm90IGd1YXJhbnRlZSB0aGF0IGl0IHdpbGwgbmV2ZXIgcmVwb3J0IGl0IGFzXG4gICAgICAgICAgICAvLyBhbiBvd24gcHJvcGVydHkgbGF0ZXIuIE9uY2UgYSBwcm9wZXJ0eSBoYXMgYmVlbiByZXBvcnRlZCBhc1xuICAgICAgICAgICAgLy8gbm9uLWV4aXN0ZW50IG9uIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0LCBpdCBzaG91bGQgZm9yZXZlciBiZVxuICAgICAgICAgICAgLy8gcmVwb3J0ZWQgYXMgbm9uLWV4aXN0ZW50XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHJlcG9ydCBleGlzdGluZyBvd24gcHJvcGVydHkgJ1wiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25FbnVtZXJhYmxlUHJvcCtcIicgYXMgbm9uLWV4aXN0ZW50IG9uIGEgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9uLWV4dGVuc2libGUgb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICAqL1xuICBcbiAgLyoqXG4gICAqIE5ldyB0cmFwIHRoYXQgcmVpZmllcyBbW0NhbGxdXS5cbiAgICogSWYgdGhlIHRhcmdldCBpcyBhIGZ1bmN0aW9uLCB0aGVuIGEgY2FsbCB0b1xuICAgKiAgIHByb3h5KC4uLmFyZ3MpXG4gICAqIFRyaWdnZXJzIHRoaXMgdHJhcFxuICAgKi9cbiAgYXBwbHk6IGZ1bmN0aW9uKHRhcmdldCwgdGhpc0JpbmRpbmcsIGFyZ3MpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImFwcGx5XCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0JpbmRpbmcsIGFyZ3MpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy50YXJnZXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRhcmdldCwgdGhpc0JpbmRpbmcsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXBwbHk6IFwiKyB0YXJnZXQgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIE5ldyB0cmFwIHRoYXQgcmVpZmllcyBbW0NvbnN0cnVjdF1dLlxuICAgKiBJZiB0aGUgdGFyZ2V0IGlzIGEgZnVuY3Rpb24sIHRoZW4gYSBjYWxsIHRvXG4gICAqICAgbmV3IHByb3h5KC4uLmFyZ3MpXG4gICAqIFRyaWdnZXJzIHRoaXMgdHJhcFxuICAgKi9cbiAgY29uc3RydWN0OiBmdW5jdGlvbih0YXJnZXQsIGFyZ3MsIG5ld1RhcmdldCkge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwiY29uc3RydWN0XCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1RhcmdldCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5ldzogXCIrIHRhcmdldCArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cblxuICAgIGlmIChuZXdUYXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3VGFyZ2V0ID0gdGFyZ2V0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIG5ld1RhcmdldCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJuZXc6IFwiKyBuZXdUYXJnZXQgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgIH0gICAgICBcbiAgICB9XG4gICAgcmV0dXJuIHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRhcmdldCwgYXJncywgbmV3VGFyZ2V0KTtcbiAgfVxufTtcblxuLy8gLS0tLSBlbmQgb2YgdGhlIFZhbGlkYXRvciBoYW5kbGVyIHdyYXBwZXIgaGFuZGxlciAtLS0tXG5cbi8vIEluIHdoYXQgZm9sbG93cywgYSAnZGlyZWN0IHByb3h5JyBpcyBhIHByb3h5XG4vLyB3aG9zZSBoYW5kbGVyIGlzIGEgVmFsaWRhdG9yLiBTdWNoIHByb3hpZXMgY2FuIGJlIG1hZGUgbm9uLWV4dGVuc2libGUsXG4vLyBzZWFsZWQgb3IgZnJvemVuIHdpdGhvdXQgbG9zaW5nIHRoZSBhYmlsaXR5IHRvIHRyYXAuXG5cbi8vIG1hcHMgZGlyZWN0IHByb3hpZXMgdG8gdGhlaXIgVmFsaWRhdG9yIGhhbmRsZXJzXG52YXIgZGlyZWN0UHJveGllcyA9IG5ldyBXZWFrTWFwKCk7XG5cbi8vIHBhdGNoIE9iamVjdC57cHJldmVudEV4dGVuc2lvbnMsc2VhbCxmcmVlemV9IHNvIHRoYXRcbi8vIHRoZXkgcmVjb2duaXplIGZpeGFibGUgcHJveGllcyBhbmQgYWN0IGFjY29yZGluZ2x5XG5PYmplY3QucHJldmVudEV4dGVuc2lvbnMgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIHZhciB2aGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHN1YmplY3QpO1xuICBpZiAodmhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh2aGFuZGxlci5wcmV2ZW50RXh0ZW5zaW9ucygpKSB7XG4gICAgICByZXR1cm4gc3ViamVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInByZXZlbnRFeHRlbnNpb25zIG9uIFwiK3N1YmplY3QrXCIgcmVqZWN0ZWRcIik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmltX3ByZXZlbnRFeHRlbnNpb25zKHN1YmplY3QpO1xuICB9XG59O1xuT2JqZWN0LnNlYWwgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIHNldEludGVncml0eUxldmVsKHN1YmplY3QsIFwic2VhbGVkXCIpO1xuICByZXR1cm4gc3ViamVjdDtcbn07XG5PYmplY3QuZnJlZXplID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBzZXRJbnRlZ3JpdHlMZXZlbChzdWJqZWN0LCBcImZyb3plblwiKTtcbiAgcmV0dXJuIHN1YmplY3Q7XG59O1xuT2JqZWN0LmlzRXh0ZW5zaWJsZSA9IE9iamVjdF9pc0V4dGVuc2libGUgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIHZhciB2SGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHN1YmplY3QpO1xuICBpZiAodkhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB2SGFuZGxlci5pc0V4dGVuc2libGUoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJpbV9pc0V4dGVuc2libGUoc3ViamVjdCk7XG4gIH1cbn07XG5PYmplY3QuaXNTZWFsZWQgPSBPYmplY3RfaXNTZWFsZWQgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIHJldHVybiB0ZXN0SW50ZWdyaXR5TGV2ZWwoc3ViamVjdCwgXCJzZWFsZWRcIik7XG59O1xuT2JqZWN0LmlzRnJvemVuID0gT2JqZWN0X2lzRnJvemVuID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICByZXR1cm4gdGVzdEludGVncml0eUxldmVsKHN1YmplY3QsIFwiZnJvemVuXCIpO1xufTtcbk9iamVjdC5nZXRQcm90b3R5cGVPZiA9IE9iamVjdF9nZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgdmFyIHZIYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQoc3ViamVjdCk7XG4gIGlmICh2SGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHZIYW5kbGVyLmdldFByb3RvdHlwZU9mKCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1fZ2V0UHJvdG90eXBlT2Yoc3ViamVjdCk7XG4gIH1cbn07XG5cbi8vIHBhdGNoIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgdG8gZGlyZWN0bHkgY2FsbFxuLy8gdGhlIFZhbGlkYXRvci5wcm90b3R5cGUuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIHRyYXBcbi8vIFRoaXMgaXMgdG8gY2lyY3VtdmVudCBhbiBhc3NlcnRpb24gaW4gdGhlIGJ1aWx0LWluIFByb3h5XG4vLyB0cmFwcGluZyBtZWNoYW5pc20gb2YgdjgsIHdoaWNoIGRpc2FsbG93cyB0aGF0IHRyYXAgdG9cbi8vIHJldHVybiBub24tY29uZmlndXJhYmxlIHByb3BlcnR5IGRlc2NyaXB0b3JzIChhcyBwZXIgdGhlXG4vLyBvbGQgUHJveHkgZGVzaWduKVxuT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uKHN1YmplY3QsIG5hbWUpIHtcbiAgdmFyIHZoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQoc3ViamVjdCk7XG4gIGlmICh2aGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHZoYW5kbGVyLmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJpbV9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc3ViamVjdCwgbmFtZSk7XG4gIH1cbn07XG5cbi8vIHBhdGNoIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0byBkaXJlY3RseSBjYWxsXG4vLyB0aGUgVmFsaWRhdG9yLnByb3RvdHlwZS5kZWZpbmVQcm9wZXJ0eSB0cmFwXG4vLyBUaGlzIGlzIHRvIGNpcmN1bXZlbnQgdHdvIGlzc3VlcyB3aXRoIHRoZSBidWlsdC1pblxuLy8gdHJhcCBtZWNoYW5pc206XG4vLyAxKSB0aGUgY3VycmVudCB0cmFjZW1vbmtleSBpbXBsZW1lbnRhdGlvbiBvZiBwcm94aWVzXG4vLyBhdXRvLWNvbXBsZXRlcyAnZGVzYycsIHdoaWNoIGlzIG5vdCBjb3JyZWN0LiAnZGVzYycgc2hvdWxkIGJlXG4vLyBub3JtYWxpemVkLCBidXQgbm90IGNvbXBsZXRlZC4gQ29uc2lkZXI6XG4vLyBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJveHksICdmb28nLCB7ZW51bWVyYWJsZTpmYWxzZX0pXG4vLyBUaGlzIHRyYXAgd2lsbCByZWNlaXZlIGRlc2MgPVxuLy8gIHt2YWx1ZTp1bmRlZmluZWQsd3JpdGFibGU6ZmFsc2UsZW51bWVyYWJsZTpmYWxzZSxjb25maWd1cmFibGU6ZmFsc2V9XG4vLyBUaGlzIHdpbGwgYWxzbyBzZXQgYWxsIG90aGVyIGF0dHJpYnV0ZXMgdG8gdGhlaXIgZGVmYXVsdCB2YWx1ZSxcbi8vIHdoaWNoIGlzIHVuZXhwZWN0ZWQgYW5kIGRpZmZlcmVudCBmcm9tIFtbRGVmaW5lT3duUHJvcGVydHldXS5cbi8vIEJ1ZyBmaWxlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NjAxMzI5XG4vLyAyKSB0aGUgY3VycmVudCBzcGlkZXJtb25rZXkgaW1wbGVtZW50YXRpb24gZG9lcyBub3Rcbi8vIHRocm93IGFuIGV4Y2VwdGlvbiB3aGVuIHRoaXMgdHJhcCByZXR1cm5zICdmYWxzZScsIGJ1dCBpbnN0ZWFkIHNpbGVudGx5XG4vLyBpZ25vcmVzIHRoZSBvcGVyYXRpb24gKHRoaXMgaXMgcmVnYXJkbGVzcyBvZiBzdHJpY3QtbW9kZSlcbi8vIDJhKSB2OCBkb2VzIHRocm93IGFuIGV4Y2VwdGlvbiBmb3IgdGhpcyBjYXNlLCBidXQgaW5jbHVkZXMgdGhlIHJhdGhlclxuLy8gICAgIHVuaGVscGZ1bCBlcnJvciBtZXNzYWdlOlxuLy8gJ1Byb3h5IGhhbmRsZXIgIzxPYmplY3Q+IHJldHVybmVkIGZhbHNlIGZyb20gJ2RlZmluZVByb3BlcnR5JyB0cmFwJ1xuT2JqZWN0LmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24oc3ViamVjdCwgbmFtZSwgZGVzYykge1xuICB2YXIgdmhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgaWYgKHZoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgbm9ybWFsaXplZERlc2MgPSBub3JtYWxpemVQcm9wZXJ0eURlc2NyaXB0b3IoZGVzYyk7XG4gICAgdmFyIHN1Y2Nlc3MgPSB2aGFuZGxlci5kZWZpbmVQcm9wZXJ0eShuYW1lLCBub3JtYWxpemVkRGVzYyk7XG4gICAgaWYgKHN1Y2Nlc3MgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3QgcmVkZWZpbmUgcHJvcGVydHkgJ1wiK25hbWUrXCInXCIpO1xuICAgIH1cbiAgICByZXR1cm4gc3ViamVjdDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJpbV9kZWZpbmVQcm9wZXJ0eShzdWJqZWN0LCBuYW1lLCBkZXNjKTtcbiAgfVxufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbihzdWJqZWN0LCBkZXNjcykge1xuICB2YXIgdmhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgaWYgKHZoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgbmFtZXMgPSBPYmplY3Qua2V5cyhkZXNjcyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIHZhciBub3JtYWxpemVkRGVzYyA9IG5vcm1hbGl6ZVByb3BlcnR5RGVzY3JpcHRvcihkZXNjc1tuYW1lXSk7XG4gICAgICB2YXIgc3VjY2VzcyA9IHZoYW5kbGVyLmRlZmluZVByb3BlcnR5KG5hbWUsIG5vcm1hbGl6ZWREZXNjKTtcbiAgICAgIGlmIChzdWNjZXNzID09PSBmYWxzZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3QgcmVkZWZpbmUgcHJvcGVydHkgJ1wiK25hbWUrXCInXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3ViamVjdDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJpbV9kZWZpbmVQcm9wZXJ0aWVzKHN1YmplY3QsIGRlc2NzKTtcbiAgfVxufTtcblxuT2JqZWN0LmtleXMgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIHZhciB2SGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHN1YmplY3QpO1xuICBpZiAodkhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBvd25LZXlzID0gdkhhbmRsZXIub3duS2V5cygpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG93bktleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrID0gU3RyaW5nKG93bktleXNbaV0pO1xuICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHN1YmplY3QsIGspO1xuICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUgPT09IHRydWUpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goayk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1fa2V5cyhzdWJqZWN0KTtcbiAgfVxufVxuXG5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyA9IE9iamVjdF9nZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICB2YXIgdkhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdkhhbmRsZXIub3duS2V5cygpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmltX2dldE93blByb3BlcnR5TmFtZXMoc3ViamVjdCk7XG4gIH1cbn1cblxuLy8gZml4ZXMgaXNzdWUgIzcxIChDYWxsaW5nIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoKSBvbiBhIFByb3h5XG4vLyB0aHJvd3MgYW4gZXJyb3IpXG5pZiAocHJpbV9nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgIT09IHVuZGVmaW5lZCkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHZhciB2SGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHN1YmplY3QpO1xuICAgIGlmICh2SGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBhcyB0aGlzIHNoaW0gZG9lcyBub3Qgc3VwcG9ydCBzeW1ib2xzLCBhIFByb3h5IG5ldmVyIGFkdmVydGlzZXNcbiAgICAgIC8vIGFueSBzeW1ib2wtdmFsdWVkIG93biBwcm9wZXJ0aWVzXG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwcmltX2dldE93blByb3BlcnR5U3ltYm9scyhzdWJqZWN0KTtcbiAgICB9XG4gIH07XG59XG5cbi8vIGZpeGVzIGlzc3VlICM3MiAoJ0lsbGVnYWwgYWNjZXNzJyBlcnJvciB3aGVuIHVzaW5nIE9iamVjdC5hc3NpZ24pXG4vLyBPYmplY3QuYXNzaWduIHBvbHlmaWxsIGJhc2VkIG9uIGEgcG9seWZpbGwgcG9zdGVkIG9uIE1ETjogXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9cXFxuLy8gIEdsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cbi8vIE5vdGUgdGhhdCB0aGlzIHBvbHlmaWxsIGRvZXMgbm90IHN1cHBvcnQgU3ltYm9scywgYnV0IHRoaXMgUHJveHkgU2hpbVxuLy8gZG9lcyBub3Qgc3VwcG9ydCBTeW1ib2xzIGFueXdheS5cbmlmIChwcmltX2Fzc2lnbiAhPT0gdW5kZWZpbmVkKSB7XG4gIE9iamVjdC5hc3NpZ24gPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgXG4gICAgLy8gY2hlY2sgaWYgYW55IGFyZ3VtZW50IGlzIGEgcHJveHkgb2JqZWN0XG4gICAgdmFyIG5vUHJveGllcyA9IHRydWU7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2SGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KGFyZ3VtZW50c1tpXSk7XG4gICAgICBpZiAodkhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBub1Byb3hpZXMgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChub1Byb3hpZXMpIHtcbiAgICAgIC8vIG5vdCBhIHNpbmdsZSBhcmd1bWVudCBpcyBhIHByb3h5LCBwZXJmb3JtIGJ1aWx0LWluIGFsZ29yaXRobVxuICAgICAgcmV0dXJuIHByaW1fYXNzaWduLmFwcGx5KE9iamVjdCwgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgXG4gICAgLy8gdGhlcmUgaXMgYXQgbGVhc3Qgb25lIHByb3h5IGFyZ3VtZW50LCB1c2UgdGhlIHBvbHlmaWxsXG4gICAgXG4gICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG4gICAgfVxuXG4gICAgdmFyIG91dHB1dCA9IE9iamVjdCh0YXJnZXQpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UgIT09IHVuZGVmaW5lZCAmJiBzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KG5leHRLZXkpKSB7XG4gICAgICAgICAgICBvdXRwdXRbbmV4dEtleV0gPSBzb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG59XG5cbi8vIHJldHVybnMgd2hldGhlciBhbiBhcmd1bWVudCBpcyBhIHJlZmVyZW5jZSB0byBhbiBvYmplY3QsXG4vLyB3aGljaCBpcyBsZWdhbCBhcyBhIFdlYWtNYXAga2V5LlxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGFyZztcbiAgcmV0dXJuICh0eXBlID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGwpIHx8ICh0eXBlID09PSAnZnVuY3Rpb24nKTtcbn07XG5cbi8vIGEgd3JhcHBlciBmb3IgV2Vha01hcC5nZXQgd2hpY2ggcmV0dXJucyB0aGUgdW5kZWZpbmVkIHZhbHVlXG4vLyBmb3Iga2V5cyB0aGF0IGFyZSBub3Qgb2JqZWN0cyAoaW4gd2hpY2ggY2FzZSB0aGUgdW5kZXJseWluZ1xuLy8gV2Vha01hcCB3b3VsZCBoYXZlIHRocm93biBhIFR5cGVFcnJvcikuXG5mdW5jdGlvbiBzYWZlV2Vha01hcEdldChtYXAsIGtleSkge1xuICByZXR1cm4gaXNPYmplY3Qoa2V5KSA/IG1hcC5nZXQoa2V5KSA6IHVuZGVmaW5lZDtcbn07XG5cbi8vIHJldHVybnMgYSBuZXcgZnVuY3Rpb24gb2YgemVybyBhcmd1bWVudHMgdGhhdCByZWN1cnNpdmVseVxuLy8gdW53cmFwcyBhbnkgcHJveGllcyBzcGVjaWZpZWQgYXMgdGhlIHx0aGlzfC12YWx1ZS5cbi8vIFRoZSBwcmltaXRpdmUgaXMgYXNzdW1lZCB0byBiZSBhIHplcm8tYXJndW1lbnQgbWV0aG9kXG4vLyB0aGF0IHVzZXMgaXRzIHx0aGlzfC1iaW5kaW5nLlxuZnVuY3Rpb24gbWFrZVVud3JhcHBpbmcwQXJnTWV0aG9kKHByaW1pdGl2ZSkge1xuICByZXR1cm4gZnVuY3Rpb24gYnVpbHRpbigpIHtcbiAgICB2YXIgdkhhbmRsZXIgPSBzYWZlV2Vha01hcEdldChkaXJlY3RQcm94aWVzLCB0aGlzKTtcbiAgICBpZiAodkhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGJ1aWx0aW4uY2FsbCh2SGFuZGxlci50YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJpbWl0aXZlLmNhbGwodGhpcyk7XG4gICAgfVxuICB9XG59O1xuXG4vLyByZXR1cm5zIGEgbmV3IGZ1bmN0aW9uIG9mIDEgYXJndW1lbnRzIHRoYXQgcmVjdXJzaXZlbHlcbi8vIHVud3JhcHMgYW55IHByb3hpZXMgc3BlY2lmaWVkIGFzIHRoZSB8dGhpc3wtdmFsdWUuXG4vLyBUaGUgcHJpbWl0aXZlIGlzIGFzc3VtZWQgdG8gYmUgYSAxLWFyZ3VtZW50IG1ldGhvZFxuLy8gdGhhdCB1c2VzIGl0cyB8dGhpc3wtYmluZGluZy5cbmZ1bmN0aW9uIG1ha2VVbndyYXBwaW5nMUFyZ01ldGhvZChwcmltaXRpdmUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGJ1aWx0aW4oYXJnKSB7XG4gICAgdmFyIHZIYW5kbGVyID0gc2FmZVdlYWtNYXBHZXQoZGlyZWN0UHJveGllcywgdGhpcyk7XG4gICAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBidWlsdGluLmNhbGwodkhhbmRsZXIudGFyZ2V0LCBhcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJpbWl0aXZlLmNhbGwodGhpcywgYXJnKTtcbiAgICB9XG4gIH1cbn07XG5cbk9iamVjdC5wcm90b3R5cGUudmFsdWVPZiA9XG4gIG1ha2VVbndyYXBwaW5nMEFyZ01ldGhvZChPYmplY3QucHJvdG90eXBlLnZhbHVlT2YpO1xuT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyA9XG4gIG1ha2VVbndyYXBwaW5nMEFyZ01ldGhvZChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKTtcbkZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyA9XG4gIG1ha2VVbndyYXBwaW5nMEFyZ01ldGhvZChGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcpO1xuRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPVxuICBtYWtlVW53cmFwcGluZzBBcmdNZXRob2QoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcpO1xuXG5PYmplY3QucHJvdG90eXBlLmlzUHJvdG90eXBlT2YgPSBmdW5jdGlvbiBidWlsdGluKGFyZykge1xuICAvLyBidWdmaXggdGhhbmtzIHRvIEJpbGwgTWFyazpcbiAgLy8gYnVpbHQtaW4gaXNQcm90b3R5cGVPZiBkb2VzIG5vdCB1bndyYXAgcHJveGllcyB1c2VkXG4gIC8vIGFzIGFyZ3VtZW50cy4gU28sIHdlIGltcGxlbWVudCB0aGUgYnVpbHRpbiBvdXJzZWx2ZXMsXG4gIC8vIGJhc2VkIG9uIHRoZSBFQ01BU2NyaXB0IDYgc3BlYy4gT3VyIGVuY29kaW5nIHdpbGxcbiAgLy8gbWFrZSBzdXJlIHRoYXQgaWYgYSBwcm94eSBpcyB1c2VkIGFzIGFuIGFyZ3VtZW50LFxuICAvLyBpdHMgZ2V0UHJvdG90eXBlT2YgdHJhcCB3aWxsIGJlIGNhbGxlZC5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICB2YXIgdkhhbmRsZXIyID0gc2FmZVdlYWtNYXBHZXQoZGlyZWN0UHJveGllcywgYXJnKTtcbiAgICBpZiAodkhhbmRsZXIyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFyZyA9IHZIYW5kbGVyMi5nZXRQcm90b3R5cGVPZigpO1xuICAgICAgaWYgKGFyZyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKHNhbWVWYWx1ZShhcmcsIHRoaXMpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJpbV9pc1Byb3RvdHlwZU9mLmNhbGwodGhpcywgYXJnKTtcbiAgICB9XG4gIH1cbn07XG5cbkFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIHZhciB2SGFuZGxlciA9IHNhZmVXZWFrTWFwR2V0KGRpcmVjdFByb3hpZXMsIHN1YmplY3QpO1xuICBpZiAodkhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZIYW5kbGVyLnRhcmdldCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1faXNBcnJheShzdWJqZWN0KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gaXNQcm94eUFycmF5KGFyZykge1xuICB2YXIgdkhhbmRsZXIgPSBzYWZlV2Vha01hcEdldChkaXJlY3RQcm94aWVzLCBhcmcpO1xuICBpZiAodkhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZIYW5kbGVyLnRhcmdldCk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBBcnJheS5wcm90b3R5cGUuY29uY2F0IGludGVybmFsbHkgdGVzdHMgd2hldGhlciBvbmUgb2YgaXRzXG4vLyBhcmd1bWVudHMgaXMgYW4gQXJyYXksIGJ5IGNoZWNraW5nIHdoZXRoZXIgW1tDbGFzc11dID09IFwiQXJyYXlcIlxuLy8gQXMgc3VjaCwgaXQgd2lsbCBmYWlsIHRvIHJlY29nbml6ZSBwcm94aWVzLWZvci1hcnJheXMgYXMgYXJyYXlzLlxuLy8gV2UgcGF0Y2ggQXJyYXkucHJvdG90eXBlLmNvbmNhdCBzbyB0aGF0IGl0IFwidW53cmFwc1wiIHByb3hpZXMtZm9yLWFycmF5c1xuLy8gYnkgbWFraW5nIGEgY29weS4gVGhpcyB3aWxsIHRyaWdnZXIgdGhlIGV4YWN0IHNhbWUgc2VxdWVuY2Ugb2Zcbi8vIHRyYXBzIG9uIHRoZSBwcm94eS1mb3ItYXJyYXkgYXMgaWYgd2Ugd291bGQgbm90IGhhdmUgdW53cmFwcGVkIGl0LlxuLy8gU2VlIDxodHRwczovL2dpdGh1Yi5jb20vdHZjdXRzZW0vaGFybW9ueS1yZWZsZWN0L2lzc3Vlcy8xOT4gZm9yIG1vcmUuXG5BcnJheS5wcm90b3R5cGUuY29uY2F0ID0gZnVuY3Rpb24oLyouLi5hcmdzKi8pIHtcbiAgdmFyIGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaXNQcm94eUFycmF5KGFyZ3VtZW50c1tpXSkpIHtcbiAgICAgIGxlbmd0aCA9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gICAgICBhcmd1bWVudHNbaV0gPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHNbaV0sIDAsIGxlbmd0aCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwcmltX2NvbmNhdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuLy8gc2V0UHJvdG90eXBlT2Ygc3VwcG9ydCBvbiBwbGF0Zm9ybXMgdGhhdCBzdXBwb3J0IF9fcHJvdG9fX1xuXG52YXIgcHJpbV9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZjtcblxuLy8gcGF0Y2ggYW5kIGV4dHJhY3Qgb3JpZ2luYWwgX19wcm90b19fIHNldHRlclxudmFyIF9fcHJvdG9fX3NldHRlciA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHByb3RvRGVzYyA9IHByaW1fZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE9iamVjdC5wcm90b3R5cGUsJ19fcHJvdG9fXycpO1xuICBpZiAocHJvdG9EZXNjID09PSB1bmRlZmluZWQgfHxcbiAgICAgIHR5cGVvZiBwcm90b0Rlc2Muc2V0ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwic2V0UHJvdG90eXBlT2Ygbm90IHN1cHBvcnRlZCBvbiB0aGlzIHBsYXRmb3JtXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNlZSBpZiB3ZSBjYW4gYWN0dWFsbHkgbXV0YXRlIGEgcHJvdG90eXBlIHdpdGggdGhlIGdlbmVyaWMgc2V0dGVyXG4gIC8vIChlLmcuIENocm9tZSB2MjggZG9lc24ndCBhbGxvdyBzZXR0aW5nIF9fcHJvdG9fXyB2aWEgdGhlIGdlbmVyaWMgc2V0dGVyKVxuICB0cnkge1xuICAgIHByb3RvRGVzYy5zZXQuY2FsbCh7fSx7fSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwic2V0UHJvdG90eXBlT2Ygbm90IHN1cHBvcnRlZCBvbiB0aGlzIHBsYXRmb3JtXCIpO1xuICAgIH1cbiAgfVxuXG4gIHByaW1fZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycsIHtcbiAgICBzZXQ6IGZ1bmN0aW9uKG5ld1Byb3RvKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIE9iamVjdChuZXdQcm90bykpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHByb3RvRGVzYy5zZXQ7XG59KCkpO1xuXG5PYmplY3Quc2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbih0YXJnZXQsIG5ld1Byb3RvKSB7XG4gIHZhciBoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQodGFyZ2V0KTtcbiAgaWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChoYW5kbGVyLnNldFByb3RvdHlwZU9mKG5ld1Byb3RvKSkge1xuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInByb3h5IHJlamVjdGVkIHByb3RvdHlwZSBtdXRhdGlvblwiKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFPYmplY3RfaXNFeHRlbnNpYmxlKHRhcmdldCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBzZXQgcHJvdG90eXBlIG9uIG5vbi1leHRlbnNpYmxlIG9iamVjdDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQpO1xuICAgIH1cbiAgICBpZiAocHJpbV9zZXRQcm90b3R5cGVPZilcbiAgICAgIHJldHVybiBwcmltX3NldFByb3RvdHlwZU9mKHRhcmdldCwgbmV3UHJvdG8pO1xuXG4gICAgaWYgKE9iamVjdChuZXdQcm90bykgIT09IG5ld1Byb3RvIHx8IG5ld1Byb3RvID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Byb3RvKTtcbiAgICAgIC8vIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm90b3R5cGUgbXVzdCBiZSBhbiBvYmplY3Qgb3IgbnVsbFwiKVxuICAgIH1cbiAgICBfX3Byb3RvX19zZXR0ZXIuY2FsbCh0YXJnZXQsIG5ld1Byb3RvKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG59XG5cbk9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBoYW5kbGVyID0gc2FmZVdlYWtNYXBHZXQoZGlyZWN0UHJveGllcywgdGhpcyk7XG4gIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZGVzYyA9IGhhbmRsZXIuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5hbWUpO1xuICAgIHJldHVybiBkZXNjICE9PSB1bmRlZmluZWQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1faGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLCBuYW1lKTtcbiAgfVxufVxuXG4vLyA9PT09PT09PT09PT09IFJlZmxlY3Rpb24gbW9kdWxlID09PT09PT09PT09PT1cbi8vIHNlZSBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OnJlZmxlY3RfYXBpXG5cbnZhciBSZWZsZWN0ID0gZ2xvYmFsLlJlZmxlY3QgPSB7XG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZnVuY3Rpb24odGFyZ2V0LCBuYW1lKSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgfSxcbiAgZGVmaW5lUHJvcGVydHk6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgZGVzYykge1xuXG4gICAgLy8gaWYgdGFyZ2V0IGlzIGEgcHJveHksIGludm9rZSBpdHMgXCJkZWZpbmVQcm9wZXJ0eVwiIHRyYXBcbiAgICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gICAgaWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjKTtcbiAgICB9XG5cbiAgICAvLyBJbXBsZW1lbnRhdGlvbiB0cmFuc2xpdGVyYXRlZCBmcm9tIFtbRGVmaW5lT3duUHJvcGVydHldXVxuICAgIC8vIHNlZSBFUzUuMSBzZWN0aW9uIDguMTIuOVxuICAgIC8vIHRoaXMgaXMgdGhlIF9leGFjdCBzYW1lIGFsZ29yaXRobV8gYXMgdGhlIGlzQ29tcGF0aWJsZURlc2NyaXB0b3JcbiAgICAvLyBhbGdvcml0aG0gZGVmaW5lZCBhYm92ZSwgZXhjZXB0IHRoYXQgYXQgZXZlcnkgcGxhY2UgaXRcbiAgICAvLyByZXR1cm5zIHRydWUsIHRoaXMgYWxnb3JpdGhtIGFjdHVhbGx5IGRvZXMgZGVmaW5lIHRoZSBwcm9wZXJ0eS5cbiAgICB2YXIgY3VycmVudCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICB2YXIgZXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcbiAgICBpZiAoY3VycmVudCA9PT0gdW5kZWZpbmVkICYmIGV4dGVuc2libGUgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChjdXJyZW50ID09PSB1bmRlZmluZWQgJiYgZXh0ZW5zaWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzYyk7IC8vIHNob3VsZCBuZXZlciBmYWlsXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzRW1wdHlEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzRXF1aXZhbGVudERlc2NyaXB0b3IoY3VycmVudCwgZGVzYykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoZGVzYy5jb25maWd1cmFibGUgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCdlbnVtZXJhYmxlJyBpbiBkZXNjICYmIGRlc2MuZW51bWVyYWJsZSAhPT0gY3VycmVudC5lbnVtZXJhYmxlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzR2VuZXJpY0Rlc2NyaXB0b3IoZGVzYykpIHtcbiAgICAgIC8vIG5vIGZ1cnRoZXIgdmFsaWRhdGlvbiBuZWNlc3NhcnlcbiAgICB9IGVsc2UgaWYgKGlzRGF0YURlc2NyaXB0b3IoY3VycmVudCkgIT09IGlzRGF0YURlc2NyaXB0b3IoZGVzYykpIHtcbiAgICAgIGlmIChjdXJyZW50LmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNEYXRhRGVzY3JpcHRvcihjdXJyZW50KSAmJiBpc0RhdGFEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChjdXJyZW50LndyaXRhYmxlID09PSBmYWxzZSAmJiBkZXNjLndyaXRhYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50LndyaXRhYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MgJiYgIXNhbWVWYWx1ZShkZXNjLnZhbHVlLCBjdXJyZW50LnZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNBY2Nlc3NvckRlc2NyaXB0b3IoY3VycmVudCkgJiYgaXNBY2Nlc3NvckRlc2NyaXB0b3IoZGVzYykpIHtcbiAgICAgIGlmIChjdXJyZW50LmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCdzZXQnIGluIGRlc2MgJiYgIXNhbWVWYWx1ZShkZXNjLnNldCwgY3VycmVudC5zZXQpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgnZ2V0JyBpbiBkZXNjICYmICFzYW1lVmFsdWUoZGVzYy5nZXQsIGN1cnJlbnQuZ2V0KSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjKTsgLy8gc2hvdWxkIG5ldmVyIGZhaWxcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSkge1xuICAgIHZhciBoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQodGFyZ2V0KTtcbiAgICBpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlci5kZWxldGUobmFtZSk7XG4gICAgfVxuICAgIFxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpO1xuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoZGVzYy5jb25maWd1cmFibGUgPT09IHRydWUpIHtcbiAgICAgIGRlbGV0ZSB0YXJnZXRbbmFtZV07XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlOyAgICBcbiAgfSxcbiAgZ2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgfSxcbiAgc2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uKHRhcmdldCwgbmV3UHJvdG8pIHtcbiAgICBcbiAgICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gICAgaWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuc2V0UHJvdG90eXBlT2YobmV3UHJvdG8pO1xuICAgIH1cbiAgICBcbiAgICBpZiAoT2JqZWN0KG5ld1Byb3RvKSAhPT0gbmV3UHJvdG8gfHwgbmV3UHJvdG8gPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgcHJvdG90eXBlIG1heSBvbmx5IGJlIGFuIE9iamVjdCBvciBudWxsOiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgbmV3UHJvdG8pO1xuICAgIH1cbiAgICBcbiAgICBpZiAoIU9iamVjdF9pc0V4dGVuc2libGUodGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICB2YXIgY3VycmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuICAgIGlmIChzYW1lVmFsdWUoY3VycmVudCwgbmV3UHJvdG8pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHByaW1fc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHByaW1fc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBuZXdQcm90byk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX19wcm90b19fc2V0dGVyLmNhbGwodGFyZ2V0LCBuZXdQcm90byk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIHByZXZlbnRFeHRlbnNpb25zOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gICAgaWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIucHJldmVudEV4dGVuc2lvbnMoKTtcbiAgICB9XG4gICAgcHJpbV9wcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBpc0V4dGVuc2libGU6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG4gIH0sXG4gIGhhczogZnVuY3Rpb24odGFyZ2V0LCBuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUgaW4gdGFyZ2V0O1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgcmVjZWl2ZXIpIHtcbiAgICByZWNlaXZlciA9IHJlY2VpdmVyIHx8IHRhcmdldDtcblxuICAgIC8vIGlmIHRhcmdldCBpcyBhIHByb3h5LCBpbnZva2UgaXRzIFwiZ2V0XCIgdHJhcFxuICAgIHZhciBoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQodGFyZ2V0KTtcbiAgICBpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlci5nZXQocmVjZWl2ZXIsIG5hbWUpO1xuICAgIH1cblxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpO1xuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuICAgICAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gUmVmbGVjdC5nZXQocHJvdG8sIG5hbWUsIHJlY2VpdmVyKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0YURlc2NyaXB0b3IoZGVzYykpIHtcbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH1cbiAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG4gICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7XG4gIH0sXG4gIC8vIFJlZmxlY3Quc2V0IGltcGxlbWVudGF0aW9uIGJhc2VkIG9uIGxhdGVzdCB2ZXJzaW9uIG9mIFtbU2V0UF1dIGF0XG4gIC8vIGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6cHJvdG9fY2xpbWJpbmdfcmVmYWN0b3JpbmdcbiAgc2V0OiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIHZhbHVlLCByZWNlaXZlcikge1xuICAgIHJlY2VpdmVyID0gcmVjZWl2ZXIgfHwgdGFyZ2V0O1xuXG4gICAgLy8gaWYgdGFyZ2V0IGlzIGEgcHJveHksIGludm9rZSBpdHMgXCJzZXRcIiB0cmFwXG4gICAgdmFyIGhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldCh0YXJnZXQpO1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLnNldChyZWNlaXZlciwgbmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIC8vIGZpcnN0LCBjaGVjayB3aGV0aGVyIHRhcmdldCBoYXMgYSBub24td3JpdGFibGUgcHJvcGVydHlcbiAgICAvLyBzaGFkb3dpbmcgbmFtZSBvbiByZWNlaXZlclxuICAgIHZhciBvd25EZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpO1xuXG4gICAgaWYgKG93bkRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gbmFtZSBpcyBub3QgZGVmaW5lZCBpbiB0YXJnZXQsIHNlYXJjaCB0YXJnZXQncyBwcm90b3R5cGVcbiAgICAgIHZhciBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuXG4gICAgICBpZiAocHJvdG8gIT09IG51bGwpIHtcbiAgICAgICAgLy8gY29udGludWUgdGhlIHNlYXJjaCBpbiB0YXJnZXQncyBwcm90b3R5cGVcbiAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHByb3RvLCBuYW1lLCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXYxNiBjaGFuZ2UuIENmLiBodHRwczovL2J1Z3MuZWNtYXNjcmlwdC5vcmcvc2hvd19idWcuY2dpP2lkPTE1NDlcbiAgICAgIC8vIHRhcmdldCB3YXMgdGhlIGxhc3QgcHJvdG90eXBlLCBub3cgd2Uga25vdyB0aGF0ICduYW1lJyBpcyBub3Qgc2hhZG93ZWRcbiAgICAgIC8vIGJ5IGFuIGV4aXN0aW5nIChhY2Nlc3NvciBvciBkYXRhKSBwcm9wZXJ0eSwgc28gd2UgY2FuIGFkZCB0aGUgcHJvcGVydHlcbiAgICAgIC8vIHRvIHRoZSBpbml0aWFsIHJlY2VpdmVyIG9iamVjdFxuICAgICAgLy8gKHRoaXMgYnJhbmNoIHdpbGwgaW50ZW50aW9uYWxseSBmYWxsIHRocm91Z2ggdG8gdGhlIGNvZGUgYmVsb3cpXG4gICAgICBvd25EZXNjID1cbiAgICAgICAgeyB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlIH07XG4gICAgfVxuXG4gICAgLy8gd2Ugbm93IGtub3cgdGhhdCBvd25EZXNjICE9PSB1bmRlZmluZWRcbiAgICBpZiAoaXNBY2Nlc3NvckRlc2NyaXB0b3Iob3duRGVzYykpIHtcbiAgICAgIHZhciBzZXR0ZXIgPSBvd25EZXNjLnNldDtcbiAgICAgIGlmIChzZXR0ZXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgc2V0dGVyLmNhbGwocmVjZWl2ZXIsIHZhbHVlKTsgLy8gYXNzdW1lcyBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIG90aGVyd2lzZSwgaXNEYXRhRGVzY3JpcHRvcihvd25EZXNjKSBtdXN0IGJlIHRydWVcbiAgICBpZiAob3duRGVzYy53cml0YWJsZSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAvLyB3ZSBmb3VuZCBhbiBleGlzdGluZyB3cml0YWJsZSBkYXRhIHByb3BlcnR5IG9uIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gICAgLy8gTm93IHVwZGF0ZSBvciBhZGQgdGhlIGRhdGEgcHJvcGVydHkgb24gdGhlIHJlY2VpdmVyLCBkZXBlbmRpbmcgb25cbiAgICAvLyB3aGV0aGVyIHRoZSByZWNlaXZlciBhbHJlYWR5IGRlZmluZXMgdGhlIHByb3BlcnR5IG9yIG5vdC5cbiAgICB2YXIgZXhpc3RpbmdEZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihyZWNlaXZlciwgbmFtZSk7XG4gICAgaWYgKGV4aXN0aW5nRGVzYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgdXBkYXRlRGVzYyA9XG4gICAgICAgIHsgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgIC8vIEZJWE1FOiBpdCBzaG91bGQgbm90IGJlIG5lY2Vzc2FyeSB0byBkZXNjcmliZSB0aGUgZm9sbG93aW5nXG4gICAgICAgICAgLy8gYXR0cmlidXRlcy4gQWRkZWQgdG8gY2lyY3VtdmVudCBhIGJ1ZyBpbiB0cmFjZW1vbmtleTpcbiAgICAgICAgICAvLyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02MDEzMjlcbiAgICAgICAgICB3cml0YWJsZTogICAgIGV4aXN0aW5nRGVzYy53cml0YWJsZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiAgIGV4aXN0aW5nRGVzYy5lbnVtZXJhYmxlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZXhpc3RpbmdEZXNjLmNvbmZpZ3VyYWJsZSB9O1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlY2VpdmVyLCBuYW1lLCB1cGRhdGVEZXNjKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIU9iamVjdC5pc0V4dGVuc2libGUocmVjZWl2ZXIpKSByZXR1cm4gZmFsc2U7XG4gICAgICB2YXIgbmV3RGVzYyA9XG4gICAgICAgIHsgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlIH07XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVjZWl2ZXIsIG5hbWUsIG5ld0Rlc2MpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LFxuICAvKmludm9rZTogZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCBhcmdzLCByZWNlaXZlcikge1xuICAgIHJlY2VpdmVyID0gcmVjZWl2ZXIgfHwgdGFyZ2V0O1xuXG4gICAgdmFyIGhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldCh0YXJnZXQpO1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLmludm9rZShyZWNlaXZlciwgbmFtZSwgYXJncyk7XG4gICAgfVxuXG4gICAgdmFyIGZ1biA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgcmVjZWl2ZXIpO1xuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChmdW4sIHJlY2VpdmVyLCBhcmdzKTtcbiAgfSwqL1xuICBlbnVtZXJhdGU6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIHZhciBoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQodGFyZ2V0KTtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGhhbmRsZXIuZW51bWVyYXRlIHNob3VsZCByZXR1cm4gYW4gaXRlcmF0b3IgZGlyZWN0bHksIGJ1dCB0aGVcbiAgICAgIC8vIGl0ZXJhdG9yIGdldHMgY29udmVydGVkIHRvIGFuIGFycmF5IGZvciBiYWNrd2FyZC1jb21wYXQgcmVhc29ucyxcbiAgICAgIC8vIHNvIHdlIG11c3QgcmUtaXRlcmF0ZSBvdmVyIHRoZSBhcnJheVxuICAgICAgcmVzdWx0ID0gaGFuZGxlci5lbnVtZXJhdGUoaGFuZGxlci50YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBbXTtcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gdGFyZ2V0KSB7IHJlc3VsdC5wdXNoKG5hbWUpOyB9OyAgICAgIFxuICAgIH1cbiAgICB2YXIgbCA9ICtyZXN1bHQubGVuZ3RoO1xuICAgIHZhciBpZHggPSAwO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGlkeCA9PT0gbCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9O1xuICAgICAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IHJlc3VsdFtpZHgrK10gfTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICAvLyBpbXBlcmZlY3Qgb3duS2V5cyBpbXBsZW1lbnRhdGlvbjogaW4gRVM2LCBzaG91bGQgYWxzbyBpbmNsdWRlXG4gIC8vIHN5bWJvbC1rZXllZCBwcm9wZXJ0aWVzLlxuICBvd25LZXlzOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0X2dldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgfSxcbiAgYXBwbHk6IGZ1bmN0aW9uKHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpIHtcbiAgICAvLyB0YXJnZXQuYXBwbHkocmVjZWl2ZXIsIGFyZ3MpXG4gICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpO1xuICB9LFxuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uKHRhcmdldCwgYXJncywgbmV3VGFyZ2V0KSB7XG4gICAgLy8gcmV0dXJuIG5ldyB0YXJnZXQoLi4uYXJncyk7XG5cbiAgICAvLyBpZiB0YXJnZXQgaXMgYSBwcm94eSwgaW52b2tlIGl0cyBcImNvbnN0cnVjdFwiIHRyYXBcbiAgICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gICAgaWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuY29uc3RydWN0KGhhbmRsZXIudGFyZ2V0LCBhcmdzLCBuZXdUYXJnZXQpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwidGFyZ2V0IGlzIG5vdCBhIGZ1bmN0aW9uOiBcIiArIHRhcmdldCk7XG4gICAgfVxuICAgIGlmIChuZXdUYXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3VGFyZ2V0ID0gdGFyZ2V0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIG5ld1RhcmdldCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJuZXdUYXJnZXQgaXMgbm90IGEgZnVuY3Rpb246IFwiICsgdGFyZ2V0KTtcbiAgICAgIH0gICAgICBcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IChGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseShuZXdUYXJnZXQsIFtudWxsXS5jb25jYXQoYXJncykpKTtcbiAgfVxufTtcblxuLy8gZmVhdHVyZS10ZXN0IHdoZXRoZXIgdGhlIFByb3h5IGdsb2JhbCBleGlzdHMsIHdpdGhcbi8vIHRoZSBoYXJtb255LWVyYSBQcm94eS5jcmVhdGUgQVBJXG5pZiAodHlwZW9mIFByb3h5ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgdHlwZW9mIFByb3h5LmNyZWF0ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuXG4gIHZhciBwcmltQ3JlYXRlID0gUHJveHkuY3JlYXRlLFxuICAgICAgcHJpbUNyZWF0ZUZ1bmN0aW9uID0gUHJveHkuY3JlYXRlRnVuY3Rpb247XG5cbiAgdmFyIHJldm9rZWRIYW5kbGVyID0gcHJpbUNyZWF0ZSh7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcInByb3h5IGlzIHJldm9rZWRcIik7IH1cbiAgfSk7XG5cbiAgZ2xvYmFsLlByb3h5ID0gZnVuY3Rpb24odGFyZ2V0LCBoYW5kbGVyKSB7XG4gICAgLy8gY2hlY2sgdGhhdCB0YXJnZXQgaXMgYW4gT2JqZWN0XG4gICAgaWYgKE9iamVjdCh0YXJnZXQpICE9PSB0YXJnZXQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm94eSB0YXJnZXQgbXVzdCBiZSBhbiBPYmplY3QsIGdpdmVuIFwiK3RhcmdldCk7XG4gICAgfVxuICAgIC8vIGNoZWNrIHRoYXQgaGFuZGxlciBpcyBhbiBPYmplY3RcbiAgICBpZiAoT2JqZWN0KGhhbmRsZXIpICE9PSBoYW5kbGVyKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJveHkgaGFuZGxlciBtdXN0IGJlIGFuIE9iamVjdCwgZ2l2ZW4gXCIraGFuZGxlcik7XG4gICAgfVxuXG4gICAgdmFyIHZIYW5kbGVyID0gbmV3IFZhbGlkYXRvcih0YXJnZXQsIGhhbmRsZXIpO1xuICAgIHZhciBwcm94eTtcbiAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBwcm94eSA9IHByaW1DcmVhdGVGdW5jdGlvbih2SGFuZGxlcixcbiAgICAgICAgLy8gY2FsbCB0cmFwXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gdkhhbmRsZXIuYXBwbHkodGFyZ2V0LCB0aGlzLCBhcmdzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gY29uc3RydWN0IHRyYXBcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgIHJldHVybiB2SGFuZGxlci5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3h5ID0gcHJpbUNyZWF0ZSh2SGFuZGxlciwgT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCkpO1xuICAgIH1cbiAgICBkaXJlY3RQcm94aWVzLnNldChwcm94eSwgdkhhbmRsZXIpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcblxuICBnbG9iYWwuUHJveHkucmV2b2NhYmxlID0gZnVuY3Rpb24odGFyZ2V0LCBoYW5kbGVyKSB7XG4gICAgdmFyIHByb3h5ID0gbmV3IFByb3h5KHRhcmdldCwgaGFuZGxlcik7XG4gICAgdmFyIHJldm9rZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZIYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQocHJveHkpO1xuICAgICAgaWYgKHZIYW5kbGVyICE9PSBudWxsKSB7XG4gICAgICAgIHZIYW5kbGVyLnRhcmdldCAgPSBudWxsO1xuICAgICAgICB2SGFuZGxlci5oYW5kbGVyID0gcmV2b2tlZEhhbmRsZXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgcmV0dXJuIHtwcm94eTogcHJveHksIHJldm9rZTogcmV2b2tlfTtcbiAgfVxuICBcbiAgLy8gYWRkIHRoZSBvbGQgUHJveHkuY3JlYXRlIGFuZCBQcm94eS5jcmVhdGVGdW5jdGlvbiBtZXRob2RzXG4gIC8vIHNvIG9sZCBjb2RlIHRoYXQgc3RpbGwgZGVwZW5kcyBvbiB0aGUgaGFybW9ueS1lcmEgUHJveHkgb2JqZWN0XG4gIC8vIGlzIG5vdCBicm9rZW4uIEFsc28gZW5zdXJlcyB0aGF0IG11bHRpcGxlIHZlcnNpb25zIG9mIHRoaXNcbiAgLy8gbGlicmFyeSBzaG91bGQgbG9hZCBmaW5lXG4gIGdsb2JhbC5Qcm94eS5jcmVhdGUgPSBwcmltQ3JlYXRlO1xuICBnbG9iYWwuUHJveHkuY3JlYXRlRnVuY3Rpb24gPSBwcmltQ3JlYXRlRnVuY3Rpb247XG5cbn0gZWxzZSB7XG4gIC8vIFByb3h5IGdsb2JhbCBub3QgZGVmaW5lZCwgb3Igb2xkIEFQSSBub3QgYXZhaWxhYmxlXG4gIGlmICh0eXBlb2YgUHJveHkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAvLyBQcm94eSBnbG9iYWwgbm90IGRlZmluZWQsIGFkZCBhIFByb3h5IGZ1bmN0aW9uIHN0dWJcbiAgICBnbG9iYWwuUHJveHkgPSBmdW5jdGlvbihfdGFyZ2V0LCBfaGFuZGxlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicHJveGllcyBub3Qgc3VwcG9ydGVkIG9uIHRoaXMgcGxhdGZvcm0uIE9uIHY4L25vZGUvaW9qcywgbWFrZSBzdXJlIHRvIHBhc3MgdGhlIC0taGFybW9ueV9wcm94aWVzIGZsYWdcIik7XG4gICAgfTtcbiAgfVxuICAvLyBQcm94eSBnbG9iYWwgZGVmaW5lZCBidXQgb2xkIEFQSSBub3QgYXZhaWxhYmxlXG4gIC8vIHByZXN1bWFibHkgUHJveHkgZ2xvYmFsIGFscmVhZHkgc3VwcG9ydHMgbmV3IEFQSSwgbGVhdmUgdW50b3VjaGVkXG59XG5cbi8vIGZvciBub2RlLmpzIG1vZHVsZXMsIGV4cG9ydCBldmVyeSBwcm9wZXJ0eSBpbiB0aGUgUmVmbGVjdCBvYmplY3Rcbi8vIGFzIHBhcnQgb2YgdGhlIG1vZHVsZSBpbnRlcmZhY2VcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgT2JqZWN0LmtleXMoUmVmbGVjdCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgZXhwb3J0c1trZXldID0gUmVmbGVjdFtrZXldO1xuICB9KTtcbn1cblxuLy8gZnVuY3Rpb24tYXMtbW9kdWxlIHBhdHRlcm5cbn0odHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdGhpcykpOyJdfQ==
