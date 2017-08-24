"use strict";

function cellObject(position, direction) {
	this.pos = position;
	this.dir = direction;
	this.cellSize = m.cell;
	
	this.getPixels = function() {
		var pixels = [], s = this.cellSize, b = m.border, l = this.pos.length;
		for (var i=0;i<l;i++) {
			pixels[i] = b[i]+(this.pos[i]*s);
		}
		return pixels;
	}
	
	this.pixels = this.getPixels();

	this.edgeWidth = 2;
	this.coreSize = this.cellSize - (this.edgeWidth*2);
	this.x_edge = this.pixels[0];
	this.y_edge = this.pixels[1];
	this.x_core = this.x_edge + this.edgeWidth;
	this.y_core = this.y_edge + this.edgeWidth;

	this.is = function(cell) {
		if ((this.pos[0] === cell.pos[0]) && (this.pos[1] === cell.pos[1])) return true; else return false;
	}

	this.nextCell = function(dir) {
		var x = this.pos[0] + dir[0];
		var y = this.pos[1] + dir[1];
		return new cellObject([x,y],dir);	
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
		var l = portal.gate.length;
		for (var i=0;i<l;i++) {
			if (this.is(portal.gate[i])) return true;
			//if ((this.pos[0] === portal.gate[i].pos[0]) && (this.pos[1] === portal.gate[i].pos[1])) return true;
		}
		return false;
	}

	this.isWall = function() {
		if ((this.pos[0] < 0) || (this.pos[1] < 0) || (this.pos[0] >= m.grid[0]) || (this.pos[1] >= m.grid[1])) return true; else return false;
	}	

	this.isBody = function(body) {
		var l = body.length-1;
		for (var i=0;i<l;i++) {
			if (this.is(body[i])) return true;
		}
		return false;
	}
	
	this.draw = function(fill, border, sides) {
		ctx.fillStyle = border;
		ctx.fillRect(this.x_edge, this.y_edge, this.cellSize, this.cellSize);
		
		ctx.fillStyle = fill;
		ctx.fillRect(this.x_core, this.y_core, this.coreSize, this.coreSize);
		
		if ((sides & 0x8) === 0x8) this.fillEdge(fill, 0);
		if ((sides & 0x4) === 0x4) this.fillEdge(fill, 1);
		if ((sides & 0x2) === 0x2) this.fillEdge(fill, 2);
		if ((sides & 0x1) === 0x1) this.fillEdge(fill, 3);
	}
	
	this.fillEdge = function(fill, side) {
		ctx.fillStyle = fill;
		
		switch (side) {
			case 0: ctx.fillRect(this.x_edge, 				this.y_core,				this.edgeWidth, 	this.coreSize);		break;
			case 1: ctx.fillRect(this.x_core, 				this.y_edge, 				this.coreSize, 		this.edgeWidth);	break;
			case 2: ctx.fillRect(this.x_core+this.coreSize, this.y_core, 				this.edgeWidth, 	this.coreSize);		break;
			case 3: ctx.fillRect(this.x_core, 				this.y_core+this.coreSize, 	this.coreSize, 		this.edgeWidth);	break;
		}
	}
}