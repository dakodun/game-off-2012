// DepthSort function
// sorts renderable resources based on depth
function DepthSort(first, second) {
	return second.mDepth < first.mDepth;
};
// ...End

// RenderBatch Class...
// a render batch handles all drawing operations and draws according to depth (z) values
function RenderBatch() {
	this.mRenderData = new Array();
}

// 
RenderBatch.prototype.SetUp = function() {
	
}

// 
RenderBatch.prototype.TearDown = function() {
	
}

// 
RenderBatch.prototype.AddSprite = function(sprite) {
	var spr = new Sprite();
	spr.Copy(sprite);
	
	this.mRenderData.push(spr);
	this.mRenderData.sort(DepthSort); // sort the queue
}

// 
RenderBatch.prototype.Clear = function() {
	this.mRenderData.splice(0, this.mRenderData.length);
}

// 
RenderBatch.prototype.Render = function() {
	for (var i = 0; i < this.mRenderData.length; ++i) {
		if (this.mRenderData[i].Type() == "Sprite") {
			var spr = this.mRenderData[i];
			nmain.game.mCurrContext.drawImage(spr.mTex.mImg, spr.mClipPos.mX, spr.mClipPos.mY,
					spr.mClipSize.mX, spr.mClipSize.mY, spr.mPos.mX, spr.mPos.mY,
					spr.mTex.mImg.width * spr.mScale.mX, spr.mTex.mImg.height * spr.mScale.mY);
		}
		else if (this.mRenderData[i].Type() == "Text") {
			// Render Text
		}
	}
}

// ...End

