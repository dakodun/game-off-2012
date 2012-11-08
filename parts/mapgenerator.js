// mapgen Namespace...
var nmapgen = new function() {
this.MAPBOUNDMIN = new IVec2(100, 400); // minimum size a map can be
this.MAPBOUNDMAX = new IVec2(300, 1200); // maximum size a map can be
};
// ...End


// MapGenerator Class...
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
	// nmain.game.mContext.fillStyle = "#FF0000";
	// nmain.game.mContext.fillRect(0, 0, 150, 75);
};
// ...End

