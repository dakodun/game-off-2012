// InitScene Class...
function InitScene() {
	this.persist = false;
	// this.resLoad = new ResourceLoader();
}

// returns the type of this object for validity checking
InitScene.prototype.Type = function() {
	return "InitScene";
};

// 
InitScene.prototype.Persistent = function() {
	return persist;
};

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

InitScene.prototype.TearDown = function() {
	
}

InitScene.prototype.Input = function() {
	
}

InitScene.prototype.Process = function() {
	
}

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

