// ResourceStore Class...
function ResourceLoader() {
	this.mTexQueue = new Array();
	
	this.mWorking = false;
	this.mIntervalID = null;
};

ResourceLoader.prototype.QueueTexture = function(texName, texLocation) {
	// replace with a binary search
	
	if (this.mWorking == true) {
		throw Exception("Resource loader already working.");
	}
	
	for (var i = 0; i < this.mTexQueue.length; ++i) {
		if (this.mTexQueue[i].mResName == texName) {
			throw Exception("Resource already exists.");
		}
	}
	
	this.mTexQueue.push(new QueuedResource(texName, texLocation));
	this.mTexQueue.sort(ResourceSort);
}

ResourceLoader.prototype.AcquireResources = function() {
	this.mWorking = true;
	
	for (var i = 0; i < this.mTexQueue.length; ++i) {
		var tex = nmgrs.resMan.mTexStore.AddResource(new Texture(), this.mTexQueue[i].mResName);
		tex.LoadFromFile(this.mTexQueue[i].mResLocation);
	}
}

ResourceLoader.prototype.ProgressCheck = function() {
	for (var i = 0; i < this.mTexQueue.length; ++i) {
		var tex = nmgrs.resMan.mTexStore.GetResource(this.mTexQueue[i].mResName);
		if (tex.mImg.mLoaded == "load" || tex.mImg.mLoaded == "abort" || tex.mImg.mLoaded == "error") {
			this.mTexQueue.splice(i, 1);
		}
	}
	
	if (this.mTexQueue.length == 0) {
		this.mWorking = false;
		clearInterval(this.mIntervalID);
	}
}
// ...End

