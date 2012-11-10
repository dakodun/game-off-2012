// Text Class...
// 
function Text() {
	this.mFont = "12px Arial";
	this.mString = "";
	this.mColour = "#FFFFFF";
	this.mDepth = 0;
	
	this.mPos = new IVec2(0, 12);
	this.mOutline = false;
}


// returns the type of this object for validity checking
Text.prototype.Type = function() {
	return "Text";
}

//
Text.prototype.Copy = function(other) {
	this.mFont = other.mFont;
	this.mString = other.mString;
	this.mColour = other.mColour;
	this.mDepth = other.mDepth;
	
	this.mPos.Copy(other.mPos);
	this.mOutline = other.mOutline;
}

Text.prototype.GetWidth = function() {
	nmain.game.mCurrContext.font = this.mFont;
	return nmain.game.mCurrContext.measureText(this.mString).width;
}
// ...End

