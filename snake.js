"use strict";

function snakeObject() {
	this.maxLength	= 5;
	this.lastDir = [1,0];
	
	var fill 	= settings.color.snakebody.fill,
		stroke	= settings.color.snakebody.stroke;
	this.body =[new cellObject([5,1],[1,0]),
				new cellObject([4,1],[1,0]),
				new cellObject([3,1],[1,0]),
				new cellObject([2,1],[1,0]),
				new cellObject([1,1],[1,0])];
	
	this.direct = function(dir) {
		var cell = this.body[0].nextCell(dir),
			isPortal = cell.isPortal();
		if (isPortal) { if (portal.inUse()) return false; else cell = this.traversePortal(cell); }
		if (this.isObstructed(cell)) return false;
		this.move(cell);
		this.lastDir = dir;
	}
	
	this.move = function(cell) {
		this.body.unshift(cell);
		
		if (portal.cooldown) portal.cooldown--;
		
		food.eat();
		this.slither();
		game.draw();
	}
	
	this.isObstructed = function(cell) {
		if (cell.isWall()) return true;
		if (cell.isBody(this.body, true)) return true;
		return false;
	}
	
	this.slither = function() {
		var	excess = this.body.length - this.maxLength;
		this.body.splice(-1, excess);
	}
	
	this.traversePortal = function(cell) {	
		if (portal.cooldown) return cell;

		var l = portal.gate.length-1;
		for (var i=0;i<=l;i++) {
			if ((portal.gate[i].pos[0] === cell.pos[0]) &&
				(portal.gate[i].pos[1] === cell.pos[1])) {
				portal.cooldown = 2;
				cell.pos[0] = portal.gate[l-i].pos[0];
				cell.pos[1] = portal.gate[l-i].pos[1];
				return cell;
			}
		}
	}
	
	this.draw = function() {
		var len = this.body.length - 1,
			border = toRGBA(settings.color.snakebody.stroke),
			fill = toRGBA(settings.color.snakebody.fill);
		
		
		for (var i=0; i<=len ; i++) {
			var tailward,
				current = this.body[i],
				headward,
				edges;
			
			if (i===0) headward = false; else headward = this.body[i-1];
			if (i===len) tailward = false; else tailward = this.body[i+1];
			
			
			
			
			edges = this.findEdges(tailward, current, headward);
			current.draw(fill, border, edges);
		}
	}
	
	this.findEdges = function(tailward, current, headward) {
		if (!tailward || !headward) {
			switch (true) {
				case !headward:			 var dir = current.getDirection(tailward);	break;
				case !tailward:			 var dir = current.getDirection(headward);	break;
			}
			
			if (dir[0] < 0) return 0x8;
			if (dir[0] > 0) return 0x2;
			if (dir[1] < 0) return 0x4;
			if (dir[1] > 0) return 0x1;
		}
		
		var nex;
		if (headward.isPortal) nex = headward.dir; else nex = current.getDirection(headward);
		var pre = current.getDirection(tailward);
		
		if (pre[0] === nex[0]) return 0x5;
		if (pre[1] === nex[1]) return 0xA;
		if (((pre[0] ===  1) || (nex[0] ===  1)) && ((pre[1] ===  1) || (nex[1] ===  1))) return 0x3;
		if (((pre[0] === -1) || (nex[0] === -1)) && ((pre[1] ===  1) || (nex[1] ===  1))) return 0x9;
		if (((pre[0] === -1) || (nex[0] === -1)) && ((pre[1] === -1) || (nex[1] === -1))) return 0xC;
		if (((pre[0] ===  1) || (nex[0] ===  1)) && ((pre[1] === -1) || (nex[1] === -1))) return 0x6;
	}
}