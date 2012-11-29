// GFEBuildingSP Class...
// 
function GFEBuildingSP() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mActive = true;
	this.mPlayerUnit = false;
	
	this.mMovesLeft = 1;
	
	this.mCurrentAction = "";
	this.mTurnsUntilSpawn = 0;
}

GFEBuildingSP.prototype.Type = function() {
	return "GFEBuildingSP";
};

GFEBuildingSP.prototype.SetUp = function(pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_enemyscoutprod");
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

GFEBuildingSP.prototype.Process = function() {
	this.mSprite.Process();
}

GFEBuildingSP.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_enemyscoutprod");
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

GFEBuildingSP.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	return arr;
}

GFEBuildingSP.prototype.PerformAIAction = function() {
	if (this.mTurnsUntilSpawn == 0) {
		var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos) + (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX * 2);
		
		if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
			var scout = new GFEUnitScout();
			scout.SetUp(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
			scout.SetActive(false);
			scout.mCurrentAction = "FindUnit";
			nmgrs.sceneMan.mCurrScene.mGameEntities.push(scout);
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1;
		}
		else if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mFree == true) {
			var scout = new GFEUnitScout();
			scout.SetUp(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id + 1));
			scout.SetActive(false);
			scout.mCurrentAction = "FindUnit";
			nmgrs.sceneMan.mCurrScene.mGameEntities.push(scout);
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mEntityID = nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1;
		}
		
		this.mTurnsUntilSpawn = nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(1, 3);
	}
	else {
		this.mTurnsUntilSpawn--;
		this.mMovesLeft--;
	}
}
// ...End

