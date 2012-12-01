// GFUnitArtillery Class...
// 
function GFUnitArtillery() {
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
	
	this.mKillSwitch = 0;
	this.mKillConfirmA = new Text();
	this.mKillConfirmB = new Text();
	
	this.mFireZone = new Sprite();
	this.mShowFireZone = true;
	
	this.mSuperMode = false;
	
	this.mHealth = 6;
	this.mHealthText = new Text();
	this.mHealthBack = new Shape();
}

GFUnitArtillery.prototype.Type = function() {
	return "GFUnitArtillery";
};

GFUnitArtillery.prototype.SetUp = function(camera, pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_arty");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(0, 0);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_moves");
		this.mMovesLeftSprite.SetAnimatedTexture(tex, 3, 1, -1, -1);
		this.mMovesLeftSprite.mOrigin.Set((this.mMovesLeftSprite.GetWidth() / 2) - (this.mSprite.GetWidth() / 2), 6);
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
		this.mUI.mSlotSprites[0].SetAnimatedTexture(tex, 3, 3, -1, -1);
		this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[0].mDepth = -9999;
		this.mUI.mSlotStatus[0] = true;
		
		var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
		this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
		
		this.mUI.mSlotSprites[1].SetAnimatedTexture(tex, 3, 3, -1, -1);
		this.mUI.mSlotSprites[1].SetCurrentFrame(2);
		this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[1].mDepth = -9999;
		this.mUI.mSlotStatus[1] = true;
		
		wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
		this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	}
	
	{
		this.mKillConfirmA.SetFontName("sans-serif");
		this.mKillConfirmA.SetFontSize(12);
		this.mKillConfirmA.mString = "Press Again To";
		this.mKillConfirmA.mDepth = -9999;
		this.mKillConfirmA.mShadow = true;
		this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + 12);
		
		this.mKillConfirmB.SetFontName("sans-serif");
		this.mKillConfirmB.SetFontSize(32);
		this.mKillConfirmB.mString = "CONFIRM KILL UNIT";
		this.mKillConfirmB.mDepth = -9999;
		this.mKillConfirmB.mShadow = true;
		this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
	}
	
	{
		this.mHealthText.SetFontName("sans-serif");
		this.mHealthText.mColour = "#77AAFF";
		this.mHealthText.SetFontSize(12);
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthText.mDepth = -9994;
		this.mHealthText.mShadow = true;
		this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
		
		this.mHealthBack.mColour = "#000000";
		this.mHealthBack.mAlpha = 0.85;
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}

// 
GFUnitArtillery.prototype.Process = function() {
	this.mSprite.Process();
	
	if (this.mKillSwitch > 0) {
		this.mKillSwitch--;
		
		if (this.mKillSwitch == 0) {
			this.mUI.mSlotSprites[1].SetCurrentFrame(2);
		}
	}
}

//
GFUnitArtillery.prototype.UpdateUI = function(camera) {
	this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
	this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
	
	this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
	this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	
	this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + 12);
	this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
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
						var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite_fire");
						var boundsArr = new Array();
						var hiliteArr = new Array();
						
						var arr = new Array();
						arr = arr.concat(this.CheckValidFire());
						
						if (arr.length > 0) {
							for (var j = 0; j < arr.length; ++j) {
								var id = arr[j];
								var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
								
								var tl = new IVec2();
								tl.Set(pos.mX * 32, pos.mY * 32);
								boundsArr.push(tl);
								
								var br = new IVec2();
								br.Set((pos.mX * 32) + 32, (pos.mY * 32) + 32);
								boundsArr.push(br);
								
								var spr = new Sprite();
								spr.SetAnimatedTexture(tex, 8, 4, 3 / nmain.game.mFrameLimit, -1);
								spr.mOrigin.Set(8, 8);
								spr.mPos.Set(pos.mX * 32, pos.mY * 32);
								spr.mDepth = -2001 - id;
								
								hiliteArr.push(spr);
							}
							
							this.mPlacementInfo = "fire";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
							
							this.mShowFireZone = false;
						}
					}
					else if (i == 1) {
						if (this.mKillSwitch > 0) {
							this.DestroyUnit();
							
							this.mUI.mSlotSprites[1].SetCurrentFrame(2);
						}
						else {
							this.mKillSwitch = 100;
							nmgrs.sceneMan.mCurrScene.mEndPlayerTurn = 0;
							
							this.mUI.mSlotSprites[1].SetCurrentFrame(1);
							nmgrs.sceneMan.mCurrScene.mGameUI.mEndTurnSprite.SetCurrentFrame(1);
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
		
		if (this.mShowFireZone) {
			arr.push(this.mFireZone);
		}
	}
	
	arr.push(this.mHealthBack);
	arr.push(this.mHealthText);
	
	return arr;
}

//
GFUnitArtillery.prototype.PlacementCallback = function(info, id) {
	if (info == "fire") {
		var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
		var amount = nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(3, 6);
		nmgrs.sceneMan.mCurrScene.mGameEntities[entID].DecreaseHealth(amount);
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
		}
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		this.mUI.mShow = true;
		this.mShowFireZone = true;
		
		if (this.mMovesLeft == 0) {
			if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
				this.SetActive(false);
				this.mSelected = false;
				nmgrs.sceneMan.mCurrScene.mSelectID = -1;
			}
		}
		
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
}

GFUnitArtillery.prototype.CheckValidFire = function() {
	var arr = new Array();
	
	var arrPos = new Array();
	var skip = false;
	
	for (var y = -4; y <= 4; ++y) {
		for (var x = -4; x <= 4; ++x) {
			if (y >= -2 && y <= 2) {
				if (x >= -2 && x <= 2) {
					skip = true;
				}
			}
			
			if (skip == false) {
				var pos = new IVec2(this.mPos.mX + x, this.mPos.mY + y);
				if (pos.mX >= 0 && pos.mX < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX &&
						pos.mY >= 0 && pos.mY < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					arrPos.push(pos);
				}
			}
			
			skip = false;
		}
	}
	
	for (var i = 0; i < arrPos.length; ++i) {
		var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(arrPos[i]);
		var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
		var fog = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog;
		
		if (this.mSuperMode == true) {
			fog = 1;
		}
		
		if (entID >= 0) {
			if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].mPlayerUnit == false && fog > 0) {
				arr.push(id);
			}
		}
	}
	
	return arr;
}

//
GFUnitArtillery.prototype.SoftReset = function() {
	this.mKillSwitch = 0;
	this.mUI.mSlotSprites[1].SetCurrentFrame(2);
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

//
GFUnitArtillery.prototype.DestroyUnit = function() {
	this.SetActive(false);
	this.mSelected = false;
	
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
	
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = -1;
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
		else if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEUnitScout") {
			if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].mEntityFollowing == entID) {
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].mEntityFollowing = -1;
			}
		}
	}
	
	nmgrs.sceneMan.mCurrScene.mPlayerLife--;
	this.AdjustFog(-1);
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
	
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(this.mPos);
}

//
GFUnitArtillery.prototype.DecreaseHealth = function(amount) {
	this.mHealth -= amount;
	if (this.mHealth <= 0) {
		this.DestroyUnit();
	}
	else {
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		
		this.mHealthBack.Reset();
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}
// ...End

