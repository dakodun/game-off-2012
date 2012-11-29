// GFGameUI Class...
// 
function GFGameUI() {
	this.mDynamicUIBatch = new RenderBatch();
	
	this.mArrowUpSprite = new Sprite();
	this.mArrowDownSprite = new Sprite();
	this.mTurnSprite = new Sprite();
	
	this.mControlsText = new Text();
	
	this.mEndTurnTapTextA = new Text();
	this.mEndTurnTapTextB = new Text();
	
	this.mDebugInfo = new Text();
	this.mShowDebug = false;
}

GFGameUI.prototype.SetUp = function(camera) {
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("turn_2");
		this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 1 / nmain.game.mFrameLimit, 1);
		this.mTurnSprite.mPos.Set(camera.mTranslate.mX, camera.mTranslate.mY);
		this.mTurnSprite.mDepth = -1000;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arrow_up");
		this.mArrowUpSprite.SetAnimatedTexture(tex, 16, 5, 1 / nmain.game.mFrameLimit, -1);
		this.mArrowUpSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, camera.mTranslate.mY);
		this.mArrowUpSprite.mDepth = -1000;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arrow_down");
		this.mArrowDownSprite.SetAnimatedTexture(tex, 16, 5, 1 / nmain.game.mFrameLimit, -1);
		this.mArrowDownSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mArrowDownSprite.mDepth = -1000;
	}
	
	{
		this.mControlsText.mColour = "#EBEBEB";
		this.mControlsText.mString = "D to toggle debug mode (cheating!).\nUp and Down Arrows to scroll.\nDouble-tap E to end your turn.\nLeft Mouse Button to select a unit or UI option.\nMiddle Mouse Button to cancel.";
		this.mControlsText.mDepth = -1000;
		this.mControlsText.mShadow = true;
		this.mControlsText.mPos.Set(camera.mTranslate.mX + 4, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.GetHeight() - 5);
	}
	
	{
		this.mEndTurnTapTextA.SetFontName("sans-serif");
		this.mEndTurnTapTextA.SetFontSize(12);
		this.mEndTurnTapTextA.mString = "Press E Again To";
		this.mEndTurnTapTextA.mDepth = -2000;
		this.mEndTurnTapTextA.mShadow = true;
		this.mEndTurnTapTextA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapTextA.GetWidth() / 2), camera.mTranslate.mY + this.mEndTurnTapTextA.GetHeight() + 12);
		
		this.mEndTurnTapTextB.SetFontName("sans-serif");
		this.mEndTurnTapTextB.SetFontSize(32);
		this.mEndTurnTapTextB.mString = "CONFIRM END TURN";
		this.mEndTurnTapTextB.mDepth = -2000;
		this.mEndTurnTapTextB.mShadow = true;
		this.mEndTurnTapTextB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapTextB.GetWidth() / 2), camera.mTranslate.mY + this.mEndTurnTapTextA.GetHeight() + this.mEndTurnTapTextB.GetHeight() + 12);
	}
	
	{
		this.mDebugInfo.mColour = "#EBEBEB";
		this.mDebugInfo.mString = "FPS (Framelimit): " + Math.round(nmain.game.mFPS) + " (" + nmain.game.mFrameLimit + ")";
		this.mDebugInfo.mDepth = -10000;
		this.mDebugInfo.mShadow = true;
		this.mDebugInfo.mPos.Set(camera.mTranslate.mX + 72, camera.mTranslate.mY + this.mDebugInfo.GetHeight());
	}
}

GFGameUI.prototype.Input = function(camera) {
	this.mTurnSprite.mPos.Set(camera.mTranslate.mX, camera.mTranslate.mY);
	this.mArrowUpSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, camera.mTranslate.mY);
	this.mArrowDownSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
	
	this.mControlsText.mPos.Set(camera.mTranslate.mX + 4, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.GetHeight() - 5);
	
	this.mEndTurnTapTextA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapTextA.GetWidth() / 2), camera.mTranslate.mY + this.mEndTurnTapTextA.GetHeight() + 12);
	this.mEndTurnTapTextB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapTextB.GetWidth() / 2), camera.mTranslate.mY + this.mEndTurnTapTextA.GetHeight() + this.mEndTurnTapTextB.GetHeight() + 12);
	
	this.mDebugInfo.mPos.Set(camera.mTranslate.mX + 72, camera.mTranslate.mY + this.mDebugInfo.GetHeight());
}

GFGameUI.prototype.Process = function() {
	this.mArrowUpSprite.Process();
	this.mArrowDownSprite.Process();
	
	this.mDebugInfo.mString = "FPS (Framelimit): " + Math.round(nmain.game.mFPS) + " (" + nmain.game.mFrameLimit + ")";
}

GFGameUI.prototype.Render = function(camera, turn, mapSize) {
	this.mDynamicUIBatch.Clear();
	this.mDynamicUIBatch.AddSprite(this.mTurnSprite);
	
	if (turn == 1) {
		if (camera.mTranslate.mY > -24) {
			this.mDynamicUIBatch.AddSprite(this.mArrowUpSprite);
		}
		
		if (camera.mTranslate.mY + nmain.game.mCanvasSize.mY < (mapSize * 32) + 24) {
			this.mDynamicUIBatch.AddSprite(this.mArrowDownSprite);
		}
	}
	
	this.mDynamicUIBatch.AddText(this.mControlsText);
	
	if (nmgrs.sceneMan.mCurrScene.mEndPlayerTurn > 0) {
		this.mDynamicUIBatch.AddText(this.mEndTurnTapTextA);
		this.mDynamicUIBatch.AddText(this.mEndTurnTapTextB);
	}
	
	if (this.mShowDebug == true) {
		this.mDynamicUIBatch.AddText(this.mDebugInfo);
	}
	
	this.mDynamicUIBatch.Render(camera);
}

GFGameUI.prototype.SwitchTurn = function(player) {
	if (player == 1) {
		var tex = nmgrs.resMan.mTexStore.GetResource("turn_1");
		this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 1 / nmain.game.mFrameLimit, 1);
	}
	else if (player == 2) {
		var tex = nmgrs.resMan.mTexStore.GetResource("turn_2");
		this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 1 / nmain.game.mFrameLimit, 1);
	}
}

GFGameUI.prototype.OnTurnStart = function() {
	this.mTurnSprite.Process();
	if (this.mTurnSprite.mNumLoops == 0) {
		this.mTurnSprite.mAnimSpeed = -1;
		this.mTurnSprite.SetCurrentFrame(0);
		
		return true;
	}
	
	return false;
}
// ...End

