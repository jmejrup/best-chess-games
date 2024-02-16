"use strict";
(self["webpackChunkbest_chess_games"] = self["webpackChunkbest_chess_games"] || []).push([["openings"],{

/***/ "./node_modules/css-loader/dist/cjs.js!./src/pages/openings/openings.css":
/*!*******************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/pages/openings/openings.css ***!
  \*******************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body{padding:0;margin:0;}`, "",{"version":3,"sources":["webpack://./src/pages/openings/openings.css"],"names":[],"mappings":"AAAA,KAAK,SAAS,CAAC,QAAQ,CAAC","sourcesContent":["body{padding:0;margin:0;}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/pages/openings/openings.css":
/*!*****************************************!*\
  !*** ./src/pages/openings/openings.css ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_openings_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./openings.css */ "./node_modules/css-loader/dist/cjs.js!./src/pages/openings/openings.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_openings_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_openings_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_openings_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_openings_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/components/v2/chessboard/Chessboard.ts":
/*!****************************************************!*\
  !*** ./src/components/v2/chessboard/Chessboard.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BoardLayer_1 = __importDefault(__webpack_require__(/*! ./Layers/BoardLayer */ "./src/components/v2/chessboard/Layers/BoardLayer.ts"));
const CordsLayer_1 = __importDefault(__webpack_require__(/*! ./Layers/CordsLayer */ "./src/components/v2/chessboard/Layers/CordsLayer.ts"));
const PieceLayer_1 = __importDefault(__webpack_require__(/*! ./Layers/PieceLayer */ "./src/components/v2/chessboard/Layers/PieceLayer.ts"));
const ArrowLayer_1 = __importDefault(__webpack_require__(/*! ./Layers/ArrowLayer */ "./src/components/v2/chessboard/Layers/ArrowLayer.ts"));
const MouseLayer_1 = __importDefault(__webpack_require__(/*! ./Layers/MouseLayer */ "./src/components/v2/chessboard/Layers/MouseLayer.ts"));
const Shared_1 = __importDefault(__webpack_require__(/*! ./Shared */ "./src/components/v2/chessboard/Shared.ts"));
class Chessboard {
    constructor(chessContainer, fen, isRotated) {
        this.isRotated = false;
        this.boardLayer = new BoardLayer_1.default(isRotated);
        this.svgRoot = this.boardLayer.svgRoot;
        chessContainer.appendChild(this.svgRoot);
        this.mouseLayer = new MouseLayer_1.default(this.svgRoot);
        this.cordsLayer = new CordsLayer_1.default(this.svgRoot, isRotated);
        this.pieceLayer = new PieceLayer_1.default(this.svgRoot, this.boardLayer, this.mouseLayer);
        this.arrowLayer = new ArrowLayer_1.default(this.svgRoot);
        this.mouseLayer.init();
        this.setFen(fen, false);
    }
    test() {
        this.rotate();
    }
    rotate() {
        this.isRotated = !this.isRotated;
        this.boardLayer.rotate(this.isRotated);
        this.cordsLayer.rotate(this.isRotated);
        this.pieceLayer.rotate(this.isRotated);
        this.arrowLayer.rotate(this.isRotated);
    }
    setFen(fen, clearFirst) {
        if (clearFirst) {
            this.pieceLayer.clear();
            // Object.values(this.whiteCaptures).concat(Object.values(this.blackCaptures)).forEach(element =>{
            //     element.innerHTML = "";
            // });
            // this.pieceElements = [];
            // this.setScore(0);
        }
        if (fen !== "") {
            if (fen.toLowerCase() === "start")
                fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
            fen = fen.split(" ")[0].split("/").join("");
            let squareIndex = 0;
            for (let i = 0; i < fen.length; i++) {
                let fenChar = fen[i];
                let nummericValue = parseInt(fenChar);
                if (!isNaN(nummericValue)) {
                    squareIndex += nummericValue;
                }
                else {
                    let key = Shared_1.default.getSquareKeyByIndex(squareIndex++, this.isRotated);
                    this.pieceLayer.addPiece(fenChar, key);
                }
            }
        }
    }
}
exports["default"] = Chessboard;


/***/ }),

/***/ "./src/components/v2/chessboard/Layers/ArrowLayer.ts":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/Layers/ArrowLayer.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Shared_1 = __importDefault(__webpack_require__(/*! ../Shared */ "./src/components/v2/chessboard/Shared.ts"));
class ArrowLayer {
    constructor(svgRoot) {
        this.strokeWidth = 20;
        this.rightClickedSquareKey = null;
        this.isRotated = false;
        this.currentArrows = [];
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svgRoot.appendChild(group);
        this.svgRoot = svgRoot;
        this.group = group;
        this.svgRoot.addEventListener("mousedown", (event) => {
            let isRightClick = event.button && event.button == 2;
            if (isRightClick) {
                let rect = event.target;
                let index = parseInt(rect.getAttribute("data-index"));
                let squareKey = Shared_1.default.getSquareKeyByIndex(index, this.isRotated);
                this.onRightButtonDown(squareKey);
            }
            else {
                this.onLeftButtonDown(event);
            }
            event.preventDefault();
        });
        this.svgRoot.addEventListener("mouseup", (event) => {
            let isRightClick = event.button && event.button == 2;
            if (isRightClick) {
                let rect = event.target;
                let index = parseInt(rect.getAttribute("data-index"));
                let squareKey = Shared_1.default.getSquareKeyByIndex(index, this.isRotated);
                this.onRightButtonUp(squareKey);
                event.preventDefault();
            }
        });
        this.svgRoot.addEventListener("contextmenu", (event) => event.preventDefault());
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
        this.group.innerHTML = "";
        this.currentArrows.forEach(arrow => {
            this.drawArrow(arrow.from, arrow.to);
        });
    }
    onLeftButtonDown(event) {
        this.group.innerHTML = "";
        this.currentArrows = [];
    }
    onRightButtonDown(squareKey) {
        this.rightClickedSquareKey = squareKey;
    }
    onRightButtonUp(squareKey) {
        if (this.rightClickedSquareKey && this.rightClickedSquareKey !== squareKey) {
            this.drawArrow(this.rightClickedSquareKey, squareKey);
        }
    }
    drawArrow(squareKey1, squareKey2) {
        this.currentArrows.push({ from: squareKey1, to: squareKey2 });
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        let point1 = this.svgRoot.createSVGPoint();
        let point2 = this.svgRoot.createSVGPoint();
        let point3 = this.svgRoot.createSVGPoint();
        let point4 = this.svgRoot.createSVGPoint();
        let point5 = this.svgRoot.createSVGPoint();
        let point6 = this.svgRoot.createSVGPoint();
        let point7 = this.svgRoot.createSVGPoint();
        let from = this.getRelativeCenter(squareKey1);
        let to = this.getRelativeCenter(squareKey2);
        let distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
        let shortenDistance = 30;
        let center = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
        let triangleSideLength = 40;
        let a = triangleSideLength / 2;
        let c = triangleSideLength;
        let heightOfTriangle = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2));
        point1.x = center.x - (distance / 2) + shortenDistance;
        point1.y = center.y - this.strokeWidth / 2;
        point2.x = point1.x;
        point2.y = point1.y + this.strokeWidth;
        point3.x = point2.x + distance - heightOfTriangle - shortenDistance;
        point3.y = point2.y;
        point4.x = point3.x;
        point4.y = point3.y + ((triangleSideLength / 2) - (this.strokeWidth / 2));
        point5.x = point4.x + heightOfTriangle;
        point5.y = center.y;
        point6.x = point4.x;
        point6.y = point4.y - triangleSideLength;
        point7.x = point3.x;
        point7.y = point3.y - this.strokeWidth;
        let deltaX = to.x - from.x;
        let deltaY = to.y - from.y;
        let radian = Math.atan2(deltaY, deltaX);
        let degrees = radian * 180 / Math.PI;
        polygon.setAttribute('transform', "rotate(" + degrees + " " + center.x.toString() + " " + center.y.toString() + ")");
        polygon.setAttribute("class", "arrow");
        polygon.setAttribute("fill", "rgba(255, 170, 0, 0.8)");
        polygon.points.appendItem(point1);
        polygon.points.appendItem(point2);
        polygon.points.appendItem(point3);
        polygon.points.appendItem(point4);
        polygon.points.appendItem(point5);
        polygon.points.appendItem(point6);
        polygon.points.appendItem(point7);
        this.group.appendChild(polygon);
    }
    getRelativeCenter(squareKey) {
        let char = squareKey[0];
        let digit = squareKey[1];
        let x = Shared_1.default.getHorizontalIndex(char, this.isRotated) * 100 + 50;
        let y = Shared_1.default.getVerticalIndex(digit, this.isRotated) * 100 + 50;
        return { x, y };
    }
}
exports["default"] = ArrowLayer;


/***/ }),

/***/ "./src/components/v2/chessboard/Layers/BoardLayer.ts":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/Layers/BoardLayer.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const SquareFactory_1 = __importDefault(__webpack_require__(/*! ../SquareFactory */ "./src/components/v2/chessboard/SquareFactory.ts"));
const Shared_1 = __importDefault(__webpack_require__(/*! ../Shared */ "./src/components/v2/chessboard/Shared.ts"));
class BoardLayer {
    constructor(isRotated) {
        this.sourceColor = "rgba(255, 255, 51, 0.3)";
        this.targetColor = "rgba(255, 255, 51, 0.4)";
        this.rightClickColor = "rgb(235, 97, 80, 0.8)";
        this.rightClicks = {};
        this.rightClickedSquareKey = null;
        this.isRotated = isRotated;
        this.svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgRoot.setAttribute('viewBox', '0 0 800 800');
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.svgRoot.appendChild(group);
        let colors = ["l", "d", "l", "d", "l", "d", "l", "d"];
        [0, 1, 2, 3, 4, 5, 6, 7].forEach(y => {
            [0, 1, 2, 3, 4, 5, 6, 7].forEach((x, index) => {
                group.appendChild(this.createBoardRect(x, y, colors[index]));
            });
            colors = colors.reverse();
        });
        this.sourceAndTargetGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.svgRoot.appendChild(this.sourceAndTargetGroup);
        this.sourceHighlight = { squareKey: "a8", type: "source", rect: SquareFactory_1.default.createRect(0, 0) };
        this.targetHighlight = { squareKey: "a7", type: "target", rect: SquareFactory_1.default.createRect(1, 0) };
        this.sourceHighlight.rect.setAttribute("fill", "transparent");
        this.targetHighlight.rect.setAttribute("fill", "transparent");
        this.sourceAndTargetGroup.appendChild(this.sourceHighlight.rect);
        this.sourceAndTargetGroup.appendChild(this.targetHighlight.rect);
        this.rightClickGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.svgRoot.appendChild(this.rightClickGroup);
    }
    onLeftButtonDown(event) {
        this.clearAllHighlights();
    }
    onRightButtonDown(squareKey) {
        this.rightClickedSquareKey = squareKey;
    }
    onRightButtonUp(squareKey) {
        if (this.rightClickedSquareKey && this.rightClickedSquareKey === squareKey) {
            let rightClicked = this.rightClicks[squareKey];
            if (rightClicked) {
                this.rightClickGroup.removeChild(rightClicked.rect);
                this.rightClicks[squareKey] = null;
            }
            else {
                this.createRightClickHighlight(squareKey);
            }
        }
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
        this.setPosition(this.sourceHighlight);
        this.setPosition(this.targetHighlight);
        Object.values(this.rightClicks).forEach(rightClick => {
            if (rightClick) {
                this.setPosition(rightClick);
            }
        });
    }
    showTargetAndSource(from, to) {
        this.clearAllHighlights();
        this.showTargetOrSource(from, this.sourceHighlight, this.sourceColor);
        this.showTargetOrSource(to, this.targetHighlight, this.targetColor);
    }
    showTargetOrSource(squareKey, highlight, color) {
        highlight.squareKey = squareKey;
        highlight.rect.setAttribute("fill", color);
        this.setPosition(highlight);
    }
    clearAllHighlights() {
        this.sourceHighlight.rect.setAttribute("fill", "transparent");
        this.targetHighlight.rect.setAttribute("fill", "transparent");
        this.rightClicks = {};
        this.rightClickGroup.innerHTML = "";
    }
    createRightClickHighlight(squareKey) {
        let cords = Shared_1.default.getCordinatesBySquareKey(squareKey, this.isRotated);
        let rect = SquareFactory_1.default.createRect(cords.x, cords.y);
        rect.setAttribute("fill", this.rightClickColor);
        this.rightClickGroup.appendChild(rect);
        this.rightClicks[squareKey] = { squareKey, type: "RightClick", rect };
    }
    setPosition(highlight) {
        let cord = Shared_1.default.getCordinatesBySquareKey(highlight.squareKey, this.isRotated);
        highlight.rect.setAttribute("x", (cord.x * 100).toString());
        highlight.rect.setAttribute("y", (cord.y * 100).toString());
    }
    createBoardRect(x, y, color) {
        let rect = SquareFactory_1.default.createRect(x, y);
        rect.setAttribute("fill", color === "l" ? "rgb(233,237,204)" : "rgb(119,153,84)");
        return rect;
    }
}
exports["default"] = BoardLayer;


/***/ }),

/***/ "./src/components/v2/chessboard/Layers/CordsLayer.ts":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/Layers/CordsLayer.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class CordsLayer {
    constructor(svgRoot, isRotated) {
        this.isRotated = isRotated;
        this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.group.setAttribute("font-family", "Helvetica");
        this.group.setAttribute("font-weight", "bold");
        this.group.setAttribute("fill", "rgb(30,30,30");
        svgRoot.append(this.group);
        this.horizontalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.verticalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.group.appendChild(this.horizontalGroup);
        this.group.appendChild(this.verticalGroup);
        this.horizontalGroup.setAttribute("transform", "translate(86, 795.5)");
        this.verticalGroup.setAttribute("transform", "translate(5, 18)");
        this.getHorizontalCords(isRotated).forEach((letter, index) => {
            let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", "translate(" + (index * 100).toString() + ",0)");
            this.horizontalGroup.appendChild(group);
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("transform", "scale(0.9)");
            text.textContent = letter;
            group.appendChild(text);
        });
        this.getVerticalCords(isRotated).forEach((number, index) => {
            let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", "translate(0," + +(index * 100).toString() + ")");
            this.verticalGroup.appendChild(group);
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.textContent = number;
            text.setAttribute("transform", "scale(1)");
            group.appendChild(text);
        });
    }
    getHorizontalCords(isRotated) {
        let horizontalCords = ["A", "B", "C", "D", "E", "F", "G", "H"];
        return isRotated ? horizontalCords.reverse() : horizontalCords;
    }
    getVerticalCords(isRotated) {
        let verticalCords = ["8", "7", "6", "5", "4", "3", "2", "1"];
        return isRotated ? verticalCords.reverse() : verticalCords;
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
        let letters = this.getHorizontalCords(isRotated);
        let numbers = this.getVerticalCords(isRotated);
        Array.from(this.horizontalGroup.children).forEach((child, index) => {
            child.children[0].textContent = letters[index];
        });
        Array.from(this.verticalGroup.children).forEach((child, index) => {
            child.children[0].textContent = numbers[index];
        });
    }
}
exports["default"] = CordsLayer;


/***/ }),

/***/ "./src/components/v2/chessboard/Layers/MouseLayer.ts":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/Layers/MouseLayer.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const SquareFactory_1 = __importDefault(__webpack_require__(/*! ../SquareFactory */ "./src/components/v2/chessboard/SquareFactory.ts"));
const Shared_1 = __importDefault(__webpack_require__(/*! ../Shared */ "./src/components/v2/chessboard/Shared.ts"));
class MouseLayer {
    constructor(svgRoot) {
        this.rects = {};
        this.svgRoot = svgRoot;
    }
    init() {
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("fill-opacity", "0");
        this.svgRoot.appendChild(group);
        let index = 0;
        [0, 1, 2, 3, 4, 5, 6, 7].forEach(y => {
            [0, 1, 2, 3, 4, 5, 6, 7].forEach(x => {
                let rect = this.createRect(x, y);
                rect.setAttribute("data-index", (index).toString());
                this.rects[index++] = rect;
                group.appendChild(rect);
            });
        });
    }
    createRect(x, y) {
        return SquareFactory_1.default.createRect(x, y);
    }
    enableHover(squareKey, isRotated) {
        let index = Shared_1.default.getCurrentIndexOfSquareKey(squareKey, isRotated);
        this.rects[index].setAttribute("style", "cursor:pointer");
    }
    disableHover(squareKey, isRotated) {
        let index = Shared_1.default.getCurrentIndexOfSquareKey(squareKey, isRotated);
        this.rects[index].removeAttribute("style");
    }
    clear() {
        Object.values(this.rects).forEach(rect => {
            rect.removeAttribute("style");
        });
    }
}
exports["default"] = MouseLayer;


/***/ }),

/***/ "./src/components/v2/chessboard/Layers/PieceLayer.ts":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/Layers/PieceLayer.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Piece_1 = __webpack_require__(/*! ../Piece */ "./src/components/v2/chessboard/Piece.ts");
const PieceFactory_1 = __webpack_require__(/*! ../PieceFactory */ "./src/components/v2/chessboard/PieceFactory.ts");
const Shared_1 = __importDefault(__webpack_require__(/*! ../Shared */ "./src/components/v2/chessboard/Shared.ts"));
class PieceLayer {
    constructor(svgRoot, boardLayer, mouseLayer) {
        this.positions = {};
        this.isRotated = false;
        this.pieceTypes = {};
        this.boardLayer = boardLayer;
        this.mouseLayer = mouseLayer;
        this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svgRoot.appendChild(this.group);
    }
    clear() {
        this.positions = {};
        this.group.innerHTML = "";
        this.mouseLayer.clear();
    }
    addPiece(fenChar, squareKey) {
        let g = PieceFactory_1.PieceFactory.get(fenChar);
        this.group.appendChild(g);
        let piece = new Piece_1.Piece(g, fenChar);
        this.setPiecePosition(piece, squareKey);
    }
    onDrop(piece, squareIndexX, squareIndexY) {
        let destinationSquareKey = Shared_1.default.getSquareKeyByIndexes(squareIndexX, squareIndexY, this.isRotated);
        this.group.appendChild(piece.element);
        if (piece.squareKey === destinationSquareKey) {
            this.setPiecePosition(piece, destinationSquareKey);
        }
        else {
            this.movePiece(piece.squareKey, destinationSquareKey);
        }
    }
    onDropCancel(piece) {
        this.group.appendChild(piece.element);
        this.setPiecePosition(piece, piece.squareKey);
    }
    movePiece(from, to) {
        this.mouseLayer.disableHover(from, this.isRotated);
        this.mouseLayer.enableHover(to, this.isRotated);
        let piece = this.positions[from];
        let existingPiece = this.positions[to];
        if (existingPiece) {
            this.group.removeChild(existingPiece.element);
        }
        this.positions[to] = piece;
        this.positions[from] = null;
        this.setPiecePosition(piece, to);
        this.boardLayer.showTargetAndSource(from, to);
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
        let pieces = Object.values(this.positions);
        this.positions = {};
        this.mouseLayer.clear();
        pieces.forEach(piece => {
            if (piece) {
                this.setPiecePosition(piece, piece.squareKey);
            }
        });
    }
    setPiecePosition(piece, squareKey) {
        let x = (this.isRotated ? "hgfedcba" : "abcdefgh").indexOf(squareKey[0]) * 100;
        let y = (parseInt(squareKey[1]) - 1) * 100;
        if (!this.isRotated) {
            y = 700 - y;
        }
        this.positions[squareKey] = piece;
        piece.squareKey = squareKey;
        piece.element.setAttribute("transform", "translate(" + x + "," + y + ")");
        this.mouseLayer.enableHover(squareKey, this.isRotated);
    }
}
exports["default"] = PieceLayer;


/***/ }),

/***/ "./src/components/v2/chessboard/Piece.ts":
/*!***********************************************!*\
  !*** ./src/components/v2/chessboard/Piece.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Piece = void 0;
class Piece {
    constructor(element, fenChar) {
        this.squareKey = null;
        this.element = element;
        this.fenChar = fenChar;
    }
}
exports.Piece = Piece;


/***/ }),

/***/ "./src/components/v2/chessboard/PieceFactory.ts":
/*!******************************************************!*\
  !*** ./src/components/v2/chessboard/PieceFactory.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PieceFactory = void 0;
const bishop = __importStar(__webpack_require__(/*! ./assets/pieces/b.json */ "./src/components/v2/chessboard/assets/pieces/b.json"));
const king = __importStar(__webpack_require__(/*! ./assets/pieces/k.json */ "./src/components/v2/chessboard/assets/pieces/k.json"));
const knight = __importStar(__webpack_require__(/*! ./assets/pieces/n.json */ "./src/components/v2/chessboard/assets/pieces/n.json"));
const pawn = __importStar(__webpack_require__(/*! ./assets/pieces/p.json */ "./src/components/v2/chessboard/assets/pieces/p.json"));
const queen = __importStar(__webpack_require__(/*! ./assets/pieces/q.json */ "./src/components/v2/chessboard/assets/pieces/q.json"));
const rook = __importStar(__webpack_require__(/*! ./assets/pieces/r.json */ "./src/components/v2/chessboard/assets/pieces/r.json"));
const pieceSVGData = {};
pieceSVGData["p"] = pawn.g;
pieceSVGData["r"] = rook.g;
pieceSVGData["n"] = knight.g;
pieceSVGData["b"] = bishop.g;
pieceSVGData["q"] = queen.g;
pieceSVGData["k"] = king.g;
const pieceTypes = {};
["p", "n", "b", "r", "q", "k", "P", "N", "B", "R", "Q", "K"].forEach(fenChar => {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let data = pieceSVGData[fenChar.toLowerCase()];
    let color = fenChar === fenChar.toLowerCase() ? 0 : 1;
    loadChildren(g, data, color);
    pieceTypes[fenChar] = g;
});
function loadChildren(g, group, color) {
    if (group.transform) {
        g.setAttribute("transform", group.transform);
    }
    if (group.style && group.style[color]) {
        g.setAttribute("style", group.style[color]);
    }
    if (group.circle) {
        group.circle.forEach(circle => {
            let c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            c.setAttribute("cx", circle.cx);
            c.setAttribute("cy", circle.cy);
            c.setAttribute("r", circle.r);
            g.appendChild(c);
        });
    }
    if (group.path) {
        group.path.forEach(path => {
            let p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (path.colorIndex === undefined || path.colorIndex === color) {
                p.setAttribute("d", path.d);
                if (path.style) {
                    p.setAttribute("style", path.style[color]);
                }
                g.appendChild(p);
            }
        });
    }
    if (group.g) {
        let childGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.appendChild(childGroup);
        loadChildren(childGroup, group.g, color);
    }
}
var PieceFactory;
(function (PieceFactory) {
    function get(fenChar) {
        return pieceTypes[fenChar].cloneNode(true);
    }
    PieceFactory.get = get;
})(PieceFactory || (exports.PieceFactory = PieceFactory = {}));


/***/ }),

/***/ "./src/components/v2/chessboard/Shared.ts":
/*!************************************************!*\
  !*** ./src/components/v2/chessboard/Shared.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Shared;
(function (Shared) {
    const squareKeys = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8", "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"];
    const horizontal = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const vertical = ["8", "7", "6", "5", "4", "3", "2", "1"];
    function getSquareKeyByIndexes(horizontalIndex, verticalIndex, isRotated) {
        let letterIndex = isRotated ? 7 - horizontalIndex : horizontalIndex;
        let digitIndex = isRotated ? 7 - verticalIndex : verticalIndex;
        return horizontal[letterIndex] + vertical[digitIndex];
    }
    Shared.getSquareKeyByIndexes = getSquareKeyByIndexes;
    function getSquareKeyByIndex(index, isRotated) {
        let i = isRotated ? 63 - index : index;
        return squareKeys[i];
    }
    Shared.getSquareKeyByIndex = getSquareKeyByIndex;
    function getCurrentIndexOfSquareKey(squareKey, isRotated) {
        let index = squareKeys.indexOf(squareKey);
        return isRotated ? 63 - index : index;
    }
    Shared.getCurrentIndexOfSquareKey = getCurrentIndexOfSquareKey;
    function getHorizontalIndex(squareLetter, isRotated) {
        let index = horizontal.indexOf(squareLetter);
        return isRotated ? 7 - index : index;
    }
    Shared.getHorizontalIndex = getHorizontalIndex;
    function getVerticalIndex(squareNumber, isRotated) {
        let index = vertical.indexOf(squareNumber);
        return isRotated ? 7 - index : index;
    }
    Shared.getVerticalIndex = getVerticalIndex;
    function getCordinatesBySquareKey(squareKey, isRotated) {
        let x = getHorizontalIndex(squareKey[0], isRotated);
        let y = getVerticalIndex(squareKey[1], isRotated);
        return { x, y };
    }
    Shared.getCordinatesBySquareKey = getCordinatesBySquareKey;
})(Shared || (Shared = {}));
exports["default"] = Shared;


/***/ }),

/***/ "./src/components/v2/chessboard/SquareFactory.ts":
/*!*******************************************************!*\
  !*** ./src/components/v2/chessboard/SquareFactory.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var SVGSquare;
(function (SVGSquare) {
    function createRect(x, y) {
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute("x", (x * 100).toString());
        rect.setAttribute("y", (y * 100).toString());
        rect.setAttribute("width", "100");
        rect.setAttribute("height", "100");
        return rect;
    }
    SVGSquare.createRect = createRect;
})(SVGSquare || (SVGSquare = {}));
exports["default"] = SVGSquare;


/***/ }),

/***/ "./src/pages/openings/Openings.ts":
/*!****************************************!*\
  !*** ./src/pages/openings/Openings.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./openings.css */ "./src/pages/openings/openings.css");
const Chessboard_1 = __importDefault(__webpack_require__(/*! ../../components/v2/chessboard/Chessboard */ "./src/components/v2/chessboard/Chessboard.ts"));
// import Chessgame from "../../components/svg/Chessgame";
let boardContainer = document.getElementById("chessboard");
let chessboard = new Chessboard_1.default(boardContainer, "start", false);
// document.getElementById("test")!.onclick = () => chessboard.test();
// let f ="r7/3qp1k1/1p1p1pP1/p1nP1P2/PnP5/4B3/4B3/1Q3K2 w - - 1 28";
// let fen = "8/kpPK4/8/8/8/8/8/8";
// let container = document.getElementById("gameInfoContainer") as HTMLElement;
// let chessgame = new Chessgame(container, fen, true);;
// let img = document.getElementById("my-img") as HTMLImageElement;
// img.src = board2;
// let svg = createBackground();
// document.body.append(svg);
// debugger;
// setTargetAndSource("e2", "e4", svg);
// let board = document.getElementById("board") as HTMLElement;
// let svg = board.firstChild as HTMLImageElement;
// svg.src = boardbg;
// for (let element of board.children){
//     if (!element.classList.contains("background")){
//         let image = element.lastChild as HTMLImageElement;
//         if (image.classList.contains("wp")){
//             image.src = Icons.PieceUrl["P"];
//         }
//         else if (image.classList.contains("wr")){
//             image.src = Icons.PieceUrl["R"];
//         }
//         else if (image.classList.contains("wn")){
//             image.src = Icons.PieceUrl["N"];
//         }
//         else if (image.classList.contains("wb")){
//             image.src = Icons.PieceUrl["B"];
//         }
//         else if (image.classList.contains("wq")){
//             image.src = Icons.PieceUrl["Q"];
//         }
//         else if (image.classList.contains("wk")){
//             image.src = Icons.PieceUrl["K"];
//         }
//     }
// }
// let queen = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "*")[68];
// let bbox = king.getBoundingClientRect();
// console.log(bbox);
// let svgTags = document.getElementsByTagName("svg") as HTMLCollectionOf<SVGElement>;
// let queen = svgTags[1] as SVGElement;
// getBoundingBoxOfSvgPath(queen);
// import "../master.css";
// import { Chessboard } from "../../components/chess/Chessboard";
// let chessboardContainer = document.getElementById("chessboard") as HTMLElement;
// let chessboard = new Chessboard(chessboardContainer, "start", false);


/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/b.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/b.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(2) translate(2,3.6)","g":{"style":["fill:#000000; stroke:#000000; stroke-linecap:butt;","fill:#ffffff; stroke:#000000; stroke-linecap:butt;"],"path":[{"d":"M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"},{"d":"M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"},{"d":"M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"}],"g":{"path":[{"d":"M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18","style":["fill:none; stroke:#ffffff; stroke-linejoin:miter;","fill:none; stroke:#000000; stroke-linejoin:miter;"]}],"style":["opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(4,4.6)","opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(4,4.6)"]}}}}}');

/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/k.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/k.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(2.15) translate(0.7,-0.4)","style":["fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;","fill:none; fill-rule:evenodd;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5;transform:translate(2.5,1.5)"],"path":[{"colorIndex":0,"d":"M 22.5,11.63 L 22.5,6","style":["fill:none; stroke:#000000; stroke-linejoin:miter;","stroke-linejoin:miter"]},{"colorIndex":1,"d":"M22.5 11.63V6M20 8h5","style":["","stroke-linejoin:miter"]},{"colorIndex":0,"d":"M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25","style":["fill:#000000;fill-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;","fill:#fff; stroke-linecap:butt; stroke-linejoin:miter"]},{"colorIndex":1,"d":"M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5","style":["","fill:#fff;stroke-linecap:butt;stroke-linejoin:miter"]},{"colorIndex":0,"d":"M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37","style":["fill:#000000; stroke:#000000;","fill:#fff"]},{"colorIndex":1,"d":"M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7","style":["","fill:#fff"]},{"colorIndex":0,"d":"M 20,8 L 25,8","style":["fill:none; stroke:#000000; stroke-linejoin:miter;",""]},{"colorIndex":0,"d":"M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5","style":["fill:none; stroke:#ffffff;",""]},{"colorIndex":0,"d":"M 12.5,30 C 18,27 27,27 32.5,30 M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5 M 12.5,37 C 18,34 27,34 32.5,37","style":["fill:none; stroke:#ffffff;",""]},{"colorIndex":1,"d":"M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"}]}}}');

/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/n.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/n.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(2) translate(2,3)","style":["opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;transform:translate(6,6.3)","opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(6,6.3)"],"path":[{"d":"M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18","style":["fill:#000000;stroke:#000000;","fill:#ffffff; stroke:#000000;"]},{"d":"M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10","style":["fill:#000000;stroke:#000000;","fill:#ffffff; stroke:#000000;"]},{"d":"M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z","style":["fill:#ffffff;stroke:#ffffff;","fill:#000000; stroke:#000000;"]},{"d":"M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z","style":["fill:#ffffff;stroke:#ffffff;transform:matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)","fill:#000000; stroke:#000000;transform:matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"]},{"d":"M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z","style":["fill:#ffffff; stroke:none;",""]}]}}}');

/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/p.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/p.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(2.2) translate(0,0)","path":[{"d":"m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z","style":["","fill:#ffffff;stroke:#000000;stroke-width:1.5;"]}]}}}');

/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/q.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/q.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(1.89) translate(4.1,5.6)","style":["fill:#000000;stroke:#000000;stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;transform:translate(5,7)","fill:#ffffff;stroke:#000000;stroke-width:1.5;stroke-linejoin:round;transform:translate(5,7)"],"path":[{"d":"M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z","style":["stroke-linecap:butt;fill:#000000",""]},{"colorIndex":1,"d":"M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"},{"colorIndex":0,"d":"m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z","style":["",""]},{"d":"M 11.5,30 C 15,29 30,29 33.5,30","style":["fill:none","fill:none"]},{"colorIndex":1,"d":"M 12,33.5 C 18,32.5 27,32.5 33,33.5","style":["","fill:none"]},{"colorIndex":0,"d":"m 12,33.5 c 6,-1 15,-1 21,0","style":["fill:none",""]},{"colorIndex":0,"d":"M 11,38.5 A 35,35 1 0 0 34,38.5","style":["fill:none; stroke:#000000;stroke-linecap:butt;",""]}],"circle":[{"cx":"6","cy":"12","r":"2"},{"cx":"14","cy":"9","r":"2"},{"cx":"22.5","cy":"8","r":"2"},{"cx":"31","cy":"9","r":"2"},{"cx":"39","cy":"12","r":"2"}],"g":{"style":["fill:none; stroke:#ffffff;",""],"path":[{"colorIndex":0,"d":"M 11,29 A 35,35 1 0 1 34,29"},{"colorIndex":0,"d":"M 12.5,31.5 L 32.5,31.5"},{"colorIndex":0,"d":"M 11.5,34.5 A 35,35 1 0 0 33.5,34.5"},{"colorIndex":0,"d":"M 10.5,37.5 A 35,35 1 0 0 34.5,37.5"}]}}}}');

/***/ }),

/***/ "./src/components/v2/chessboard/assets/pieces/r.json":
/*!***********************************************************!*\
  !*** ./src/components/v2/chessboard/assets/pieces/r.json ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(2) translate(2,3)","style":["opacity:1; fill:#000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(6,6.3)","opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(6,6.3)"],"path":[{"d":"M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z","style":["stroke-linecap:butt;","stroke-linecap:butt;"]},{"d":"M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z","colorIndex":0,"style":["stroke-linecap:butt;",""]},{"d":"M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z","style":["stroke-linecap:butt;","stroke-linecap:butt;"]},{"d":"M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z","colorIndex":0,"style":["stroke-linecap:butt;stroke-linejoin:miter;",""]},{"d":"M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z","colorIndex":0,"style":["stroke-linecap:butt;",""]},{"d":"M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z","style":["stroke-linecap:butt;","stroke-linecap:butt;"]},{"d":"M 12,35.5 L 33,35.5 L 33,35.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 13,31.5 L 32,31.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 14,29.5 L 31,29.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 14,16.5 L 31,16.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 11,14 L 34,14","style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;","fill:none; stroke:#000000; stroke-linejoin:miter;"]},{"d":"M 34,14 L 31,17 L 14,17 L 11,14","colorIndex":1},{"d":"M 31,17 L 31,29.5 L 14,29.5 L 14,17","colorIndex":1,"style":["stroke-linecap:butt; stroke-linejoin:miter;"]},{"d":"M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5","colorIndex":1,"style":[]}]}}}');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/pages/openings/Openings.ts"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxRQUFRLEdBQUcsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO1FBQ3BFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVwQixNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEIsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxRSxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUM7UUFDdkMsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXBCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwQixNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLENBQUM7UUFFekMsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRXZDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMzQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFM0IsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEMs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QW9CO0FBQ3BCLGdDQUFnQztBQUNoQyw2QkFBNkI7QUFDN0IsWUFBWTtBQUVaLHVDQUF1QztBQUV2QywrREFBK0Q7QUFDL0Qsa0RBQWtEO0FBQ2xELHFCQUFxQjtBQUNyQix1Q0FBdUM7QUFDdkMsc0RBQXNEO0FBQ3RELDZEQUE2RDtBQUM3RCwrQ0FBK0M7QUFDL0MsK0NBQStDO0FBQy9DLFlBQVk7QUFDWixvREFBb0Q7QUFDcEQsK0NBQStDO0FBQy9DLFlBQVk7QUFDWixvREFBb0Q7QUFDcEQsK0NBQStDO0FBQy9DLFlBQVk7QUFDWixvREFBb0Q7QUFDcEQsK0NBQStDO0FBQy9DLFlBQVk7QUFDWixvREFBb0Q7QUFDcEQsK0NBQStDO0FBQy9DLFlBQVk7QUFDWixvREFBb0Q7QUFDcEQsK0NBQStDO0FBQy9DLFlBQVk7QUFDWixRQUFRO0FBRVIsSUFBSTtBQUNKLHNGQUFzRjtBQUN0RiwyQ0FBMkM7QUFDM0MscUJBQXFCO0FBRXJCLHNGQUFzRjtBQUN0Rix3Q0FBd0M7QUFDeEMsa0NBQWtDO0FBRWxDLDBCQUEwQjtBQUMxQixrRUFBa0U7QUFFbEUsa0ZBQWtGO0FBQ2xGLHdFQUF3RSIsInNvdXJjZXMiOlsid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvcGFnZXMvb3BlbmluZ3Mvb3BlbmluZ3MuY3NzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL3BhZ2VzL29wZW5pbmdzL29wZW5pbmdzLmNzcz9hODJlIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvQ2hlc3Nib2FyZC50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9MYXllcnMvQXJyb3dMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9MYXllcnMvQm9hcmRMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9MYXllcnMvQ29yZHNMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9MYXllcnMvTW91c2VMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9MYXllcnMvUGllY2VMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9QaWVjZS50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvdjIvY2hlc3Nib2FyZC9QaWVjZUZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3YyL2NoZXNzYm9hcmQvU2hhcmVkLnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy92Mi9jaGVzc2JvYXJkL1NxdWFyZUZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9wYWdlcy9vcGVuaW5ncy9PcGVuaW5ncy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgYm9keXtwYWRkaW5nOjA7bWFyZ2luOjA7fWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3BhZ2VzL29wZW5pbmdzL29wZW5pbmdzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSxLQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUNcIixcInNvdXJjZXNDb250ZW50XCI6W1wiYm9keXtwYWRkaW5nOjA7bWFyZ2luOjA7fVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL29wZW5pbmdzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vb3BlbmluZ3MuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJpbXBvcnQgQm9hcmRMYXllciBmcm9tIFwiLi9MYXllcnMvQm9hcmRMYXllclwiO1xyXG5pbXBvcnQgQ29yZHNMYXllciBmcm9tIFwiLi9MYXllcnMvQ29yZHNMYXllclwiO1xyXG5pbXBvcnQgUGllY2VMYXllciBmcm9tIFwiLi9MYXllcnMvUGllY2VMYXllclwiO1xyXG5pbXBvcnQgQXJyb3dMYXllciBmcm9tIFwiLi9MYXllcnMvQXJyb3dMYXllclwiO1xyXG5pbXBvcnQgTW91c2VMYXllciBmcm9tIFwiLi9MYXllcnMvTW91c2VMYXllclwiO1xyXG5pbXBvcnQgU2hhcmVkIGZyb20gXCIuL1NoYXJlZFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hlc3Nib2FyZHtcclxuICAgIHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudDtcclxuICAgIHByaXZhdGUgYm9hcmRMYXllcjpCb2FyZExheWVyO1xyXG4gICAgcHJpdmF0ZSBjb3Jkc0xheWVyOkNvcmRzTGF5ZXI7XHJcbiAgICBwaWVjZUxheWVyOlBpZWNlTGF5ZXI7XHJcbiAgICBwcml2YXRlIGFycm93TGF5ZXI6QXJyb3dMYXllcjtcclxuICAgIHByaXZhdGUgbW91c2VMYXllcjpNb3VzZUxheWVyO1xyXG4gICAgcHJpdmF0ZSBpc1JvdGF0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjaGVzc0NvbnRhaW5lcjpIVE1MRWxlbWVudHxTVkdHRWxlbWVudCwgZmVuOnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuYm9hcmRMYXllciA9IG5ldyBCb2FyZExheWVyKGlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5zdmdSb290ID0gdGhpcy5ib2FyZExheWVyLnN2Z1Jvb3Q7XHJcbiAgICAgICAgY2hlc3NDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zdmdSb290KTtcclxuICAgICAgICB0aGlzLm1vdXNlTGF5ZXIgPSBuZXcgTW91c2VMYXllcih0aGlzLnN2Z1Jvb3QpO1xyXG4gICAgICAgIHRoaXMuY29yZHNMYXllciA9IG5ldyBDb3Jkc0xheWVyKHRoaXMuc3ZnUm9vdCwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnBpZWNlTGF5ZXIgPSBuZXcgUGllY2VMYXllcih0aGlzLnN2Z1Jvb3QsIHRoaXMuYm9hcmRMYXllciwgdGhpcy5tb3VzZUxheWVyKTtcclxuICAgICAgICB0aGlzLmFycm93TGF5ZXIgPSBuZXcgQXJyb3dMYXllcih0aGlzLnN2Z1Jvb3QpO1xyXG4gICAgICAgIHRoaXMubW91c2VMYXllci5pbml0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RmVuKGZlbiwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgdGVzdCgpe1xyXG4gICAgICAgIHRoaXMucm90YXRlKCk7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9ICF0aGlzLmlzUm90YXRlZDtcclxuICAgICAgICB0aGlzLmJvYXJkTGF5ZXIucm90YXRlKHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLmNvcmRzTGF5ZXIucm90YXRlKHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnBpZWNlTGF5ZXIucm90YXRlKHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLmFycm93TGF5ZXIucm90YXRlKHRoaXMuaXNSb3RhdGVkKTtcclxuICAgIH1cclxuICAgIHNldEZlbihmZW46c3RyaW5nLCBjbGVhckZpcnN0OmJvb2xlYW4pe1xyXG4gICAgICAgIGlmIChjbGVhckZpcnN0KXtcclxuICAgICAgICAgICAgdGhpcy5waWVjZUxheWVyLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBPYmplY3QudmFsdWVzKHRoaXMud2hpdGVDYXB0dXJlcykuY29uY2F0KE9iamVjdC52YWx1ZXModGhpcy5ibGFja0NhcHR1cmVzKSkuZm9yRWFjaChlbGVtZW50ID0+e1xyXG4gICAgICAgICAgICAvLyAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgLy8gdGhpcy5waWVjZUVsZW1lbnRzID0gW107XHJcbiAgICAgICAgICAgIC8vIHRoaXMuc2V0U2NvcmUoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmZW4gIT09IFwiXCIpe1xyXG4gICAgICAgICAgICBpZiAoZmVuLnRvTG93ZXJDYXNlKCkgPT09IFwic3RhcnRcIilcclxuICAgICAgICAgICAgICAgIGZlbiA9IFwicm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDFcIjtcclxuICAgICAgICAgICAgZmVuID0gZmVuLnNwbGl0KFwiIFwiKVswXS5zcGxpdChcIi9cIikuam9pbihcIlwiKTtcclxuICAgICAgICAgICAgbGV0IHNxdWFyZUluZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZW4ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGZlbkNoYXIgPSBmZW5baV07XHJcbiAgICAgICAgICAgICAgICBsZXQgbnVtbWVyaWNWYWx1ZSA9IHBhcnNlSW50KGZlbkNoYXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW1tZXJpY1ZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3F1YXJlSW5kZXggKz0gbnVtbWVyaWNWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtleSA9IFNoYXJlZC5nZXRTcXVhcmVLZXlCeUluZGV4KHNxdWFyZUluZGV4KyssIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBpZWNlTGF5ZXIuYWRkUGllY2UoZmVuQ2hhciwga2V5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgU2hhcmVkIGZyb20gXCIuLi9TaGFyZWRcIjtcclxuXHJcbmludGVyZmFjZSBBcnJvd3tcclxuICAgIGZyb206c3RyaW5nLFxyXG4gICAgdG86c3RyaW5nXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJyb3dMYXllcntcclxuICAgIHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudDtcclxuICAgIGdyb3VwOlNWR0dFbGVtZW50O1xyXG4gICAgc3Ryb2tlV2lkdGggPSAyMDtcclxuICAgIHJpZ2h0Q2xpY2tlZFNxdWFyZUtleTpzdHJpbmd8bnVsbCA9IG51bGw7XHJcbiAgICBpc1JvdGF0ZWQgPSBmYWxzZTtcclxuICAgIGN1cnJlbnRBcnJvd3M6IEFycm93W10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQpe1xyXG4gICAgICAgIGxldCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHN2Z1Jvb3QuYXBwZW5kQ2hpbGQoZ3JvdXApO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdCA9IHN2Z1Jvb3Q7XHJcbiAgICAgICAgdGhpcy5ncm91cCA9IGdyb3VwO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChldmVudDpNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpc1JpZ2h0Q2xpY2sgPSBldmVudC5idXR0b24gJiYgZXZlbnQuYnV0dG9uID09IDI7XHJcbiAgICAgICAgICAgIGlmIChpc1JpZ2h0Q2xpY2spe1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBwYXJzZUludChyZWN0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIikhKTtcclxuICAgICAgICAgICAgICAgIGxldCBzcXVhcmVLZXkgPSBTaGFyZWQuZ2V0U3F1YXJlS2V5QnlJbmRleChpbmRleCwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJpZ2h0QnV0dG9uRG93bihzcXVhcmVLZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uTGVmdEJ1dHRvbkRvd24oZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zdmdSb290LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChldmVudDpNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpc1JpZ2h0Q2xpY2sgPSBldmVudC5idXR0b24gJiYgZXZlbnQuYnV0dG9uID09IDI7XHJcbiAgICAgICAgICAgIGlmIChpc1JpZ2h0Q2xpY2spe1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBwYXJzZUludChyZWN0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIikhKTtcclxuICAgICAgICAgICAgICAgIGxldCBzcXVhcmVLZXkgPSBTaGFyZWQuZ2V0U3F1YXJlS2V5QnlJbmRleChpbmRleCwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJpZ2h0QnV0dG9uVXAoc3F1YXJlS2V5KTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSApO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICB0aGlzLmdyb3VwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QXJyb3dzLmZvckVhY2goYXJyb3cgPT57XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0Fycm93KGFycm93LmZyb20sIGFycm93LnRvKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgb25MZWZ0QnV0dG9uRG93bihldmVudDpNb3VzZUV2ZW50KXtcclxuICAgICAgICB0aGlzLmdyb3VwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QXJyb3dzID0gW107XHJcbiAgICB9XHJcbiAgICBvblJpZ2h0QnV0dG9uRG93bihzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tlZFNxdWFyZUtleSA9IHNxdWFyZUtleTtcclxuICAgIH1cclxuICAgIG9uUmlnaHRCdXR0b25VcChzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGhpcy5yaWdodENsaWNrZWRTcXVhcmVLZXkgJiYgdGhpcy5yaWdodENsaWNrZWRTcXVhcmVLZXkgIT09IHNxdWFyZUtleSl7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0Fycm93KHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5LCBzcXVhcmVLZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRyYXdBcnJvdyhzcXVhcmVLZXkxOnN0cmluZywgc3F1YXJlS2V5MjpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudEFycm93cy5wdXNoKHtmcm9tOnNxdWFyZUtleTEsIHRvOnNxdWFyZUtleTJ9KTtcclxuICAgICAgICBjb25zdCBwb2x5Z29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwb2x5Z29uJyk7XHJcbiAgICAgICAgbGV0IHBvaW50MSA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICAgIGxldCBwb2ludDIgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgICBsZXQgcG9pbnQzID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgICAgbGV0IHBvaW50NCA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICAgIGxldCBwb2ludDUgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgICBsZXQgcG9pbnQ2ID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgICAgbGV0IHBvaW50NyA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG5cclxuICAgICAgICBsZXQgZnJvbSA9IHRoaXMuZ2V0UmVsYXRpdmVDZW50ZXIoc3F1YXJlS2V5MSk7XHJcbiAgICAgICAgbGV0IHRvID0gdGhpcy5nZXRSZWxhdGl2ZUNlbnRlcihzcXVhcmVLZXkyKTtcclxuICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3codG8ueCAtIGZyb20ueCwgMikgKyBNYXRoLnBvdyh0by55IC1mcm9tLnksIDIpKTtcclxuICAgICAgICBsZXQgc2hvcnRlbkRpc3RhbmNlID0gMzA7XHJcbiAgICAgICAgbGV0IGNlbnRlciA9IHsgeDogKGZyb20ueCArIHRvLngpLzIsIHk6IChmcm9tLnkgKyB0by55KS8yIH07XHJcbiAgICAgICAgbGV0IHRyaWFuZ2xlU2lkZUxlbmd0aCA9IDQwO1xyXG4gICAgICAgIGxldCBhID0gdHJpYW5nbGVTaWRlTGVuZ3RoIC8gMjtcclxuICAgICAgICBsZXQgYyA9IHRyaWFuZ2xlU2lkZUxlbmd0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0T2ZUcmlhbmdsZSA9IE1hdGguc3FydChNYXRoLnBvdyhjLCAyKSAtIE1hdGgucG93KGEsMikpO1xyXG5cclxuICAgICAgICBwb2ludDEueCA9IGNlbnRlci54IC0gKGRpc3RhbmNlIC8gMikgKyBzaG9ydGVuRGlzdGFuY2U7XHJcbiAgICAgICAgcG9pbnQxLnkgPSBjZW50ZXIueSAtIHRoaXMuc3Ryb2tlV2lkdGggLyAyO1xyXG5cclxuICAgICAgICBwb2ludDIueCA9IHBvaW50MS54O1xyXG4gICAgICAgIHBvaW50Mi55ID0gcG9pbnQxLnkgKyB0aGlzLnN0cm9rZVdpZHRoO1xyXG5cclxuICAgICAgICBwb2ludDMueCA9IHBvaW50Mi54ICsgZGlzdGFuY2UgLSBoZWlnaHRPZlRyaWFuZ2xlIC0gc2hvcnRlbkRpc3RhbmNlO1xyXG4gICAgICAgIHBvaW50My55ID0gcG9pbnQyLnk7XHJcblxyXG4gICAgICAgIHBvaW50NC54ID0gcG9pbnQzLng7XHJcbiAgICAgICAgcG9pbnQ0LnkgPSBwb2ludDMueSArICgodHJpYW5nbGVTaWRlTGVuZ3RoIC8gMikgLSAodGhpcy5zdHJva2VXaWR0aCAvIDIpKTtcclxuXHJcbiAgICAgICAgcG9pbnQ1LnggPSBwb2ludDQueCArIGhlaWdodE9mVHJpYW5nbGU7XHJcbiAgICAgICAgcG9pbnQ1LnkgPSBjZW50ZXIueTtcclxuXHJcbiAgICAgICAgcG9pbnQ2LnggPSBwb2ludDQueDtcclxuICAgICAgICBwb2ludDYueSA9IHBvaW50NC55IC0gdHJpYW5nbGVTaWRlTGVuZ3RoO1xyXG5cclxuICAgICAgICBwb2ludDcueCA9IHBvaW50My54O1xyXG4gICAgICAgIHBvaW50Ny55ID0gcG9pbnQzLnkgLSB0aGlzLnN0cm9rZVdpZHRoO1xyXG5cclxuICAgICAgICBsZXQgZGVsdGFYID0gdG8ueCAtIGZyb20ueDtcclxuICAgICAgICBsZXQgZGVsdGFZID0gdG8ueSAtIGZyb20ueTtcclxuXHJcbiAgICAgICAgbGV0IHJhZGlhbiA9IE1hdGguYXRhbjIoZGVsdGFZLCBkZWx0YVgpO1xyXG4gICAgICAgIGxldCBkZWdyZWVzID0gcmFkaWFuICogMTgwIC8gTWF0aC5QSTtcclxuXHJcbiAgICAgICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZGVncmVlcyArIFwiIFwiICsgY2VudGVyLngudG9TdHJpbmcoKSArIFwiIFwiICsgY2VudGVyLnkudG9TdHJpbmcoKSArIFwiKVwiKTtcclxuICAgICAgICBwb2x5Z29uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYXJyb3dcIik7XHJcbiAgICAgICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwicmdiYSgyNTUsIDE3MCwgMCwgMC44KVwiKTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50MSk7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDIpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQzKTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50NCk7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDUpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQ2KTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50Nyk7XHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChwb2x5Z29uKTtcclxuICAgIH1cclxuICAgIGdldFJlbGF0aXZlQ2VudGVyKHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBjaGFyID0gc3F1YXJlS2V5WzBdO1xyXG4gICAgICAgIGxldCBkaWdpdCA9IHNxdWFyZUtleVsxXTtcclxuICAgICAgICBsZXQgeCA9IFNoYXJlZC5nZXRIb3Jpem9udGFsSW5kZXgoY2hhciwgdGhpcy5pc1JvdGF0ZWQpICogMTAwICsgNTA7XHJcbiAgICAgICAgbGV0IHkgPSBTaGFyZWQuZ2V0VmVydGljYWxJbmRleChkaWdpdCwgdGhpcy5pc1JvdGF0ZWQpICogMTAwICsgNTA7XHJcbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFNWR1NxdWFyZSBmcm9tIFwiLi4vU3F1YXJlRmFjdG9yeVwiO1xyXG5pbXBvcnQgU2hhcmVkIGZyb20gXCIuLi9TaGFyZWRcIjtcclxuXHJcbmludGVyZmFjZSBIaWdobGlnaHR7XHJcbiAgICBzcXVhcmVLZXk6c3RyaW5nLFxyXG4gICAgdHlwZTpzdHJpbmc7XHJcbiAgICByZWN0OlNWR1JlY3RFbGVtZW50O1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvYXJkTGF5ZXJ7XHJcbiAgICBzdmdSb290OlNWR1NWR0VsZW1lbnQ7XHJcbiAgICBpc1JvdGF0ZWQ6Ym9vbGVhbjtcclxuICAgIHNvdXJjZUNvbG9yID0gXCJyZ2JhKDI1NSwgMjU1LCA1MSwgMC4zKVwiO1xyXG4gICAgdGFyZ2V0Q29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDUxLCAwLjQpXCI7XHJcbiAgICByaWdodENsaWNrQ29sb3IgPSBcInJnYigyMzUsIDk3LCA4MCwgMC44KVwiO1xyXG4gICAgc291cmNlSGlnaGxpZ2h0OkhpZ2hsaWdodDtcclxuICAgIHRhcmdldEhpZ2hsaWdodDpIaWdobGlnaHQ7XHJcbiAgICBzb3VyY2VBbmRUYXJnZXRHcm91cDpTVkdHRWxlbWVudDtcclxuICAgIHJpZ2h0Q2xpY2tHcm91cDpTVkdHRWxlbWVudDtcclxuICAgIHJpZ2h0Q2xpY2tzOlJlY29yZDxzdHJpbmcsIEhpZ2hsaWdodHxudWxsPiA9IHt9O1xyXG4gICAgcmlnaHRDbGlja2VkU3F1YXJlS2V5OnN0cmluZ3xudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgdGhpcy5zdmdSb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3Quc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCA4MDAgODAwJyk7XHJcblxyXG4gICAgICAgIGxldCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hcHBlbmRDaGlsZChncm91cCk7XHJcblxyXG4gICAgICAgIGxldCBjb2xvcnMgPSBbXCJsXCIsIFwiZFwiLCBcImxcIiwgXCJkXCIsIFwibFwiLCBcImRcIiwgXCJsXCIsIFwiZFwiXTtcclxuXHJcbiAgICAgICAgWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddLmZvckVhY2goeSA9PntcclxuICAgICAgICAgICAgWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddLmZvckVhY2goKHgsIGluZGV4KSA9PntcclxuICAgICAgICAgICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlQm9hcmRSZWN0KHgsIHksIGNvbG9yc1tpbmRleF0pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbG9ycyA9IGNvbG9ycy5yZXZlcnNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VBbmRUYXJnZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hcHBlbmRDaGlsZCh0aGlzLnNvdXJjZUFuZFRhcmdldEdyb3VwKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNvdXJjZUhpZ2hsaWdodCA9IHtzcXVhcmVLZXk6IFwiYThcIiwgdHlwZTogXCJzb3VyY2VcIiwgcmVjdDogU1ZHU3F1YXJlLmNyZWF0ZVJlY3QoMCwwKX07XHJcbiAgICAgICAgdGhpcy50YXJnZXRIaWdobGlnaHQgPSB7c3F1YXJlS2V5OiBcImE3XCIsIHR5cGU6IFwidGFyZ2V0XCIsIHJlY3Q6IFNWR1NxdWFyZS5jcmVhdGVSZWN0KDEsMCl9O1xyXG4gICAgICAgIHRoaXMuc291cmNlSGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInRyYW5zcGFyZW50XCIpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0SGlnaGxpZ2h0LnJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInRyYW5zcGFyZW50XCIpO1xyXG4gICAgICAgIHRoaXMuc291cmNlQW5kVGFyZ2V0R3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5zb3VyY2VIaWdobGlnaHQucmVjdCk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VBbmRUYXJnZXRHcm91cC5hcHBlbmRDaGlsZCh0aGlzLnRhcmdldEhpZ2hsaWdodC5yZWN0KTtcclxuXHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QuYXBwZW5kQ2hpbGQodGhpcy5yaWdodENsaWNrR3JvdXApO1xyXG4gICAgfVxyXG4gICAgb25MZWZ0QnV0dG9uRG93bihldmVudDpNb3VzZUV2ZW50KXtcclxuICAgICAgICB0aGlzLmNsZWFyQWxsSGlnaGxpZ2h0cygpO1xyXG4gICAgfVxyXG4gICAgb25SaWdodEJ1dHRvbkRvd24oc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrZWRTcXVhcmVLZXkgPSBzcXVhcmVLZXk7XHJcbiAgICB9XHJcbiAgICBvblJpZ2h0QnV0dG9uVXAoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5ICYmIHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5ID09PSBzcXVhcmVLZXkpe1xyXG4gICAgICAgICAgICBsZXQgcmlnaHRDbGlja2VkID0gdGhpcy5yaWdodENsaWNrc1tzcXVhcmVLZXldO1xyXG4gICAgICAgICAgICBpZiAocmlnaHRDbGlja2VkKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDbGlja0dyb3VwLnJlbW92ZUNoaWxkKHJpZ2h0Q2xpY2tlZC5yZWN0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDbGlja3Nbc3F1YXJlS2V5XSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUmlnaHRDbGlja0hpZ2hsaWdodChzcXVhcmVLZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuc291cmNlSGlnaGxpZ2h0KTtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMudGFyZ2V0SGlnaGxpZ2h0KTtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMucmlnaHRDbGlja3MpLmZvckVhY2gocmlnaHRDbGljayA9PntcclxuICAgICAgICAgICAgaWYgKHJpZ2h0Q2xpY2spe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQb3NpdGlvbihyaWdodENsaWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc2hvd1RhcmdldEFuZFNvdXJjZShmcm9tOnN0cmluZywgdG86c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmNsZWFyQWxsSGlnaGxpZ2h0cygpO1xyXG4gICAgICAgIHRoaXMuc2hvd1RhcmdldE9yU291cmNlKGZyb20sIHRoaXMuc291cmNlSGlnaGxpZ2h0LCB0aGlzLnNvdXJjZUNvbG9yKTtcclxuICAgICAgICB0aGlzLnNob3dUYXJnZXRPclNvdXJjZSh0bywgdGhpcy50YXJnZXRIaWdobGlnaHQsIHRoaXMudGFyZ2V0Q29sb3IpO1xyXG4gICAgfVxyXG4gICAgc2hvd1RhcmdldE9yU291cmNlKHNxdWFyZUtleTpzdHJpbmcsIGhpZ2hsaWdodDpIaWdobGlnaHQsIGNvbG9yOnN0cmluZyl7XHJcbiAgICAgICAgaGlnaGxpZ2h0LnNxdWFyZUtleSA9IHNxdWFyZUtleTtcclxuICAgICAgICBoaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKGhpZ2hsaWdodCk7XHJcbiAgICB9XHJcbiAgICBjbGVhckFsbEhpZ2hsaWdodHMoKXtcclxuICAgICAgICB0aGlzLnNvdXJjZUhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJ0cmFuc3BhcmVudFwiKTtcclxuICAgICAgICB0aGlzLnRhcmdldEhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJ0cmFuc3BhcmVudFwiKTtcclxuICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tzID0ge307XHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrR3JvdXAuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH1cclxuICAgIGNyZWF0ZVJpZ2h0Q2xpY2tIaWdobGlnaHQoc3F1YXJlS2V5OnN0cmluZyl7XHJcbiAgICAgICAgbGV0IGNvcmRzID0gU2hhcmVkLmdldENvcmRpbmF0ZXNCeVNxdWFyZUtleShzcXVhcmVLZXksIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICBsZXQgcmVjdCA9IFNWR1NxdWFyZS5jcmVhdGVSZWN0KGNvcmRzLngsIGNvcmRzLnkpO1xyXG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLnJpZ2h0Q2xpY2tDb2xvcik7XHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrR3JvdXAuYXBwZW5kQ2hpbGQocmVjdCk7XHJcbiAgICAgICAgdGhpcy5yaWdodENsaWNrc1tzcXVhcmVLZXldID0ge3NxdWFyZUtleSwgdHlwZTogXCJSaWdodENsaWNrXCIsIHJlY3R9O1xyXG4gICAgfVxyXG4gICAgc2V0UG9zaXRpb24oaGlnaGxpZ2h0OkhpZ2hsaWdodCl7XHJcbiAgICAgICAgbGV0IGNvcmQgPSBTaGFyZWQuZ2V0Q29yZGluYXRlc0J5U3F1YXJlS2V5KGhpZ2hsaWdodC5zcXVhcmVLZXksIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICBoaWdobGlnaHQucmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIChjb3JkLnggKiAxMDApLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGhpZ2hsaWdodC5yZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgKGNvcmQueSAqIDEwMCkudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVCb2FyZFJlY3QoeDpudW1iZXIsIHk6bnVtYmVyLCBjb2xvcjpzdHJpbmcpe1xyXG4gICAgICAgIGxldCByZWN0ID0gU1ZHU3F1YXJlLmNyZWF0ZVJlY3QoeCwgeSk7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yID09PSBcImxcIiA/IFwicmdiKDIzMywyMzcsMjA0KVwiIDogXCJyZ2IoMTE5LDE1Myw4NClcIik7XHJcbiAgICAgICAgcmV0dXJuIHJlY3Q7XHJcbiAgICB9XHJcbn0iLCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcmRzTGF5ZXJ7XHJcbiAgICBncm91cDpTVkdHRWxlbWVudDtcclxuICAgIGhvcml6b250YWxHcm91cDpTVkdHRWxlbWVudDtcclxuICAgIHZlcnRpY2FsR3JvdXA6U1ZHR0VsZW1lbnQ7XHJcbiAgICBpc1JvdGF0ZWQ6Ym9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBcIkhlbHZldGljYVwiKTtcclxuICAgICAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZShcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKTtcclxuICAgICAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJyZ2IoMzAsMzAsMzBcIik7XHJcbiAgICAgICAgc3ZnUm9vdC5hcHBlbmQodGhpcy5ncm91cCk7XHJcblxyXG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgdGhpcy52ZXJ0aWNhbEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5ob3Jpem9udGFsR3JvdXApO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy52ZXJ0aWNhbEdyb3VwKTtcclxuXHJcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsR3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDg2LCA3OTUuNSlcIik7XHJcbiAgICAgICAgdGhpcy52ZXJ0aWNhbEdyb3VwLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSg1LCAxOClcIik7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0SG9yaXpvbnRhbENvcmRzKGlzUm90YXRlZCkuZm9yRWFjaCgobGV0dGVyLCBpbmRleCkgPT57XHJcbiAgICAgICAgICAgIGxldCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgICAgICBncm91cC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoaW5kZXggKiAxMDApLnRvU3RyaW5nKCkgKyBcIiwwKVwiKTtcclxuICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsR3JvdXAuYXBwZW5kQ2hpbGQoZ3JvdXApO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwidGV4dFwiKTtcclxuICAgICAgICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJzY2FsZSgwLjkpXCIpO1xyXG4gICAgICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gbGV0dGVyO1xyXG4gICAgICAgICAgICBncm91cC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdldFZlcnRpY2FsQ29yZHMoaXNSb3RhdGVkKS5mb3JFYWNoKChudW1iZXIsIGluZGV4KSA9PntcclxuICAgICAgICAgICAgbGV0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgICAgIGdyb3VwLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLFwiICsgKyAoaW5kZXggKiAxMDApLnRvU3RyaW5nKCkgKyBcIilcIik7XHJcbiAgICAgICAgICAgIHRoaXMudmVydGljYWxHcm91cC5hcHBlbmRDaGlsZChncm91cCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJ0ZXh0XCIpO1xyXG4gICAgICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gbnVtYmVyO1xyXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInNjYWxlKDEpXCIpO1xyXG4gICAgICAgICAgICBncm91cC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldEhvcml6b250YWxDb3Jkcyhpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGhvcml6b250YWxDb3JkcyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIiwgXCJIXCJdO1xyXG4gICAgICAgIHJldHVybiBpc1JvdGF0ZWQgPyBob3Jpem9udGFsQ29yZHMucmV2ZXJzZSgpIDogaG9yaXpvbnRhbENvcmRzO1xyXG4gICAgfVxyXG4gICAgZ2V0VmVydGljYWxDb3Jkcyhpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IHZlcnRpY2FsQ29yZHMgPSBbXCI4XCIsIFwiN1wiLCBcIjZcIiwgXCI1XCIsIFwiNFwiLCBcIjNcIiwgXCIyXCIsIFwiMVwiXTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gdmVydGljYWxDb3Jkcy5yZXZlcnNlKCkgOiB2ZXJ0aWNhbENvcmRzO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICBsZXQgbGV0dGVycyA9IHRoaXMuZ2V0SG9yaXpvbnRhbENvcmRzKGlzUm90YXRlZCk7XHJcbiAgICAgICAgbGV0IG51bWJlcnMgPSB0aGlzLmdldFZlcnRpY2FsQ29yZHMoaXNSb3RhdGVkKTtcclxuICAgICAgICBBcnJheS5mcm9tKHRoaXMuaG9yaXpvbnRhbEdyb3VwLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICBjaGlsZC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IGxldHRlcnNbaW5kZXhdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIEFycmF5LmZyb20odGhpcy52ZXJ0aWNhbEdyb3VwLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICBjaGlsZC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IG51bWJlcnNbaW5kZXhdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFNWR1NxdWFyZSBmcm9tIFwiLi4vU3F1YXJlRmFjdG9yeVwiO1xyXG5pbXBvcnQgU2hhcmVkIGZyb20gXCIuLi9TaGFyZWRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdXNlTGF5ZXJ7XHJcbiAgICBzdmdSb290OlNWR1NWR0VsZW1lbnQ7XHJcbiAgICByZWN0czpSZWNvcmQ8c3RyaW5nLCBTVkdSZWN0RWxlbWVudD4gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQpe1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdCA9IHN2Z1Jvb3Q7XHJcbiAgICB9XHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgZ3JvdXAuc2V0QXR0cmlidXRlKFwiZmlsbC1vcGFjaXR5XCIsIFwiMFwiKTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QuYXBwZW5kQ2hpbGQoZ3JvdXApO1xyXG4gICAgICAgIGxldCBpbmRleCA9IDA7XHJcbiAgICAgICAgWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddLmZvckVhY2goeSA9PntcclxuICAgICAgICAgICAgWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddLmZvckVhY2goeCA9PntcclxuICAgICAgICAgICAgICAgIGxldCByZWN0ID0gdGhpcy5jcmVhdGVSZWN0KHgseSk7XHJcbiAgICAgICAgICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIiwgKGluZGV4KS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjdHNbaW5kZXgrK10gPSByZWN0O1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQocmVjdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlUmVjdCh4Om51bWJlciwgeTpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBTVkdTcXVhcmUuY3JlYXRlUmVjdCh4LCB5KTtcclxuICAgIH1cclxuICAgIGVuYWJsZUhvdmVyKHNxdWFyZUtleTpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgaW5kZXggPSBTaGFyZWQuZ2V0Q3VycmVudEluZGV4T2ZTcXVhcmVLZXkoc3F1YXJlS2V5LCBpc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMucmVjdHNbaW5kZXhdLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiY3Vyc29yOnBvaW50ZXJcIik7XHJcbiAgICB9XHJcbiAgICBkaXNhYmxlSG92ZXIoc3F1YXJlS2V5OnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBpbmRleCA9IFNoYXJlZC5nZXRDdXJyZW50SW5kZXhPZlNxdWFyZUtleShzcXVhcmVLZXksIGlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5yZWN0c1tpbmRleF0ucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5yZWN0cykuZm9yRWFjaChyZWN0ID0+e1xyXG4gICAgICAgICAgICByZWN0LnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGllY2UgfSBmcm9tIFwiLi4vUGllY2VcIjtcclxuaW1wb3J0IHsgUGllY2VGYWN0b3J5IH0gZnJvbSBcIi4uL1BpZWNlRmFjdG9yeVwiO1xyXG5pbXBvcnQgTW91c2VMYXllciBmcm9tIFwiLi9Nb3VzZUxheWVyXCI7XHJcbmltcG9ydCBTaGFyZWQgZnJvbSBcIi4uL1NoYXJlZFwiO1xyXG5pbXBvcnQgQm9hcmRMYXllciBmcm9tIFwiLi9Cb2FyZExheWVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaWVjZUxheWVye1xyXG4gICAgZ3JvdXA6U1ZHR0VsZW1lbnQ7XHJcbiAgICBwb3NpdGlvbnM6UmVjb3JkPHN0cmluZywgUGllY2V8bnVsbD4gPSB7fTtcclxuICAgIGJvYXJkTGF5ZXI6Qm9hcmRMYXllcjtcclxuICAgIG1vdXNlTGF5ZXI6TW91c2VMYXllcjtcclxuICAgIGlzUm90YXRlZCA9IGZhbHNlO1xyXG4gICAgcGllY2VUeXBlczpSZWNvcmQ8c3RyaW5nLCBTVkdHRWxlbWVudD4gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdmdSb290OlNWR1NWR0VsZW1lbnQsIGJvYXJkTGF5ZXI6Qm9hcmRMYXllciwgbW91c2VMYXllcjpNb3VzZUxheWVyKXtcclxuICAgICAgICB0aGlzLmJvYXJkTGF5ZXIgPSBib2FyZExheWVyO1xyXG4gICAgICAgIHRoaXMubW91c2VMYXllciA9IG1vdXNlTGF5ZXI7XHJcbiAgICAgICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgIHN2Z1Jvb3QuYXBwZW5kQ2hpbGQodGhpcy5ncm91cCk7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25zID0ge307XHJcbiAgICAgICAgdGhpcy5ncm91cC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMubW91c2VMYXllci5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgYWRkUGllY2UoZmVuQ2hhcjpzdHJpbmcsIHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBnID0gUGllY2VGYWN0b3J5LmdldChmZW5DaGFyKTtcclxuICAgICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKGcpO1xyXG4gICAgICAgIGxldCBwaWVjZSA9IG5ldyBQaWVjZShnLCBmZW5DaGFyKTtcclxuICAgICAgICB0aGlzLnNldFBpZWNlUG9zaXRpb24ocGllY2UsIHNxdWFyZUtleSk7XHJcbiAgICB9XHJcbiAgICBvbkRyb3AocGllY2U6UGllY2UsIHNxdWFyZUluZGV4WDpudW1iZXIsIHNxdWFyZUluZGV4WTpudW1iZXIpe1xyXG4gICAgICAgIGxldCBkZXN0aW5hdGlvblNxdWFyZUtleSA9IFNoYXJlZC5nZXRTcXVhcmVLZXlCeUluZGV4ZXMoc3F1YXJlSW5kZXhYLCBzcXVhcmVJbmRleFksIHRoaXMuaXNSb3RhdGVkKVxyXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQocGllY2UuZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKHBpZWNlLnNxdWFyZUtleSA9PT0gZGVzdGluYXRpb25TcXVhcmVLZXkpe1xyXG4gICAgICAgICAgICB0aGlzLnNldFBpZWNlUG9zaXRpb24ocGllY2UsIGRlc3RpbmF0aW9uU3F1YXJlS2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlUGllY2UocGllY2Uuc3F1YXJlS2V5ISwgZGVzdGluYXRpb25TcXVhcmVLZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uRHJvcENhbmNlbChwaWVjZTpQaWVjZSl7XHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChwaWVjZS5lbGVtZW50KTtcclxuICAgICAgICB0aGlzLnNldFBpZWNlUG9zaXRpb24ocGllY2UsIHBpZWNlLnNxdWFyZUtleSEpO1xyXG4gICAgfVxyXG4gICAgbW92ZVBpZWNlKGZyb206c3RyaW5nLCB0bzpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMubW91c2VMYXllci5kaXNhYmxlSG92ZXIoZnJvbSwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMubW91c2VMYXllci5lbmFibGVIb3Zlcih0bywgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIGxldCBwaWVjZSA9IHRoaXMucG9zaXRpb25zW2Zyb21dITtcclxuICAgICAgICBsZXQgZXhpc3RpbmdQaWVjZSA9IHRoaXMucG9zaXRpb25zW3RvXTtcclxuICAgICAgICBpZiAoZXhpc3RpbmdQaWVjZSl7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXAucmVtb3ZlQ2hpbGQoZXhpc3RpbmdQaWVjZS5lbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnNbdG9dID0gcGllY2U7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnNbZnJvbV0gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2V0UGllY2VQb3NpdGlvbihwaWVjZSAsdG8pO1xyXG4gICAgICAgIHRoaXMuYm9hcmRMYXllci5zaG93VGFyZ2V0QW5kU291cmNlKGZyb20sIHRvKTtcclxuICAgIH1cclxuICAgIHJvdGF0ZShpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgbGV0IHBpZWNlcyA9IE9iamVjdC52YWx1ZXModGhpcy5wb3NpdGlvbnMpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25zID0ge307XHJcbiAgICAgICAgdGhpcy5tb3VzZUxheWVyLmNsZWFyKCk7XHJcbiAgICAgICAgcGllY2VzLmZvckVhY2gocGllY2UgPT57XHJcbiAgICAgICAgICAgIGlmIChwaWVjZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBpZWNlUG9zaXRpb24ocGllY2UsIHBpZWNlLnNxdWFyZUtleSEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFBpZWNlUG9zaXRpb24ocGllY2U6UGllY2UsIHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIGxldCB4ID0gKHRoaXMuaXNSb3RhdGVkID8gXCJoZ2ZlZGNiYVwiIDogXCJhYmNkZWZnaFwiKS5pbmRleE9mKHNxdWFyZUtleVswXSkgKiAxMDA7XHJcbiAgICAgICAgbGV0IHkgPSAocGFyc2VJbnQoc3F1YXJlS2V5WzFdKSAtMSkgKiAxMDA7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzUm90YXRlZCl7XHJcbiAgICAgICAgICAgIHkgPSA3MDAgLSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvc2l0aW9uc1tzcXVhcmVLZXldID0gcGllY2U7XHJcbiAgICAgICAgcGllY2Uuc3F1YXJlS2V5ID0gc3F1YXJlS2V5O1xyXG4gICAgICAgIHBpZWNlLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiKTtcclxuICAgICAgICB0aGlzLm1vdXNlTGF5ZXIuZW5hYmxlSG92ZXIoc3F1YXJlS2V5LCB0aGlzLmlzUm90YXRlZCk7XHJcbiAgICB9XHJcbn0iLCJcclxuZXhwb3J0IGNsYXNzIFBpZWNle1xyXG4gICAgZWxlbWVudDpTVkdHRWxlbWVudDtcclxuICAgIGZlbkNoYXI6c3RyaW5nO1xyXG4gICAgc3F1YXJlS2V5OnN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDpTVkdHRWxlbWVudCwgZmVuQ2hhcjpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5mZW5DaGFyID0gZmVuQ2hhcjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBiaXNob3AgZnJvbSBcIi4vYXNzZXRzL3BpZWNlcy9iLmpzb25cIjtcclxuaW1wb3J0ICogYXMga2luZyBmcm9tIFwiLi9hc3NldHMvcGllY2VzL2suanNvblwiO1xyXG5pbXBvcnQgKiBhcyBrbmlnaHQgZnJvbSBcIi4vYXNzZXRzL3BpZWNlcy9uLmpzb25cIjtcclxuaW1wb3J0ICogYXMgcGF3biBmcm9tIFwiLi9hc3NldHMvcGllY2VzL3AuanNvblwiO1xyXG5pbXBvcnQgKiBhcyBxdWVlbiBmcm9tIFwiLi9hc3NldHMvcGllY2VzL3EuanNvblwiO1xyXG5pbXBvcnQgKiBhcyByb29rIGZyb20gXCIuL2Fzc2V0cy9waWVjZXMvci5qc29uXCI7XHJcblxyXG5jb25zdCBwaWVjZVNWR0RhdGE6UmVjb3JkPHN0cmluZywgU1ZHR3JvdXA+ID0ge307XHJcbnBpZWNlU1ZHRGF0YVtcInBcIl0gPSBwYXduLmcgYXMgU1ZHR3JvdXA7XHJcbnBpZWNlU1ZHRGF0YVtcInJcIl0gPSByb29rLmcgYXMgU1ZHR3JvdXA7XHJcbnBpZWNlU1ZHRGF0YVtcIm5cIl0gPSBrbmlnaHQuZyBhcyBTVkdHcm91cDtcclxucGllY2VTVkdEYXRhW1wiYlwiXSA9IGJpc2hvcC5nIGFzIFNWR0dyb3VwO1xyXG5waWVjZVNWR0RhdGFbXCJxXCJdID0gcXVlZW4uZyBhcyBTVkdHcm91cDtcclxucGllY2VTVkdEYXRhW1wia1wiXSA9IGtpbmcuZyBhcyBTVkdHcm91cDtcclxuXHJcbmludGVyZmFjZSBTVkdHcm91cHtcclxuICAgIGc6IFNWR0dyb3VwfHVuZGVmaW5lZDtcclxuICAgIHRyYW5zZm9ybTpzdHJpbmd8dW5kZWZpbmVkO1xyXG4gICAgc3R5bGU6c3RyaW5nW118dW5kZWZpbmVkO1xyXG4gICAgcGF0aDpQYXRoW118dW5kZWZpbmVkfG51bGw7XHJcbiAgICBjaXJjbGU6Q2lyY2xlW118dW5kZWZpbmVkO1xyXG59XHJcbmludGVyZmFjZSBQYXRoe1xyXG4gICAgc3R5bGU6c3RyaW5nW118dW5kZWZpbmVkO1xyXG4gICAgZDpzdHJpbmc7XHJcbiAgICBjb2xvckluZGV4Om51bWJlcnx1bmRlZmluZWQ7XHJcbn1cclxuaW50ZXJmYWNlIENpcmNsZXtcclxuICAgIGN4OnN0cmluZztcclxuICAgIGN5OnN0cmluZztcclxuICAgIHI6c3RyaW5nO1xyXG59XHJcbmNvbnN0IHBpZWNlVHlwZXM6UmVjb3JkPHN0cmluZywgU1ZHR0VsZW1lbnQ+ID0ge307XHJcbltcInBcIixcIm5cIixcImJcIixcInJcIixcInFcIixcImtcIixcIlBcIixcIk5cIixcIkJcIixcIlJcIixcIlFcIixcIktcIl0uZm9yRWFjaChmZW5DaGFyID0+e1xyXG4gICAgbGV0IGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgIGxldCBkYXRhID0gcGllY2VTVkdEYXRhW2ZlbkNoYXIudG9Mb3dlckNhc2UoKV07XHJcbiAgICBsZXQgY29sb3IgPSBmZW5DaGFyID09PSBmZW5DaGFyLnRvTG93ZXJDYXNlKCkgPyAwIDogMTtcclxuICAgIGxvYWRDaGlsZHJlbihnLCBkYXRhLCBjb2xvcik7XHJcbiAgICBwaWVjZVR5cGVzW2ZlbkNoYXJdID0gZztcclxufSk7XHJcbmZ1bmN0aW9uIGxvYWRDaGlsZHJlbihnOlNWR0dFbGVtZW50LCBncm91cDpTVkdHcm91cCwgY29sb3I6bnVtYmVyKXtcclxuICAgIGlmIChncm91cC50cmFuc2Zvcm0pe1xyXG4gICAgICAgIGcuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIGdyb3VwLnRyYW5zZm9ybSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZ3JvdXAuc3R5bGUgJiYgZ3JvdXAuc3R5bGVbY29sb3JdKXtcclxuICAgICAgICBnLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGdyb3VwLnN0eWxlW2NvbG9yXSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZ3JvdXAuY2lyY2xlKXtcclxuICAgICAgICBncm91cC5jaXJjbGUuZm9yRWFjaChjaXJjbGUgPT57XHJcbiAgICAgICAgICAgIGxldCBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdjaXJjbGUnKTtcclxuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBjaXJjbGUuY3gpO1xyXG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShcImN5XCIsIGNpcmNsZS5jeSk7XHJcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKFwiclwiLCBjaXJjbGUucik7XHJcbiAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQoYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZ3JvdXAucGF0aCl7XHJcbiAgICAgICAgZ3JvdXAucGF0aC5mb3JFYWNoKHBhdGggPT57XHJcbiAgICAgICAgICAgIGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XHJcbiAgICAgICAgICAgIGlmIChwYXRoLmNvbG9ySW5kZXggPT09IHVuZGVmaW5lZCB8fCBwYXRoLmNvbG9ySW5kZXggPT09IGNvbG9yKXtcclxuICAgICAgICAgICAgICAgIHAuc2V0QXR0cmlidXRlKFwiZFwiLCBwYXRoLmQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGguc3R5bGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHAuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgcGF0aC5zdHlsZVtjb2xvcl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGdyb3VwLmcpe1xyXG4gICAgICAgIGxldCBjaGlsZEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgZy5hcHBlbmRDaGlsZChjaGlsZEdyb3VwKTtcclxuICAgICAgICBsb2FkQ2hpbGRyZW4oY2hpbGRHcm91cCwgZ3JvdXAuZywgY29sb3IpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBuYW1lc3BhY2UgUGllY2VGYWN0b3J5e1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldChmZW5DaGFyOnN0cmluZyk6U1ZHR0VsZW1lbnR7XHJcbiAgICAgICAgcmV0dXJuIHBpZWNlVHlwZXNbZmVuQ2hhcl0uY2xvbmVOb2RlKHRydWUpIGFzIFNWR0dFbGVtZW50O1xyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBTaGFyZWR7XHJcbiAgICBjb25zdCBzcXVhcmVLZXlzID0gW1wiYThcIiwgXCJiOFwiLCBcImM4XCIsIFwiZDhcIiwgXCJlOFwiLCBcImY4XCIsIFwiZzhcIiwgXCJoOFwiLCBcImE3XCIsIFwiYjdcIiwgXCJjN1wiLCBcImQ3XCIsIFwiZTdcIiwgXCJmN1wiLCBcImc3XCIsIFwiaDdcIiwgXCJhNlwiLCBcImI2XCIsIFwiYzZcIiwgXCJkNlwiLCBcImU2XCIsIFwiZjZcIiwgXCJnNlwiLCBcImg2XCIsIFwiYTVcIiwgXCJiNVwiLCBcImM1XCIsIFwiZDVcIiwgXCJlNVwiLCBcImY1XCIsIFwiZzVcIiwgXCJoNVwiLCBcImE0XCIsIFwiYjRcIiwgXCJjNFwiLCBcImQ0XCIsIFwiZTRcIiwgXCJmNFwiLCBcImc0XCIsIFwiaDRcIiwgXCJhM1wiLCBcImIzXCIsIFwiYzNcIiwgXCJkM1wiLCBcImUzXCIsIFwiZjNcIiwgXCJnM1wiLCBcImgzXCIsIFwiYTJcIiwgXCJiMlwiLCBcImMyXCIsIFwiZDJcIiwgXCJlMlwiLCBcImYyXCIsIFwiZzJcIiwgXCJoMlwiLCBcImExXCIsIFwiYjFcIiwgXCJjMVwiLCBcImQxXCIsIFwiZTFcIiwgXCJmMVwiLCBcImcxXCIsIFwiaDFcIl07XHJcbiAgICBjb25zdCBob3Jpem9udGFsID0gW1wiYVwiLCBcImJcIiwgXCJjXCIsIFwiZFwiLCBcImVcIiwgXCJmXCIsIFwiZ1wiLCBcImhcIl07XHJcbiAgICBjb25zdCB2ZXJ0aWNhbCA9IFtcIjhcIiwgXCI3XCIsIFwiNlwiLCBcIjVcIiwgXCI0XCIsIFwiM1wiLCBcIjJcIiwgXCIxXCJdO1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRTcXVhcmVLZXlCeUluZGV4ZXMoaG9yaXpvbnRhbEluZGV4Om51bWJlciwgdmVydGljYWxJbmRleDpudW1iZXIsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgbGV0dGVySW5kZXggPSBpc1JvdGF0ZWQgPyA3IC0gaG9yaXpvbnRhbEluZGV4IDogaG9yaXpvbnRhbEluZGV4O1xyXG4gICAgICAgIGxldCBkaWdpdEluZGV4ID0gaXNSb3RhdGVkID8gNyAtIHZlcnRpY2FsSW5kZXggOiB2ZXJ0aWNhbEluZGV4O1xyXG4gICAgICAgIHJldHVybiBob3Jpem9udGFsW2xldHRlckluZGV4XSArIHZlcnRpY2FsW2RpZ2l0SW5kZXhdO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFNxdWFyZUtleUJ5SW5kZXgoaW5kZXg6bnVtYmVyLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGkgPSBpc1JvdGF0ZWQgPyA2MyAtIGluZGV4IDogaW5kZXg7XHJcbiAgICAgICAgcmV0dXJuIHNxdWFyZUtleXNbaV07XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudEluZGV4T2ZTcXVhcmVLZXkoc3F1YXJlS2V5OnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBpbmRleCA9IHNxdWFyZUtleXMuaW5kZXhPZihzcXVhcmVLZXkpO1xyXG4gICAgICAgIHJldHVybiBpc1JvdGF0ZWQgPyA2MyAtIGluZGV4IDogaW5kZXg7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0SG9yaXpvbnRhbEluZGV4KHNxdWFyZUxldHRlcjpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgaW5kZXggPSBob3Jpem9udGFsLmluZGV4T2Yoc3F1YXJlTGV0dGVyKTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gNyAtIGluZGV4IDogaW5kZXg7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0VmVydGljYWxJbmRleChzcXVhcmVOdW1iZXI6c3RyaW5nLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdmVydGljYWwuaW5kZXhPZihzcXVhcmVOdW1iZXIpO1xyXG4gICAgICAgIHJldHVybiBpc1JvdGF0ZWQgPyA3IC0gaW5kZXggOiBpbmRleDtcclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRDb3JkaW5hdGVzQnlTcXVhcmVLZXkoc3F1YXJlS2V5OnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCB4ID0gZ2V0SG9yaXpvbnRhbEluZGV4KHNxdWFyZUtleVswXSwgaXNSb3RhdGVkKTtcclxuICAgICAgICBsZXQgeSA9IGdldFZlcnRpY2FsSW5kZXgoc3F1YXJlS2V5WzFdLCBpc1JvdGF0ZWQpO1xyXG4gICAgICAgIHJldHVybiB7IHgsIHkgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBTaGFyZWQ7XHJcbiIsIm5hbWVzcGFjZSBTVkdTcXVhcmV7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVjdCh4Om51bWJlciwgeTpudW1iZXIpe1xyXG4gICAgICAgIGxldCByZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdyZWN0Jyk7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsICh4ICogMTAwKS50b1N0cmluZygpKTtcclxuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgKHkgKiAxMDApLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgXCIxMDBcIik7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgXCIxMDBcIik7XHJcbiAgICAgICAgcmV0dXJuIHJlY3Q7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgU1ZHU3F1YXJlIiwiaW1wb3J0IEljb25zIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2NoZXNzL0ljb25zXCI7XHJcbmltcG9ydCBcIi4vb3BlbmluZ3MuY3NzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUJhY2tncm91bmQsIHNldFRhcmdldEFuZFNvdXJjZSwgZ2V0Qm91bmRpbmdCb3hPZlN2Z1BhdGggfSBmcm9tIFwiLi9CYWNrZ3JvdW5kXCI7XHJcbmltcG9ydCBib2FyZDIgZnJvbSBcIi4vYm9hcmQyLnN2Z1wiO1xyXG5pbXBvcnQgQ2hlc3Nib2FyZCBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy92Mi9jaGVzc2JvYXJkL0NoZXNzYm9hcmRcIjtcclxuLy8gaW1wb3J0IENoZXNzZ2FtZSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9zdmcvQ2hlc3NnYW1lXCI7XHJcblxyXG5sZXQgYm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoZXNzYm9hcmRcIikgYXMgSFRNTEVsZW1lbnQ7XHJcbmxldCBjaGVzc2JvYXJkID0gbmV3IENoZXNzYm9hcmQoYm9hcmRDb250YWluZXIsIFwic3RhcnRcIiwgZmFsc2UpO1xyXG5cclxuLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXN0XCIpIS5vbmNsaWNrID0gKCkgPT4gY2hlc3Nib2FyZC50ZXN0KCk7XHJcbi8vIGxldCBmID1cInI3LzNxcDFrMS8xcDFwMXBQMS9wMW5QMVAyL1BuUDUvNEIzLzRCMy8xUTNLMiB3IC0gLSAxIDI4XCI7XHJcbi8vIGxldCBmZW4gPSBcIjgva3BQSzQvOC84LzgvOC84LzhcIjtcclxuLy8gbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZUluZm9Db250YWluZXJcIikgYXMgSFRNTEVsZW1lbnQ7XHJcbi8vIGxldCBjaGVzc2dhbWUgPSBuZXcgQ2hlc3NnYW1lKGNvbnRhaW5lciwgZmVuLCB0cnVlKTs7XHJcblxyXG5cclxuXHJcblxyXG4vLyBsZXQgaW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteS1pbWdcIikgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuLy8gaW1nLnNyYyA9IGJvYXJkMjtcclxuLy8gbGV0IHN2ZyA9IGNyZWF0ZUJhY2tncm91bmQoKTtcclxuLy8gZG9jdW1lbnQuYm9keS5hcHBlbmQoc3ZnKTtcclxuLy8gZGVidWdnZXI7XHJcblxyXG4vLyBzZXRUYXJnZXRBbmRTb3VyY2UoXCJlMlwiLCBcImU0XCIsIHN2Zyk7XHJcblxyXG4vLyBsZXQgYm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkXCIpIGFzIEhUTUxFbGVtZW50O1xyXG4vLyBsZXQgc3ZnID0gYm9hcmQuZmlyc3RDaGlsZCBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4vLyBzdmcuc3JjID0gYm9hcmRiZztcclxuLy8gZm9yIChsZXQgZWxlbWVudCBvZiBib2FyZC5jaGlsZHJlbil7XHJcbi8vICAgICBpZiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYmFja2dyb3VuZFwiKSl7XHJcbi8vICAgICAgICAgbGV0IGltYWdlID0gZWxlbWVudC5sYXN0Q2hpbGQgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuLy8gICAgICAgICBpZiAoaW1hZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwid3BcIikpe1xyXG4vLyAgICAgICAgICAgICBpbWFnZS5zcmMgPSBJY29ucy5QaWVjZVVybFtcIlBcIl07XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGVsc2UgaWYgKGltYWdlLmNsYXNzTGlzdC5jb250YWlucyhcIndyXCIpKXtcclxuLy8gICAgICAgICAgICAgaW1hZ2Uuc3JjID0gSWNvbnMuUGllY2VVcmxbXCJSXCJdO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBlbHNlIGlmIChpbWFnZS5jbGFzc0xpc3QuY29udGFpbnMoXCJ3blwiKSl7XHJcbi8vICAgICAgICAgICAgIGltYWdlLnNyYyA9IEljb25zLlBpZWNlVXJsW1wiTlwiXTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgZWxzZSBpZiAoaW1hZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwid2JcIikpe1xyXG4vLyAgICAgICAgICAgICBpbWFnZS5zcmMgPSBJY29ucy5QaWVjZVVybFtcIkJcIl07XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGVsc2UgaWYgKGltYWdlLmNsYXNzTGlzdC5jb250YWlucyhcIndxXCIpKXtcclxuLy8gICAgICAgICAgICAgaW1hZ2Uuc3JjID0gSWNvbnMuUGllY2VVcmxbXCJRXCJdO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBlbHNlIGlmIChpbWFnZS5jbGFzc0xpc3QuY29udGFpbnMoXCJ3a1wiKSl7XHJcbi8vICAgICAgICAgICAgIGltYWdlLnNyYyA9IEljb25zLlBpZWNlVXJsW1wiS1wiXTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbiAgICBcclxuLy8gfVxyXG4vLyBsZXQgcXVlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCIqXCIpWzY4XTtcclxuLy8gbGV0IGJib3ggPSBraW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4vLyBjb25zb2xlLmxvZyhiYm94KTtcclxuXHJcbi8vIGxldCBzdmdUYWdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzdmdcIikgYXMgSFRNTENvbGxlY3Rpb25PZjxTVkdFbGVtZW50PjtcclxuLy8gbGV0IHF1ZWVuID0gc3ZnVGFnc1sxXSBhcyBTVkdFbGVtZW50O1xyXG4vLyBnZXRCb3VuZGluZ0JveE9mU3ZnUGF0aChxdWVlbik7XHJcblxyXG4vLyBpbXBvcnQgXCIuLi9tYXN0ZXIuY3NzXCI7XHJcbi8vIGltcG9ydCB7IENoZXNzYm9hcmQgfSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9jaGVzcy9DaGVzc2JvYXJkXCI7XHJcblxyXG4vLyBsZXQgY2hlc3Nib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlc3Nib2FyZFwiKSBhcyBIVE1MRWxlbWVudDtcclxuLy8gbGV0IGNoZXNzYm9hcmQgPSBuZXcgQ2hlc3Nib2FyZChjaGVzc2JvYXJkQ29udGFpbmVyLCBcInN0YXJ0XCIsIGZhbHNlKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=