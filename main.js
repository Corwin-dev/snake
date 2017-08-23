"use strict";

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

function backgroundObject() {
	this.draw = function() {
		ctx.fillStyle = toRGBA(settings.color.game.stroke);
		ctx.fillRect(0,0,m.window[0],m.window[1]);
		
		ctx.fillStyle = toRGBA(settings.color.game.fill);
		ctx.fillRect(m.border[0], m.border[1], m.pixel[0], m.pixel[1]);
	}
}


function getRandomCell() {
	var x = Math.floor(Math.random() * m.grid[0]),
		y = Math.floor(Math.random() * m.grid[1])
	return new cellObject([x, y]);
}

function toRGBA(array) {
	var output = "rgba(";
	for (var i=0;i<3;i++) {
		output += array[i] + ",";
	}
	output += array[3] + ")";
	return output;
}