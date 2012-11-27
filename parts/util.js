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

