/**
 * Match.js by Madison Williams.
 *
 * You can do whatever you want with this,
 * just please leave this comment at the top.
 * Thank you!
 *		-Madison
 */

MATCH = (function() {
	//helper functions
	var head = function(arr) { return arr[0];},
		tail = function(arr) { var arr2 = clone(arr); arr2.shift(); return arr2;},
		clone = function(arr){ return arr.slice(0);};
	//end helper functions
	var test_functions = {
		is_object : function(arg) {return (typeof(arg)==="object" && Object.isArray(arg)===false)},
		is_array  : function(arg) {return (Object.prototype.toString.call(arg)==='[object Array]')},
		is_empty_array  : function(arg) {return (Object.prototype.toString.call(arg)==='[object Array]' && !arg.length)},
		is_nonempty_array  : function(arg) {return (Object.prototype.toString.call(arg)==='[object Array]' && !!arg.length)},
		is_string : function(arg) {return (typeof(arg)==="string")},
		is_empty_string : function(arg) {return (typeof(arg)==="string" && !arg.length)},
		is_nonempty_string : function(arg) {return (typeof(arg)==="string" && !!arg.length)},
		is_number : function(arg) {return (typeof(arg)==="number")}
	}
	var checkers = {
		object : function(patt) {
			if (test_functions.is_array(patt)) {
				if (patt.length) return test_functions.is_nonempty_array;
				if (!patt.length) return test_functions.is_empty_array;
			} else {
				return test_functions.is_object;	
			}
		},
		string : test_functions.is_string,
		number : test_functions.is_number
	}
	
	function get_checker(pattern) {
		return checkers[typeof(pattern)](pattern);
	}
	
	function make_checker(patterns) {
		return patterns.map(get_checker);
	}
	function get_patterns(pattern_array) {
		pattern_array = clone(pattern_array);
		pattern_array.pop();
		return pattern_array;
	}
	function get_function_body(pattern_array) {
		return pattern_array[pattern_array.length-1];
	}
	function get_special_arguments(pattern,args) {
		var new_args=[],
			len=pattern.length,
			i=0;
		for (;i<len;i++) {
			if (test_functions.is_array(pattern[i]) && pattern[i][0]==="H|T") {
				new_args.push(head(args[i]));
				new_args.push(tail(args[i]));
			} else {
				new_args.push(args[i]);
			}
		}
		return new_args;
	}
	return {
		func : function(patterns) {
			var pattern_array = patterns.map(get_patterns);
			var pattern_checks = pattern_array.map(make_checker);
			var function_bodies = patterns.map(get_function_body);

			return function pattern_match_function() {
				var i = 0,
					x = 0,
					ilen = pattern_array.length,
					xlen = arguments.length,
					matches = false;

				for (;i<ilen;i++) {
					for (;x<xlen;x++) {
						matches = pattern_checks[i][x](arguments[x]);
					}
					if (matches) return function_bodies[i].apply(this,get_special_arguments(pattern_array[i],arguments));
					x=0;
				}
			}
		},
		head : head,
		tail : tail,
		clone : clone
	}
}())
