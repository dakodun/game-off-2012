/* **************************************************************** **
**	
**	Copyright (c) 2012 Iain M. Crawford
**
**	This software is provided 'as-is', without any express or
**	implied warranty. In no event will the authors be held liable
**	for any damages arising from the use of this software.
**
**	Permission is granted to anyone to use this software for any
**	purpose, including commercial applications, and to alter it
**	and redistribute it freely, subject to the following
**	restrictions:
** 
**		1. The origin of this software must not be misrepresented;
**		   you must not claim that you wrote the original
**		   software. If you use this software in a product, an
**		   acknowledgment in the product documentation would be
**		   appreciated but is not required.
**
**		2. Altered source versions must be plainly marked as such,
**		   and must not be misrepresented as being the original
**		   software.
**
**		3. This notice may not be removed or altered from any
**		   source distribution.
** **************************************************************** */

// IVec2 Class...
// a 2d vector of integers
function IVec2(x, y) {
	this.mX = x; // x value of our 2d vector
	this.mY = y; // y value of our 2d vector
};

// returns the type of this object for validity checking
IVec2.prototype.Type = function() {
	return "IVec2";
};

// returns formatted output for this vector
IVec2.prototype.Output = function() {
	return "(" + this.mX + ", " + this.mY + ")";
};

// make a copy of another (other) ivec2 (copy constructor)
IVec2.prototype.Copy = function(other) {
	// copy x and y
	this.mX = other.mX;
	this.mY = other.mY;
};

// set the x and y components of the vector
IVec2.prototype.Set = function(x, y) {
	this.mX = x; // x value of our 2d vector
	this.mY = y; // y value of our 2d vector
};
// ...End


// FVec2 Class...
// a 2d vector of floats
function FVec2(x, y) {
	this.mX = x; // x value of our 2d vector
	this.mY = y; // y value of our 2d vector
};

// returns the type of this object for validity checking
FVec2.prototype.Type = function() {
	return "FVec2";
};

// returns formatted output for this vector
FVec2.prototype.Output = function() {
	return "(" + this.mX + ", " + this.mY + ")";
};

// make a copy of another (other) fvec2 (copy constructor)
FVec2.prototype.Copy = function(other) {
	// copy x and y
	this.mX = other.mX;
	this.mY = other.mY;
};

// set the x and y components of the vector
FVec2.prototype.Set = function(x, y) {
	this.mX = x; // x value of our 2d vector
	this.mY = y; // y value of our 2d vector
};
// ...End


// Exception Class...
// a custom exception
function Exception(what) {
	this.mWhat = what; // information about this exception
};

// returns information about this exception
Exception.prototype.What = function() {
	return this.mWhat;
};
// ...End


// enums...
var nkeyboard = {
	key : {
		code : {
			a		: 65,
			A		: 65,
			b		: 66,
			B		: 66,
			c		: 67,
			C		: 67,
			d		: 68,
			D		: 68,
			e		: 69,
			E		: 69,
			f		: 70,
			F		: 70,
			g		: 71,
			G		: 71,
			h		: 72,
			H		: 72,
			i		: 73,
			I		: 73,
			j		: 74,
			J		: 74,
			k		: 75,
			K		: 75,
			l		: 76,
			L		: 76,
			m		: 77,
			M		: 77,
			n		: 78,
			N		: 78,
			o		: 79,
			O		: 79,
			p		: 80,
			P		: 80,
			q		: 81,
			Q		: 81,
			r		: 82,
			R		: 82,
			s		: 83,
			S		: 83,
			t		: 84,
			T		: 84,
			u		: 85,
			U		: 85,
			v		: 86,
			V		: 86,
			w		: 87,
			W		: 87,
			x		: 88,
			X		: 88,
			y		: 89,
			Y		: 89,
			z		: 90,
			Z		: 90,
			
			num0	: 48,
			num1	: 49,
			num2	: 50,
			num3	: 51,
			num4	: 52,
			num5	: 53,
			num6	: 54,
			num7	: 55,
			num8	: 56,
			num9	: 57,
			
			left 	: 37,
			up 		: 38,
			right 	: 39,
			down 	: 40
		}
	}
};

var nmouse = {
	button : {
		code : {
			left 	: 0,
			middle 	: 1,
			down 	: 2
		}
	}
};
// ...End


// input callbacks...
// register our call back to handle key down (and pressed)
document.onkeydown = function(e) {
	nmgrs.inputMan.HandleKeyDown(e);
}

// register our call back to handle key up (and released)
document.onkeyup = function(e) {
	nmgrs.inputMan.HandleKeyUp(e);
}

// register our call back to handle mouse movement
document.onmousemove = function(e) {
	nmgrs.inputMan.HandleMouseMove(e);
}

// register our call back to handle button down (and pressed)
document.onmousedown = function(e) {
	nmgrs.inputMan.HandleMouseDown(e);
}

// register our call back to handle button up (and released)
document.onmouseup = function(e) {
	nmgrs.inputMan.HandleMouseUp(e);
}
// ...End

// InputManager Class...
// handles user input (kayboard and mouse)
function InputManager() {
	// the state of each key (up to 255)
	this.mKeyStates = new Array();
	for (var i = 0; i < 255; ++i) {
		this.mKeyStates[i] = 0;
	}
	
	// the state of each mouse button (left, right and middle)
	this.mButtonStates = new Array();
	for (var i = 0; i < 3; ++i) {
		this.mButtonStates[i] = 0;
	}
	
	this.mLocalMouseCoords = new IVec2(0, 0); // coordinates of the mouse in the canvas
	this.mGlobalMouseCoords = new IVec2(0, 0); // coordinates of the mouse in the page
}

// process the input manager (update key and button states)
InputManager.prototype.Process = function() {
	// update all key states
	for (var i = 0; i < 255; ++i) {
		if (this.mKeyStates[i] == 2) { // if key was pressed last frame
			this.mKeyStates[i] = 1; // it is now down
		}
		else if (this.mKeyStates[i] == 3) { // if key was released last frame
			this.mKeyStates[i] = 0; // it is now up
		}
	}
	
	// update all button states
	for (var i = 0; i < 3; ++i) {
		if (this.mButtonStates[i] == 2) { // if button was pressed last frame
			this.mButtonStates[i] = 1; // it is now down
		}
		else if (this.mButtonStates[i] == 3) { // if button was released last frame
			this.mButtonStates[i] = 0; // it is now up
		}
	}
}

// handle key down
InputManager.prototype.HandleKeyDown = function(e) {
	// if key was previously up
	if (this.mKeyStates[e.keyCode] == 0) {
		this.mKeyStates[e.keyCode] = 2; // key is now pressed (note: not down)
	}
}

// handle key up
InputManager.prototype.HandleKeyUp = function(e) {
	// if key was previously down
	if (this.mKeyStates[e.keyCode] == 1) {
		this.mKeyStates[e.keyCode] = 3; // key is now released (note: not up)
	}
}

// handle mouse movement
InputManager.prototype.HandleMouseMove = function(e) {
	{
		// get the local coordinates using the canvases position on the page
		this.mLocalMouseCoords.mX = e.pageX - nmain.game.mCanvasPos.mX;
		this.mLocalMouseCoords.mY = e.pageY - nmain.game.mCanvasPos.mY;
		
		// if mouse x is off the canvas then set it to the bounds
		if (this.mLocalMouseCoords.mX < 0) {
			this.mLocalMouseCoords.mX = 0;
		}
		else if (this.mLocalMouseCoords.mX > nmain.game.mCanvasSize.mX) {
			this.mLocalMouseCoords.mX = nmain.game.mCanvasSize.mX;
		}
		
		
		// if mouse y is off the canvas then set it to the bounds
		if (this.mLocalMouseCoords.mY < 0) {
			this.mLocalMouseCoords.mY = 0;
		}
		else if (this.mLocalMouseCoords.mY > nmain.game.mCanvasSize.mY) {
			this.mLocalMouseCoords.mY = nmain.game.mCanvasSize.mY;
		}
	}
	
	// set the global coordinates to mouses position on the page
	this.mGlobalMouseCoords.mX = e.pageX;
	this.mGlobalMouseCoords.mY = e.pageY;
}

// handle button down
InputManager.prototype.HandleMouseDown = function(e) {
	// if key was previously up
	if (this.mButtonStates[e.button] == 0) {
		this.mButtonStates[e.button] = 2; // key is now pressed (note: not down)
	}
}

// handle button up
InputManager.prototype.HandleMouseUp = function(e) {
	// if key was previously down
	if (this.mButtonStates[e.button] == 1) {
		this.mButtonStates[e.button] = 3; // key is now released (note: not up)
	}
}

// returns true if key is down (including pressed); if returning false then you can assume up or released (not down)
InputManager.prototype.GetKeyboardDown = function(key) {
	// if key is valid
	if (key >= 0 && key <= 255) {
		// if key state is down or pressed
		if (this.mKeyStates[key] == 1 || this.mKeyStates[key] == 2) {
			return true;
		}
	}
	
	return false;
}

// returns true if a key was pressed since last frame (for 1 frame only)
InputManager.prototype.GetKeyboardPressed = function(key) {
	// if key is valid
	if (key >= 0 && key <= 255) {
		// if key state is pressed
		if (this.mKeyStates[key] == 2) {
			return true;
		}
	}
	
	return false;
}

// returns true if a key was released since last frame (for 1 frame only)
InputManager.prototype.GetKeyboardReleased = function(key) {
	// if key is valid
	if (key >= 0 && key <= 255) {
		// if key state is released
		if (this.mKeyStates[key] == 3) {
			return true;
		}
	}
	
	return false;
}

// returns the coordinates of the mouse on the canvas
InputManager.prototype.GetLocalMouseCoords = function() {
	var ret = new IVec2();
	ret.Copy(this.mLocalMouseCoords); // get a copy of the local coordinates (copy constructor)
	return ret;
}

// returns the coordinates of the mouse on the page
InputManager.prototype.GetGlobalMouseCoords = function() {
	var ret = new IVec2();
	ret.Copy(this.mGlobalMouseCoords); // get a copy of the global coordinates (copy constructor)
	return ret;
}

// returns true if button is down (including pressed); if returning false then you can assume up or released (not down)
InputManager.prototype.GetMouseDown = function(button) {
	// if button is valid
	if (button >= 0 && button <= 2) {
		// if button state is down or pressed
		if (this.mButtonStates[button] == 1 || this.mButtonStates[button] == 2) {
			return true;
		}
	}
	
	return false;
}

// returns true if a button was pressed since last frame (for 1 frame only)
InputManager.prototype.GetMousePressed = function(button) {
	// if button is valid
	if (button >= 0 && button <= 2) {
		// if button state is pressed
		if (this.mButtonStates[button] == 2) {
			return true;
		}
	}
	
	return false;
}

// returns true if a button was released since last frame (for 1 frame only)
InputManager.prototype.GetMouseReleased = function(button) {
	// if button is valid
	if (button >= 0 && button <= 2) {
		// if button state is released
		if (this.mButtonStates[button] == 3) {
			return true;
		}
	}
	
	return false;
}
// ...End


// SceneManager Class...
// handles the creation and destruction of scenes, changing between scenes and storing and restoring persistent scenes
function SceneManager() {
	this.mCurrScene = null; // our current scene
	this.mSceneStore = new Array(); // all of our stored (persistent) scenes
}

// initialises the scene manager
SceneManager.prototype.SetUp = function() {
	
}

// cleans up the scene manager and all scenes currently stored
SceneManager.prototype.TearDown = function() {
	// for all currently stored scenes
	for (var i = 0; i < this.mSceneStore.length; ++i) {
		this.mSceneStore[i].TearDown(); // clean up
	}
	
	this.mSceneStore.splice(0, this.mSceneStore.length); // remove all scenes
	this.mCurrScene = null; // set current scene to null
}

// switches between scenes, handling any persistence
SceneManager.prototype.ChangeScene = function(newScene) {
	var found = false; // indicates if we have found a previously stored scene
	
	// if we have a current scene (i.e., this is not our initial scene change on game start up)
	if (this.mCurrScene != null) {
		// if this scene is to be persistent
		if (this.mCurrScene.Persistent() == true) {
			this.mSceneStore.push(this.mCurrScene); // store this scene
		}
		else {
			this.mCurrScene.TearDown(); // otherwise clean up and destroy this scene
		}
	}
	
	// for all currently stored (persistent) scenes
	for (var i = 0; i < this.mSceneStore.length; ++i) {
		// if we find a match
		if (this.mSceneStore[i].Type() == newScene.Type()) {
			this.mCurrScene = this.mSceneStore[i]; // restore the stored scene as our current scene
			this.mSceneStore.splice(i, i + 1); // remove it from the store
			found = true; // indicate we have found a persistent scene to restore
			break;
		}
	}
	
	// if we didn't find a scene to restore
	if (found == false) {
		this.mCurrScene = newScene; // create a new scene
		this.mCurrScene.SetUp(); // initialise our new scene
	}
}

// returns the current scene
SceneManager.prototype.GetCurrentScene = function() {
	return this.mCurrScene;
}
// ...End


// ResourceSort function
// sorts *Resource objects based on the resource name
function ResourceSort(first, second) {
	return second.mResName < first.mResName;
};
// ...End

// Resource Class...
// holds a resource and an associated name
function Resource(resource, resourceName) {
	this.mRes = resource; // our resource data
	this.mResName = resourceName; // the id of our resource (string)
};
// ...End

// QueuedResource Class...
// holds a resource name and the location of the resource
function QueuedResource(resourceName, resourceLocation) {
	this.mResName = resourceName; // the id of our resource (string)
	this.mResLocation = resourceLocation; // the location of our resource on disk
};
// ...End


// ResourceStore Class...
// holds a specific type of resource and handles loading, retrieving and destruction
function ResourceStore() {
	this.mStore = new Array(); // our stored resources
};

// creates a resource and adds it to our store, returning a handle to it
ResourceStore.prototype.AddResource = function(resource, resourceName) {
	// replace with a binary search; queue already sorted, use more efficient insert
	
	// for all our stored resources
	for (var i = 0; i < this.mStore.length; ++i) {
		// if we find a match to the one we are trying to add then error
		if (this.mStore[i].mResName == resourceName) {
			throw Exception("Resource already exists.");
		}
	}
	
	this.mStore.push(new Resource(resource, resourceName)); // add to the store
	this.mStore.sort(ResourceSort); // sort the store
	
	return this.GetResource(resourceName); // return our new resource
};

// removes a resource from the store, cleaning up after it
ResourceStore.prototype.RemoveResource = function(resourceName) {
	// replace with a binary search
	
	// for all our stored resources
	for (var i = 0; i < this.mStore.length; ++i) {
		// if we find a match to the one we are trying to remove
		if (this.mStore[i].mResName == resourceName) {
			this.mStore[i].TearDown(); // perform cleanup
			this.mStore.splice(i, i + 1); // remove it from the store
		}
	}
	
	// otherwise error
	throw Exception("Resource doesn't exist.");
};

// returns a handle to a stored resource if found
ResourceStore.prototype.GetResource = function(resourceName) {
	// replace with a binary search
	
	// for all our stored resources
	for (var i = 0; i < this.mStore.length; ++i) {
		// if we find a match to the one we are trying to retrieve
		if (this.mStore[i].mResName == resourceName) {
			return this.mStore[i].mRes; // return it
		}
	}
	
	// otherwise error
	throw Exception("Resource not found.");
};
// ...End


// ResourceStore Class...
// handles the loading of a batch of asynchronous resources such as images or sounds
function ResourceLoader() {
	this.mTexQueue = new Array(); // the queue of unprocessed resources
	
	this.mWorking = false; // indicates if our resourceloader is currently working
	this.mIntervalID = null; // the handle of the interval that is checking the state of the resources
};

// adds a texture to the queue for future processing
ResourceLoader.prototype.QueueTexture = function(texName, texLocation) {
	// replace with a binary search; queue already sorted, use more efficient insert
	
	// if we are currently processing resources then error
	if (this.mWorking == true) {
		throw Exception("Resource loader already working.");
	}
	
	// for all textures in the queue
	for (var i = 0; i < this.mTexQueue.length; ++i) {
		// if we find a match to the one we are trying to add then error
		if (this.mTexQueue[i].mResName == texName) {
			throw Exception("Resource already exists.");
		}
	}
	
	this.mTexQueue.push(new QueuedResource(texName, texLocation)); // add to the queue
	this.mTexQueue.sort(ResourceSort); // sort the queue
}

// processes all resources currently in the queue
ResourceLoader.prototype.AcquireResources = function() {
	this.mWorking = true; // indicate we are currently working
	
	// for all textures in the queue
	for (var i = 0; i < this.mTexQueue.length; ++i) {
		// add texture to resource manager and load the associated image
		var tex = nmgrs.resMan.mTexStore.AddResource(new Texture(), this.mTexQueue[i].mResName);
		tex.LoadFromFile(this.mTexQueue[i].mResLocation);
	}
}

// periodically checks the progress of our resource loader
ResourceLoader.prototype.ProgressCheck = function() {
	// if we are currently working (otherwise no progress will be made)
	if (this.mWorking == true) {
		// for all textures in the queue
		for (var i = 0; i < this.mTexQueue.length; ++i) {
			// check if the texture has finished loading, whether or not it was successful
			var tex = nmgrs.resMan.mTexStore.GetResource(this.mTexQueue[i].mResName);
			if (tex.mImg.mLoaded == "load" || tex.mImg.mLoaded == "abort" || tex.mImg.mLoaded == "error") {
				if (tex.mImg.mLoaded == "abort" || tex.mImg.mLoaded == "error") {
					alert("Texture failed to load: " + tex.mImg.mLoaded);
				}
				
				this.mTexQueue.splice(i, 1); // remove the texture from the unprocessed queue
			}
		}
		
		// if our unprocessed queue is now empty
		if (this.mTexQueue.length == 0) {
			this.mWorking = false; // we are finished working
			clearInterval(this.mIntervalID); // stop checking for progress
			this.mIntervalID = null; // clear interval handle
		}
	}
	else {
		// if called by an interval
		if (this.mIntervalID != null) {
			clearInterval(this.mIntervalID); // function called in error, stop future calls
			this.mIntervalID = null; // clear interval handle
		}
	}
}
// ...End


// ResourceManager Class...
// holds the resource stores for each individual resource type
function ResourceManager() {
	this.mTexStore = new ResourceStore(); // storage for our textures
};
// ...End


// Texture Class...
// a texture (wrapper for javascript Image)
function Texture() {
	this.mImg = new Image(); // the image associated with our texture
	this.mImg.mLoaded = ""; // the load status of our image
	
	// called when the image successfully loads
	this.mImg.onload = function() {
		this.mLoaded = "load";
	}
	
	// called when the image loading is cancelled
	this.mImg.onabort = function() {
		this.mLoaded = "abort";
	}
	
	// called when the image fails to load
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
	this.mImg.mLoaded = ""; // reset our loading status to blank
	this.mImg.src = source; // attempt to load our image
}
// ...End


// Text Class...
// renderable text
function Text() {
	this.mFont = "12px Arial";
	this.mFontSize = "12";
	this.mFontName = "Arial";
	
	this.mString = "";
	this.mColour = "#FFFFFF";
	this.mDepth = 0;
	
	this.mPos = new IVec2(0, 12);
	this.mOutline = false;
	this.mRotation = 0;
	this.mHeight = 12;
}

// returns the type of this object for validity checking
Text.prototype.Type = function() {
	return "Text";
}

// make a copy of another (other) text (copy constructor)
Text.prototype.Copy = function(other) {
	this.mFont = other.mFont;
	this.mFontSize = other.mFontSize;
	this.mFontName = other.mFontName;
	
	this.mString = other.mString;
	this.mColour = other.mColour;
	this.mDepth = other.mDepth;
	
	this.mPos.Copy(other.mPos);
	this.mOutline = other.mOutline;
	this.mRotation = other.mRotation;
	this.mHeight = other.mHeight;
}

// return the width of the text
Text.prototype.GetWidth = function() {
	nmain.game.mCurrContext.font = this.mFont;
	
	var txtArr = this.mString.split("\n");
	var longest = 0;
	for (var i = 0; i < txtArr.length; ++i) {
		var strLen = nmain.game.mCurrContext.measureText(txtArr[i]).width;
		if (strLen > longest) {
			longest = strLen;
		}
	}
	
	return strLen;
}

// return the height of the text
Text.prototype.GetHeight = function() {
	return this.mHeight;
}

// 
Text.prototype.SetFontSize = function(size) {
	this.mFontSize = size.toString();
	this.mFont = this.mFontSize + "px " + this.mFontName;
	this.mHeight = size;
}

// 
Text.prototype.SetFontName = function(name) {
	this.mFontName = name;
	this.mFont = this.mFontSize + " " + this.mFontName;
}
// ...End


// Shape Class...
//
function Shape() {
	this.mDepth = 0;
	
	this.mColour = "#FFFFFF";
	this.mAlpha = 1.0;
	
	this.mPos = new IVec2(0, 0);
	this.mOrigin = new IVec2(0, 0);
	
	this.mPoints = new Array();
};

// returns the type of this object for validity checking
Shape.prototype.Type = function() {
	return "Shape";
}

// make a copy of another (other) shape (copy constructor)
Shape.prototype.Copy = function(other) {
	this.mDepth = other.mDepth;
	
	this.mColour = other.mColour;
	this.mAlpha = other.mAlpha;
	
	this.mPos.Copy(other.mPos);
	this.mOrigin.Copy(other.mOrigin);
	
	this.mPoints = other.mPoints;
}

// 
Shape.prototype.Reset = function() {
	this.mPoints.splice(0, this.mPoints.length);
}

// 
Shape.prototype.AddPoint = function(point) {
	var pt = new IVec2();
	pt.Copy(point);
	this.mPoints.push(pt);
}

// 
Shape.prototype.GetPosition = function() {
	var pos = new IVec2();
	pos.Set(this.mPos.mX - this.mOrigin.mX, this.mPos.mY - this.mOrigin.mY);
	return pos;
}
// ...End


// Sprite Class...
// a sprite (representation of an image)
function Sprite() {
	this.mTex = null;
	this.mDepth = 0;
	
	this.mPos = new IVec2(0, 0);
	this.mClipPos = new IVec2(0, 0);
	this.mClipSize = new IVec2(0, 0);
	this.mScale = new FVec2(1.0, 1.0);
	this.mOrigin = new IVec2(0, 0);
	this.mRotation = 0;
	
	this.mNumFrames = 0;
	this.mFramesPerLine = 0;
	this.mCurrFrame = 0;
	this.mStartFrame = 0;
	this.mEndFrame = 0;
	this.mAnimSpeed = 0;
	this.mIsAnimated = false;
	this.mNumLoops = 0;
	
	this.mAnimTimer = new Timer();
	this.mAnimTimer.Reset();
};

// returns the type of this object for validity checking
Sprite.prototype.Type = function() {
	return "Sprite";
}

// initialises the sprite
Sprite.prototype.SetUp = function() {
	
}

// cleans up the sprite
Sprite.prototype.TearDown = function() {
	
}

// make a copy of another (other) sprite (copy constructor)
Sprite.prototype.Copy = function(other) {
	this.mTex = other.mTex ;
	this.mDepth = other.mDepth;
	
	this.mPos.Copy(other.mPos);
	this.mClipPos.Copy(other.mClipPos);
	this.mClipSize.Copy(other.mClipSize);
	this.mScale.Copy(other.mScale);
	this.mOrigin.Copy(other.mOrigin);
	this.mRotation = other.mRotation;
	
	this.mNumFrames = other.mNumFrames;
	this.mFramesPerLine = other.mFramesPerLine;
	this.mCurrFrame = other.mCurrFrame;
	this.mStartFrame = other.mStartFrame;
	this.mEndFrame = other.mEndFrame;
	this.mAnimSpeed = other.mAnimSpeed;
	this.mIsAnimated = other.mIsAnimated;
	this.mNumLoops = other.mNumLoops;
	
	this.mAnimTimer.Copy(other.mAnimTimer);
}

// process the sprite (for animation)
Sprite.prototype.Process = function() {
	if (this.mIsAnimated) {
		if (this.mAnimSpeed >= 0) {
			if (this.mAnimTimer.GetElapsedTime() > this.mAnimSpeed) {
				this.mAnimTimer.Reset();
				this.mCurrFrame = (this.mCurrFrame + 1) % (this.mEndFrame + 1);
				if (this.mCurrFrame < this.mStartFrame) {
					this.mCurrFrame = this.mStartFrame;
				}
				
				if (this.mCurrFrame == this.mStartFrame && this.mNumLoops > 0) {
					this.mNumLoops -= 1;
				}
				
				if (this.mNumLoops == 0) {
					this.mAnimSpeed = -1;
					this.mCurrFrame = this.mEndFrame;
				}
				
				var rectX = (this.mCurrFrame % this.mFramesPerLine) * this.mClipSize.mX;
				var rectY = (Math.floor(this.mCurrFrame / this.mFramesPerLine)) * this.mClipSize.mY;
				var rectW = this.mClipSize.mX;
				var rectH = this.mClipSize.mY;
				
				this.SetClipRect(new IVec2(rectX, rectY), new IVec2(rectW, rectH));
			}
		}
	}
}

// set the static texture
Sprite.prototype.SetTexture = function(texture) {
	this.mTex = texture;
	
	this.SetClipRect(new IVec2(0, 0), new IVec2(this.mTex.mImg.width, this.mTex.mImg.height));
	
	this.mNumFrames = 1;
	this.mFramesPerLine = 0;
	this.mCurrFrame = 0;
	this.mStartFrame = 0;
	this.mEndFrame = 0;
	this.mAnimSpeed = 0;
	this.mIsAnimated = false;
	this.mNumLoops = -1;
	
	this.mScale.mX = 1.0;
	this.mScale.mY = 1.0;
	
	this.mAnimTimer.Reset();
}

// set the animated texture
Sprite.prototype.SetAnimatedTexture = function(texture, numFrames, framesPerLine, animSpeed, loops) {
	this.mTex = texture;
	
	this.SetClipRect(new IVec2(0, 0), new IVec2(this.mTex.mImg.width / framesPerLine,
			this.mTex.mImg.height / (Math.ceil(numFrames / framesPerLine))));
	
	this.mNumFrames = numFrames;
	this.mFramesPerLine = framesPerLine;
	this.mCurrFrame = 0;
	this.mStartFrame = 0;
	this.mEndFrame = numFrames - 1;
	this.mAnimSpeed = animSpeed;
	this.mIsAnimated = true;
	this.mNumLoops = -1;
	
	if (loops) {
		this.mNumLoops = loops;
	}
	
	this.mScale.mX = 1.0;
	this.mScale.mY = 1.0;
	
	this.mAnimTimer.Reset();
}

// set the animated texture segment (start and end frames capped)
Sprite.prototype.SetAnimatedTextureSegment = function(texture, numFrames, framesPerLine, animSpeed, startFrame, endFrame, loops) {
	this.mTex = texture;
	
	this.SetClipRect(new IVec2(0, 0), new IVec2(this.mTex.mImg.width / framesPerLine,
			this.mTex.mImg.height / (Math.ceil(numFrames / framesPerLine))));
	
	this.mNumFrames = numFrames;
	this.mFramesPerLine = framesPerLine;
	this.mCurrFrame = startFrame;
	this.mStartFrame = startFrame;
	this.mEndFrame = endFrame;
	this.mAnimSpeed = animSpeed;
	this.mIsAnimated = true;
	this.mNumLoops = -1;
	
	if (loops) {
		this.mNumLoops = loops;
	}
	
	this.mScale.mX = 1.0;
	this.mScale.mY = 1.0;
	
	this.mAnimTimer.Reset();
	
	var rectX = (this.mCurrFrame % this.mFramesPerLine) * this.mClipSize.mX;
	var rectY = (Math.floor(this.mCurrFrame / this.mFramesPerLine)) * this.mClipSize.mY;
	var rectW = this.mClipSize.mX;
	var rectH = this.mClipSize.mY;
	
	this.SetClipRect(new IVec2(rectX, rectY), new IVec2(rectW, rectH));
}

// set the clipping rectangle
Sprite.prototype.SetClipRect = function(pos, size) {
	this.mClipPos.mX = pos.mX;
	this.mClipPos.mY = pos.mY;
	
	this.mClipSize.mX = size.mX;
	this.mClipSize.mY = size.mY;
}

// set the current frame
Sprite.prototype.SetCurrentFrame = function(frame) {
	if (this.mIsAnimated) {
		this.mAnimTimer.Reset();
		this.mCurrFrame = frame % (this.mEndFrame + 1);
		if (this.mCurrFrame < this.mStartFrame) {
			this.mCurrFrame = this.mStartFrame;
		}
		
		var rectX = (this.mCurrFrame % this.mFramesPerLine) * this.mClipSize.mX;
		var rectY = (Math.floor(this.mCurrFrame / this.mFramesPerLine)) * this.mClipSize.mY;
		var rectW = this.mClipSize.mX;
		var rectH = this.mClipSize.mY;
		
		this.SetClipRect(new IVec2(rectX, rectY), new IVec2(rectW, rectH));
	}
}

// set the position of sprite
Sprite.prototype.GetPosition = function() {
	var iv = new IVec2(0, 0);
	iv.mX = this.mPos.mX - this.mOrigin.mX; iv.mY = this.mPos.mY - this.mOrigin.mY;
	
	return iv;
}
// ...End


// DepthSort function
// sorts renderable resources based on depth
function DepthSort(first, second) {
	return first.mDepth < second.mDepth;
};
// ...End

// RenderBatch Class...
// a render batch handles all drawing operations and draws according to depth (z) values
function RenderBatch() {
	this.mRenderData = new Array();
	
	this.mNeedSort = false;
}

// initialise the render batch
RenderBatch.prototype.SetUp = function() {
	
}

// clean up the render batch
RenderBatch.prototype.TearDown = function() {
	
}

// add a sprite to the render batch
RenderBatch.prototype.AddSprite = function(sprite) {
	this.mNeedSort = true;
	var spr = new Sprite();
	spr.Copy(sprite);
	
	this.mRenderData.push(spr);
	// this.mRenderData.sort(DepthSort); // sort the queue
}

// add renderable text to the render batch
RenderBatch.prototype.AddText = function(text) {
	this.mNeedSort = true;
	var txt = new Text();
	txt.Copy(text);
	
	this.mRenderData.push(txt);
	// this.mRenderData.sort(DepthSort); // sort the queue
}

// add renderable shape to the render batch
RenderBatch.prototype.AddShape = function(shape) {
	this.mNeedSort = true;
	var shp = new Shape();
	shp.Copy(shape);
	
	this.mRenderData.push(shp);
	// this.mRenderData.sort(DepthSort); // sort the queue
}

// clear the render batch
RenderBatch.prototype.Clear = function() {
	this.mRenderData.splice(0, this.mRenderData.length);
}

// render the render batch to the context
RenderBatch.prototype.Render = function(camera) {
	var cam = new Camera();
	if (camera) {
		cam.Copy(camera);
	}
	
	if	(this.mNeedSort == true) {
		this.mRenderData.sort(DepthSort); // sort the queue
		this.mNeedSort = false;
	}
	
	for (var i = 0; i < this.mRenderData.length; ++i) {
		nmain.game.mCurrContext.save();
		
		if (this.mRenderData[i].Type() == "Sprite") {
			var spr = this.mRenderData[i];
			var w = spr.mTex.mImg.width;
			var h = spr.mTex.mImg.height;
			
			if (spr.mIsAnimated == true) {
				w = spr.mClipSize.mX;
				h = spr.mClipSize.mY;
			}
			
			var scrTL = new IVec2(0 + cam.mTranslate.mX, 0 + cam.mTranslate.mY);
			var scrBR = new IVec2(nmain.game.mCanvasSize.mX + cam.mTranslate.mX,
					nmain.game.mCanvasSize.mY + cam.mTranslate.mY);
			
			
			if ((spr.mPos.mX < scrBR.mX && (spr.mPos.mX + w) > scrTL.mX) &&
					(spr.mPos.mY < scrBR.mY && (spr.mPos.mY + h) > scrTL.mY)) {
				
				
				nmain.game.mCurrContext.translate(spr.GetPosition().mX, spr.GetPosition().mY);
				nmain.game.mCurrContext.rotate(spr.mRotation * (Math.PI / 180));
				
				nmain.game.mCurrContext.drawImage(spr.mTex.mImg, spr.mClipPos.mX, spr.mClipPos.mY,
						spr.mClipSize.mX, spr.mClipSize.mY, 0, 0,
						w * spr.mScale.mX, h * spr.mScale.mY);
			}
		}
		else if (this.mRenderData[i].Type() == "Text") {
			var txt = this.mRenderData[i];
			var txtArr = txt.mString.split("\n");
			
			nmain.game.mCurrContext.font = txt.mFont;
			nmain.game.mCurrContext.fillStyle = txt.mColour;
			
			var w = txt.GetWidth();
			var h = txt.GetHeight();
			
			var scrTL = new IVec2(0 + cam.mTranslate.mX, 0 + cam.mTranslate.mY);
			var scrBR = new IVec2(nmain.game.mCanvasSize.mX + cam.mTranslate.mX,
					nmain.game.mCanvasSize.mY + cam.mTranslate.mY);
			
			
			if ((txt.mPos.mX < scrBR.mX && (txt.mPos.mX + w) > scrTL.mX) &&
					(txt.mPos.mY < scrBR.mY && (txt.mPos.mY + h) > scrTL.mY)) {
				
				nmain.game.mCurrContext.translate(txt.mPos.mX, txt.mPos.mY);
				nmain.game.mCurrContext.rotate(txt.mRotation * (Math.PI / 180));
				
				if (txt.mOutline == true) {
					for (var j = 0; j < txtArr.length; ++j) {
						nmain.game.mCurrContext.strokeText(txtArr[j], 0, txt.mHeight * j);
					}
				}
				else {
					for (var j = 0; j < txtArr.length; ++j) {
						nmain.game.mCurrContext.fillText(txtArr[j], 0, txt.mHeight * j);
					}
				}
			}
		}
		else if (this.mRenderData[i].Type() == "Shape") {
			var shp = this.mRenderData[i];
			var pos = shp.GetPosition();
			
			nmain.game.mCurrContext.fillStyle = shp.mColour;
			var oldAlpha = nmain.game.mCurrContext.globalAlpha;
			nmain.game.mCurrContext.globalAlpha = shp.mAlpha;
			
			nmain.game.mCurrContext.beginPath();
			nmain.game.mCurrContext.moveTo(pos.mX, pos.mY);
			
			for (var j = 0; j < shp.mPoints.length; ++j) {
				var pt = new IVec2();
				pt.Copy(shp.mPoints[j]);
				nmain.game.mCurrContext.lineTo(pos.mX + pt.mX, pos.mY + pt.mY);
			}
			
			nmain.game.mCurrContext.closePath();
			nmain.game.mCurrContext.fill();
			
			nmain.game.mCurrContext.globalAlpha = oldAlpha;
		}
		
		nmain.game.mCurrContext.restore();
	}
}

// ...End


// RNG Class...
// a pseudo-random number generator
function RNG(seed) {
	this.mMers = new MersenneTwister(seed); // a reference to a mersenne twister (see mersenne-twister.js)
	this.mSeed = seed; // the current seed
};

// set the seed and seed the rng with it
RNG.prototype.SetSeed = function(seed) {
	this.mSeed = seed;
	this.mMers.init_genrand(seed);
};

// return the current seed
RNG.prototype.GetSeed = function() {
	return this.mSeed;
};

// get a random integer between lower and higher (inclusive)
RNG.prototype.GetRandInt = function(lower, higher) {
	return (this.mMers.genrand_int32() % ((higher + 1) - lower)) + lower;
};

// get a random float between lower and higher (inclusive) with precision (number of decimal places)
RNG.prototype.GetRandFloat = function(lower, higher, precision) {
	var l = lower * Math.pow(10, precision);
	var h = higher * Math.pow(10, precision);
	
	var f = this.GetRandInt(l, h);
	f /=  Math.pow(10.0, precision);
	return f;
};
// ...End


// Timer Class...
// a timer; keeps time
function Timer() {
	this.startTime = 0; // the time that this timer was started
	
	this.Reset(); // initially reset our timer
};

// resets the timer (sets it to the current time)
Timer.prototype.Reset = function() {
	var d = new Date();
	this.startTime = d.getTime(); // set the start time to the current time
};

// get the time that has passed since our last reset
Timer.prototype.GetElapsedTime = function() {
	var d = new Date();
	return d.getTime() - this.startTime; // return how much time has elapsed since last call to reset
};

// make a copy of another (other) timer (copy constructor)
Timer.prototype.Copy = function(other) {
	this.startTime = other.startTime;
}
// ...End


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


// InitScene Class...
// self contained parts of the game such as different screens, levels or game modes
function InitScene() {
	this.mPersist = false;
}

// returns the type of this object for validity checking
InitScene.prototype.Type = function() {
	return "InitScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
InitScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
InitScene.prototype.SetUp = function() {
	try {
		// load the textures we need
		nmgrs.resLoad.QueueTexture("tile_set_default", "./res/vis/tile_set_default.png");
		nmgrs.resLoad.QueueTexture("turn_1", "./res/vis/turn_1.png");
		nmgrs.resLoad.QueueTexture("turn_2", "./res/vis/turn_2.png");
		nmgrs.resLoad.QueueTexture("gui_arrow_up", "./res/vis/gui_arrow_up.png");
		nmgrs.resLoad.QueueTexture("gui_arrow_down", "./res/vis/gui_arrow_down.png");
		nmgrs.resLoad.AcquireResources();
		nmgrs.resLoad.mIntervalID = setInterval(function() {nmgrs.resLoad.ProgressCheck();}, 0);
	} catch(e) {
		alert(e.What());
	}
}

// cleans up the scene object
InitScene.prototype.TearDown = function() {
	
}

// handles user input
InitScene.prototype.Input = function() {
	
}

// handles game logic
InitScene.prototype.Process = function() {
	if (nmgrs.resLoad.mWorking == false) {
		nmgrs.sceneMan.ChangeScene(new TestScene());
	}
}

// handles all drawing tasks
InitScene.prototype.Render = function() {
	
}
// ...End


// TestScene Class...
// self contained parts of the game such as different screens, levels or game modes
function TestScene() {
	this.mPersist = false;
	
	this.mMapBatch = new RenderBatch();
	this.mMap = new GFMap();
	
	this.mCam = new Camera();
	
	this.mCanScroll = false;
	this.mArrowUpSprite = new Sprite();
	this.mArrowDownSprite = new Sprite();
	
	this.mTurn = 0;
	this.mTurnSprite = new Sprite();
	this.mDynamicUIBatch = new RenderBatch();
	this.mEndPlayerTurn = 0;
	this.mEndPlayerTurnTimer = new Timer();
	
	this.mControlsText = new Text();
	this.mControlsBack = new Shape();
	this.mEndTurnTapText = new Text();
	this.mEndTurnTapBack = new Shape();
}

// returns the type of this object for validity checking
TestScene.prototype.Type = function() {
	return "TestScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
TestScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
TestScene.prototype.SetUp = function() {
	nmain.game.mClearColour = "#604039";
	
	var d = new Date();
	
	var mapGen = new GFMapGen();
	this.mMap = mapGen.GenerateMap(d.getTime(), "b", "b");
	
	for (var x = 0; x < this.mMap.mMapSize.mX; ++x) {
		for (var y = 0; y < this.mMap.mMapSize.mY; ++y) {
			var ind = x + (this.mMap.mMapSize.mX * y);
			this.mMapBatch.AddSprite(this.mMap.mMapTiles[ind].mSprite);
		}
	}
	
	this.mCam.mTranslate.Set(0 - ((nmain.game.mCanvasSize.mX - (this.mMap.mMapSize.mX * 32)) / 2),
			0 - ((nmain.game.mCanvasSize.mY - (this.mMap.mMapSize.mY * 32)) / 2));
	
	if (nmain.game.mCanvasSize.mY < this.mMap.mMapSize.mY * 32) {
		this.mCanScroll = true;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("turn_2");
		this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 30, 1);
		this.mTurnSprite.mPos.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY);
		this.mTurnSprite.mDepth = -1000;
		this.mTurn = 3;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arrow_up");
		this.mArrowUpSprite.SetAnimatedTexture(tex, 16, 5, 30, -1);
		this.mArrowUpSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY);
		this.mArrowUpSprite.mDepth = -1000;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arrow_down");
		this.mArrowDownSprite.SetAnimatedTexture(tex, 16, 5, 30, -1);
		this.mArrowDownSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mArrowDownSprite.mDepth = -1000;
	}
	
	{
		this.mControlsText.mString = "Up and Down Arrow to scroll.\nDouble-tap E to end your turn.";
		this.mControlsText.mDepth = -1000;
		this.mControlsText.mPos.Set(this.mCam.mTranslate.mX + 4, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.mHeight - 5);
		
		this.mControlsBack.mColour = "#000000";
		this.mControlsBack.mDepth = -999;
		this.mControlsBack.mAlpha = 0.75;
		this.mControlsBack.mPos.Set(this.mCam.mTranslate.mX + 2, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - (this.mControlsText.mHeight * 2) - 4);
		
		var textWidth = this.mControlsText.GetWidth();
		var textHeight = this.mControlsText.GetHeight() * 2;
		this.mControlsBack.AddPoint(new IVec2(textWidth + 4, 0));
		this.mControlsBack.AddPoint(new IVec2(textWidth + 4, textHeight + 2));
		this.mControlsBack.AddPoint(new IVec2(0, textHeight + 2));
	}
	
	{
		this.mEndTurnTapText.SetFontSize(36);
		
		this.mEndTurnTapText.mString = "Press E again to confirm!";
		this.mEndTurnTapText.mDepth = -2000;
		this.mEndTurnTapText.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + this.mEndTurnTapText.GetHeight() + 10);
		
		this.mEndTurnTapBack.mColour = "#000000";
		this.mEndTurnTapBack.mDepth = -1999;
		this.mEndTurnTapBack.mAlpha = 0.75;
		this.mEndTurnTapBack.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + 17);
		
		var textWidth = this.mEndTurnTapText.GetWidth();
		var textHeight = this.mEndTurnTapText.GetHeight();
		this.mEndTurnTapBack.AddPoint(new IVec2(textWidth, 0));
		this.mEndTurnTapBack.AddPoint(new IVec2(textWidth, textHeight + 2));
		this.mEndTurnTapBack.AddPoint(new IVec2(0, textHeight + 2));
	}
}

// cleans up the scene object
TestScene.prototype.TearDown = function() {
	
}

// handles user input
TestScene.prototype.Input = function() {
	if (this.mTurn == 1) {
		if (this.mCanScroll == true) {
			if (this.mCam.mTranslate.mY > -24) {
				if (nmgrs.inputMan.GetKeyboardDown(nkeyboard.key.code.up)) {
					this.mCam.mTranslate.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY - 1);
					
					this.mTurnSprite.mPos.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY);
					this.mArrowUpSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY);
					this.mArrowDownSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
					
					this.mControlsText.mPos.Set(this.mCam.mTranslate.mX + 4, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.mHeight - 5);
					this.mControlsBack.mPos.Set(this.mCam.mTranslate.mX + 2, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - (this.mControlsText.mHeight * 2) - 4);
					this.mEndTurnTapText.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + this.mEndTurnTapText.GetHeight() + 10);
					this.mEndTurnTapBack.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + 17);
				}
			}
			
			if (this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY < (this.mMap.mMapSize.mY * 32) + 24) {
				if (nmgrs.inputMan.GetKeyboardDown(nkeyboard.key.code.down)) {
					this.mCam.mTranslate.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY + 1);
					
					this.mTurnSprite.mPos.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY);
					this.mArrowUpSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY);
					this.mArrowDownSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
					
					this.mControlsText.mPos.Set(this.mCam.mTranslate.mX + 4, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.mHeight - 5);
					this.mControlsBack.mPos.Set(this.mCam.mTranslate.mX + 2, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - (this.mControlsText.mHeight * 2) - 4);
					this.mEndTurnTapText.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + this.mEndTurnTapText.GetHeight() + 10);
					this.mEndTurnTapBack.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + 17);
				}
			}
		}
		
		if (nmgrs.inputMan.GetKeyboardPressed(nkeyboard.key.code.e)) {
			if (this.mEndPlayerTurn == 0) {
				this.mEndPlayerTurn = 1;
				this.mEndPlayerTurnTimer.Reset();
			}
			else {
				this.mEndPlayerTurn = 0;
				this.mTurn = 2;
				
				var tex = nmgrs.resMan.mTexStore.GetResource("turn_1");
				this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 30, 1);
			}
		}
	}
}

// handles game logic
TestScene.prototype.Process = function() {
	if (this.mTurn == 0) {
		// alert("process ai turn");
		this.mTurn = 3;
		
		var tex = nmgrs.resMan.mTexStore.GetResource("turn_2");
		this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 30, 1);
	}
	else if (this.mTurn == 1) {
		if (this.mEndPlayerTurn == 1) {
			if (this.mEndPlayerTurnTimer.GetElapsedTime() >= 1000) {
				this.mEndPlayerTurn = 0;
			}
		}
	}
	else if (this.mTurn == 2) {
		this.mTurnSprite.Process();
		if (this.mTurnSprite.mNumLoops == 0) {
			this.mTurnSprite.mAnimSpeed = -1;
			this.mTurnSprite.SetCurrentFrame(0);
			this.mTurn = 0;
		}
	}
	else if (this.mTurn == 3) {
		this.mTurnSprite.Process();
		if (this.mTurnSprite.mNumLoops == 0) {
			this.mTurnSprite.mAnimSpeed = -1;
			this.mTurnSprite.SetCurrentFrame(0);
			this.mTurn = 1;
		}
	}
	
	this.mArrowUpSprite.Process();
	this.mArrowDownSprite.Process();
}

// handles all drawing tasks
TestScene.prototype.Render = function() {
	nmain.game.SetIdentity();
	this.mCam.Apply();
	
	this.mMapBatch.Render(this.mCam);
	
	{
		this.mDynamicUIBatch.Clear();
		this.mDynamicUIBatch.AddSprite(this.mTurnSprite);
		
		if (this.mTurn == 1) {
			if (this.mCam.mTranslate.mY > -24) {
				this.mDynamicUIBatch.AddSprite(this.mArrowUpSprite);
			}
			
			if (this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY < (this.mMap.mMapSize.mY * 32) + 24) {
				this.mDynamicUIBatch.AddSprite(this.mArrowDownSprite);
			}
		}
		
		
		this.mDynamicUIBatch.AddShape(this.mControlsBack);
		this.mDynamicUIBatch.AddText(this.mControlsText);
		
		if (this.mEndPlayerTurn == 1) {
			this.mDynamicUIBatch.AddShape(this.mEndTurnTapBack);
			this.mDynamicUIBatch.AddText(this.mEndTurnTapText);
		}
		
		this.mDynamicUIBatch.Render(this.mCam);
	}
}
// ...End


// Game Class...
// a game object contains all the logic and data of our game
function Game() {
	this.mGameLoop = null; // handle to the setInterval that runs our loop code
	this.mFrameLimit = 60; // the maximum frames per second
	this.mAccum = 0.0; // the current frame time accumulator
	this.mTimer = new Timer(); // the timer that handles our main loop timing
	this.mClearColour = "#000000"; // the clear colour i.e., background colour of the canvas
	
	this.mCanvas = new Array(); // an array of our canvases 
	this.mContext = new Array(); // an array of contexts (buffers)
	this.mBufferIter = 0; // our current buffer (context)
	
	this.mCurrContext = null; // reference to current buffer (context)
	
	this.mCanvasPos = new IVec2(); // position of the canvas on the page
	this.mCanvasSize = new IVec2(); // dimensions of the canvas
};

// initialises the game object
Game.prototype.SetUp = function() {
	// add front buffer context
	this.mCanvas.push(document.getElementById("frontbuffer"));
	this.mContext.push(this.mCanvas[0].getContext("2d"));
	
	// add back buffer context
	this.mCanvas.push(document.getElementById("backbuffer"));
	this.mContext.push(this.mCanvas[1].getContext("2d"));
	
	{ // http://www.quirksmode.org/js/findpos.html
		var currObj = this.mCanvas[0];
		var currX = 0, currY = 0;
		if (currObj.offsetParent) {
			do {
				currX += currObj.offsetLeft;
				currY += currObj.offsetTop;
			} while (currObj = currObj.offsetParent);
			
			this.mCanvasPos.Set(currX, currY);
		}
	}
	
	this.mCanvasSize.Set(this.mCanvas[0].width, this.mCanvas[0].height); // set dimensions of the canvas
	this.mCurrContext = this.mContext[this.mBufferIter]; // set reference to current buffer
	
	nmgrs.sceneMan.ChangeScene(new InitScene()); // change to our initial scene
};

// cleans up the game object
Game.prototype.TearDown = function() {
	
};

// our main game loop
Game.prototype.Run = function() {
	var updateDisplay = false; // do we need to redisplay?
	
	this.Input(); // perform input handling
	nmgrs.inputMan.Process(); 
	
	var dt = (this.mTimer.GetElapsedTime() / 1000); // get the delta time (since last frame)
	this.mTimer.Reset(); // reset the timer to time next frame
	this.mAccum += dt; // add the delta time to our accumulated time
	
	// while our accumulated time is greater than the frame limit
	while (this.mAccum > (1 / this.mFrameLimit)) {
		this.Process(); // process the game
		this.mAccum -= (1 / this.mFrameLimit); // decrease the accumulator
		
		// interpolate for smoother running, baby
		
		updateDisplay = true; // we need to redisplay
	}
	
	// if we need to redisplay
	if (updateDisplay == true) {
		this.Render(); // render the results
	}
}

// quits tha game (not strictly required, could be used to completely restart the game)
Game.prototype.Quit = function() {
	clearInterval(this.mGameLoop); // remove the interval running our game loop
	this.TearDown(); // clean up the game object
}

// handles user input
Game.prototype.Input = function() {
	nmgrs.sceneMan.GetCurrentScene().Input(); // perform input for the current scene
}

// handles game logic
Game.prototype.Process = function() {
	nmgrs.sceneMan.GetCurrentScene().Process(); // process the current scene
}

// handles all drawing tasks
Game.prototype.Render = function() {
	this.Clear(this.mClearColour); // clear the canvas
	
	nmgrs.sceneMan.GetCurrentScene().Render(); // render the current scene
	
	this.SwapBuffers(); // swap the buffers (display)
}

// clear the context
Game.prototype.Clear = function(colour) {
	this.mCurrContext.save(); // save current transform
	this.mCurrContext.setTransform(1, 0, 0, 1, 0, 0); // set to identity transform to make sure we clear entire context
	
	this.mCurrContext.fillStyle = colour; // set fill to clear colour
	
	// clear the canvas and then draw a filled rect
	this.mCurrContext.clearRect(0, 0, this.mCanvasSize.mX, this.mCanvasSize.mY);
	this.mCurrContext.fillRect(0, 0, this.mCanvasSize.mX, this.mCanvasSize.mY);
	
	this.mCurrContext.restore(); // restore previously save transform
}

// swap the buffers (contexts)
Game.prototype.SwapBuffers = function() {
	this.mCanvas[this.mBufferIter].style.visibility = 'visible'; // set current buffer to visible (display)
	
	this.mBufferIter = (this.mBufferIter + 1) % 2; // increment the buffer iterator
	this.mCurrContext = this.mContext[this.mBufferIter]; // set the current buffer
	this.mCanvas[this.mBufferIter].style.visibility = 'hidden'; // hide the current buffer (we are now drawing to it)
}

// set the current transform to the identity matrix
Game.prototype.SetIdentity = function() {
	this.mCurrContext.setTransform(1, 0, 0, 1, 0, 0); // identity matrix
}
// ...End


// main Namespace...
var nmain = new function() {
	this.game = new Game(); // our game object
}
// ...End


// managers Namespace...
var nmgrs = new function() {
	this.inputMan = new InputManager();
	this.sceneMan = new SceneManager();
	this.resMan = new ResourceManager();
	this.resLoad = new ResourceLoader();
};
// ...End


function main() {
	try {
		nmain.game.SetUp(); // initialise the game
		
		// run the game loop as fast as the browser will allow
		// note that timing is handled elsewhere (within the Game Run() function)
		nmain.game.mTimer.Reset();
		nmain.game.mGameLoop = setInterval(function() {nmain.game.Run();}, 0);
	} catch(e) {
		alert(e.What());
	}
};

// GFMap Class...
// 
function GFMap() {
	this.mMapSize = new IVec2(0, 0);
	
	this.mMapTiles = new Array();
	this.mRand = new RNG(0);
};

GFMap.prototype.SetUp = function(size) {
	this.mMapSize.Copy(size);
	
	var iv = new IVec2(0, 0);
	var tex = nmgrs.resMan.mTexStore.GetResource("tile_set_default");
	
	for (var y = 0; y < this.mMapSize.mY; ++y) {
		for (var x = 0; x < this.mMapSize.mX; ++x) {
			iv.Set(x, y);
			var ind = x + (this.mMapSize.mX * y);
			this.mMapTiles[ind] = new GFMapTile(iv);
			this.mMapTiles[ind].mSprite.SetAnimatedTexture(tex, 25, 5, -1);
			this.mMapTiles[ind].mSprite.mOrigin.Set(8, 8);
			this.mMapTiles[ind].mSprite.mPos.Set(32 * x, 32 * y);
			this.mMapTiles[ind].mSprite.mDepth = 1000 + (this.mMapSize.mX * this.mMapSize.mY) - ind;
			this.mMapTiles[ind].mSprite.SetCurrentFrame(this.mRand.GetRandInt(0, 4));
		}
	}
}
// ...End


// GFMapTile Class...
// 
function GFMapTile(pos) {
	this.mPos = new IVec2(0, 0);
	this.mPos.Copy(pos);
	
	this.mSprite = new Sprite();
	this.mType = "";
};
// ...End


// GFMapGen Class...
function GFMapGen() {
	
};

GFMapGen.prototype.GenerateMap = function(seed, size, baseSize) {
	var map = new GFMap();
	
	var dimX = 0; var dimY = 0;
	var lzLeft = 0; var lzRight = 0;
	var numAnts = 0;
	{
		if (size == "s") {
			dimX = 9;
			dimY = 29;
			
			lzLeft = -2;
			lzRight = 2;
			
			numAnts = map.mRand.GetRandInt(2, 4);
		}
		else if (size == "m") {
			dimX = 14;
			dimY = 37;
			
			lzLeft = -3;
			lzRight = 3;
			
			numAnts = map.mRand.GetRandInt(3, 5);
		}
		else {
			dimX = 17;
			dimY = 45;
			
			lzLeft = -4;
			lzRight = 4;
			
			numAnts = map.mRand.GetRandInt(5, 8);
		}
		
		map.mRand.SetSeed(seed);
		map.SetUp(new IVec2(dimX, dimY));
	}
	
	// Fill top n rows as base
	// Fill bottom n rows as ground
	// Create landing zone within lower ground
	
	var enemyBaseSize = 0;
	{
		if (baseSize == "s") {
			enemyBaseSize = 2;
		}
		else if (baseSize == "m") {
			enemyBaseSize = map.mRand.GetRandInt(2, 3);
		}
		else {
			enemyBaseSize = map.mRand.GetRandInt(3, 4);
		}
	}
	
	for (var i = 0; i < (dimX * enemyBaseSize); ++i) {
		map.mMapTiles[i].mSprite.SetCurrentFrame(map.mRand.GetRandInt(10, 14));
		map.mMapTiles[i].mType = "red";
	}
	
	for (var i = (dimX * (dimY - 5)); i < (dimX * dimY); ++i) {
		map.mMapTiles[i].mSprite.SetCurrentFrame(map.mRand.GetRandInt(5, 9));
	}
	
	{
		var midPoint = Math.floor(dimX / 2);
		
		for (var i = 2; i <= 4; ++i) {
			for (var j = lzLeft; j <= lzRight; ++j) {
				var tileID = (dimX * (dimY - i)) + midPoint + j;
				map.mMapTiles[tileID].mSprite.SetCurrentFrame(map.mRand.GetRandInt(15, 19));
				map.mMapTiles[tileID].mType = "blue";
			}
		}
	}
	
	{
		for (var i = 0; i < numAnts; ++i) {
			var x = map.mRand.GetRandInt(0, dimX - 1);
			
			var ant = new GFMapAnt(new IVec2(x, dimY - 6));
			var arr = ant.Dig(map, dimX);
			for (var j = 0; j < arr.length; ++j) {
				var id = arr[j].mX + (arr[j].mY * dimX);
				if (map.mMapTiles[id].mType == "") {
					map.mMapTiles[id].mSprite.SetCurrentFrame(map.mRand.GetRandInt(5, 9));
				}
			}
		}
	}
	
	return map;
}
// ...End


//	GFMapAnt Class...
//
function GFMapAnt(position) {
	this.mPos = new IVec2(0, 0);
	this.mPos.Copy(position);
}

GFMapAnt.prototype.Dig = function(mapRef, xMax) {
	var idArr = new Array();
	var sideSteps = mapRef.mRand.GetRandInt(5, 8);
	
	while (this.mPos.mY > 0) {
		var vec = new IVec2();
		vec.Copy(this.mPos);
		idArr.push(vec);
		
		if (sideSteps > 0) {
			if (mapRef.mRand.GetRandInt(0, 1) == 0) {
				if (this.mPos.mX > 0) {
					this.mPos.mX -= 1;
				}
			}
			else {
				if (this.mPos.mX < xMax - 1) {
					this.mPos.mX += 1;
				}
			}
			
			sideSteps--;
		}
		else {
			this.mPos.mY -= 1;
			sideSteps = mapRef.mRand.GetRandInt(5, 8);
		}
		
		/* if (mapRef.mRand.GetRandInt(0, 2) == 0) {
			this.mPos.mY -= 1;
		}
		else {
			if (mapRef.mRand.GetRandInt(0, 1) == 0) {
				if (this.mPos.mX > 0) {
					this.mPos.mX -= 1;
				}
			}
			else {
				if (this.mPos.mX < xMax - 1) {
					this.mPos.mX += 1;
				}
			}
		} */
		
		
	}
	
	return idArr;
}
// ...End


