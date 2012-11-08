// Texture Class...
// a texture (wrapper for javascript Image)
function Texture() {
	this.mImg = new Image();
	this.mImg.mLoaded = "";
	
	this.mImg.onload = function() {
		this.mLoaded = "load";
	}
	
	this.mImg.onabort = function() {
		this.mLoaded = "abort";
	}
	
	this.mImg.onerror = function() {
		this.mLoaded = "error";
	}
};

// returns the type of this object for validity checking
Texture.prototype.Type = function() {
	return "Texture";
};

// loads a texture from a file
Texture.prototype.LoadFromFile = function(source) {
	this.mImg.mLoaded = "";
	this.mImg.src = source;
}
// ...End

