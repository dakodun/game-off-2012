// Texture Class...
// a texture (wrapper for javascript Image)
function Texture() {
	this.img = new Image();
	this.loaded = false;
	
	this.img.onload = function() {
		this.loaded = true;
	}
	
	this.img.onabort = function() {
		this.loaded = true;
	}
	
	this.img.onerror = function() {
		this.loaded = true;
	}
};

// returns the type of this object for validity checking
Texture.prototype.Type = function() {
	return "Texture";
};

// loads a texture from a file
Texture.LoadFromFile = function(source) {
	this.loaded = false;
	this.img.src = source;
}
// ...End

