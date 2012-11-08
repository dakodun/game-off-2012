// Sprite Class...
// 
function Sprite() {
	this.mTex = null;
	this.mDepth = 0;
	
	this.mPos = new IVec2(0, 0);
	this.mClipPos = new IVec2(0, 0);
	this.mClipSize = new IVec2(0, 0);
	this.mScale = new FVec2(1.0, 1.0);
}

// returns the type of this object for validity checking
Sprite.prototype.Type = function() {
	return "Sprite";
};

// 
Sprite.prototype.SetUp = function() {
	
}

// 
Sprite.prototype.TearDown = function() {
	
}

//
Sprite.prototype.Copy = function(other) {
	this.mTex = other.mTex ;
	this.mDepth = other.mDepth;
	
	this.mPos.Copy(other.mPos);
	this.mClipPos.Copy(other.mClipPos);
	this.mClipSize.Copy(other.mClipSize);
	this.mScale.Copy(other.mScale);
}

// 
Sprite.prototype.SetTexture = function(texture) {
	this.mTex = texture;
	
	this.mClipPos.mX = 0;
	this.mClipPos.mY = 0;
	
	this.mClipSize.mX = this.mTex.mImg.width;
	this.mClipSize.mY = this.mTex.mImg.height;
	
	this.mScale.mX = 1.0;
	this.mScale.mY = 1.0;
}
// ...End

