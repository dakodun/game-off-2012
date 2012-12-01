// HelpScene Class...
// self contained parts of the game such as different screens, levels or game modes
function HelpScene() {
	this.mPersist = false;
}

// returns the type of this object for validity checking
HelpScene.prototype.Type = function() {
	return "HelpScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
HelpScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
HelpScene.prototype.SetUp = function() {
	nmain.game.mClearColour = "#604039";
}

// cleans up the scene object
HelpScene.prototype.TearDown = function() {
	
}

// handles user input
HelpScene.prototype.Input = function() {
	if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.left)) {
		nmgrs.sceneMan.ChangeScene(new MenuScene());
	}
}

// handles game logic
HelpScene.prototype.Process = function() {
	
}

// handles all drawing tasks
HelpScene.prototype.Render = function() {
	nmain.game.SetIdentity();
}
// ...End

