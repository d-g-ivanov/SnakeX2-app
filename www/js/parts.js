var Parts = (function Parts(){
	var publicAPI;
	
	/****************************************************************/
	
	/* THE BLOCK ONCTRUCTOR */
	var Block = function (col, row) {
		this.col = col;
		this.row = row;
	};
	
	Block.prototype.dirMatrix = {
		'left' : -90,
		'right' : 90,
		'up' : 0,
		'down' : 180,
	};
	
	Block.prototype.calcDirection = function(dir) {
		let angle;
		if (this.col === dir.col) {
			if (this.row === 0 && dir.row === heightInBlocks - 1) {
				angle = 0;
			} else if (this.row === heightInBlocks - 1 && dir.row === 0) {
				angle = 180;
			} else if (this.row > dir.row) {
				angle = 0;
			} else {
				angle = 180;
			}
		} else if (this.row === dir.row) {
			if (this.col === widthInBlocks - 1 && dir.col === 0) {
				angle = 90;				
			} else if (this.col === 0 && dir.col === widthInBlocks - 1) {
				angle = -90;
			} else if ( this.col < dir.col ) {
				angle = 90;	
			} else {
				angle = -90;
			}
		}
	
		return angle;
	};
	
		// Draw a square at the block's location
	Block.prototype.drawSquare = function (color, skin, apple) {
		var x = this.col * blockSize;
		var y = this.row * blockSize;
		if (color) {
			ctx.fillStyle = color;
			ctx.fillRect(x, y, blockSize, blockSize);
		}
		if (skin) {
			if (apple) {
				ctx.filter = 'blur(10px)';
				ctx.fillStyle = 'red';
				ctx.beginPath();
				ctx.arc(x + (blockSize/2), y + (blockSize/2), blockSize/2 + 10, 0 ,2*Math.PI);
				ctx.closePath();
				ctx.fill();
				ctx.filter = 'none';
				ctx.drawImage(skin, x-5, y-5, blockSize+10, blockSize+10);
			}
			else ctx.drawImage(skin, x+2, y+2, blockSize-4, blockSize-4);
		}
	};
	
		// Draw rect with rounded corners
	Block.prototype.drawTopRoundedSquare = function (color, dir) {
		var x = this.col * blockSize;
		var y = this.row * blockSize;
		var block = blockSize;
		var f = Math.round(block/2);
		var angle = this.dirMatrix[dir];
        ctx.fillStyle = color[0];		
		ctx.lineWidth = Math.round(f/4);
		ctx.strokeStyle = color[1];
		
		ctx.save();
		ctx.translate( x + block/2, y + block /2 );
		ctx.rotate(angle * Math.PI / 180);
		ctx.translate( -(x + block/2), -(y + block /2) );
		
		ctx.beginPath();
		//left line
		ctx.moveTo(x + f/8, y + block);
		ctx.lineTo(x + f/8, y + f);
		//top left curve
		ctx.quadraticCurveTo(x + f/8, y + f/8, x + f, y + f/8);
		//top line
		ctx.lineTo(x + block - f, y + f/8);
		//top right curve
		ctx.quadraticCurveTo(x + block - f/8, y + f/8, x + block - f/8, y + f);
		//right line
		ctx.lineTo(x + block - f/8, y + block);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		//eyes
		ctx.beginPath();
		ctx.fillStyle = color[1];
		ctx.arc(x + 1.3*f, y + f, 5, 0, 2*Math.PI);
		ctx.arc(x + 0.65*f, y + f, 5, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
		//tongue
		if ( ( (this.col > apple.sx && this.col < apple.ex) && (this.row > apple.sy && this.row < apple.ey) ) ||
			 ( settings.applex2 && (this.col > apple2.sx && this.col < apple2.ex) && (this.row > apple2.sy && this.row < apple2.ey) )
			) {
			ctx.beginPath();
			ctx.moveTo(x + f, y);
			ctx.lineTo(x + f, y - f/2);
			ctx.lineTo(x + f/2, y - f);
			ctx.moveTo(x + f, y - f/2);
			ctx.lineTo(x + f + f/2, y - f);
			ctx.stroke();
			ctx.closePath();
		}
		ctx.restore();
	};
	
			// Draw triangle
	Block.prototype.drawTriangle = function (color,dir) {
		var x = this.col * blockSize;
		var y = this.row * blockSize;
		var block = blockSize;
		var f = Math.round(block/4);
		var angle = this.calcDirection(dir);
		ctx.fillStyle = color[0];
		ctx.lineWidth = f/2;
		ctx.strokeStyle = color[1];
		
		ctx.save();
		ctx.translate( x + block/2, y + block /2 );
		ctx.rotate(angle * Math.PI / 180);
		ctx.translate( -(x + block/2), -(y + block /2) );
		ctx.beginPath();
		ctx.moveTo(x + f/4, y);
		ctx.lineTo(x + block / 2, y + block);
		ctx.lineTo(x + block  - f/4, y);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	};
	
				// Draw body rect
	Block.prototype.drawBodyRect = function (color, walls, skin, dir) {
		var block = blockSize;
		var f = Math.round(block/4);
		var x = this.col * blockSize;
		var y = this.row * blockSize;
		
		ctx.fillStyle = color[0];
		ctx.fillRect(x, y, blockSize, blockSize);
		
		ctx.strokeStyle = color[1];
		ctx.lineWidth = f/2;

		//top
		if(walls.TOP) {
			ctx.beginPath();
			ctx.moveTo(x, y + f/4);
			ctx.lineTo(x + block, y + f/4);
			ctx.closePath();
			
			ctx.stroke();
		}
		//right
		if (walls.RIGHT) {
			ctx.beginPath();
			ctx.moveTo(x + block - f/4, y);
			ctx.lineTo(x + block - f/4, y + block);
			ctx.closePath();
			
			ctx.stroke();
		}
		//bottom
		if (walls.BOTTOM) {
			ctx.beginPath();
			ctx.moveTo(x + block, y + block - f/4);
			ctx.lineTo(x, y + block - f/4);
			ctx.closePath();
			
			ctx.stroke();
		}
		//left
		if (walls.LEFT) {
			ctx.beginPath();
			ctx.moveTo(x + f/4, y + block);
			ctx.lineTo(x + f/4, y);
			ctx.closePath();
			
			ctx.stroke();
		}
		
		if (skin) {
			let angle = this.calcDirection(dir);
			ctx.save();
			ctx.translate( x + block/2, y + block /2 );
			ctx.rotate(angle * Math.PI / 180);
			ctx.translate( -(x + block/2), -(y + block /2) );
			ctx.drawImage(skin, x+2, y+2, blockSize-4, blockSize-4);
			ctx.restore();
		}
	};
	
		// Draw a circle at the block's location
	Block.prototype.drawCircle = function (color) {
		var centerX = this.col * blockSize + blockSize / 2;
		var centerY = this.row * blockSize + blockSize / 2;
		ctx.fillStyle = color;
		Utils.circle(centerX, centerY, blockSize / 2, true);
	};
		// Check if this block is in the same location as another block
	Block.prototype.equal = function (otherBlock) {
		return this.col === otherBlock.col && this.row === otherBlock.row;
	};
	
	/* THE SNAKE CONTRUCTOR */
	var Snake = function (block1, block2, block3, dir, ndir, color) {
		this.segments = [
			new Block(block1[0], block1[1]),
			new Block(block2[0], block2[1]),
			new Block(block3[0], block3[1])
		];
		this.direction = dir;
		this.nextDirection = ndir;
		this.stats = {
			score: 0,
			bitten: 0,
			bit: 0,
			bit_pieces: 0
		};
		this.color = color;
		this.skin = null;
		
		console.log(this);
	};
		//set pattern, if any
	Snake.prototype.setSkin = function(url) {
		var img = new Image();
		var self = this;
		img.onload = function() {
			self.skin = img;
		}
		img.src = url;
	}
	
		// Draw a square for each segment of the snake's body
	Snake.prototype.draw = function () {
		if (settings.classic) {
			for (var i = 0; i < this.segments.length; i++) {
				this.segments[i].drawSquare(this.color, this.skin);
			}
		} else {
			var dir;
			var walls = {};
			//draw snake shadow
			ctx.filter = 'blur(10px)';
			for (var i = 0; i < this.segments.length; i++) {
				if (i === this.segments.length - 1) {
					this.segments[i].drawTriangle('rgba(0,0,0,0.8)', dir);
				} else {
					this.segments[i].drawSquare('rgba(0,0,0,0.8)', null);
					if (i === this.segments.length-2) {
						dir = {col: this.segments[i].col, row: this.segments[i].row};
					}
				}
			}
			ctx.filter = 'none';
			//draw snake
			for (var i = 0; i < this.segments.length; i++) {
				if (i === 0) {
					this.segments[i].drawTopRoundedSquare(this.color, this.direction);
				} else if (i === this.segments.length - 1) {
					this.segments[i].drawTriangle(this.color, dir);
				} else {
					walls = {
						LEFT: !( this.segments[i].col - 1 === this.segments[i-1].col || this.segments[i].col - 1 === this.segments[i+1].col || (this.segments[i].col === 0 && this.segments[i-1].col === widthInBlocks - 1) || (this.segments[i].col === 0 && this.segments[i+1].col === widthInBlocks - 1) ),
						RIGHT: !( this.segments[i].col + 1 === this.segments[i-1].col || this.segments[i].col + 1 === this.segments[i+1].col || (this.segments[i].col === widthInBlocks - 1 && this.segments[i-1].col === 0) || (this.segments[i].col === widthInBlocks - 1 && this.segments[i+1].col === 0) ),
						TOP: !( this.segments[i].row - 1 === this.segments[i-1].row || this.segments[i].row - 1 === this.segments[i+1].row || (this.segments[i].row === 0 && this.segments[i-1].row === heightInBlocks - 1) || (this.segments[i].row === 0 && this.segments[i+1].row === heightInBlocks - 1) ),
						BOTTOM: !( this.segments[i].row + 1 === this.segments[i-1].row || this.segments[i].row + 1 === this.segments[i+1].row || (this.segments[i].row === heightInBlocks - 1 && this.segments[i-1].row === 0) || (this.segments[i].row === heightInBlocks - 1 && this.segments[i+1].row === 0) ),
					};
					this.segments[i].drawBodyRect(this.color, walls, this.skin, this.skin ? {col: this.segments[i-1].col, row: this.segments[i-1].row} : null);
				}
			}
		}
	};
		// Create a new head and add it to the beginning of
		// the snake to move the snake in its current direction
	Snake.prototype.move = function () {
		var head = this.segments[0];
		var newHead;
		this.direction = this.nextDirection;
		if (this.direction === "right") {
			newHead = new Block(head.col + 1, head.row);
		} else if (this.direction === "down") {
			newHead = new Block(head.col, head.row + 1);
		} else if (this.direction === "left") {
			newHead = new Block(head.col - 1, head.row);
		} else if (this.direction === "up") {
			newHead = new Block(head.col, head.row - 1);
		}
		if(settings.nowalls) {
			if (this.checkWallCollision(newHead)) {
				if (this.direction === "right") {
					newHead = new Block(0, head.row);
				} else if (this.direction === "down") {
					newHead = new Block(head.col, 0);
				} else if (this.direction === "left") {
					newHead = new Block(widthInBlocks-1, head.row);
				} else if (this.direction === "up") {
					newHead = new Block(head.col, heightInBlocks-1);
				}
			}
		} else {
			if (this.checkWallCollision(newHead)) {
				gameOver();
				return;
			}
		}
		
		if (this.checkSelfCollision(newHead)) {
			gameOver();
			return;
		}
		this.segments.unshift(newHead);
		if (newHead.equal(apple.position)) {
			this.stats.score++;
			if (settings.speedster) {settings.gameInterval > 100 ? settings.gameInterval-=10: settings.gameInterval = 100; intervalId.interval = settings.gameInterval;}
			apple.move();
		} else if (settings.applex2 && newHead.equal(apple2.position)) {
			this.stats.score++;
			if (settings.speedster) {settings.gameInterval > 100 ? settings.gameInterval-=10: settings.gameInterval = 100; intervalId.interval = settings.gameInterval;}
			apple2.move();
		} else {
			this.segments.pop();
		}
	};
		// Check if the snake's new head has collided with the wall
	Snake.prototype.checkWallCollision = function (head) {
		var leftCollision = (head.col + 1 === 0);
		var topCollision = (head.row + 1 === 0);
		var rightCollision = (head.col === widthInBlocks);
		var bottomCollision = (head.row === heightInBlocks);
		var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
		return wallCollision;
	};
		// Check if the snake's new head has collided with itself
	Snake.prototype.checkSelfCollision = function (head) {
		var selfCollision = false;
		for (var i = 0; i < this.segments.length; i++) {
			if (head.equal(this.segments[i])) {
				selfCollision = true;
			}
		}
		return selfCollision;
	};
		// Set the snake's next direction based on the keyboard
	Snake.prototype.setDirection = function (newDirection) {
		if (this.direction === "up" && newDirection === "down") {
			return;
		} else if (this.direction === "right" && newDirection === "left") {
			return;
		} else if (this.direction === "down" && newDirection === "up") {
			return;
		} else if (this.direction === "left" && newDirection === "right") {
			return;
		}
		this.nextDirection = newDirection;
	};
	
	/* THE APPLE CONTRUCTOR */
	var Apple = function (x, y) {
		this.position = new Block(x, y);
		this. skin = null;
		this.sx = null;
		this.ex = null;
		this.sy = null;
		this.ey = null;
		this.range = 5;
	};
		// Draw a circle at the apple's location
	Apple.prototype.draw = function () {
		settings.classic ? this.position.drawSquare('black', this.skin) : this.position.drawSquare(null, this.skin, true);
	};
		// Move the apple to a new random location
	Apple.prototype.move = function () {
		var randomCol = Math.floor(Math.random() * (widthInBlocks));
		var randomRow = Math.floor(Math.random() * (heightInBlocks))
		this.position = new Block(randomCol, randomRow);
		this.calcRange();
	};
		// set apple image
	Apple.prototype.setSkin = function(url) {
		var img = new Image();
		var self = this;
		img.onload = function() {
			self.skin = img;
		}
		img.src = url;
	}
		//calculate apple range
	Apple.prototype.calcRange = function() {
		this.sx = this.position.col - this.range;
		this.ex = this.position.col + this.range;
		this.sy = this.position.row - this.range;
		this.ey = this.position.row + this.range;
	}
	
	
	/****************************************************************/
	
	publicAPI = {
		Block: Block,
		Snake: Snake,
		Apple: Apple
	};
	
	return publicAPI;
})();



/*
https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}*/