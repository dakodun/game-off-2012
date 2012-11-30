// GFEUnitScout Class...
// 
function GFEUnitScout() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mActive = true;
	this.mPlayerUnit = false;
	
	this.mMovesLeft = 2;
	
	this.mCurrentAction = "";
}

GFEUnitScout.prototype.Type = function() {
	return "GFEUnitScout";
};

GFEUnitScout.prototype.SetUp = function(pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_enemyscout");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(0, 0);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(32, 0));
	this.mBound.AddPoint(new IVec2(32, 32));
	this.mBound.AddPoint(new IVec2(0, 32));
}

GFEUnitScout.prototype.Process = function() {
	this.mSprite.Process();
}

GFEUnitScout.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_enemyscout");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 2;
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

GFEUnitScout.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	return arr;
}

GFEUnitScout.prototype.PerformAIAction = function() {
	if (this.mCurrentAction == "FindUnit") {
		this.FindUnit();
	}
	else if (this.mCurrentAction == "ReturnToBase") {
		this.ReturnToBase();
	}
	
	this.mMovesLeft--;
}

GFEUnitScout.prototype.FindUnit = function() {	
	// the scout will travel down (and to an extent across) the map attempting to locate a player's unit
	// to follow and provide scouting information
	
	// responses
	// FollowUnit(): a unit was found so now we attempt to follow it
	// FindUnit(): we haven't yet found a unit so keep trying
	// ReturnToBase(): we didn't find a unit and we reached the bottom of the map so return to base (top)
	
	var moveAmount = 3;
	
	var as = new AStar();
	as.SetUp(nmgrs.sceneMan.mCurrScene.mMap.mMapSize);
	for (var i = 0; i < nmgrs.sceneMan.mCurrScene.mMap.mMapTiles.length; ++i) {
		as.mMap[i].mValid = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[i].mFree;
	}
	
	var path = new Array();
	var start = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var end = nmgrs.sceneMan.mCurrScene.mMap.PosToID(new IVec2(nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(0, nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1), nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1));
	path = as.FindPath(start, end);
	
	var id = (path.length - 1) - moveAmount;
	
	// if not true then we can't even move 1 tile!
	if (path.length > 1) {
		if (id < 0) {
			id = path.length - 1;
		}
		
		id = path[id];
		
		{ // move this
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = oldID;
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - id;
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
		}
	}
	
	if (this.mPos.mY == nmgrs.sceneMan.mCurrScene.mMap.IDToPos(end).mY) {
		this.mCurrentAction = "ReturnToBase";
	}
	else {
		this.mCurrentAction = "FindUnit";
	}
}

GFEUnitScout.prototype.ReturnToBase = function() {	
	// the scout will travel upwards trying to get back to it's base upon
	// which it will then continue seeking units
	
	// responses
	// ReturnToBase(): we haven't reached base yet so keep trying
	// FindUnit(): we've reached base so now seek out a unit to follow again
	
	var moveAmount = 3;
	
	var as = new AStar();
	as.SetUp(nmgrs.sceneMan.mCurrScene.mMap.mMapSize);
	for (var i = 0; i < nmgrs.sceneMan.mCurrScene.mMap.mMapTiles.length; ++i) {
		as.mMap[i].mValid = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[i].mFree;
	}
	
	var path = new Array();
	var start = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var end = nmgrs.sceneMan.mCurrScene.mMap.PosToID(new IVec2(nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(0, nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1), 2));
	path = as.FindPath(start, end);
	
	var id = (path.length - 1) - moveAmount;
	
	// if not true then we can't even move 1 tile!
	if (path.length > 1) {
		if (id < 0) {
			id = path.length - 1;
		}
		
		id = path[id];
		
		{ // move this
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = oldID;
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - id;
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
		}
	}
	
	if (this.mPos.mY == 2) {
		this.mCurrentAction = "FindUnit";
	}
	else {
		this.mCurrentAction = "ReturnToBase";
	}
}

GFEUnitScout.prototype.FollowUnit = function() {
	
}

//
GFEUnitScout.prototype.DestroyUnit = function() {
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
	
	nmgrs.sceneMan.mCurrScene.mScoutCount--;
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
}
// ...End

