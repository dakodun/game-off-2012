// GFMapTile Class...
// 
function GFMapTile(pos) {
	this.mPos = new IVec2(0, 0);
	this.mPos.Copy(pos);
	
	this.mSprite = new Sprite();
	this.mType = "";
};
// ...End

