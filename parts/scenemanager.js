// SceneManager Class...
// handles the creation and destruction of scenes, changing between scenes and storing and restoring persistent scenes
function SceneManager() {
	this.mCurrScene = null; // our current scene
	this.mSceneStore = new Array(); // all of our stored (persistent) scenes
}

// initialises the scene manager
SceneManager.prototype.SetUp = function() {
	
}

// cleans up the scene manager and all scenes currently stored
SceneManager.prototype.TearDown = function() {
	// for all currently stored scenes
	for (var i = 0; i < this.mSceneStore.length; ++i) {
		this.mSceneStore[i].TearDown(); // clean up
	}
	
	this.mSceneStore.splice(0, this.mSceneStore.length); // remove all scenes
	this.mCurrScene = null; // set current scene to null
}

// switches between scenes, handling any persistence
SceneManager.prototype.ChangeScene = function(newScene) {
	var found = false; // indicates if we have found a previously stored scene
	
	// if we have a current scene (i.e., this is not our initial scene change on game start up)
	if (this.mCurrScene != null) {
		// if this scene is to be persistent
		if (this.mCurrScene.Persistent() == true) {
			this.mSceneStore.push(this.mCurrScene); // store this scene
		}
		else {
			this.mCurrScene.TearDown(); // otherwise clean up and destroy this scene
		}
	}
	
	// for all currently stored (persistent) scenes
	for (var i = 0; i < this.mSceneStore.length; ++i) {
		// if we find a match
		if (this.mSceneStore[i].Type() == newScene.Type()) {
			this.mCurrScene = this.mSceneStore[i]; // restore the stored scene as our current scene
			this.mSceneStore.splice(i, i + 1); // remove it from the store
			found = true; // indicate we have found a persistent scene to restore
			break;
		}
	}
	
	// if we didn't find a scene to restore
	if (found == false) {
		this.mCurrScene = newScene; // create a new scene
		this.mCurrScene.SetUp(); // initialise our new scene
	}
}

// returns the current scene
SceneManager.prototype.GetCurrentScene = function() {
	return this.mCurrScene;
}
// ...End

