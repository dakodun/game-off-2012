// Sprite Class...
// 
function Sprite() {
	this.mTex = null;
	this.mDepth = 0;
	
	this.mPos = new IVec2(0, 0);
	this.mClipPos = new IVec2(0, 0);
	this.mClipSize = new IVec2(0, 0);
	this.mScale = new FVec2(1.0, 1.0);
	
	this.mNumFrames = 0;
	this.mFramesPerLine = 0;
	this.mCurrFrame = 0;
	this.mStartFrame = 0;
	this.mEndFrame = 0;
	this.mAnimSpeed = 0;
	this.mAnimTimer = 0;
	this.mIsAnimated = false;
};

// returns the type of this object for validity checking
Sprite.prototype.Type = function() {
	return "Sprite";
}

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
	
	this.mNumFrames = other.mNumFrames;
	this.mFramesPerLine = other.mFramesPerLine;
	this.mCurrFrame = other.mCurrFrame;
	this.mStartFrame = other.mStartFrame;
	this.mEndFrame = other.mEndFrame;
	this.mAnimSpeed = other.mAnimSpeed;
	this.mAnimTimer = other.mAnimTimer;
	this.mIsAnimated = other.mIsAnimated;
}

//
Sprite.prototype.Process = function() {
	if (this.mIsAnimated) {
		this.mAnimTimer++;
		if (this.mAnimTimer > this.mAnimSpeed) {
			this.mAnimTimer = 0;
			this.mCurrFrame = (this.mCurrFrame + 1) % this.mEndFrame;
			if (this.mCurrFrame < this.mStartFrame) {
				this.mCurrFrame = this.mStartFrame;
			}
			
			var rectX = (this.mCurrFrame % this.mFramesPerLine) * this.mClipSize.mX;
			var rectY = (Math.floor(this.mCurrFrame / this.mFramesPerLine)) * this.mClipSize.mY;
			var rectW = this.mClipSize.mX;
			var rectH = this.mClipSize.mY;
			
			this.SetClipRect(new IVec2(rectX, rectY), new IVec2(rectW, rectH));
		}
	}
}

// 
Sprite.prototype.SetTexture = function(texture) {
	this.mTex = texture;
	
	this.SetClipRect(new IVec2(0, 0), new IVec2(this.mTex.mImg.width, this.mTex.mImg.height));
	
	this.mNumFrames = 1;
	this.mFramesPerLine = 0;
	this.mCurrFrame = 0;
	this.mStartFrame = 0;
	this.mEndFrame = 1;
	this.mAnimSpeed = 0;
	this.mAnimTimer = 0;
	this.mIsAnimated = false;
	
	this.mScale.mX = 1.0;
	this.mScale.mY = 1.0;
}

// 
Sprite.prototype.SetAnimatedTexture = function(texture, numFrames, framesPerLine, animSpeed) {
	this.mTex = texture;
	
	this.SetClipRect(new IVec2(0, 0), new IVec2(this.mTex.mImg.width / framesPerLine,
			this.mTex.mImg.height / (Math.ceil(numFrames / framesPerLine))));
	
	this.mNumFrames = numFrames;
	this.mFramesPerLine = framesPerLine;
	this.mCurrFrame = 0;
	this.mStartFrame = 0;
	this.mEndFrame = numFrames;
	this.mAnimSpeed = animSpeed;
	this.mAnimTimer = 0;
	this.mIsAnimated = true;
	
	this.mScale.mX = 1.0;
	this.mScale.mY = 1.0;
}

// 
Sprite.prototype.SetAnimatedTextureSegment = function(texture, numFrames, framesPerLine, animSpeed, startFrame, endFrame) {
	this.mTex = texture;
	
	this.SetClipRect(new IVec2(0, 0), new IVec2(this.mTex.mImg.width / framesPerLine,
			this.mTex.mImg.height / (Math.ceil(numFrames / framesPerLine))));
	
	this.mNumFrames = numFrames;
	this.mFramesPerLine = framesPerLine;
	this.mCurrFrame = 0;
	this.mStartFrame = startFrame;
	this.mEndFrame = endFrame;
	this.mAnimSpeed = animSpeed;
	this.mAnimTimer = 0;
	this.mIsAnimated = true;
	
	this.mScale.mX = 1.0;
	this.mScale.mY = 1.0;
}

//
Sprite.prototype.SetClipRect = function(pos, size) {
	this.mClipPos.mX = pos.mX;
	this.mClipPos.mY = pos.mY;
	
	this.mClipSize.mX = size.mX;
	this.mClipSize.mY = size.mY;
}
// ...End

