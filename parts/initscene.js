// InitScene Class...
// self contained parts of the game such as different screens, levels or game modes
function InitScene() {
	this.mPersist = false;
}

// returns the type of this object for validity checking
InitScene.prototype.Type = function() {
	return "InitScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
InitScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
InitScene.prototype.SetUp = function() {
	try {
		// load the textures we need
		nmgrs.resLoad.QueueTexture("tile_set_default", "./res/vis/tile_set_default.png");
		nmgrs.resLoad.QueueTexture("turn_1", "./res/vis/turn_1.png");
		nmgrs.resLoad.QueueTexture("turn_2", "./res/vis/turn_2.png");
		nmgrs.resLoad.QueueTexture("gui_arrow_up", "./res/vis/gui_arrow_up.png");
		nmgrs.resLoad.QueueTexture("gui_arrow_down", "./res/vis/gui_arrow_down.png");
		nmgrs.resLoad.AcquireResources();
		nmgrs.resLoad.mIntervalID = setInterval(function() {nmgrs.resLoad.ProgressCheck();}, 0);
	} catch(e) {
		alert(e.What());
	}
}

// cleans up the scene object
InitScene.prototype.TearDown = function() {
	
}

// handles user input
InitScene.prototype.Input = function() {
	
}

// handles game logic
InitScene.prototype.Process = function() {
	if (nmgrs.resLoad.mWorking == false) {
		nmgrs.sceneMan.ChangeScene(new TestScene());
	}
}

// handles all drawing tasks
InitScene.prototype.Render = function() {
	
}
// ...End

