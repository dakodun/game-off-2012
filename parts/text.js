// Text Class...
// renderable text
function Text() {
	this.mFont = "12px Arial";
	this.mFontSize = "12";
	this.mFontName = "Arial";
	
	this.mString = "";
	this.mColour = "#FFFFFF";
	this.mShadowColour = "#000000";
	this.mDepth = 0;
	
	this.mPos = new IVec2(0, 12);
	this.mOutline = false;
	this.mShadow = false;
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
	this.mFontSize = other.mFontSize;
	this.mFontName = other.mFontName;
	
	this.mString = other.mString;
	this.mColour = other.mColour;
	this.mShadowColour = other.mShadowColour;
	this.mDepth = other.mDepth;
	
	this.mPos.Copy(other.mPos);
	this.mOutline = other.mOutline;
	this.mShadow = other.mShadow;
	this.mRotation = other.mRotation;
	this.mHeight = other.mHeight;
}

// return the width of the text
Text.prototype.GetWidth = function() {
	nmain.game.mCurrContext.font = this.mFont;
	
	var txtArr = this.mString.split("\n");
	var longest = 0;
	for (var i = 0; i < txtArr.length; ++i) {
		var strLen = nmain.game.mCurrContext.measureText(txtArr[i]).width;
		if (strLen > longest) {
			longest = strLen;
		}
	}
	
	return strLen;
}

// return the height of the text
Text.prototype.GetHeight = function() {
	var txtArr = this.mString.split("\n");
	return this.mHeight * txtArr.length;
}

// 
Text.prototype.SetFontSize = function(size) {
	this.mFontSize = size.toString();
	this.mFont = this.mFontSize + "px " + this.mFontName;
	this.mHeight = size;
}

// 
Text.prototype.SetFontName = function(name) {
	this.mFontName = name;
	this.mFont = this.mFontSize + " " + this.mFontName;
}
// ...End

