
var gMap = null;
var gInitExtent = null;
var basemapToggle = null;
var mapExtentChangeEvent;

var title = "Grandma's Marathon Weekend Map";
document.title = title;
var toggleOnValue = "isOn";
var toggleOffValue = "isOff";
var toggleBoxWidth8 = 300;
var toggleBoxWidth9 = 326;
var toggleBoxWidth = toggleBoxWidth9;
var wpid = null;
var openedMe = false;
var GPSLayer = null;
var GPSCounter = 0;
var GPSPosition = null;
var lastGPSTime = 0;

var initExtentCoords = {"xmin":-10259129,"ymin":5901772,"xmax":-10197750,"ymax":5947806,"sr":102100};
var layerList = [];
var smsTest = {"type":"simple",
							"symbol": {
								"color": [255,255,255,255],
								"size": 12,
								"type": "esriSMS",
								"style": "esriSMSCircle"
							}
						};
var pmsTest = {"type": "simple",
				"symbol": {"type": "esriPMS",
"url":"assets/images/gMM.png", 
				"height": 26, 
				"width": 26
}};

var select_tolerance = 5;
 
function setTolerance() {
  //http://stackoverflow.com/questions/9038625/detect-if-device-is-ios
  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];
 
  if (!!navigator.platform) {
    while (iDevices.length) {
		if (navigator.platform === iDevices.pop()){ 
			select_tolerance = 10;
			return true; 
		}
    }
  }

  return false;
}
setTolerance();

//Info/ATM
var infoRenderer = 
	{"type": "uniqueValue",
	"field1" : "type",
	"uniqueValueInfos": [
		{"value": "info",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/info.png", 
					"height": 13, 
					"width": 13}
		},
	   {"value": "atm",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/atm.png", 
					"height": 12, 
					"width": 14}
		}							
	]
};
								 
layerList.push(
	{"id":"GPS",
		"toggleOnList": ["gps"],
		"layerInfo":{"type":"gps"},
	});
	
layerList.push(
	{"id":"Expo-Info",
		"minScale": 20000,
		"toggleOnList": ["expo"],
		"layerInfo":{"type":"csv","file":"assets/data/info.csv"},
		"rendererInfo":{
			"type":"unique",
			"uvr": infoRenderer
			}
	});

//Lodging
var lodgingRenderer = 
	{"type": "simple",
	"symbol": {"type": "esriPMS",
	"url":"assets/images/lodging3.png", 
	"height": 10, 
	"width": 10
}};
								 

layerList.push(
	{"id":"Lodging",
		"minScale": 2311163,
		"toggleOnList": ["lodging"],
		"layerInfo":{"type":"csv","file":"assets/data/lodging.csv"},
		"rendererInfo":{
			"type":"simple",
			"svr": lodgingRenderer
			}
	});

//Expo-Info
var deccSymbol = {
	"style": "esriSFSSolid",
	"color": [130, 130, 130, 255],
	"outline" : {
		"style": "esriSLSNull",
		"color": [0,0,0,0],
		"width": 0
	}
};

layerList.push(
	{"id":"EXPO-DECC",
		"minScale": 72224,
		"toggleOnList": ["expo"],
		"layerInfo":{"type":"json","file":"assets/data/expo-decc.json"},
		"graphicSymbol":deccSymbol
	});

var vendor_green1 = {
	"style": "esriSFSSolid",
	"color": [115,178,115,255],
	"outline" : {
		"style": "esriSLSNull",
		"color": [0,0,0,0],
		"width": 0
	}
};

var vendor_green2 = {
	"style": "esriSFSSolid",
	"color": [56,168,0,255],
	"outline" : {
		"style": "esriSLSSolid",
		"color": [255,255,255,255],
		"width": 1
	}
};
var vendorRenderer = 
	{"type": "uniqueValue",
	"field1" : "Sym",
	"defaultSymbol": vendor_green1,
	"uniqueValueInfos": [
		{"value": "Green1",
		 "symbol": vendor_green1
		},
	   {"value": "Green2",
		 "symbol": vendor_green2
		}
			]
	};

var vendor_grey = {
	"style": "esriSFSSolid",
	"color": [225, 225, 225, 255],
	"outline" : {
		"style": "esriSLSNull",
		"color": [225,225,225,255],
		"width": 0
	}
};

layerList.push(
	{"id":"EXPO-Vendors",
		"minScale": 9028,
		"toggleOnList": ["expo"],
		"layerInfo":{"type":"json","file":"assets/data/expo-vendors.json"},
		"graphicSymbol":vendor_grey,

		"createLabels": true,
	    "labelColor": [0,0,0,255]
});

layerList.push(
	{"id":"EXPO-Extras",
		"minScale": 9028,
		"toggleOnList": ["expo"],
		"layerInfo":{"type":"json","file":"assets/data/expo-extras.json"},
		"graphicSymbol":vendor_green1,

		"createLabels": true,
	    "labelColor": [255,255,255,255]
});

layerList.push(
	{"id":"EXPO-ChipScan",
		"minScale": 9028,
		"toggleOnList": ["expo"],
		"layerInfo":{"type":"json","file":"assets/data/expo-chipscan.json"},
		"graphicSymbol":vendor_green2,

		"createLabels": true,
	    "labelColor": [0,0,0,255]
});
			
//Finish
var finish_area = {
	"style": "esriSFSSolid",
	"color": [255,190,190,255],
	"outline" : {
		"style": "esriSLSNull",
		"color": [255,190,190,255],
		"width": 0
	}
}
layerList.push(
	{"id":"Finish-Background",
		"minScale": 144447.7,
		"maxScale": 4512,
		"toggleOnList": ["finish"],
		"layerInfo":{"type":"json","file":"assets/data/finish_background.json"},
		"graphicSymbol":finish_area,
		"createLabels": true,
	    "labelColor": [0,0,0,255]
});

var finish_details= {
	"style": "esriSFSSolid",
	"color": [255,190,190,255],
	"outline" : {
		"style": "esriSLSNull",
		"color": [255,190,190,255],
		"width": 0
	},
	"createLabels": true,
	"labelColor": [0,0,0,255]		
}
layerList.push(
	{"id":"Finish-Details",
		"minScale": 2257,
		"toggleOnList": ["finish"],
		"layerInfo":{"type":"json","file":"assets/data/finish_detail.json"},
		"graphicSymbol":finish_details,
		"createLabels": true,
	    "labelColor": [0,0,0,255]
});
//Buses
var busSymbol = {"type": "simple",
				"symbol": {"type": "esriPMS",
				"url":"assets/images/bus.png", 
				"height": 10, 
				"width": 10
}};

layerList.push(
	{"id":"Buses",
		"minScale": 1155581,
		"toggleOnList": ["bus"],
		"layerInfo":{"type":"csv","file":"assets/data/return_bus.csv"},
		"rendererInfo":{
			"type":"simple",
			"svr": busSymbol
			}
	});



var bCourseSymbol = {
	"style": "esriSLSSolid",
	"color": [43, 193, 162, 200],
	"width" : 3
};

var bCourseSymbolTrad = {
	"style": "esriSLSDot",
	"color": [43, 193, 162, 200],
	"width" : 3
};

//Irvin
var iCourseSymbol = {
	"style": "esriSLSSolid",
	"color": [188, 99, 0, 200],
	"width" : 3
};
	
layerList.push(
	{"id":"Irvin-Course",
		"toggleOnList": ["irvin"],
		"layerInfo":{"type":"json","file":"assets/data/irvin_Course.json"},
		"graphicSymbol":iCourseSymbol
	});

var iMMRenderer = 
	{"type": "uniqueValue",
	"field1" : "type",
	"uniqueValueInfos": [
		{"value": "MM",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/iMM.png", 
					"height": 21, 
					"width": 14}
		},
		{"value": "F",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/iFin.png", 
					"height": 21, 
					"width": 142}
		}
	]
};

layerList.push(
	{"id":"Irvin-MileMarkers",
		"minScale": 577700,
		"toggleOnList": ["irvin"],
		"layerInfo":{"type":"csv","file":"assets/data/irvin_mileMarkers.csv"},
		"rendererInfo":{
			"type":"unique",
			"uvr": iMMRenderer
			},
		"createLabels": true
	}
);

layerList.push(
	{"id":"Bjorklund-Course",
		"toggleOnList": ["bjorklund"],
		"layerInfo":{"type":"json","file":"assets/data/bjorklund_Course2018.json"},
		"graphicSymbol":bCourseSymbol
	});

layerList.push(
	{"id":"Bjorklund-CourseTrad",
		"toggleOnList": ["bjorklund"],
		"layerInfo":{"type":"json","file":"assets/data/traditionalSection_2018.json"},
		"graphicSymbol":bCourseSymbolTrad
	});
	
var bMMRenderer = 
	{"type": "uniqueValue",
	"field1" : "type",
	"uniqueValueInfos": [
		{"value": "MM",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/bMM.png", 
					"height": 21, 
					"width": 14}
		},
	   {"value": "MMFA",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/bMMFA.png", 
					"height": 35, 
					"width": 14}
		},
		{"value": "MMMT",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/bMMMT.png", 
					"height": 35, 
					"width": 14}
		},
		{"value": "MMMTo",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/bMMMTo.png", 
					"height": 38, 
					"width": 14}
		},
		{"value": "F",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/bMM.png", 
					"height": 27, 
					"width": 18}
		}
	]
};

layerList.push(
	{"id":"Bjorklund-MileMarkers",
		"minScale": 577700,
		"toggleOnList": ["bjorklund"],
		"layerInfo":{"type":"csv","file":"assets/data/bjorklund_mileMarkers_2018.csv"},
		"rendererInfo":{
			"type":"unique",
			"uvr": bMMRenderer
			},
		"createLabels": true
	}
);

var bBusSymbol = {"type": "simple",
				"symbol": {"type": "esriPMS",
				"url":"assets/images/busBjorklund.png", 
				"height": 10, 
				"width": 10
}};

layerList.push(
	{"id":"Bjorklund-Buses",
		"minScale": 1155581,
		"toggleOnList": ["bjorklund","bus"],
		"layerInfo":{"type":"csv","file":"assets/data/bjorklund_bus.csv"},
		"rendererInfo":{
			"type":"simple",
			"svr": bBusSymbol
			}
	});
	
//Grandma's layers
var gCourseSymbol = {
		"style": "esriSLSSolid",
		"color": [0,147, 68, 200],
		"width" : 2.5
	};

var gCourseSymbolTrad = {
		"style": "esriSLSDot",
		"color": [0,147, 68, 200],
		"width" : 2.5
	};
	
layerList.push(
	{"id":"Grandmas-Course",
		"defaultOn": true,
		"toggleOnList": ["grandmas"],
		"layerInfo":{"type":"json","file":"assets/data/grandmas_Course2018.json"},
		"graphicSymbol":gCourseSymbol
	});
	
layerList.push(
	{"id":"Grandmas-CourseTrad",
		"defaultOn": true,
		"toggleOnList": ["grandmas"],
		"layerInfo":{"type":"json","file":"assets/data/traditionalSection_2018.json"},
		"graphicSymbol":gCourseSymbolTrad
	});	
	
var gMMRenderer = 
	{"type": "uniqueValue",
	"field1" : "type",
	"uniqueValueInfos": [
		{"value": "MM",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/gMM.png", 
					"height": 21, 
					"width": 14}
		},
	   {"value": "MMFA",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/gMMFA.png", 
					"height": 35, 
					"width": 14}
		},
		{"value": "MMMT",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/gMMMT.png", 
					"height": 35, 
					"width": 14}
		},
		{"value": "MMMTo",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/gMMMTo.png", 
					"height": 38, 
					"width": 14}
		},
		{"value": "F",
		 "symbol": {"type": "esriPMS",
					"url":"assets/images/gMM.png", 
					"height": 27, 
					"width": 18}
		}							
	]
};

layerList.push(
	{"id":"Grandmas-MileMarkers",
		"defaultOn": false,
		"minScale": 288896,
		"toggleOnList": ["grandmas"],
		"layerInfo":{"type":"csv","file":"assets/data/grandmas_mileMarkers_2018.csv"},
		"rendererInfo":{
			"type":"unique",
			"uvr": gMMRenderer
			},
		"createLabels": true
	});	
var gBusSymbol = {"type": "simple",
				"symbol": {"type": "esriPMS",
				"url":"assets/images/busGrandmas.png", 
				"height": 10, 
				"width": 10
}};

layerList.push(
	{"id":"Grandmas-Buses",
		"minScale": 1155581,
		"toggleOnList": ["grandmas","bus"],
		"layerInfo":{"type":"csv","file":"assets/data/grandmas_bus.csv"},
		"rendererInfo":{
			"type":"simple",
			"svr": gBusSymbol
			}
	});
	
	//Parking
var skywalkSymbol = {
	"style": "esriSLSSolid",
	"color": [38, 115, 0, 200],
	"width" : 2
};
var lakeWalkSymbol = {
	"style": "esriSLSSolid",
	"color": [76, 230, 0, 200],
	"width" : 2
};

var skywalkRenderer = 
	{"type": "uniqueValue",
	"field1" : "Name",
	"uniqueValueInfos": [
		{"value": "Skywalk",
		 "symbol": skywalkSymbol
		},
	   {"value": "Lakewalk",
		 "symbol": lakeWalkSymbol
		}							
	]
};
	
layerList.push(
	{"id":"Parking-Skywalk",
		"minScale": 18055,
		"toggleOnList": ["parking"],
		"layerInfo":{"type":"json","file":"assets/data/parking_skywalk.json"},
		"graphicSymbol":skywalkSymbol
	});

var pLotSymbol = {
	"style": "esriSFSSolid",
	"color": [38, 115, 0, 255],
	"outline" : {
		"style": "esriSLSNull",
		"color": [0,0,0,0],
		"width": 0
	}
};

layerList.push(
	{"id":"Parking-Lots",
		"minScale": 36112,
		"toggleOnList": ["parking"],
		"layerInfo":{"type":"json","file":"assets/data/parking_lots.json"},
		"graphicSymbol":pLotSymbol
	});

