"use strict";

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
	
	this.draw = function(fill, border, sides) {
		var cellSize = m.cell;
		var edgeWidth = 2;
		var coreSize = cellSize - (edgeWidth*2);
		var x_edge = (this.pos[0] * cellSize) + m.border[0],
			y_edge = (this.pos[1] * cellSize) + m.border[1];
		var x_core = x_edge + edgeWidth,
			y_core = y_edge + edgeWidth;
		
		
		ctx.fillStyle = border;
		ctx.fillRect(x_edge, y_edge, cellSize, cellSize);
		
		ctx.fillstyle = fill;
		ctx.fillRect(x_core, y_core, coreSize, coreSize);
		
		//console.log(fill+border);
		if ((sides & 0x8) === 0x8) this.fillEdge(fill, 0);
		if ((sides & 0x4) === 0x4) this.fillEdge(fill, 1);
		if ((sides & 0x2) === 0x2) this.fillEdge(fill, 2);
		if ((sides & 0x1) === 0x1) this.fillEdge(fill, 3);
	}
	
	this.fillEdge = function(fill, side) {
		var cellSize = m.cell;
		var edgeWidth = m.edge;
		var coreSize = cellSize - (edgeWidth*2);
		var x_edge = (this.pos[0] * cellSize) + m.border[0],
			y_edge = (this.pos[1] * cellSize) + m.border[1];
		var x_core = x_edge + edgeWidth,
			y_core = y_edge + edgeWidth;
			
		ctx.fillstyle = fill;
		
		switch (side) {
			case 0: ctx.fillRect(x_edge, y_core, edgeWidth, coreSize); break;
			case 1: ctx.fillRect(x_core, y_edge, coreSize, edgeWidth); break;
			case 2: ctx.fillRect(x_edge+x_core, y_core, edgeWidth, coreSize); break;
			case 3: ctx.fillRect(x_edge, y_edge+y_core, coreSize, edgeWidth); break;
		}
	}
}