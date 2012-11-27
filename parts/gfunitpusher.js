// GFUnitPusher Class...
// 
function GFUnitPusher() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = true;
	
	this.mSelected = false;
	this.mActive = true;
	
	this.mUI = new GFUnitUI();
	this.mPlacementInfo = "";
}

GFUnitPusher.prototype.SetUp = function(camera, tex, pos) {
	this.mPos.Copy(pos);
	
	this.mSprite.SetAnimatedTexture(tex, 4, 4, 14 / nmain.game.mFrameLimit, -1);
	this.mSprite.mOrigin.Set(0, 0);
	this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
	this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(32, 0));
	this.mBound.AddPoint(new IVec2(32, 32));
	this.mBound.AddPoint(new IVec2(0, 32));
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_pusher");
		this.mUI.mSlotSprites[0].SetAnimatedTexture(tex, 3, 3, -1, -1);
		this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 264, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[0].mDepth = -1000;
		this.mUI.mSlotStatus[0] = true;
		
		var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
		this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
		
		this.mUI.mSlotSprites[1].SetAnimatedTexture(tex, 3, 3, -1, -1);
		this.mUI.mSlotSprites[1].SetCurrentFrame(1);
		this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 192, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[1].mDepth = -1000;
		this.mUI.mSlotStatus[1] = true;
		
		wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
		this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
		
		this.mUI.mSlotSprites[2].SetAnimatedTexture(tex, 3, 3, -1, -1);
		this.mUI.mSlotSprites[2].SetCurrentFrame(2);
		this.mUI.mSlotSprites[2].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 120, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[2].mDepth = -1000;
		this.mUI.mSlotStatus[2] = true;
		
		wOffset = (this.mUI.mSlotSprites[2].GetWidth() / 2) - (this.mUI.mSlotText[2].GetWidth() / 2);
		this.mUI.mSlotText[2].mPos.Set(this.mUI.mSlotSprites[2].mPos.mX + wOffset, this.mUI.mSlotSprites[2].mPos.mY);
	}
}

GFUnitPusher.prototype.Process = function() {
	this.mSprite.Process();
}

GFUnitPusher.prototype.UpdateUI = function(camera) {
	this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 264, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
	this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
	
	this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 192, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
	this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	
	this.mUI.mSlotSprites[2].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 120, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[2].GetWidth() / 2) - (this.mUI.mSlotText[2].GetWidth() / 2);
	this.mUI.mSlotText[2].mPos.Set(this.mUI.mSlotSprites[2].mPos.mX + wOffset, this.mUI.mSlotSprites[2].mPos.mY);
}

GFUnitPusher.prototype.ProcessUI = function(camera) {
	if (this.mSelected == true) {
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		pt.mX += camera.mTranslate.mX; pt.mY += camera.mTranslate.mY;
		
		for (var i = 0; i < 4; ++i) {
			if (this.mUI.mSlotStatus[i] == true) {
				// top left of the buttons boundbox
				var tl = new IVec2(0, 0);
				tl.Set(this.mUI.mSlotSprites[i].mPos.mX, this.mUI.mSlotSprites[i].mPos.mY);
				
				// bottom right of the buttons boundbox
				var w = this.mUI.mSlotSprites[i].mTex.mImg.width;
				var h = this.mUI.mSlotSprites[i].mTex.mImg.height;
				
				if (this.mUI.mSlotSprites[i].mIsAnimated == true) {
					w = this.mUI.mSlotSprites[i].mClipSize.mX;
					h = this.mUI.mSlotSprites[i].mClipSize.mY;
				}
				
				var br = new IVec2(0, 0);
				br.Set(this.mUI.mSlotSprites[i].mPos.mX + w, this.mUI.mSlotSprites[i].mPos.mY + h);
				
				if (util.PointInRectangle(pt, tl, br) == true) {
					if (i == 0) {
						// button 1
					}
					else if (i == 1) {
						// button 2
					}
					else if (i == 2) {
						// button 3
					}
					else if (i == 3) {
						// button 4
					}
					
					return true;
				}
			}
		}
	}
	
	return false;
}

GFUnitPusher.prototype.SetActive = function(active) {
	if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_pusher");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	}
}

GFUnitPusher.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	if (this.mSelected == true) {
		arr = arr.concat(this.mUI.GetRender());
	}
	
	return arr;
}

GFUnitPusher.prototype.PlacementCallback = function(info, id) {
	
}
// ...End

