// InitScene Class...
// self contained parts of the game such as different screens, levels or game modes
function InitScene() {
	this.persist = false;
	// this.resLoad = new ResourceLoader();
}

// returns the type of this object for validity checking
InitScene.prototype.Type = function() {
	return "InitScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
InitScene.prototype.Persistent = function() {
	return persist;
};

// initialises the scene object
InitScene.prototype.SetUp = function() {
	// var tex = new Texture();
	// tex.LoadFromFile("./res/vis/test.png");
	
	try {
		/* var t = nmgrs.resMan.mTexStore.AddResource(new Texture(), "test");
		t.LoadFromFile("./res/vis/test.png"); */
		
		// resLoad = new ResourceLoader();
		nmgrs.resLoad.QueueTexture("test", "./res/vis/test.png");
		nmgrs.resLoad.AcquireResources();
		nmgrs.resLoad.mIntervalID = setInterval(function() {nmgrs.resLoad.ProgressCheck();}, 1000);
		// nmain.game.mGameLoop = setInterval(function() {nmain.game.Run();}, 0);
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
	
}

// handles all drawing tasks
InitScene.prototype.Render = function() {
	// var tex = new Texture();
	// tex.LoadFromFile("./res/vis/test.png");
	
	if (nmgrs.resLoad.mWorking == false) {
		var tex = nmgrs.resMan.mTexStore.GetResource("test");
		nmain.game.mContext.drawImage(tex.mImg, 0, 0);
	}
	else {
	}
	
	// nmain.game.mContext.fillText("Hello", 50, 50);
	// nmain.game.mContext.drawImage(tex.mImg, 0, 0);
	
}
// ...End

