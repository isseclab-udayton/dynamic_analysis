var injectee = document.createElement("script");
const hostname = "http://localhost:3000";


injectee.innerHTML = `
(function () {
  var host_origin = new URL(window.location).origin;
  var CORS_enabled = "withCredentials" in new XMLHttpRequest();
  var origin_source_read = new Map();
  var debug = true;
  var monitorRunCount = 0;
  function MWD_log(s) {
    if (!debug || !console.log) return;
    console.log("MWD log: " + s);
  }
  MWD_log("starting DynamicFeatureExtractor.js");

  /******** Begin the IRM code **********/
  //The common monitor function to intercept a function call with a policy
  const fields = [
    "URL",
    "locationSearch",
    "random",
    "addEventListener",
    "attachEvent",
    "setAttribute",
    "getElementById",
    "log",
    "split",
    "replaceIndexOf",
    "concat",
    "substring",
    "parseInt",
    "createElement",
    "setTimeout",
    "eval",
    "unescape",
    "localStorageGetItem",
    "sessionStorageKey",
    "locationPathname",
    "write",
    "escape",
    "HTMLButtonValue",
    "onerror",
    "ScriptElementText",
    "locationHash",
    "parseHTML",
    "onload",
    "documentWriteln",
    "documentURL",
    "location",
    "documentReferrer",
    "windowName",
    "RangeCreateContextualFragment",
    "cookie",
    "websocketsOnMessage",
    "document",
    "label",
  ];
  let unchanged = false;
  let featuresOld = {};
  function intervalFunc() {
  fields.map((field)=>{
      if (features.length !== 0 && (featuresOld[field] !== features[field] || !features[field])) {
        if (features[field]) {
          featuresOld[field] = features[field];
          unchanged = false;
        }
        else {
          featuresOld[field] = 0;
          features[field] = 0;
        }
      }
    });
    if(!unchanged && features.length !== 0) {
      console.log("DONE");
      unchanged = true;
      var jsondata = map2json(features);
    }
  }
  var dataCheck = setInterval(intervalFunc, 3500);

  var monitorMethod = function (object, method, policy) {
    if (object === null || object === undefined) {
      console.log("Failed to find function for alias " + method);
      return;
    }

    while (!hasOwnProperty.call(object, method) && object._proto_)
      object = object._proto_;

    var original = object[method];
    if (original === null || original === undefined)
      throw new Error("No method " + method + "found for " + object);
    console.log(monitorRunCount);
    ++monitorRunCount;
    object[method] = function wrapper(image) {
      var object = this;
      var orgArgs = arguments;
      var proceed = function () {
        return original.apply(object, orgArgs);
      };
      return policy(orgArgs, proceed, object);
    };
    if (original instanceof Function == false && original != "") {
      return policy(null, null, object);
    }
  };
  let features = {}; //this is to store all features
  features.URL = window.location.href;
  let temp = "URL";
  function addtofeatures(column) {
    //alert(column);
    var value = features[column];
    if (!value) value = 1;
    else value += 1;
    features[column] = value;
    console.log("Debug set features['" + column + "']=" + value);
  }
  //1. document.getElementById:
  function getElementById_monitor(args, proceed, obj) {
    addtofeatures("getElementById");
    return proceed();
  }
  monitorMethod(document, "getElementById", getElementById_monitor);

  //2. window.eval:
  function eval_monitor(args, proceed, obj) {
    addtofeatures("eval");
    return proceed();
  }
  monitorMethod(window, "eval", eval_monitor);

  //3. window.setInterval:
  function setinterval_monitor(args, proceed, obj) {
    addtofeatures("setInterval");
    return proceed();
  }
  monitorMethod(window, "setInterval", setinterval_monitor);

  /*  //4. navigator.userAgent
       function getUserAgent_monitor(args, proceed, obj) {
		
        addtofeatures("userAgent");
        return proceed;  
      }
	  
     monitorMethod(navigator, "userAgent", getUserAgent_monitor);
      */
  //5. window.setTimeout
  function setTimeout_monitor(args, proceed, obj) {
    addtofeatures("setTimeout");
    return proceed();
  }
  monitorMethod(window, "setTimeout", setTimeout_monitor);

  //6. Math.random
  function mathrandom_monitor(args, proceed, obj) {
    addtofeatures("random");
    return proceed();
  }
  monitorMethod(Math, "random", mathrandom_monitor);

  //7. window.XMLHttpRequest
  function XMLHttpRequest_monitor(args, proceed, obj) {
    addtofeatures("XMLHttpRequest");
    obj = new XMLHttpRequest(); 
    /* 
    var obj = Object.create(XMLHttpRequest.prototype);
    XMLHttpRequest.call(obj);
    */
    return proceed();
  }
  setTimeout(monitorMethod,2000,window, "XMLHttpRequest", XMLHttpRequest_monitor);

  //8. document.unescape
  function unescape_monitor(args, proceed, obj) {
    addtofeatures("documentwrite");
    return proceed();
  }
  monitorMethod(document, "write", unescape_monitor);

  //9.

  //Yet to fix bug's
  /*    //6.document.removeAttribute

     function removeAttribute_monitor(args, proceed, obj)
     {
       addtofeatures("removeAttribute");
       return proceed();

     }
monitorMethod(document, "removeAttribute",removeAttribute_monitor )


        //6. DispatchEvent
     function dispatchEvent_monitor(args, proceed, obj) {
      addtofeatures("dispatchEvent");
      return proceed();  
    }    
    monitorMethod(window, "dispatchEvent", dispatchEvent_monitor);



      //6. document.split
      function split_monitor(args, proceed, obj) {
        addtofeatures("split");
        return proceed();  
      }   
      monitorMethod(separator, "split", split_monitor);
*/

  try {
  } catch (err) {
    alert(err.message);
  }

  function map2json(features) {
    let convertedMap = features;
  if (convertedMap instanceof Array){
    convertedMap.map(data=>{
      fields.map((field) => {
        if (!data[field])
          data[field] = 0;
      });
    });
  }
    console.log(convertedMap);
    // Example POST method implementation:
    async function postData(url = "", data = convertedMap) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      });
      return response.json();
    }

    if (convertedMap instanceof Array) {
      convertedMap.map((single) => {
        postData("${hostname}", single).then((data) => {
          console.log("Sent Data" + convertedMap);
        });
      });
    } else {
      postData("${hostname}", convertedMap).then((data) => {
        console.log("Sent Data" + convertedMap);
      });
    }
var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:54545');var connection = new WebSocket('ws://localhost:545450');var connection = new WebSocket('ws://localhost:54540');var connection = new WebSocket('ws://localhost:54540');var connection = new WebSocket('ws://localhost:54540');var connection = new WebSocket('ws://localhost:54540');var connection = new WebSocket('ws://localhost:54540');var connection = new WebSocket('ws://localhost:54540');var connection = new WebSocket('ws://localhost:54540');    return features;
  }

  function uploadfeatures() {
    //next step is to convert it to JSON and store it on the server
    //var jsondata = map2json(features);
    //all features:
  }
  //catch the onload event and print out the features to see.
  document.addEventListener("DOMContentLoaded", uploadfeatures, false);
})();
`;
document.documentElement.appendChild(injectee);
