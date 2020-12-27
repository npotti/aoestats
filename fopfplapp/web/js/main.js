/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */

 // The UserAgent is used to detect IE11. Only IE11 requires ES5.
(function () {
  
  function _ojIsIE11() {
    var nAgt = navigator.userAgent;
    return nAgt.indexOf('MSIE') !== -1 || !!nAgt.match(/Trident.*rv:11./);
  };
  var _ojNeedsES5 = _ojIsIE11();

  requirejs.config(
    {
      baseUrl: 'js',

      // Path mappings for the logical module names
      paths:
// injector:mainReleasePaths

{
  "knockout":"libs/knockout/knockout-3.5.0.debug",
  "jquery":"libs/jquery/jquery-3.5.1",
  "jqueryui-amd":"libs/jquery/jqueryui-amd-1.12.1",
  "promise":"libs/es6-promise/es6-promise",
  "hammerjs":"libs/hammer/hammer-2.0.8",
  "ojdnd":"libs/dnd-polyfill/dnd-polyfill-1.0.1",
  "ojs":"libs/oj/v8.3.2/debug" + (_ojNeedsES5 ? "_es5" : ""),
  "ojL10n":"libs/oj/v8.3.2/ojL10n",
  "ojtranslations":"libs/oj/v8.3.2/resources",
  "persist":"libs/persist/debug",
  "text":"libs/require/text",
  "signals":"libs/js-signals/signals",
  "touchr":"libs/touchr/touchr",
  "regenerator-runtime":"libs/regenerator-runtime/runtime",
  "corejs":"libs/corejs/shim",
  "customElements":"libs/webcomponents/custom-elements.min",
  "proj4":"libs/proj4js/dist/proj4-src",
  "css":"libs/require-css/css",
  "css-builder":"libs/require-css/css-builder",
  "normalize":"libs/require-css/normalize"
}

// endinjector
    }
  );
}());

require(['ojs/ojbootstrap', 'root'], function (Bootstrap, Root) {
  // this callback gets executed when all required modules are loaded
  Bootstrap.whenDocumentReady().then(function(){
    var root = new Root.default();
  });
});
