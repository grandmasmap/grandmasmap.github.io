// if ((window.location.hostname.toLowerCase().indexOf("grandmasmarathonmap.")  === -1) || 
   // (window.location.pathname.toLowerCase().indexOf("sample.html") > -1)){
	// if (screen.width < toggleBoxWidth9){
		// window.location = "http://www.GrandmasMarathonMap.com";
	// }
// }
if (screen.width < 326){
    try {
		if( window.self !== window.top){
			if (window.self.toLocaleString().indexOf("2018") > -1){
				window.top.location.href = "http://www.GrandmasMarathonMap.com/2018";
			} else {
				window.top.location.href = "http://www.GrandmasMarathonMap.com";
			}
		}
    } catch (e) {
		if (window.self.toLocaleString().indexOf("2018") > -1){
			window.top.location.href = "http://www.GrandmasMarathonMap.com/2018";
		} else {
			window.top.location.href = "http://www.GrandmasMarathonMap.com";
		}
    }
}
var dbgMode = true;
var esri;
loadCss("assets/css/gmmap.css");
loadScript("assets/js/var.js");
loadScript("//js.arcgis.com/3.24/"); 

addNewDiv("div","ToggleBoxFull","ToggleBoxFull",'mapArea');
addNewDiv("div","ToggleBox","ToggleBox",'ToggleBoxFull');
addNewDiv('div',"map","map",'mapArea');
addNewDiv('div','BasemapToggle','BasemapToggle','map');
addNewDiv('img','MattLogo','MattLogo','map');

loadCss("//js.arcgis.com/3.24/esri/css/esri.css");

var ToggleList = ["GrandmasToggle","BjorklundToggle","IrvinToggle","BusToggle","ExpoToggle","FinishToggle","ParkingToggle","LodgingToggle","GPSToggle"];

for (var i = 0; i < ToggleList.length; i++) {
	var iToggle = ToggleList[i];
	var iToggleHTML = 'img';
	addNewDiv(iToggleHTML,iToggle,"LegendToggle",'ToggleBox');
}

document.getElementById("MattLogo").src = "assets/images/me.png";
document.getElementById("MattLogo").addEventListener('click', openMe, false);
function openMe(){
	if (openedMe !== true){
		openedMe = true;
		window.open("https://www.linkedin.com/in/matthew-rantala-6303778")
	}
	
}
//#########################################
// Functions
function addElement(inElementPath,inType){
	
	var newElement;
	if (inType=="css"){
		newElement=document.createElement("link");
		newElement.rel="stylesheet";
		newElement.type="text/css";
		newElement.href=inElementPath;
	} else {
		newElement=document.createElement("script");
		newElement.type="text/javascript";
		newElement.src = inElementPath;
	}
	
	document.getElementsByTagName("head")[0].appendChild(newElement);
} 

function loadScript(url){
	addElement(url,"script");
}

function loadCss(url){
	addElement(url,"css");
}

function addNewDiv(inElementHTML,inID,inClassname,inParentID ){
	var newDiv = document.createElement(inElementHTML);
	if (inID !== null){
		newDiv.id=inID;
	}
	if (inClassname !== null){
		newDiv.className=inClassname;
	}
	document.getElementsByClassName(inParentID)[0].appendChild(newDiv);
}

function waitForEsri(){
  try {
	if (typeof(esri.Map) == "undefined"){
		setTimeout(waitForEsri, 250);
	} else { 
		resizeFrame();
		if ((gMap === null) || (typeof(gMap) == "undefined")){
			loadScript("assets/js/makeMap.js"); 
		}
	}
  }
  catch (err) {
	setTimeout(waitForEsri, 150);
  }
}

waitForEsri();

function clickToggle(){
	//var theToggle = document.getElementById(this.id);

	if (isOn(this)){
		this.classList.remove(toggleOnValue);
		this.classList.add(toggleOffValue);
	} else {
		this.classList.remove(toggleOffValue);
		this.classList.add(toggleOnValue);
		if (this.id === "GrandmasToggle"){
			var bjorklundToggle = document.getElementById("BjorklundToggle");
			bjorklundToggle.classList.remove(toggleOnValue);
			bjorklundToggle.classList.add(toggleOffValue);
			var irvinToggle = document.getElementById("IrvinToggle");
			irvinToggle.classList.remove(toggleOnValue);
			irvinToggle.classList.add(toggleOffValue);
		}
		if (this.id === "BjorklundToggle"){
			var GrandmasToggle = document.getElementById("GrandmasToggle");
			GrandmasToggle.classList.remove(toggleOnValue);
			GrandmasToggle.classList.add(toggleOffValue);
			var irvinToggle = document.getElementById("IrvinToggle");
			irvinToggle.classList.remove(toggleOnValue);
			irvinToggle.classList.add(toggleOffValue);
		}
		if (this.id === "IrvinToggle"){
			var GrandmasToggle = document.getElementById("GrandmasToggle");
			GrandmasToggle.classList.remove(toggleOnValue);
			GrandmasToggle.classList.add(toggleOffValue);
			var bjorklundToggle = document.getElementById("BjorklundToggle");
			bjorklundToggle.classList.remove(toggleOnValue);
			bjorklundToggle.classList.add(toggleOffValue);
		}		
	}
	
	layerControl();
	if (wpid !== null){
		//lastGPSTime -= GPSMinInterval;
		setTimeout(updateGPS, 100);
	}
}

function layerControl(){
	var toggles = document.getElementsByClassName("LegendToggle");
	var visibleDict = {};
	var mapScale = gMap.getScale();
	
	for (var i = 0; i < toggles.length; i++) {
		visibleDict[toggles[i].id.replace("Toggle","").toLowerCase()] = isOn(toggles[i]);
	}
	
	for (var i = 0; i < layerList.length; i++){
		
		var iLayerInfo = layerList[i];
		var iLayerId = iLayerInfo["id"];
		var turnOn = true;
		
		if (iLayerInfo.hasOwnProperty("toggleOnList")){
			iLayerToggleList = iLayerInfo["toggleOnList"];
			for (var i2 = 0; i2  < iLayerToggleList.length; i2++){
				if (visibleDict[iLayerToggleList[i2].toLowerCase()] !== true){
					turnOn = false;
				}
			}
		}

		var iTempLayer = gMap.getLayer(iLayerId);
		var iLabelLayer = gMap.getLayer(iLayerId+"-Labels");

		var iVisibilityFunction = null;
		if (iLayerInfo.hasOwnProperty("visibilityChangeFunction")){
			iVisibilityFunction = iLayerInfo["visibilityChangeFunction"];
		}
		if (iTempLayer !== undefined){
			if (iTempLayer.visible === true){
				if (turnOn === false){
					iTempLayer.hide();
					if (iVisibilityFunction !== null){
						iVisibilityFunction(iLayerInfo,iTempLayer);
					}
				}
			} else {
				if (turnOn === true){
					iTempLayer.show();
					if (iVisibilityFunction !== null){
						iVisibilityFunction(iLayerInfo,iTempLayer);
					}
				}			
			}
			
			if (iLabelLayer !== undefined){
				if (iTempLayer.visible){
					iLabelLayer.show();
				} else {
					iLabelLayer.hide();
				}
			}
		}
	}
}

function isOnByID(inID){
	return isOn(document.getElementById(inID));
}
function isOn(inElement){
	return inElement.classList.contains(toggleOnValue);
}
function postMapCreation(){
	
	var toggles = document.getElementsByClassName("LegendToggle");
	var classname = document.getElementsByClassName("classname");
	for (var i = 0; i < toggles.length; i++) {
		toggles[i].addEventListener('click', clickToggle, false);
		if (i===0){
			toggles[i].classList.add(toggleOnValue);
		} else {
			toggles[i].classList.add(toggleOffValue);
		}
	}
	extentChanged();
	layerControl();
	for (var i = 0; i < ToggleList.length; i++) {
		var iToggle = ToggleList[i];
		document.getElementById(iToggle).src = "assets/images/"+iToggle+".png";
	}
	gMap.setExtent(gInitExtent);
}

function resizeFrame(){
	try{
		var theURL = document.URL.toLowerCase();
		var mapIframe = window.parent.document.getElementById("mapFrame");
		if (mapIframe !== null){
		//if (!(theURL === "http://grandmasmarathonmap.com") && !(theURL = "http://grandmasmarathonmap.com/index.html")){
			if (window.parent.document.getElementsByClassName("entry-content").length >0){
				var iDoc = window.parent.document.getElementsByClassName("entry-content")[0];
				var iWidth = iDoc.clientWidth;
				var iHeight = iDoc.clientHeight;
				if ((iWidth > 10) && (iHeight > 10)){
						var iPadL = window.getComputedStyle(mapIframe, null).getPropertyValue('padding-left');
						var iPadR = window.getComputedStyle(mapIframe, null).getPropertyValue('padding-right');
						if (iHeight < iWidth){
							iHeight = iWidth;
						}
						if (iHeight < 300){
							iHeight = 300;
						}
						if (Math.abs(mapIframe.width - iWidth) > 10){
							mapIframe.width =  iWidth;
						}
						
						if (Math.abs(mapIframe.height - iHeight) > 10){
							mapIframe.height = iHeight;
						}
				}
			}
		}
	} catch(err) {
		console.log(err);
		console.log("error picking the url");
	}
}

function showHotel(g,screenPoint){
	var hotels = [g];
	var content = "";

	  content += "<table>";

	  //Build a table containing a row for each feature found
	  dojo.forEach(hotels,function(row){
		content += "<tr><th>"+ row.attributes['Name'] + "</th></tr>" + 
		"<tr><td>"+row.attributes['info'] +"</td></tr>";
	  })
	  content += "</table>";

	 //display the results in an infow window
	 gMap.infoWindow.setContent(content);
	 gMap.infoWindow.setTitle("Identify Results");
	 gMap.infoWindow.show(screenPoint,gMap.getInfoWindowAnchor(screenPoint));
}
function mapClick(evt){
	var extentGeom = pointToExtent(gMap,evt.mapPoint,select_tolerance);
	
	if (gMap.getLayer("Lodging").visible){
		dojo.forEach(gMap.getLayer("Lodging").graphics, function(g) {
			if (extentGeom.contains(g.geometry)){
				showHotel(g,evt.screenPoint);
				return true;
			}
		});
	}
}

function pointToExtent(map, point, toleranceInPixel) {
  //calculate map coords represented per pixel
  var pixelWidth = map.extent.getWidth() / map.width;
  //calculate map coords for tolerance in pixel
  var toleraceInMapCoords = toleranceInPixel * pixelWidth;
  //calculate & return computed extent
  return new esri.geometry.Extent( point.x - toleraceInMapCoords,
               point.y - toleraceInMapCoords,
               point.x + toleraceInMapCoords,
               point.y + toleraceInMapCoords,
               map.spatialReference );
}

function extentChanged(evt){
	resizeFrame();
	try{
		var mapDiv = document.getElementById("map");
		var mapWidth = mapDiv.clientWidth;
		var toggleBoxFullDiv = document.getElementById("ToggleBoxFull");
		var toggleBoxDiv = document.getElementById("ToggleBox");
		var mapDiv = document.getElementById("map");

		if (mapWidth < ( toggleBoxWidth - 32)){
			//toggleBoxDiv.style.top = "85px";
			//toggleBoxDiv.style.left = "20px";
			//toggleBoxDiv.style.width = "35px";
			var leftAdjustment = (mapWidth - (toggleBoxWidth/1.8)) / 2;
			toggleBoxDiv.style.width = (toggleBoxWidth/1.8)+"px";
			toggleBoxDiv.style.left = leftAdjustment+"px";
			toggleBoxDiv.style.right = leftAdjustment+"px";
			toggleBoxDiv.style.top = "8px";
			toggleBoxDiv.style.height = "69px";
			toggleBoxFullDiv.style.height = "71px";
			mapDiv.style.top = "69px";
			mapDiv.style.height = (window.innerHeight - 69)+"px";
			if (document.getElementById("ToggleBox").style.visibility === "hidden"){
				document.getElementById("ToggleBox").style.visibility = "";
			}
		} else {	
			// var toggleWidth=toggleBoxDiv.clientWidth;
			
			var leftAdjustment = (mapWidth - toggleBoxWidth) / 2;
			toggleBoxDiv.style.width = toggleBoxWidth+"px";
			toggleBoxDiv.style.left = leftAdjustment+"px";
			toggleBoxDiv.style.right = leftAdjustment+"px";
			toggleBoxDiv.style.height = "37px";
			mapDiv.style.top = "37px";
			mapDiv.style.height = (window.innerHeight - 37)+"px";
			toggleBoxDiv.style.top = "8px";
			toggleBoxFullDiv.style.height = "39px";

			if (document.getElementById("ToggleBox").style.visibility === "hidden"){
				document.getElementById("ToggleBox").style.visibility = "";
			}
		}
		layerControl();
	} catch(err) {
		console.log(err);
	}
}

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-24927766-12', 'auto');
  ga('send', 'pageview');

var sc_project=10465004; 
var sc_invisible=1; 
var sc_security="123e67fa";
function statCounter(){
	document.write("<script type='text/javascript' src='https://www.statcounter.com/counter/counter.js'></script>");
}
statCounter();