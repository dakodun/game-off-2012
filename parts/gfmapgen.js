// GFMapGen Class...
function GFMapGen() {
	
};

GFMapGen.prototype.GenerateMap = function(seed, size, baseSize) {
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
		
		map.mRand.SetSeed(seed);
		map.SetUp(new IVec2(dimX, dimY));
	}
	
	var rowNum = 0;
	var baseRadius = 0;
	{
		if (baseSize == "s") {
			rowNum = map.mRand.GetRandInt(1, 2);
			baseRadius = 1;
		}
		else if (baseSize == "m") {
			rowNum = map.mRand.GetRandInt(1, 3);
			baseRadius = map.mRand.GetRandInt(1, 4);
		}
		else {
			rowNum = map.mRand.GetRandInt(2, 4);
			baseRadius = map.mRand.GetRandInt(3, 6);
		}
	}
	
	var idLow = 0;
	var idHigh = (dimX * rowNum) - 1;
	var base1 = map.mRand.GetRandInt(idLow, idHigh);
	// map.mMapTiles[base1].mSprite.SetCurrentFrame(map.mRand.GetRandInt(10, 14));
	
	idLow = dimX * (dimY - rowNum);
	idHigh = (dimX * dimY) - 1;
	var base2 = map.mRand.GetRandInt(idLow, idHigh);
	// map.mMapTiles[base2].mSprite.SetCurrentFrame(map.mRand.GetRandInt(15, 19));
	
	var baseCircles = new Array();
	baseCircles.push(new GFMapCircle(map.mMapTiles[base1].mPos, 10 * baseRadius));
	baseCircles.push(new GFMapCircle(map.mMapTiles[base2].mPos, 10 * baseRadius));
	
	map.CreateBases(baseCircles);
	
	var mapCircles = new Array();
	var curRow = map.mRand.GetRandInt(1, 3);
	while (curRow <= dimY) {
		mapCircles.push(new GFMapCircle(new IVec2(map.mRand.GetRandInt(0, dimX - 1), curRow), 10 * map.mRand.GetRandInt(1, 4)));
		curRow += map.mRand.GetRandInt(1, 3);
	}
	
	map.Erode(mapCircles);
	
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

