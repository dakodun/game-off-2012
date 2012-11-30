// GFEBuildingIC Class...
// 
function GFEBuildingIC() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mActive = true;
	this.mPlayerUnit = false;
	
	this.mMovesLeft = 1;
	
	this.mCurrentAction = "";
}

GFEBuildingIC.prototype.Type = function() {
	return "GFEBuildingIC";
};

GFEBuildingIC.prototype.SetUp = function(pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_enemyion");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(16, 20);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(64, 0));
	this.mBound.AddPoint(new IVec2(64, 64));
	this.mBound.AddPoint(new IVec2(0, 64));
	
	this.mTurnsUntilSpawn = nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(1, 3);
}

GFEBuildingIC.prototype.Process = function() {
	this.mSprite.Process();
}

GFEBuildingIC.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_enemyion");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 1;
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

GFEBuildingIC.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	return arr;
}

GFEBuildingIC.prototype.PerformAIAction = function() {
	var arr = new Array();
	arr = this.CheckValidFire();
	
	var target = -1;
	var priority = 0;
	for (var i = 0; i < arr.length; ++i) {
		var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mEntityID;
		var aiFog = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mAIFog;
		
		if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery" && priority < 1 && aiFog > 0) {
			
			target = entID;
			priority = 1;
		}
		else if (priority == 0 && aiFog > 0) {
			target = entID;
		}
	}
	
	if (target >= 0) {
		nmgrs.sceneMan.mCurrScene.mGameEntities[target].DestroyUnit();
	}
	
	this.mMovesLeft--;
}

GFEBuildingIC.prototype.CheckValidFire = function() {
	var arr = new Array();
	
	var arrPos = new Array();
	
	for (var y = -5; y <= 6; ++y) {
		for (var x = -5; x <= 6; ++x) {
			var pos = new IVec2(this.mPos.mX + x, this.mPos.mY + y);
			if (pos.mX >= 0 && pos.mX < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX &&
					pos.mY >= 0 && pos.mY < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
				
				arrPos.push(pos);
			}
		}
	}
	
	for (var i = 0; i < arrPos.length; ++i) {
		var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(arrPos[i]);
		var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
		
		if (entID >= 0) {
			if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].mPlayerUnit == true) {
				arr.push(id);
			}
		}
	}
	
	return arr;
}

//
GFEBuildingIC.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -2; y <= 3; ++y) {
		for (var x = -2; x <= 3; ++x) {
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
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mAIFog += mode;
	}
}

//
GFEBuildingIC.prototype.DestroyUnit = function() {
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
	nmgrs.sceneMan.mCurrScene.mEnemyLife--;
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
}
// ...End

