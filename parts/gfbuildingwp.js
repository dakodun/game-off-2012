// GFBuildingWP Class...
// 
function GFBuildingWP() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = true;
	
	this.mSelected = false;
	this.mActive = true;
	
	this.mUI = new GFUnitUI();
	this.mPlacementInfo = "";
	
	this.mMovesLeft = 1;
	this.mMovesLeftSprite = new Sprite();
}

GFBuildingWP.prototype.SetUp = function(camera, pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_workerprod");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(16, 20);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_moves");
		this.mMovesLeftSprite.SetAnimatedTexture(tex, 3, 1, -1, -1);
		this.mMovesLeftSprite.mOrigin.Set(20, 34);
		this.mMovesLeftSprite.mPos.Set((pos.mX * 32) + 16, pos.mY * 32);
		this.mMovesLeftSprite.SetCurrentFrame(1);
		this.mMovesLeftSprite.mDepth = -2000;
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(64, 0));
	this.mBound.AddPoint(new IVec2(64, 64));
	this.mBound.AddPoint(new IVec2(0, 64));
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_workerprod");
		this.mUI.mSlotSprites[0].SetAnimatedTexture(tex, 2, 2, -1, -1);
		this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 192, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[0].mDepth = -1000;
		this.mUI.mSlotStatus[0] = true;
		this.mUI.mSlotText[0].mString = "0 / 2";
		this.mUI.mSlotText[0].mShadow = true;
		
		var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
		this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
		
		this.mUI.mSlotSprites[1].SetAnimatedTexture(tex, 2, 2, -1, -1);
		this.mUI.mSlotSprites[1].SetCurrentFrame(1);
		this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 120, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[1].mDepth = -1000;
		this.mUI.mSlotStatus[1] = true;
		this.mUI.mSlotText[1].mString = "0 / 2";
		this.mUI.mSlotText[1].mShadow = true;
		
		wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
		this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	}
}

GFBuildingWP.prototype.Process = function() {
	this.mSprite.Process();
}

GFBuildingWP.prototype.UpdateUI = function(camera) {
	this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 192, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
	this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
	
	this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 120, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
	this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
}

GFBuildingWP.prototype.ProcessUI = function(camera) {
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
						if (nmgrs.sceneMan.mCurrScene.mPusherCount < 2) {
							var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
							var boundsArr = new Array();
							var hiliteArr = new Array();
							
							for (var j = 0; j < nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles.length; ++j) {
								var pos = nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j];
								var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
									var tl = new IVec2();
									tl.Set(nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32, nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32);
									boundsArr.push(tl);
									
									var br = new IVec2();
									br.Set((nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32) + 32, (nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32) + 32);
									boundsArr.push(br);
									
									var spr = new Sprite();
									spr.SetAnimatedTexture(tex, 8, 4, 3 / nmain.game.mFrameLimit, -1);
									spr.mOrigin.Set(8, 8);
									spr.mPos.Set(nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32, nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32);
									spr.mDepth = 999 + (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) - id;
									
									hiliteArr.push(spr);
								}
							}
							
							this.mPlacementInfo = "create_pusher";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
						}
					}
					else if (i == 1) {
						if (nmgrs.sceneMan.mCurrScene.mPullerCount < 2) {
							var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
							var boundsArr = new Array();
							var hiliteArr = new Array();
							
							for (var j = 0; j < nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles.length; ++j) {
								var pos = nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j];
								var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
									var tl = new IVec2();
									tl.Set(nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32, nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32);
									boundsArr.push(tl);
									
									var br = new IVec2();
									br.Set((nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32) + 32, (nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32) + 32);
									boundsArr.push(br);
									
									var spr = new Sprite();
									spr.SetAnimatedTexture(tex, 8, 4, 3 / nmain.game.mFrameLimit, -1);
									spr.mOrigin.Set(8, 8);
									spr.mPos.Set(nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32, nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32);
									spr.mDepth = 999 + (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) - id;
									
									hiliteArr.push(spr);
								}
							}
							
							this.mPlacementInfo = "create_puller";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
						}
					}
					
					return true;
				}
			}
		}
	}
	
	return false;
}

GFBuildingWP.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_workerprod");
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

GFBuildingWP.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	if (this.mSelected == true) {
		arr.push(this.mMovesLeftSprite);
		
		this.mUI.mSlotText[0].mString = nmgrs.sceneMan.mCurrScene.mPusherCount + " / 2";
		this.mUI.mSlotText[1].mString = nmgrs.sceneMan.mCurrScene.mPullerCount + " / 2";
		
		arr = arr.concat(this.mUI.GetRender());
	}
	
	return arr;
}

GFBuildingWP.prototype.PlacementCallback = function(info, id) {
	if (info == "create_pusher") {
		var pusher = new GFUnitPusher();
		pusher.SetUp(nmgrs.sceneMan.mCurrScene.mCam, nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
		pusher.SetActive(false);
		nmgrs.sceneMan.mCurrScene.mGameEntities.push(pusher);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
		
		this.mMovesLeft--;
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		if (this.mMovesLeft == 0) {
			if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
				this.SetActive(false);
				this.mSelected = false;
				nmgrs.sceneMan.mCurrScene.mSelectID = -1;
			}
		}
		
		nmgrs.sceneMan.mCurrScene.mPusherCount++;
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
	else if (info == "create_puller") {
		var puller = new GFUnitPuller();
		puller.SetUp(nmgrs.sceneMan.mCurrScene.mCam, nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
		puller.SetActive(false);
		nmgrs.sceneMan.mCurrScene.mGameEntities.push(puller);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
		
		if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
			this.SetActive(false);
			this.mSelected = false;
			nmgrs.sceneMan.mCurrScene.mSelectID = -1;
		}
		
		this.mMovesLeft--;
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		if (this.mMovesLeft == 0) {
			if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
				this.SetActive(false);
				this.mSelected = false;
				nmgrs.sceneMan.mCurrScene.mSelectID = -1;
			}
		}
		
		nmgrs.sceneMan.mCurrScene.mPullerCount++;
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
}
// ...End

