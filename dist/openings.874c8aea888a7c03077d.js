"use strict";
(self["webpackChunkbest_chess_games"] = self["webpackChunkbest_chess_games"] || []).push([["openings"],{

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/svg/ui.css":
/*!*************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/svg/ui.css ***!
  \*************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, `/* svg rect.d {fill:rgb(119,153,84)}
svg rect.l {fill:rgb(233,237,204)} */
/* svg rect.source{fill: rgb(255, 255, 51, 0.3)} Todo: */`, "",{"version":3,"sources":["webpack://./src/components/svg/ui.css"],"names":[],"mappings":"AAAA;oCACoC;AACpC,wDAAwD","sourcesContent":["/* svg rect.d {fill:rgb(119,153,84)}\r\nsvg rect.l {fill:rgb(233,237,204)} */\r\n/* svg rect.source{fill: rgb(255, 255, 51, 0.3)} Todo: */"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

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

/***/ "./src/components/svg/ui.css":
/*!***********************************!*\
  !*** ./src/components/svg/ui.css ***!
  \***********************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ui_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./ui.css */ "./node_modules/css-loader/dist/cjs.js!./src/components/svg/ui.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ui_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ui_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_ui_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_ui_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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

/***/ "./src/components/svg/DragAndDrop.ts":
/*!*******************************************!*\
  !*** ./src/components/svg/DragAndDrop.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DragAndDrop = void 0;
const Shared_1 = __webpack_require__(/*! ./Shared */ "./src/components/svg/Shared.ts");
class DragAndDrop {
    constructor(pieceLayer, svgRoot, isRotated) {
        this.dragPiece = null;
        this.scrollTop = 0;
        this.deltaScrollTop = 0;
        this.scrollLeft = 0;
        this.deltaScrollLeft = 0;
        this.dragContainer = document.createElement("div");
        this.pieceLayer = pieceLayer;
        this.svgRoot = svgRoot;
        this.isRotated = isRotated;
        this.dragContainer.style.position = "absolute";
        this.dragContainer.style.transform = "translate(-50%,-50%)";
        svgRoot.parentElement.prepend(this.dragContainer);
        document.addEventListener("mouseup", (event) => {
            let isRightClick = event.button && event.button == 2;
            if (!isRightClick) {
                this.onMouseUp(event);
                event.preventDefault();
            }
        });
        document.addEventListener("mousemove", (event) => {
            this.onMouseMove(event);
            event.preventDefault();
        });
        this.svgRoot.addEventListener("scroll", () => {
            this.onScroll();
        });
    }
    rotate(isRotated) {
        this.isRotated = isRotated;
    }
    onLeftButtonDown(event) {
        let rect = event.target;
        let squareIndex = parseInt(rect.getAttribute("data-index"));
        let squareKey = Shared_1.Shared.getSquareKeyByIndex(squareIndex, this.isRotated);
        this.dragPiece = this.pieceLayer.positions[squareKey];
        if (this.dragPiece) {
            this.scrollTop = document.documentElement.scrollTop; // Drag position will be incorrect if we don't take scroll into consideration
            this.deltaScrollTop = 0; // Used to adjust the drag position if scrolling occurs during the drag
            this.scrollLeft = document.documentElement.scrollLeft;
            this.deltaScrollLeft = 0;
        }
    }
    onMouseMove(event) {
        if (this.dragPiece) {
            event.preventDefault();
            if (!this.dragContainer.firstChild) {
                let svgParent = this.svgRoot.parentElement;
                this.dragContainer.style.width = svgParent.clientWidth / 8 + "px";
                this.dragContainer.style.height = svgParent.clientHeight / 8 + "px";
                let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('viewBox', '0 0 8 8');
                svg.appendChild(this.dragPiece.element);
                this.dragPiece.element.setAttribute("transform", "scale(8)");
                this.dragContainer.appendChild(svg);
            }
            this.dragContainer.style.left = event.clientX + document.documentElement.scrollLeft + "px";
            this.dragContainer.style.top = event.clientY + document.documentElement.scrollTop + "px";
        }
    }
    onScroll() {
        if (this.dragPiece) {
            let newDeltaX = document.documentElement.scrollLeft - this.scrollLeft;
            let newDeltaY = document.documentElement.scrollTop - this.scrollTop;
            let changeInDeltaX = newDeltaX - this.deltaScrollLeft;
            let changeInDeltaY = newDeltaY - this.deltaScrollTop;
            this.deltaScrollLeft = newDeltaX;
            this.deltaScrollTop = newDeltaY;
            let left = parseFloat(this.dragContainer.style.left);
            let top = parseFloat(this.dragContainer.style.top);
            this.dragContainer.style.left = left + changeInDeltaX + "px";
            this.dragContainer.style.top = top + changeInDeltaY + "px";
        }
    }
    onMouseUp(event) {
        if (this.dragPiece) {
            let svgParent = this.svgRoot.parentElement;
            if (this.isClickOnElement(event, svgParent)) {
                let squareIndexX = Math.floor((100 * event.clientX / svgParent.clientWidth) / 12.5);
                let squareIndexY = Math.floor((100 * event.clientY / svgParent.clientHeight) / 12.5);
                this.pieceLayer.onDrop(this.dragPiece, squareIndexX, squareIndexY);
            }
            else {
                this.pieceLayer.onDropCancel(this.dragPiece);
            }
            this.dragPiece = null;
            this.dragContainer.innerHTML = "";
            this.dragContainer.style.width = "0px";
            this.dragContainer.style.height = "0px";
        }
    }
    isClickOnElement(event, element) {
        let rect = this.getOffsetRectangle(element);
        let point = this.getAbsoluteMousePosition(event);
        return point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height;
    }
    getOffsetRectangle(element) {
        let rect = { x: element.offsetLeft, y: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight };
        while (element.offsetParent instanceof HTMLElement) {
            element = element.offsetParent;
            rect.x += element.offsetLeft;
            rect.y += element.offsetTop;
        }
        return rect;
    }
    getAbsoluteMousePosition(event) {
        let x = event.clientX + document.documentElement.scrollLeft;
        let y = event.clientY + document.documentElement.scrollTop;
        return { x: x, y: y };
    }
}
exports.DragAndDrop = DragAndDrop;


/***/ }),

/***/ "./src/components/svg/Layers/ArrowLayer.ts":
/*!*************************************************!*\
  !*** ./src/components/svg/Layers/ArrowLayer.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArrowLayer = void 0;
const Shared_1 = __webpack_require__(/*! ../Shared */ "./src/components/svg/Shared.ts");
class ArrowLayer {
    constructor(svgRoot) {
        this.strokeWidth = 0.2;
        this.rightClickedSquareKey = null;
        this.isRotated = false;
        this.currentArrows = [];
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svgRoot.appendChild(group);
        this.svgRoot = svgRoot;
        this.group = group;
        this.svgRoot.addEventListener("mouseup", (event) => {
            let isRightClick = event.button && event.button == 2;
            if (isRightClick) {
                this.onRightButtonUp(event);
                event.preventDefault();
            }
        });
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
    onRightButtonDown(event) {
        let rect = event.target;
        let index = parseInt(rect.getAttribute("data-index"));
        this.rightClickedSquareKey = Shared_1.Shared.getSquareKeyByIndex(index, this.isRotated);
    }
    onRightButtonUp(event) {
        let rect = event.target;
        let index = parseInt(rect.getAttribute("data-index"));
        let squareKey = Shared_1.Shared.getSquareKeyByIndex(index, this.isRotated);
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
        let shortenDistance = 0.3;
        let center = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
        let triangleSideLength = 0.3;
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
        let x = Shared_1.Shared.getHorizontalIndex(char, this.isRotated) + 0.5;
        let y = Shared_1.Shared.getVerticalIndex(digit, this.isRotated) + 0.5;
        return { x, y };
    }
}
exports.ArrowLayer = ArrowLayer;


/***/ }),

/***/ "./src/components/svg/Layers/BoardLayer.ts":
/*!*************************************************!*\
  !*** ./src/components/svg/Layers/BoardLayer.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardLayer = void 0;
const SVGSquare_1 = __webpack_require__(/*! ../SVGSquare */ "./src/components/svg/SVGSquare.ts");
var BoardLayer;
(function (BoardLayer) {
    function createSVGRoot() {
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 8 8');
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(group);
        let colors = ["l", "d", "l", "d", "l", "d", "l", "d"];
        ["0", "1", "2", "3", "4", "5", "6", "7"].forEach(y => {
            ["0", "1", "2", "3", "4", "5", "6", "7"].forEach((x, index) => {
                group.appendChild(createRect(x, y, colors[index]));
            });
            colors = colors.reverse();
        });
        return svg;
    }
    BoardLayer.createSVGRoot = createSVGRoot;
    function createRect(x, y, className) {
        let rect = SVGSquare_1.SVGSquare.createRect(x, y);
        rect.setAttribute("fill", className === "l" ? "rgb(233,237,204)" : "rgb(119,153,84)");
        // rect.setAttribute("class", className);//??
        return rect;
    }
})(BoardLayer || (exports.BoardLayer = BoardLayer = {}));


/***/ }),

/***/ "./src/components/svg/Layers/CordsLayer.ts":
/*!*************************************************!*\
  !*** ./src/components/svg/Layers/CordsLayer.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CordsLayer = void 0;
const horizontalCords = ["A", "B", "C", "D", "E", "F", "G", "H"];
const verticalCords = ["8", "7", "6", "5", "4", "3", "2", "1"];
class CordsLayer {
    constructor(svgRoot) {
        this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.group.setAttribute("font-family", "Helvetica");
        this.group.setAttribute("font-weight", "bold");
        this.group.setAttribute("fill", "rgb(30,30,30");
        svgRoot.append(this.group);
        this.horizontalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.verticalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.group.appendChild(this.horizontalGroup);
        this.group.appendChild(this.verticalGroup);
        this.horizontalGroup.setAttribute("transform", "translate(0.86, 7.955)");
        this.verticalGroup.setAttribute("transform", "translate(0.05, 0.18)");
        horizontalCords.forEach((letter, index) => {
            let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", "translate(" + index.toString() + ",0)");
            this.horizontalGroup.appendChild(group);
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("transform", "scale(0.009)");
            text.textContent = letter;
            group.appendChild(text);
        });
        verticalCords.forEach((number, index) => {
            let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("transform", "translate(0," + +index.toString() + ")");
            this.verticalGroup.appendChild(group);
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.textContent = number;
            text.setAttribute("transform", "scale(0.010)");
            group.appendChild(text);
        });
    }
    rotate(isRotated) {
        let letters = Array.from(horizontalCords);
        let numbers = Array.from(verticalCords);
        if (isRotated) {
            letters.reverse();
            numbers.reverse();
        }
        Array.from(this.horizontalGroup.children).forEach((child, index) => {
            child.children[0].textContent = letters[index];
        });
        Array.from(this.verticalGroup.children).forEach((child, index) => {
            child.children[0].textContent = numbers[index];
        });
    }
}
exports.CordsLayer = CordsLayer;


/***/ }),

/***/ "./src/components/svg/Layers/MouseLayer.ts":
/*!*************************************************!*\
  !*** ./src/components/svg/Layers/MouseLayer.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MouseLayer = void 0;
const SVGSquare_1 = __webpack_require__(/*! ../SVGSquare */ "./src/components/svg/SVGSquare.ts");
const Shared_1 = __webpack_require__(/*! ../Shared */ "./src/components/svg/Shared.ts");
class MouseLayer {
    constructor(svgRoot) {
        this.rects = {};
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("fill-opacity", "0");
        svgRoot.appendChild(group);
        let index = 0;
        ["0", "1", "2", "3", "4", "5", "6", "7"].forEach(y => {
            ["0", "1", "2", "3", "4", "5", "6", "7"].forEach(x => {
                let rect = this.createRect(x, y);
                rect.setAttribute("data-index", (index).toString());
                this.rects[index++] = rect;
                group.appendChild(rect);
            });
        });
    }
    createRect(x, y) {
        return SVGSquare_1.SVGSquare.createRect(x, y);
    }
    enableHover(squareKey, isRotated) {
        let index = Shared_1.Shared.getCurrentIndexOfSquareKey(squareKey, isRotated);
        this.rects[index].setAttribute("style", "cursor:pointer");
    }
    disableHover(squareKey, isRotated) {
        let index = Shared_1.Shared.getCurrentIndexOfSquareKey(squareKey, isRotated);
        this.rects[index].removeAttribute("style");
    }
    clear() {
        Object.values(this.rects).forEach(rect => {
            rect.removeAttribute("style");
        });
    }
}
exports.MouseLayer = MouseLayer;


/***/ }),

/***/ "./src/components/svg/Layers/PieceLayer.ts":
/*!*************************************************!*\
  !*** ./src/components/svg/Layers/PieceLayer.ts ***!
  \*************************************************/
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
exports.PieceLayer = void 0;
const bishop = __importStar(__webpack_require__(/*! ../assets/pieces/b.json */ "./src/components/svg/assets/pieces/b.json"));
const king = __importStar(__webpack_require__(/*! ../assets/pieces/k.json */ "./src/components/svg/assets/pieces/k.json"));
const knight = __importStar(__webpack_require__(/*! ../assets/pieces/n.json */ "./src/components/svg/assets/pieces/n.json"));
const pawn = __importStar(__webpack_require__(/*! ../assets/pieces/p.json */ "./src/components/svg/assets/pieces/p.json"));
const queen = __importStar(__webpack_require__(/*! ../assets/pieces/q.json */ "./src/components/svg/assets/pieces/q.json"));
const rook = __importStar(__webpack_require__(/*! ../assets/pieces/r.json */ "./src/components/svg/assets/pieces/r.json"));
const Piece_1 = __webpack_require__(/*! ../Piece */ "./src/components/svg/Piece.ts");
const Shared_1 = __webpack_require__(/*! ../Shared */ "./src/components/svg/Shared.ts");
const pieceSVGData = {};
pieceSVGData["p"] = pawn.g;
pieceSVGData["r"] = rook.g;
pieceSVGData["n"] = knight.g;
pieceSVGData["b"] = bishop.g;
pieceSVGData["q"] = queen.g;
pieceSVGData["k"] = king.g;
class PieceLayer {
    constructor(svgRoot) {
        this.positions = {};
        this.isRotated = false;
        this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svgRoot.appendChild(this.group);
    }
    initMouseLayer(mouseLayer) {
        this.mouseLayer = mouseLayer;
    }
    clear() {
        this.positions = {};
        this.group.innerHTML = "";
        this.mouseLayer.clear();
    }
    addPiece(fenChar, squareKey) {
        let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let data = pieceSVGData[fenChar.toLowerCase()];
        let color = fenChar === fenChar.toLowerCase() ? 0 : 1;
        this.loadChildren(g, data, color);
        this.group.appendChild(g);
        let piece = new Piece_1.Piece(g, fenChar);
        this.setPiecePosition(piece, squareKey);
    }
    addPieceAsCapture(fenChar) {
    }
    onDrop(piece, squareIndexX, squareIndexY) {
        let destinationSquareKey = Shared_1.Shared.getSquareKeyByIndexes(squareIndexX, squareIndexY, this.isRotated);
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
        if (this.mouseLayer) {
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
        }
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
        let x = (this.isRotated ? "hgfedcba" : "abcdefgh").indexOf(squareKey[0]);
        let y = parseInt(squareKey[1]) - 1;
        if (!this.isRotated) {
            y = 7 - y;
        }
        this.positions[squareKey] = piece;
        piece.squareKey = squareKey;
        piece.element.setAttribute("transform", "translate(" + x + "," + y + ")");
        this.mouseLayer.enableHover(squareKey, this.isRotated);
    }
    loadChildren(g, group, color) {
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
            this.loadChildren(childGroup, group.g, color);
        }
    }
}
exports.PieceLayer = PieceLayer;


/***/ }),

/***/ "./src/components/svg/Piece.ts":
/*!*************************************!*\
  !*** ./src/components/svg/Piece.ts ***!
  \*************************************/
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

/***/ "./src/components/svg/SVGSquare.ts":
/*!*****************************************!*\
  !*** ./src/components/svg/SVGSquare.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SVGSquare = void 0;
var SVGSquare;
(function (SVGSquare) {
    function createRect(x, y) {
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", "1");
        rect.setAttribute("height", "1");
        return rect;
    }
    SVGSquare.createRect = createRect;
})(SVGSquare || (exports.SVGSquare = SVGSquare = {}));


/***/ }),

/***/ "./src/components/svg/Shared.ts":
/*!**************************************!*\
  !*** ./src/components/svg/Shared.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Shared = void 0;
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
})(Shared || (exports.Shared = Shared = {}));


/***/ }),

/***/ "./src/components/svg/UI.ts":
/*!**********************************!*\
  !*** ./src/components/svg/UI.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UI = void 0;
const BoardLayer_1 = __webpack_require__(/*! ./Layers/BoardLayer */ "./src/components/svg/Layers/BoardLayer.ts");
const CordsLayer_1 = __webpack_require__(/*! ./Layers/CordsLayer */ "./src/components/svg/Layers/CordsLayer.ts");
const PieceLayer_1 = __webpack_require__(/*! ./Layers/PieceLayer */ "./src/components/svg/Layers/PieceLayer.ts");
const ArrowLayer_1 = __webpack_require__(/*! ./Layers/ArrowLayer */ "./src/components/svg/Layers/ArrowLayer.ts");
const MouseLayer_1 = __webpack_require__(/*! ./Layers/MouseLayer */ "./src/components/svg/Layers/MouseLayer.ts");
const DragAndDrop_1 = __webpack_require__(/*! ./DragAndDrop */ "./src/components/svg/DragAndDrop.ts");
const Shared_1 = __webpack_require__(/*! ./Shared */ "./src/components/svg/Shared.ts");
__webpack_require__(/*! ./ui.css */ "./src/components/svg/ui.css");
class UI {
    constructor(chessContainer, fen, isRotated) {
        this.isRotated = false;
        this.svgRoot = BoardLayer_1.BoardLayer.createSVGRoot();
        chessContainer.appendChild(this.svgRoot);
        this.cordsLayer = new CordsLayer_1.CordsLayer(this.svgRoot);
        this.pieceLayer = new PieceLayer_1.PieceLayer(this.svgRoot);
        this.arrowLayer = new ArrowLayer_1.ArrowLayer(this.svgRoot);
        this.mouseLayer = new MouseLayer_1.MouseLayer(this.svgRoot);
        this.pieceLayer.initMouseLayer(this.mouseLayer);
        this.dragAndDrop = new DragAndDrop_1.DragAndDrop(this.pieceLayer, this.svgRoot, isRotated);
        this.setFen(fen, false);
        this.svgRoot.addEventListener("mousedown", (event) => {
            let isRightClick = event.button && event.button == 2;
            if (isRightClick) {
                this.arrowLayer.onRightButtonDown(event);
            }
            else {
                this.arrowLayer.onLeftButtonDown(event);
                this.dragAndDrop.onLeftButtonDown(event);
            }
            event.preventDefault();
        });
        this.svgRoot.addEventListener("contextmenu", (event) => event.preventDefault());
    }
    test() {
        this.rotate();
    }
    rotate() {
        this.isRotated = !this.isRotated;
        this.cordsLayer.rotate(this.isRotated);
        this.pieceLayer.rotate(this.isRotated);
        this.arrowLayer.rotate(this.isRotated);
        this.dragAndDrop.rotate(this.isRotated);
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
                    let key = Shared_1.Shared.getSquareKeyByIndex(squareIndex++, this.isRotated);
                    this.pieceLayer.addPiece(fenChar, key);
                }
            }
            let standing = this.calculateScoreAndCapturesByFen(fen);
            Object.entries(standing.captures).forEach(([fenChar, value]) => {
                if (value > 0) {
                    let color = fenChar === fenChar.toUpperCase() ? "b" : "w";
                    for (let i = 0; i < value; i++) {
                        let piece = this.pieceLayer.addPieceAsCapture(fenChar);
                    }
                }
            });
        }
    }
    addChild(parent, tag, className, text) {
        let child = document.createElement(tag);
        child.className = className;
        if (text)
            child.innerHTML = text;
        parent.appendChild(child);
        return child;
    }
    calculateScoreAndCapturesByFen(fen) {
        // example: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        fen = fen.split(" ")[0].split("/").join("");
        // make a record of all types of pieces and set initial count to zero
        let fenChars = {};
        ["p", "n", "b", "r", "q", "P", "N", "B", "R", "Q"].forEach(char => {
            fenChars[char] = 0;
        });
        // calculate how many pieces we have of each kind
        for (const char of fen) {
            if (isNaN(parseInt(char))) {
                fenChars[char] += 1;
            }
        }
        ;
        // if the score is positive white is leading
        let score = fenChars["P"] - fenChars["p"];
        score += (fenChars["N"] + fenChars["B"] - fenChars["n"] - fenChars["b"]) * 3;
        score += (fenChars["R"] - fenChars["r"]) * 5;
        score += (fenChars["Q"] - fenChars["q"]) * 9;
        // we need to return a similar record showing how many pieces have been taken
        let captures = {};
        // we started having 2 rooks, knights and bishops. We could have more due to promotion
        for (const char of ["r", "n", "b", "R", "N", "B"]) {
            captures[char] = fenChars[char] >= 2 ? 0 : 2 - fenChars[char];
        }
        for (const char of ["q", "Q"]) {
            captures[char] = fenChars[char] > 0 ? 0 : 1;
        }
        // Counting taken pawns is difficult due to possible promotion
        let black = { pawn: "p", queen: "q", pieces: ["r", "n", "b"] };
        let white = { pawn: "P", queen: "Q", pieces: ["R", "N", "B"] };
        for (const player of [black, white]) {
            captures[player.pawn] = 8 - fenChars[player.pawn];
            if (fenChars[player.queen] > 1) {
                captures[player.pawn] -= fenChars[player.queen] - 1;
            }
            for (const piece of player.pieces) {
                if (fenChars[piece] > 2) {
                    captures[player.pawn] -= fenChars[piece] - 2;
                }
            }
        }
        return { score, captures };
    }
}
exports.UI = UI;


/***/ }),

/***/ "./src/pages/openings/Openings.ts":
/*!****************************************!*\
  !*** ./src/pages/openings/Openings.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./openings.css */ "./src/pages/openings/openings.css");
const UI_1 = __webpack_require__(/*! ../../components/svg/UI */ "./src/components/svg/UI.ts");
let chessboard = document.getElementById("chessboard");
let ui = new UI_1.UI(chessboard, "start", false);
document.getElementById("test").onclick = () => ui.test();
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

/***/ "./src/components/svg/assets/pieces/b.json":
/*!*************************************************!*\
  !*** ./src/components/svg/assets/pieces/b.json ***!
  \*************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(0.02) translate(2,3)","g":{"style":["fill:#000000; stroke:#000000; stroke-linecap:butt;","fill:#ffffff; stroke:#000000; stroke-linecap:butt;"],"path":[{"d":"M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"},{"d":"M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"},{"d":"M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"}],"g":{"path":[{"d":"M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18","style":["fill:none; stroke:#ffffff; stroke-linejoin:miter;","fill:none; stroke:#000000; stroke-linejoin:miter;"]}],"style":["opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(4,4.6)","opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(4,4.6)"]}}}}}');

/***/ }),

/***/ "./src/components/svg/assets/pieces/k.json":
/*!*************************************************!*\
  !*** ./src/components/svg/assets/pieces/k.json ***!
  \*************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(0.0215) translate(0.7,-0.5)","style":["fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;","fill:none; fill-rule:evenodd;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5;transform:translate(2.5,1.5)"],"path":[{"colorIndex":0,"d":"M 22.5,11.63 L 22.5,6","style":["fill:none; stroke:#000000; stroke-linejoin:miter;","stroke-linejoin:miter"]},{"colorIndex":1,"d":"M22.5 11.63V6M20 8h5","style":["","stroke-linejoin:miter"]},{"colorIndex":0,"d":"M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25","style":["fill:#000000;fill-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;","fill:#fff; stroke-linecap:butt; stroke-linejoin:miter"]},{"colorIndex":1,"d":"M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5","style":["","fill:#fff;stroke-linecap:butt;stroke-linejoin:miter"]},{"colorIndex":0,"d":"M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37","style":["fill:#000000; stroke:#000000;","fill:#fff"]},{"colorIndex":1,"d":"M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7","style":["","fill:#fff"]},{"colorIndex":0,"d":"M 20,8 L 25,8","style":["fill:none; stroke:#000000; stroke-linejoin:miter;",""]},{"colorIndex":0,"d":"M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5","style":["fill:none; stroke:#ffffff;",""]},{"colorIndex":0,"d":"M 12.5,30 C 18,27 27,27 32.5,30 M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5 M 12.5,37 C 18,34 27,34 32.5,37","style":["fill:none; stroke:#ffffff;",""]},{"colorIndex":1,"d":"M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"}]}}}');

/***/ }),

/***/ "./src/components/svg/assets/pieces/n.json":
/*!*************************************************!*\
  !*** ./src/components/svg/assets/pieces/n.json ***!
  \*************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(0.02) translate(2,3)","style":["opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;transform:translate(6,6.3)","opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(6,6.3)"],"path":[{"d":"M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18","style":["fill:#000000;stroke:#000000;","fill:#ffffff; stroke:#000000;"]},{"d":"M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10","style":["fill:#000000;stroke:#000000;","fill:#ffffff; stroke:#000000;"]},{"d":"M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z","style":["fill:#ffffff;stroke:#ffffff;","fill:#000000; stroke:#000000;"]},{"d":"M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z","style":["fill:#ffffff;stroke:#ffffff;transform:matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)","fill:#000000; stroke:#000000;transform:matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"]},{"d":"M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z","style":["fill:#ffffff; stroke:none;",""]}]}}}');

/***/ }),

/***/ "./src/components/svg/assets/pieces/p.json":
/*!*************************************************!*\
  !*** ./src/components/svg/assets/pieces/p.json ***!
  \*************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(0.022) translate(0.4,0)","path":[{"d":"m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z","style":["","fill:#ffffff;stroke:#000000;stroke-width:1.5;"]}]}}}');

/***/ }),

/***/ "./src/components/svg/assets/pieces/q.json":
/*!*************************************************!*\
  !*** ./src/components/svg/assets/pieces/q.json ***!
  \*************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(0.0189) translate(4.1,5.3)","style":["fill:#000000;stroke:#000000;stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;transform:translate(5,7)","fill:#ffffff;stroke:#000000;stroke-width:1.5;stroke-linejoin:round;transform:translate(5,7)"],"path":[{"d":"M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z","style":["stroke-linecap:butt;fill:#000000",""]},{"colorIndex":1,"d":"M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"},{"colorIndex":0,"d":"m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z","style":["",""]},{"d":"M 11.5,30 C 15,29 30,29 33.5,30","style":["fill:none","fill:none"]},{"colorIndex":1,"d":"M 12,33.5 C 18,32.5 27,32.5 33,33.5","style":["","fill:none"]},{"colorIndex":0,"d":"m 12,33.5 c 6,-1 15,-1 21,0","style":["fill:none",""]},{"colorIndex":0,"d":"M 11,38.5 A 35,35 1 0 0 34,38.5","style":["fill:none; stroke:#000000;stroke-linecap:butt;",""]}],"circle":[{"cx":"6","cy":"12","r":"2"},{"cx":"14","cy":"9","r":"2"},{"cx":"22.5","cy":"8","r":"2"},{"cx":"31","cy":"9","r":"2"},{"cx":"39","cy":"12","r":"2"}],"g":{"style":["fill:none; stroke:#ffffff;",""],"path":[{"colorIndex":0,"d":"M 11,29 A 35,35 1 0 1 34,29"},{"colorIndex":0,"d":"M 12.5,31.5 L 32.5,31.5"},{"colorIndex":0,"d":"M 11.5,34.5 A 35,35 1 0 0 33.5,34.5"},{"colorIndex":0,"d":"M 10.5,37.5 A 35,35 1 0 0 34.5,37.5"}]}}}}');

/***/ }),

/***/ "./src/components/svg/assets/pieces/r.json":
/*!*************************************************!*\
  !*** ./src/components/svg/assets/pieces/r.json ***!
  \*************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"g":{"g":{"transform":"scale(0.02) translate(2,3)","style":["opacity:1; fill:#000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(6,6.3)","opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;transform:translate(6,6.3)"],"path":[{"d":"M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z","style":["stroke-linecap:butt;","stroke-linecap:butt;"]},{"d":"M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z","colorIndex":0,"style":["stroke-linecap:butt;",""]},{"d":"M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z","style":["stroke-linecap:butt;","stroke-linecap:butt;"]},{"d":"M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z","colorIndex":0,"style":["stroke-linecap:butt;stroke-linejoin:miter;",""]},{"d":"M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z","colorIndex":0,"style":["stroke-linecap:butt;",""]},{"d":"M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z","style":["stroke-linecap:butt;","stroke-linecap:butt;"]},{"d":"M 12,35.5 L 33,35.5 L 33,35.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 13,31.5 L 32,31.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 14,29.5 L 31,29.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 14,16.5 L 31,16.5","colorIndex":0,"style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;",""]},{"d":"M 11,14 L 34,14","style":["fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;","fill:none; stroke:#000000; stroke-linejoin:miter;"]},{"d":"M 34,14 L 31,17 L 14,17 L 11,14","colorIndex":1},{"d":"M 31,17 L 31,29.5 L 14,29.5 L 14,17","colorIndex":1,"style":["stroke-linecap:butt; stroke-linejoin:miter;"]},{"d":"M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5","colorIndex":1,"style":[]}]}}}');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/pages/openings/Openings.ts"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcFosTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDNUQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFMUQsU0FBZ0IscUJBQXFCLENBQUMsZUFBc0IsRUFBRSxhQUFvQixFQUFFLFNBQWlCO1FBQ2pHLElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVB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RUFBRSxDQUFDO1FBQzFDLENBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3JELFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDSCxpREFBaUQ7UUFDakQsS0FBSyxNQUFNLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNyQixJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDO2dCQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLENBQUM7UUFDTCxDQUFDO1FBQUEsQ0FBQztRQUNGLDRDQUE0QztRQUM1QyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0MsNkVBQTZFO1FBQzdFLElBQUksUUFBUSxHQUEyQixFQUFFLENBQUM7UUFDMUMsc0ZBQXNGO1FBQ3RGLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFDLENBQUM7WUFDL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBQ0QsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQyxDQUFDO1lBQzNCLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBQ0QsOERBQThEO1FBQzlELElBQUksS0FBSyxHQUFHLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUMsQ0FBQztRQUMzRCxJQUFJLEtBQUssR0FBRyxFQUFDLElBQUksRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFDLENBQUM7UUFDM0QsS0FBSyxNQUFNLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFDbkMsQ0FBQztZQUNHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDO2dCQUM1QixRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUUsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFDRCxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUMsQ0FBQztnQkFDL0IsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUM7b0JBQ3JCLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFFLENBQUMsQ0FBQztnQkFDaEQsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUM7SUFDNUIsQ0FBQztDQUNKO0FBdElELGdCQXNJQzs7Ozs7Ozs7Ozs7OztBQy9JRCwrRUFBd0I7QUFHeEIsOEZBQTZDO0FBRTdDLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFnQixDQUFDO0FBQ3RFLElBQUksRUFBRSxHQUFHLElBQUksT0FBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFFNUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzNELG1FQUFtRTtBQUNuRSxvQkFBb0I7QUFDcEIsZ0NBQWdDO0FBQ2hDLDZCQUE2QjtBQUM3QixZQUFZO0FBRVosdUNBQXVDO0FBRXZDLCtEQUErRDtBQUMvRCxrREFBa0Q7QUFDbEQscUJBQXFCO0FBQ3JCLHVDQUF1QztBQUN2QyxzREFBc0Q7QUFDdEQsNkRBQTZEO0FBQzdELCtDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLG9EQUFvRDtBQUNwRCwrQ0FBK0M7QUFDL0MsWUFBWTtBQUNaLFFBQVE7QUFFUixJQUFJO0FBQ0osc0ZBQXNGO0FBQ3RGLDJDQUEyQztBQUMzQyxxQkFBcUI7QUFFckIsc0ZBQXNGO0FBQ3RGLHdDQUF3QztBQUN4QyxrQ0FBa0M7QUFFbEMsMEJBQTBCO0FBQzFCLGtFQUFrRTtBQUVsRSxrRkFBa0Y7QUFDbEYsd0VBQXdFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3N2Zy91aS5jc3MiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9wYWdlcy9vcGVuaW5ncy9vcGVuaW5ncy5jc3MiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy9zdmcvdWkuY3NzPzViYWEiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9wYWdlcy9vcGVuaW5ncy9vcGVuaW5ncy5jc3M/YTgyZSIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy9zdmcvRHJhZ0FuZERyb3AudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3N2Zy9MYXllcnMvQXJyb3dMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvc3ZnL0xheWVycy9Cb2FyZExheWVyLnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy9zdmcvTGF5ZXJzL0NvcmRzTGF5ZXIudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3N2Zy9MYXllcnMvTW91c2VMYXllci50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL2NvbXBvbmVudHMvc3ZnL0xheWVycy9QaWVjZUxheWVyLnRzIiwid2VicGFjazovL2Jlc3QtY2hlc3MtZ2FtZXMvLi9zcmMvY29tcG9uZW50cy9zdmcvUGllY2UudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3N2Zy9TVkdTcXVhcmUudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3N2Zy9TaGFyZWQudHMiLCJ3ZWJwYWNrOi8vYmVzdC1jaGVzcy1nYW1lcy8uL3NyYy9jb21wb25lbnRzL3N2Zy9VSS50cyIsIndlYnBhY2s6Ly9iZXN0LWNoZXNzLWdhbWVzLy4vc3JjL3BhZ2VzL29wZW5pbmdzL09wZW5pbmdzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiBzdmcgcmVjdC5kIHtmaWxsOnJnYigxMTksMTUzLDg0KX1cclxuc3ZnIHJlY3QubCB7ZmlsbDpyZ2IoMjMzLDIzNywyMDQpfSAqL1xyXG4vKiBzdmcgcmVjdC5zb3VyY2V7ZmlsbDogcmdiKDI1NSwgMjU1LCA1MSwgMC4zKX0gVG9kbzogKi9gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9jb21wb25lbnRzL3N2Zy91aS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7b0NBQ29DO0FBQ3BDLHdEQUF3RFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBzdmcgcmVjdC5kIHtmaWxsOnJnYigxMTksMTUzLDg0KX1cXHJcXG5zdmcgcmVjdC5sIHtmaWxsOnJnYigyMzMsMjM3LDIwNCl9ICovXFxyXFxuLyogc3ZnIHJlY3Quc291cmNle2ZpbGw6IHJnYigyNTUsIDI1NSwgNTEsIDAuMyl9IFRvZG86ICovXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBib2R5e3BhZGRpbmc6MDttYXJnaW46MDt9YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvcGFnZXMvb3BlbmluZ3Mvb3BlbmluZ3MuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLEtBQUssU0FBUyxDQUFDLFFBQVEsQ0FBQ1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCJib2R5e3BhZGRpbmc6MDttYXJnaW46MDt9XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdWkuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi91aS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vb3BlbmluZ3MuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9vcGVuaW5ncy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsImltcG9ydCB7IE1vdXNlTGF5ZXIgfSBmcm9tIFwiLi9MYXllcnMvTW91c2VMYXllclwiO1xyXG5pbXBvcnQgeyBQaWVjZUxheWVyIH0gZnJvbSBcIi4vTGF5ZXJzL1BpZWNlTGF5ZXJcIjtcclxuaW1wb3J0IHsgUGllY2UgfSBmcm9tIFwiLi9QaWVjZVwiO1xyXG5pbXBvcnQgeyBTaGFyZWQgfSBmcm9tIFwiLi9TaGFyZWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEcmFnQW5kRHJvcHtcclxuICAgIHByaXZhdGUgc3ZnUm9vdDpTVkdTVkdFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwaWVjZUxheWVyOlBpZWNlTGF5ZXI7XHJcbiAgICBwcml2YXRlIGRyYWdQaWVjZTpQaWVjZXxudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgc2Nyb2xsVG9wID0gMDtcclxuICAgIHByaXZhdGUgZGVsdGFTY3JvbGxUb3AgPSAwO1xyXG4gICAgcHJpdmF0ZSBzY3JvbGxMZWZ0ID0gMDtcclxuICAgIHByaXZhdGUgZGVsdGFTY3JvbGxMZWZ0ID0gMDtcclxuICAgIHByaXZhdGUgZHJhZ0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBwcml2YXRlIGlzUm90YXRlZDpib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBpZWNlTGF5ZXI6UGllY2VMYXllciwgc3ZnUm9vdDpTVkdTVkdFbGVtZW50LCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5waWVjZUxheWVyID0gcGllY2VMYXllcjtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QgPSBzdmdSb290O1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgICAgIHRoaXMuZHJhZ0NvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoLTUwJSwtNTAlKVwiO1xyXG4gICAgICAgIHN2Z1Jvb3QucGFyZW50RWxlbWVudCEucHJlcGVuZCh0aGlzLmRyYWdDb250YWluZXIpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoZXZlbnQ6TW91c2VFdmVudCkgPT57XHJcbiAgICAgICAgICAgIGxldCBpc1JpZ2h0Q2xpY2sgPSBldmVudC5idXR0b24gJiYgZXZlbnQuYnV0dG9uID09IDI7XHJcbiAgICAgICAgICAgIGlmICghaXNSaWdodENsaWNrKXtcclxuICAgICAgICAgICAgICAgIHRoaXMub25Nb3VzZVVwKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChldmVudDpNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZXZlbnQpO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsICgpID0+e1xyXG4gICAgICAgICAgICB0aGlzLm9uU2Nyb2xsKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gaXNSb3RhdGVkO1xyXG4gICAgfVxyXG4gICAgb25MZWZ0QnV0dG9uRG93bihldmVudDpNb3VzZUV2ZW50KXtcclxuICAgICAgICBsZXQgcmVjdCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICBsZXQgc3F1YXJlSW5kZXggPSBwYXJzZUludChyZWN0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIikhKTtcclxuICAgICAgICBsZXQgc3F1YXJlS2V5ID0gU2hhcmVkLmdldFNxdWFyZUtleUJ5SW5kZXgoc3F1YXJlSW5kZXgsIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLmRyYWdQaWVjZSA9IHRoaXMucGllY2VMYXllci5wb3NpdGlvbnNbc3F1YXJlS2V5XTtcclxuICAgICAgICBpZiAodGhpcy5kcmFnUGllY2Upe1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvcCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7Ly8gRHJhZyBwb3NpdGlvbiB3aWxsIGJlIGluY29ycmVjdCBpZiB3ZSBkb24ndCB0YWtlIHNjcm9sbCBpbnRvIGNvbnNpZGVyYXRpb25cclxuICAgICAgICAgICAgdGhpcy5kZWx0YVNjcm9sbFRvcCA9IDA7IC8vIFVzZWQgdG8gYWRqdXN0IHRoZSBkcmFnIHBvc2l0aW9uIGlmIHNjcm9sbGluZyBvY2N1cnMgZHVyaW5nIHRoZSBkcmFnXHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsTGVmdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLmRlbHRhU2Nyb2xsTGVmdCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25Nb3VzZU1vdmUoZXZlbnQ6TW91c2VFdmVudCl7XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ1BpZWNlKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kcmFnQ29udGFpbmVyLmZpcnN0Q2hpbGQpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHN2Z1BhcmVudCA9IHRoaXMuc3ZnUm9vdC5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnQ29udGFpbmVyLnN0eWxlLndpZHRoID0gc3ZnUGFyZW50LmNsaWVudFdpZHRoIC8gOCArIFwicHhcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0NvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBzdmdQYXJlbnQuY2xpZW50SGVpZ2h0IC8gOCArXCJweFwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XHJcbiAgICAgICAgICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCA4IDgnKTtcclxuICAgICAgICAgICAgICAgIHN2Zy5hcHBlbmRDaGlsZCh0aGlzLmRyYWdQaWVjZS5lbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1BpZWNlLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwic2NhbGUoOClcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuYXBwZW5kQ2hpbGQoc3ZnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuc3R5bGUubGVmdCA9IGV2ZW50LmNsaWVudFggKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCArIFwicHhcIjtcclxuICAgICAgICAgICAgdGhpcy5kcmFnQ29udGFpbmVyLnN0eWxlLnRvcCA9IGV2ZW50LmNsaWVudFkgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wICsgXCJweFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uU2Nyb2xsKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ1BpZWNlKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdEZWx0YVggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCAtIHRoaXMuc2Nyb2xsTGVmdDtcclxuICAgICAgICAgICAgbGV0IG5ld0RlbHRhWSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgLSB0aGlzLnNjcm9sbFRvcDtcclxuICAgICAgICAgICAgbGV0IGNoYW5nZUluRGVsdGFYID0gbmV3RGVsdGFYIC0gdGhpcy5kZWx0YVNjcm9sbExlZnQ7XHJcbiAgICAgICAgICAgIGxldCBjaGFuZ2VJbkRlbHRhWSA9IG5ld0RlbHRhWSAtIHRoaXMuZGVsdGFTY3JvbGxUb3A7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsdGFTY3JvbGxMZWZ0ID0gbmV3RGVsdGFYO1xyXG4gICAgICAgICAgICB0aGlzLmRlbHRhU2Nyb2xsVG9wID0gbmV3RGVsdGFZO1xyXG4gICAgICAgICAgICBsZXQgbGVmdCA9IHBhcnNlRmxvYXQodGhpcy5kcmFnQ29udGFpbmVyLnN0eWxlLmxlZnQpO1xyXG4gICAgICAgICAgICBsZXQgdG9wID0gcGFyc2VGbG9hdCh0aGlzLmRyYWdDb250YWluZXIuc3R5bGUudG9wKTtcclxuICAgICAgICAgICAgdGhpcy5kcmFnQ29udGFpbmVyLnN0eWxlLmxlZnQgPSBsZWZ0ICsgY2hhbmdlSW5EZWx0YVggKyBcInB4XCI7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ0NvbnRhaW5lci5zdHlsZS50b3AgPSB0b3AgKyBjaGFuZ2VJbkRlbHRhWSArIFwicHhcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbk1vdXNlVXAoZXZlbnQ6TW91c2VFdmVudCl7XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ1BpZWNlKXtcclxuICAgICAgICAgICAgbGV0IHN2Z1BhcmVudCA9IHRoaXMuc3ZnUm9vdC5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NsaWNrT25FbGVtZW50KGV2ZW50LCBzdmdQYXJlbnQpKXtcclxuICAgICAgICAgICAgICAgIGxldCBzcXVhcmVJbmRleFggPSBNYXRoLmZsb29yKCgxMDAgKiBldmVudC5jbGllbnRYIC8gc3ZnUGFyZW50LmNsaWVudFdpZHRoKSAvIDEyLjUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNxdWFyZUluZGV4WSA9IE1hdGguZmxvb3IoKDEwMCAqIGV2ZW50LmNsaWVudFkgLyBzdmdQYXJlbnQuY2xpZW50SGVpZ2h0KSAvIDEyLjUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5waWVjZUxheWVyLm9uRHJvcCh0aGlzLmRyYWdQaWVjZSwgc3F1YXJlSW5kZXhYLCBzcXVhcmVJbmRleFkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBpZWNlTGF5ZXIub25Ecm9wQ2FuY2VsKHRoaXMuZHJhZ1BpZWNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRyYWdQaWVjZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuc3R5bGUud2lkdGggPSBcIjBweFwiO1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpc0NsaWNrT25FbGVtZW50KGV2ZW50OiBNb3VzZUV2ZW50LCBlbGVtZW50OkhUTUxFbGVtZW50KVxyXG4gICAge1xyXG4gICAgICAgIGxldCByZWN0ID0gdGhpcy5nZXRPZmZzZXRSZWN0YW5nbGUoZWxlbWVudCk7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5nZXRBYnNvbHV0ZU1vdXNlUG9zaXRpb24oZXZlbnQpO1xyXG4gICAgICAgIHJldHVybiBwb2ludC54ID4gcmVjdC54ICYmIHBvaW50LnggPCByZWN0LnggKyByZWN0LndpZHRoICYmIHBvaW50LnkgPiByZWN0LnkgJiYgcG9pbnQueSA8IHJlY3QueSArIHJlY3QuaGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgZ2V0T2Zmc2V0UmVjdGFuZ2xlKGVsZW1lbnQ6SFRNTEVsZW1lbnQpe1xyXG4gICAgICAgIGxldCByZWN0ID0geyB4OiBlbGVtZW50Lm9mZnNldExlZnQsIHk6IGVsZW1lbnQub2Zmc2V0VG9wLCB3aWR0aDogZWxlbWVudC5vZmZzZXRXaWR0aCwgaGVpZ2h0OiBlbGVtZW50Lm9mZnNldEhlaWdodCB9O1xyXG4gICAgICAgIHdoaWxlIChlbGVtZW50Lm9mZnNldFBhcmVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KXtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgICAgICByZWN0LnggKz0gZWxlbWVudC5vZmZzZXRMZWZ0O1xyXG4gICAgICAgICAgICByZWN0LnkgKz0gZWxlbWVudC5vZmZzZXRUb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZWN0O1xyXG4gICAgfVxyXG4gICAgZ2V0QWJzb2x1dGVNb3VzZVBvc2l0aW9uKGV2ZW50Ok1vdXNlRXZlbnQpe1xyXG4gICAgICAgIGxldCB4ID0gZXZlbnQuY2xpZW50WCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgIGxldCB5ID0gZXZlbnQuY2xpZW50WSArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICAgICAgcmV0dXJuIHsgeDogeCwgeTogeSB9O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU2hhcmVkIH0gZnJvbSBcIi4uL1NoYXJlZFwiO1xyXG5cclxuaW50ZXJmYWNlIEFycm93e1xyXG4gICAgZnJvbTpzdHJpbmcsXHJcbiAgICB0bzpzdHJpbmdcclxufVxyXG5leHBvcnQgY2xhc3MgQXJyb3dMYXllcntcclxuICAgIHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudDtcclxuICAgIGdyb3VwOlNWR0dFbGVtZW50O1xyXG4gICAgc3Ryb2tlV2lkdGggPSAwLjI7XHJcbiAgICByaWdodENsaWNrZWRTcXVhcmVLZXk6c3RyaW5nfG51bGwgPSBudWxsO1xyXG4gICAgaXNSb3RhdGVkID0gZmFsc2U7XHJcbiAgICBjdXJyZW50QXJyb3dzOiBBcnJvd1tdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3ZnUm9vdDpTVkdTVkdFbGVtZW50KXtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICBzdmdSb290LmFwcGVuZENoaWxkKGdyb3VwKTtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QgPSBzdmdSb290O1xyXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBncm91cDtcclxuXHJcbiAgICAgICAgdGhpcy5zdmdSb290LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChldmVudDpNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpc1JpZ2h0Q2xpY2sgPSBldmVudC5idXR0b24gJiYgZXZlbnQuYnV0dG9uID09IDI7XHJcbiAgICAgICAgICAgIGlmIChpc1JpZ2h0Q2xpY2spe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJpZ2h0QnV0dG9uVXAoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLmlzUm90YXRlZCA9IGlzUm90YXRlZDtcclxuICAgICAgICB0aGlzLmdyb3VwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QXJyb3dzLmZvckVhY2goYXJyb3cgPT57XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0Fycm93KGFycm93LmZyb20sIGFycm93LnRvKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgb25MZWZ0QnV0dG9uRG93bihldmVudDpNb3VzZUV2ZW50KXtcclxuICAgICAgICB0aGlzLmdyb3VwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QXJyb3dzID0gW107XHJcbiAgICB9XHJcbiAgICBvblJpZ2h0QnV0dG9uRG93bihldmVudDpNb3VzZUV2ZW50KXtcclxuICAgICAgICBsZXQgcmVjdCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICBsZXQgaW5kZXggPSBwYXJzZUludChyZWN0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIikhKTtcclxuICAgICAgICB0aGlzLnJpZ2h0Q2xpY2tlZFNxdWFyZUtleSA9IFNoYXJlZC5nZXRTcXVhcmVLZXlCeUluZGV4KGluZGV4LCB0aGlzLmlzUm90YXRlZCk7XHJcbiAgICB9XHJcbiAgICBvblJpZ2h0QnV0dG9uVXAoZXZlbnQ6TW91c2VFdmVudCl7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gcGFyc2VJbnQocmVjdC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIpISk7XHJcbiAgICAgICAgbGV0IHNxdWFyZUtleSA9IFNoYXJlZC5nZXRTcXVhcmVLZXlCeUluZGV4KGluZGV4LCB0aGlzLmlzUm90YXRlZCk7XHJcbiAgICAgICAgaWYgKHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5ICYmIHRoaXMucmlnaHRDbGlja2VkU3F1YXJlS2V5ICE9PSBzcXVhcmVLZXkpe1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdBcnJvdyh0aGlzLnJpZ2h0Q2xpY2tlZFNxdWFyZUtleSwgc3F1YXJlS2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkcmF3QXJyb3coc3F1YXJlS2V5MTpzdHJpbmcsIHNxdWFyZUtleTI6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRBcnJvd3MucHVzaCh7ZnJvbTpzcXVhcmVLZXkxLCB0bzpzcXVhcmVLZXkyfSk7XHJcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncG9seWdvbicpO1xyXG4gICAgICAgIGxldCBwb2ludDEgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgICBsZXQgcG9pbnQyID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgICAgbGV0IHBvaW50MyA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICAgIGxldCBwb2ludDQgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuICAgICAgICBsZXQgcG9pbnQ1ID0gdGhpcy5zdmdSb290LmNyZWF0ZVNWR1BvaW50KCk7XHJcbiAgICAgICAgbGV0IHBvaW50NiA9IHRoaXMuc3ZnUm9vdC5jcmVhdGVTVkdQb2ludCgpO1xyXG4gICAgICAgIGxldCBwb2ludDcgPSB0aGlzLnN2Z1Jvb3QuY3JlYXRlU1ZHUG9pbnQoKTtcclxuXHJcbiAgICAgICAgbGV0IGZyb20gPSB0aGlzLmdldFJlbGF0aXZlQ2VudGVyKHNxdWFyZUtleTEpO1xyXG4gICAgICAgIGxldCB0byA9IHRoaXMuZ2V0UmVsYXRpdmVDZW50ZXIoc3F1YXJlS2V5Mik7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHRvLnggLSBmcm9tLngsIDIpICsgTWF0aC5wb3codG8ueSAtZnJvbS55LCAyKSk7XHJcbiAgICAgICAgbGV0IHNob3J0ZW5EaXN0YW5jZSA9IDAuMztcclxuICAgICAgICBsZXQgY2VudGVyID0geyB4OiAoZnJvbS54ICsgdG8ueCkvMiwgeTogKGZyb20ueSArIHRvLnkpLzIgfTtcclxuICAgICAgICBsZXQgdHJpYW5nbGVTaWRlTGVuZ3RoID0gMC4zO1xyXG4gICAgICAgIGxldCBhID0gdHJpYW5nbGVTaWRlTGVuZ3RoIC8gMjtcclxuICAgICAgICBsZXQgYyA9IHRyaWFuZ2xlU2lkZUxlbmd0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0T2ZUcmlhbmdsZSA9IE1hdGguc3FydChNYXRoLnBvdyhjLCAyKSAtIE1hdGgucG93KGEsMikpO1xyXG5cclxuICAgICAgICBwb2ludDEueCA9IGNlbnRlci54IC0gKGRpc3RhbmNlIC8gMikgKyBzaG9ydGVuRGlzdGFuY2U7XHJcbiAgICAgICAgcG9pbnQxLnkgPSBjZW50ZXIueSAtIHRoaXMuc3Ryb2tlV2lkdGggLyAyO1xyXG5cclxuICAgICAgICBwb2ludDIueCA9IHBvaW50MS54O1xyXG4gICAgICAgIHBvaW50Mi55ID0gcG9pbnQxLnkgKyB0aGlzLnN0cm9rZVdpZHRoO1xyXG5cclxuICAgICAgICBwb2ludDMueCA9IHBvaW50Mi54ICsgZGlzdGFuY2UgLSBoZWlnaHRPZlRyaWFuZ2xlIC0gc2hvcnRlbkRpc3RhbmNlO1xyXG4gICAgICAgIHBvaW50My55ID0gcG9pbnQyLnk7XHJcblxyXG4gICAgICAgIHBvaW50NC54ID0gcG9pbnQzLng7XHJcbiAgICAgICAgcG9pbnQ0LnkgPSBwb2ludDMueSArICgodHJpYW5nbGVTaWRlTGVuZ3RoIC8gMikgLSAodGhpcy5zdHJva2VXaWR0aCAvIDIpKTtcclxuXHJcbiAgICAgICAgcG9pbnQ1LnggPSBwb2ludDQueCArIGhlaWdodE9mVHJpYW5nbGU7XHJcbiAgICAgICAgcG9pbnQ1LnkgPSBjZW50ZXIueTtcclxuXHJcbiAgICAgICAgcG9pbnQ2LnggPSBwb2ludDQueDtcclxuICAgICAgICBwb2ludDYueSA9IHBvaW50NC55IC0gdHJpYW5nbGVTaWRlTGVuZ3RoO1xyXG5cclxuICAgICAgICBwb2ludDcueCA9IHBvaW50My54O1xyXG4gICAgICAgIHBvaW50Ny55ID0gcG9pbnQzLnkgLSB0aGlzLnN0cm9rZVdpZHRoO1xyXG5cclxuICAgICAgICBsZXQgZGVsdGFYID0gdG8ueCAtIGZyb20ueDtcclxuICAgICAgICBsZXQgZGVsdGFZID0gdG8ueSAtIGZyb20ueTtcclxuXHJcbiAgICAgICAgbGV0IHJhZGlhbiA9IE1hdGguYXRhbjIoZGVsdGFZLCBkZWx0YVgpO1xyXG4gICAgICAgIGxldCBkZWdyZWVzID0gcmFkaWFuICogMTgwIC8gTWF0aC5QSTtcclxuXHJcbiAgICAgICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZGVncmVlcyArIFwiIFwiICsgY2VudGVyLngudG9TdHJpbmcoKSArIFwiIFwiICsgY2VudGVyLnkudG9TdHJpbmcoKSArIFwiKVwiKTtcclxuICAgICAgICBwb2x5Z29uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYXJyb3dcIik7XHJcbiAgICAgICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwicmdiYSgyNTUsIDE3MCwgMCwgMC44KVwiKTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50MSk7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDIpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQzKTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50NCk7XHJcbiAgICAgICAgcG9seWdvbi5wb2ludHMuYXBwZW5kSXRlbShwb2ludDUpO1xyXG4gICAgICAgIHBvbHlnb24ucG9pbnRzLmFwcGVuZEl0ZW0ocG9pbnQ2KTtcclxuICAgICAgICBwb2x5Z29uLnBvaW50cy5hcHBlbmRJdGVtKHBvaW50Nyk7XHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChwb2x5Z29uKTtcclxuICAgIH1cclxuICAgIGdldFJlbGF0aXZlQ2VudGVyKHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBjaGFyID0gc3F1YXJlS2V5WzBdO1xyXG4gICAgICAgIGxldCBkaWdpdCA9IHNxdWFyZUtleVsxXTtcclxuICAgICAgICBsZXQgeCA9IFNoYXJlZC5nZXRIb3Jpem9udGFsSW5kZXgoY2hhciwgdGhpcy5pc1JvdGF0ZWQpICsgMC41O1xyXG4gICAgICAgIGxldCB5ID0gU2hhcmVkLmdldFZlcnRpY2FsSW5kZXgoZGlnaXQsIHRoaXMuaXNSb3RhdGVkKSArMC41O1xyXG4gICAgICAgIHJldHVybiB7IHgsIHkgfTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFNWR1NxdWFyZSB9IGZyb20gXCIuLi9TVkdTcXVhcmVcIjtcclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgQm9hcmRMYXllcntcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTVkdSb290KCl7XHJcbiAgICAgICAgbGV0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XHJcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgOCA4Jyk7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgc3ZnLmFwcGVuZENoaWxkKGdyb3VwKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbG9ycyA9IFtcImxcIiwgXCJkXCIsIFwibFwiLCBcImRcIiwgXCJsXCIsIFwiZFwiLCBcImxcIiwgXCJkXCJdO1xyXG5cclxuICAgICAgICBbXCIwXCIsIFwiMVwiLCBcIjJcIiwgXCIzXCIsIFwiNFwiLCBcIjVcIiwgXCI2XCIsIFwiN1wiXS5mb3JFYWNoKHkgPT57XHJcbiAgICAgICAgICAgIFtcIjBcIiwgXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCJdLmZvckVhY2goKHgsIGluZGV4KSA9PntcclxuICAgICAgICAgICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKGNyZWF0ZVJlY3QoeCwgeSwgY29sb3JzW2luZGV4XSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29sb3JzID0gY29sb3JzLnJldmVyc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc3ZnO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY3JlYXRlUmVjdCh4OnN0cmluZywgeTpzdHJpbmcsIGNsYXNzTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIGxldCByZWN0ID0gU1ZHU3F1YXJlLmNyZWF0ZVJlY3QoeCwgeSk7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNsYXNzTmFtZSA9PT0gXCJsXCIgPyBcInJnYigyMzMsMjM3LDIwNClcIiA6IFwicmdiKDExOSwxNTMsODQpXCIpO1xyXG4gICAgICAgIC8vIHJlY3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgY2xhc3NOYW1lKTsvLz8/XHJcbiAgICAgICAgcmV0dXJuIHJlY3Q7XHJcbiAgICB9XHJcbn0iLCJjb25zdCBob3Jpem9udGFsQ29yZHMgPSBbXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCIsIFwiSFwiXTtcclxuY29uc3QgdmVydGljYWxDb3JkcyA9IFtcIjhcIiwgXCI3XCIsIFwiNlwiLCBcIjVcIiwgXCI0XCIsIFwiM1wiLCBcIjJcIiwgXCIxXCJdO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcmRzTGF5ZXJ7XHJcbiAgICBncm91cDpTVkdHRWxlbWVudDtcclxuICAgIGhvcml6b250YWxHcm91cDpTVkdHRWxlbWVudDtcclxuICAgIHZlcnRpY2FsR3JvdXA6U1ZHR0VsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3ZnUm9vdDpTVkdTVkdFbGVtZW50KXtcclxuICAgICAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBcIkhlbHZldGljYVwiKTtcclxuICAgICAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZShcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKTtcclxuICAgICAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJyZ2IoMzAsMzAsMzBcIik7XHJcbiAgICAgICAgc3ZnUm9vdC5hcHBlbmQodGhpcy5ncm91cCk7XHJcblxyXG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgdGhpcy52ZXJ0aWNhbEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5ob3Jpem9udGFsR3JvdXApO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy52ZXJ0aWNhbEdyb3VwKTtcclxuXHJcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsR3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAuODYsIDcuOTU1KVwiKTtcclxuICAgICAgICB0aGlzLnZlcnRpY2FsR3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAuMDUsIDAuMTgpXCIpO1xyXG5cclxuICAgICAgICBob3Jpem9udGFsQ29yZHMuZm9yRWFjaCgobGV0dGVyLCBpbmRleCkgPT57XHJcbiAgICAgICAgICAgIGxldCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpO1xyXG4gICAgICAgICAgICBncm91cC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBpbmRleC50b1N0cmluZygpICsgXCIsMClcIik7XHJcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbEdyb3VwLmFwcGVuZENoaWxkKGdyb3VwKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcInRleHRcIik7XHJcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwic2NhbGUoMC4wMDkpXCIpO1xyXG4gICAgICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gbGV0dGVyO1xyXG4gICAgICAgICAgICBncm91cC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2ZXJ0aWNhbENvcmRzLmZvckVhY2goKG51bWJlciwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKTtcclxuICAgICAgICAgICAgZ3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsXCIgKyArIGluZGV4LnRvU3RyaW5nKCkgKyBcIilcIik7XHJcbiAgICAgICAgICAgIHRoaXMudmVydGljYWxHcm91cC5hcHBlbmRDaGlsZChncm91cCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJ0ZXh0XCIpO1xyXG4gICAgICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gbnVtYmVyO1xyXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInNjYWxlKDAuMDEwKVwiKTtcclxuICAgICAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBsZXR0ZXJzID0gQXJyYXkuZnJvbShob3Jpem9udGFsQ29yZHMpO1xyXG4gICAgICAgIGxldCBudW1iZXJzID0gQXJyYXkuZnJvbSh2ZXJ0aWNhbENvcmRzKTtcclxuICAgICAgICBpZiAoaXNSb3RhdGVkKXtcclxuICAgICAgICAgICAgbGV0dGVycy5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIG51bWJlcnMucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBBcnJheS5mcm9tKHRoaXMuaG9yaXpvbnRhbEdyb3VwLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICBjaGlsZC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IGxldHRlcnNbaW5kZXhdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIEFycmF5LmZyb20odGhpcy52ZXJ0aWNhbEdyb3VwLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+e1xyXG4gICAgICAgICAgICBjaGlsZC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IG51bWJlcnNbaW5kZXhdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU1ZHU3F1YXJlIH0gZnJvbSBcIi4uL1NWR1NxdWFyZVwiO1xyXG5pbXBvcnQgeyBTaGFyZWQgfSBmcm9tIFwiLi4vU2hhcmVkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTW91c2VMYXllcntcclxuICAgIHJlY3RzOlJlY29yZDxzdHJpbmcsIFNWR1JlY3RFbGVtZW50PiA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudCl7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgZ3JvdXAuc2V0QXR0cmlidXRlKFwiZmlsbC1vcGFjaXR5XCIsIFwiMFwiKTtcclxuICAgICAgICBzdmdSb290LmFwcGVuZENoaWxkKGdyb3VwKTtcclxuICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgIFtcIjBcIiwgXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCJdLmZvckVhY2goeSA9PntcclxuICAgICAgICAgICAgW1wiMFwiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCBcIjRcIiwgXCI1XCIsIFwiNlwiLCBcIjdcIl0uZm9yRWFjaCh4ID0+e1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlY3QgPSB0aGlzLmNyZWF0ZVJlY3QoeCx5KTtcclxuICAgICAgICAgICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCAoaW5kZXgpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWN0c1tpbmRleCsrXSA9IHJlY3Q7XHJcbiAgICAgICAgICAgICAgICBncm91cC5hcHBlbmRDaGlsZChyZWN0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVSZWN0KHg6c3RyaW5nLCB5OnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIFNWR1NxdWFyZS5jcmVhdGVSZWN0KHgsIHkpO1xyXG4gICAgfVxyXG4gICAgZW5hYmxlSG92ZXIoc3F1YXJlS2V5OnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBpbmRleCA9IFNoYXJlZC5nZXRDdXJyZW50SW5kZXhPZlNxdWFyZUtleShzcXVhcmVLZXksIGlzUm90YXRlZCk7XHJcbiAgICAgICAgdGhpcy5yZWN0c1tpbmRleF0uc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJjdXJzb3I6cG9pbnRlclwiKTtcclxuICAgIH1cclxuICAgIGRpc2FibGVIb3ZlcihzcXVhcmVLZXk6c3RyaW5nLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gU2hhcmVkLmdldEN1cnJlbnRJbmRleE9mU3F1YXJlS2V5KHNxdWFyZUtleSwgaXNSb3RhdGVkKTtcclxuICAgICAgICB0aGlzLnJlY3RzW2luZGV4XS5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuICAgIH1cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnJlY3RzKS5mb3JFYWNoKHJlY3QgPT57XHJcbiAgICAgICAgICAgIHJlY3QucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgKiBhcyBiaXNob3AgZnJvbSBcIi4uL2Fzc2V0cy9waWVjZXMvYi5qc29uXCI7XHJcbmltcG9ydCAqIGFzIGtpbmcgZnJvbSBcIi4uL2Fzc2V0cy9waWVjZXMvay5qc29uXCI7XHJcbmltcG9ydCAqIGFzIGtuaWdodCBmcm9tIFwiLi4vYXNzZXRzL3BpZWNlcy9uLmpzb25cIjtcclxuaW1wb3J0ICogYXMgcGF3biBmcm9tIFwiLi4vYXNzZXRzL3BpZWNlcy9wLmpzb25cIjtcclxuaW1wb3J0ICogYXMgcXVlZW4gZnJvbSBcIi4uL2Fzc2V0cy9waWVjZXMvcS5qc29uXCI7XHJcbmltcG9ydCAqIGFzIHJvb2sgZnJvbSBcIi4uL2Fzc2V0cy9waWVjZXMvci5qc29uXCI7XHJcbmltcG9ydCB7IFBpZWNlIH0gZnJvbSBcIi4uL1BpZWNlXCI7XHJcbmltcG9ydCB7IE1vdXNlTGF5ZXIgfSBmcm9tIFwiLi9Nb3VzZUxheWVyXCI7XHJcbmltcG9ydCB7IFNoYXJlZCB9IGZyb20gXCIuLi9TaGFyZWRcIjtcclxuXHJcbmNvbnN0IHBpZWNlU1ZHRGF0YTpSZWNvcmQ8c3RyaW5nLCBTVkdHcm91cD4gPSB7fTtcclxucGllY2VTVkdEYXRhW1wicFwiXSA9IHBhd24uZyBhcyBTVkdHcm91cDtcclxucGllY2VTVkdEYXRhW1wiclwiXSA9IHJvb2suZyBhcyBTVkdHcm91cDtcclxucGllY2VTVkdEYXRhW1wiblwiXSA9IGtuaWdodC5nIGFzIFNWR0dyb3VwO1xyXG5waWVjZVNWR0RhdGFbXCJiXCJdID0gYmlzaG9wLmcgYXMgU1ZHR3JvdXA7XHJcbnBpZWNlU1ZHRGF0YVtcInFcIl0gPSBxdWVlbi5nIGFzIFNWR0dyb3VwO1xyXG5waWVjZVNWR0RhdGFbXCJrXCJdID0ga2luZy5nIGFzIFNWR0dyb3VwO1xyXG5cclxuaW50ZXJmYWNlIFNWR0dyb3Vwe1xyXG4gICAgZzogU1ZHR3JvdXB8dW5kZWZpbmVkO1xyXG4gICAgdHJhbnNmb3JtOnN0cmluZ3x1bmRlZmluZWQ7XHJcbiAgICBzdHlsZTpzdHJpbmdbXXx1bmRlZmluZWQ7XHJcbiAgICBwYXRoOlBhdGhbXXx1bmRlZmluZWR8bnVsbDtcclxuICAgIGNpcmNsZTpDaXJjbGVbXXx1bmRlZmluZWQ7XHJcbn1cclxuaW50ZXJmYWNlIFBhdGh7XHJcbiAgICBzdHlsZTpzdHJpbmdbXXx1bmRlZmluZWQ7XHJcbiAgICBkOnN0cmluZztcclxuICAgIGNvbG9ySW5kZXg6bnVtYmVyfHVuZGVmaW5lZDtcclxufVxyXG5pbnRlcmZhY2UgQ2lyY2xle1xyXG4gICAgY3g6c3RyaW5nO1xyXG4gICAgY3k6c3RyaW5nO1xyXG4gICAgcjpzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGNsYXNzIFBpZWNlTGF5ZXJ7XHJcbiAgICBncm91cDpTVkdHRWxlbWVudDtcclxuICAgIHBvc2l0aW9uczpSZWNvcmQ8c3RyaW5nLCBQaWVjZXxudWxsPiA9IHt9O1xyXG4gICAgbW91c2VMYXllcjpNb3VzZUxheWVyIHwgdW5kZWZpbmVkO1xyXG4gICAgaXNSb3RhdGVkID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3ZnUm9vdDpTVkdTVkdFbGVtZW50KXtcclxuICAgICAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgc3ZnUm9vdC5hcHBlbmRDaGlsZCh0aGlzLmdyb3VwKTtcclxuICAgIH1cclxuICAgIGluaXRNb3VzZUxheWVyKG1vdXNlTGF5ZXI6TW91c2VMYXllcil7XHJcbiAgICAgICAgdGhpcy5tb3VzZUxheWVyID0gbW91c2VMYXllcjtcclxuICAgIH1cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSB7fTtcclxuICAgICAgICB0aGlzLmdyb3VwLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5tb3VzZUxheWVyIS5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgYWRkUGllY2UoZmVuQ2hhcjpzdHJpbmcsIHNxdWFyZUtleTpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBwaWVjZVNWR0RhdGFbZmVuQ2hhci50b0xvd2VyQ2FzZSgpXTtcclxuICAgICAgICBsZXQgY29sb3IgPSBmZW5DaGFyID09PSBmZW5DaGFyLnRvTG93ZXJDYXNlKCkgPyAwIDogMTtcclxuICAgICAgICB0aGlzLmxvYWRDaGlsZHJlbihnLCBkYXRhLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChnKTtcclxuICAgICAgICBsZXQgcGllY2UgPSBuZXcgUGllY2UoZywgZmVuQ2hhcik7XHJcbiAgICAgICAgdGhpcy5zZXRQaWVjZVBvc2l0aW9uKHBpZWNlLCBzcXVhcmVLZXkpO1xyXG4gICAgfVxyXG4gICAgYWRkUGllY2VBc0NhcHR1cmUoZmVuQ2hhcjpzdHJpbmcpe1xyXG5cclxuICAgIH1cclxuICAgIG9uRHJvcChwaWVjZTpQaWVjZSwgc3F1YXJlSW5kZXhYOm51bWJlciwgc3F1YXJlSW5kZXhZOm51bWJlcil7XHJcbiAgICAgICAgbGV0IGRlc3RpbmF0aW9uU3F1YXJlS2V5ID0gU2hhcmVkLmdldFNxdWFyZUtleUJ5SW5kZXhlcyhzcXVhcmVJbmRleFgsIHNxdWFyZUluZGV4WSwgdGhpcy5pc1JvdGF0ZWQpXHJcbiAgICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChwaWVjZS5lbGVtZW50KTtcclxuICAgICAgICBpZiAocGllY2Uuc3F1YXJlS2V5ID09PSBkZXN0aW5hdGlvblNxdWFyZUtleSl7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGllY2VQb3NpdGlvbihwaWVjZSwgZGVzdGluYXRpb25TcXVhcmVLZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVQaWVjZShwaWVjZS5zcXVhcmVLZXkhLCBkZXN0aW5hdGlvblNxdWFyZUtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25Ecm9wQ2FuY2VsKHBpZWNlOlBpZWNlKXtcclxuICAgICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKHBpZWNlLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuc2V0UGllY2VQb3NpdGlvbihwaWVjZSwgcGllY2Uuc3F1YXJlS2V5ISk7XHJcbiAgICB9XHJcbiAgICBtb3ZlUGllY2UoZnJvbTpzdHJpbmcsIHRvOnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRoaXMubW91c2VMYXllcil7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VMYXllci5kaXNhYmxlSG92ZXIoZnJvbSwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlTGF5ZXIuZW5hYmxlSG92ZXIodG8sIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICAgICAgbGV0IHBpZWNlID0gdGhpcy5wb3NpdGlvbnNbZnJvbV0hO1xyXG4gICAgICAgICAgICBsZXQgZXhpc3RpbmdQaWVjZSA9IHRoaXMucG9zaXRpb25zW3RvXTtcclxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nUGllY2Upe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cC5yZW1vdmVDaGlsZChleGlzdGluZ1BpZWNlLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW3RvXSA9IHBpZWNlO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tmcm9tXSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGllY2VQb3NpdGlvbihwaWVjZSAsdG8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJvdGF0ZShpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XHJcbiAgICAgICAgbGV0IHBpZWNlcyA9IE9iamVjdC52YWx1ZXModGhpcy5wb3NpdGlvbnMpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25zID0ge307XHJcbiAgICAgICAgdGhpcy5tb3VzZUxheWVyIS5jbGVhcigpO1xyXG4gICAgICAgIHBpZWNlcy5mb3JFYWNoKHBpZWNlID0+e1xyXG4gICAgICAgICAgICBpZiAocGllY2Upe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQaWVjZVBvc2l0aW9uKHBpZWNlLCBwaWVjZS5zcXVhcmVLZXkhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRQaWVjZVBvc2l0aW9uKHBpZWNlOlBpZWNlLCBzcXVhcmVLZXk6c3RyaW5nKXtcclxuICAgICAgICBsZXQgeCA9ICh0aGlzLmlzUm90YXRlZCA/IFwiaGdmZWRjYmFcIiA6IFwiYWJjZGVmZ2hcIikuaW5kZXhPZihzcXVhcmVLZXlbMF0pO1xyXG4gICAgICAgIGxldCB5ID0gcGFyc2VJbnQoc3F1YXJlS2V5WzFdKSAtMTtcclxuICAgICAgICBpZiAoIXRoaXMuaXNSb3RhdGVkKXtcclxuICAgICAgICAgICAgeSA9IDcgLSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvc2l0aW9uc1tzcXVhcmVLZXldID0gcGllY2U7XHJcbiAgICAgICAgcGllY2Uuc3F1YXJlS2V5ID0gc3F1YXJlS2V5O1xyXG4gICAgICAgIHBpZWNlLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiKTtcclxuICAgICAgICB0aGlzLm1vdXNlTGF5ZXIhLmVuYWJsZUhvdmVyKHNxdWFyZUtleSwgdGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBsb2FkQ2hpbGRyZW4oZzpTVkdHRWxlbWVudCwgZ3JvdXA6U1ZHR3JvdXAsIGNvbG9yOm51bWJlcil7XHJcbiAgICAgICAgaWYgKGdyb3VwLnRyYW5zZm9ybSl7XHJcbiAgICAgICAgICAgIGcuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIGdyb3VwLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChncm91cC5zdHlsZSAmJiBncm91cC5zdHlsZVtjb2xvcl0pe1xyXG4gICAgICAgICAgICBnLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGdyb3VwLnN0eWxlW2NvbG9yXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChncm91cC5jaXJjbGUpe1xyXG4gICAgICAgICAgICBncm91cC5jaXJjbGUuZm9yRWFjaChjaXJjbGUgPT57XHJcbiAgICAgICAgICAgICAgICBsZXQgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnY2lyY2xlJyk7XHJcbiAgICAgICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShcImN4XCIsIGNpcmNsZS5jeCk7XHJcbiAgICAgICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShcImN5XCIsIGNpcmNsZS5jeSk7XHJcbiAgICAgICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShcInJcIiwgY2lyY2xlLnIpO1xyXG4gICAgICAgICAgICAgICAgZy5hcHBlbmRDaGlsZChjKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChncm91cC5wYXRoKXtcclxuICAgICAgICAgICAgZ3JvdXAucGF0aC5mb3JFYWNoKHBhdGggPT57XHJcbiAgICAgICAgICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGguY29sb3JJbmRleCA9PT0gdW5kZWZpbmVkIHx8IHBhdGguY29sb3JJbmRleCA9PT0gY29sb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgIHAuc2V0QXR0cmlidXRlKFwiZFwiLCBwYXRoLmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXRoLnN0eWxlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBwYXRoLnN0eWxlW2NvbG9yXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ3JvdXAuZyl7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIik7XHJcbiAgICAgICAgICAgIGcuYXBwZW5kQ2hpbGQoY2hpbGRHcm91cCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZENoaWxkcmVuKGNoaWxkR3JvdXAsIGdyb3VwLmcsIGNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcclxuZXhwb3J0IGNsYXNzIFBpZWNle1xyXG4gICAgZWxlbWVudDpTVkdHRWxlbWVudDtcclxuICAgIGZlbkNoYXI6c3RyaW5nO1xyXG4gICAgc3F1YXJlS2V5OnN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDpTVkdHRWxlbWVudCwgZmVuQ2hhcjpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5mZW5DaGFyID0gZmVuQ2hhcjtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgbmFtZXNwYWNlIFNWR1NxdWFyZXtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZWN0KHg6c3RyaW5nLCB5OnN0cmluZyl7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3JlY3QnKTtcclxuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcInhcIiwgeCk7XHJcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIHkpO1xyXG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgXCIxXCIpO1xyXG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFwiMVwiKTtcclxuICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgIH1cclxufSIsImV4cG9ydCBuYW1lc3BhY2UgU2hhcmVke1xyXG4gICAgY29uc3Qgc3F1YXJlS2V5cyA9IFtcImE4XCIsIFwiYjhcIiwgXCJjOFwiLCBcImQ4XCIsIFwiZThcIiwgXCJmOFwiLCBcImc4XCIsIFwiaDhcIiwgXCJhN1wiLCBcImI3XCIsIFwiYzdcIiwgXCJkN1wiLCBcImU3XCIsIFwiZjdcIiwgXCJnN1wiLCBcImg3XCIsIFwiYTZcIiwgXCJiNlwiLCBcImM2XCIsIFwiZDZcIiwgXCJlNlwiLCBcImY2XCIsIFwiZzZcIiwgXCJoNlwiLCBcImE1XCIsIFwiYjVcIiwgXCJjNVwiLCBcImQ1XCIsIFwiZTVcIiwgXCJmNVwiLCBcImc1XCIsIFwiaDVcIiwgXCJhNFwiLCBcImI0XCIsIFwiYzRcIiwgXCJkNFwiLCBcImU0XCIsIFwiZjRcIiwgXCJnNFwiLCBcImg0XCIsIFwiYTNcIiwgXCJiM1wiLCBcImMzXCIsIFwiZDNcIiwgXCJlM1wiLCBcImYzXCIsIFwiZzNcIiwgXCJoM1wiLCBcImEyXCIsIFwiYjJcIiwgXCJjMlwiLCBcImQyXCIsIFwiZTJcIiwgXCJmMlwiLCBcImcyXCIsIFwiaDJcIiwgXCJhMVwiLCBcImIxXCIsIFwiYzFcIiwgXCJkMVwiLCBcImUxXCIsIFwiZjFcIiwgXCJnMVwiLCBcImgxXCJdO1xyXG4gICAgY29uc3QgaG9yaXpvbnRhbCA9IFtcImFcIiwgXCJiXCIsIFwiY1wiLCBcImRcIiwgXCJlXCIsIFwiZlwiLCBcImdcIiwgXCJoXCJdO1xyXG4gICAgY29uc3QgdmVydGljYWwgPSBbXCI4XCIsIFwiN1wiLCBcIjZcIiwgXCI1XCIsIFwiNFwiLCBcIjNcIiwgXCIyXCIsIFwiMVwiXTtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3F1YXJlS2V5QnlJbmRleGVzKGhvcml6b250YWxJbmRleDpudW1iZXIsIHZlcnRpY2FsSW5kZXg6bnVtYmVyLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGxldHRlckluZGV4ID0gaXNSb3RhdGVkID8gNyAtIGhvcml6b250YWxJbmRleCA6IGhvcml6b250YWxJbmRleDtcclxuICAgICAgICBsZXQgZGlnaXRJbmRleCA9IGlzUm90YXRlZCA/IDcgLSB2ZXJ0aWNhbEluZGV4IDogdmVydGljYWxJbmRleDtcclxuICAgICAgICByZXR1cm4gaG9yaXpvbnRhbFtsZXR0ZXJJbmRleF0gKyB2ZXJ0aWNhbFtkaWdpdEluZGV4XTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRTcXVhcmVLZXlCeUluZGV4KGluZGV4Om51bWJlciwgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBpID0gaXNSb3RhdGVkID8gNjMgLSBpbmRleCA6IGluZGV4O1xyXG4gICAgICAgIHJldHVybiBzcXVhcmVLZXlzW2ldO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRJbmRleE9mU3F1YXJlS2V5KHNxdWFyZUtleTpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICBsZXQgaW5kZXggPSBzcXVhcmVLZXlzLmluZGV4T2Yoc3F1YXJlS2V5KTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gNjMgLSBpbmRleCA6IGluZGV4O1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEhvcml6b250YWxJbmRleChzcXVhcmVMZXR0ZXI6c3RyaW5nLCBpc1JvdGF0ZWQ6Ym9vbGVhbil7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gaG9yaXpvbnRhbC5pbmRleE9mKHNxdWFyZUxldHRlcik7XHJcbiAgICAgICAgcmV0dXJuIGlzUm90YXRlZCA/IDcgLSBpbmRleCA6IGluZGV4O1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFZlcnRpY2FsSW5kZXgoc3F1YXJlTnVtYmVyOnN0cmluZywgaXNSb3RhdGVkOmJvb2xlYW4pe1xyXG4gICAgICAgIGxldCBpbmRleCA9IHZlcnRpY2FsLmluZGV4T2Yoc3F1YXJlTnVtYmVyKTtcclxuICAgICAgICByZXR1cm4gaXNSb3RhdGVkID8gNyAtIGluZGV4IDogaW5kZXg7XHJcbiAgICB9XHJcbn0gXHJcbiIsImltcG9ydCB7IEJvYXJkTGF5ZXIgfSBmcm9tIFwiLi9MYXllcnMvQm9hcmRMYXllclwiO1xyXG5pbXBvcnQgeyBDb3Jkc0xheWVyIH0gZnJvbSBcIi4vTGF5ZXJzL0NvcmRzTGF5ZXJcIjtcclxuaW1wb3J0IHsgUGllY2VMYXllciB9IGZyb20gXCIuL0xheWVycy9QaWVjZUxheWVyXCI7XHJcbmltcG9ydCB7IEFycm93TGF5ZXIgfSBmcm9tIFwiLi9MYXllcnMvQXJyb3dMYXllclwiO1xyXG5pbXBvcnQgeyBNb3VzZUxheWVyIH0gZnJvbSBcIi4vTGF5ZXJzL01vdXNlTGF5ZXJcIjtcclxuaW1wb3J0IHsgRHJhZ0FuZERyb3AgfSBmcm9tIFwiLi9EcmFnQW5kRHJvcFwiO1xyXG5pbXBvcnQgeyBTaGFyZWQgfSBmcm9tIFwiLi9TaGFyZWRcIjtcclxuaW1wb3J0IHsgU2NyZWVuc2hvdCB9IGZyb20gXCIuL1NjcmVlbnNob3RcIjtcclxuaW1wb3J0IFwiLi91aS5jc3NcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVSXtcclxuICAgIHN2Z1Jvb3Q6U1ZHU1ZHRWxlbWVudDtcclxuICAgIGNvcmRzTGF5ZXI6Q29yZHNMYXllcjtcclxuICAgIHBpZWNlTGF5ZXI6UGllY2VMYXllcjtcclxuICAgIGFycm93TGF5ZXI6QXJyb3dMYXllcjtcclxuICAgIG1vdXNlTGF5ZXI6TW91c2VMYXllcjtcclxuICAgIGRyYWdBbmREcm9wOkRyYWdBbmREcm9wO1xyXG4gICAgaXNSb3RhdGVkID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2hlc3NDb250YWluZXI6SFRNTEVsZW1lbnQsIGZlbjpzdHJpbmcsIGlzUm90YXRlZDpib29sZWFuKXtcclxuICAgICAgICB0aGlzLnN2Z1Jvb3QgPSBCb2FyZExheWVyLmNyZWF0ZVNWR1Jvb3QoKTtcclxuICAgICAgICBjaGVzc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnN2Z1Jvb3QpO1xyXG4gICAgICAgIHRoaXMuY29yZHNMYXllciA9IG5ldyBDb3Jkc0xheWVyKHRoaXMuc3ZnUm9vdCk7XHJcbiAgICAgICAgdGhpcy5waWVjZUxheWVyID0gbmV3IFBpZWNlTGF5ZXIodGhpcy5zdmdSb290KTtcclxuICAgICAgICB0aGlzLmFycm93TGF5ZXIgPSBuZXcgQXJyb3dMYXllcih0aGlzLnN2Z1Jvb3QpO1xyXG4gICAgICAgIHRoaXMubW91c2VMYXllciA9IG5ldyBNb3VzZUxheWVyKHRoaXMuc3ZnUm9vdCk7XHJcbiAgICAgICAgdGhpcy5waWVjZUxheWVyLmluaXRNb3VzZUxheWVyKHRoaXMubW91c2VMYXllcik7XHJcbiAgICAgICAgdGhpcy5kcmFnQW5kRHJvcCA9IG5ldyBEcmFnQW5kRHJvcCh0aGlzLnBpZWNlTGF5ZXIsIHRoaXMuc3ZnUm9vdCwgaXNSb3RhdGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRGZW4oZmVuLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChldmVudDpNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpc1JpZ2h0Q2xpY2sgPSBldmVudC5idXR0b24gJiYgZXZlbnQuYnV0dG9uID09IDI7XHJcbiAgICAgICAgICAgIGlmIChpc1JpZ2h0Q2xpY2spe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJvd0xheWVyLm9uUmlnaHRCdXR0b25Eb3duKGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJvd0xheWVyLm9uTGVmdEJ1dHRvbkRvd24oZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnQW5kRHJvcC5vbkxlZnRCdXR0b25Eb3duKGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3ZnUm9vdC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpICk7XHJcbiAgICB9XHJcbiAgICB0ZXN0KCl7XHJcbiAgICAgICAgdGhpcy5yb3RhdGUoKTtcclxuICAgIH1cclxuICAgIHJvdGF0ZSgpe1xyXG4gICAgICAgIHRoaXMuaXNSb3RhdGVkID0gIXRoaXMuaXNSb3RhdGVkO1xyXG4gICAgICAgIHRoaXMuY29yZHNMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMucGllY2VMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMuYXJyb3dMYXllci5yb3RhdGUodGhpcy5pc1JvdGF0ZWQpO1xyXG4gICAgICAgIHRoaXMuZHJhZ0FuZERyb3Aucm90YXRlKHRoaXMuaXNSb3RhdGVkKTtcclxuICAgIH1cclxuICAgIHNldEZlbihmZW46c3RyaW5nLCBjbGVhckZpcnN0OmJvb2xlYW4pe1xyXG4gICAgICAgIGlmIChjbGVhckZpcnN0KXtcclxuICAgICAgICAgICAgdGhpcy5waWVjZUxheWVyLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBPYmplY3QudmFsdWVzKHRoaXMud2hpdGVDYXB0dXJlcykuY29uY2F0KE9iamVjdC52YWx1ZXModGhpcy5ibGFja0NhcHR1cmVzKSkuZm9yRWFjaChlbGVtZW50ID0+e1xyXG4gICAgICAgICAgICAvLyAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgLy8gdGhpcy5waWVjZUVsZW1lbnRzID0gW107XHJcbiAgICAgICAgICAgIC8vIHRoaXMuc2V0U2NvcmUoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmZW4gIT09IFwiXCIpe1xyXG4gICAgICAgICAgICBpZiAoZmVuLnRvTG93ZXJDYXNlKCkgPT09IFwic3RhcnRcIilcclxuICAgICAgICAgICAgICAgIGZlbiA9IFwicm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDFcIjtcclxuICAgICAgICAgICAgZmVuID0gZmVuLnNwbGl0KFwiIFwiKVswXS5zcGxpdChcIi9cIikuam9pbihcIlwiKTtcclxuICAgICAgICAgICAgbGV0IHNxdWFyZUluZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZW4ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGZlbkNoYXIgPSBmZW5baV07XHJcbiAgICAgICAgICAgICAgICBsZXQgbnVtbWVyaWNWYWx1ZSA9IHBhcnNlSW50KGZlbkNoYXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW1tZXJpY1ZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3F1YXJlSW5kZXggKz0gbnVtbWVyaWNWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtleSA9IFNoYXJlZC5nZXRTcXVhcmVLZXlCeUluZGV4KHNxdWFyZUluZGV4KyssIHRoaXMuaXNSb3RhdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBpZWNlTGF5ZXIuYWRkUGllY2UoZmVuQ2hhciwga2V5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgc3RhbmRpbmcgPSB0aGlzLmNhbGN1bGF0ZVNjb3JlQW5kQ2FwdHVyZXNCeUZlbihmZW4pO1xyXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhzdGFuZGluZy5jYXB0dXJlcykuZm9yRWFjaCgoW2ZlbkNoYXIsIHZhbHVlXSkgPT57XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPiAwKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29sb3IgPSBmZW5DaGFyID09PSBmZW5DaGFyLnRvVXBwZXJDYXNlKCkgPyBcImJcIiA6IFwid1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWU7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwaWVjZSA9IHRoaXMucGllY2VMYXllci5hZGRQaWVjZUFzQ2FwdHVyZShmZW5DaGFyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkQ2hpbGQocGFyZW50OkhUTUxFbGVtZW50LCB0YWc6c3RyaW5nLCBjbGFzc05hbWU6c3RyaW5nLCB0ZXh0PzpzdHJpbmcpe1xyXG4gICAgICAgIGxldCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICAgICAgICBjaGlsZC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgICAgICAgaWYgKHRleHQpXHJcbiAgICAgICAgICAgIGNoaWxkLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICAgICAgICByZXR1cm4gY2hpbGQ7XHJcbiAgICB9XHJcbiAgICBjYWxjdWxhdGVTY29yZUFuZENhcHR1cmVzQnlGZW4oZmVuOnN0cmluZyl7XHJcbiAgICAgICAgLy8gZXhhbXBsZTogXCJybmJxa2Juci9wcHBwcHBwcC84LzgvOC84L1BQUFBQUFBQL1JOQlFLQk5SIHcgS1FrcSAtIDAgMVwiXHJcbiAgICAgICAgZmVuID0gZmVuLnNwbGl0KFwiIFwiKVswXS5zcGxpdChcIi9cIikuam9pbihcIlwiKTtcclxuICAgICAgICAvLyBtYWtlIGEgcmVjb3JkIG9mIGFsbCB0eXBlcyBvZiBwaWVjZXMgYW5kIHNldCBpbml0aWFsIGNvdW50IHRvIHplcm9cclxuICAgICAgICBsZXQgZmVuQ2hhcnM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcclxuICAgICAgICBbXCJwXCIsXCJuXCIsXCJiXCIsXCJyXCIsXCJxXCIsXCJQXCIsXCJOXCIsXCJCXCIsXCJSXCIsXCJRXCJdLmZvckVhY2goY2hhciA9PntcclxuICAgICAgICAgICAgZmVuQ2hhcnNbY2hhcl0gPSAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBob3cgbWFueSBwaWVjZXMgd2UgaGF2ZSBvZiBlYWNoIGtpbmRcclxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgZmVuKSB7XHJcbiAgICAgICAgICAgIGlmIChpc05hTihwYXJzZUludChjaGFyKSkpe1xyXG4gICAgICAgICAgICAgICAgZmVuQ2hhcnNbY2hhcl0gKz0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gaWYgdGhlIHNjb3JlIGlzIHBvc2l0aXZlIHdoaXRlIGlzIGxlYWRpbmdcclxuICAgICAgICBsZXQgc2NvcmUgPSBmZW5DaGFyc1tcIlBcIl0gLSBmZW5DaGFyc1tcInBcIl07XHJcbiAgICAgICAgc2NvcmUgKz0gKGZlbkNoYXJzW1wiTlwiXSArIGZlbkNoYXJzW1wiQlwiXSAtIGZlbkNoYXJzW1wiblwiXSAtIGZlbkNoYXJzW1wiYlwiXSkgKiAzO1xyXG4gICAgICAgIHNjb3JlICs9IChmZW5DaGFyc1tcIlJcIl0gLSBmZW5DaGFyc1tcInJcIl0pICogNTtcclxuICAgICAgICBzY29yZSArPSAoZmVuQ2hhcnNbXCJRXCJdIC0gZmVuQ2hhcnNbXCJxXCJdKSAqIDk7XHJcbiAgICAgICAgLy8gd2UgbmVlZCB0byByZXR1cm4gYSBzaW1pbGFyIHJlY29yZCBzaG93aW5nIGhvdyBtYW55IHBpZWNlcyBoYXZlIGJlZW4gdGFrZW5cclxuICAgICAgICBsZXQgY2FwdHVyZXM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcclxuICAgICAgICAvLyB3ZSBzdGFydGVkIGhhdmluZyAyIHJvb2tzLCBrbmlnaHRzIGFuZCBiaXNob3BzLiBXZSBjb3VsZCBoYXZlIG1vcmUgZHVlIHRvIHByb21vdGlvblxyXG4gICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBbXCJyXCIsIFwiblwiLCBcImJcIiwgXCJSXCIsIFwiTlwiLCBcIkJcIl0pe1xyXG4gICAgICAgICAgICBjYXB0dXJlc1tjaGFyXSA9IGZlbkNoYXJzW2NoYXJdID49IDIgPyAwIDogMiAtIGZlbkNoYXJzW2NoYXJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IGNoYXIgb2YgW1wicVwiLCBcIlFcIl0pe1xyXG4gICAgICAgICAgICBjYXB0dXJlc1tjaGFyXSA9IGZlbkNoYXJzW2NoYXJdID4gMCA/IDAgOiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBDb3VudGluZyB0YWtlbiBwYXducyBpcyBkaWZmaWN1bHQgZHVlIHRvIHBvc3NpYmxlIHByb21vdGlvblxyXG4gICAgICAgIGxldCBibGFjayA9IHtwYXduOlwicFwiLCBxdWVlbjogXCJxXCIsIHBpZWNlczpbXCJyXCIsIFwiblwiLCBcImJcIl19O1xyXG4gICAgICAgIGxldCB3aGl0ZSA9IHtwYXduOlwiUFwiLCBxdWVlbjogXCJRXCIsIHBpZWNlczpbXCJSXCIsIFwiTlwiLCBcIkJcIl19O1xyXG4gICAgICAgIGZvciAoY29uc3QgcGxheWVyIG9mIFtibGFjaywgd2hpdGVdKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FwdHVyZXNbcGxheWVyLnBhd25dID0gOCAtIGZlbkNoYXJzW3BsYXllci5wYXduXTtcclxuICAgICAgICAgICAgaWYgKGZlbkNoYXJzW3BsYXllci5xdWVlbl0gPiAxKXtcclxuICAgICAgICAgICAgICAgIGNhcHR1cmVzW3BsYXllci5wYXduXSAtPSBmZW5DaGFyc1twbGF5ZXIucXVlZW5dIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGllY2Ugb2YgcGxheWVyLnBpZWNlcyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmVuQ2hhcnNbcGllY2VdID4gMil7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FwdHVyZXNbcGxheWVyLnBhd25dIC09IGZlbkNoYXJzW3BpZWNlXSAtMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3Njb3JlLCBjYXB0dXJlc31cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgSWNvbnMgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvY2hlc3MvSWNvbnNcIjtcclxuaW1wb3J0IFwiLi9vcGVuaW5ncy5jc3NcIjtcclxuaW1wb3J0IHsgY3JlYXRlQmFja2dyb3VuZCwgc2V0VGFyZ2V0QW5kU291cmNlLCBnZXRCb3VuZGluZ0JveE9mU3ZnUGF0aCB9IGZyb20gXCIuL0JhY2tncm91bmRcIjtcclxuaW1wb3J0IGJvYXJkMiBmcm9tIFwiLi9ib2FyZDIuc3ZnXCI7XHJcbmltcG9ydCB7IFVJIH0gZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvc3ZnL1VJXCI7XHJcblxyXG5sZXQgY2hlc3Nib2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlc3Nib2FyZFwiKSBhcyBIVE1MRWxlbWVudDtcclxubGV0IHVpID0gbmV3IFVJKGNoZXNzYm9hcmQsIFwic3RhcnRcIiwgZmFsc2UpO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXN0XCIpIS5vbmNsaWNrID0gKCkgPT4gdWkudGVzdCgpO1xyXG4vLyBsZXQgaW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteS1pbWdcIikgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuLy8gaW1nLnNyYyA9IGJvYXJkMjtcclxuLy8gbGV0IHN2ZyA9IGNyZWF0ZUJhY2tncm91bmQoKTtcclxuLy8gZG9jdW1lbnQuYm9keS5hcHBlbmQoc3ZnKTtcclxuLy8gZGVidWdnZXI7XHJcblxyXG4vLyBzZXRUYXJnZXRBbmRTb3VyY2UoXCJlMlwiLCBcImU0XCIsIHN2Zyk7XHJcblxyXG4vLyBsZXQgYm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkXCIpIGFzIEhUTUxFbGVtZW50O1xyXG4vLyBsZXQgc3ZnID0gYm9hcmQuZmlyc3RDaGlsZCBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4vLyBzdmcuc3JjID0gYm9hcmRiZztcclxuLy8gZm9yIChsZXQgZWxlbWVudCBvZiBib2FyZC5jaGlsZHJlbil7XHJcbi8vICAgICBpZiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYmFja2dyb3VuZFwiKSl7XHJcbi8vICAgICAgICAgbGV0IGltYWdlID0gZWxlbWVudC5sYXN0Q2hpbGQgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuLy8gICAgICAgICBpZiAoaW1hZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwid3BcIikpe1xyXG4vLyAgICAgICAgICAgICBpbWFnZS5zcmMgPSBJY29ucy5QaWVjZVVybFtcIlBcIl07XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGVsc2UgaWYgKGltYWdlLmNsYXNzTGlzdC5jb250YWlucyhcIndyXCIpKXtcclxuLy8gICAgICAgICAgICAgaW1hZ2Uuc3JjID0gSWNvbnMuUGllY2VVcmxbXCJSXCJdO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBlbHNlIGlmIChpbWFnZS5jbGFzc0xpc3QuY29udGFpbnMoXCJ3blwiKSl7XHJcbi8vICAgICAgICAgICAgIGltYWdlLnNyYyA9IEljb25zLlBpZWNlVXJsW1wiTlwiXTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgZWxzZSBpZiAoaW1hZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwid2JcIikpe1xyXG4vLyAgICAgICAgICAgICBpbWFnZS5zcmMgPSBJY29ucy5QaWVjZVVybFtcIkJcIl07XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGVsc2UgaWYgKGltYWdlLmNsYXNzTGlzdC5jb250YWlucyhcIndxXCIpKXtcclxuLy8gICAgICAgICAgICAgaW1hZ2Uuc3JjID0gSWNvbnMuUGllY2VVcmxbXCJRXCJdO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBlbHNlIGlmIChpbWFnZS5jbGFzc0xpc3QuY29udGFpbnMoXCJ3a1wiKSl7XHJcbi8vICAgICAgICAgICAgIGltYWdlLnNyYyA9IEljb25zLlBpZWNlVXJsW1wiS1wiXTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbiAgICBcclxuLy8gfVxyXG4vLyBsZXQgcXVlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCIqXCIpWzY4XTtcclxuLy8gbGV0IGJib3ggPSBraW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4vLyBjb25zb2xlLmxvZyhiYm94KTtcclxuXHJcbi8vIGxldCBzdmdUYWdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzdmdcIikgYXMgSFRNTENvbGxlY3Rpb25PZjxTVkdFbGVtZW50PjtcclxuLy8gbGV0IHF1ZWVuID0gc3ZnVGFnc1sxXSBhcyBTVkdFbGVtZW50O1xyXG4vLyBnZXRCb3VuZGluZ0JveE9mU3ZnUGF0aChxdWVlbik7XHJcblxyXG4vLyBpbXBvcnQgXCIuLi9tYXN0ZXIuY3NzXCI7XHJcbi8vIGltcG9ydCB7IENoZXNzYm9hcmQgfSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9jaGVzcy9DaGVzc2JvYXJkXCI7XHJcblxyXG4vLyBsZXQgY2hlc3Nib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlc3Nib2FyZFwiKSBhcyBIVE1MRWxlbWVudDtcclxuLy8gbGV0IGNoZXNzYm9hcmQgPSBuZXcgQ2hlc3Nib2FyZChjaGVzc2JvYXJkQ29udGFpbmVyLCBcInN0YXJ0XCIsIGZhbHNlKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=