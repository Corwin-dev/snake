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

	this.drawEdge = function(color, side) {
		var s = m.cell;
		var x = (this.pos[0] * s) + m.border[0],
			y = (this.pos[1] * s) + m.border[1];

		ctx.strokeStyle = color;
		ctx.lineWidth = s/8;
		ctx.lineCap = "round";
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

function backgroundObject() {
	this.draw = function() {
		ctx.fillStyle = toRGBA(settings.color.game.stroke);
		ctx.fillRect(0,0,m.window[0],m.window[1]);
		
		ctx.fillStyle = toRGBA(settings.color.game.fill);
		ctx.fillRect(m.border[0], m.border[1], m.pixel[0], m.pixel[1]);
	}
}