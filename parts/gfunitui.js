// GFUnitUI Class...
// 
function GFUnitUI() {
	this.mSlotSprites = new Array();
	this.mSlotStatus = new Array();
	this.mSlotText = new Array();
	
	this.mSlotSprites[0] = new Sprite();
	this.mSlotSprites[1] = new Sprite();
	this.mSlotSprites[2] = new Sprite();
	this.mSlotSprites[3] = new Sprite();
	
	this.mSlotStatus[0] = false;
	this.mSlotStatus[1] = false;
	this.mSlotStatus[2] = false;
	this.mSlotStatus[3] = false;
	
	this.mSlotText[0] = new Text();
	this.mSlotText[1] = new Text();
	this.mSlotText[2] = new Text();
	this.mSlotText[3] = new Text();
}

GFUnitUI.prototype.GetRender = function() {
	var arr = new Array();
	arr.push(this.mSlotSprites[0]);
	arr.push(this.mSlotSprites[1]);
	arr.push(this.mSlotSprites[2]);
	arr.push(this.mSlotSprites[3]);
	
	arr.push(this.mSlotText[0]);
	arr.push(this.mSlotText[1]);
	arr.push(this.mSlotText[2]);
	arr.push(this.mSlotText[3]);
	
	return arr;
}
// ...End

