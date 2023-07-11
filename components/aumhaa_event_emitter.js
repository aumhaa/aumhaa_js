//aumhaa_event_emitter.js

var util = require('aumhaa_util');
util.inject(this, util);

var LOCAL_DEBUG = false;
var lcl_debug = LOCAL_DEBUG && util.Debug ? util.Debug : function(){}

var Bindable = require('aumhaa_bindable').Bindable;

var indexOf;
if(typeof Array.prototype.indexOf === 'function'){
  indexOf = function (haystack, needle) {
    return haystack.indexOf(needle);
	};
}
else{
  indexOf = function (haystack, needle) {
    var i = 0, length = haystack.length, idx = -1, found = false;
    while (i < length && !found) {
      if (haystack[i] === needle) {
        idx = i;
        found = true;
      }
    	i++;
    }
    return idx;
	};
};


function EventEmitter(name, args){
	this.add_bound_properties(this, [
		 '_events',
		 'on',
		 'off',
		 'emit',
		 'once',
     'clear_all_events'
	]);
  this._events = {};
	EventEmitter.super_.call(this, name, args);
  // this.autobind(this);
};

util.inherits(EventEmitter, Bindable);

EventEmitter.prototype.on = function(event, listener){
    var self = this.instance
		self.off(event, listener);
    if(listener == undefined) {
      lcl_debug('listener undefined', event);
    }
    else if (listener instanceof Object) {
      if ( !(self._events[event] instanceof Object)) {
          self._events[event] = [];
      }
      this._events[event].push(listener);
    }
};

EventEmitter.prototype.off = function(event, listener){
    var self = this.instance
    var idx;
    if ( self._events[event] instanceof Object) {
        idx = indexOf(self._events[event], listener);
        if (idx > -1) {
            self._events[event].splice(idx, 1);
        }
    }
};

EventEmitter.prototype.clear_all_events = function(){
  this.instance._events = {};
};

// EventEmitter.prototype.clear_all_events = function(){

// };

EventEmitter.prototype.emit = function(event){
    var self = this.instance;
    var i, listeners, length;
    var args = [].slice.call(arguments, 1);
    // debug('emit:', i, JSON.stringify(listeners), length, args);
    // debug('event:', event, this._name);
		try{
      if(event in self._events){
        listeners = self._events[event].slice();
        length = listeners.length;
        for (i = 0; i < length; i++) {
          // debug('listener:', JSON.stringify(listeners[i]));
          if( listeners[i] instanceof Object){
            try {
              listeners[i].apply(self, args);
            } catch(e) {
              lcl_debug('listener:', i, listeners[i], length, event);
            }
          }
        } 
      } else {
        lcl_debug('no event found:', event, self._name);
      }
    } catch(e) {
			e.message = 'emit error:' + e.message;
			LOCAL_DEBUG && util.report_error(e);
    }
};

EventEmitter.prototype.once = function(event, listener){
  var self = this.instance;
  self.on(event, function g () {
      self.off(event, g);
      listener.apply(self, arguments);
  });
};

exports.EventEmitter = EventEmitter;
