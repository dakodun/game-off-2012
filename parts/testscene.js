// TestScene Class...
// self contained parts of the game such as different screens, levels or game modes
function TestScene() {
	this.mPersist = false;
	
	this.mMapBatch = new RenderBatch();
	this.mMap = new GFMap();
	this.mSprite = new Sprite();
	
	this.mCam = new Camera();
	
	this.mCanScroll = false;
}

// returns the type of this object for validity checking
TestScene.prototype.Type = function() {
	return "TestScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
TestScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
TestScene.prototype.SetUp = function() {
	nmain.game.mClearColour = "#604039";
	
	var d = new Date();
	
	var mapGen = new GFMapGen();
	this.mMap = mapGen.GenerateMap(d.getTime(), "b", "b");// .SetUp(new IVec2(40, 30));
	
	var tex = nmgrs.resMan.mTexStore.GetResource("tile_set_default");
	this.mSprite.SetAnimatedTexture(tex, 25, 5, -1);
	this.mSprite.SetCurrentFrame(1);
	this.mSprite.mOrigin.Set(8, 8);
	
	for (var x = 0; x < this.mMap.mMapSize.mX; ++x) {
		for (var y = 0; y < this.mMap.mMapSize.mY; ++y) {
			var ind = x + (this.mMap.mMapSize.mX * y);
			this.mMapBatch.AddSprite(this.mMap.mMapTiles[ind].mSprite);
		}
	}
	
	this.mCam.mTranslate.Set(0 - ((nmain.game.mCanvasSize.mX - (this.mMap.mMapSize.mX * 32)) / 2),
			0 - ((nmain.game.mCanvasSize.mY - (this.mMap.mMapSize.mY * 32)) / 2));
	
	if (nmain.game.mCanvasSize.mY < this.mMap.mMapSize.mY * 32) {
		this.mCanScroll = true;
	}
}

// cleans up the scene object
TestScene.prototype.TearDown = function() {
	
}

// handles user input
TestScene.prototype.Input = function() {
	/* if (nmgrs.inputMan.GetKeyboardDown(37)) {
		this.mCam.mTranslate.Set(this.mCam.mTranslate.mX - 1, this.mCam.mTranslate.mY);
	} */
	
	if (this.mCanScroll == true) {
		if (this.mCam.mTranslate.mY > -24) {
			if (nmgrs.inputMan.GetKeyboardDown(38)) {
				this.mCam.mTranslate.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY - 1);
			}
		}
		
		if (this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY < (this.mMap.mMapSize.mY * 32) + 24) {
			if (nmgrs.inputMan.GetKeyboardDown(40)) {
				this.mCam.mTranslate.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY + 1);
			}
		}
	}
	
	/* if (nmgrs.inputMan.GetKeyboardDown(39)) {
		this.mCam.mTranslate.Set(this.mCam.mTranslate.mX + 1, this.mCam.mTranslate.mY);
	} */
}

// handles game logic
TestScene.prototype.Process = function() {
	
}

// handles all drawing tasks
TestScene.prototype.Render = function() {
	nmain.game.SetIdentity();
	this.mCam.Apply();
	
	// this.mMapBatch.Clear();
	
	// this.mMapBatch.AddSprite(this.mSprite);
	this.mMapBatch.Render(this.mCam);
}
// ...End

