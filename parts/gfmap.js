// GFMap Class...
// 
function GFMap() {
	this.mMapSize = new IVec2(0, 0);
	
	this.mMapTiles = new Array();
};

GFMap.prototype.SetUp = function(size) {
	this.mMapSize.Copy(size);
	
	var iv = new IVec2(0, 0);
	var tex = nmgrs.resMan.mTexStore.GetResource("tile_set_default");
	
	for (var x = 0; x < this.mMapSize.mX; ++x) {
		for (var y = 0; y < this.mMapSize.mY; ++y) {
			iv.Set(x, y);
			var ind = x + (this.mMapSize.mX * y);
			this.mMapTiles[ind] = new GFMapTile(iv);
			this.mMapTiles[ind].mSprite.SetAnimatedTexture(tex, 25, 5, -1);
			this.mMapTiles[ind].mSprite.mOrigin.Set(8, 8);
			this.mMapTiles[ind].mSprite.SetCurrentFrame(0);
			this.mMapTiles[ind].mSprite.mPos.Set(32 * x, 32 * y);
			this.mMapTiles[ind].mSprite.mDepth = 1000 + (this.mMapSize.mX * this.mMapSize.mY) - ind;
			// this.mMapTiles[ind].mSprite.mRotation = 45;
		}
	}
}
// ...End

