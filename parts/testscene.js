// TestScene Class...
// self contained parts of the game such as different screens, levels or game modes
function TestScene() {
	this.mPersist = false;
	
	this.mTestBatch = new RenderBatch();
	this.mTestSprite = new Sprite();
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
	var tex = nmgrs.resMan.mTexStore.GetResource("testm");
	this.mTestSprite.SetAnimatedTexture(tex, 6, 4, 500);
}

// cleans up the scene object
TestScene.prototype.TearDown = function() {
	
}

// handles user input
TestScene.prototype.Input = function() {
	
}

// handles game logic
TestScene.prototype.Process = function() {
	this.mTestSprite.Process();
}

// handles all drawing tasks
TestScene.prototype.Render = function() {
	this.mTestBatch.Clear();
	this.mTestBatch.AddSprite(this.mTestSprite);
	this.mTestBatch.Render();
}
// ...End

