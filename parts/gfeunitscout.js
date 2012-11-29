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

	this.mCurrentAction = "FindUnit";
}
// ...End

