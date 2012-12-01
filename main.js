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


// 
var util = new function() {
	this.PointInRectangle = function(point, topLeft, bottomRight) {
		if ((point.mX > topLeft.mX) && (point.mX < bottomRight.mX) &&
				(point.mY > topLeft.mY) && (point.mY < bottomRight.mY)) {
			
			return true;
		}
		
		return false;
	};
};
// ...End


// AStarTile Class
//
function AStarTile() {
	this.mID = 0;
	this.mParent = -1;
	this.mG = 0;
	this.mH = 0;
	
	this.mValid = true;
}

AStarTile.prototype.Copy = function(other) {
	this.mID = other.mID;
	this.mParent = other.mParent;
	this.mG = other.mG;
	this.mH = other.mH;
	
	this.mValid = other.mValid;
}
// ...End

// AStar Class
//
function AStar() {
	this.mMap = new Array();
	this.mMapSize = new IVec2(0, 0);
}

AStar.prototype.SetUp = function(size) {
	this.mMap.splice(0, this.mMap.length);
	this.mMapSize.Copy(size);
	
	for (var y = 0; y < size.mY; ++y) {
		for (var x = 0; x < size.mX; ++x) {
			var defaultTile = new AStarTile()
			defaultTile.mID = x + (y * size.mX);
			this.mMap.push(defaultTile);
		}
	}
}

AStar.prototype.FindPath = function(startID, endID) {
	var exit = false;
	var pathEnd = false;
	var closedList = new Array();
	var openList = new Array();
	openList.push(startID);
	
	while (exit == false) {
		var lowestID = 0;
		for (var i = 0; i < openList.length; ++i) {
			if (this.mMap[openList[i]].mG + this.mMap[openList[i]].mH <
					this.mMap[openList[lowestID]].mG + this.mMap[openList[lowestID]].mH) {
				
				lowestID = i;
			}
		}
		
		var thisID = openList[lowestID];
		closedList.push(thisID);
		openList.splice(lowestID, 1);
		
		if (thisID == endID) {
			exit = true;
			pathEnd = true;
		}
		else {
			// check tile to the left
			// check if there is a tile to the left (boundary check)
			if (thisID % this.mMapSize.mX > 0) {
				var adjID = thisID - 1;
				var valid = true;
				
				// check if the tile is traversable
				if (this.mMap[adjID].mValid == true) {
					// check if the tile is already on the closed list
					for (var i = 0; i < closedList.length; ++i) {
						if (adjID == closedList[i]) {
							valid = false; // not valid, ignore
							break;
						}
					}
				}
				else { // otherwise not valid, ignore
					valid = false;
				}
				
				// if tile is valid
				if (valid == true) {
					var inOpen = false;
					
					// check if it isalready on the open list
					for (var i = 0; i < openList.length; ++i) {
						if (adjID == openList[i]) {
							inOpen = true;
							break;
						}
					}
					
					// if it isn't
					if (inOpen == false) {
						openList.push(adjID);
						this.mMap[adjID].mID = adjID;
						this.mMap[adjID].mParent = thisID;
						this.mMap[adjID].mG = this.mMap[thisID].mG + 1;
						
						var thisPos = this.IDToPos(adjID);
						var targetPos = this.IDToPos(endID);
						
						this.mMap[adjID].mH = Math.abs(thisPos.mX - targetPos.mX) + Math.abs(thisPos.mY - targetPos.mY);
					}
					else { // otherwise check if this is a shorter path
						if (this.mMap[thisID].mG + 1 < this.mMap[adjID].mG) {
							this.mMap[adjID].mParent = thisID;
							this.mMap[adjID].mG = this.mMap[thisID].mG + 1;
						}
					}
				}
			}
			
			// check tile to the right
			if (thisID % this.mMapSize.mX < this.mMapSize.mX - 1) {
				var adjID = thisID + 1;
				var valid = true;
				if (this.mMap[adjID].mValid == true) {
					for (var i = 0; i < closedList.length; ++i) {
						if (adjID == closedList[i]) {
							valid = false;
							break;
						}
					}
				}
				else {
					valid = false;
				}
				
				if (valid == true) {
					var inOpen = false;
					for (var i = 0; i < openList.length; ++i) {
						if (adjID == openList[i]) {
							inOpen = true;
							break;
						}
					}
					
					if (inOpen == false) {
						openList.push(adjID);
						this.mMap[adjID].mID = adjID;
						this.mMap[adjID].mParent = thisID;
						this.mMap[adjID].mG = this.mMap[thisID].mG + 1;
						
						var thisPos = this.IDToPos(adjID);
						var targetPos = this.IDToPos(endID);
						
						this.mMap[adjID].mH = Math.abs(thisPos.mX - targetPos.mX) + Math.abs(thisPos.mY - targetPos.mY);
					}
					else {
						if (this.mMap[thisID].mG + 1 < this.mMap[adjID].mG) {
							this.mMap[adjID].mParent = thisID;
							this.mMap[adjID].mG = this.mMap[thisID].mG + 1;
						}
					}
				}
			}
			
			// check tile above
			if (Math.floor(thisID / this.mMapSize.mX) > 0) {
				var adjID = thisID - this.mMapSize.mX;
				var valid = true;
				if (this.mMap[adjID].mValid == true) {
					for (var i = 0; i < closedList.length; ++i) {
						if (adjID == closedList[i]) {
							valid = false;
							break;
						}
					}
				}
				else {
					valid = false;
				}
				
				if (valid == true) {
					var inOpen = false;
					for (var i = 0; i < openList.length; ++i) {
						if (adjID == openList[i]) {
							inOpen = true;
							break;
						}
					}
					
					if (inOpen == false) {
						openList.push(adjID);
						this.mMap[adjID].mID = adjID;
						this.mMap[adjID].mParent = thisID;
						this.mMap[adjID].mG = this.mMap[thisID].mG + 1;
						
						var thisPos = this.IDToPos(adjID);
						var targetPos = this.IDToPos(endID);
						
						this.mMap[adjID].mH = Math.abs(thisPos.mX - targetPos.mX) + Math.abs(thisPos.mY - targetPos.mY);
					}
					else {
						if (this.mMap[thisID].mG + 1 < this.mMap[adjID].mG) {
							this.mMap[adjID].mParent = thisID;
							this.mMap[adjID].mG = this.mMap[thisID].mG + 1;
						}
					}
				}
			}
			
			// check tile below
			if (Math.floor(thisID / this.mMapSize.mX) < this.mMapSize.mY - 1) {
				var adjID = thisID + this.mMapSize.mX;
				var valid = true;
				if (this.mMap[adjID].mValid == true) {
					for (var i = 0; i < closedList.length; ++i) {
						if (adjID == closedList[i]) {
							valid = false;
							break;
						}
					}
				}
				else {
					valid = false;
				}
				
				if (valid == true) {
					var inOpen = false;
					for (var i = 0; i < openList.length; ++i) {
						if (adjID == openList[i]) {
							inOpen = true;
							break;
						}
					}
					
					if (inOpen == false) {
						openList.push(adjID);
						this.mMap[adjID].mID = adjID;
						this.mMap[adjID].mParent = thisID;
						this.mMap[adjID].mG = this.mMap[thisID].mG + 1;
						
						var thisPos = this.IDToPos(adjID);
						var targetPos = this.IDToPos(endID);
						
						this.mMap[adjID].mH = Math.abs(thisPos.mX - targetPos.mX) + Math.abs(thisPos.mY - targetPos.mY);
					}
					else {
						if (this.mMap[thisID].mG + 1 < this.mMap[adjID].mG) {
							this.mMap[adjID].mParent = thisID;
							this.mMap[adjID].mG = this.mMap[thisID].mG + 1;
						}
					}
				}
			}
			
			if (openList.length == 0) {
				exit = true;
			}
		}
	}
	
	exit = false;
	var path = new Array();
	var prev = 0;
	
	if (pathEnd == true) {
		path.push(endID);
		prev = endID;
	}
	else {
		var arbitID = 0;
		var currDist = -1;
		
		var endPos = new IVec2(0, 0);
		endPos.Copy(this.IDToPos(endID));
		
		for (var i = 0; i < closedList.length; ++i) {
			var thisPos = new IVec2(0, 0);
			thisPos.Copy(this.IDToPos(closedList[i]));
			
			var dist = Math.abs(thisPos.mX - endPos.mX) + Math.abs(thisPos.mY - endPos.mY);
			if (dist < currDist || currDist < 0) {
				currDist = dist;
				arbitID = closedList[i];
			}
			else if (dist == currDist) {
				if (thisPos.mY > this.IDToPos(arbitID).mY) {
					currDist = dist;
					arbitID = closedList[i];
				}
			}
		}
		
		path.push(arbitID);
		prev = arbitID;
	}
	
	while (exit == false) {
		if (this.mMap[prev].mParent >= 0) {
			path.push(this.mMap[prev].mParent);
			prev = this.mMap[prev].mParent;
		}
		else {
			exit = true;
		}
	}
	
	return path;
}

AStar.prototype.IDToPos = function(id) {
	var pos = new IVec2(0, 0);
	pos.mY = Math.floor(id / this.mMapSize.mX);
	pos.mX = id - (this.mMapSize.mX * pos.mY);
	
	return pos;
}

AStar.prototype.PosToID = function(pos) {
	var id = pos.mX + (this.mMapSize.mX * pos.mY);
	return id;
}
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
	
	this.mReadyScene = null; // the scene we will switch to set in ReadyScene()
	this.mIsSetUp = false;
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

// adds a new scene to the scene manager but doesn't yet switch which allows interaction betweens scenes
SceneManager.prototype.ReadyScene = function(newScene) {
	// this.mReadyScene = newScene;
	var found = false; // indicates if we have found a previously stored scene
	
	// for all currently stored (persistent) scenes
	for (var i = 0; i < this.mSceneStore.length; ++i) {
		// if we find a match
		if (this.mSceneStore[i].Type() == newScene.Type()) {
			this.mReadyScene = this.mSceneStore[i]; // restore the stored scene as our ready (next) scene
			this.mSceneStore.splice(i, i + 1); // remove it from the store
			this.mIsSetUp = true;
			found = true; // indicate we have found a persistent scene to restore
			break;
		}
	}
	
	// if we didn't find a scene to restore
	if (found == false) {
		this.mReadyScene = newScene; // create a new scene
		this.mIsSetUp = false;
	}
}

// 
SceneManager.prototype.SwitchScene = function() {
	if (this.mReadyScene != null) {
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
		
		this.mCurrScene = this.mReadyScene;
		
		if (this.mIsSetUp == false) {
			this.mCurrScene.SetUp();
		}
		
		this.mReadyScene = null;
	}
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
	this.mShadowColour = "#000000";
	this.mDepth = 0;
	
	this.mPos = new IVec2(0, 12);
	this.mOutline = false;
	this.mShadow = false;
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
	this.mShadowColour = other.mShadowColour;
	this.mDepth = other.mDepth;
	
	this.mPos.Copy(other.mPos);
	this.mOutline = other.mOutline;
	this.mShadow = other.mShadow;
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
	var txtArr = this.mString.split("\n");
	return this.mHeight * txtArr.length;
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
	this.mSize = new IVec2(0, 0);
	this.mOutline = false;
	this.mOrigin = new IVec2(0, 0);
	
	this.mPoints = new Array();
	this.mBounds = new Array();
	this.mBounds[0] = 0;
	this.mBounds[1] = 0;
	this.mBounds[2] = 0;
	this.mBounds[3] = 0;
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
	this.mSize.Copy(other.mSize);
	this.mOutline = other.mOutline;
	this.mOrigin.Copy(other.mOrigin);
	
	this.mPoints = other.mPoints;
}

// 
Shape.prototype.Reset = function() {
	this.mPoints.splice(0, this.mPoints.length);
	this.mSize.Set(0, 0);
	for (var i = 0; i < this.mBounds.length; ++i) {
		this.mBounds[i] = 0;
	}
}

// 
Shape.prototype.AddPoint = function(point) {
	var pt = new IVec2();
	pt.Copy(point);
	this.mPoints.push(pt);
	
	// check left bound
	if (pt.mX < this.mBounds[0]) {
		this.mBounds[0] = pt.mX;
	}
	else if (pt.mX > this.mBounds[2]) { // right
		this.mBounds[2] = pt.mX;
	}
	
	// check top bound
	if (pt.mY < this.mBounds[1]) {
		this.mBounds[1] = pt.mY;
	}
	else if (pt.mY > this.mBounds[3]) { // bottom
		this.mBounds[3] = pt.mY;
	}
	
	this.mSize.Set(this.mBounds[2] - this.mBounds[0], this.mBounds[3] - this.mBounds[1]);
}

// 
Shape.prototype.GetPosition = function() {
	var pos = new IVec2();
	pos.Set(this.mPos.mX - this.mOrigin.mX, this.mPos.mY - this.mOrigin.mY);
	return pos;
}

//
Shape.prototype.GetWidth = function() {
	return this.mSize.mX;
}

//
Shape.prototype.GetHeight = function() {
	return this.mSize.mY;
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
	
	// this.mAnimTimer = new Timer();
	// this.mAnimTimer.Reset();
	
	this.mAnimIter = 0;
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
	
	// this.mAnimTimer.Copy(other.mAnimTimer);
	
	this.mAnimIter = other.mAnimIter;
}

// process the sprite (for animation)
Sprite.prototype.Process = function() {
	if (this.mIsAnimated) {
		if (this.mAnimSpeed >= 0) {
			// if (this.mAnimTimer.GetElapsedTime() > this.mAnimSpeed) {
			// 	this.mAnimTimer.Reset();
			if (this.mAnimIter > this.mAnimSpeed) {
				this.mAnimIter = 0;
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
			
			this.mAnimIter += (1 / nmain.game.mFrameLimit);
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
	
	// this.mAnimTimer.Reset();
	
	this.mAnimIter = 0;
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
	
	// this.mAnimTimer.Reset();
	
	this.mAnimIter = 0;
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
	
	// this.mAnimTimer.Reset();
	
	this.mAnimIter = 0;
	
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
		// this.mAnimTimer.Reset();
		this.mAnimIter = 0;
		
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

//
Sprite.prototype.GetWidth = function() {
	var w = this.mTex.mImg.width;
	
	if (this.mIsAnimated == true) {
		w = this.mClipSize.mX;
	}
	
	return w;
}

//
Sprite.prototype.GetHeight = function() {
	var h = this.mTex.mImg.height;
	
	if (this.mIsAnimated == true) {
		h = this.mClipSize.mY;
	}
	
	return h;
}
// ...End


// DepthSort function
// sorts renderable resources based on depth
function DepthSort(first, second) {
	var result = second.mDepth - first.mDepth;
	
	return result;
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
	
	if (spr.mTex != null) {
		this.mRenderData.push(spr);
	}
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
	
	if (this.mNeedSort == true) {
		this.mRenderData.sort(DepthSort); // sort the queue
		this.mNeedSort = false;
	}
	
	for (var i = 0; i < this.mRenderData.length; ++i) {
		nmain.game.mCurrContext.save();
		
		if (this.mRenderData[i].Type() == "Sprite") {
			var spr = this.mRenderData[i];
			
			var scrTL = new IVec2(0 + cam.mTranslate.mX, 0 + cam.mTranslate.mY);
			var scrBR = new IVec2(nmain.game.mCanvasSize.mX + cam.mTranslate.mX,
					nmain.game.mCanvasSize.mY + cam.mTranslate.mY);
			
			var sprTL = new IVec2(spr.GetPosition().mX, spr.GetPosition().mY);
			var sprBR = new IVec2(spr.GetPosition().mX + spr.GetWidth(), spr.GetPosition().mY + spr.GetHeight());
			
			var intersect = false;
			var left = sprTL.mX;
			var right = scrBR.mX;
			if (scrTL.mX < sprTL.mX) {
				left = scrTL.mX;
				right = sprBR.mX;
			}
			
			if (right - left < spr.GetWidth() + nmain.game.mCanvasSize.mX) {
				var top = sprTL.mY;
				var bottom = scrBR.mY;
				if (scrTL.mY < sprTL.mY) {
					top = scrTL.mY;
					bottom = sprBR.mY;
				}
				
				if (bottom - top < spr.GetHeight() + nmain.game.mCanvasSize.mY) {
					intersect = true;
				}
			}
			
			if (intersect == true) {
				nmain.game.mCurrContext.translate(spr.GetPosition().mX, spr.GetPosition().mY);
				nmain.game.mCurrContext.rotate(spr.mRotation * (Math.PI / 180));
				
				nmain.game.mCurrContext.drawImage(spr.mTex.mImg, spr.mClipPos.mX, spr.mClipPos.mY,
						spr.mClipSize.mX, spr.mClipSize.mY, 0, 0,
						spr.GetWidth() * spr.mScale.mX, spr.GetHeight() * spr.mScale.mY);
			}
		}
		else if (this.mRenderData[i].Type() == "Text") {
			var txt = this.mRenderData[i];
			var txtArr = txt.mString.split("\n");
			
			nmain.game.mCurrContext.font = txt.mFont;
			nmain.game.mCurrContext.strokeStyle = txt.mColour;
			
			var scrTL = new IVec2(0 + cam.mTranslate.mX, 0 + cam.mTranslate.mY);
			var scrBR = new IVec2(nmain.game.mCanvasSize.mX + cam.mTranslate.mX,
					nmain.game.mCanvasSize.mY + cam.mTranslate.mY);
			
			var txtTL = new IVec2(txt.mPos.mX, txt.mPos.mY);
			var txtBR = new IVec2(txt.mPos.mX + txt.GetWidth(), txt.mPos.mY + txt.GetHeight());
			
			var intersect = false;
			var left = txtTL.mX;
			var right = scrBR.mX;
			if (scrTL.mX < txtTL.mX) {
				left = scrTL.mX;
				right = txtBR.mX;
			}
			
			if (right - left < txt.GetWidth() + nmain.game.mCanvasSize.mX) {
				var top = txtTL.mY;
				var bottom = scrBR.mY;
				if (scrTL.mY < txtTL.mY) {
					top = scrTL.mY;
					bottom = txtBR.mY;
				}
				
				if (bottom - top < txt.GetHeight() + nmain.game.mCanvasSize.mY) {
					intersect = true;
				}
			}
			
			if (intersect == true) {
				nmain.game.mCurrContext.translate(txt.mPos.mX, txt.mPos.mY + txt.mHeight);
				nmain.game.mCurrContext.rotate(txt.mRotation * (Math.PI / 180));
				
				if (txt.mOutline == true) {
					for (var j = 0; j < txtArr.length; ++j) {
						nmain.game.mCurrContext.strokeText(txtArr[j], 0, txt.mHeight * j);
					}
				}
				else {
					for (var j = 0; j < txtArr.length; ++j) {
						if (txt.mShadow == true) {
							nmain.game.mCurrContext.fillStyle = txt.mShadowColour;
							nmain.game.mCurrContext.fillText(txtArr[j], 2, (txt.mHeight * j) + 2);
						}
						
						nmain.game.mCurrContext.fillStyle = txt.mColour;
						nmain.game.mCurrContext.fillText(txtArr[j], 0, txt.mHeight * j);
					}
				}
			}
		}
		else if (this.mRenderData[i].Type() == "Shape") {
			var shp = this.mRenderData[i];
			var pos = shp.GetPosition();
			
			nmain.game.mCurrContext.fillStyle = shp.mColour;
			nmain.game.mCurrContext.strokeStyle = shp.mColour;
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
			
			if (shp.mOutline == false) {
				nmain.game.mCurrContext.fill();
			}
			else {
				nmain.game.mCurrContext.stroke();
			}
			
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
		nmgrs.resLoad.QueueTexture("smb_select", "./res/vis/smb_select.png");
		nmgrs.resLoad.QueueTexture("menu_button", "./res/vis/menu_button.png");
		nmgrs.resLoad.QueueTexture("help_icon", "./res/vis/help_icon.png");
		nmgrs.resLoad.QueueTexture("help_cheat", "./res/vis/help_cheat.png");
		
		nmgrs.resLoad.QueueTexture("tile_set_default", "./res/vis/tile_set_default.png");
		nmgrs.resLoad.QueueTexture("tile_hilite", "./res/vis/tile_hilite.png");
		nmgrs.resLoad.QueueTexture("tile_hilite_fire", "./res/vis/tile_hilite_fire.png");
		nmgrs.resLoad.QueueTexture("explode", "./res/vis/explode.png");
		
		nmgrs.resLoad.QueueTexture("turn_1", "./res/vis/turn_1.png");
		nmgrs.resLoad.QueueTexture("turn_2", "./res/vis/turn_2.png");
		nmgrs.resLoad.QueueTexture("endturn", "./res/vis/endturn.png");
		nmgrs.resLoad.QueueTexture("cancel", "./res/vis/cancel.png");
		nmgrs.resLoad.QueueTexture("gui_arrow_up", "./res/vis/gui_arrow_up.png");
		nmgrs.resLoad.QueueTexture("gui_arrow_down", "./res/vis/gui_arrow_down.png");
		nmgrs.resLoad.QueueTexture("gui_moves", "./res/vis/gui_moves.png");
		nmgrs.resLoad.QueueTexture("gui_debug", "./res/vis/gui_debug.png");
		
		nmgrs.resLoad.QueueTexture("unit_b_workerprod", "./res/vis/unit_b_workerprod.png");
		nmgrs.resLoad.QueueTexture("gui_workerprod", "./res/vis/gui_workerprod.png");
		nmgrs.resLoad.QueueTexture("unit_u_pusher", "./res/vis/unit_u_pusher.png");
		nmgrs.resLoad.QueueTexture("gui_pusher", "./res/vis/gui_pusher.png");
		nmgrs.resLoad.QueueTexture("unit_u_puller", "./res/vis/unit_u_puller.png");
		nmgrs.resLoad.QueueTexture("gui_puller", "./res/vis/gui_puller.png");
		nmgrs.resLoad.QueueTexture("unit_u_arty", "./res/vis/unit_u_arty.png");
		nmgrs.resLoad.QueueTexture("gui_arty", "./res/vis/gui_arty.png");
		nmgrs.resLoad.QueueTexture("arty_firezone", "./res/vis/arty_firezone.png");
		
		nmgrs.resLoad.QueueTexture("unit_b_enemyion", "./res/vis/unit_b_enemyion.png");
		nmgrs.resLoad.QueueTexture("unit_b_enemyscoutprod", "./res/vis/unit_b_enemyscoutprod.png");
		nmgrs.resLoad.QueueTexture("unit_u_enemyscout", "./res/vis/unit_u_enemyscout.png");
		nmgrs.resLoad.QueueTexture("ic_firezone", "./res/vis/ic_firezone.png");
		
		nmgrs.resLoad.QueueTexture("fog", "./res/vis/fog.png");
		
		nmgrs.resLoad.QueueTexture("lose", "./res/vis/lose.png");
		nmgrs.resLoad.QueueTexture("won", "./res/vis/won.png");
		
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
		nmgrs.sceneMan.ChangeScene(new MenuScene());
		// nmgrs.sceneMan.ChangeScene(new GameScene());
	}
}

// handles all drawing tasks
InitScene.prototype.Render = function() {
	
}
// ...End


// MenuScene Class...
// self contained parts of the game such as different screens, levels or game modes
function MenuScene() {
	this.mPersist = false;
	
	this.mBatch = new RenderBatch();
	
	this.mButtonText = new Array();
	this.mButtonText[0] = new Text();
	this.mButtonText[1] = new Text();
	this.mButtonText[2] = new Text();
	this.mButtonText[3] = new Text();
	this.mButtonText[4] = new Text();
	this.mButtonText[5] = new Text();
	
	this.mButtons = new Array();
	this.mButtons[0] = new Sprite;
	this.mButtons[1] = new Sprite;
	this.mButtons[2] = new Sprite;
	this.mButtons[3] = new Sprite;
	this.mButtons[4] = new Sprite;
	
	this.mRand = new RNG(0);
	
	this.mSizeArray = new Array();
	this.mSizeArray[0] = "s";
	this.mSizeArray[1] = "m";
	this.mSizeArray[2] = "b";
	
	this.mMapSize = "s";
	this.mBaseSize = "s";
	this.mSeed = 0;
}

// returns the type of this object for validity checking
MenuScene.prototype.Type = function() {
	return "MenuScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
MenuScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
MenuScene.prototype.SetUp = function() {
	nmain.game.mClearColour = "#604039";
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("smb_select");
		
		{
			this.mButtonText[0].SetFontName("sans-serif");
			this.mButtonText[0].SetFontSize(18);
			this.mButtonText[0].mString = "Map Size";
			this.mButtonText[0].mDepth = -2000;
			this.mButtonText[0].mShadow = true;
			
			this.mButtons[0].SetAnimatedTexture(tex, 3, 1, -1, -1);
			this.mButtons[0].SetCurrentFrame(0);
			this.mButtons[0].mDepth = -2000;
			
			this.mButtonText[0].mPos.Set((nmain.game.mCanvasSize.mX / 2) - this.mButtonText[0].GetWidth() - 8, 30 + this.mButtons[0].GetHeight() / 16);
			this.mButtons[0].mPos.Set((nmain.game.mCanvasSize.mX / 2) + 8, 30);
		}
		
		{
			this.mButtonText[1].SetFontName("sans-serif");
			this.mButtonText[1].SetFontSize(18);
			this.mButtonText[1].mString = "Base Size";
			this.mButtonText[1].mDepth = -2000;
			this.mButtonText[1].mShadow = true;
			
			this.mButtons[1].SetAnimatedTexture(tex, 3, 1, -1, -1);
			this.mButtons[1].SetCurrentFrame(0);
			this.mButtons[1].mDepth = -2000;
			
			this.mButtonText[1].mPos.Set((nmain.game.mCanvasSize.mX / 2) - this.mButtonText[1].GetWidth() - 8, 70 + this.mButtons[1].GetHeight() / 16);
			this.mButtons[1].mPos.Set((nmain.game.mCanvasSize.mX / 2) + 8, 70);
		}
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("menu_button");
		
		{
			this.mButtonText[2].SetFontName("sans-serif");
			this.mButtonText[2].SetFontSize(18);
			this.mButtonText[2].mString = "Randomise Seed";
			this.mButtonText[2].mDepth = -2000;
			this.mButtonText[2].mShadow = true;
			
			this.mButtons[2].SetTexture(tex);
			this.mButtons[2].mDepth = -2000;
			
			this.mButtons[2].mPos.Set((nmain.game.mCanvasSize.mX / 2) - ((3 * this.mButtons[2].GetWidth()) / 2) + 24, 150);
			this.mButtonText[2].mPos.Set(this.mButtons[2].mPos.mX - (this.mButtonText[2].GetWidth() / 2) + (this.mButtons[2].GetWidth() / 2), 120 + this.mButtons[2].GetHeight() / 16);
		}
		
		{
			this.mButtonText[3].SetFontName("sans-serif");
			this.mButtonText[3].SetFontSize(18);
			this.mButtonText[3].mString = "Start Game";
			this.mButtonText[3].mDepth = -2000;
			this.mButtonText[3].mShadow = true;
			
			this.mButtons[3].SetTexture(tex);
			this.mButtons[3].mDepth = -2000;
			
			this.mButtons[3].mPos.Set((nmain.game.mCanvasSize.mX / 2) + (this.mButtons[3].GetWidth() / 2) - 24, 150);
			this.mButtonText[3].mPos.Set(this.mButtons[3].mPos.mX - (this.mButtonText[3].GetWidth() / 2) + (this.mButtons[3].GetWidth() / 2), 120 + this.mButtons[3].GetHeight() / 16);
		}
	}
	
	{
		var d = new Date();
		this.mRand.SetSeed(d.getTime());
		var seed = this.mRand.GetRandInt(0, 99999999);
		this.mRand.SetSeed(seed);
		this.mSeed = seed;
		
		this.mButtonText[4].SetFontName("sans-serif");
		this.mButtonText[4].SetFontSize(12);
		this.mButtonText[4].mString = (this.mRand.GetSeed()).toString();
		this.mButtonText[4].mDepth = -2010;
		this.mButtonText[4].mShadow = true;
		
		this.mButtonText[4].mPos.Set(this.mButtons[2].mPos.mX + (this.mButtons[2].GetWidth() / 2) - (this.mButtonText[4].GetWidth() / 2), this.mButtons[2].mPos.mY + this.mButtons[2].GetHeight() - 7);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("help_icon");
		
		this.mButtonText[5].SetFontName("sans-serif");
		this.mButtonText[5].SetFontSize(12);
		this.mButtonText[5].mString = "Learn a little about how the game works ->";
		this.mButtonText[5].mDepth = -2000;
		this.mButtonText[5].mShadow = true;
		
		this.mButtons[4].SetTexture(tex);
		this.mButtons[4].SetCurrentFrame(0);
		this.mButtons[4].mDepth = -2000;
		
		this.mButtons[4].mPos.Set(nmain.game.mCanvasSize.mX - this.mButtons[4].GetWidth() - 12, nmain.game.mCanvasSize.mY - this.mButtons[4].GetHeight() - 12);
		this.mButtonText[5].mPos.Set(nmain.game.mCanvasSize.mX - this.mButtons[4].GetWidth() - this.mButtonText[5].GetWidth(), nmain.game.mCanvasSize.mY - (this.mButtons[4].GetHeight() / 2) - 12);
	}
	
	this.SetUpBatch();
}

// cleans up the scene object
MenuScene.prototype.TearDown = function() {
	
}

// handles user input
MenuScene.prototype.Input = function() {
	if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.left)) {
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		
		for (var i = 0; i < this.mButtons.length; ++i) {
			// top left of the buttons boundbox
			var tl = new IVec2(this.mButtons[i].mPos.mX, this.mButtons[i].mPos.mY);
			
			// bottom right of the buttons boundbox
			var br = new IVec2(this.mButtons[i].mPos.mX + this.mButtons[i].GetWidth(),
					this.mButtons[i].mPos.mY + this.mButtons[i].GetHeight());
			
			if (util.PointInRectangle(pt, tl, br) == true) {
				if (i == 0 || i == 1) {
					var frame = (this.mButtons[i].mCurrFrame + 1) % this.mButtons[i].mNumFrames;
					this.mButtons[i].SetCurrentFrame(frame);
					this.SetUpBatch();
					
					if (i == 0) {
						this.mMapSize = this.mSizeArray[frame];
					}
					else {
						this.mBaseSize = this.mSizeArray[frame];
					}
				}
				else if (i == 2) {
					var seed = this.mRand.GetRandInt(0, 99999999);
					this.mRand.SetSeed(seed);
					this.mSeed = seed;
					this.mButtonText[4].mString = (this.mRand.GetSeed()).toString();
					this.mButtonText[4].mPos.Set(this.mButtons[2].mPos.mX + (this.mButtons[2].GetWidth() / 2) - (this.mButtonText[4].GetWidth() / 2), this.mButtons[2].mPos.mY + this.mButtons[2].GetHeight() - 7);
					this.SetUpBatch();
				}
				else if (i == 3) {
					this.mPersist = true;
					nmgrs.sceneMan.ReadyScene(new GameScene());
					
					nmgrs.sceneMan.mReadyScene.mMenuMapSize = this.mMapSize;
					nmgrs.sceneMan.mReadyScene.mMenuBaseSize = this.mBaseSize;
					nmgrs.sceneMan.mReadyScene.mMenuSeed = this.mSeed;
					
					nmgrs.sceneMan.SwitchScene();
				}
				else if (i == 4) {
					this.mPersist = true;
					nmgrs.sceneMan.ChangeScene(new HelpScene());
				}
			}
		}
	}
}

// handles game logic
MenuScene.prototype.Process = function() {
	
}

// handles all drawing tasks
MenuScene.prototype.Render = function() {
	nmain.game.SetIdentity();
	this.mBatch.Render();
}

MenuScene.prototype.SetUpBatch = function() {
	this.mBatch.Clear();
	
	for (var i = 0; i < this.mButtonText.length; ++i) {
		this.mBatch.AddText(this.mButtonText[i]);
	}
	
	for (var i = 0; i < this.mButtons.length; ++i) {
		this.mBatch.AddSprite(this.mButtons[i]);
	}
}
// ...End


// HelpScene Class...
// self contained parts of the game such as different screens, levels or game modes
function HelpScene() {
	this.mPersist = false;
	
	this.mBatch = new RenderBatch();
	
	this.mText = new Array();
	this.mText[0] = new Text();
	
	this.mText[1] = new Text();
	this.mText[2] = new Text();
	
	this.mText[3] = new Text();
	this.mText[4] = new Text();
	this.mText[5] = new Text();
	
	this.mText[6] = new Text();
	this.mText[7] = new Text();
	this.mText[8] = new Text();
	this.mText[9] = new Text();
	
	this.mSprite = new Sprite();
}

// returns the type of this object for validity checking
HelpScene.prototype.Type = function() {
	return "HelpScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
HelpScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
HelpScene.prototype.SetUp = function() {
	nmain.game.mClearColour = "#604039";
	
	{
		this.mText[0].SetFontName("sans-serif");
		this.mText[0].SetFontSize(12);
		this.mText[0].mString = "Click anywhere to return to menu";
		this.mText[0].mDepth = -2000;
		this.mText[0].mShadow = true;
		
		this.mText[0].mPos.Set((nmain.game.mCanvasSize.mX / 2) - (this.mText[0].GetWidth() / 2), 12);
	}
	
	{
		this.mText[1].SetFontName("sans-serif");
		this.mText[1].SetFontSize(16);
		this.mText[1].mString = "Our Units";
		this.mText[1].mDepth = -2000;
		this.mText[1].mShadow = true;
		
		this.mText[1].mPos.Set(56, 80);
		
		this.mText[2].SetFontName("sans-serif");
		this.mText[2].SetFontSize(16);
		this.mText[2].mString = "Enemy Units";
		this.mText[2].mDepth = -2000;
		this.mText[2].mShadow = true;
		
		this.mText[2].mPos.Set(328, 80);
	}
	
	{
		this.mText[3].SetFontName("sans-serif");
		this.mText[3].SetFontSize(12);
		this.mText[3].mString = "Worker Creation Building\nbuild your extra worker\nunits here";
		this.mText[3].mDepth = -2000;
		this.mText[3].mShadow = true;
		
		this.mText[3].mPos.Set(160, 130);
		
		this.mText[4].SetFontName("sans-serif");
		this.mText[4].SetFontSize(12);
		this.mText[4].mString = "Pusher and Puller\nuse the worker units to move\nyour artillery and scout";
		this.mText[4].mDepth = -2000;
		this.mText[4].mShadow = true;
		
		this.mText[4].mPos.Set(160, 190);
		
		this.mText[5].SetFontName("sans-serif");
		this.mText[5].SetFontSize(12);
		this.mText[5].mString = "Artillery\nyour only offensive units which\nare immobile by themselves;\nlose these and lose the game;\nattack range is visible when unit\nis selected";
		this.mText[5].mDepth = -2000;
		this.mText[5].mShadow = true;
		
		this.mText[5].mPos.Set(160, 250);
	}
	
	{
		this.mText[6].SetFontName("sans-serif");
		this.mText[6].SetFontSize(12);
		this.mText[6].mString = "Ion Cannon\nlong range enemy building;\nthis is a primary target";
		this.mText[6].mDepth = -2000;
		this.mText[6].mShadow = true;
		
		this.mText[6].mPos.Set(420, 130);
		
		this.mText[7].SetFontName("sans-serif");
		this.mText[7].SetFontSize(12);
		this.mText[7].mString = "Scout Creation Building\nthe enemy produces scouts from here\nthis is a primary target";
		this.mText[7].mDepth = -2000;
		this.mText[7].mShadow = true;
		
		this.mText[7].mPos.Set(420, 190);
		
		this.mText[8].SetFontName("sans-serif");
		this.mText[8].SetFontSize(12);
		this.mText[8].mString = "Scout\npassive unit which seeks out player\nunits and stalks them, obstructing\ntheir movement and providing vision";
		this.mText[8].mDepth = -2000;
		this.mText[8].mShadow = true;
		
		this.mText[8].mPos.Set(420, 250);
		
		this.mText[9].SetFontName("sans-serif");
		this.mText[9].SetFontSize(12);
		this.mText[9].mString = "Targeting Indication\nif you see this then an enemy unit can\nattack any units on that tile; only visible\nwhen the player has vision of the\nattacking unit";
		this.mText[9].mDepth = -2000;
		this.mText[9].mShadow = true;
		
		this.mText[9].mPos.Set(420, 330);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("help_cheat");
		this.mSprite.SetTexture(tex);
		this.mSprite.mDepth = 500;
	}
	
	for (var i = 0; i < this.mText.length; ++i) {
		this.mBatch.AddText(this.mText[i]);
	}
	
	this.mBatch.AddSprite(this.mSprite);
}

// cleans up the scene object
HelpScene.prototype.TearDown = function() {
	
}

// handles user input
HelpScene.prototype.Input = function() {
	if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.left)) {
		nmgrs.sceneMan.ChangeScene(new MenuScene());
	}
}

// handles game logic
HelpScene.prototype.Process = function() {
	
}

// handles all drawing tasks
HelpScene.prototype.Render = function() {
	nmain.game.SetIdentity();
	this.mBatch.Render();
}
// ...End


// GameScene Class...
// self contained parts of the game such as different screens, levels or game modes
function GameScene() {
	this.mPersist = false;
	
	this.mCam = new Camera();
	this.mMap = new GFMap();
	
	this.mCanScroll = false;
	
	this.mTurn = 0;
	this.mEndPlayerTurn = 0;
	
	this.mGameUI = new GFGameUI();
	
	this.mUnitBatch = new RenderBatch();
	this.mGameEntities = new Array();
	
	this.mSelectID = -1;
	this.mPusherCount = 0;
	this.mPullerCount = 0;
	this.mScoutCount = 0;
	
	this.mEnemyLife = 0;
	this.mPlayerLife = 0;
	this.mGameEnd = false;
	this.mGameEndSprite = new Sprite();
	this.mGameEndText = new Text();
	this.mGameEndTimer = 200;
	
	this.mPlacementMode = false;
	this.mPlacementBounds = new Array();
	this.mPlacementHighlight = new Array();
	
	this.mTimerAction = 0;
	
	this.mDebug = new GFDebug();
	
	this.mMenuMapSize = 0;
	this.mMenuBaseSize = 0;
	this.mMenuSeed = 0;
}

// returns the type of this object for validity checking
GameScene.prototype.Type = function() {
	return "GameScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
GameScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
GameScene.prototype.SetUp = function() {
	nmain.game.mClearColour = "#604039";
	
	var mapGen = new GFMapGen();
	this.mMap = mapGen.GenerateMap(this.mMenuSeed, this.mMenuMapSize, this.mMenuBaseSize);
	
	this.mCam.mTranslate.Set(0 - ((nmain.game.mCanvasSize.mX - (this.mMap.mMapSize.mX * 32)) / 2),
			0 - ((nmain.game.mCanvasSize.mY - (this.mMap.mMapSize.mY * 32)) / 2));
	
	if (nmain.game.mCanvasSize.mY < this.mMap.mMapSize.mY * 32) {
		this.mCanScroll = true;
	}
	
	this.mTurn = 3;
	this.SetUpPlayerUnits();
	this.SetUpEnemyUnits();
	this.mGameUI.SetUp(this.mCam);
	this.mDebug.SetUp(new IVec2(0, nmain.game.mCanvasSize.mY - 128));
}

// cleans up the scene object
GameScene.prototype.TearDown = function() {
	
}

// handles user input
GameScene.prototype.Input = function() {
	if (this.mGameEnd == false) {
		if (this.mTurn == 1) { // if it is the player's turn
			{
				if (this.mCanScroll == true) {
					if (this.mCam.mTranslate.mY > -24) {
						if (nmgrs.inputMan.GetKeyboardDown(nkeyboard.key.code.up)) {
							this.mCam.mTranslate.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY - 2);
							
							this.mGameUI.UpdateUI(this.mCam);
							
							if (this.mSelectID >= 0) {
								this.mGameEntities[this.mSelectID].UpdateUI(this.mCam);
							}
						}
					}
					
					if (this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY < (this.mMap.mMapSize.mY * 32) + 24) {
						if (nmgrs.inputMan.GetKeyboardDown(nkeyboard.key.code.down)) {
							this.mCam.mTranslate.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY + 2);
							
							this.mGameUI.UpdateUI(this.mCam);
							
							if (this.mSelectID >= 0) {
								this.mGameEntities[this.mSelectID].UpdateUI(this.mCam);
							}
						}
					}
				}
				
				if (nmgrs.inputMan.GetKeyboardPressed(nkeyboard.key.code.d)) {
					// this.mDebug.mActive = !this.mDebug.mActive;
					this.mDebug.ToggleDebug();
				}
				
				if (nmgrs.inputMan.GetKeyboardPressed(nkeyboard.key.code.e)) {
					if (this.mEndPlayerTurn == 0) {
						this.mEndPlayerTurn = 100;
						this.mGameUI.mEndTurnSprite.SetCurrentFrame(0);
						
						if (this.mSelectID >= 0) {
							this.mGameEntities[this.mSelectID].SoftReset();
						}
					}
					else {
						this.mEndPlayerTurn = 0;
						this.mGameUI.mEndTurnSprite.SetCurrentFrame(1);
						this.mTurn = 2;
						
						this.mGameUI.SwitchTurn(1);
					}
				}
			}
			
			if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.left)) {
				this.mDebug.Input();
				
				// check if we are in placement mode or not
				if (this.mPlacementMode == true) {
					// the mouse cursor position offset by the current camera (view)
					var pt = new IVec2(0, 0);
					pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
					pt.mX += this.mCam.mTranslate.mX; pt.mY += this.mCam.mTranslate.mY;
					
					for (var i = 0; i < this.mPlacementBounds.length; i += 2) {
						if (util.PointInRectangle(pt, this.mPlacementBounds[i], this.mPlacementBounds[i + 1]) == true) {
							var pos = new IVec2();
							pos.Set(this.mPlacementBounds[i].mX / 32, this.mPlacementBounds[i].mY / 32);
							this.mGameEntities[this.mSelectID].PlacementCallback(this.mGameEntities[this.mSelectID].mPlacementInfo, this.mMap.PosToID(pos));
						}
					}
				}
				else {
					var uiClick = false;
					
					if (this.mSelectID >= 0) {
						uiClick = this.mGameEntities[this.mSelectID].ProcessUI(this.mCam);
					}
					
					// ui clicks take precedence over unit clicks - this handles any overlap between the elements
					if (uiClick == false) {
						this.OnEntityClick(uiClick);
					}
				}
			}
			else if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.middle)) {
				this.TogglePlacementMode(false);
				
				if (this.mSelectID >= 0) {
					this.mGameEntities[this.mSelectID].mSelected = false;
					this.mGameEntities[this.mSelectID].mUI.mShow = true;
					this.mGameEntities[this.mSelectID].SoftReset();
					this.mSelectID = -1;
				}
			}
			
			this.mGameUI.Input();
		}
	}
}

// handles game logic
GameScene.prototype.Process = function() {
	if (this.mGameEnd == false) {
		if (this.mPlayerLife == 0) {
			this.mGameEnd = true;
			
			var tex = nmgrs.resMan.mTexStore.GetResource("lose");
			this.mGameEndSprite.SetTexture(tex);
			this.mGameEndSprite.mPos.Set((nmain.game.mCanvasSize.mX / 2) - (this.mGameEndSprite.GetWidth() / 2),
					(nmain.game.mCanvasSize.mY / 2) - (this.mGameEndSprite.GetHeight() / 2));
			this.mGameEndSprite.mDepth = -500;
			
			this.mGameEndText.SetFontName("sans-serif");
			this.mGameEndText.SetFontSize(16);
			this.mGameEndText.mString = this.mGameEndTimer.toString();
			this.mGameEndText.mDepth = -500;
			this.mGameEndText.mPos.Set(this.mGameEndSprite.mPos.mX + (this.mGameEndSprite.GetWidth() / 2) - (this.mGameEndText.GetWidth() / 2),
					this.mGameEndSprite.mPos.mY + this.mGameEndSprite.GetHeight());
			
			this.mGameEndText.mColour = "#000000";
		}
		else if (this.mEnemyLife == 0) {
			this.mGameEnd = true;
			
			var tex = nmgrs.resMan.mTexStore.GetResource("won");
			this.mGameEndSprite.SetTexture(tex);
			this.mGameEndSprite.mPos.Set((nmain.game.mCanvasSize.mX / 2) - (this.mGameEndSprite.GetWidth() / 2),
					(nmain.game.mCanvasSize.mY / 2) - (this.mGameEndSprite.GetHeight() / 2));
			this.mGameEndSprite.mDepth = -500;
			
			this.mGameEndText.SetFontName("sans-serif");
			this.mGameEndText.SetFontSize(16);
			this.mGameEndText.mString = this.mGameEndTimer.toString();
			this.mGameEndText.mDepth = -500;
			this.mGameEndText.mPos.Set(this.mGameEndSprite.mPos.mX + (this.mGameEndSprite.GetWidth() / 2) - (this.mGameEndText.GetWidth() / 2),
					this.mGameEndSprite.mPos.mY + this.mGameEndSprite.GetHeight());
			
			this.mGameEndText.mColour = "#000000";
		}
		
		this.mMap.Process();
		this.mDebug.Process();
		this.HandleTurns();
		this.mGameUI.Process();
		
		for (var i = 0; i < this.mMap.mMapTiles.length; ++i) {
			this.mMap.mMapTiles[i].mFogSprite.Process();
		}
		
		for (var i = 0; i < this.mGameEntities.length; ++i) {
			this.mGameEntities[i].Process();
		}
		
		for (var i = 0; i < this.mPlacementHighlight.length; ++i) {
			this.mPlacementHighlight[i].Process();
		}
	}
	else {
		this.mGameEndTimer--;
		this.mGameEndText.mString = this.mGameEndTimer.toString();
		this.mGameEndText.mPos.Set(this.mGameEndSprite.mPos.mX + (this.mGameEndSprite.GetWidth() / 2) - (this.mGameEndText.GetWidth() / 2),
					this.mGameEndSprite.mPos.mY + this.mGameEndSprite.GetHeight());
		
		if (this.mGameEndTimer == 0) {
			nmgrs.sceneMan.ChangeScene(new MenuScene());
		}
	}
}

// handles all drawing tasks
GameScene.prototype.Render = function() {
	nmain.game.SetIdentity();
	
	if (this.mGameEnd == false) {
		this.mCam.Apply();
		this.mMap.mMapBatch.Render(this.mCam);
		
		{
			var arr = new Array();
			for (var i = 0; i < this.mGameEntities.length; ++i) {
				arr = arr.concat(this.mGameEntities[i].GetRender());
			}
			
			arr = arr.concat(this.mPlacementHighlight);
			arr = arr.concat(this.mMap.GetRender());
			
			this.mUnitBatch.Clear();
			
			for (var i = 0; i < arr.length; ++i) {
				if (arr[i].Type() == "Sprite") {
					this.mUnitBatch.AddSprite(arr[i]);
				}
				else if (arr[i].Type() == "Text") {
					this.mUnitBatch.AddText(arr[i]);
				}
				else if (arr[i].Type() == "Shape") {
					this.mUnitBatch.AddShape(arr[i]);
				}
			}
			
			this.mUnitBatch.Render(this.mCam);
		}
		
		{
			this.mGameUI.Render(this.mCam, this.mTurn, this.mMap.mMapSize.mY);
			this.mDebug.Render();
		}
	}
	else {
		this.mUnitBatch.Clear();
		this.mUnitBatch.AddSprite(this.mGameEndSprite);
		this.mUnitBatch.AddText(this.mGameEndText);
		this.mUnitBatch.Render();
	}
}

// handles turn logic
GameScene.prototype.HandleTurns = function() {
	// process ai turn
	if (this.mTurn == 0) {
		var aiDone = false;
		
		if (this.mTimerAction > 0) {
			this.mTimerAction--;
		}
		else {
			if (aiDone == false) {
				aiDone = true; // assume we're going to be finished after this iteration
				
				for (var i = 0; i < this.mGameEntities.length; ++i) {
					if (this.mGameEntities[i].mPlayerUnit == false) {
						if (this.mGameEntities[i].mMovesLeft > 0) {
							this.mGameEntities[i].PerformAIAction();
							
							aiDone = false; // we're not yet finished
							// this.mTimerAction = 20; // slow down ai when player has vision of the unit taking action
							break;
						}
					}
				}
			}
		}
		
		if (aiDone == true) {
			this.mTurn = 3;
			this.mGameUI.SwitchTurn(2);
		}
	}
	else if (this.mTurn == 1) { // process player turn
		if (this.mEndPlayerTurn > 0) {
			this.mEndPlayerTurn--;
			
			if (this.mEndPlayerTurn == 0) {
				this.mGameUI.mEndTurnSprite.SetCurrentFrame(1);
			}
		}
	}
	else if (this.mTurn == 2) { // intermediate between player -> ai (for setup)
		if (this.mGameUI.OnTurnStart()) {
			this.mTurn = 0;
			
			// reset the status of all entities
			for (var i = 0; i < this.mGameEntities.length; ++i) {
				this.mGameEntities[i].SetActive(true);
			}
			
			if (this.mSelectID >= 0) {
				this.mGameEntities[this.mSelectID].mSelected = false;
				this.mGameEntities[this.mSelectID].mUI.mShow = true;
				this.mGameEntities[this.mSelectID].SoftReset();
				this.mSelectID = -1;
			}
			
			this.TogglePlacementMode(false, null, null);
		}
	}
	else if (this.mTurn == 3) { // intermediate between ai -> player (for setup)
		if (this.mGameUI.OnTurnStart()) {
			this.mTurn = 1;
			
			// reset the status of all entities
			for (var i = 0; i < this.mGameEntities.length; ++i) {
				this.mGameEntities[i].SetActive(true);
			}
			
			if (this.mSelectID >= 0) {
				this.mGameEntities[this.mSelectID].mSelected = false;
				this.mGameEntities[this.mSelectID].mUI.mShow = true;
				this.mGameEntities[this.mSelectID].SoftReset();
				this.mSelectID = -1;
			}
			
			this.TogglePlacementMode(false, null, null);
		}
	}
}

// handles clicking units and buildings
GameScene.prototype.OnEntityClick = function(uiClick) {
	for (var i = 0; i < this.mGameEntities.length; ++i) {
		if (this.mGameEntities[i].mPlayerUnit == true) {
			if (this.mGameEntities[i].mActive == true) {
				// the mouse cursor position offset by the current camera (view)
				var pt = new IVec2(0, 0);
				pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
				pt.mX += this.mCam.mTranslate.mX; pt.mY += this.mCam.mTranslate.mY;
				
				// top left of the buildings boundbox
				var tl = new IVec2(0, 0);
				tl.Set(this.mGameEntities[i].mPos.mX * 32, this.mGameEntities[i].mPos.mY * 32);
				
				// bottom right of the buildings boundbox
				var br = new IVec2(0, 0);
				br.Set((this.mGameEntities[i].mPos.mX * 32) + this.mGameEntities[i].mBound.mSize.mX, (this.mGameEntities[i].mPos.mY * 32) + this.mGameEntities[i].mBound.mSize.mY);
				
				if (util.PointInRectangle(pt, tl, br) == true) {
					// check if this is already selected
					if (i != this.mSelectID) {
						// check if something is already selected
						if (this.mSelectID >= 0) {
							this.mGameEntities[this.mSelectID].mSelected = false; // deselect it
							this.mGameEntities[this.mSelectID].SoftReset();
						}
						
						this.mGameEntities[i].mSelected = true; // select this
						this.mGameEntities[i].UpdateUI(this.mCam);
						this.mSelectID = i;
						
						if (this.mGameEntities[i].Type() == "GFUnitArtillery") {
							this.mGameEntities[i].mShowFireZone = true;
						}
					}
					
					return true;
				}
			}
		}
	}
	
	// if we reach here, then an unoccupied part of the map was clicked
	
	// if we have a selected entity, unselect it
	/* if (this.mSelectID >= 0) {
		this.mGameEntities[this.mSelectID].mSelected = false;
		this.mGameEntities[this.mSelectID].SoftReset();
		this.mSelectID = -1;
	} */
	
	return false;
}

// 
GameScene.prototype.TogglePlacementMode = function(mode, bounds, hilite) {
	if (this.mPlacementMode != mode) {
		this.mPlacementMode = mode;
		
		if (this.mPlacementMode == true) {
			this.mPlacementBounds = this.mPlacementBounds.concat(bounds);
			this.mPlacementHighlight = this.mPlacementHighlight.concat(hilite);
		}
		else {
			this.mPlacementBounds.splice(0, this.mPlacementBounds.length);
			this.mPlacementHighlight.splice(0, this.mPlacementHighlight.length);
		}
	}
}

// 
GameScene.prototype.SetUpPlayerUnits = function() {
	{
		var workerProd = new GFBuildingWP();
		
		var id = (this.mMap.mBlueTiles.length / 3) * this.mMap.mRand.GetRandInt(1, 2);
		id = this.mMap.mRand.GetRandInt(0, (this.mMap.mBlueTiles.length / 3) - 2) + id;
		
		var pos = new IVec2(0, 0);
		pos.Copy(this.mMap.mBlueTiles[id]);
		
		workerProd.SetUp(this.mCam, pos);
		workerProd.AdjustFog(1);
		
		this.mGameEntities.push(workerProd);
		
		{
			var notFreeID = this.mMap.PosToID(pos);
			this.mMap.mMapTiles[notFreeID].mFree = false;
			this.mMap.mMapTiles[notFreeID + 1].mFree = false;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX].mFree = false;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX + 1].mFree = false;
			
			this.mMap.mMapTiles[notFreeID].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + 1].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX + 1].mEntityID = this.mGameEntities.length - 1;
		}
	}
	
	{
		var pusher = new GFUnitPusher();
		
		var id = this.mMap.mRand.GetRandInt(0, this.mMap.mBlueTiles.length - 1);
		var notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		
		while (this.mMap.mMapTiles[notFreeID].mFree == false) {
			id = (id + 1) % this.mMap.mBlueTiles.length;
			notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		}
		
		pusher.SetUp(this.mCam, this.mMap.mBlueTiles[id]);
		pusher.AdjustFog(1);
		
		this.mGameEntities.push(pusher);
		
		this.mMap.mMapTiles[notFreeID].mFree = false;
		this.mMap.mMapTiles[notFreeID].mEntityID = this.mGameEntities.length - 1;
		
		this.mPusherCount++;
	}
	
	{
		var puller = new GFUnitPuller();
		
		var id = this.mMap.mRand.GetRandInt(0, this.mMap.mBlueTiles.length - 1);
		var notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		
		while (this.mMap.mMapTiles[notFreeID].mFree == false) {
			id = (id + 1) % this.mMap.mBlueTiles.length;
			notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		}
		
		puller.SetUp(this.mCam, this.mMap.mBlueTiles[id]);
		puller.AdjustFog(1);
		
		this.mGameEntities.push(puller);
		
		this.mMap.mMapTiles[notFreeID].mFree = false;
		this.mMap.mMapTiles[notFreeID].mEntityID = this.mGameEntities.length - 1;
		
		this.mPullerCount++;
	}
	
	for (var i = 0; i < 2; ++i) {
		var arty = new GFUnitArtillery();
		
		var id = this.mMap.mRand.GetRandInt(0, this.mMap.mBlueTiles.length - 1);
		var notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		
		while (this.mMap.mMapTiles[notFreeID].mFree == false) {
			id = (id + 1) % this.mMap.mBlueTiles.length;
			notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		}
		
		arty.SetUp(this.mCam, this.mMap.mBlueTiles[id]);
		arty.AdjustFog(1);
		
		this.mGameEntities.push(arty);
		
		this.mMap.mMapTiles[notFreeID].mFree = false;
		this.mMap.mMapTiles[notFreeID].mEntityID = this.mGameEntities.length - 1;
		
		this.mPlayerLife++;
	}
}

// 
GameScene.prototype.SetUpEnemyUnits = function() {
	{
		var eScoutProd = new GFEBuildingSP();
		
		var pos = new IVec2(0, 0);
		
		eScoutProd.SetUp(pos);
		eScoutProd.AdjustFog(1);
		
		this.mGameEntities.push(eScoutProd);
		
		{
			var notFreeID = this.mMap.PosToID(pos);
			this.mMap.mMapTiles[notFreeID].mFree = false;
			this.mMap.mMapTiles[notFreeID + 1].mFree = false;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX].mFree = false;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX + 1].mFree = false;
			
			this.mMap.mMapTiles[notFreeID].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + 1].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX + 1].mEntityID = this.mGameEntities.length - 1;
		}
		
		this.mEnemyLife++;
	}
	
	{
		var eIonCan = new GFEBuildingIC();
		
		var pos = new IVec2(this.mMap.mMapSize.mX - 2, 0);
		
		eIonCan.SetUp(pos);
		eIonCan.AdjustFog(1);
		
		this.mGameEntities.push(eIonCan);
		
		{
			var notFreeID = this.mMap.PosToID(pos);
			this.mMap.mMapTiles[notFreeID].mFree = false;
			this.mMap.mMapTiles[notFreeID + 1].mFree = false;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX].mFree = false;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX + 1].mFree = false;
			
			this.mMap.mMapTiles[notFreeID].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + 1].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX + 1].mEntityID = this.mGameEntities.length - 1;
		}
		
		this.mEnemyLife++;
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
	
	this.mDoubleBuffered = false;
	this.mCanvas = new Array(); // an array of our canvases 
	this.mContext = new Array(); // an array of contexts (buffers)
	this.mBufferIter = 0; // our current buffer (context)
	
	this.mCurrContext = null; // reference to current buffer (context)
	
	this.mCanvasPos = new IVec2(); // position of the canvas on the page
	this.mCanvasSize = new IVec2(); // dimensions of the canvas
	
	this.mFPSIter = 0;
	this.mFPSAccum = 0;
	this.mFPS = 0;
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
	this.mCanvas[this.mBufferIter].style.visibility = 'visible'; // set current buffer to visible (display)
	
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
	this.mFPSAccum += dt;
	
	// while our accumulated time is greater than the frame limit
	while (this.mAccum > (1 / this.mFrameLimit)) {
		this.Process(); // process the game
		this.mAccum -= (1 / this.mFrameLimit); // decrease the accumulator
		
		// interpolate for smoother running, baby
		
		updateDisplay = true; // we need to redisplay
		
		
	}
	
	this.mFPSIter++;
	
	// if we need to redisplay
	if (updateDisplay == true) {
		this.Render(); // render the results
	}
	
	if (this.mFPSAccum > 1) {
		this.mFPS = this.mFPSIter / this.mFPSAccum;
		this.mFPSAccum = 0;
		this.mFPSIter = 0;
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
	if (this.mDoubleBuffered == true) {
		this.mCanvas[this.mBufferIter].style.visibility = 'visible'; // set current buffer to visible (display)
		
		this.mBufferIter = (this.mBufferIter + 1) % 2; // increment the buffer iterator
		this.mCurrContext = this.mContext[this.mBufferIter]; // set the current buffer
		this.mCanvas[this.mBufferIter].style.visibility = 'hidden'; // hide the current buffer (we are now drawing to it)
	}
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

// GFDebug Class...
// 
function GFDebug() {
	this.mPos = new IVec2(0, 0);
	this.mActive = false;
	
	this.mBatch = new RenderBatch();
	this.mSpriteArr = new Array();
	this.mStatusArr = new Array();
	
	this.mSpriteArr[0] = new Sprite();
	this.mStatusArr[0] = false;
	
	this.mSpriteArr[1] = new Sprite();
	this.mStatusArr[1] = true;
	
	this.mSpriteArr[2] = new Sprite();
	this.mStatusArr[2] = false;
	
	this.mSpriteArr[3] = new Sprite();
	this.mStatusArr[3] = false;
	
	this.mSpriteArr[4] = new Sprite();
	this.mStatusArr[4] = false;
}

GFDebug.prototype.SetUp = function(pos) {
	this.mPos.Copy(pos);
	var tex = nmgrs.resMan.mTexStore.GetResource("gui_debug");
	var frames = 10;
	
	{
		this.mSpriteArr[0].SetAnimatedTexture(tex, frames, frames / 2, -1, -1);
		this.mSpriteArr[0].mOrigin.Set(0, 0);
		this.mSpriteArr[0].mPos.Set(this.mPos.mX + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, 64 + this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[0].mDepth = -3000;
		this.mSpriteArr[0].SetCurrentFrame(0 + (frames / 2));
	}
	
	{
		this.mSpriteArr[1].SetAnimatedTexture(tex, frames, frames / 2, -1, -1);
		this.mSpriteArr[1].mOrigin.Set(0, 0);
		this.mSpriteArr[1].mPos.Set(this.mPos.mX + 72 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, 64 + this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[1].mDepth = -3000;
		this.mSpriteArr[1].SetCurrentFrame(1);
	}
	
	{
		this.mSpriteArr[2].SetAnimatedTexture(tex, frames, frames / 2, -1, -1);
		this.mSpriteArr[2].mOrigin.Set(0, 0);
		this.mSpriteArr[2].mPos.Set(this.mPos.mX + 144 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, 64 + this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[2].mDepth = -3000;
		this.mSpriteArr[2].SetCurrentFrame(2 + (frames / 2));
	}
	
	{
		this.mSpriteArr[3].SetAnimatedTexture(tex, frames, frames / 2, -1, -1);
		this.mSpriteArr[3].mOrigin.Set(0, 0);
		this.mSpriteArr[3].mPos.Set(this.mPos.mX + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[3].mDepth = -3000;
		this.mSpriteArr[3].SetCurrentFrame(3 + (frames / 2));
	}
	
	{
		this.mSpriteArr[4].SetAnimatedTexture(tex, frames, frames / 2, -1, -1);
		this.mSpriteArr[4].mOrigin.Set(0, 0);
		this.mSpriteArr[4].mPos.Set(this.mPos.mX + 72 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[4].mDepth = -3000;
		this.mSpriteArr[4].SetCurrentFrame(4 + (frames / 2));
	}
}

GFDebug.prototype.Input = function() {
	// on left click
	
	{
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		pt.mX += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX; pt.mY += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY;
		
		// top left of the buttons boundbox
		var tl = new IVec2(this.mSpriteArr[0].mPos.mX, this.mSpriteArr[0].mPos.mY);
		
		// bottom right of the buttons boundbox
		var br = new IVec2(this.mSpriteArr[0].mPos.mX + this.mSpriteArr[0].GetWidth(),
				this.mSpriteArr[0].mPos.mY + this.mSpriteArr[0].GetHeight());
		
		if (util.PointInRectangle(pt, tl, br) == true) {
			this.ToggleDebug();
		}
	}
	
	if (this.mActive == true) {
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		pt.mX += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX; pt.mY += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY;
		
		for (var i = 1; i < this.mSpriteArr.length; ++i) {
			// top left of the buttons boundbox
			var tl = new IVec2(this.mSpriteArr[i].mPos.mX, this.mSpriteArr[i].mPos.mY);
			
			// bottom right of the buttons boundbox
			var br = new IVec2(this.mSpriteArr[i].mPos.mX + this.mSpriteArr[i].GetWidth(),
					this.mSpriteArr[i].mPos.mY + this.mSpriteArr[i].GetHeight());
			
			if (util.PointInRectangle(pt, tl, br) == true) {
				this.mStatusArr[i] = !this.mStatusArr[i];
				if (this.mStatusArr[i] == true) {
					this.mSpriteArr[i].SetCurrentFrame(i);
				}
				else {
					this.mSpriteArr[i].SetCurrentFrame(i + (this.mSpriteArr[i].mNumFrames / 2));
				}
				
				if (i == 1) {
					nmgrs.sceneMan.mCurrScene.mMap.mShowFog = this.mStatusArr[i];
				}
				else if (i == 2) {
					for (var j = 0; j < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++j) {
						nmgrs.sceneMan.mCurrScene.mGameEntities[j].mShowBound = this.mStatusArr[i];
					}
				}
				else if (i == 3) {
					for (var j = 0; j < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++j) {
						if (nmgrs.sceneMan.mCurrScene.mGameEntities[j].mPlayerUnit == true) {
							nmgrs.sceneMan.mCurrScene.mGameEntities[j].mSuperMode = this.mStatusArr[i];
						}
					}
				}
				else if (i == 4) {
					nmgrs.sceneMan.mCurrScene.mGameUI.mShowDebug = this.mStatusArr[i];
				}
			}
		}
	}
}

GFDebug.prototype.Process = function() {
	this.mSpriteArr[0].mPos.Set(this.mPos.mX + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + 64 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
	
	if (this.mActive == true) {
		this.mSpriteArr[1].mPos.Set(this.mPos.mX + 72 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + 64 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[2].mPos.Set(this.mPos.mX + 144 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + 64 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[3].mPos.Set(this.mPos.mX + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
		this.mSpriteArr[4].mPos.Set(this.mPos.mX + 72 + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, this.mPos.mY + nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
	}
}

GFDebug.prototype.Render = function() {
	this.mBatch.Clear();
	
	this.mBatch.AddSprite(this.mSpriteArr[0]);
	
	if (this.mActive == true) {
		for (var i = 1; i < this.mSpriteArr.length; ++i) {
			this.mBatch.AddSprite(this.mSpriteArr[i]);
		}
	}
	
	this.mBatch.Render(nmgrs.sceneMan.mCurrScene.mCam);
}

GFDebug.prototype.ToggleDebug = function() {
	this.mStatusArr[0] = !this.mStatusArr[0];
	if (this.mStatusArr[0] == true) {
		this.mSpriteArr[0].SetCurrentFrame(0);
	}
	else {
		this.mSpriteArr[0].SetCurrentFrame(0 + (this.mSpriteArr[0].mNumFrames / 2));
	}
	
	nmgrs.sceneMan.mCurrScene.mDebug.mActive = !nmgrs.sceneMan.mCurrScene.mDebug.mActive;
}
// ...End


// GFMap Class...
// 
function GFMap() {
	this.mMapSize = new IVec2(0, 0);
	
	this.mMapTiles = new Array();
	this.mBlueTiles = new Array();
	this.mRedTiles = new Array();
	this.mRand = new RNG(0);
	
	this.mMapBatch = new RenderBatch();
	this.mShowFog = true;
	
	this.mTileExplosions = new Array();
};

GFMap.prototype.SetUp = function(size) {
	this.mMapSize.Copy(size);
	
	var iv = new IVec2(0, 0);
	var tex = nmgrs.resMan.mTexStore.GetResource("tile_set_default");
	var fog = nmgrs.resMan.mTexStore.GetResource("fog");
	
	for (var y = 0; y < this.mMapSize.mY; ++y) {
		for (var x = 0; x < this.mMapSize.mX; ++x) {
			iv.Set(x, y);
			var ind = x + (this.mMapSize.mX * y);
			this.mMapTiles[ind] = new GFMapTile(iv);
			this.mMapTiles[ind].mSprite.SetAnimatedTexture(tex, 25, 5, -1);
			this.mMapTiles[ind].mSprite.mOrigin.Set(8, 8);
			this.mMapTiles[ind].mSprite.mPos.Set(32 * x, 32 * y);
			this.mMapTiles[ind].mSprite.mDepth = 1000 + (this.mMapSize.mX * this.mMapSize.mY) - ind;
			this.mMapTiles[ind].mSprite.SetCurrentFrame(0);
			
			this.mMapTiles[ind].mFogSprite.SetAnimatedTexture(fog, 4, 4, 8 / nmain.game.mFrameLimit, -1);
			this.mMapTiles[ind].mFogSprite.mOrigin.Set(8, 8);
			this.mMapTiles[ind].mFogSprite.mPos.Set(32 * x, 32 * y);
			this.mMapTiles[ind].mFogSprite.mDepth = -1600 - ind;
		}
	}
}

GFMap.prototype.Process = function() {
	for (var i = 0; i < this.mTileExplosions.length; ++i) {
		this.mTileExplosions[i].Process();
		
		if (this.mTileExplosions[i].mNumLoops == 0) {
			this.mTileExplosions.splice(i, 1);
		}
	}
}

GFMap.prototype.IDToPos = function(id) {
	var pos = new IVec2(0, 0);
	pos.mY = Math.floor(id / this.mMapSize.mX);
	pos.mX = id - (this.mMapSize.mX * pos.mY);
	
	return pos;
}

GFMap.prototype.PosToID = function(pos) {
	var id = pos.mX + (this.mMapSize.mX * pos.mY);
	return id;
}

GFMap.prototype.GetRender = function() {
	var arr = new Array();
	
	if (this.mShowFog == true) {
		for (var y = 0; y < this.mMapSize.mY; ++y) {
			for (var x = 0; x < this.mMapSize.mX; ++x) {
				var ind = x + (this.mMapSize.mX * y);
				
				if (this.mMapTiles[ind].mFog == 0 && this.mMapTiles[ind].mSprite.mCurrFrame != 0) {
					arr.push(this.mMapTiles[ind].mFogSprite);
				}
			}
		}
	}
	
	for (var i = 0; i < this.mTileExplosions.length; ++i) {
		arr.push(this.mTileExplosions[i]);
	}
	
	return arr;
}

GFMap.prototype.AddExplosion = function(pos) {
	var spr = new Sprite();
	var tex = nmgrs.resMan.mTexStore.GetResource("explode");
	spr.SetAnimatedTexture(tex, 8, 4, 2 / nmain.game.mFrameLimit, 1);
	spr.mPos.Set(pos.mX * 32, pos.mY * 32);
	spr.mDepth = -550 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	
	this.mTileExplosions.push(spr);
}
// ...End


// GFMapTile Class...
// 
function GFMapTile(pos) {
	this.mPos = new IVec2(0, 0);
	this.mPos.Copy(pos);
	
	this.mSprite = new Sprite();
	this.mType = "";
	this.mFree = false;
	this.mEntityID = -1;
	
	this.mFogSprite = new Sprite();
	this.mFog = 0;
	this.mAIFog = 0;
	
	this.mBlankTile = true;
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
			
			numAnts = map.mRand.GetRandInt(2, 3);
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
			enemyBaseSize = 3;
		}
		else if (baseSize == "m") {
			enemyBaseSize = map.mRand.GetRandInt(3, 4);
		}
		else {
			enemyBaseSize = map.mRand.GetRandInt(4, 5);
		}
	}
	
	for (var i = 0; i < (dimX * enemyBaseSize); ++i) {
		var pos = new IVec2();
		pos.Copy(map.mMapTiles[i].mPos);
		map.mRedTiles.push(pos);
		
		map.mMapTiles[i].mSprite.SetCurrentFrame(map.mRand.GetRandInt(10, 14));
		map.mMapTiles[i].mFree = true;
		map.mMapTiles[i].mBlankTile = false;
		map.mMapTiles[i].mType = "red";
	}
	
	for (var i = (dimX * (dimY - 5)); i < (dimX * dimY); ++i) {
		map.mMapTiles[i].mSprite.SetCurrentFrame(map.mRand.GetRandInt(5, 9));
		map.mMapTiles[i].mFree = true;
		map.mMapTiles[i].mBlankTile = false;
	}
	
	{
		var midPoint = Math.floor(dimX / 2);
		
		for (var i = 2; i <= 4; ++i) {
			for (var j = lzLeft; j <= lzRight; ++j) {
				var tileID = (dimX * (dimY - i)) + midPoint + j;
				
				var pos = new IVec2();
				pos.Copy(map.mMapTiles[tileID].mPos);
				map.mBlueTiles.push(pos);
				
				map.mMapTiles[tileID].mSprite.SetCurrentFrame(map.mRand.GetRandInt(15, 19));
				map.mMapTiles[tileID].mFree = true;
				map.mMapTiles[tileID].mBlankTile = false;
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
					map.mMapTiles[id].mFree = true;
					map.mMapTiles[id].mBlankTile = false;
				}
			}
		}
	}
	
	for (var x = 0; x < map.mMapSize.mX; ++x) {
		for (var y = 0; y < map.mMapSize.mY; ++y) {
			var ind = x + (map.mMapSize.mX * y);
			map.mMapBatch.AddSprite(map.mMapTiles[ind].mSprite);
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


// GFUnitPusher Class...
// 
function GFUnitPusher() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mSelected = false;
	this.mActive = true;
	this.mPlayerUnit = true;
	
	this.mUI = new GFUnitUI();
	this.mPlacementInfo = "";
	
	this.mMovesLeft = 2;
	this.mMovesLeftSprite = new Sprite();
	
	this.mKillSwitch = 0;
	this.mKillConfirmA = new Text();
	this.mKillConfirmB = new Text();
	
	this.mSuperMode = false;
	
	this.mHealth = 2;
	this.mHealthText = new Text();
	this.mHealthBack = new Shape();
}

GFUnitPusher.prototype.Type = function() {
	return "GFUnitPusher";
};

GFUnitPusher.prototype.SetUp = function(camera, pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_pusher");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(0, 0);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_moves");
		this.mMovesLeftSprite.SetAnimatedTexture(tex, 3, 1, -1, -1);
		this.mMovesLeftSprite.mOrigin.Set((this.mMovesLeftSprite.GetWidth() / 2) - (this.mSprite.GetWidth() / 2), 6);
		this.mMovesLeftSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mMovesLeftSprite.SetCurrentFrame(0);
		this.mMovesLeftSprite.mDepth = -2000;
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(32, 0));
	this.mBound.AddPoint(new IVec2(32, 32));
	this.mBound.AddPoint(new IVec2(0, 32));
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_pusher");
		this.mUI.mSlotSprites[0].SetAnimatedTexture(tex, 4, 4, -1, -1);
		this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 292, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[0].mDepth = -9999;
		this.mUI.mSlotStatus[0] = true;
		
		var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
		this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
		
		this.mUI.mSlotSprites[1].SetAnimatedTexture(tex, 4, 4, -1, -1);
		this.mUI.mSlotSprites[1].SetCurrentFrame(1);
		this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[1].mDepth = -9999;
		this.mUI.mSlotStatus[1] = true;
		
		wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
		this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
		
		this.mUI.mSlotSprites[2].SetAnimatedTexture(tex, 4, 4, -1, -1);
		this.mUI.mSlotSprites[2].SetCurrentFrame(3);
		this.mUI.mSlotSprites[2].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[2].mDepth = -9999;
		this.mUI.mSlotStatus[2] = true;
		
		wOffset = (this.mUI.mSlotSprites[2].GetWidth() / 2) - (this.mUI.mSlotText[2].GetWidth() / 2);
		this.mUI.mSlotText[2].mPos.Set(this.mUI.mSlotSprites[2].mPos.mX + wOffset, this.mUI.mSlotSprites[2].mPos.mY);
	}
	
	{
		this.mKillConfirmA.SetFontName("sans-serif");
		this.mKillConfirmA.SetFontSize(12);
		this.mKillConfirmA.mString = "Press Again To";
		this.mKillConfirmA.mDepth = -9999;
		this.mKillConfirmA.mShadow = true;
		this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + 12);
		
		this.mKillConfirmB.SetFontName("sans-serif");
		this.mKillConfirmB.SetFontSize(32);
		this.mKillConfirmB.mString = "CONFIRM KILL UNIT";
		this.mKillConfirmB.mDepth = -9999;
		this.mKillConfirmB.mShadow = true;
		this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
	}
	
	{
		this.mHealthText.SetFontName("sans-serif");
		this.mHealthText.mColour = "#77AAFF";
		this.mHealthText.SetFontSize(12);
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthText.mDepth = -9994;
		this.mHealthText.mShadow = true;
		this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
		
		this.mHealthBack.mColour = "#000000";
		this.mHealthBack.mAlpha = 0.85;
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}

GFUnitPusher.prototype.Process = function() {
	this.mSprite.Process();
	
	if (this.mKillSwitch > 0) {
		this.mKillSwitch--;
		
		if (this.mKillSwitch == 0) {
			this.mUI.mSlotSprites[2].SetCurrentFrame(3);
		}
	}
}

GFUnitPusher.prototype.UpdateUI = function(camera) {
	this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 292, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
	this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
	
	this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
	this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	
	this.mUI.mSlotSprites[2].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[2].GetWidth() / 2) - (this.mUI.mSlotText[2].GetWidth() / 2);
	this.mUI.mSlotText[2].mPos.Set(this.mUI.mSlotSprites[2].mPos.mX + wOffset, this.mUI.mSlotSprites[2].mPos.mY);
	
	this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + 12);
	this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
}

GFUnitPusher.prototype.ProcessUI = function(camera) {
	if (this.mSelected == true) {
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		pt.mX += camera.mTranslate.mX; pt.mY += camera.mTranslate.mY;
		
		for (var i = 0; i < 4; ++i) {
			if (this.mUI.mSlotStatus[i] == true) {
				// top left of the buttons boundbox
				var tl = new IVec2(0, 0);
				tl.Set(this.mUI.mSlotSprites[i].mPos.mX, this.mUI.mSlotSprites[i].mPos.mY);
				
				// bottom right of the buttons boundbox
				var w = this.mUI.mSlotSprites[i].mTex.mImg.width;
				var h = this.mUI.mSlotSprites[i].mTex.mImg.height;
				
				if (this.mUI.mSlotSprites[i].mIsAnimated == true) {
					w = this.mUI.mSlotSprites[i].mClipSize.mX;
					h = this.mUI.mSlotSprites[i].mClipSize.mY;
				}
				
				var br = new IVec2(0, 0);
				br.Set(this.mUI.mSlotSprites[i].mPos.mX + w, this.mUI.mSlotSprites[i].mPos.mY + h);
				
				if (util.PointInRectangle(pt, tl, br) == true) {
					if (i == 0) {
						var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
						var boundsArr = new Array();
						var hiliteArr = new Array();
						var fogDepth = 0;
						
						var arr = new Array();
						arr = arr.concat(this.CheckValidMove());
						
						if (arr.length > 0) {
							for (var j = 0; j < arr.length; ++j) {
								var id = arr[j];
								var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
								
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
									fogDepth = 0;
									
									if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog == 0) {
										fogDepth = 3000;
									}
									
									var tl = new IVec2();
									tl.Set(pos.mX * 32, pos.mY * 32);
									boundsArr.push(tl);
									
									var br = new IVec2();
									br.Set((pos.mX * 32) + 32, (pos.mY * 32) + 32);
									boundsArr.push(br);
									
									var spr = new Sprite();
									spr.SetAnimatedTexture(tex, 8, 4, 3 / nmain.game.mFrameLimit, -1);
									spr.mOrigin.Set(8, 8);
									spr.mPos.Set(pos.mX * 32, pos.mY * 32);
									spr.mDepth = 999 - id - fogDepth;
									
									hiliteArr.push(spr);
								}
							}
							
							this.mPlacementInfo = "move";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
						}
					}
					else if (i == 1) {
						var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
						var boundsArr = new Array();
						var hiliteArr = new Array();
						var fogDepth = 0;
						
						var arr = new Array();
						arr = arr.concat(this.CheckValidPush());
						
						if (arr.length > 0) {
							for (var j = 0; j < arr.length; ++j) {
								var id = arr[j];
								var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
								
								fogDepth = 0;
								
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog == 0) {
									fogDepth = 3000;
								}
								
								var tl = new IVec2();
								tl.Set(pos.mX * 32, pos.mY * 32);
								boundsArr.push(tl);
								
								var br = new IVec2();
								br.Set((pos.mX * 32) + 32, (pos.mY * 32) + 32);
								boundsArr.push(br);
								
								var spr = new Sprite();
								spr.SetAnimatedTexture(tex, 8, 4, 3 / nmain.game.mFrameLimit, -1);
								spr.mOrigin.Set(8, 8);
								spr.mPos.Set(pos.mX * 32, pos.mY * 32);
								spr.mDepth = 999 - id - fogDepth;
								
								hiliteArr.push(spr);
							}
							
							this.mPlacementInfo = "push";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
						}
					}
					else if (i == 2) {
						if (this.mKillSwitch > 0) {
							this.DestroyUnit();
							
							this.mUI.mSlotSprites[2].SetCurrentFrame(3);
						}
						else {
							this.mKillSwitch = 100;
							nmgrs.sceneMan.mCurrScene.mEndPlayerTurn = 0;
							
							this.mUI.mSlotSprites[2].SetCurrentFrame(2);
							nmgrs.sceneMan.mCurrScene.mGameUI.mEndTurnSprite.SetCurrentFrame(1);
						}
					}
					else if (i == 3) {
						// button 4
					}
					
					return true;
				}
			}
		}
	}
	
	return false;
}

GFUnitPusher.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_pusher");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 2;
			this.mMovesLeftSprite.SetCurrentFrame(0);
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

GFUnitPusher.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	if (this.mSelected == true) {
		arr = arr.concat(this.mUI.GetRender());
		if (this.mUI.mShow == true) {
			arr.push(this.mMovesLeftSprite);
		}
		
		if (this.mKillSwitch > 0) {
			arr = arr.concat(this.mKillConfirmA);
			arr = arr.concat(this.mKillConfirmB);
		}
	}
	
	arr.push(this.mHealthBack);
	arr.push(this.mHealthText);
	
	return arr;
}

GFUnitPusher.prototype.PlacementCallback = function(info, id) {
	if (info == "move") {
		{ // move this
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = oldID;
			this.AdjustFog(-1); // adjust fog in current position
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - id;
			this.mMovesLeftSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.AdjustFog(1); // adjust fog in new position
			
			this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
			this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		}
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
		}
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		this.mUI.mShow = true;
		
		if (this.mMovesLeft == 0) {
			if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
				this.SetActive(false);
				this.mSelected = false;
				nmgrs.sceneMan.mCurrScene.mSelectID = -1;
			}
		}
		
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
	else if (info == "push") {
		var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
		
		var thisID = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		var otherID = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		
		var thisNewID = 0;
		var otherNewID = id;
		
		if (pos.mX < this.mPos.mX) {
			thisNewID = id + 1;
			otherID -= 1;
		}
		else if (pos.mX > this.mPos.mX) {
			thisNewID = id - 1;
			otherID += 1;
		}
		else if (pos.mY < this.mPos.mY) {
			thisNewID = id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
			otherID -= nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		}
		else if (pos.mY > this.mPos.mY) {
			thisNewID = id - nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
			otherID += nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		}
		
		{ // move other
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherID].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherID].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherID].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherNewID].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherNewID].mEntityID = oldID;
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].AdjustFog(-1); // adjust fog in current position
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(otherNewID));
			
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mDepth = -500 - otherID;
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mMovesLeftSprite.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mBound.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mFireZone.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].AdjustFog(1); // adjust fog in current position
			
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mHealthText.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.mX, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.mY);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mHealthBack.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.mX - 2, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.mY);
		}
		
		{ // move this
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisID].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisID].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisID].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisNewID].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisNewID].mEntityID = oldID;
			this.AdjustFog(-1); // adjust fog in current position
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(thisNewID));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - thisNewID;
			this.mMovesLeftSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.AdjustFog(1); // adjust fog in new position
			
			this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
			this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		}
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
		}
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		this.mUI.mShow = true;
		
		if (this.mMovesLeft == 0) {
			if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
				this.SetActive(false);
				this.mSelected = false;
				nmgrs.sceneMan.mCurrScene.mSelectID = -1;
			}
		}
		
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
}

GFUnitPusher.prototype.CheckValidMove = function() {
	var moveAmount = 3;
	if (this.mSuperMode == true) {
		moveAmount = nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
	}
	
	var closedTiles = new Array();
	var openTiles = new Array();
	openTiles.push(nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos));
	
	for (var j = 0; j < moveAmount + 1; ++j) {
		var pendingOpenTiles = new Array();
		
		while (openTiles.length > 0) {			
			// check tile to the left
			// if current tile isn't at 0 (left boundary)
			if ((openTiles[0] % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) > 0) {
				var idToCheck = openTiles[0] - 1;
				
				// if tile to the left is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// check tile above
			// if current tile isn't at 0 (top boundary)
			if (Math.floor(openTiles[0] / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) > 0) {
				var idToCheck = openTiles[0] - nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
				
				// if tile above is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// check tile to the right
			// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1 (right boundary)
			if ((openTiles[0] % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1) {
				var idToCheck = openTiles[0] + 1;
				
				// if tile to the right is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// check tile below
			// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1 (bottom boundary)
			if (Math.floor(openTiles[0] / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1) {
				var idToCheck = openTiles[0] + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
				
				// if tile below is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// add this id to the closed list
			closedTiles.push(openTiles[0]);
			
			// remove from the open list
			openTiles.splice(0, 1);
		}
		
		openTiles = openTiles.concat(pendingOpenTiles);
	}
	
	closedTiles.splice(0, 1);
	return closedTiles;
}

//
GFUnitPusher.prototype.CheckValidPush = function() {
	var moveAmount = 3;
	if (this.mSuperMode == true) {
		moveAmount = nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
	}
	
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	{ // check tile to the left
		var leftBound = id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		
		// if current tile isn't at 0 (left boundary)
		if (leftBound > 0) {
			// get tile to the left
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - 1].mEntityID;
			
			// if a unit exists on that tile
			if (entID > -1) {
				// if the unit is a valid pushable type
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0; // how tiles we have pushed it
					var idIter = 2; // the id we have pushed it to
					
					// while the tile is a valid move and we have moves left
					while ((leftBound - idIter >= 0) && (moveIter < moveAmount)) {
						// if already occuppied, we are done (obstacle hit)
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - idIter].mFree == false) {
							break;
						}
						
						arr.push(id - idIter); // add tile id to highlight array
						
						// increment iterators
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	{ // check tile above
		var topBound = Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX);
		
		// if current tile isn't at 0 (top boundary)
		if (topBound > 0) {
			// get tile above
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID;
			
			if (entID > -1) {
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0;
					var idIter = 2;
					
					// check spaces n above
					while ((topBound - idIter >= 0) && (moveIter < moveAmount)) {
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX)].mFree == false) {
							break;
						}
						
						arr.push(id - (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
						
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	{ // check tile to the right
		var rightBound = id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		
		// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1 (right boundary)
		if (rightBound < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1) {
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mEntityID;
			
			if (entID > -1) {
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0;
					var idIter = 2;
					
					// check spaces n above
					while ((rightBound + idIter <= nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1) && (moveIter < moveAmount)) {
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + idIter].mFree == false) {
							break;
						}
						
						arr.push(id + idIter);
						
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	{ // check tile below
		var bottomBound = Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX);
		
		// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1 (bottom boundary)
		if (bottomBound < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1) {
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID;
			
			if (entID > -1) {
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0;
					var idIter = 2;
					
					// check spaces n above
					while ((bottomBound + idIter <= nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1) && (moveIter < moveAmount)) {
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX)].mFree == false) {
							break;
						}
						
						arr.push(id + (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
						
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	return arr;
}

//
GFUnitPusher.prototype.SoftReset = function() {
	this.mKillSwitch = 0;
	this.mUI.mSlotSprites[2].SetCurrentFrame(3);
}

//
GFUnitPusher.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -2; y <= 2; ++y) {
		for (var x = -2; x <= 2; ++x) {
			if ((id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x >= 0 &&
					(id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) {
				
				if (Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y >= 0 &&
						Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					arr.push((id + x) + (y * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
				}
			}
		}
	}
	
	for (var i = 0; i < arr.length; ++i) {
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mFog += mode;
	}
}

//
GFUnitPusher.prototype.DestroyUnit = function() {
	this.SetActive(false);
	this.mSelected = false;
	
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
	
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mGameEntities.splice(entID, 1);
	
	for (var i = entID; i < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++i) {
		var nid = nmgrs.sceneMan.mCurrScene.mMap.PosToID(nmgrs.sceneMan.mCurrScene.mGameEntities[i].mPos);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid].mEntityID = i;
		
		if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFBuildingWP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingSP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingIC") {
			
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + 1].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = i;
		}
		else if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEUnitScout") {
			if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].mEntityFollowing == entID) {
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].mEntityFollowing = -1;
			}
		}
	}
	
	nmgrs.sceneMan.mCurrScene.mPusherCount--;
	this.AdjustFog(-1);
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
	
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(this.mPos);
}

//
GFUnitPusher.prototype.DecreaseHealth = function(amount) {
	this.mHealth -= amount;
	if (this.mHealth <= 0) {
		this.DestroyUnit();
	}
	else {
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		
		this.mHealthBack.Reset();
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}
// ...End


// GFUnitPuller Class...
// 
function GFUnitPuller() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mSelected = false;
	this.mActive = true;
	this.mPlayerUnit = true;
	
	this.mUI = new GFUnitUI();
	this.mPlacementInfo = "";
	
	this.mMovesLeft = 2;
	this.mMovesLeftSprite = new Sprite();
	
	this.mKillSwitch = 0;
	this.mKillConfirmA = new Text();
	this.mKillConfirmB = new Text();
	
	this.mSuperMode = false;
	
	this.mHealth = 2;
	this.mHealthText = new Text();
	this.mHealthBack = new Shape();
}

GFUnitPuller.prototype.Type = function() {
	return "GFUnitPuller";
};

GFUnitPuller.prototype.SetUp = function(camera, pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_puller");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(0, 0);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_moves");
		this.mMovesLeftSprite.SetAnimatedTexture(tex, 3, 1, -1, -1);
		this.mMovesLeftSprite.mOrigin.Set((this.mMovesLeftSprite.GetWidth() / 2) - (this.mSprite.GetWidth() / 2), 6);
		this.mMovesLeftSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mMovesLeftSprite.SetCurrentFrame(0);
		this.mMovesLeftSprite.mDepth = -2000;
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(32, 0));
	this.mBound.AddPoint(new IVec2(32, 32));
	this.mBound.AddPoint(new IVec2(0, 32));
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_puller");
		this.mUI.mSlotSprites[0].SetAnimatedTexture(tex, 4, 4, -1, -1);
		this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 292, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[0].mDepth = -9999;
		this.mUI.mSlotStatus[0] = true;
		
		var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
		this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
		
		this.mUI.mSlotSprites[1].SetAnimatedTexture(tex, 4, 4, -1, -1);
		this.mUI.mSlotSprites[1].SetCurrentFrame(1);
		this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[1].mDepth = -9999;
		this.mUI.mSlotStatus[1] = true;
		
		wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
		this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
		
		this.mUI.mSlotSprites[2].SetAnimatedTexture(tex, 4, 4, -1, -1);
		this.mUI.mSlotSprites[2].SetCurrentFrame(3);
		this.mUI.mSlotSprites[2].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[2].mDepth = -9999;
		this.mUI.mSlotStatus[2] = true;
		
		wOffset = (this.mUI.mSlotSprites[2].GetWidth() / 2) - (this.mUI.mSlotText[2].GetWidth() / 2);
		this.mUI.mSlotText[2].mPos.Set(this.mUI.mSlotSprites[2].mPos.mX + wOffset, this.mUI.mSlotSprites[2].mPos.mY);
	}
	
	{
		this.mKillConfirmA.SetFontName("sans-serif");
		this.mKillConfirmA.SetFontSize(12);
		this.mKillConfirmA.mString = "Press Again To";
		this.mKillConfirmA.mDepth = -9999;
		this.mKillConfirmA.mShadow = true;
		this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + 12);
		
		this.mKillConfirmB.SetFontName("sans-serif");
		this.mKillConfirmB.SetFontSize(32);
		this.mKillConfirmB.mString = "CONFIRM KILL UNIT";
		this.mKillConfirmB.mDepth = -9999;
		this.mKillConfirmB.mShadow = true;
		this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
	}
	
	{
		this.mHealthText.SetFontName("sans-serif");
		this.mHealthText.mColour = "#77AAFF";
		this.mHealthText.SetFontSize(12);
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthText.mDepth = -9994;
		this.mHealthText.mShadow = true;
		this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
		
		this.mHealthBack.mColour = "#000000";
		this.mHealthBack.mAlpha = 0.85;
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}

GFUnitPuller.prototype.Process = function() {
	this.mSprite.Process();
	
	if (this.mKillSwitch > 0) {
		this.mKillSwitch--;
		
		if (this.mKillSwitch == 0) {
			this.mUI.mSlotSprites[2].SetCurrentFrame(3);
		}
	}
}

GFUnitPuller.prototype.UpdateUI = function(camera) {
	this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 292, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
	this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
	
	this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
	this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	
	this.mUI.mSlotSprites[2].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[2].GetWidth() / 2) - (this.mUI.mSlotText[2].GetWidth() / 2);
	this.mUI.mSlotText[2].mPos.Set(this.mUI.mSlotSprites[2].mPos.mX + wOffset, this.mUI.mSlotSprites[2].mPos.mY);
	
	this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + 12);
	this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
}

GFUnitPuller.prototype.ProcessUI = function(camera) {
	if (this.mSelected == true) {
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		pt.mX += camera.mTranslate.mX; pt.mY += camera.mTranslate.mY;
		
		for (var i = 0; i < 4; ++i) {
			if (this.mUI.mSlotStatus[i] == true) {
				// top left of the buttons boundbox
				var tl = new IVec2(0, 0);
				tl.Set(this.mUI.mSlotSprites[i].mPos.mX, this.mUI.mSlotSprites[i].mPos.mY);
				
				// bottom right of the buttons boundbox
				var w = this.mUI.mSlotSprites[i].mTex.mImg.width;
				var h = this.mUI.mSlotSprites[i].mTex.mImg.height;
				
				if (this.mUI.mSlotSprites[i].mIsAnimated == true) {
					w = this.mUI.mSlotSprites[i].mClipSize.mX;
					h = this.mUI.mSlotSprites[i].mClipSize.mY;
				}
				
				var br = new IVec2(0, 0);
				br.Set(this.mUI.mSlotSprites[i].mPos.mX + w, this.mUI.mSlotSprites[i].mPos.mY + h);
				
				if (util.PointInRectangle(pt, tl, br) == true) {
					if (i == 0) {
						var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
						var boundsArr = new Array();
						var hiliteArr = new Array();
						var fogDepth = 0;
						
						var arr = new Array();
						arr = arr.concat(this.CheckValidMove());
						
						if (arr.length > 0) {
							for (var j = 0; j < arr.length; ++j) {
								var id = arr[j];
								var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
								
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
									fogDepth = 0;
									
									if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog == 0) {
										fogDepth = 3000;
									}
									
									var tl = new IVec2();
									tl.Set(pos.mX * 32, pos.mY * 32);
									boundsArr.push(tl);
									
									var br = new IVec2();
									br.Set((pos.mX * 32) + 32, (pos.mY * 32) + 32);
									boundsArr.push(br);
									
									var spr = new Sprite();
									spr.SetAnimatedTexture(tex, 8, 4, 3 / nmain.game.mFrameLimit, -1);
									spr.mOrigin.Set(8, 8);
									spr.mPos.Set(pos.mX * 32, pos.mY * 32);
									spr.mDepth = 999 - id - fogDepth;
									
									hiliteArr.push(spr);
								}
							}
							
							this.mPlacementInfo = "move";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
						}
					}
					else if (i == 1) {
						var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
						var boundsArr = new Array();
						var hiliteArr = new Array();
						var fogDepth = 0;
						
						var arr = new Array();
						arr = arr.concat(this.CheckValidPull());
						
						if (arr.length > 0) {
							for (var j = 0; j < arr.length; ++j) {
								var id = arr[j];
								var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
								
								fogDepth = 0;
								
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog == 0) {
									fogDepth = 3000;
								}
								
								var tl = new IVec2();
								tl.Set(pos.mX * 32, pos.mY * 32);
								boundsArr.push(tl);
								
								var br = new IVec2();
								br.Set((pos.mX * 32) + 32, (pos.mY * 32) + 32);
								boundsArr.push(br);
								
								var spr = new Sprite();
								spr.SetAnimatedTexture(tex, 8, 4, 3 / nmain.game.mFrameLimit, -1);
								spr.mOrigin.Set(8, 8);
								spr.mPos.Set(pos.mX * 32, pos.mY * 32);
								spr.mDepth = 999 - id - fogDepth;
								
								hiliteArr.push(spr);
							}
							
							this.mPlacementInfo = "pull";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
						}
					}
					else if (i == 2) {
						if (this.mKillSwitch > 0) {
							this.DestroyUnit();
							
							this.mUI.mSlotSprites[2].SetCurrentFrame(3);
						}
						else {
							this.mKillSwitch = 100;
							nmgrs.sceneMan.mCurrScene.mEndPlayerTurn = 0;
							
							this.mUI.mSlotSprites[2].SetCurrentFrame(2);
							nmgrs.sceneMan.mCurrScene.mGameUI.mEndTurnSprite.SetCurrentFrame(1);
						}
					}
					else if (i == 3) {
						// button 4
					}
					
					return true;
				}
			}
		}
	}
	
	return false;
}

GFUnitPuller.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_puller");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 2;
			this.mMovesLeftSprite.SetCurrentFrame(0);
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

GFUnitPuller.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	if (this.mSelected == true) {
		arr = arr.concat(this.mUI.GetRender());
		if (this.mUI.mShow == true) {
			arr.push(this.mMovesLeftSprite);
		}
		
		if (this.mKillSwitch > 0) {
			arr = arr.concat(this.mKillConfirmA);
			arr = arr.concat(this.mKillConfirmB);
		}
	}
	
	arr.push(this.mHealthBack);
	arr.push(this.mHealthText);
	
	return arr;
}

GFUnitPuller.prototype.PlacementCallback = function(info, id) {
	if (info == "move") {
		{ // move this
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = oldID;
			this.AdjustFog(-1); // adjust fog in current position
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - id;
			this.mMovesLeftSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.AdjustFog(1); // adjust fog in new position
			
			this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
			this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		}
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
		}
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		this.mUI.mShow = true;
		
		if (this.mMovesLeft == 0) {
			if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
				this.SetActive(false);
				this.mSelected = false;
				nmgrs.sceneMan.mCurrScene.mSelectID = -1;
			}
		}
		
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
	else if (info == "pull") {
		var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
		
		var thisID = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		var otherID = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		
		var thisNewID = id;
		var otherNewID = 0;
		
		if (pos.mX < this.mPos.mX) {
			otherNewID = id + 1;
			otherID += 1;
		}
		else if (pos.mX > this.mPos.mX) {
			otherNewID = id - 1;
			otherID -= 1;
		}
		else if (pos.mY < this.mPos.mY) {
			otherNewID = id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
			otherID += nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		}
		else if (pos.mY > this.mPos.mY) {
			otherNewID = id - nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
			otherID -= nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		}
		
		{ // move this
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisID].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisID].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisID].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisNewID].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[thisNewID].mEntityID = oldID;
			this.AdjustFog(-1); // adjust fog in current position
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(thisNewID));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - thisNewID;
			this.mMovesLeftSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.AdjustFog(1); // adjust fog in new position
			
			this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
			this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		}
		
		{ // move other
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherID].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherID].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherID].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherNewID].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[otherNewID].mEntityID = oldID;
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].AdjustFog(-1); // adjust fog in current position
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(otherNewID));
			
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mDepth = -500 - thisNewID;
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mMovesLeftSprite.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mBound.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mFireZone.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mX * 32, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mPos.mY * 32);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].AdjustFog(1); // adjust fog in current position
			
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mHealthText.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.mX, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.mY);
			nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mHealthBack.mPos.Set(nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.mX - 2, nmgrs.sceneMan.mCurrScene.mGameEntities[oldID].mSprite.mPos.mY);
		}
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
		}
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		this.mUI.mShow = true;
		
		if (this.mMovesLeft == 0) {
			if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
				this.SetActive(false);
				this.mSelected = false;
				nmgrs.sceneMan.mCurrScene.mSelectID = -1;
			}
		}
		
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
}

GFUnitPuller.prototype.CheckValidMove = function() {
	var moveAmount = 3;
	if (this.mSuperMode == true) {
		moveAmount = nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
	}
	
	var closedTiles = new Array();
	var openTiles = new Array();
	openTiles.push(nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos));
	
	for (var j = 0; j < moveAmount + 1; ++j) {
		var pendingOpenTiles = new Array();
		
		while (openTiles.length > 0) {			
			// check tile to the left
			// if current tile isn't at 0 (left boundary)
			if ((openTiles[0] % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) > 0) {
				var idToCheck = openTiles[0] - 1;
				
				// if tile to the left is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// check tile above
			// if current tile isn't at 0 (top boundary)
			if (Math.floor(openTiles[0] / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) > 0) {
				var idToCheck = openTiles[0] - nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
				
				// if tile above is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// check tile to the right
			// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1 (right boundary)
			if ((openTiles[0] % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1) {
				var idToCheck = openTiles[0] + 1;
				
				// if tile to the right is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// check tile below
			// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1 (bottom boundary)
			if (Math.floor(openTiles[0] / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1) {
				var idToCheck = openTiles[0] + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
				
				// if tile below is free (valid move)
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idToCheck].mFree == true) {
					// if tile isn't on either the closed or the open list
					var found = false;
					for (var k = 0; k < openTiles.length; ++k) {
						if (openTiles[k] == idToCheck) {
							found = true;
							break;
						}
					}
					
					if (found == false) {
						for (var k = 0; k < pendingOpenTiles.length; ++k) {
							if (pendingOpenTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						for (var k = 0; k < closedTiles.length; ++k) {
							if (closedTiles[k] == idToCheck) {
								found = true;
								break;
							}
						}
					}
					
					if (found == false) {
						pendingOpenTiles.push(idToCheck);
					}
				}
			}
			
			// add this id to the closed list
			closedTiles.push(openTiles[0]);
			
			// remove from the open list
			openTiles.splice(0, 1);
		}
		
		openTiles = openTiles.concat(pendingOpenTiles);
	}
	
	closedTiles.splice(0, 1);
	return closedTiles;
}

//
GFUnitPuller.prototype.CheckValidPull = function() {
	var moveAmount = 3;
	if (this.mSuperMode == true) {
		moveAmount = nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
	}
	
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	{ // check tile to the left
		var leftBound = id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		
		// if current tile isn't at 0 (left boundary)
		if (leftBound > 0) {
			// get tile to the left
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - 1].mEntityID;
			
			// if a unit exists on that tile
			if (entID > -1) {
				// if the unit is a valid pushable type
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0; // how tiles we have pushed it
					var idIter = 1; // the id we have pushed it to
					
					// while the tile is a valid move and we have moves left
					while ((leftBound + idIter <= nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1) && (moveIter < moveAmount)) {
						// if already occuppied, we are done (obstacle hit)
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + idIter].mFree == false) {
							break;
						}
						
						arr.push(id + idIter); // add tile id to highlight array
						
						// increment iterators
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	{ // check tile above
		var topBound = Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX);
		
		// if current tile isn't at 0 (top boundary)
		if (topBound > 0) {
			// get tile above
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID;
			
			if (entID > -1) {
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0;
					var idIter = 1;
					
					// check spaces n above
					while ((topBound + idIter <= nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1) && (moveIter < moveAmount)) {
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX)].mFree == false) {
							break;
						}
						
						arr.push(id + (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
						
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	{ // check tile to the right
		var rightBound = id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX;
		
		// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1 (right boundary)
		if (rightBound < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1) {
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mEntityID;
			
			if (entID > -1) {
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0;
					var idIter = 1;
					
					// check spaces n above
					while ((rightBound - idIter >= 0) && (moveIter < moveAmount)) {
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - idIter].mFree == false) {
							break;
						}
						
						arr.push(id - idIter);
						
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	{ // check tile below
		var bottomBound = Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX);
		
		// if current tile isn't at nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1 (bottom boundary)
		if (bottomBound < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1) {
			var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID;
			
			if (entID > -1) {
				if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery") {
					var moveIter = 0;
					var idIter = 1;
					
					// check spaces n above
					while ((bottomBound - idIter >= 0) && (moveIter < moveAmount)) {
						if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id - (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX)].mFree == false) {
							break;
						}
						
						arr.push(id - (idIter * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
						
						idIter++;
						moveIter++;
					}
				}
			}
		}
	}
	
	return arr;
}

//
GFUnitPuller.prototype.SoftReset = function() {
	this.mKillSwitch = 0;
	this.mUI.mSlotSprites[2].SetCurrentFrame(3);
}

//
GFUnitPuller.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -2; y <= 2; ++y) {
		for (var x = -2; x <= 2; ++x) {
			if ((id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x >= 0 &&
					(id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) {
				
				if (Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y >= 0 &&
						Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					arr.push((id + x) + (y * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
				}
			}
		}
	}
	
	for (var i = 0; i < arr.length; ++i) {
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mFog += mode;
	}
}

//
GFUnitPuller.prototype.DestroyUnit = function() {
	this.SetActive(false);
	this.mSelected = false;
	
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
	
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mGameEntities.splice(entID, 1);
	
	for (var i = entID; i < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++i) {
		var nid = nmgrs.sceneMan.mCurrScene.mMap.PosToID(nmgrs.sceneMan.mCurrScene.mGameEntities[i].mPos);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid].mEntityID = i;
		
		if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFBuildingWP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingSP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingIC") {
			
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + 1].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = i;
		}
		else if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEUnitScout") {
			if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].mEntityFollowing == entID) {
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].mEntityFollowing = -1;
			}
		}
	}
	
	nmgrs.sceneMan.mCurrScene.mPullerCount--;
	this.AdjustFog(-1);
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
	
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(this.mPos);
}

//
GFUnitPuller.prototype.DecreaseHealth = function(amount) {
	this.mHealth -= amount;
	if (this.mHealth <= 0) {
		this.DestroyUnit();
	}
	else {
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		
		this.mHealthBack.Reset();
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}
// ...End


// GFUnitArtillery Class...
// 
function GFUnitArtillery() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mSelected = false;
	this.mActive = true;
	this.mPlayerUnit = true;
	
	this.mUI = new GFUnitUI();
	this.mPlacementInfo = "";
	
	this.mMovesLeft = 1;
	this.mMovesLeftSprite = new Sprite();
	
	this.mKillSwitch = 0;
	this.mKillConfirmA = new Text();
	this.mKillConfirmB = new Text();
	
	this.mFireZone = new Sprite();
	this.mShowFireZone = true;
	
	this.mSuperMode = false;
	
	this.mHealth = 6;
	this.mHealthText = new Text();
	this.mHealthBack = new Shape();
}

GFUnitArtillery.prototype.Type = function() {
	return "GFUnitArtillery";
};

GFUnitArtillery.prototype.SetUp = function(camera, pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_arty");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(0, 0);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_moves");
		this.mMovesLeftSprite.SetAnimatedTexture(tex, 3, 1, -1, -1);
		this.mMovesLeftSprite.mOrigin.Set((this.mMovesLeftSprite.GetWidth() / 2) - (this.mSprite.GetWidth() / 2), 6);
		this.mMovesLeftSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mMovesLeftSprite.SetCurrentFrame(0);
		this.mMovesLeftSprite.mDepth = -2000;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("arty_firezone");
		this.mFireZone.SetTexture(tex);
		this.mFireZone.mOrigin.Set(128, 128);
		this.mFireZone.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mFireZone.mDepth = -2500;
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(32, 0));
	this.mBound.AddPoint(new IVec2(32, 32));
	this.mBound.AddPoint(new IVec2(0, 32));
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arty");
		this.mUI.mSlotSprites[0].SetAnimatedTexture(tex, 3, 3, -1, -1);
		this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[0].mDepth = -9999;
		this.mUI.mSlotStatus[0] = true;
		
		var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
		this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
		
		this.mUI.mSlotSprites[1].SetAnimatedTexture(tex, 3, 3, -1, -1);
		this.mUI.mSlotSprites[1].SetCurrentFrame(2);
		this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[1].mDepth = -9999;
		this.mUI.mSlotStatus[1] = true;
		
		wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
		this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	}
	
	{
		this.mKillConfirmA.SetFontName("sans-serif");
		this.mKillConfirmA.SetFontSize(12);
		this.mKillConfirmA.mString = "Press Again To";
		this.mKillConfirmA.mDepth = -9999;
		this.mKillConfirmA.mShadow = true;
		this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + 12);
		
		this.mKillConfirmB.SetFontName("sans-serif");
		this.mKillConfirmB.SetFontSize(32);
		this.mKillConfirmB.mString = "CONFIRM KILL UNIT";
		this.mKillConfirmB.mDepth = -9999;
		this.mKillConfirmB.mShadow = true;
		this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
	}
	
	{
		this.mHealthText.SetFontName("sans-serif");
		this.mHealthText.mColour = "#77AAFF";
		this.mHealthText.SetFontSize(12);
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthText.mDepth = -9994;
		this.mHealthText.mShadow = true;
		this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
		
		this.mHealthBack.mColour = "#000000";
		this.mHealthBack.mAlpha = 0.85;
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}

// 
GFUnitArtillery.prototype.Process = function() {
	this.mSprite.Process();
	
	if (this.mKillSwitch > 0) {
		this.mKillSwitch--;
		
		if (this.mKillSwitch == 0) {
			this.mUI.mSlotSprites[1].SetCurrentFrame(2);
		}
	}
}

//
GFUnitArtillery.prototype.UpdateUI = function(camera) {
	this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
	this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY);
	
	this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
	this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY);
	
	this.mKillConfirmA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmA.GetWidth() / 2), camera.mTranslate.mY + 12);
	this.mKillConfirmB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mKillConfirmB.GetWidth() / 2), camera.mTranslate.mY + this.mKillConfirmA.GetHeight() + 12);
}

//
GFUnitArtillery.prototype.ProcessUI = function(camera) {
	if (this.mSelected == true) {
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		pt.mX += camera.mTranslate.mX; pt.mY += camera.mTranslate.mY;
		
		for (var i = 0; i < 4; ++i) {
			if (this.mUI.mSlotStatus[i] == true) {
				// top left of the buttons boundbox
				var tl = new IVec2(0, 0);
				tl.Set(this.mUI.mSlotSprites[i].mPos.mX, this.mUI.mSlotSprites[i].mPos.mY);
				
				// bottom right of the buttons boundbox
				var w = this.mUI.mSlotSprites[i].mTex.mImg.width;
				var h = this.mUI.mSlotSprites[i].mTex.mImg.height;
				
				if (this.mUI.mSlotSprites[i].mIsAnimated == true) {
					w = this.mUI.mSlotSprites[i].mClipSize.mX;
					h = this.mUI.mSlotSprites[i].mClipSize.mY;
				}
				
				var br = new IVec2(0, 0);
				br.Set(this.mUI.mSlotSprites[i].mPos.mX + w, this.mUI.mSlotSprites[i].mPos.mY + h);
				
				if (util.PointInRectangle(pt, tl, br) == true) {
					if (i == 0) {
						var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite_fire");
						var boundsArr = new Array();
						var hiliteArr = new Array();
						
						var arr = new Array();
						arr = arr.concat(this.CheckValidFire());
						
						if (arr.length > 0) {
							for (var j = 0; j < arr.length; ++j) {
								var id = arr[j];
								var pos = nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id);
								
								var tl = new IVec2();
								tl.Set(pos.mX * 32, pos.mY * 32);
								boundsArr.push(tl);
								
								var br = new IVec2();
								br.Set((pos.mX * 32) + 32, (pos.mY * 32) + 32);
								boundsArr.push(br);
								
								var spr = new Sprite();
								spr.SetAnimatedTexture(tex, 8, 4, 3 / nmain.game.mFrameLimit, -1);
								spr.mOrigin.Set(8, 8);
								spr.mPos.Set(pos.mX * 32, pos.mY * 32);
								spr.mDepth = -2001 - id;
								
								hiliteArr.push(spr);
							}
							
							this.mPlacementInfo = "fire";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
							
							this.mShowFireZone = false;
						}
					}
					else if (i == 1) {
						if (this.mKillSwitch > 0) {
							this.DestroyUnit();
							
							this.mUI.mSlotSprites[1].SetCurrentFrame(2);
						}
						else {
							this.mKillSwitch = 100;
							nmgrs.sceneMan.mCurrScene.mEndPlayerTurn = 0;
							
							this.mUI.mSlotSprites[1].SetCurrentFrame(1);
							nmgrs.sceneMan.mCurrScene.mGameUI.mEndTurnSprite.SetCurrentFrame(1);
						}
					}
					else if (i == 2) {
						// button 3
					}
					else if (i == 3) {
						// button 4
					}
					
					return true;
				}
			}
		}
	}
	
	return false;
}

//
GFUnitArtillery.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_arty");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 1;
			this.mMovesLeftSprite.SetCurrentFrame(1);
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

//
GFUnitArtillery.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	if (this.mSelected == true) {
		arr = arr.concat(this.mUI.GetRender());
		if (this.mUI.mShow == true) {
			arr.push(this.mMovesLeftSprite);
		}
		
		if (this.mKillSwitch > 0) {
			arr = arr.concat(this.mKillConfirmA);
			arr = arr.concat(this.mKillConfirmB);
		}
		
		if (this.mShowFireZone) {
			arr.push(this.mFireZone);
		}
	}
	
	arr.push(this.mHealthBack);
	arr.push(this.mHealthText);
	
	return arr;
}

//
GFUnitArtillery.prototype.PlacementCallback = function(info, id) {
	if (info == "fire") {
		var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
		var amount = nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(3, 6);
		nmgrs.sceneMan.mCurrScene.mGameEntities[entID].DecreaseHealth(amount);
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
		}
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		this.mUI.mShow = true;
		this.mShowFireZone = true;
		
		if (this.mMovesLeft == 0) {
			if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
				this.SetActive(false);
				this.mSelected = false;
				nmgrs.sceneMan.mCurrScene.mSelectID = -1;
			}
		}
		
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
}

GFUnitArtillery.prototype.CheckValidFire = function() {
	var arr = new Array();
	
	var arrPos = new Array();
	var skip = false;
	
	for (var y = -4; y <= 4; ++y) {
		for (var x = -4; x <= 4; ++x) {
			if (y >= -2 && y <= 2) {
				if (x >= -2 && x <= 2) {
					skip = true;
				}
			}
			
			if (skip == false) {
				var pos = new IVec2(this.mPos.mX + x, this.mPos.mY + y);
				if (pos.mX >= 0 && pos.mX < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX &&
						pos.mY >= 0 && pos.mY < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					arrPos.push(pos);
				}
			}
			
			skip = false;
		}
	}
	
	for (var i = 0; i < arrPos.length; ++i) {
		var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(arrPos[i]);
		var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
		var fog = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog;
		
		if (this.mSuperMode == true) {
			fog = 1;
		}
		
		if (entID >= 0) {
			if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].mPlayerUnit == false && fog > 0) {
				arr.push(id);
			}
		}
	}
	
	return arr;
}

//
GFUnitArtillery.prototype.SoftReset = function() {
	this.mKillSwitch = 0;
	this.mUI.mSlotSprites[1].SetCurrentFrame(2);
}

//
GFUnitArtillery.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -2; y <= 2; ++y) {
		for (var x = -2; x <= 2; ++x) {
			if ((id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x >= 0 &&
					(id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) {
				
				if (Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y >= 0 &&
						Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					arr.push((id + x) + (y * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
				}
			}
		}
	}
	
	for (var i = 0; i < arr.length; ++i) {
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mFog += mode;
	}
}

//
GFUnitArtillery.prototype.DestroyUnit = function() {
	this.SetActive(false);
	this.mSelected = false;
	
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
	
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mGameEntities.splice(entID, 1);
	
	for (var i = entID; i < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++i) {
		var nid = nmgrs.sceneMan.mCurrScene.mMap.PosToID(nmgrs.sceneMan.mCurrScene.mGameEntities[i].mPos);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid].mEntityID = i;
		
		if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFBuildingWP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingSP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingIC") {
			
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + 1].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = i;
		}
		else if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEUnitScout") {
			if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].mEntityFollowing == entID) {
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].mEntityFollowing = -1;
			}
		}
	}
	
	nmgrs.sceneMan.mCurrScene.mPlayerLife--;
	this.AdjustFog(-1);
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
	
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(this.mPos);
}

//
GFUnitArtillery.prototype.DecreaseHealth = function(amount) {
	this.mHealth -= amount;
	if (this.mHealth <= 0) {
		this.DestroyUnit();
	}
	else {
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		
		this.mHealthBack.Reset();
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}
// ...End


// GFBuildingWP Class...
// 
function GFBuildingWP() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mSelected = false;
	this.mActive = true;
	this.mPlayerUnit = true;
	
	this.mUI = new GFUnitUI();
	this.mPlacementInfo = "";
	
	this.mMovesLeft = 1;
	this.mMovesLeftSprite = new Sprite();
	
	this.mSuperMode = false;
}

GFBuildingWP.prototype.Type = function() {
	return "GFBuildingWP";
};

GFBuildingWP.prototype.SetUp = function(camera, pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_workerprod");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(16, 20);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_moves");
		this.mMovesLeftSprite.SetAnimatedTexture(tex, 3, 1, -1, -1);
		this.mMovesLeftSprite.mOrigin.Set((this.mMovesLeftSprite.GetWidth() / 2) - (this.mSprite.GetWidth() / 4) - 6, 6);
		this.mMovesLeftSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mMovesLeftSprite.SetCurrentFrame(1);
		this.mMovesLeftSprite.mDepth = -2000;
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(64, 0));
	this.mBound.AddPoint(new IVec2(64, 64));
	this.mBound.AddPoint(new IVec2(0, 64));
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_workerprod");
		this.mUI.mSlotSprites[0].SetAnimatedTexture(tex, 2, 2, -1, -1);
		this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[0].mDepth = -9999;
		this.mUI.mSlotStatus[0] = true;
		this.mUI.mSlotText[0].mString = "0 / 2";
		this.mUI.mSlotText[0].mShadow = true;
		
		var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
		this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY - this.mUI.mSlotText[1].GetHeight());
		
		this.mUI.mSlotSprites[1].SetAnimatedTexture(tex, 2, 2, -1, -1);
		this.mUI.mSlotSprites[1].SetCurrentFrame(1);
		this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mUI.mSlotSprites[1].mDepth = -9999;
		this.mUI.mSlotStatus[1] = true;
		this.mUI.mSlotText[1].mString = "0 / 2";
		this.mUI.mSlotText[1].mShadow = true;
		
		wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
		this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY - this.mUI.mSlotText[1].GetHeight());
	}
}

GFBuildingWP.prototype.Process = function() {
	this.mSprite.Process();
}

GFBuildingWP.prototype.UpdateUI = function(camera) {
	this.mUI.mSlotSprites[0].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 220, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	var wOffset = (this.mUI.mSlotSprites[0].GetWidth() / 2) - (this.mUI.mSlotText[0].GetWidth() / 2);
	this.mUI.mSlotText[0].mPos.Set(this.mUI.mSlotSprites[0].mPos.mX + wOffset, this.mUI.mSlotSprites[0].mPos.mY - this.mUI.mSlotText[0].GetHeight());
	
	this.mUI.mSlotSprites[1].mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 148, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	wOffset = (this.mUI.mSlotSprites[1].GetWidth() / 2) - (this.mUI.mSlotText[1].GetWidth() / 2);
	this.mUI.mSlotText[1].mPos.Set(this.mUI.mSlotSprites[1].mPos.mX + wOffset, this.mUI.mSlotSprites[1].mPos.mY - this.mUI.mSlotText[1].GetHeight());
}

GFBuildingWP.prototype.ProcessUI = function(camera) {
	if (this.mSelected == true) {
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		pt.mX += camera.mTranslate.mX; pt.mY += camera.mTranslate.mY;
		
		for (var i = 0; i < 4; ++i) {
			if (this.mUI.mSlotStatus[i] == true) {
				// top left of the buttons boundbox
				var tl = new IVec2(0, 0);
				tl.Set(this.mUI.mSlotSprites[i].mPos.mX, this.mUI.mSlotSprites[i].mPos.mY);
				
				// bottom right of the buttons boundbox
				var w = this.mUI.mSlotSprites[i].mTex.mImg.width;
				var h = this.mUI.mSlotSprites[i].mTex.mImg.height;
				
				if (this.mUI.mSlotSprites[i].mIsAnimated == true) {
					w = this.mUI.mSlotSprites[i].mClipSize.mX;
					h = this.mUI.mSlotSprites[i].mClipSize.mY;
				}
				
				var br = new IVec2(0, 0);
				br.Set(this.mUI.mSlotSprites[i].mPos.mX + w, this.mUI.mSlotSprites[i].mPos.mY + h);
				
				if (util.PointInRectangle(pt, tl, br) == true) {
					if (i == 0) {
						if (nmgrs.sceneMan.mCurrScene.mPusherCount < 2 || this.mSuperMode == true) {
							var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
							var boundsArr = new Array();
							var hiliteArr = new Array();
							var fogDepth = 0;
							
							for (var j = 0; j < nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles.length; ++j) {
								var pos = nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j];
								var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
									fogDepth = 0;
									
									if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog == 0) {
										fogDepth = 3000;
									}
									
									var tl = new IVec2();
									tl.Set(nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32, nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32);
									boundsArr.push(tl);
									
									var br = new IVec2();
									br.Set((nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32) + 32, (nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32) + 32);
									boundsArr.push(br);
									
									var spr = new Sprite();
									spr.SetAnimatedTexture(tex, 8, 4, 3 / nmain.game.mFrameLimit, -1);
									spr.mOrigin.Set(8, 8);
									spr.mPos.Set(nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32, nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32);
									spr.mDepth = 999 + (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) - id - fogDepth;
									
									hiliteArr.push(spr);
								}
							}
							
							this.mPlacementInfo = "create_pusher";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
						}
					}
					else if (i == 1) {
						if (nmgrs.sceneMan.mCurrScene.mPullerCount < 2 || this.mSuperMode == true) {
							var tex = nmgrs.resMan.mTexStore.GetResource("tile_hilite");
							var boundsArr = new Array();
							var hiliteArr = new Array();
							var fogDepth = 0;
							
							for (var j = 0; j < nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles.length; ++j) {
								var pos = nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j];
								var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
								if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == true) {
									fogDepth = 0;
									
									if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog == 0) {
										fogDepth = 3000;
									}
									
									var tl = new IVec2();
									tl.Set(nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32, nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32);
									boundsArr.push(tl);
									
									var br = new IVec2();
									br.Set((nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32) + 32, (nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32) + 32);
									boundsArr.push(br);
									
									var spr = new Sprite();
									spr.SetAnimatedTexture(tex, 8, 4, 3 / nmain.game.mFrameLimit, -1);
									spr.mOrigin.Set(8, 8);
									spr.mPos.Set(nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mX * 32, nmgrs.sceneMan.mCurrScene.mMap.mBlueTiles[j].mY * 32);
									spr.mDepth = 999 + (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) - id - fogDepth;
									
									hiliteArr.push(spr);
								}
							}
							
							this.mPlacementInfo = "create_puller";
							nmgrs.sceneMan.mCurrScene.TogglePlacementMode(true, boundsArr, hiliteArr);
							this.mUI.mShow = false;
						}
					}
					else if (i == 2) {
						// button 3
					}
					else if (i == 3) {
						// button 4
					}
					
					return true;
				}
			}
		}
	}
	
	return false;
}

GFBuildingWP.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_workerprod");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 1;
			this.mMovesLeftSprite.SetCurrentFrame(1);
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

GFBuildingWP.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	if (this.mSelected == true) {
		this.mUI.mSlotText[0].mString = nmgrs.sceneMan.mCurrScene.mPusherCount + " / 2";
		this.mUI.mSlotText[1].mString = nmgrs.sceneMan.mCurrScene.mPullerCount + " / 2";
		
		arr = arr.concat(this.mUI.GetRender());
		if (this.mUI.mShow == true) {
			arr.push(this.mMovesLeftSprite);
		}
	}
	
	return arr;
}

GFBuildingWP.prototype.PlacementCallback = function(info, id) {
	if (info == "create_pusher") {
		var pusher = new GFUnitPusher();
		pusher.SetUp(nmgrs.sceneMan.mCurrScene.mCam, nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
		pusher.SetActive(false);
		pusher.AdjustFog(1);
		nmgrs.sceneMan.mCurrScene.mGameEntities.push(pusher);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1;
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
		}
		else {
			nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1].SetActive(true);
			nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1].mSuperMode = true;
		}
		
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		this.mUI.mShow = true;
		
		if (this.mMovesLeft == 0) {
			if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
				this.SetActive(false);
				this.mSelected = false;
				nmgrs.sceneMan.mCurrScene.mSelectID = -1;
			}
		}
		
		nmgrs.sceneMan.mCurrScene.mPusherCount++;
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
	else if (info == "create_puller") {
		var puller = new GFUnitPuller();
		puller.SetUp(nmgrs.sceneMan.mCurrScene.mCam, nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
		puller.SetActive(false);
		puller.AdjustFog(1);
		nmgrs.sceneMan.mCurrScene.mGameEntities.push(puller);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1;
		
		if (this.mSuperMode == false) {
			this.mMovesLeft--;
		}
		else {
			nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1].SetActive(true);
			nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1].mSuperMode = true;
		}
		
		this.mMovesLeftSprite.SetCurrentFrame(2 - this.mMovesLeft);
		
		this.mUI.mShow = true;
		
		if (this.mMovesLeft == 0) {
			if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
				this.SetActive(false);
				this.mSelected = false;
				nmgrs.sceneMan.mCurrScene.mSelectID = -1;
			}
		}
		
		nmgrs.sceneMan.mCurrScene.mPullerCount++;
		this.mPlacementInfo = "";
		nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false, null, null);
	}
}

//
GFBuildingWP.prototype.SoftReset = function() {
	
}

//
GFBuildingWP.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -3; y <= 4; ++y) {
		for (var x = -3; x <= 4; ++x) {
			if ((id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x >= 0 &&
					(id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) {
				
				if (Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y >= 0 &&
						Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					arr.push((id + x) + (y * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
				}
			}
		}
	}
	
	for (var i = 0; i < arr.length; ++i) {
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mFog += mode;
	}
}

//
GFBuildingWP.prototype.DestroyUnit = function() {
	this.SetActive(false);
	this.mSelected = false;
	
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
	
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mGameEntities.splice(entID, 1);
	
	for (var i = entID; i < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++i) {
		var nid = nmgrs.sceneMan.mCurrScene.mMap.PosToID(nmgrs.sceneMan.mCurrScene.mGameEntities[i].mPos);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid].mEntityID = i;
		
		if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFBuildingWP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingSP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingIC") {
			
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + 1].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = i;
		}
	}
	
	this.AdjustFog(-1);
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
	
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(this.mPos);
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX + 1, this.mPos.mY));
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX, this.mPos.mY + 1));
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX + 1, this.mPos.mY + 1));
}
// ...End


// GFEUnitScout Class...
// 
function GFEUnitScout() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mActive = true;
	this.mPlayerUnit = false;
	
	this.mMovesLeft = 2;
	
	this.mCurrentAction = "";
	this.mEntityFollowing = -1;
	
	this.mHealth = 1;
	this.mHealthText = new Text();
	this.mHealthBack = new Shape();
}

GFEUnitScout.prototype.Type = function() {
	return "GFEUnitScout";
};

GFEUnitScout.prototype.SetUp = function(pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_enemyscout");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(0, 0);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(32, 0));
	this.mBound.AddPoint(new IVec2(32, 32));
	this.mBound.AddPoint(new IVec2(0, 32));
	
	{
		this.mHealthText.SetFontName("sans-serif");
		this.mHealthText.mColour = "#FFAA77";
		this.mHealthText.SetFontSize(12);
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthText.mDepth = -9994;
		this.mHealthText.mShadow = true;
		this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
		
		this.mHealthBack.mColour = "#000000";
		this.mHealthBack.mAlpha = 0.85;
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}

GFEUnitScout.prototype.Process = function() {
	this.mSprite.Process();
}

GFEUnitScout.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_u_enemyscout");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 2;
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

GFEUnitScout.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	{
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog > 0) {
			arr.push(this.mHealthBack);
			arr.push(this.mHealthText);
		}
	}
	
	return arr;
}

GFEUnitScout.prototype.PerformAIAction = function() {
	if (this.mCurrentAction == "FindUnit") {
		this.FindUnit();
	}
	else if (this.mCurrentAction == "ReturnToBase") {
		this.ReturnToBase();
	}
	else if (this.mCurrentAction == "FollowUnit") {
		this.FollowUnit();
	}
	
	this.mMovesLeft--;
}

GFEUnitScout.prototype.FindUnit = function() {	
	// the scout will travel down (and to an extent across) the map attempting to locate a player's unit
	// to follow and provide scouting information
	
	// responses
	// FollowUnit(): a unit was found so now we attempt to follow it
	// FindUnit(): we haven't yet found a unit so keep trying
	// ReturnToBase(): we didn't find a unit and we reached the bottom of the map so return to base (top)
	
	var moveAmount = 3;
	
	var as = new AStar();
	as.SetUp(nmgrs.sceneMan.mCurrScene.mMap.mMapSize);
	for (var i = 0; i < nmgrs.sceneMan.mCurrScene.mMap.mMapTiles.length; ++i) {
		as.mMap[i].mValid = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[i].mFree;
	}
	
	var path = new Array();
	var start = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var end = nmgrs.sceneMan.mCurrScene.mMap.PosToID(new IVec2(nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(0, nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1), nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY - 1));
	path = as.FindPath(start, end);
	
	var id = (path.length - 1) - moveAmount;
	
	// if not true then we can't even move 1 tile!
	if (path.length > 1) {
		if (id < 0) {
			id = path.length - 1;
		}
		
		id = path[id];
		
		{ // move this
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = oldID;
			this.AdjustFog(-1);
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - id;
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.AdjustFog(1);
			
			this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
			this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		}
	}
	
	
	var idFollow = -1;
	{
		var breakLoop = false;
		var idThis = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		
		for (var y = -1; y <= 1; ++y) {
			for (var x = -1; x <= 1; ++x) {
				if ((idThis % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x >= 0 &&
						(idThis % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) {
					
					if (Math.floor(idThis / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y >= 0 &&
							Math.floor(idThis / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
						
						var idCheck = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[(idThis + x) + (y * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX)].mEntityID;
						if (idCheck >= 0) {
							if (nmgrs.sceneMan.mCurrScene.mGameEntities[idCheck].Type() == "GFUnitPusher" ||
									nmgrs.sceneMan.mCurrScene.mGameEntities[idCheck].Type() == "GFUnitPuller" ||
									nmgrs.sceneMan.mCurrScene.mGameEntities[idCheck].Type() == "GFUnitArtillery") {
								
								idFollow = idCheck;
								breakLoop = true;
								break;
							}
						}
					}
				}
			}
			
			if (breakLoop == true) {
				break;
			}
		}
	}
	
	if (idFollow > 0) {
		this.mEntityFollowing = idFollow;
		this.mCurrentAction = "FollowUnit";
	}
	else if (this.mPos.mY == nmgrs.sceneMan.mCurrScene.mMap.IDToPos(end).mY) {
		this.mCurrentAction = "ReturnToBase";
	}
	else {
		this.mCurrentAction = "FindUnit";
	}
}

GFEUnitScout.prototype.ReturnToBase = function() {	
	// the scout will travel upwards trying to get back to it's base upon
	// which it will then continue seeking units
	
	// responses
	// ReturnToBase(): we haven't reached base yet so keep trying
	// FindUnit(): we've reached base so now seek out a unit to follow again
	
	var moveAmount = 3;
	
	var as = new AStar();
	as.SetUp(nmgrs.sceneMan.mCurrScene.mMap.mMapSize);
	for (var i = 0; i < nmgrs.sceneMan.mCurrScene.mMap.mMapTiles.length; ++i) {
		as.mMap[i].mValid = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[i].mFree;
	}
	
	var path = new Array();
	var start = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var end = nmgrs.sceneMan.mCurrScene.mMap.PosToID(new IVec2(nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(0, nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX - 1), 2));
	path = as.FindPath(start, end);
	
	var id = (path.length - 1) - moveAmount;
	
	// if not true then we can't even move 1 tile!
	if (path.length > 1) {
		if (id < 0) {
			id = path.length - 1;
		}
		
		id = path[id];
		
		{ // move this
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mFree = true;
			var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID = -1;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = oldID;
			this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
			
			this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			this.mSprite.mDepth = -500 - id;
			this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
			
			this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
			this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		}
	}
	
	if (this.mPos.mY == 2) {
		this.mCurrentAction = "FindUnit";
	}
	else {
		this.mCurrentAction = "ReturnToBase";
	}
}

GFEUnitScout.prototype.FollowUnit = function() {
	if (this.mEntityFollowing < 0) {
		this.mCurrentAction = "ReturnToBase";
		this.ReturnToBase();
	}
	else {
		var moveAmount = 3;
		
		var as = new AStar();
		as.SetUp(nmgrs.sceneMan.mCurrScene.mMap.mMapSize);
		for (var i = 0; i < nmgrs.sceneMan.mCurrScene.mMap.mMapTiles.length; ++i) {
			as.mMap[i].mValid = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[i].mFree;
		}
		
		var path = new Array();
		var start = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		var end = nmgrs.sceneMan.mCurrScene.mMap.PosToID(nmgrs.sceneMan.mCurrScene.mGameEntities[this.mEntityFollowing].mPos);
		path = as.FindPath(start, end);
		
		if (path.length > 12) { // break off the chase
			this.mEntityFollowing = -1;
			this.mCurrentAction = "ReturnToBase";
			this.ReturnToBase();
		}
		else {
			var id = (path.length - 1) - moveAmount;
			
			// if not true then we can't even move 1 tile!
			if (path.length > 1) {
				if (id < 0) {
					id = path.length - 1;
				}
				
				id = path[id];
				
				{ // move this
					nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mFree = true;
					var oldID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID;
					nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos)].mEntityID = -1;
					nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
					nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = oldID;
					this.mPos.Copy(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
					
					this.mSprite.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
					this.mSprite.mDepth = -500 - id;
					this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
					
					this.mHealthText.mPos.Set(this.mSprite.mPos.mX, this.mSprite.mPos.mY);
					this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
				}
			}
		}
	}
}

//
GFEUnitScout.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -1; y <= 1; ++y) {
		for (var x = -1; x <= 1; ++x) {
			if ((id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x >= 0 &&
					(id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) {
				
				if (Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y >= 0 &&
						Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					arr.push((id + x) + (y * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
				}
			}
		}
	}
	
	for (var i = 0; i < arr.length; ++i) {
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mAIFog += mode;
	}
}

//
GFEUnitScout.prototype.DestroyUnit = function() {
	this.SetActive(false);
	this.mSelected = false;
	
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
	
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mGameEntities.splice(entID, 1);
	
	for (var i = entID; i < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++i) {
		var nid = nmgrs.sceneMan.mCurrScene.mMap.PosToID(nmgrs.sceneMan.mCurrScene.mGameEntities[i].mPos);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid].mEntityID = i;
		
		if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFBuildingWP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingSP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingIC") {
			
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + 1].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = i;
		}
	}
	
	this.AdjustFog(-1);
	nmgrs.sceneMan.mCurrScene.mScoutCount--;
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
	
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(this.mPos);
}

//
GFEUnitScout.prototype.DecreaseHealth = function(amount) {
	this.mHealth -= amount;
	if (this.mHealth <= 0) {
		this.DestroyUnit();
	}
	else {
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2, this.mSprite.mPos.mY);
		
		this.mHealthBack.Reset();
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}
// ...End


// GFEBuildingSP Class...
// 
function GFEBuildingSP() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mActive = true;
	this.mPlayerUnit = false;
	
	this.mMovesLeft = 1;
	
	this.mCurrentAction = "";
	this.mTurnsUntilSpawn = 0;
	this.mScoutLimit = 6;
	
	this.mHealth = 10;
	this.mHealthText = new Text();
	this.mHealthBack = new Shape();
}

GFEBuildingSP.prototype.Type = function() {
	return "GFEBuildingSP";
};

GFEBuildingSP.prototype.SetUp = function(pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_enemyscoutprod");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(16, 20);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(64, 0));
	this.mBound.AddPoint(new IVec2(64, 64));
	this.mBound.AddPoint(new IVec2(0, 64));
	
	this.mTurnsUntilSpawn = nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(1, 3);
	
	if (nmgrs.sceneMan.mCurrScene.mMenuMapSize == "m") {
		this.mScoutLimit = 10;
	}
	else if (nmgrs.sceneMan.mCurrScene.mMenuMapSize == "b") {
		this.mScoutLimit = 14;
	}
	
	{
		this.mHealthText.SetFontName("sans-serif");
		this.mHealthText.mColour = "#FFAA77";
		this.mHealthText.SetFontSize(12);
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthText.mDepth = -9994;
		this.mHealthText.mShadow = true;
		this.mHealthText.mPos.Set(this.mSprite.mPos.mX + 14, this.mSprite.mPos.mY + 8);
		
		this.mHealthBack.mColour = "#000000";
		this.mHealthBack.mAlpha = 0.85;
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2  + 14, this.mSprite.mPos.mY + 8);
		
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}

GFEBuildingSP.prototype.Process = function() {
	this.mSprite.Process();
}

GFEBuildingSP.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_enemyscoutprod");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 1;
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

GFEBuildingSP.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	{
		var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog > 0 ||
				nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mFog > 0 ||
				nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mFog > 0 ||
				nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1 + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mFog > 0) {
			
			arr.push(this.mHealthBack);
			arr.push(this.mHealthText);
		}
	}
	
	return arr;
}

GFEBuildingSP.prototype.PerformAIAction = function() {
	if (this.mTurnsUntilSpawn == 0) {
		if (nmgrs.sceneMan.mCurrScene.mScoutCount < this.mScoutLimit) {
			var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos) + (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX * 2);
			
			if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == false) {
				id++;
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree == false) {
					id = -1;
				}
			}
			
			if (id > 0) {
				var scout = new GFEUnitScout();
				scout.SetUp(nmgrs.sceneMan.mCurrScene.mMap.IDToPos(id));
				scout.SetActive(false);
				scout.AdjustFog(1);
				scout.mCurrentAction = "FindUnit";
				nmgrs.sceneMan.mCurrScene.mGameEntities.push(scout);
				nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = false;
				nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = nmgrs.sceneMan.mCurrScene.mGameEntities.length - 1;
				nmgrs.sceneMan.mCurrScene.mScoutCount++;
			}
		}
		
		this.mTurnsUntilSpawn = nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(1, 3);
	}
	else {
		this.mTurnsUntilSpawn--;
	}
	
	this.mMovesLeft--;
}

//
GFEBuildingSP.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -2; y <= 3; ++y) {
		for (var x = -2; x <= 3; ++x) {
			if ((id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x >= 0 &&
					(id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) {
				
				if (Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y >= 0 &&
						Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					arr.push((id + x) + (y * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
				}
			}
		}
	}
	
	for (var i = 0; i < arr.length; ++i) {
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mAIFog += mode;
	}
}

//
GFEBuildingSP.prototype.DestroyUnit = function() {
	this.SetActive(false);
	this.mSelected = false;
	
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
	
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mGameEntities.splice(entID, 1);
	
	for (var i = entID; i < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++i) {
		var nid = nmgrs.sceneMan.mCurrScene.mMap.PosToID(nmgrs.sceneMan.mCurrScene.mGameEntities[i].mPos);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid].mEntityID = i;
		
		if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFBuildingWP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingSP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingIC") {
			
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + 1].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = i;
		}
	}
	
	this.AdjustFog(-1);
	nmgrs.sceneMan.mCurrScene.mEnemyLife--;
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
	
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(this.mPos);
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX + 1, this.mPos.mY));
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX, this.mPos.mY + 1));
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX + 1, this.mPos.mY + 1));
}

//
GFEBuildingSP.prototype.DecreaseHealth = function(amount) {
	this.mHealth -= amount;
	if (this.mHealth <= 0) {
		this.DestroyUnit();
	}
	else {
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2  + 14, this.mSprite.mPos.mY + 8);
		
		this.mHealthBack.Reset();
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}
// ...End


// GFEBuildingIC Class...
// 
function GFEBuildingIC() {
	this.mPos = new IVec2(0, 0);
	
	this.mSprite = new Sprite();
	this.mBound = new Shape();
	this.mShowBound = false;
	
	this.mActive = true;
	this.mPlayerUnit = false;
	
	this.mMovesLeft = 1;
	
	this.mCurrentAction = "";
	this.mFireZoneSprites = new Array();
	
	this.mHealth = 8;
	this.mHealthText = new Text();
	this.mHealthBack = new Shape();
}

GFEBuildingIC.prototype.Type = function() {
	return "GFEBuildingIC";
};

GFEBuildingIC.prototype.SetUp = function(pos) {
	this.mPos.Copy(pos);
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_enemyion");
		this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		this.mSprite.mOrigin.Set(16, 20);
		this.mSprite.mPos.Set(pos.mX * 32, pos.mY * 32);
		this.mSprite.mDepth = -500 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
	}
	
	this.mBound.mOutline = true;
	this.mBound.mColour = "#FF1111";
	this.mBound.mDepth = -9999;
	this.mBound.mAlpha = 1;
	this.mBound.mPos.Set(this.mPos.mX * 32, this.mPos.mY * 32);
	
	this.mBound.AddPoint(new IVec2(64, 0));
	this.mBound.AddPoint(new IVec2(64, 64));
	this.mBound.AddPoint(new IVec2(0, 64));
	
	this.mTurnsUntilSpawn = nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(1, 3);
	
	{
		var arrPos = new Array();
		for (var y = -5; y <= 6; ++y) {
			for (var x = -5; x <= 6; ++x) {
				var pos = new IVec2(this.mPos.mX + x, this.mPos.mY + y);
				var idTile = nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
				if (pos.mX >= 0 && pos.mX < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX &&
						pos.mY >= 0 && pos.mY < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					
					if ((pos.mX == this.mPos.mX && pos.mY == this.mPos.mY) ||
							(pos.mX == this.mPos.mX + 1 && pos.mY == this.mPos.mY) ||
							(pos.mX == this.mPos.mX && pos.mY == this.mPos.mY + 1) ||
							(pos.mX == this.mPos.mX + 1 && pos.mY == this.mPos.mY + 1)) {	
						
						
					}
					else if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idTile].mBlankTile == false) {
						arrPos.push(pos);
					}
				}
			}
		}
		
		for (var i = 0; i < arrPos.length; ++i) {
			var spr = new Sprite();
			var tex = nmgrs.resMan.mTexStore.GetResource("ic_firezone");
			spr.SetTexture(tex);
			spr.mPos.Set(arrPos[i].mX * 32, arrPos[i].mY * 32);
			spr.mDepth = -450 - nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
			
			this.mFireZoneSprites.push(spr);
		}
	}
	
	{
		this.mHealthText.SetFontName("sans-serif");
		this.mHealthText.mColour = "#FFAA77";
		this.mHealthText.SetFontSize(12);
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthText.mDepth = -9994;
		this.mHealthText.mShadow = true;
		this.mHealthText.mPos.Set(this.mSprite.mPos.mX + 14, this.mSprite.mPos.mY + 8);
		
		this.mHealthBack.mColour = "#000000";
		this.mHealthBack.mAlpha = 0.85;
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2  + 14, this.mSprite.mPos.mY + 8);
		
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}

GFEBuildingIC.prototype.Process = function() {
	this.mSprite.Process();
}

GFEBuildingIC.prototype.SetActive = function(active) {
	// if (this.mActive != active) {
		var tex = nmgrs.resMan.mTexStore.GetResource("unit_b_enemyion");
		this.mActive = active;
		
		if (this.mActive == true) {
			this.mMovesLeft = 1;
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, 14 / nmain.game.mFrameLimit, 0, 3, -1);
		}
		else {
			this.mSprite.SetAnimatedTextureSegment(tex, 8, 4, -1, 4, 4, -1);
		}
	// }
}

GFEBuildingIC.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSprite);
	if (this.mShowBound == true) {
		arr.push(this.mBound);
	}
	
	{
		var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
		if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFog > 0 ||
				nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mFog > 0 ||
				nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mFog > 0 ||
				nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1 + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mFog > 0) {
			
			arr.push(this.mHealthBack);
			arr.push(this.mHealthText);
			
			for (var i = 0; i < this.mFireZoneSprites.length; ++i) {
				var pos = new IVec2(this.mFireZoneSprites[i].mPos.mX / 32, this.mFireZoneSprites[i].mPos.mY / 32);
				var idFire = nmgrs.sceneMan.mCurrScene.mMap.PosToID(pos);
				if (nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[idFire].mAIFog > 0) {
					arr.push(this.mFireZoneSprites[i]);
				}
			}
		}
	}
	
	return arr;
}

GFEBuildingIC.prototype.PerformAIAction = function() {
	var arr = new Array();
	arr = this.CheckValidFire();
	
	var target = -1;
	var priority = 0;
	for (var i = 0; i < arr.length; ++i) {
		var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mEntityID;
		var aiFog = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mAIFog;
		
		if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].Type() == "GFUnitArtillery" && priority < 1 && aiFog > 0) {
			
			target = entID;
			priority = 1;
		}
		else if (priority == 0 && aiFog > 0) {
			target = entID;
		}
	}
	
	if (target >= 0) {
		var amount = nmgrs.sceneMan.mCurrScene.mMap.mRand.GetRandInt(4, 10);
		nmgrs.sceneMan.mCurrScene.mGameEntities[target].DecreaseHealth(amount);
	}
	
	this.mMovesLeft--;
}

GFEBuildingIC.prototype.CheckValidFire = function() {
	var arr = new Array();
	
	var arrPos = new Array();
	
	for (var y = -5; y <= 6; ++y) {
		for (var x = -5; x <= 6; ++x) {
			var pos = new IVec2(this.mPos.mX + x, this.mPos.mY + y);
			if (pos.mX >= 0 && pos.mX < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX &&
					pos.mY >= 0 && pos.mY < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
				
				arrPos.push(pos);
			}
		}
	}
	
	for (var i = 0; i < arrPos.length; ++i) {
		var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(arrPos[i]);
		var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
		
		if (entID >= 0) {
			if (nmgrs.sceneMan.mCurrScene.mGameEntities[entID].mPlayerUnit == true) {
				arr.push(id);
			}
		}
	}
	
	return arr;
}

//
GFEBuildingIC.prototype.AdjustFog = function(mode) {
	var arr = new Array();
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	
	for (var y = -2; y <= 3; ++y) {
		for (var x = -2; x <= 3; ++x) {
			if ((id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x >= 0 &&
					(id % nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + x < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) {
				
				if (Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y >= 0 &&
						Math.floor(id / nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX) + y < nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY) {
					
					arr.push((id + x) + (y * nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX));
				}
			}
		}
	}
	
	for (var i = 0; i < arr.length; ++i) {
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[arr[i]].mAIFog += mode;
	}
}

//
GFEBuildingIC.prototype.DestroyUnit = function() {
	this.SetActive(false);
	this.mSelected = false;
	
	var id = nmgrs.sceneMan.mCurrScene.mMap.PosToID(this.mPos);
	var entID = nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID;
	
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mFree = true;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + 1].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[id + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = -1;
	nmgrs.sceneMan.mCurrScene.mGameEntities.splice(entID, 1);
	
	for (var i = entID; i < nmgrs.sceneMan.mCurrScene.mGameEntities.length; ++i) {
		var nid = nmgrs.sceneMan.mCurrScene.mMap.PosToID(nmgrs.sceneMan.mCurrScene.mGameEntities[i].mPos);
		nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid].mEntityID = i;
		
		if (nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFBuildingWP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingSP" ||
				nmgrs.sceneMan.mCurrScene.mGameEntities[i].Type() == "GFEBuildingIC") {
			
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + 1].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX].mEntityID = i;
			nmgrs.sceneMan.mCurrScene.mMap.mMapTiles[nid + nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mX + 1].mEntityID = i;
		}
	}
	
	this.AdjustFog(-1);
	nmgrs.sceneMan.mCurrScene.mEnemyLife--;
	
	if (nmgrs.sceneMan.mCurrScene.mSelectID == entID) {
		nmgrs.sceneMan.mCurrScene.mSelectID = -1;
	}
	
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(this.mPos);
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX + 1, this.mPos.mY));
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX, this.mPos.mY + 1));
	nmgrs.sceneMan.mCurrScene.mMap.AddExplosion(new IVec2(this.mPos.mX + 1, this.mPos.mY + 1));
}

//
GFEBuildingIC.prototype.DecreaseHealth = function(amount) {
	this.mHealth -= amount;
	if (this.mHealth <= 0) {
		this.DestroyUnit();
	}
	else {
		this.mHealthText.mString = this.mHealth.toString();
		this.mHealthBack.mPos.Set(this.mSprite.mPos.mX - 2  + 14, this.mSprite.mPos.mY + 8);
		
		this.mHealthBack.Reset();
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, 0));
		this.mHealthBack.AddPoint(new IVec2(this.mHealthText.GetWidth() + 4, this.mHealthText.GetHeight() + 4));
		this.mHealthBack.AddPoint(new IVec2(0, this.mHealthText.GetHeight() + 4));
	}
}
// ...End


// GFGameUI Class...
// 
function GFGameUI() {
	this.mDynamicUIBatch = new RenderBatch();
	
	this.mArrowUpSprite = new Sprite();
	this.mArrowDownSprite = new Sprite();
	this.mTurnSprite = new Sprite();
	
	this.mControlsText = new Text();
	
	this.mEndTurnSprite = new Sprite();
	this.mEndTurnTapTextA = new Text();
	this.mEndTurnTapTextB = new Text();
	
	this.mCancelSprite = new Sprite();
	
	this.mDebugInfo = new Text();
	this.mShowDebug = false;
}

GFGameUI.prototype.SetUp = function(camera) {
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("turn_2");
		this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 1 / nmain.game.mFrameLimit, 1);
		this.mTurnSprite.mPos.Set(camera.mTranslate.mX, camera.mTranslate.mY);
		this.mTurnSprite.mDepth = -1000;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arrow_up");
		this.mArrowUpSprite.SetAnimatedTexture(tex, 12, 4, 4 / nmain.game.mFrameLimit, -1);
		this.mArrowUpSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 64, camera.mTranslate.mY + 4);
		this.mArrowUpSprite.mDepth = -1000;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arrow_down");
		this.mArrowDownSprite.SetAnimatedTexture(tex, 12, 4, 4 / nmain.game.mFrameLimit, -1);
		this.mArrowDownSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 64, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 68);
		this.mArrowDownSprite.mDepth = -1000;
	}
	
	{
		this.mControlsText.mColour = "#EBEBEB";
		this.mControlsText.mString = "D to toggle debug mode (cheating!).\nUp and Down Arrows to scroll.\nDouble-tap E to end your turn.\nLeft Mouse Button to select a unit or UI option.\nMiddle Mouse Button to cancel.";
		this.mControlsText.mDepth = -1000;
		this.mControlsText.mShadow = true;
		this.mControlsText.mPos.Set(camera.mTranslate.mX + 4, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.GetHeight() - 5);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("endturn");
		this.mEndTurnSprite.SetAnimatedTexture(tex, 2, 1, -1, -1);
		this.mEndTurnSprite.mPos.Set(camera.mTranslate.mX, camera.mTranslate.mY);
		this.mEndTurnSprite.mDepth = -1000;
		this.mEndTurnSprite.SetCurrentFrame(1);
		
		this.mEndTurnTapTextA.SetFontName("sans-serif");
		this.mEndTurnTapTextA.SetFontSize(12);
		this.mEndTurnTapTextA.mString = "Press Again To";
		this.mEndTurnTapTextA.mDepth = -2000;
		this.mEndTurnTapTextA.mShadow = true;
		this.mEndTurnTapTextA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapTextA.GetWidth() / 2), camera.mTranslate.mY + 12);
		
		this.mEndTurnTapTextB.SetFontName("sans-serif");
		this.mEndTurnTapTextB.SetFontSize(32);
		this.mEndTurnTapTextB.mString = "CONFIRM END TURN";
		this.mEndTurnTapTextB.mDepth = -2000;
		this.mEndTurnTapTextB.mShadow = true;
		this.mEndTurnTapTextB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapTextB.GetWidth() / 2), camera.mTranslate.mY + this.mEndTurnTapTextA.GetHeight() + 12);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("cancel");
		this.mCancelSprite.SetTexture(tex);
		this.mCancelSprite.mPos.Set(camera.mTranslate.mX, camera.mTranslate.mY + 64);
		this.mCancelSprite.mDepth = -1000;
	}
	
	{
		this.mDebugInfo.mColour = "#EBEBEB";
		this.mDebugInfo.mString = "FPS (Framelimit): " + Math.round(nmain.game.mFPS) + " (" + nmain.game.mFrameLimit + ")\n" +
				"Map Seed: " + nmgrs.sceneMan.mCurrScene.mMap.mRand.GetSeed();
		this.mDebugInfo.mDepth = -10000;
		this.mDebugInfo.mShadow = true;
		this.mDebugInfo.mPos.Set(camera.mTranslate.mX + 72, camera.mTranslate.mY);
	}
}

GFGameUI.prototype.Input = function() {
	// the mouse cursor position offset by the current camera (view)
	var pt = new IVec2(0, 0);
	pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
	pt.mX += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX; pt.mY += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY;
	
	if (nmgrs.sceneMan.mCurrScene.mCanScroll == true) {
		if (nmgrs.inputMan.GetMouseDown(nmouse.button.code.left)) {
			if (nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY > -24) {
				// top left of the buttons boundbox
				var tl = new IVec2(this.mArrowUpSprite.mPos.mX, this.mArrowUpSprite.mPos.mY);
				
				// bottom right of the buttons boundbox
				var br = new IVec2(this.mArrowUpSprite.mPos.mX + this.mArrowUpSprite.GetWidth(),
						this.mArrowUpSprite.mPos.mY + this.mArrowUpSprite.GetHeight());
				
				if (util.PointInRectangle(pt, tl, br) == true) {
					nmgrs.sceneMan.mCurrScene.mCam.mTranslate.Set(nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY - 2);
					
					if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
						nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].UpdateUI(nmgrs.sceneMan.mCurrScene.mCam);
					}
					
					this.UpdateUI(nmgrs.sceneMan.mCurrScene.mCam);
				}
			}
			
			if (nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY < (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY * 32) + 24) {
				// top left of the buttons boundbox
				var tl = new IVec2(this.mArrowDownSprite.mPos.mX, this.mArrowDownSprite.mPos.mY);
				
				// bottom right of the buttons boundbox
				var br = new IVec2(this.mArrowDownSprite.mPos.mX + this.mArrowDownSprite.GetWidth(),
						this.mArrowDownSprite.mPos.mY + this.mArrowDownSprite.GetHeight());
				
				if (util.PointInRectangle(pt, tl, br) == true) {
					nmgrs.sceneMan.mCurrScene.mCam.mTranslate.Set(nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY + 2);
					
					if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
						nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].UpdateUI(nmgrs.sceneMan.mCurrScene.mCam);
					}
					
					this.UpdateUI(nmgrs.sceneMan.mCurrScene.mCam);
				}
			}
		}
	}
	
	if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.left)) {
		{
			// top left of the buttons boundbox
			var tl = new IVec2(this.mEndTurnSprite.mPos.mX, this.mEndTurnSprite.mPos.mY);
			
			// bottom right of the buttons boundbox
			var br = new IVec2(this.mEndTurnSprite.mPos.mX + this.mEndTurnSprite.GetWidth(),
					this.mEndTurnSprite.mPos.mY + this.mEndTurnSprite.GetHeight());
			
			if (util.PointInRectangle(pt, tl, br) == true) {
				if (nmgrs.sceneMan.mCurrScene.mEndPlayerTurn == 0) {
					nmgrs.sceneMan.mCurrScene.mEndPlayerTurn = 100;
					this.mEndTurnSprite.SetCurrentFrame(0);
					
					if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
						nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].SoftReset();
					}
				}
				else {
					nmgrs.sceneMan.mCurrScene.mEndPlayerTurn = 0;
					this.mEndTurnSprite.SetCurrentFrame(1);
					nmgrs.sceneMan.mCurrScene.mTurn = 2;
					
					this.SwitchTurn(1);
				}
			}
		}
		
		{
			// top left of the buttons boundbox
			var tl = new IVec2(this.mCancelSprite.mPos.mX, this.mCancelSprite.mPos.mY);
			
			// bottom right of the buttons boundbox
			var br = new IVec2(this.mCancelSprite.mPos.mX + this.mCancelSprite.GetWidth(),
					this.mCancelSprite.mPos.mY + this.mCancelSprite.GetHeight());
			
			if (util.PointInRectangle(pt, tl, br) == true) {
				nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false);
				
				if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
					nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].mSelected = false;
					nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].mUI.mShow = true;
					nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].SoftReset();
					nmgrs.sceneMan.mCurrScene.mSelectID = -1;
				}
			}
		}
	}
}

GFGameUI.prototype.Process = function() {
	this.mArrowUpSprite.Process();
	this.mArrowDownSprite.Process();
	
	this.mEndTurnSprite.mPos.Set(nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
	this.mCancelSprite.mPos.Set(nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY + 64);
	
	this.mDebugInfo.mString = "FPS (Framelimit): " + Math.round(nmain.game.mFPS) + " (" + nmain.game.mFrameLimit + ")\n" +
			"Map Seed: " + nmgrs.sceneMan.mCurrScene.mMap.mRand.GetSeed();
}

GFGameUI.prototype.Render = function(camera, turn, mapSize) {
	this.mDynamicUIBatch.Clear();
	this.mDynamicUIBatch.AddSprite(this.mTurnSprite);
	
	if (turn == 1) {
		if (camera.mTranslate.mY > -24) {
			this.mDynamicUIBatch.AddSprite(this.mArrowUpSprite);
		}
		
		if (camera.mTranslate.mY + nmain.game.mCanvasSize.mY < (mapSize * 32) + 24) {
			this.mDynamicUIBatch.AddSprite(this.mArrowDownSprite);
		}
	}
	
	// this.mDynamicUIBatch.AddText(this.mControlsText);
	if (nmgrs.sceneMan.mCurrScene.mTurn == 1) {
		this.mDynamicUIBatch.AddSprite(this.mEndTurnSprite);
		this.mDynamicUIBatch.AddSprite(this.mCancelSprite);
	}
	
	if (nmgrs.sceneMan.mCurrScene.mEndPlayerTurn > 0) {
		this.mDynamicUIBatch.AddText(this.mEndTurnTapTextA);
		this.mDynamicUIBatch.AddText(this.mEndTurnTapTextB);
	}
	
	if (this.mShowDebug == true) {
		this.mDynamicUIBatch.AddText(this.mDebugInfo);
	}
	
	this.mDynamicUIBatch.Render(camera);
}

GFGameUI.prototype.UpdateUI = function(camera) {
	this.mTurnSprite.mPos.Set(camera.mTranslate.mX, camera.mTranslate.mY);
	this.mArrowUpSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 64, camera.mTranslate.mY + 4);
	this.mArrowDownSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 64, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 68);
	
	this.mControlsText.mPos.Set(camera.mTranslate.mX + 4, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.GetHeight() - 5);
	
	this.mEndTurnTapTextA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapTextA.GetWidth() / 2), camera.mTranslate.mY + 12);
	this.mEndTurnTapTextB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapTextB.GetWidth() / 2), camera.mTranslate.mY + this.mEndTurnTapTextA.GetHeight() + 12);
	
	this.mDebugInfo.mPos.Set(camera.mTranslate.mX + 72, camera.mTranslate.mY);
}

GFGameUI.prototype.SwitchTurn = function(player) {
	if (player == 1) {
		var tex = nmgrs.resMan.mTexStore.GetResource("turn_1");
		this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 1 / nmain.game.mFrameLimit, 1);
	}
	else if (player == 2) {
		var tex = nmgrs.resMan.mTexStore.GetResource("turn_2");
		this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 1 / nmain.game.mFrameLimit, 1);
	}
}

GFGameUI.prototype.OnTurnStart = function() {
	this.mTurnSprite.Process();
	if (this.mTurnSprite.mNumLoops == 0) {
		this.mTurnSprite.mAnimSpeed = -1;
		this.mTurnSprite.SetCurrentFrame(0);
		
		return true;
	}
	
	return false;
}
// ...End


// GFUnitUI Class...
// 
function GFUnitUI() {
	this.mSlotSprites = new Array();
	this.mSlotStatus = new Array();
	this.mSlotText = new Array();
	
	this.mSlotSprites[0] = new Sprite();
	this.mSlotSprites[1] = new Sprite();
	this.mSlotSprites[2] = new Sprite();
	this.mSlotSprites[3] = new Sprite();
	
	this.mSlotStatus[0] = false;
	this.mSlotStatus[1] = false;
	this.mSlotStatus[2] = false;
	this.mSlotStatus[3] = false;
	
	this.mSlotText[0] = new Text();
	this.mSlotText[1] = new Text();
	this.mSlotText[2] = new Text();
	this.mSlotText[3] = new Text();
	
	this.mShow = true;
}

GFUnitUI.prototype.GetRender = function() {
	var arr = new Array();
	
	if (this.mShow == true) {
		arr.push(this.mSlotSprites[0]);
		arr.push(this.mSlotSprites[1]);
		arr.push(this.mSlotSprites[2]);
		arr.push(this.mSlotSprites[3]);
		
		arr.push(this.mSlotText[0]);
		arr.push(this.mSlotText[1]);
		arr.push(this.mSlotText[2]);
		arr.push(this.mSlotText[3]);
	}
	
	return arr;
}
// ...End


