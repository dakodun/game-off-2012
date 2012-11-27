// DepthSort function
// sorts renderable resources based on depth
function DepthSort(first, second) {
	return first.mDepth < second.mDepth;
};
// ...End

// RenderBatch Class...
// a render batch handles all drawing operations and draws according to depth (z) values
function RenderBatch() {
	this.mRenderData = new Array();
	
	this.mNeedSort = false;
}

// initialise the render batch
RenderBatch.prototype.SetUp = function() {
	
}

// clean up the render batch
RenderBatch.prototype.TearDown = function() {
	
}

// add a sprite to the render batch
RenderBatch.prototype.AddSprite = function(sprite) {
	this.mNeedSort = true;
	var spr = new Sprite();
	spr.Copy(sprite);
	
	if (spr.mTex != null) {
		this.mRenderData.push(spr);
	}
	// this.mRenderData.sort(DepthSort); // sort the queue
}

// add renderable text to the render batch
RenderBatch.prototype.AddText = function(text) {
	this.mNeedSort = true;
	var txt = new Text();
	txt.Copy(text);
	
	this.mRenderData.push(txt);
	// this.mRenderData.sort(DepthSort); // sort the queue
}

// add renderable shape to the render batch
RenderBatch.prototype.AddShape = function(shape) {
	this.mNeedSort = true;
	var shp = new Shape();
	shp.Copy(shape);
	
	this.mRenderData.push(shp);
	// this.mRenderData.sort(DepthSort); // sort the queue
}

// clear the render batch
RenderBatch.prototype.Clear = function() {
	this.mRenderData.splice(0, this.mRenderData.length);
}

// render the render batch to the context
RenderBatch.prototype.Render = function(camera) {
	var cam = new Camera();
	if (camera) {
		cam.Copy(camera);
	}
	
	if	(this.mNeedSort == true) {
		this.mRenderData.sort(DepthSort); // sort the queue
		this.mNeedSort = false;
	}
	
	for (var i = 0; i < this.mRenderData.length; ++i) {
		nmain.game.mCurrContext.save();
		
		if (this.mRenderData[i].Type() == "Sprite") {
			var spr = this.mRenderData[i];
			var w = spr.mTex.mImg.width;
			var h = spr.mTex.mImg.height;
			
			if (spr.mIsAnimated == true) {
				w = spr.mClipSize.mX;
				h = spr.mClipSize.mY;
			}
			
			var scrTL = new IVec2(0 + cam.mTranslate.mX, 0 + cam.mTranslate.mY);
			var scrBR = new IVec2(nmain.game.mCanvasSize.mX + cam.mTranslate.mX,
					nmain.game.mCanvasSize.mY + cam.mTranslate.mY);
			
			
			if ((spr.mPos.mX < scrBR.mX && (spr.mPos.mX + w) > scrTL.mX) &&
					(spr.mPos.mY < scrBR.mY && (spr.mPos.mY + h) > scrTL.mY)) {
				
				
				nmain.game.mCurrContext.translate(spr.GetPosition().mX, spr.GetPosition().mY);
				nmain.game.mCurrContext.rotate(spr.mRotation * (Math.PI / 180));
				
				nmain.game.mCurrContext.drawImage(spr.mTex.mImg, spr.mClipPos.mX, spr.mClipPos.mY,
						spr.mClipSize.mX, spr.mClipSize.mY, 0, 0,
						w * spr.mScale.mX, h * spr.mScale.mY);
			}
		}
		else if (this.mRenderData[i].Type() == "Text") {
			var txt = this.mRenderData[i];
			var txtArr = txt.mString.split("\n");
			
			nmain.game.mCurrContext.font = txt.mFont;
			nmain.game.mCurrContext.strokeStyle = txt.mColour;
			
			var w = txt.GetWidth();
			var h = txt.GetHeight();
			
			var scrTL = new IVec2(0 + cam.mTranslate.mX, 0 + cam.mTranslate.mY);
			var scrBR = new IVec2(nmain.game.mCanvasSize.mX + cam.mTranslate.mX,
					nmain.game.mCanvasSize.mY + cam.mTranslate.mY);
			
			
			if ((txt.mPos.mX < scrBR.mX && (txt.mPos.mX + w) > scrTL.mX) &&
					(txt.mPos.mY < scrBR.mY && (txt.mPos.mY + h) > scrTL.mY)) {
				
				nmain.game.mCurrContext.translate(txt.mPos.mX, txt.mPos.mY);
				nmain.game.mCurrContext.rotate(txt.mRotation * (Math.PI / 180));
				
				if (txt.mOutline == true) {
					for (var j = 0; j < txtArr.length; ++j) {
						nmain.game.mCurrContext.strokeText(txtArr[j], 0, txt.mHeight * j);
					}
				}
				else {
					for (var j = 0; j < txtArr.length; ++j) {
						if (txt.mShadow == true) {
							nmain.game.mCurrContext.fillStyle = txt.mShadowColour;
							nmain.game.mCurrContext.fillText(txtArr[j], 2, (txt.mHeight * j) + 2);
						}
						
						nmain.game.mCurrContext.fillStyle = txt.mColour;
						nmain.game.mCurrContext.fillText(txtArr[j], 0, txt.mHeight * j);
					}
				}
			}
		}
		else if (this.mRenderData[i].Type() == "Shape") {
			var shp = this.mRenderData[i];
			var pos = shp.GetPosition();
			
			nmain.game.mCurrContext.fillStyle = shp.mColour;
			nmain.game.mCurrContext.strokeStyle = shp.mColour;
			var oldAlpha = nmain.game.mCurrContext.globalAlpha;
			nmain.game.mCurrContext.globalAlpha = shp.mAlpha;
			
			nmain.game.mCurrContext.beginPath();
			nmain.game.mCurrContext.moveTo(pos.mX, pos.mY);
			
			for (var j = 0; j < shp.mPoints.length; ++j) {
				var pt = new IVec2();
				pt.Copy(shp.mPoints[j]);
				nmain.game.mCurrContext.lineTo(pos.mX + pt.mX, pos.mY + pt.mY);
			}
			
			nmain.game.mCurrContext.closePath();
			
			if (shp.mOutline == false) {
				nmain.game.mCurrContext.fill();
			}
			else {
				nmain.game.mCurrContext.stroke();
			}
			
			nmain.game.mCurrContext.globalAlpha = oldAlpha;
		}
		
		nmain.game.mCurrContext.restore();
	}
}

// ...End

