// GFMap Class...
// 
function GFMap() {
	this.mMapSize = new IVec2(0, 0);
	
	this.mMapTiles = new Array();
	this.mBlueTiles = new Array();
	this.mRedTiles = new Array();
	this.mRand = new RNG(0);
	
	this.mMapBatch = new RenderBatch();
	this.mShowFog = true;
	
	this.mTileExplosions = new Array();
};

GFMap.prototype.SetUp = function(size) {
	this.mMapSize.Copy(size);
	
	var iv = new IVec2(0, 0);
	var tex = nmgrs.resMan.mTexStore.GetResource("tile_set_default");
	var fog = nmgrs.resMan.mTexStore.GetResource("fog");
	
	for (var y = 0; y < this.mMapSize.mY; ++y) {
		for (var x = 0; x < this.mMapSize.mX; ++x) {
			iv.Set(x, y);
			var ind = x + (this.mMapSize.mX * y);
			this.mMapTiles[ind] = new GFMapTile(iv);
			this.mMapTiles[ind].mSprite.SetAnimatedTexture(tex, 25, 5, -1);
			this.mMapTiles[ind].mSprite.mOrigin.Set(8, 8);
			this.mMapTiles[ind].mSprite.mPos.Set(32 * x, 32 * y);
			this.mMapTiles[ind].mSprite.mDepth = 1000 + (this.mMapSize.mX * this.mMapSize.mY) - ind;
			this.mMapTiles[ind].mSprite.SetCurrentFrame(0);
			
			this.mMapTiles[ind].mFogSprite.SetAnimatedTexture(fog, 4, 4, 8 / nmain.game.mFrameLimit, -1);
			this.mMapTiles[ind].mFogSprite.mOrigin.Set(8, 8);
			this.mMapTiles[ind].mFogSprite.mPos.Set(32 * x, 32 * y);
			this.mMapTiles[ind].mFogSprite.mDepth = -1600 - ind;
		}
	}
}

GFMap.prototype.Process = function() {
	for (var i = 0; i < this.mTileExplosions.length; ++i) {
		this.mTileExplosions[i].Process();
		
		if (this.mTileExplosions[i].mNumLoops == 0) {
			this.mTileExplosions.splice(i, 1);
		}
	}
}

GFMap.prototype.IDToPos = function(id) {
	var pos = new IVec2(0, 0);
	pos.mY = Math.floor(id / this.mMapSize.mX);
	pos.mX = id - (this.mMapSize.mX * pos.mY);
	
	return pos;
}

GFMap.prototype.PosToID = function(pos) {
	var id = pos.mX + (this.mMapSize.mX * pos.mY);
	return id;
}

GFMap.prototype.GetRender = function() {
	var arr = new Array();
	
	if (this.mShowFog == true) {
		for (var y = 0; y < this.mMapSize.mY; ++y) {
			for (var x = 0; x < this.mMapSize.mX; ++x) {
				var ind = x + (this.mMapSize.mX * y);
				
				if (this.mMapTiles[ind].mFog == 0 && this.mMapTiles[ind].mSprite.mCurrFrame != 0) {
					arr.push(this.mMapTiles[ind].mFogSprite);
				}
			}
		}
	}
	
	for (var i = 0; i < this.mTileExplosions.length; ++i) {
		arr.push(this.mTileExplosions[i]);
	}
	
	return arr;
}

GFMap.prototype.AddExplosion = function(pos) {
	var spr = new Sprite();
	var tex = nmgrs.resMan.mTexStore.GetResource("explode");
	spr.SetAnimatedTexture(tex, 8, 4, 2 / nmain.game.mFrameLimit, 1);
	spr.mPos.Set(pos.mX * 32, pos.mY * 32);
	spr.mDepth = -550 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	
	this.mTileExplosions.push(spr);
}
// ...End

