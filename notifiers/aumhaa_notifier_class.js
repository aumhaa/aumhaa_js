//aumhaa_notifier_class.js

var util = require('aumhaa_util');
util.inject(this, util);

var LOCAL_DEBUG = false;
var lcl_debug = LOCAL_DEBUG && util.Debug ? util.Debug : function(){}

var EventEmitter = require('aumhaa_event_emitter').EventEmitter;

/////////////////////////////////////////////////////////////////////////
//This is the root object to be used for all controls, or objects that
//will serve as notifiers to other objects.  It maintains a list of listeners as well as a
//"target_stack" that can be used to push/pop targets to be notified when its value changes
//(only the first target in the stack is notified).  Notifier is "subclassed" by many other prototypes.

function NotifierClass(name, args){
	// this.add_bound_properties(this, [
	// 	'get_target_name',
	// 	'_target_heap',
	// 	'_listeners',
	// 	'_enabled',
	// 	'add_listener',
	// 	'remove_listener',
	// 	'set_target',
	// 	'get_target',
	// 	'clear_targets',
	// 	'remove_target',
	// 	'notify',
	// 	'set_enabled',
	// 	'_value'
	// ]);
	this._value = -1;
	this._target_heap = [];
	this._enabled = true;
	this._display_value = false;
	this._is_setting = false;
	this._display_message = function(){};
	NotifierClass.super_.call(this, name, args);
	// this.autobind(this);
	if(this._callback!=undefined){
		this.set_target(this._callback);
	}
	// this._events.Notify = [];
	// this._events.NotifyTarget = [];
	// this._events.NotifySend = [];
	// debug('finishing up', this._name);
}

util.inherits(NotifierClass, EventEmitter);

NotifierClass.prototype.get_target = function(){return this.instance._target_heap[0];}

NotifierClass.prototype.get_target_name = function(){return this.instance._target_heap[0]._name;}

NotifierClass.prototype.set_target = function(target){
	var self = this.instance;
	self._target_heap = self._target_heap.filter(function(item){
		return item!=target
	});
	target&&self._target_heap.unshift(target);
	self._events.NotifyTarget = [];
	self.on('NotifyTarget', target);
}

NotifierClass.prototype.remove_target = function(target){
	var self = this.instance;
	if(target){
		self._target_heap = self._target_heap.filter(function(item){
			return item!=target
		});
	}
	else{
		self._target_heap.shift();
	}
	self._events.NotifyTarget = self._target_heap[0] ? [self._target_heap[0]] : [];
}

NotifierClass.prototype.clear_targets = function(){
	var self = this.instance
	self._target_heap = [];
	self._events.NotifyTarget = [];
}

NotifierClass.prototype.add_listener = function(callback){
	this.instance.on('Notify', callback);
}

NotifierClass.prototype.remove_listener = function(callback){
	this.instance.off('Notify', callback);
}

NotifierClass.prototype.notify = function(obj){
	var self = this.instance
	lcl_debug('notify', self._name, JSON.stringify(self._events));
	obj = obj!=undefined ? obj : self;
	self.emit('NotifyTarget', obj);
	self.emit('Notify', obj);
	if(self._display_value>0){
		self._displayMessage(self._name + ' : ' + self._value);
	}
	lcl_debug('finished_notifying');
}

NotifierClass.prototype.set_enabled = function(val){
	this.instance._enabled = (val>0);
}

exports.NotifierClass = NotifierClass;
