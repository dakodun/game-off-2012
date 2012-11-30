// GFDebug Class...
// 
function GFDebug() {
	this.mPos = new IVec2(0, 0);
	this.mActive = false;
	
	this.mBatch = new RenderBatch();
	this.mSpriteArr = new Array();
	this.mStatusArr = new Array();
	
	this.mSpriteArr[0] = new Sprite();
	this.mStatusArr[0] = false;
	
	this.mSpriteArr[1] = new Sprite();
	this.mStatusArr[1] = true;
	
	this.mSpriteArr[2] = new Sprite();
	this.mStatusArr[2] = false;
	
	this.mSpriteArr[3] = new Sprite();
	this.mStatusArr[3] = false;
	
	this.mSpriteArr[4] = new Sprite();
	this.mStatusArr[4] = false;
}

GFDebug.prototype.SetUp = function(pos) {
	this.mPos.Copy(pos);
	var tex = nmgrs.resMan.mTexStore.GetResource("gui_debug");
	var frames = 10;
	
	{
		this.mSpriteArr[0].SetAnimatedTexture(tex, frames, frames / 2, -1, -1);
		this.mSpriteArr[0].mOrigin.Set(0, 0);
		this.mSpriteArr[0].mPos.Set(this.mPos.mX + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, 64 + this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[0].mDepth = -3000;
		this.mSpriteArr[0].SetCurrentFrame(0 + (frames / 2));
	}
	
	{
		this.mSpriteArr[1].SetAnimatedTexture(tex, frames, frames / 2, -1, -1);
		this.mSpriteArr[1].mOrigin.Set(0, 0);
		this.mSpriteArr[1].mPos.Set(this.mPos.mX + 72 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, 64 + this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[1].mDepth = -3000;
		this.mSpriteArr[1].SetCurrentFrame(1);
	}
	
	{
		this.mSpriteArr[2].SetAnimatedTexture(tex, frames, frames / 2, -1, -1);
		this.mSpriteArr[2].mOrigin.Set(0, 0);
		this.mSpriteArr[2].mPos.Set(this.mPos.mX + 144 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, 64 + this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[2].mDepth = -3000;
		this.mSpriteArr[2].SetCurrentFrame(2 + (frames / 2));
	}
	
	{
		this.mSpriteArr[3].SetAnimatedTexture(tex, frames, frames / 2, -1, -1);
		this.mSpriteArr[3].mOrigin.Set(0, 0);
		this.mSpriteArr[3].mPos.Set(this.mPos.mX + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[3].mDepth = -3000;
		this.mSpriteArr[3].SetCurrentFrame(3 + (frames / 2));
	}
	
	{
		this.mSpriteArr[4].SetAnimatedTexture(tex, frames, frames / 2, -1, -1);
		this.mSpriteArr[4].mOrigin.Set(0, 0);
		this.mSpriteArr[4].mPos.Set(this.mPos.mX + 72 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[4].mDepth = -3000;
		this.mSpriteArr[4].SetCurrentFrame(4 + (frames / 2));
	}
}

GFDebug.prototype.Input = function() {
	// on left click
	
	{
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		pt.mX += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX; pt.mY += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY;
		
		// top left of the buttons boundbox
		var tl = new IVec2(this.mSpriteArr[0].mPos.mX, this.mSpriteArr[0].mPos.mY);
		
		// bottom right of the buttons boundbox
		var br = new IVec2(this.mSpriteArr[0].mPos.mX + this.mSpriteArr[0].GetWidth(),
				this.mSpriteArr[0].mPos.mY + this.mSpriteArr[0].GetHeight());
		
		if (util.PointInRectangle(pt, tl, br) == true) {
			this.ToggleDebug();
		}
	}
	
	if (this.mActive == true) {
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		pt.mX += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX; pt.mY += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY;
		
		for (var i = 1; i < this.mSpriteArr.length; ++i) {
			// top left of the buttons boundbox
			var tl = new IVec2(this.mSpriteArr[i].mPos.mX, this.mSpriteArr[i].mPos.mY);
			
			// bottom right of the buttons boundbox
			var br = new IVec2(this.mSpriteArr[i].mPos.mX + this.mSpriteArr[i].GetWidth(),
					this.mSpriteArr[i].mPos.mY + this.mSpriteArr[i].GetHeight());
			
			if (util.PointInRectangle(pt, tl, br) == true) {
				this.mStatusArr[i] = !this.mStatusArr[i];
				if (this.mStatusArr[i] == true) {
					this.mSpriteArr[i].SetCurrentFrame(i);
				}
				else {
					this.mSpriteArr[i].SetCurrentFrame(i + (this.mSpriteArr[i].mNumFrames / 2));
				}
				
				if (i == 1) {
					nmgrs.sceneMan.mCurrScene.mMap.mShowFog = this.mStatusArr[i];
				}
				else if (i == 2) {
					for (var j = 0; j < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++j) {
						nmgrs.sceneMan.mCurrScene.mGameEntities[j].mShowBound = this.mStatusArr[i];
					}
				}
				else if (i == 3) {
					for (var j = 0; j < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++j) {
						if (nmgrs.sceneMan.mCurrScene.mGameEntities[j].mPlayerUnit == true) {
							nmgrs.sceneMan.mCurrScene.mGameEntities[j].mSuperMode = this.mStatusArr[i];
						}
					}
				}
				else if (i == 4) {
					nmgrs.sceneMan.mCurrScene.mGameUI.mShowDebug = this.mStatusArr[i];
				}
			}
		}
	}
}

GFDebug.prototype.Process = function() {
	this.mSpriteArr[0].mPos.Set(this.mPos.mX + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + 64 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
	
	if (this.mActive == true) {
		this.mSpriteArr[1].mPos.Set(this.mPos.mX + 72 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + 64 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[2].mPos.Set(this.mPos.mX + 144 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + 64 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[3].mPos.Set(this.mPos.mX + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[4].mPos.Set(this.mPos.mX + 72 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
	}
}

GFDebug.prototype.Render = function() {
	this.mBatch.Clear();
	
	this.mBatch.AddSprite(this.mSpriteArr[0]);
	
	if (this.mActive == true) {
		for (var i = 1; i < this.mSpriteArr.length; ++i) {
			this.mBatch.AddSprite(this.mSpriteArr[i]);
		}
	}
	
	this.mBatch.Render(nmgrs.sceneMan.mCurrScene.mCam);
}

GFDebug.prototype.ToggleDebug = function() {
	this.mStatusArr[0] = !this.mStatusArr[0];
	if (this.mStatusArr[0] == true) {
		this.mSpriteArr[0].SetCurrentFrame(0);
	}
	else {
		this.mSpriteArr[0].SetCurrentFrame(0 + (this.mSpriteArr[0].mNumFrames / 2));
	}
	
	nmgrs.sceneMan.mCurrScene.mDebug.mActive = !nmgrs.sceneMan.mCurrScene.mDebug.mActive;
}
// ...End

