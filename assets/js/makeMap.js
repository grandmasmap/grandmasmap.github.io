//dojo.require("esri.dijit.PopupMobile");
dojo.require("esri.tasks.query"); 
dojo.require("esri.layers.GraphicsLayer");
dojo.require("esri.symbols.TextSymbol");
dojo.require("esri.symbols.Font");
dojo.require("esri.geometry.Extent");

dojo.require("esri.dijit.BasemapToggle");

dojo.require("esri.layers.CSVLayer");
dojo.require("esri.symbols.SimpleMarkerSymbol");
dojo.require("esri.renderer");

dojo.require("esri.map"); 

createMap();

function createMap(){
	if (gMap !== null){
		return true;
	}

	if (typeof(esri.dijit.PopupMobile) == undefined){
		setTimeout(createMap, 150);
		return true
	}
	
	gInitExtent = new esri.geometry.Extent({"xmin":initExtentCoords["xmin"],"ymin":initExtentCoords["ymin"],"xmax":initExtentCoords["xmax"],"ymax":initExtentCoords["ymax"], "spatialReference":{"wkid":initExtentCoords["sr"]}});
	  gMap = new esri.Map("map", {
		extent: gInitExtent,
		basemap: "topo"
	  });

	var mapExtentChangeEvent = gMap.on("extent-change",extentChanged);
	var mapOnClickEvent = gMap.on("click",mapClick);
	window.addEventListener('resize',function(e){extentChanged();});
	//gMap["infoWindow"] = new esri.dijit.PopupMobile(null,dojo.create("div"));
  makeToggle();
  loadData();
  postMapCreation();
}

function makeToggle(){
  if (typeof(esri.dijit.BasemapToggle) == "undefined"){
	setTimeout(makeToggle, 100);
  } else {  
	
	if ((basemapToggle === null) || (typeof(basemapToggle) == "undefined")){
		basemapToggle = new esri.dijit.BasemapToggle({
			map: gMap,
			basemap: "hybrid"
		}, "BasemapToggle");
	
	    var evtToggleLoad = basemapToggle.on("load", function(){
			document.getElementsByClassName("basemapTitle")[0].style.visibility = "hidden";
			document.getElementsByClassName("basemapTitle")[0].style.display = "none";
		});

		var evtToggleToggle = basemapToggle.on("toggle",  function(){
			document.getElementsByClassName("basemapTitle")[0].style.visibility = "hidden";
			document.getElementsByClassName("basemapTitle")[0].style.display = "none";
		});
	
		basemapToggle.startup();
		setTimeout(basemapToggle_setupClick,100);
	}	
  } 	
}

function basemapToggle_setupClick(){
	if (document.getElementsByClassName("BasemapToggle").length = 0){
		setTimeout(basemapToggle_setupClick,500);
	} else {
		document.getElementsByClassName("BasemapToggle")[0].onclick =basemapToggleClick;
	}
}
function basemapToggleClick(){
	if (GPSLayer.visible){
		if (GPSPosition !== null){
			setTimeout(showPosition(null),250);
			setTimeout(showPosition(null),2000);
			setTimeout(showPosition(null),5000);
		}		
	}
}

function loadData(){
	if (typeof(esri.layers.CSVLayer) == "undefined"){
		setTimeout(loadData, 100);
	} else {
		
		for (var i = 0; i < layerList.length; i++){
			var iLayerInfo = layerList[i];
			var iLayerId = iLayerInfo["id"];
			
			var iTempLayer = layerFactory(iLayerInfo);
			if (iTempLayer === null){
				continue;
			}

			var iRenderer = rendererFactory(iLayerInfo);
			if (iRenderer !== null){
				iTempLayer.renderer = iRenderer;
			}

			defaultOn(iLayerInfo,iTempLayer);
			gMap.addLayer(iTempLayer);
		}

		setTimeout(makeLabelLayers,3);
	}
}

function defaultOn(iLayerInfo,iTempLayer){
	if (iTempLayer !== undefined){
		if ((iLayerInfo.hasOwnProperty("defaultOn")) && (iLayerInfo["defaultOn"] === true)){
			iTempLayer.show();
		} else {
			iTempLayer.hide();
		}
		if (iLayerInfo.hasOwnProperty("minScale")){
			iTempLayer.minScale = iLayerInfo["minScale"];
		}

		if (iLayerInfo.hasOwnProperty("maxScale")){
			iTempLayer.maxScale = iLayerInfo["maxScale"];
		}
	}
			
}
function makeLabelLayers(){
	for (var i = 0; i < layerList.length; i++){
		var iLayerInfo = layerList[i];
		if (((iLayerInfo.hasOwnProperty("createLabels"))) && (iLayerInfo["createLabels"] === true)){
			var iLayerId = iLayerInfo["id"];console.log(iLayerId);
			
			tmpFunction = function(thisID,thisLayerInfo){
				return function(){
					makeTheLabels(thisID,thisLayerInfo);
				}
			}
			var z = tmpFunction(iLayerId,iLayerInfo);
			setTimeout(z, 100);
		}
	}
}

function makeTheLabels(iLayerId,iLayerInfo){
	var iLayer = gMap.getLayer(iLayerId);

	if (iLayer.graphics.length === 0){
		tmpFunction = function(thisID,thisLayerInfo){
			return function(){
				makeTheLabels(thisID,thisLayerInfo);
			}
		}
		var z = tmpFunction(iLayerId,iLayerInfo);
		setTimeout(z, 100);
		return true;
	}

	var tempLayer = new esri.layers.GraphicsLayer({"id":iLayerId+"-Labels", "spatialReference":iLayer.spatialReference});
	var iFont = new esri.symbol.Font (10, esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_NORMAL, "sans-serif");

	for (var i2 = 0; i2 < iLayer.graphics.length; i2++){
		var iGeo = iLayer.graphics[i2].geometry;
		
		var iName= iLayer.graphics[i2].attributes["Name"];
		var iTextSymbol = new esri.symbol.TextSymbol(iName);

		iTextSymbol.setHorizontalAlignment("center");
		if (iLayerInfo.hasOwnProperty("labelColor")){
			iTextSymbol.color = new esri.Color(iLayerInfo["labelColor"]);
		} else {
			iTextSymbol.color = new esri.Color([255,255,255,255]);
		}

		iTextSymbol.setFont(iFont);
		
		var iLabelPointGraphic = new esri.Graphic(iGeo,iTextSymbol);
		tempLayer.add(iLabelPointGraphic);
	}
	defaultOn(iLayerInfo,tempLayer)

	gMap.addLayer(tempLayer);
	gMap.setExtent(gInitExtent);
}

	
function rendererFactory(iLayerInfo){
	if (!(iLayerInfo.hasOwnProperty("rendererInfo"))){
		return null;
	}
	var iRendererType = iLayerInfo["rendererInfo"]["type"];
	if (iRendererType == "unique"){
		return (new esri.renderer.UniqueValueRenderer(iLayerInfo["rendererInfo"]["uvr"]));
	}
	if (iRendererType === "simple"){
		return (new esri.renderer.SimpleRenderer(iLayerInfo["rendererInfo"]["svr"]));
	}
	return null;
}

function layerFactory(iLayerInfo){
	var iLayerType = iLayerInfo["layerInfo"]["type"];
	
	if (iLayerType == "csv"){
		return loadCSV(iLayerInfo);
	}
	
	if (iLayerType === "json"){
		return loadJson(iLayerInfo);
	}
	
	if (iLayerType === "gps"){
			return loadGPS(iLayerInfo);
	}
	return null;
}

function checkGeolocation(){
	var hasGeolocation = true;
	var currentWidth = toggleBoxWidth;
	var newWidth = toggleBoxWidth9; //Assume it has it
	var GPSToggle = document.getElementById("GPSToggle");
	if (navigator.geolocation){
		if (GPSToggle != "undefined"){
			if (GPSToggle.classList.contains("isHidden") === true){
				GPSToggle.classList.remove("isHidden");
			}	
		}
	} else {
		newWidth = toggleBoxWidth8;
		hasGeolocation = false;
		
		if (GPSToggle != "undefined"){
			if (GPSToggle.classList.contains("isHidden") !== true){
				GPSToggle.classList.add("isHidden");
			}
		}
	}
	
	if (currentWidth !== newWidth){
		toggleBoxWidth = newWidth;
	}
	
	return hasGeolocation;
}

function loadGPS(iLayerInfo){
	
		var iLayerId = iLayerInfo["id"];
		
		GPSLayer = new esri.layers.GraphicsLayer({"id":iLayerId});
		defaultOn(iLayerInfo,GPSLayer)

		GPSLayer.on("visiblity-change",updateGPS());
		iLayerInfo["visibilityChangeFunction"] = updateGPS;
		return GPSLayer;
}

function updateGPS(){
	//var coordinatesElement = document.getElementById("Coordinates");
	
	if (checkGeolocation() && (GPSLayer.visible)){
		var geo_options= {
			enableHighAccuracy: true,
			maximumAge: 30000,
			timeout: 27000
		};
		
		wpid = navigator.geolocation.watchPosition(showPosition,GPSError,geo_options);
	} else {
		if (wpid !== null){
			if (checkGeolocation()){
				navigator.geolocation.clearWatch(wpid);
			}
		}
	}
}

function showPosition(position){
	if (position !== null){
		GPSPosition = position;
	} else {
		position = GPSPosition;
	}
	if (GPSLayer.visible){
		//var d = new Date();
		//thisTime = d.getTime();	
		
		//if ((thisTime - lastGPSTime) > GPSMinInterval){
			GPSCounter +=1;
			var locationInfo = (GPSCounter+" "+position.coords.latitude+" "+position.coords.longitude+" "+position.coords.heading+" "+position.coords.speed+" "+position.coords.accuracy).toString().replace(/NaN/g,"").replace(/null/g,"");
			console.log("POS: "+locationInfo);
			//document.getElementById("Coordinates").innerHTML = locationInfo;
		
			var gpsPoint = esri.geometry.geographicToWebMercator(new esri.geometry.Point(position.coords.longitude, position.coords.latitude));
			gMap.centerAt(gpsPoint);

			var gpsIconFile = "GPS_nodir_";
			var baseMapColor = "white";
			if (gMap.getBasemap() !== "hybrid"){
				baseMapColor = "green";
			}
			
			gpsIconFile += baseMapColor+".png";
			GPSsymbol = new esri.symbol.PictureMarkerSymbol("assets/images/"+gpsIconFile, 24, 24);
			
			if ((position.coords.heading !== null) && (!isNaN(position.coords.heading))){
				GPSsymbol.setAngle(position.coords.heading - 90);
				gpsIconFile = "GPS_dir_";
			}

			
			var gpsGraphic = new esri.Graphic(gpsPoint, GPSsymbol);
			GPSLayer.clear();
			GPSLayer.add(gpsGraphic);
			
		//}
	}
}

function GPSError(error) {
	var GPSToggle = document.getElementById("GPSToggle");
	GPSToggle.classList.remove(toggleOnValue);
	GPSToggle.classList.add(toggleOffValue);
	console.log("ERROR");
		switch(error.code){
			case error.PERMISSION_DENIED:
			console.log("Denied");
			break;
			case error.POSITION_UNAVAILABLE:
			console.log("Unavialable");
			break;
			case error.TIMEOUT:
			console.log("Timeout");
			break;
			case error.UNKNOWN_ERROR:
			console.log("Unknown");
			break;
		}
	
}
function readJson(inFile){
	try{
		var h = new XMLHttpRequest();
		h.open("GET",inFile,false);
		h.send(null);
		return JSON.parse(h.responseText);
	} 
	catch (err) {
		console.log("Error Reading "+inFile);
		console.log(err);
	}
	return {};
}

function symbolFactory(iGraphicSymbolInfo){
	var graphicSymbol = null;
	
	if (iGraphicSymbolInfo["style"] === "esriSLSSolid"){
		graphicSymbol = new esri.symbol.SimpleLineSymbol({"style": "esriSLSSolid","color": iGraphicSymbolInfo["color"],"width" : iGraphicSymbolInfo["width"]});
	}

	if (iGraphicSymbolInfo["style"] === "esriSLSDash"){
		graphicSymbol = new esri.symbol.SimpleLineSymbol({"style": "esriSLSDash","color": iGraphicSymbolInfo["color"],"width" : iGraphicSymbolInfo["width"]});
	}

	if (iGraphicSymbolInfo["style"] === "esriSLSDot"){
		graphicSymbol = new esri.symbol.SimpleLineSymbol({"style": "esriSLSDot","color": iGraphicSymbolInfo["color"],"width" : iGraphicSymbolInfo["width"]});
	}
	
	if (iGraphicSymbolInfo["style"] === "esriSFSSolid"){
		var outlineInfo = iGraphicSymbolInfo["outline"];
		
		var outlineSymbol = new esri.symbol.SimpleLineSymbol({"style": outlineInfo["style"],"color": outlineInfo["color"],"width" : outlineInfo["width"]});
		graphicSymbol = new esri.symbol.SimpleFillSymbol({"style": iGraphicSymbolInfo["style"],"color": iGraphicSymbolInfo["color"],"outline":outlineSymbol});
	}
	
	return graphicSymbol;
}

function loadJson(iLayerInfo){
	var iLayerId = iLayerInfo["id"];
	var iJsonFile = iLayerInfo["layerInfo"]["file"];

	var graphicLayer = new esri.layers.GraphicsLayer({"id":iLayerId});

	var jsonObject = readJson(iJsonFile);
	
	var iGeometryType = jsonObject["geometryType"];
	var iSR = jsonObject["spatialReference"];
	var iFeatures = jsonObject["features"];
	var graphicSymbol = null;
	
	if (iLayerInfo.hasOwnProperty("graphicSymbol")){
		graphicSymbol = symbolFactory(iLayerInfo["graphicSymbol"]);
	}

	for (var i = 0; i < iFeatures.length; i++){

		var iFeature = iFeatures[i];
		var iFeatureGeometry = iFeature["geometry"];
		
		if (iGeometryType === "esriGeometryPolyline"){
			var iPaths = iFeatureGeometry["paths"];
			iFeatureGeometry = new esri.geometry.Polyline({"paths":iPaths,"spatialReference":iSR});
		}

		if (iGeometryType === "esriGeometryPolygon"){
			var iRings = iFeatureGeometry["rings"];
			iFeatureGeometry = new esri.geometry.Polygon({"rings":iRings,"spatialReference":iSR});			
		}
		var iFeatureAttributes = iFeature["attributes"];
		var newGraphic = new esri.Graphic (iFeatureGeometry,graphicSymbol,iFeatureAttributes,null);

		graphicLayer.add(newGraphic);
	}
	return graphicLayer;
}

function loadCSV(iLayerInfo){
	var iLayerId = iLayerInfo["id"];
	var iCsvFile = iLayerInfo["layerInfo"]["file"];
	
	var csvLayer = new esri.layers.CSVLayer(iCsvFile, {
	  id: iLayerId
	});

	return csvLayer;
	
}
