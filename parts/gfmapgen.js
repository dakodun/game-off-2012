// GFMapGen Class...
function GFMapGen() {
	
};

GFMapGen.prototype.GenerateMap = function(seed, size, baseSize) {
	var rand = new RNG(seed);
	var map = new GFMap();
	
	var dimX = 0; var dimY = 0;
	{
		if (size == "s") {
			dimX = 6;
			dimY = 10;
		}
		else if (size == "m") {
			dimX = 8;
			dimY = 14;
		}
		else {
			dimX = 10;
			dimY = 18;
		}
		
		map.SetUp(new IVec2(dimX, dimY));
	}
	
	var rowNum = 0;
	{
		if (baseSize == "s") {
			rowNum = rand.GetRandInt(1, 2);
		}
		else if (baseSize == "m") {
			rowNum = rand.GetRandInt(2, 4);
		}
		else {
			rowNum = rand.GetRandInt(4, 6);
		}
	}
	
	var idLow = 0;
	var idHigh = (dimX * rowNum) - 1;
	var base1 = rand.GetRandInt(idLow, idHigh);
	map.mMapTiles[base1].mSprite.SetCurrentFrame(2);
	
	idLow = dimX * (dimY - rowNum);
	idHigh = (dimX * dimY) - 1;
	var base2 = rand.GetRandInt(idLow, idHigh);
	map.mMapTiles[base2].mSprite.SetCurrentFrame(3);
	
	return map;
	// 46 - hypoteneuse
	
	
	/* if () {
		
	} */
}

/*
create map with bounds (small, medium and large)
define base size(s)
  create bases at top and bottom of map via circle intersection method
  change base frame to corresponding colour
*/

// ...End

