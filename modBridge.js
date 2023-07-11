autowatch = 1;

inlets = 2;
outlets = 1;


aumhaa = require('_base');
var FORCELOAD = false;
var DEBUG = true;
var MOD_DEBUG = false;
aumhaa.init(this);

var script = this;
var finder;
var legacy = false;
var mod;
var mod_finder;

var unique = jsarguments[1] != undefined ? jsarguments[1] : 'modBridge'
var type = jsarguments[2] != undefined ? jsarguments[2] : 'modBridge';

var initialize_instance = function(){}

// var Translations = require(type+"Translations");
// var Colors = require(type+"Colors");
include(type+'Functions', this);

var Mod = ModComponent;
var ModProxy = ModProxyComponent

function init(){
	debug(type, ': modBridge init');
	mod = new ModProxy(script, ['Send', 'SendDirect', 'restart']);
	found_mod = new Mod(script, 'hex', unique, false);
	if(MOD_DEBUG){found_mod.debug = debug;}
	mod_finder = new LiveAPI(mod_callback, 'this_device');
	found_mod.assign_api(mod_finder);

	// setup_tests();
	deprivatize_script_functions(this);

	Alive = 1;
}

function mod_callback(args){
	if((args[0]=='value')&&(args[1]!='bang')){
		// debug('mod callback:', args);
		if(args[1] in script){
			// debug(script[args[1]]);
			script[args[1]].apply(script, args.slice(2));
		}
		if(args[1]=='disconnect'){
			mod.restart.schedule(3000);
		}
	}
}


// function _grid(x, y, val) {
// 	outlet(0, 'grid', x, y, val);
// }

// function _key(x, val) {
// 	outlet(0, 'key', x, val);
// }

// function active_handlers(){
// 	handlers = arrayfromargs(arguments);
// 	codec_handler = false;
// 	for(var i in handlers){
// 		if(handlers[i]=='CodecModHandler'){
// 			codec_handler = true;
// 		}
// 	}
// }

function alive(val){
	initialize(val);
}

//called when mod.js is finished loading for the first time
function initialize(val){
	if(val>0){
		mod = found_mod;
	}
}


function anything()
{
	var args = arrayfromargs(arguments);
	// debug('anything', type+':', args);
}

forceload(script);
