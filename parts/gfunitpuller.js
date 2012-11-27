// GFUnitPuller Class...
// 
function GFUnitPuller() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = true;
	
	this.mSelected = false;
	this.mActive = true;
	
	this.mUI = new GFUnitUI();
	this.mPlacementInfo = "";
	
	this.mMovesLeft = 2;
	this.mMovesLeftSprite = new Sprite();
}

GFUnitPuller.prototype.SetUp = function(camera, pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_puller");
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
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(32, 0));
	this.mBound.AddPoint(new IVec2(32, 32));
	this.mBound.AddPoint(new IVec2(0, 32));
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_puller");
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

GFUnitPuller.prototype.Process = function() {
	this.mSprite.Process();
}

GFUnitPuller.prototype.UpdateUI = function(camera) {
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

GFUnitPuller.prototype.ProcessUI = function(camera) {
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
						
						var arr = new Array();
						arr = arr.concat(this.CheckValidMove());
						
						for (var j = 0; j < arr.length; ++j) {
							var id = arr[j];
							var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
							
							if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
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
								spr.mDepth = 999 + (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) - id;
								
								hiliteArr.push(spr);
							}
						}
						
						this.mPlacementInfo = "move";
						nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
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

GFUnitPuller.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_puller");
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

GFUnitPuller.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	if (this.mSelected == true) {
		arr.push(this.mMovesLeftSprite);
		arr = arr.concat(this.mUI.GetRender());
	}
	
	return arr;
}

GFUnitPuller.prototype.PlacementCallback = function(info, id) {
	if (info == "move") {
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mFree = true;
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
		this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
		
		this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
		this.mSprite.mDepth = -500 - id;
		this.mMovesLeftSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
		this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
		
		this.mMovesLeft--;
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
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

GFUnitPuller.prototype.CheckValidMove = function() {
	var moveAmount = 3;
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
	
	return closedTiles;
}
// ...End

