// Camera Class...
// a 2d camera (or a view) is a self contained affine transform
// todo: maintain a transform matrix for translation as well as rotation and scaling
function Camera() {
	this.mTranslate = new IVec2(0, 0); // current translation
}

// make a copy of another (other) camera (copy constructor)
Camera.prototype.Copy = function(other) {
	this.mTranslate.Copy(other.mTranslate); // call ivec2 copy (copy constructor)
}

// apply the camera's transform to the canvas
Camera.prototype.Apply = function() {
	nmain.game.mCurrContext.translate(-this.mTranslate.mX, -this.mTranslate.mY); // apply translation
}
// ...End

