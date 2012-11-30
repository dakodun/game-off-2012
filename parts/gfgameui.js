// GFGameUI Class...
// 
function GFGameUI() {
	this.mDynamicUIBatch = new RenderBatch();
	
	this.mArrowUpSprite = new Sprite();
	this.mArrowDownSprite = new Sprite();
	this.mTurnSprite = new Sprite();
	
	this.mControlsText = new Text();
	
	this.mEndTurnSprite = new Sprite();
	this.mEndTurnTapTextA = new Text();
	this.mEndTurnTapTextB = new Text();
	
	this.mCancelSprite = new Sprite();
	
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
		this.mArrowUpSprite.SetAnimatedTexture(tex, 12, 4, 4 / nmain.game.mFrameLimit, -1);
		this.mArrowUpSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 64, camera.mTranslate.mY + 4);
		this.mArrowUpSprite.mDepth = -1000;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arrow_down");
		this.mArrowDownSprite.SetAnimatedTexture(tex, 12, 4, 4 / nmain.game.mFrameLimit, -1);
		this.mArrowDownSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 64, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 68);
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
		var tex = nmgrs.resMan.mTexStore.GetResource("endturn");
		this.mEndTurnSprite.SetAnimatedTexture(tex, 2, 1, -1, -1);
		this.mEndTurnSprite.mPos.Set(camera.mTranslate.mX, camera.mTranslate.mY);
		this.mEndTurnSprite.mDepth = -1000;
		this.mEndTurnSprite.SetCurrentFrame(1);
		
		this.mEndTurnTapTextA.SetFontName("sans-serif");
		this.mEndTurnTapTextA.SetFontSize(12);
		this.mEndTurnTapTextA.mString = "Press Again To";
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
		var tex = nmgrs.resMan.mTexStore.GetResource("cancel");
		this.mCancelSprite.SetTexture(tex);
		this.mCancelSprite.mPos.Set(camera.mTranslate.mX, camera.mTranslate.mY + 64);
		this.mCancelSprite.mDepth = -1000;
	}
	
	{
		this.mDebugInfo.mColour = "#EBEBEB";
		this.mDebugInfo.mString = "FPS (Framelimit): " + Math.round(nmain.game.mFPS) + " (" + nmain.game.mFrameLimit + ")\n" +
				"Map Seed: " + nmgrs.sceneMan.mCurrScene.mMap.mRand.GetSeed();
		this.mDebugInfo.mDepth = -10000;
		this.mDebugInfo.mShadow = true;
		this.mDebugInfo.mPos.Set(camera.mTranslate.mX + 72, camera.mTranslate.mY + this.mDebugInfo.GetHeight());
	}
}

GFGameUI.prototype.Input = function() {
	// the mouse cursor position offset by the current camera (view)
	var pt = new IVec2(0, 0);
	pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
	pt.mX += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX; pt.mY += nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY;
	
	if (nmgrs.sceneMan.mCurrScene.mCanScroll == true) {
		if (nmgrs.inputMan.GetMouseDown(nmouse.button.code.left)) {
			if (nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY > -24) {
				// top left of the buttons boundbox
				var tl = new IVec2(this.mArrowUpSprite.mPos.mX, this.mArrowUpSprite.mPos.mY);
				
				// bottom right of the buttons boundbox
				var br = new IVec2(this.mArrowUpSprite.mPos.mX + this.mArrowUpSprite.GetWidth(),
						this.mArrowUpSprite.mPos.mY + this.mArrowUpSprite.GetHeight());
				
				if (util.PointInRectangle(pt, tl, br) == true) {
					nmgrs.sceneMan.mCurrScene.mCam.mTranslate.Set(nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY - 2);
					
					if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
						nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].UpdateUI(nmgrs.sceneMan.mCurrScene.mCam);
					}
					
					this.UpdateUI(nmgrs.sceneMan.mCurrScene.mCam);
				}
			}
			
			if (nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY < (nmgrs.sceneMan.mCurrScene.mMap.mMapSize.mY * 32) + 24) {
				// top left of the buttons boundbox
				var tl = new IVec2(this.mArrowDownSprite.mPos.mX, this.mArrowDownSprite.mPos.mY);
				
				// bottom right of the buttons boundbox
				var br = new IVec2(this.mArrowDownSprite.mPos.mX + this.mArrowDownSprite.GetWidth(),
						this.mArrowDownSprite.mPos.mY + this.mArrowDownSprite.GetHeight());
				
				if (util.PointInRectangle(pt, tl, br) == true) {
					nmgrs.sceneMan.mCurrScene.mCam.mTranslate.Set(nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY + 2);
					
					if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
						nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].UpdateUI(nmgrs.sceneMan.mCurrScene.mCam);
					}
					
					this.UpdateUI(nmgrs.sceneMan.mCurrScene.mCam);
				}
			}
		}
	}
	
	if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.left)) {
		{
			// top left of the buttons boundbox
			var tl = new IVec2(this.mEndTurnSprite.mPos.mX, this.mEndTurnSprite.mPos.mY);
			
			// bottom right of the buttons boundbox
			var br = new IVec2(this.mEndTurnSprite.mPos.mX + this.mEndTurnSprite.GetWidth(),
					this.mEndTurnSprite.mPos.mY + this.mEndTurnSprite.GetHeight());
			
			if (util.PointInRectangle(pt, tl, br) == true) {
				if (nmgrs.sceneMan.mCurrScene.mEndPlayerTurn == 0) {
					nmgrs.sceneMan.mCurrScene.mEndPlayerTurn = 100;
					this.mEndTurnSprite.SetCurrentFrame(0);
					
					if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
						nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].SoftReset();
					}
				}
				else {
					nmgrs.sceneMan.mCurrScene.mEndPlayerTurn = 0;
					this.mEndTurnSprite.SetCurrentFrame(1);
					nmgrs.sceneMan.mCurrScene.mTurn = 2;
					
					this.SwitchTurn(1);
				}
			}
		}
		
		{
			// top left of the buttons boundbox
			var tl = new IVec2(this.mCancelSprite.mPos.mX, this.mCancelSprite.mPos.mY);
			
			// bottom right of the buttons boundbox
			var br = new IVec2(this.mCancelSprite.mPos.mX + this.mCancelSprite.GetWidth(),
					this.mCancelSprite.mPos.mY + this.mCancelSprite.GetHeight());
			
			if (util.PointInRectangle(pt, tl, br) == true) {
				nmgrs.sceneMan.mCurrScene.TogglePlacementMode(false);
				
				if (nmgrs.sceneMan.mCurrScene.mSelectID >= 0) {
					nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].mSelected = false;
					nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].mUI.mShow = true;
					nmgrs.sceneMan.mCurrScene.mGameEntities[nmgrs.sceneMan.mCurrScene.mSelectID].SoftReset();
					nmgrs.sceneMan.mCurrScene.mSelectID = -1;
				}
			}
		}
	}
}

GFGameUI.prototype.Process = function() {
	this.mArrowUpSprite.Process();
	this.mArrowDownSprite.Process();
	
	this.mEndTurnSprite.mPos.Set(nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY);
	this.mCancelSprite.mPos.Set(nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mX, nmgrs.sceneMan.mCurrScene.mCam.mTranslate.mY + 64);
	
	this.mDebugInfo.mString = "FPS (Framelimit): " + Math.round(nmain.game.mFPS) + " (" + nmain.game.mFrameLimit + ")\n" +
			"Map Seed: " + nmgrs.sceneMan.mCurrScene.mMap.mRand.GetSeed();
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
	
	// this.mDynamicUIBatch.AddText(this.mControlsText);
	if (nmgrs.sceneMan.mCurrScene.mTurn == 1) {
		this.mDynamicUIBatch.AddSprite(this.mEndTurnSprite);
		this.mDynamicUIBatch.AddSprite(this.mCancelSprite);
	}
	
	if (nmgrs.sceneMan.mCurrScene.mEndPlayerTurn > 0) {
		this.mDynamicUIBatch.AddText(this.mEndTurnTapTextA);
		this.mDynamicUIBatch.AddText(this.mEndTurnTapTextB);
	}
	
	if (this.mShowDebug == true) {
		this.mDynamicUIBatch.AddText(this.mDebugInfo);
	}
	
	this.mDynamicUIBatch.Render(camera);
}

GFGameUI.prototype.UpdateUI = function(camera) {
	this.mTurnSprite.mPos.Set(camera.mTranslate.mX, camera.mTranslate.mY);
	this.mArrowUpSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 64, camera.mTranslate.mY + 4);
	this.mArrowDownSprite.mPos.Set(camera.mTranslate.mX + nmain.game.mCanvasSize.mX - 64, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - 68);
	
	this.mControlsText.mPos.Set(camera.mTranslate.mX + 4, camera.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.GetHeight() - 5);
	
	this.mEndTurnTapTextA.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapTextA.GetWidth() / 2), camera.mTranslate.mY + this.mEndTurnTapTextA.GetHeight() + 12);
	this.mEndTurnTapTextB.mPos.Set(camera.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapTextB.GetWidth() / 2), camera.mTranslate.mY + this.mEndTurnTapTextA.GetHeight() + this.mEndTurnTapTextB.GetHeight() + 12);
	
	this.mDebugInfo.mPos.Set(camera.mTranslate.mX + 72, camera.mTranslate.mY + this.mDebugInfo.GetHeight());
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

