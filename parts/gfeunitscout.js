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
	this.mEntityFollowing = -1;
	
	this.mHealth = 1;
	this.mHealthText = new Text();
	this.mHealthBack = new Shape();
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
	
	{
		this.mHealthText.SetFontName("sans-serif");
		this.mHealthText.mColour = "#FFAA77";
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
	
	{
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog > 0) {
			arr.push(this.mHealthBack);
			arr.push(this.mHealthText);
		}
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
	else if (this.mCurrentAction == "FollowUnit") {
		this.FollowUnit();
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
			this.AdjustFog(-1);
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - id;
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.AdjustFog(1);
			
			this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
			this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		}
	}
	
	
	var idFollow = -1;
	{
		var breakLoop = false;
		var idThis = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		
		for (var y = -1; y <= 1; ++y) {
			for (var x = -1; x <= 1; ++x) {
				if ((idThis % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x >= 0 &&
						(idThis % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) {
					
					if (Math.floor(idThis / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y >= 0 &&
							Math.floor(idThis / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
						
						var idCheck = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[(idThis + x) + (y * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX)].mEntityID;
						if (idCheck >= 0) {
							if (nmgrs.sceneMan.mCurrScene.mGameEntities[idCheck].Type() == "GFUnitPusher" ||
									nmgrs.sceneMan.mCurrScene.mGameEntities[idCheck].Type() == "GFUnitPuller" ||
									nmgrs.sceneMan.mCurrScene.mGameEntities[idCheck].Type() == "GFUnitArtillery") {
								
								idFollow = idCheck;
								breakLoop = true;
								break;
							}
						}
					}
				}
			}
			
			if (breakLoop == true) {
				break;
			}
		}
	}
	
	if (idFollow > 0) {
		this.mEntityFollowing = idFollow;
		this.mCurrentAction = "FollowUnit";
	}
	else if (this.mPos.mY == nmgrs.sceneMan.mCurrScene.mMap.IDToPos(end).mY) {
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
			
			this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
			this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
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
	if (this.mEntityFollowing < 0) {
		this.mCurrentAction = "ReturnToBase";
		this.ReturnToBase();
	}
	else {
		var moveAmount = 3;
		
		var as = new AStar();
		as.SetUp(nmgrs.sceneMan.mCurrScene.mMap.mMapSize);
		for (var i = 0; i < nmgrs.sceneMan.mCurrScene.mMap.mMapTiles.length; ++i) {
			as.mMap[i].mValid = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[i].mFree;
		}
		
		var path = new Array();
		var start = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		var end = nmgrs.sceneMan.mCurrScene.mMap.PosToID(nmgrs.sceneMan.mCurrScene.mGameEntities[this.mEntityFollowing].mPos);
		path = as.FindPath(start, end);
		
		if (path.length > 12) { // break off the chase
			this.mEntityFollowing = -1;
			this.mCurrentAction = "ReturnToBase";
			this.ReturnToBase();
		}
		else {
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
					
					this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
					this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
				}
			}
		}
	}
}

//
GFEUnitScout.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -1; y <= 1; ++y) {
		for (var x = -1; x <= 1; ++x) {
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
	
	this.AdjustFog(-1);
	nmgrs.sceneMan.mCurrScene.mScoutCount--;
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
	
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(this.mPos);
}

//
GFEUnitScout.prototype.DecreaseHealth = function(amount) {
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

