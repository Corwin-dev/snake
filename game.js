"use strict";

function gameObject() {
	this.paused = false;
	this.pausedBy;
	this.pauseText = "PAUSED";
	this.zenMode = false;
	this.velocity = true;

	
	this.start = function() {
		if (this.velocity) window.interval = setInterval(update, 100);
		this.create();
		this.draw();
	}

	this.end - function() {

	}

	this.restart = function() {
		clearInterval(window.interval);
		this.start();
		//console.log(input.storedMoves, input.lastMove);
		input.storedMoves = [39];
		console.log(input.storedMoves, input.lastMove);

	}
	
	this.update = function() {
		if (!game.paused && game.velocity) input.update();
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
		if ((snake.body[0].pos[0] === this.cell.pos[0]) && (snake.body[0].pos[1] === this.cell.pos[1])) {
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
		var cell = new cellObject([x,y],snake.lastDir);
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
		this.gate[0] = snake.body[0];
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

			 if (snake.body[0].isPortal())	ctx.fillStyle = toRGBA(settings.color.snakehead.fill);
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