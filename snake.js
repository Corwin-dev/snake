"use strict";

function snakeObject() {
	this.head 	= new cellObject([5,1]);
	this.maxLength	= 4;
	
	var fill 	= settings.color.snakebody.fill,
		stroke	= settings.color.snakebody.stroke;
		
	this.body =[[1,1], //new shapeObject(1,1,fill,stroke,0xD);
				[2,1], //new shapeObject(2,1,fill,stroke,0x5);
				[3,1], //new shapeObject(3,1,fill,stroke,0x5);
				[4,1], //new shapeObject(4,1,fill,stroke,0x5);
				[5,1]];//new shapeObject(5,1,fill,stroke,0x7);
	
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
    
		var len = this.body.length - 1;
		var border = toRGBA(settings.color.snakebody.stroke);
		var fill = toRGBA(settings.color.snakebody.fill);
    
		for (var i = 0; i<=len; i++) {
			var edges = 0x0,
				current = new cellObject([this.body[i][0], this.body[i][1]]);
			
			if (i!==0) var previous = new cellObject([this.body[i-1][0], this.body[i-1][1]]);
				
			if (i===len) {
				border = toRGBA(settings.color.snakehead.stroke);
				fill = toRGBA(settings.color.snakehead.fill);
				edges = this.findEdges(previous, current, false);
			}
			
			if (i<len) var next = new cellObject([this.body[i+1][0], this.body[i+1][1]]);
			
			

			if ((i!==0) && (i!==len)) {
				edges = this.findEdges(previous, current, next);
			} else if (i===len) {
				border = toRGBA(settings.color.snakehead.stroke);
				fill = toRGBA(settings.color.snakehead.fill);
				edges = this.findEdges(previous, current, false);
			} else if (i===0) {
				edges = this.findEdges(false, current, next);
			}
			current.draw(fill, border, edges);
		}
	}
	
	this.findEdges = function(previous, current, next) {
		if (!previous || !next) {
			var dir;
			switch (false) {
				case previous:	dir = current.getDirection(next); break;
				case next:		dir = current.getDirection(previous); break;
			}
			switch (dir[0]) {
				case -1: return 0x7;
				case  1: return 0xD;
			}
			switch (dir[1]) {
				case -1: return 0xB;
				case  1: return 0xE;
			}
		}
		
		var nex = current.getDirection(next);
		var pre = current.getDirection(previous);
		
		if (pre[0] === nex[0]) return 0xA; // 0xA == Left(8) and Right(2) edges	
		if (pre[1] === nex[1]) return 0x5; // 0x5 == Top(4) and Bottom(1) edges
		if (((pre[0] ===  1) || (nex[0] ===  1)) && ((pre[1] ===  1) || (nex[1] ===  1))) return 0xC; // 0xC == Left(8) and Top(4) edges
		if (((pre[0] === -1) || (nex[0] === -1)) && ((pre[1] ===  1) || (nex[1] ===  1))) return 0x6; // 0x6 == Top(4) and Right(2) edges
		if (((pre[0] === -1) || (nex[0] === -1)) && ((pre[1] === -1) || (nex[1] === -1))) return 0x3; // 0x3 == Right(2) and Bottom (1) edges
		if (((pre[0] ===  1) || (nex[0] ===  1)) && ((pre[1] === -1) || (nex[1] === -1))) return 0x9; // 0x9 == Bottom(1) and Left(8) edges
	}
}