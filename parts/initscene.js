// InitScene Class...
function InitScene() {
	this.persist = false;
}

// returns the type of this object for validity checking
IVec2.prototype.Type = function() {
	return "InitScene";
};

// 
IVec2.prototype.Persistent = function() {
	return persist;
};

InitScene.prototype.SetUp = function() {
	alert("setting up scene");
}

InitScene.prototype.TearDown = function() {
	alert("tearing down scene");
}

InitScene.prototype.Input = function() {
	
}

InitScene.prototype.Process = function() {
	
}

InitScene.prototype.Render = function() {
	
}
// ...End

