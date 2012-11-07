// InitScene Class...
function InitScene() {
	this.persist = false;
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
		var t = (nmgrs.resMan.mTexStore.AddResource(new Texture(), "test")).mRes;
		t.LoadFromFile("./res/vis/test.png");
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
	
	var tex = (nmgrs.resMan.mTexStore.GetResource("test")).mRes;
	
	// nmain.game.mContext.fillText("Hello", 50, 50);
	nmain.game.mContext.drawImage(tex.mImg, 0, 0);
	
}
// ...End

