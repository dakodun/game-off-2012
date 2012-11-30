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

