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


// SceneManager Class...
function SceneManager() {
	this.mCurrScene = null;
	this.mSceneStore = new Array();
}

SceneManager.prototype.SetUp = function() {
	
}

SceneManager.prototype.TearDown = function() {
	for (var i = 0; i < this.mSceneStore.length; ++i) {
		this.mSceneStore[i].TearDown();
	}
	
	this.mSceneStore.splice(0, this.mSceneStore.length);
	this.mCurrScene = NULL;
}

SceneManager.prototype.ChangeScene = function(newScene) {
	var found = false;
	
	if (this.mCurrScene != null) {
		if (this.mCurrScene.Persistent() == true) {
			this.mSceneStore.push(this.mCurrScene);
		}
		else {
			this.mCurrScene.TearDown();
		}
	}
	
	for (var i = 0; i < this.mSceneStore.length; ++i) {
		if (this.mSceneStore[i].Type() == newScene.Type()) {
			this.mCurrScene = this.mSceneStore[i];
			this.mSceneStore.splice(i, i + 1);
			found = true;
			break;
		}
	}
	
	if (found == false) {
		this.mCurrScene = newScene;
		this.mCurrScene.SetUp();
	}
}

SceneManager.prototype.GetCurrentScene = function() {
	return this.mCurrScene;
}
// ...End


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
			return this.mStore[i].mRes;
		}
	}
	
	throw Exception("Resource not found.");
};
// ...End


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


// ResourceManager Class...
function ResourceManager() {
	this.mTexStore = new ResourceStore();
};
// ...End


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



// Timer Class...
// a timer; keeps time
function Timer() {
	this.startTime = 0; // the time that this timer was started
	
	this.Reset();
};

// 
Timer.prototype.Reset = function() {
	var d = new Date();
	this.startTime = d.getTime(); // set the start time to the current time
};

// 
Timer.prototype.GetElapsedTime = function() {
	var d = new Date();
	return d.getTime() - this.startTime; // return how much time has elapsed since last call to reset
};
// ...End


// mapgen Namespace...
var nmapgen = new function() {
this.MAPBOUNDMIN = new IVec2(100, 400); // minimum size a map can be
this.MAPBOUNDMAX = new IVec2(300, 1200); // maximum size a map can be
};
// ...End


// MapGenerator Class...
// mapDimensions is an IVec2
function MapGenerator(mapDimensions) {
	if (mapDimensions.Type() == "IVec2") {
        this.mMapDimensions = mapDimensions;
		
		if (this.mMapDimensions.mX < nmapgen.MAPBOUNDMIN.mX) {
			this.mMapDimensions.mX = nmapgen.MAPBOUNDMIN.mX;
		}
		else if (this.mMapDimensions.mX > nmapgen.MAPBOUNDMAX.mX) {
			this.mMapDimensions.mX = nmapgen.MAPBOUNDMAX.mX;
		}
		
		if (this.mMapDimensions.mY < nmapgen.MAPBOUNDMIN.mY) {
			this.mMapDimensions.mY = nmapgen.MAPBOUNDMIN.mY;
		}
		else if (this.mMapDimensions.mY > nmapgen.MAPBOUNDMAX.mY) {
			this.mMapDimensions.mY = nmapgen.MAPBOUNDMAX.mY;
		}
    }
	else {
		throw new Exception("Invalid IVec2 passed to MapGenerator.");
	}
};

MapGenerator.prototype.GenerateMap = function() {
	// 
};

MapGenerator.prototype.Render = function() {
	nmain.game.mContext.fillStyle = "#FF0000";
	nmain.game.mContext.fillRect(0, 0, 150, 75);
};
// ...End


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


// Game Class...
// a game object contains all the logic and data of our game
function Game() {
	this.mGameLoop = null;
	this.mFrameLimit = 60;
	this.mAccum = 0.0;
	this.mTimer = new Timer();
	
	this.mCanvas = null;
	this.mContext = null;
};

// initialises the game object
Game.prototype.SetUp = function() {
	this.mCanvas = document.getElementById("canvas"); // get the canvas element handle by id from the html file
	this.mContext = this.mCanvas.getContext("2d"); // get a 2d context handle from the canvas
	
	nmgrs.sceneMan.ChangeScene(new InitScene());
};

// cleans up the game object
Game.prototype.TearDown = function() {
	
};

Game.prototype.Run = function() {
	var updateDisplay = false;
	
	this.Input(); // perform input handling
	
	var dt = (this.mTimer.GetElapsedTime() / 1000);
	this.mTimer.Reset();
	this.mAccum += dt;
	while (this.mAccum > (1 / this.mFrameLimit)) {
		this.Process(); // process the game
		this.mAccum -= (1 / this.mFrameLimit);
		
		// interpolate for smoother running, baby
		
		updateDisplay = true;
	}
	
	if (updateDisplay == true) {
		this.Render(); // render the results
	}
}

Game.prototype.Quit = function() {
	clearInterval(this.mGameLoop);
	this.TearDown();
}

Game.prototype.Input = function() {
	nmgrs.sceneMan.GetCurrentScene().Input(); // perform input for the current scene
}

Game.prototype.Process = function() {
	nmgrs.sceneMan.GetCurrentScene().Process(); // process the current scene
}

Game.prototype.Render = function() {
	nmgrs.sceneMan.GetCurrentScene().Render(); // render the current scene
}
// ...End


// main Namespace...
var nmain = new function() {
	this.game = new Game(); // our game object
}
// ...End


// managers Namespace...
var nmgrs = new function() {
	this.sceneMan = new SceneManager();
	this.resMan = new ResourceManager();
	this.resLoad = new ResourceLoader();
}
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

