// GFUnitArtillery Class...
// 
function GFUnitArtillery() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mSelected = false;
	this.mActive = true;
	
	this.mUI = new GFUnitUI();
	this.mPlacementInfo = "";
	
	this.mMovesLeft = 1;
	this.mMovesLeftSprite = new Sprite();
	
	this.mKillSwitch = 0;
	this.mKillConfirmA = new Text();
	this.mKillConfirmB = new Text();
	
	this.mFireZone = new Sprite();
}

GFUnitArtillery.prototype.Type = function() {
	return "GFUnitArtillery";
};

GFUnitArtillery.prototype.SetUp = function(camera, pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_arty");
		this.mSprite.SetAnimatedTexture(tex, 4, 4, 14 / nmain.game.mFrameLimit, -1);
		this.mSprite.mOrigin.Set(0, 0);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_moves");
		this.mMovesLeftSprite.SetAnimatedTexture(tex, 3, 1, -1, -1);
		this.mMovesLeftSprite.mOrigin.Set(20, 34);
		this.mMovesLeftSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mMovesLeftSprite.SetCurrentFrame(0);
		this.mMovesLeftSprite.mDepth = -2000;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("arty_firezone");
		this.mFireZone.SetTexture(tex);
		this.mFireZone.mOrigin.Set(128, 128);
		this.mFireZone.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mFireZone.mDepth = -2500;
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(32, 0));
	this.mBound.AddPoint(new IVec2(32, 32));
	this.mBound.AddPoint(new IVec2(0, 32));
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arty");
		this.mUI.mSlotSprites[0].SetAnimatedTexture(tex, 2, 2, -1, -1);
		this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 192, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[0].mDepth = -9999;
		this.mUI.mSlotStatus[0] = true;
		
		var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
		this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
		
		this.mUI.mSlotSprites[1].SetAnimatedTexture(tex, 2, 2, -1, -1);
		this.mUI.mSlotSprites[1].SetCurrentFrame(1);
		this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 120, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[1].mDepth = -9999;
		this.mUI.mSlotStatus[1] = true;
		
		wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
		this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	}
	
	{
		this.mKillConfirmA.SetFontName("sans-serif");
		this.mKillConfirmA.SetFontSize(12);
		this.mKillConfirmA.mString = "Click Button Again To";
		this.mKillConfirmA.mDepth = -9999;
		this.mKillConfirmA.mShadow = true;
		this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
		
		this.mKillConfirmB.SetFontName("sans-serif");
		this.mKillConfirmB.SetFontSize(32);
		this.mKillConfirmB.mString = "CONFIRM KILL UNIT";
		this.mKillConfirmB.mDepth = -9999;
		this.mKillConfirmB.mShadow = true;
		this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + this.mKillConfirmB.GetHeight() + 12);
	}
}

// 
GFUnitArtillery.prototype.Process = function() {
	this.mSprite.Process();
	
	if (this.mKillSwitch > 0) {
		this.mKillSwitch--;
	}
}

//
GFUnitArtillery.prototype.UpdateUI = function(camera) {
	this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 192, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
	this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
	
	this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 120, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
	this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	
	this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
	this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + this.mKillConfirmB.GetHeight() + 12);
}

//
GFUnitArtillery.prototype.ProcessUI = function(camera) {
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
						if (this.mKillSwitch > 0) {
							this.SetActive(false);
							this.mSelected = false;
							
							nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mFree = true;
							nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID = -1;
							nmgrs.sceneMan.mCurrScene.mGameEntities.splice(nmgrs.sceneMan.mCurrScene.mSelectID, 1);
							nmgrs.sceneMan.mCurrScene.mSelectID = -1;
							this.AdjustFog(-1);
						}
						else {
							this.mKillSwitch = 100;
							nmgrs.sceneMan.mCurrScene.mEndPlayerTurn = 0;
						}
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

//
GFUnitArtillery.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_arty");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 1;
			this.mMovesLeftSprite.SetCurrentFrame(1);
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

//
GFUnitArtillery.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	if (this.mSelected == true) {
		arr = arr.concat(this.mUI.GetRender());
		if (this.mUI.mShow == true) {
			arr.push(this.mMovesLeftSprite);
		}
		
		if (this.mKillSwitch > 0) {
			arr = arr.concat(this.mKillConfirmA);
			arr = arr.concat(this.mKillConfirmB);
		}
		
		arr.push(this.mFireZone);
	}
	
	return arr;
}

//
GFUnitArtillery.prototype.PlacementCallback = function(info, id) {
	
}

//
GFUnitArtillery.prototype.SoftReset = function() {
	this.mKillSwitch = 0;
}

//
GFUnitArtillery.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -2; y <= 2; ++y) {
		for (var x = -2; x <= 2; ++x) {
			if ((id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x >= 0 &&
					(id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) {
				
				if (Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y >= 0 &&
						Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					arr.push((id + x) + (y * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
				}
			}
		}
	}
	
	for (var i = 0; i < arr.length; ++i) {
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mFog += mode;
	}
}

// ...End

