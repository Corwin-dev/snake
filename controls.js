"use strict";

window.addEventListener("keydown", keyDown, true);
window.addEventListener("keyup", keyUp, true);
window.addEventListener("click", mouseClick, false);

function inputObject() {
	this.lastKey;
	this.lastMove = 39;
	this.pressedKeys = [];
	this.storedMoves = [];
	
	this.isMoveKey	= function(id) {return this.isKey(id, settings.keys.move);}
	this.isLeft		= function(id) {return this.isKey(id, settings.keys.left);}
	this.isUp		= function(id) {return this.isKey(id, settings.keys.up);}
	this.isRight	= function(id) {return this.isKey(id, settings.keys.right);}
	this.isDown		= function(id) {return this.isKey(id, settings.keys.down);}
	this.isMenu		= function(id) {return this.isKey(id, settings.keys.menu);}
	this.isRestart	= function(id) {return this.isKey(id, settings.keys.restart);}
	this.isPause	= function(id) {return this.isKey(id, settings.keys.pause);}
	
	this.isKey = function(id, keyArray) {
		if (keyArray.indexOf(id) !== -1) return true; else return false;
	}
	
	this.keyDown = function(id) {
		var isRepeating = !!this.pressedKeys[id];
		this.pressedKeys[id] = true;
		if (isRepeating) return false;

		switch (true) {
			case this.isPause(id):	game.pause(0); break;
			case this.isMenu(id):	game.quit(0); break;
			case this.isRestart(id):game.restart(0); break;
		}

		if (this.isMoveKey(id)) {
			if (game.velocity) {
				this.storedMoves.push(id);
			} else {
				this.send(id);
			}
		}
	}

	this.send = function(id) {
		var snakeMoved = false;
		switch (true) {
			case this.isLeft(id):	snakeMoved = snake.direct([-1, 0]); break;
			case this.isUp(id):		snakeMoved = snake.direct([ 0,-1]); break;
			case this.isRight(id):	snakeMoved = snake.direct([ 1, 0]); break;
			case this.isDown(id):	snakeMoved = snake.direct([ 0, 1]); break;
		}
		
		if (snakeMoved) this.lastMove = id;
		//console.log(this.lastMove, id);
		return snakeMoved;
	}
	this.update = function() {
		var snakeMoved = false;
		var i = 0;
		while (!snakeMoved) {
			if (this.storedMoves.length) {
				var nextMove = this.storedMoves.shift();
				snakeMoved = this.send(nextMove);
			} else {
				snakeMoved = this.send(this.lastMove);
			}
			if (i++ > 100) {
				debugger; 
				break;
			}
		}
	}
	this.keyUp = function(id) {
		this.pressedKeys[id] = false;
	}
}

function mouseObject() {
	this.click = function(x,y) {
		if (!game.paused) portal.click(x, y);
	}
}

function keyDown(event) {
	input.keyDown(event.keyCode);
}

function keyUp(event) {
	input.keyUp(event.keyCode);
}

function mouseClick(event) {
	var x = event.clientX,
		y = event.clientY;
	mouse.click(x,y);
}