// FVec2 Class...
// a 2d vector of floats
function FVec2(x, y) {
	this.mX = x; // x value of our 2d vector
	this.mY = y; // y value of our 2d vector
};

// returns the type of this object for validity checking
FVec2.prototype.Type = function() {
	return "FVec2";
};

// returns formatted output for this vector
FVec2.prototype.Output = function() {
	return "(" + this.mX + ", " + this.mY + ")";
};

// make a copy of another (other) fvec2 (copy constructor)
FVec2.prototype.Copy = function(other) {
	// copy x and y
	this.mX = other.mX;
	this.mY = other.mY;
};

// set the x and y components of the vector
FVec2.prototype.Set = function(x, y) {
	this.mX = x; // x value of our 2d vector
	this.mY = y; // y value of our 2d vector
};
// ...End

