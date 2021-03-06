var Light = require("../models/Light");
var HueService = require("../services/HueService");
var ColorHelper = require("../helpers/ColorHelper");
var Config = require("../Config");

LightService.prototype = new HueService();

function LightService(options){
	this.options = options;
};


LightService.prototype.BuildStateForLight = function(lightStateProperties,lightObject)
{
	if(lightStateProperties["on"])
		lightObject.State = "on";
	else
		lightObject.State = "off";

	lightObject.Hue = lightStateProperties["hue"];
	lightObject.Brightness = lightStateProperties["bri"];
	lightObject.Saturation = lightStateProperties["sat"];
	lightObject.x = lightStateProperties["xy"][0];
	lightObject.y = lightStateProperties["xy"][1];
}

LightService.prototype.BuildLightsResponse = function(BridgeLights){   
	var clientLights = new Array();

	if(BridgeLights == null)
		return clientLights;
	for (var bridgeLightKey in BridgeLights) 
	{
	  if (BridgeLights.hasOwnProperty(bridgeLightKey)) 
	  {
	  	var colorHelper = new ColorHelper();
	  	var bridgeLight = BridgeLights[bridgeLightKey];
		var clientLight = new Light();
	    clientLight.lightid = bridgeLightKey;
	    this.BuildStateForLight(bridgeLight.state, clientLight);
		clientLight.Name = bridgeLight["name"];
		clientLight.ColorName = colorHelper.getColorName(clientLight.x,clientLight.y,clientLight.Brightness,clientLight.State);
		clientLights.push(clientLight);
	  }
	}
	return clientLights;
}

LightService.prototype.getLights = function(callback){
	var requestOptions = {
	    host: Config.host,
	    port: Config.hue.port,
	    path: Config.hue.uri + '/lights',
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    }
    };
    this.options = requestOptions;
    console.log(this.options);
    var self = this;
    this.getJSON(function(statusCode,obj){
		var lightsResp = self.BuildLightsResponse(obj);
		callback(statusCode,lightsResp);
    });
}

LightService.prototype.setLightState = function(state,lightid,colorHue,colorBri,colorSat,effect,callback){
	var requestOptions = {
	    host: Config.host,
	    port: Config.hue.port,
	    path: Config.hue.uri + '/lights/'+lightid+'/state',
	    method: 'PUT',
	    headers: {
	        'Content-Type': 'application/json'
	    },
    };


    this.options = requestOptions;
    var boolState = state=="on" ;
    var lightSwitchObj = { on: boolState, hue: colorHue, bri: colorBri, sat: colorSat, effect: effect};
    var self = this;


    this.getJSON(function(statusCode){
		callback(statusCode);
    },JSON.stringify(lightSwitchObj));
}

LightService.prototype.setGroupState = function(state,groupid,colorHue,colorBri,colorSat,effect,callback){
	var requestOptions = {
	    host: Config.host,
	    port: Config.hue.port,
	    path: Config.hue.uri + '/groups/'+groupid+'/action',
	    method: 'PUT',
	    headers: {
	        'Content-Type': 'application/json'
	    },
    };

    this.options = requestOptions;
    var boolState = state=="on" ;
    var lightSwitchObj = { on: boolState, hue: colorHue, bri: colorBri, sat: colorSat, effect: effect};
    var self = this;
    this.getJSON(function(statusCode){
		callback(statusCode);
    },JSON.stringify(lightSwitchObj));
}

module.exports = LightService;
