function ResourceSort(first, second) {
	return second.mResName < first.mResName;
};

// Resource Class...
function Resource(resource, resourceName) {
	this.mRes = resource;
	this.mResName = resourceName;
};
// ...End

// QueuedResource Class...
function QueuedResource(resourceName, resourceLocation) {
	this.mResName = resourceName;
	this.mResLocation = resourceLocation;
};
// ...End

