// GFMap Class...
// 
function GFMap() {
	this.mMapSize = new IVec2(0, 0);
	
	this.mMapTiles = new Array();
	this.mRand = new RNG(0);
};

GFMap.prototype.SetUp = function(size) {
	this.mMapSize.Copy(size);
	
	var iv = new IVec2(0, 0);
	var tex = nmgrs.resMan.mTexStore.GetResource("tile_set_default");
	
	for (var y = 0; y < this.mMapSize.mY; ++y) {
		for (var x = 0; x < this.mMapSize.mX; ++x) {
			iv.Set(x, y);
			var ind = x + (this.mMapSize.mX * y);
			this.mMapTiles[ind] = new GFMapTile(iv);
			this.mMapTiles[ind].mSprite.SetAnimatedTexture(tex, 25, 5, -1);
			this.mMapTiles[ind].mSprite.mOrigin.Set(8, 8);
			this.mMapTiles[ind].mSprite.mPos.Set(32 * x, 32 * y);
			this.mMapTiles[ind].mSprite.mDepth = 1000 + (this.mMapSize.mX * this.mMapSize.mY) - ind;
			this.mMapTiles[ind].mSprite.SetCurrentFrame(this.mRand.GetRandInt(0, 4));
		}
	}
}

GFMap.prototype.CreateBases = function(circArr) {
	var c1 = circArr[0];
	var c2 = circArr[1];
	
	for (var y = 0; y < this.mMapSize.mY; ++y) {
		for (var x = 0; x < this.mMapSize.mX; ++x) {
			var ind = x + (this.mMapSize.mX * y);
			
			var vec1 = new IVec2((c1.mPos.mX - this.mMapTiles[ind].mPos.mX) * 46, (c1.mPos.mY - this.mMapTiles[ind].mPos.mY) * 46);
			var dist1 = (vec1.mX * vec1.mX) + (vec1.mY * vec1.mY);
			var dist2 = (c1.mRadius + 46) * (c1.mRadius + 46);
			
			var vec2 = new IVec2((c2.mPos.mX - this.mMapTiles[ind].mPos.mX) * 46, (c2.mPos.mY - this.mMapTiles[ind].mPos.mY) * 46);
			var dist3 = (vec2.mX * vec2.mX) + (vec2.mY * vec2.mY);
			var dist4 = (c2.mRadius + 46) * (c2.mRadius + 46);
			
			if (dist1 < dist2) {
				this.mMapTiles[ind].mSprite.SetCurrentFrame(this.mRand.GetRandInt(10, 14));
				this.mMapTiles[ind].mType = "redbase";
			}
			else if (dist3 < dist4) {
				this.mMapTiles[ind].mSprite.SetCurrentFrame(this.mRand.GetRandInt(15, 19));
				this.mMapTiles[ind].mType = "bluebase";
			}
		}
	}
}

GFMap.prototype.Erode = function(circArr) {
	if (circArr.length > 0) {
		for (var y = 0; y < this.mMapSize.mY; ++y) {
			for (var x = 0; x < this.mMapSize.mX; ++x) {
				var ind = x + (this.mMapSize.mX * y);
				
				for (var i = 0; i < circArr.length; ++i) {
					var vec = new IVec2((circArr[i].mPos.mX - this.mMapTiles[ind].mPos.mX) * 46, (circArr[i].mPos.mY - this.mMapTiles[ind].mPos.mY) * 46);
					var dist1 = (vec.mX * vec.mX) + (vec.mY * vec.mY);
					var dist2 = (circArr[i].mRadius + 46) * (circArr[i].mRadius + 46);
					
					if (dist1 < dist2) {
						if (this.mMapTiles[ind].mType != "redbase" && this.mMapTiles[ind].mType != "bluebase") {
							this.mMapTiles[ind].mSprite.SetCurrentFrame(this.mRand.GetRandInt(5, 9));
						}
					}
				}
				
			}
		}
	}
}
// ...End

