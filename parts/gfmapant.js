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

