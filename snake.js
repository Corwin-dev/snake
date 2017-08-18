"use strict";

window.addEventListener("keydown", keyDown, true);
window.addEventListener("keyup", keyUp, true);
window.addEventListener("click", mouseClick, false)

var	m,
	bg,
	input,
	mouse,
	game,
	menu,
	snake,
	food,
	portal,
	canvas,
	ctx;

function setup() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
  
	m = new measureObject();	
	bg = new backgroundObject();
	input = new inputObject();
	mouse = new mouseObject();
	game = new gameObject();
	menu = new menuObject();

	game.start();
}

function measureObject() {
	this.cell 		= 	32;
	this.window		=  [window.innerWidth,
 						window.innerHeight];
	this.grid 		=  [Math.floor(this.window[0]  / this.cell),
				   		Math.floor(this.window[1] / this.cell)];
	this.gmin 		= 	Math.min(this.grid[0],this.grid[1]);
	this.gmax 		= 	Math.max(this.grid[0],this.grid[1]);
	this.pixel 		=  [this.grid[0] * this.cell,
				   		this.grid[1] * this.cell];
	this.border 	=  [Math.floor((this.window[0]  % this.cell) / 2),
				   		Math.floor((this.window[1] % this.cell) / 2)];
	this.center 	=  [this.window[0]  / 2,
				   		this.window[1] / 2];
}

function backgroundObject() {
	this.draw = function() {
		ctx.fillStyle = toRGBA(settings.color.game.stroke);
		ctx.fillRect(0,0,m.window[0],m.window[1]);
		
		ctx.fillStyle = toRGBA(settings.color.game.fill);
		ctx.fillRect(m.border[0], m.border[1], m.pixel[0], m.pixel[1]);
	}
}

function inputObject() {
	this.lastKey;
	this.pressedKeys = [];
	
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
		if (game.paused) {if (this.isPause(id)) game.pause(0); return;}
		
		switch (true) {
			case this.isLeft(id):	snake.direct([-1, 0]); break;
			case this.isUp(id):		snake.direct([ 0,-1]); break;
			case this.isRight(id):	snake.direct([ 1, 0]); break;
			case this.isDown(id):	snake.direct([ 0, 1]); break;	
				
			case this.isPause(id):	game.pause(0); break;
			case this.isMenu(id):	game.quit(0); break;
			case this.isRestart(id):game.restart(0); break;
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

function gameObject() {
	this.paused = false;
	this.pausedBy;
	this.pauseText = "PAUSED";
	
	this.start = function() {
		this.create();
		this.draw();
	}
	
	this.create = function() {
		snake = new snakeObject();
		portal = new portalObject();
		food = new foodObject();
		food.move();
	}
	
	this.pause = function(flag) {
		this.paused = !this.paused;
		
		switch (this.paused) {
			case true: 
				menu.draw(m.center[0], m.center[1], this.pauseText, m.pixel[1]/8);
				break;
			case false: 
				if (!snake) this.create();
				this.draw();
				break;
		}
	}
		
	this.draw = function() {
		bg.draw();
		food.draw();
		snake.draw();
		portal.draw();
	}
}

function menuObject() {
	this.draw = function(x,y,string,height) {
		var half = height/2,
			width = string.length*(half),
			xcorner = x - (width/2),
			ycorner = y - (height/2);
		
		//bg.draw();
		
		this.box(xcorner, ycorner, width, height);
		this.text(x, y, string, half);
	}
	
	this.box = function(x,y,width,height) {
		ctx.strokeStyle = toRGBA(settings.color.menu.stroke);
		ctx.lineWidth = height/10;
		ctx.lineJoin = "round";
		ctx.fillStyle = toRGBA(settings.color.menu.fill);
		
		ctx.fillRect(x, y, width, height);
		ctx.strokeRect(x, y, width, height);
	}
	
	this.text = function (x,y,string,size) {
		ctx.fillStyle = toRGBA(settings.color.menu.text);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = size + "px Courior New";
		
		ctx.fillText(string,x,y);
	}
}

function cellObject(pos) {
	this.pos = pos;

  this.getPixels = function() {
		var pixels = [], s = m.cell, b = m.border, l = this.pos.length;
		for (var i=0;i<l;i++) {
			pixels[i] = b[i]+(pos[i]*s);
		}
		return pixels;
	}
	
	this.pixels = this.getPixels();
	
	this.nextCell = function(dir) {
		var x = this.pos[0] + dir[0];
		var y = this.pos[1] + dir[1];
		return new cellObject([x,y]);	
	}

	this.getDirection = function(cell) {
		var x = cell.pos[0] - this.pos[0];
		var y = cell.pos[1] - this.pos[1];
		return [x,y];
	}

	this.convertToGrid = function() {
		var size = m.cell, border = m.border, pos = this.pos;
		for (var i=0;i<2;i++) {
			this.pos[i] = Math.floor((pos[i]-border[i])/size);
		}
		this.pixels = this.getPixels();
	}

	this.isPortal = function() {
		if (!portal.opened) return false;
		var l = portal.gate.length, k = this.pos.length;
		for (var i=0;i<l;i++) {
			if ((this.pos[0] === portal.gate[i].pos[0]) && (this.pos[1] === portal.gate[i].pos[1])) return true;
		}
		return false;
	}

	this.isWall = function() {
		if ((this.pos[0] < 0) || (this.pos[1] < 0) || (this.pos[0] >= m.grid[0]) || (this.pos[1] >= m.grid[1])) return true; else return false;
	}	

	this.isBody = function(body) {
		var l = body.length;
		for (var i=0;i<l;i++) {
			if ((body[i][0] === this.pos[0]) && (body[i][1] === this.pos[1])) return true;
		}
		return false;
	}

	this.drawEdge = function(color, side) {
		var x = this.pos[0],
			y = this.pos[1],
			s = m.size;

		ctx.strokeStyle(color);
		ctx.lineWidth = s/16;
		ctx.beginPath();
		switch (side) {
			case 0: this.drawLine(x,y,color,x,y+s); break;
			case 1: this.drawLine(x,y,color,x+s,y); break;
			case 2: this.drawLine(x+s,y,color,x+s,y+s); break;
			case 3: this.drawLine(x,y+s,color,x+s,y+s); break;
		}
		ctx.stroke();
	}

	this.drawLine = function(x1,y1,color,x2,y2){
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
	}
}

function snakeObject() {
	this.head 	= new cellObject([5,1]);
	this.maxLength	= 5;
	this.body =[[1,1], //tail
				[2,1],
				[3,1],
				[4,1],
				[5,1]]; //head
	
	this.direct = function(dir) {
		var cell = this.head.nextCell(dir);
		if (cell.isPortal()) cell = this.traversePortal(cell);
		if (this.isObstructed(cell)) return false;
		this.move(cell);
	}
	
	this.move = function(cell) {
		this.head = cell;
		
		if (portal.cooldown) portal.cooldown--;
		
		food.eat();
		this.slither();
		game.draw();
	}
	
	this.isObstructed = function(cell) {

		if (cell.isWall()) return true;

		if (cell.isBody(this.body)) return true;
		return false;
	}
	
	this.slither = function() {
		var x = this.head.pos[0],
			y = this.head.pos[1],
			current = this.body.length,
			target = this.maxLength;
		
		this.body.push([x, y]);
		if (current > target) this.body.shift(0, current-target);

	}
	
	this.traversePortal = function(cell) {	
		if (portal.cooldown) return cell;

		var l = portal.gate.length-1;
		for (var i=0;i<=l;i++) {
			if ((portal.gate[i].pos[0] === cell.pos[0]) &&
				(portal.gate[i].pos[1] === cell.pos[1])) {
				portal.cooldown = 2;

				return portal.gate[l-i];
			}
		}
	}
	
	this.draw = function() {
		ctx.strokeStyle = toRGBA(settings.color.snakebody.stroke);
		ctx.lineWidth = m.cell/16;
    
		var l = this.body.length;
		ctx.fillStyle = toRGBA(settings.color.snakebody.fill);
    
		for (var i = 0; i < l-1; i++) {

			if (i>0) { 
				var previousCell = new cellObject([this.body[i-1][0], this.body[i-1][1]]);
				var currentCell = new cellObject([this.body[i][0], this.body[i][1]]);
				var nextCell = new cellObject([this.body[i+1][0], this.body[i+1][1]]);
				this.stroke(previousCell, currentCell, nextCell);
			}
			
			var x = m.border[0] + (this.body[i][0] * m.cell);
			var y = m.border[1] + (this.body[i][1] * m.cell);
			ctx.fillRect(x, y, m.cell, m.cell);
		}
		
		ctx.strokeStyle = toRGBA(settings.color.snakehead.stroke);
		ctx.fillStyle = toRGBA(settings.color.snakehead.fill);
		var x = m.border[0] + (this.head.pos[0] * m.cell);
		var y = m.border[1] + (this.head.pos[1] * m.cell);
		ctx.fillRect(x, y, m.cell, m.cell);
	}
	
	this.stroke = function(previous, current, next) {
		var pre = current.getDirection(previous);	// [-1, 0]
		var nex = current.getDirection(next);			// [ 0, 1]
		
		if (pre[0] === nex[0]) this.drawStroke(0xA); // 0xA == Left(8) and Right(2) edges	
		if (pre[1] === nex[1]) this.drawStroke(0x5); // 0x5 == Top(4) and Bottom(1) edges
		if (((pre[0] ===  1) || (nex[0] ===  1)) && ((pre[1] ===  1) || (nex[1] ===  1))) this.drawStroke(current, 0xC); // 0xC == Left(8) and Top(4) edges
		if (((pre[0] === -1) || (nex[0] === -1)) && ((pre[1] ===  1) || (nex[1] ===  1))) this.drawStroke(current, 0x6); // 0x6 == Top(4) and Right(2) edges
		if (((pre[0] === -1) || (nex[0] === -1)) && ((pre[1] === -1) || (nex[1] === -1))) this.drawStroke(current, 0x3); // 0x3 == Right(2) and Bottom (1) edges
		if (((pre[0] ===  1) || (nex[0] ===  1)) && ((pre[1] === -1) || (nex[1] === -1))) this.drawStroke(current, 0x9); // 0x9 == Bottom(1) and Left(8) edges
	}
	
	this.drawStroke = function(cell, hex) {
		var color = toRGBA(settings.color.snakebody.stroke);
		if ((hex & 0x8) === 0x8) cell.drawEdge(color, 0);
		if ((hex & 0x4) === 0x4) cell.drawEdge(color, 1);
		if ((hex & 0x2) === 0x2) cell.drawEdge(color, 2);
		if ((hex & 0x1) === 0x1) cell.drawEdge(color, 3);		
	}
}

function foodObject() {
	this.cell = new cellObject([0,0]);

	this.move = function() {
		var cell = new cellObject([0,0]), grid = m.grid;
		for (var i=0;i<=50;i++) {
			if (i===50) {
				game.win();
				return false;
			}
			cell = getRandomCell();
			if (food.isObstructed(cell)) continue; else break;
		}
		this.cell = cell;
		game.draw();
	}
	
	this.isObstructed = function(cell) {
		if (cell.isWall()) return true;
		if (cell.isBody(snake.body)) return true;
		if (cell.isPortal()) return true;
		return false;
	}
	
	this.eat = function() {
		if ((snake.head.pos[0] === this.cell.pos[0]) && (snake.head.pos[1] === this.cell.pos[1])) {
			this.move();
			snake.maxLength++;
		}
	}
	
	this.draw = function() {
		ctx.strokeStyle = toRGBA(settings.color.food.stroke);
		ctx.lineWidth = m.cell/16;
		ctx.fillStyle = toRGBA(settings.color.food.fill);
		
		var size = m.cell;
		var x = m.border[0] + (this.cell.pos[0] * size);
		var y = m.border[1] + (this.cell.pos[1] * size);
		
		ctx.fillRect(x,y,size,size);
		ctx.strokeRect(x,y,size,size);
	}
}

function portalObject() {
	this.opened = false;
	this.gate = [];
	this.gate[0] = new cellObject([0,0]); //Orange
	this.gate[1] = new cellObject([0,0]); //Blue
	
	this.cooldown = 0;
	
	this.click = function(x,y) {
		var cell = new cellObject([x,y]);
		cell.convertToGrid();
		if (this.isObstructed(cell)) return false; else this.open(cell);
	}
	
	this.isObstructed = function(cell) {
		if (cell.isWall()) return true;
		if (cell.isBody(snake.body)) return true;
		return false;
	}
	
	this.open = function(cell) {
		if (this.inUse()) return false;
		this.gate[0] = snake.head;
		this.gate[1] = cell;
		
		this.opened = true;
		snake.move(cell);
		game.draw();
	}
	
	this.inUse = function() {
		if (!this.opened) return false;
		var l = this.gate.length;

		for (var i=0;i<2;i++) {
			var result = this.gate[i].isBody(snake.body);


			if (result) return true;
		}
		return false;
	}
	
	this.draw = function() {
		if (!this.opened) return false;

			 if (snake.head.isPortal())	ctx.fillStyle = toRGBA(settings.color.snakehead.fill);
		else if (this.inUse())			ctx.fillStyle = toRGBA(settings.color.snakebody.fill);
		else 							ctx.fillStyle = toRGBA(settings.color.transparent.fill);
		
		var size = m.cell,
			l	 = this.gate.length;
		ctx.lineWidth = size/16;
		
		for (var i=0;i<l;i++) {
			var x = this.gate[i].pixels[0],
				y = this.gate[i].pixels[1];
			
			if (i===0) {
				ctx.strokeStyle = toRGBA(settings.color.orangeportal.stroke);
			} else {
				ctx.strokeStyle = toRGBA(settings.color.blueportal.stroke);
			}
			ctx.fillRect(x, y, size, size);
			ctx.strokeRect(x, y, size, size);
		}
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

function getRandomCell() {
	var x = Math.floor(Math.random() * m.grid[0]),
		y = Math.floor(Math.random() * m.grid[1])
	return new cellObject([x, y]);

function toRGBA(array) {
	var output = "rgba(";
	for (var i=0;i<3;i++) {
		output += array[i] + ",";
	}
	output += array[3] + ")";
	return output;
}