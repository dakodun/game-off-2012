// ResourceStore Class...
function ResourceStore() {
	this.mStore = new Array();
};

ResourceStore.prototype.AddResource = function(resource, resourceName) {
	// replace with a binary search
	
	for (var i = 0; i < this.mStore.length; ++i) {
		if (this.mStore[i].mResName == resourceName) {
			throw Exception("Resource already exists.");
		}
	}
	
	this.mStore.push(new Resource(resource, resourceName));
	this.mStore.sort(ResourceSort);
	
	return this.GetResource(resourceName);
};

ResourceStore.prototype.RemoveResource = function(resourceName) {
	// replace with a binary search
	
	for (var i = 0; i < this.mStore.length; ++i) {
		if (this.mStore[i].mResName == resourceName) {
			this.mStore.splice(i, i + 1);
		}
	}
	
	throw Exception("Resource doesn't exist.");
};

ResourceStore.prototype.GetResource = function(resourceName) {
	// replace with a binary search
	
	for (var i = 0; i < this.mStore.length; ++i) {
		if (this.mStore[i].mResName == resourceName) {
			return this.mStore[i];
		}
	}
	
	throw Exception("Resource not found.");
};
// ...End

