// input callbacks...
//
document.onmousemove = function(e) {
	nmgrs.inputMan.HandleMouseMove(e);
}

//
document.onmousedown = function(e) {
	nmgrs.inputMan.HandleMouseDown(e);
}

//
document.onmouseup = function(e) {
	nmgrs.inputMan.HandleMouseUp(e);
}
// ...End

// InputManager Class...
// 
function InputManager() {
	this.mButtonStates = new Array();
	this.mButtonStates[0] = 0;
	this.mButtonStates[1] = 0;
	this.mButtonStates[2] = 0;
	
	this.mLocalMouseCoords = new IVec2(0, 0);
	this.mGlobalMouseCoords = new IVec2(0, 0);
}

InputManager.prototype.Process = function() {
	for (var i = 0; i < 3; ++i) {
		if (this.mButtonStates[i] == 2) {
			this.mButtonStates[i] = 1;
		}
		else if (this.mButtonStates[i] == 3) {
			this.mButtonStates[i] = 0;
		}
	}
}

InputManager.prototype.HandleMouseMove = function(e) {
	{
		this.mLocalMouseCoords.mX = e.pageX - nmain.game.mCanvasPos.mX;
		this.mLocalMouseCoords.mY = e.pageY - nmain.game.mCanvasPos.mY;
		
		if (this.mLocalMouseCoords.mX < 0) {
			this.mLocalMouseCoords.mX = 0;
		}
		else if (this.mLocalMouseCoords.mX > nmain.game.mCanvasSize.mX) {
			this.mLocalMouseCoords.mX = nmain.game.mCanvasSize.mX;
		}
		
		if (this.mLocalMouseCoords.mY < 0) {
			this.mLocalMouseCoords.mY = 0;
		}
		else if (this.mLocalMouseCoords.mY > nmain.game.mCanvasSize.mY) {
			this.mLocalMouseCoords.mY = nmain.game.mCanvasSize.mY;
		}
	}
	
	this.mGlobalMouseCoords.mX = e.pageX;
	this.mGlobalMouseCoords.mY = e.pageY;
}

InputManager.prototype.HandleMouseDown = function(e) {
	if (this.mButtonStates[e.button] == 0) {
		this.mButtonStates[e.button] = 2;
	}
}

InputManager.prototype.HandleMouseUp = function(e) {
	if (this.mButtonStates[e.button] == 1) {
		this.mButtonStates[e.button] = 3;
	}
}

InputManager.prototype.GetLocalMouseCoords = function() {
	var ret = new IVec2();
	ret.Copy(this.mLocalMouseCoords);
	return ret;
}

InputManager.prototype.GetGlobalMouseCoords = function() {
	var ret = new IVec2();
	ret.Copy(this.mGlobalMouseCoords);
	return ret;
}

InputManager.prototype.GetMouseDown = function(button) {
	if (button >= 0 && button <= 2) {
		if (this.mButtonStates[button] == 1 || this.mButtonStates[button] == 2) {
			return true;
		}
	}
	
	return false;
}

InputManager.prototype.GetMousePressed = function(button) {
	if (button >= 0 && button <= 2) {
		if (this.mButtonStates[button] == 2) {
			return true;
		}
	}
	
	return false;
}

InputManager.prototype.GetMouseReleased = function(button) {
	if (button >= 0 && button <= 2) {
		if (this.mButtonStates[button] == 3) {
			return true;
		}
	}
	
	return false;
}
// ...End

