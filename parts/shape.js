// Shape Class...
//
function Shape() {
	this.mDepth = 0;
	
	this.mColour = "#FFFFFF";
	this.mAlpha = 1.0;
	
	this.mPos = new IVec2(0, 0);
	this.mOrigin = new IVec2(0, 0);
	
	this.mPoints = new Array();
};

// returns the type of this object for validity checking
Shape.prototype.Type = function() {
	return "Shape";
}

// make a copy of another (other) shape (copy constructor)
Shape.prototype.Copy = function(other) {
	this.mDepth = other.mDepth;
	
	this.mColour = other.mColour;
	this.mAlpha = other.mAlpha;
	
	this.mPos.Copy(other.mPos);
	this.mOrigin.Copy(other.mOrigin);
	
	this.mPoints = other.mPoints;
}

// 
Shape.prototype.Reset = function() {
	this.mPoints.splice(0, this.mPoints.length);
}

// 
Shape.prototype.AddPoint = function(point) {
	var pt = new IVec2();
	pt.Copy(point);
	this.mPoints.push(pt);
}

// 
Shape.prototype.GetPosition = function() {
	var pos = new IVec2();
	pos.Set(this.mPos.mX - this.mOrigin.mX, this.mPos.mY - this.mOrigin.mY);
	return pos;
}
// ...End

