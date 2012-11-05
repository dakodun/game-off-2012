// Exception Class...
// a custom exception
function Exception(what) {
	this.mWhat = what; // information about this exception
};

// returns information about this exception
Exception.prototype.What = function() {
	return this.mWhat;
};
// ...End

