var thresholdCounter = (function () {
    
	var instance;
	var thresholds;
	var counters;
 
    function createInstance() {
    	thresholds = new Map();
    	counters = new Map();
    	instance = new Object();
        instance.getCounter = getCounter;
        instance.incCounter = incCounter;
      	instance.getThreshold = getThreshold;
        instance.setThreshold = setThreshold;
        return instance;
    }
    
    function getCounter(obj) {
    	var counter = counters.get(obj);
    	if (typeof counter === 'undefined') {
    		counters.set(obj, 0);
    	}
    	return counters.get(obj);
    }
    
    function incCounter(obj) {
    	var count = getCounter(obj);
    	counters.set(obj, ++count);
    }
    
    function getThreshold(obj) {
    	var threshold = thresholds.get(obj);
        if (typeof threshold === 'undefined') {
        	thresholds.set(obj, Number.MAX_SAFE_INTEGER);
        }
        return thresholds.get(obj);
    }
    
    function setThreshold(obj, threshold) {
    	thresholds.set(obj, threshold);
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


var copier = (function () {
	
	function innerCopy(obj) {
		if (null == obj || "object" != typeof obj) return obj;
	    var copy = obj.constructor();
	    for (var attr in obj) {
	        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	    }
	    copy.getThreshold = function() {
	    	return thresholdCounter.getInstance().getThreshold(obj);
	    }
	    copy.getNumOfCopies = function () {
	    	return thresholdCounter.getInstance().getCounter(obj);
	    }
	    return copy;
	}

	
    return {
        copy: function (obj) {
        	var threshold = thresholdCounter.getInstance().getThreshold(obj);
        	if (typeof threshold === 'undefined') {
        		return null;
        	}
        	var counter = thresholdCounter.getInstance().getCounter(obj);
        	if (counter === threshold) {
        		throw "threshold exceeded";
        	} else {
        		thresholdCounter.getInstance().incCounter(obj);
        		return innerCopy(obj);
        	}
        }
    };
})();

var obj1 = {type:"Fiat", model:"500", color:"white"};
thresholdCounter.getInstance().setThreshold(obj1, 2);
var obj2 = copier.copy(obj1);
console.log(obj2.getThreshold());
console.log(obj2.getNumOfCopies());
var obj3 = copier.copy(obj1);
console.log(obj2.getNumOfCopies());
var obj4 = copier.copy(obj1);
console.log(obj2.getNumOfCopies());
console.log(obj4 === null);
var someOtherObj1 = copier.copy(obj2);
console.log(someOtherObj1 === null);

