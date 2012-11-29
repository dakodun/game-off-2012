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

