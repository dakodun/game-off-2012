// GFUnitPusher Class...
// 
function GFUnitPusher() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mSelected = false;
	this.mActive = true;
	this.mPlayerUnit = true;
	
	this.mUI = new GFUnitUI();
	this.mPlacementInfo = "";
	
	this.mMovesLeft = 2;
	this.mMovesLeftSprite = new Sprite();
	
	this.mKillSwitch = 0;
	this.mKillConfirmA = new Text();
	this.mKillConfirmB = new Text();
	
	this.mSuperMode = false;
}

GFUnitPusher.prototype.Type = function() {
	return "GFUnitPusher";
};

GFUnitPusher.prototype.SetUp = function(camera, pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_pusher");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
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
		this.mUI.mSlotSprites[0].SetAnimatedTexture(tex, 4, 4, -1, -1);
		this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 292, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[0].mDepth = -9999;
		this.mUI.mSlotStatus[0] = true;
		
		var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
		this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
		
		this.mUI.mSlotSprites[1].SetAnimatedTexture(tex, 4, 4, -1, -1);
		this.mUI.mSlotSprites[1].SetCurrentFrame(1);
		this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[1].mDepth = -9999;
		this.mUI.mSlotStatus[1] = true;
		
		wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
		this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
		
		this.mUI.mSlotSprites[2].SetAnimatedTexture(tex, 4, 4, -1, -1);
		this.mUI.mSlotSprites[2].SetCurrentFrame(3);
		this.mUI.mSlotSprites[2].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[2].mDepth = -9999;
		this.mUI.mSlotStatus[2] = true;
		
		wOffset = (this.mUI.mSlotSprites[2].GetWidth() / 2) - (this.mUI.mSlotText[2].GetWidth() / 2);
		this.mUI.mSlotText[2].mPos.Set(this.mUI.mSlotSprites[2].mPos.mX + wOffset, this.mUI.mSlotSprites[2].mPos.mY);
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
}

GFUnitPusher.prototype.Process = function() {
	this.mSprite.Process();
	
	if (this.mKillSwitch > 0) {
		this.mKillSwitch--;
		
		if (this.mKillSwitch == 0) {
			this.mUI.mSlotSprites[2].SetCurrentFrame(3);
		}
	}
}

GFUnitPusher.prototype.UpdateUI = function(camera) {
	this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 292, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
	this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
	
	this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
	this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	
	this.mUI.mSlotSprites[2].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[2].GetWidth() / 2) - (this.mUI.mSlotText[2].GetWidth() / 2);
	this.mUI.mSlotText[2].mPos.Set(this.mUI.mSlotSprites[2].mPos.mX + wOffset, this.mUI.mSlotSprites[2].mPos.mY);
	
	this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + 12);
	this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
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
						var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
						var boundsArr = new Array();
						var hiliteArr = new Array();
						var fogDepth = 0;
						
						var arr = new Array();
						arr = arr.concat(this.CheckValidMove());
						
						if (arr.length > 0) {
							for (var j = 0; j < arr.length; ++j) {
								var id = arr[j];
								var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
								
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
									fogDepth = 0;
									
									if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog == 0) {
										fogDepth = 3000;
									}
									
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
									spr.mDepth = 999 - id - fogDepth;
									
									hiliteArr.push(spr);
								}
							}
							
							this.mPlacementInfo = "move";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
						}
					}
					else if (i == 1) {
						var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
						var boundsArr = new Array();
						var hiliteArr = new Array();
						var fogDepth = 0;
						
						var arr = new Array();
						arr = arr.concat(this.CheckValidPush());
						
						if (arr.length > 0) {
							for (var j = 0; j < arr.length; ++j) {
								var id = arr[j];
								var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
								
								fogDepth = 0;
								
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog == 0) {
									fogDepth = 3000;
								}
								
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
								spr.mDepth = 999 - id - fogDepth;
								
								hiliteArr.push(spr);
							}
							
							this.mPlacementInfo = "push";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
						}
					}
					else if (i == 2) {
						if (this.mKillSwitch > 0) {
							this.DestroyUnit();
							
							this.mUI.mSlotSprites[2].SetCurrentFrame(3);
						}
						else {
							this.mKillSwitch = 100;
							nmgrs.sceneMan.mCurrScene.mEndPlayerTurn = 0;
							
							this.mUI.mSlotSprites[2].SetCurrentFrame(2);
							nmgrs.sceneMan.mCurrScene.mGameUI.mEndTurnSprite.SetCurrentFrame(1);
						}
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
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_pusher");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 2;
			this.mMovesLeftSprite.SetCurrentFrame(0);
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

GFUnitPusher.prototype.GetRender = function() {
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
	}
	
	return arr;
}

GFUnitPusher.prototype.PlacementCallback = function(info, id) {
	if (info == "move") {
		{ // move this
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = oldID;
			this.AdjustFog(-1); // adjust fog in current position
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - id;
			this.mMovesLeftSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.AdjustFog(1); // adjust fog in new position
		}
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
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
		
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
	else if (info == "push") {
		var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
		
		var thisID = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		var otherID = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		
		var thisNewID = 0;
		var otherNewID = id;
		
		if (pos.mX < this.mPos.mX) {
			thisNewID = id + 1;
			otherID -= 1;
		}
		else if (pos.mX > this.mPos.mX) {
			thisNewID = id - 1;
			otherID += 1;
		}
		else if (pos.mY < this.mPos.mY) {
			thisNewID = id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
			otherID -= nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		}
		else if (pos.mY > this.mPos.mY) {
			thisNewID = id - nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
			otherID += nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		}
		
		{ // move other
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherID].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherID].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherID].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherNewID].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherNewID].mEntityID = oldID;
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].AdjustFog(-1); // adjust fog in current position
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(otherNewID));
			
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mDepth = -500 - otherID;
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mMovesLeftSprite.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mBound.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mFireZone.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].AdjustFog(1); // adjust fog in current position
		}
		
		{ // move this
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisID].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisID].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisID].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisNewID].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisNewID].mEntityID = oldID;
			this.AdjustFog(-1); // adjust fog in current position
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(thisNewID));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - thisNewID;
			this.mMovesLeftSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.AdjustFog(1); // adjust fog in new position
		}
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
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
		
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
}

GFUnitPusher.prototype.CheckValidMove = function() {
	var moveAmount = 3;
	if (this.mSuperMode == true) {
		moveAmount = nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
	}
	
	var closedTiles = new Array();
	var openTiles = new Array();
	openTiles.push(nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos));
	
	for (var j = 0; j < moveAmount + 1; ++j) {
		var pendingOpenTiles = new Array();
		
		while (openTiles.length > 0) {			
			// check tile to the left
			// if current tile isn't at 0 (left boundary)
			if ((openTiles[0] % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) > 0) {
				var idToCheck = openTiles[0] - 1;
				
				// if tile to the left is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// check tile above
			// if current tile isn't at 0 (top boundary)
			if (Math.floor(openTiles[0] / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) > 0) {
				var idToCheck = openTiles[0] - nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
				
				// if tile above is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// check tile to the right
			// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1 (right boundary)
			if ((openTiles[0] % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1) {
				var idToCheck = openTiles[0] + 1;
				
				// if tile to the right is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// check tile below
			// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1 (bottom boundary)
			if (Math.floor(openTiles[0] / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1) {
				var idToCheck = openTiles[0] + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
				
				// if tile below is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// add this id to the closed list
			closedTiles.push(openTiles[0]);
			
			// remove from the open list
			openTiles.splice(0, 1);
		}
		
		openTiles = openTiles.concat(pendingOpenTiles);
	}
	
	closedTiles.splice(0, 1);
	return closedTiles;
}

//
GFUnitPusher.prototype.CheckValidPush = function() {
	var moveAmount = 3;
	if (this.mSuperMode == true) {
		moveAmount = nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
	}
	
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	{ // check tile to the left
		var leftBound = id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		
		// if current tile isn't at 0 (left boundary)
		if (leftBound > 0) {
			// get tile to the left
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - 1].mEntityID;
			
			// if a unit exists on that tile
			if (entID > -1) {
				// if the unit is a valid pushable type
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0; // how tiles we have pushed it
					var idIter = 2; // the id we have pushed it to
					
					// while the tile is a valid move and we have moves left
					while ((leftBound - idIter >= 0) && (moveIter < moveAmount)) {
						// if already occuppied, we are done (obstacle hit)
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - idIter].mFree == false) {
							break;
						}
						
						arr.push(id - idIter); // add tile id to highlight array
						
						// increment iterators
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	{ // check tile above
		var topBound = Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX);
		
		// if current tile isn't at 0 (top boundary)
		if (topBound > 0) {
			// get tile above
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID;
			
			if (entID > -1) {
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0;
					var idIter = 2;
					
					// check spaces n above
					while ((topBound - idIter >= 0) && (moveIter < moveAmount)) {
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX)].mFree == false) {
							break;
						}
						
						arr.push(id - (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
						
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	{ // check tile to the right
		var rightBound = id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		
		// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1 (right boundary)
		if (rightBound < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1) {
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mEntityID;
			
			if (entID > -1) {
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0;
					var idIter = 2;
					
					// check spaces n above
					while ((rightBound + idIter <= nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1) && (moveIter < moveAmount)) {
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + idIter].mFree == false) {
							break;
						}
						
						arr.push(id + idIter);
						
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	{ // check tile below
		var bottomBound = Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX);
		
		// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1 (bottom boundary)
		if (bottomBound < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1) {
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID;
			
			if (entID > -1) {
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0;
					var idIter = 2;
					
					// check spaces n above
					while ((bottomBound + idIter <= nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1) && (moveIter < moveAmount)) {
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX)].mFree == false) {
							break;
						}
						
						arr.push(id + (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
						
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	return arr;
}

//
GFUnitPusher.prototype.SoftReset = function() {
	this.mKillSwitch = 0;
	this.mUI.mSlotSprites[2].SetCurrentFrame(3);
}

//
GFUnitPusher.prototype.AdjustFog = function(mode) {
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
GFUnitPusher.prototype.DestroyUnit = function() {
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
	}
	
	nmgrs.sceneMan.mCurrScene.mPusherCount--;
	this.AdjustFog(-1);
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
}
// ...End

