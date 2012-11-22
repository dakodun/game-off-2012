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

