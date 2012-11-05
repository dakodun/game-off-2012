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


// Game Class...
// a game object contains all the logic and data of our game
function Game() {
	this.mCanvas = null;
	this.mContext = null;
	
	this.mQuit = false;
};

// initialises the game object
Game.prototype.SetUp = function() {
	this.mCanvas = document.getElementById("canvas"); // get the canvas element handle by id from the html file
	this.mContext = this.mCanvas.getContext("2d"); // get a 2d context handle from the canvas
	
	nmanagers.sceneManager.ChangeScene(new InitScene());
};

// cleans up the game object
Game.prototype.TearDown = function() {
	
};

Game.prototype.Run = function() {
	// while the app is to run
	do {
		this.Input(); // perform input handling
		this.Process(); // process the game
		this.Render(); // render the results
	} while(!mQuit);
}

Game.prototype.Input = function() {
	sceneManager.GetCurrentScene().Input(); // perform input for the current scene
}

Game.prototype.Process = function() {
	sceneManager.GetCurrentScene().Process(); // process the current scene
}

Game.prototype.Render = function() {
	sceneManager.GetCurrentScene().Render(); // render the current scene
}
// ...End


// main Namespace...
var nmain = new function() {
	this.game = new Game(); // our game object
}
// ...End


// managers Namespace...
var nmanagers = new function() {
	this.sceneManager = new SceneManager();
}
// ...End


function main() {
	try {
		nmain.game.SetUp();
		nmain.game.Run();
		nmain.game.TearDown();
	} catch(e) {
		alert(e.What());
	}
};

