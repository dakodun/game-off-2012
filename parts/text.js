// Text Class...
// renderable text
function Text() {
	this.mFont = "12px Arial";
	this.mString = "";
	this.mColour = "#FFFFFF";
	this.mDepth = 0;
	
	this.mPos = new IVec2(0, 12);
	this.mOutline = false;
	this.mRotation = 0;
	this.mHeight = 12;
}

// returns the type of this object for validity checking
Text.prototype.Type = function() {
	return "Text";
}

// make a copy of another (other) text (copy constructor)
Text.prototype.Copy = function(other) {
	this.mFont = other.mFont;
	this.mString = other.mString;
	this.mColour = other.mColour;
	this.mDepth = other.mDepth;
	
	this.mPos.Copy(other.mPos);
	this.mOutline = other.mOutline;
	this.mRotation = other.mRotation;
	this.mHeight = other.mHeight;
}

// return the width of the text
Text.prototype.GetWidth = function() {
	nmain.game.mCurrContext.font = this.mFont;
	return nmain.game.mCurrContext.measureText(this.mString).width;
}

// return the height of the text
Text.prototype.GetHeight = function() {
	return this.mHeight;
}
// ...End

