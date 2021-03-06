// GFBuildingWP Class...
// 
function GFBuildingWP() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mSelected = false;
	this.mActive = true;
	this.mPlayerUnit = true;
	
	this.mUI = new GFUnitUI();
	this.mPlacementInfo = "";
	
	this.mMovesLeft = 1;
	this.mMovesLeftSprite = new Sprite();
	
	this.mSuperMode = false;
}

GFBuildingWP.prototype.Type = function() {
	return "GFBuildingWP";
};

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
		this.mMovesLeftSprite.mOrigin.Set((this.mMovesLeftSprite.GetWidth() / 2) - (this.mSprite.GetWidth() / 4) - 6, 6);
		this.mMovesLeftSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
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
		this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[0].mDepth = -9998;
		this.mUI.mSlotStatus[0] = true;
		this.mUI.mSlotText[0].mString = "0 / 2";
		this.mUI.mSlotText[0].mShadow = true;
		this.mUI.mSlotText[0].mDepth = -9999;
		
		var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
		this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY - this.mUI.mSlotText[1].GetHeight());
		
		this.mUI.mSlotSprites[1].SetAnimatedTexture(tex, 2, 2, -1, -1);
		this.mUI.mSlotSprites[1].SetCurrentFrame(1);
		this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[1].mDepth = -9998;
		this.mUI.mSlotStatus[1] = true;
		this.mUI.mSlotText[1].mString = "0 / 2";
		this.mUI.mSlotText[1].mShadow = true;
		this.mUI.mSlotText[1].mDepth = -9999;
		
		wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
		this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY - this.mUI.mSlotText[1].GetHeight());
	}
}

GFBuildingWP.prototype.Process = function() {
	this.mSprite.Process();
}

GFBuildingWP.prototype.UpdateUI = function(camera) {
	this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
	this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY - this.mUI.mSlotText[0].GetHeight());
	
	this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
	this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY - this.mUI.mSlotText[1].GetHeight());
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
						if (nmgrs.sceneMan.mCurrScene.mPusherCount < 2 || this.mSuperMode == true) {
							var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
							var boundsArr = new Array();
							var hiliteArr = new Array();
							var fogDepth = 0;
							
							for (var j = 0; j < nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles.length; ++j) {
								var pos = nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j];
								var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
									fogDepth = 0;
									
									if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog == 0) {
										fogDepth = 3000;
									}
									
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
									spr.mDepth = 999 + (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) - id - fogDepth;
									
									hiliteArr.push(spr);
								}
							}
							
							this.mPlacementInfo = "create_pusher";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
						}
					}
					else if (i == 1) {
						if (nmgrs.sceneMan.mCurrScene.mPullerCount < 2 || this.mSuperMode == true) {
							var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
							var boundsArr = new Array();
							var hiliteArr = new Array();
							var fogDepth = 0;
							
							for (var j = 0; j < nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles.length; ++j) {
								var pos = nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j];
								var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
									fogDepth = 0;
									
									if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog == 0) {
										fogDepth = 3000;
									}
									
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
									spr.mDepth = 999 + (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) - id - fogDepth;
									
									hiliteArr.push(spr);
								}
							}
							
							this.mPlacementInfo = "create_puller";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
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
		this.mUI.mSlotText[0].mString = nmgrs.sceneMan.mCurrScene.mPusherCount + " / 2";
		this.mUI.mSlotText[1].mString = nmgrs.sceneMan.mCurrScene.mPullerCount + " / 2";
		
		arr = arr.concat(this.mUI.GetRender());
		if (this.mUI.mShow == true) {
			arr.push(this.mMovesLeftSprite);
		}
	}
	
	return arr;
}

GFBuildingWP.prototype.PlacementCallback = function(info, id) {
	if (info == "create_pusher") {
		var pusher = new GFUnitPusher();
		pusher.SetUp(nmgrs.sceneMan.mCurrScene.mCam, nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
		pusher.SetActive(false);
		pusher.AdjustFog(1);
		nmgrs.sceneMan.mCurrScene.mGameEntities.push(pusher);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1;
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
		}
		else {
			nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1].SetActive(true);
			nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1].mSuperMode = true;
		}
		
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		this.mUI.mShow = true;
		
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
		puller.AdjustFog(1);
		nmgrs.sceneMan.mCurrScene.mGameEntities.push(puller);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1;
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
		}
		else {
			nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1].SetActive(true);
			nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1].mSuperMode = true;
		}
		
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		this.mUI.mShow = true;
		
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

//
GFBuildingWP.prototype.SoftReset = function() {
	
}

//
GFBuildingWP.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -3; y <= 4; ++y) {
		for (var x = -3; x <= 4; ++x) {
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

//
GFBuildingWP.prototype.DestroyUnit = function() {
	this.SetActive(false);
	this.mSelected = false;
	
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
	
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mGameEntities.splice(entID, 1);
	
	for (var i = entID; i < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++i) {
		var nid = nmgrs.sceneMan.mCurrScene.mMap.PosToID(nmgrs.sceneMan.mCurrScene.mGameEntities[i].mPos);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid].mEntityID = i;
		
		if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFBuildingWP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingSP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingIC") {
			
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + 1].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = i;
		}
	}
	
	this.AdjustFog(-1);
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
	
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(this.mPos);
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX + 1, this.mPos.mY));
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX, this.mPos.mY + 1));
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX + 1, this.mPos.mY + 1));
}
// ...End

