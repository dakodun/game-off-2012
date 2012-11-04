// main Namespace...
var nmain = new function() {
	this.game = new Game();
}
// ...End

// mapgen Namespace...
var nmapgen = new function() {
	this.MAPBOUNDMIN = new IVec2(100, 400);
	this.MAPBOUNDMAX = new IVec2(300, 1200);
};
// ...End


// Game Class...
function Game() {
	this.mCanvas = null;
	this.mContext = null;
	
	this.mQuit = false;
};

Game.prototype.SetUp = function() {
	this.mCanvas = document.getElementById("canvas");
	this.mContext = this.mCanvas.getContext("2d");
};

Game.prototype.Run = function() {
	mapGen = new MapGenerator(new IVec2(10, 10));
	
	do {
		mapGen.Render();
	} while(!mQuit);
}
// ...End

// Exception Class...
function Exception(what) {
	this.mWhat = what;
};

Exception.prototype.What = function() {
	return this.mWhat;
};
// ...End

// IVec2 Class...
function IVec2(x, y) {
	this.mX = x;
	this.mY = y;
};

IVec2.prototype.Type = function() {
	return "IVec2";
};

IVec2.prototype.Output = function() {
	return "(" + this.mX + ", " + this.mY + ")";
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

function main() {
	try {
		nmain.game.SetUp();
		nmain.game.Run();
		nmain.game.TearDown();
	} catch(e) {
		alert(e.What());
	}
};
