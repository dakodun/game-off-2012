// SceneManager Class...
function SceneManager() {
	this.mCurrScene = null;
	this.mSceneStore = new Array();
}

SceneManager.prototype.SetUp = function() {
	
}

SceneManager.prototype.TearDown = function() {
	for (var i = 0; i < this.mSceneStore.length; ++i) {
		this.mSceneStore[i].TearDown();
	}
	
	this.mSceneStore.splice(0, this.mSceneStore.length);
	this.mCurrScene = NULL;
}

SceneManager.prototype.ChangeScene = function(newScene) {
	var found = false;
	
	if (this.mCurrScene != null) {
		if (this.mCurrScene.Persistent() == true) {
			this.mSceneStore.push(this.mCurrScene);
		}
		else {
			this.mCurrScene.TearDown();
		}
	}
	
	for (var i = 0; i < this.mSceneStore.length; ++i) {
		if (this.mSceneStore[i].Type() == newScene.Type()) {
			this.mCurrScene = this.mSceneStore[i];
			this.mSceneStore.splice(i, i + 1);
			found = true;
			break;
		}
	}
	
	if (found == false) {
		this.mCurrScene = newScene;
		this.mCurrScene.SetUp();
	}
}

SceneManager.prototype.GetCurrentScene = function() {
	return this.mCurrScene;
}
// ...End

