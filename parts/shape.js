// Shape Class...
//
function Shape() {
	this.mDepth = 0;
	
	this.mColour = "#FFFFFF";
	this.mAlpha = 1.0;
	
	this.mPos = new IVec2(0, 0);
	this.mSize = new IVec2(0, 0);
	this.mOutline = false;
	this.mOrigin = new IVec2(0, 0);
	
	this.mPoints = new Array();
	this.mBounds = new Array();
	this.mBounds[0] = 0;
	this.mBounds[1] = 0;
	this.mBounds[2] = 0;
	this.mBounds[3] = 0;
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
	this.mSize.Copy(other.mSize);
	this.mOutline = other.mOutline;
	this.mOrigin.Copy(other.mOrigin);
	
	this.mPoints = other.mPoints;
}

// 
Shape.prototype.Reset = function() {
	this.mPoints.splice(0, this.mPoints.length);
	this.mSize.Set(0, 0);
	for (var i = 0; i < this.mBounds.length; ++i) {
		this.mBounds[i] = 0;
	}
}

// 
Shape.prototype.AddPoint = function(point) {
	var pt = new IVec2();
	pt.Copy(point);
	this.mPoints.push(pt);
	
	// check left bound
	if (pt.mX < this.mBounds[0]) {
		this.mBounds[0] = pt.mX;
	}
	else if (pt.mX > this.mBounds[2]) { // right
		this.mBounds[2] = pt.mX;
	}
	
	// check top bound
	if (pt.mY < this.mBounds[1]) {
		this.mBounds[1] = pt.mY;
	}
	else if (pt.mY > this.mBounds[3]) { // bottom
		this.mBounds[3] = pt.mY;
	}
	
	this.mSize.Set(this.mBounds[2] - this.mBounds[0], this.mBounds[3] - this.mBounds[1]);
}

// 
Shape.prototype.GetPosition = function() {
	var pos = new IVec2();
	pos.Set(this.mPos.mX - this.mOrigin.mX, this.mPos.mY - this.mOrigin.mY);
	return pos;
}

//
Shape.prototype.GetWidth = function() {
	return this.mSize.mX;
}

//
Shape.prototype.GetHeight = function() {
	return this.mSize.mY;
}
// ...End

