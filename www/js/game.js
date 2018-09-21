// Set up canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
//append canvas to body
document.querySelector('.gameScreen').insertBefore(canvas, document.getElementById('player1'));

var blockSize = window.innerWidth > 720 ? 40 : 25;

var width, height, widthInBlocks, heightInBlocks, start1_x, start1_y, start2_x, start2_y;
//re-work canvas
function activate_canvas(console_type) {
	var c = document.getElementsByTagName('canvas')[0];
	
	// Get the width and height from the canvas element
	if (console_type === 'typeA') {
		player_console = 260;
		width = window.innerWidth - blockSize - (window.innerWidth % blockSize);
		width_rem = window.innerWidth % blockSize;
		height = (window.innerHeight - player_console - ((window.innerHeight - player_console) % blockSize));
		height_rem = window.innerHeight % blockSize;
	} else {
		player_console = 240;
		width = (window.innerWidth - player_console - ((window.innerWidth - player_console) % blockSize));
		width_rem = window.innerWidth % blockSize;
		height = window.innerHeight - blockSize - (window.innerHeight % blockSize);
		height_rem = window.innerHeight % blockSize;
	}
	
	//set width and height
	c.width = width;
	c.height = height;
	// Work out the width and height in blocks
	widthInBlocks = width / blockSize;
	heightInBlocks = height / blockSize;
	//snake starting positions
	start1_x = Math.floor( (width/blockSize) / 4 );
	start1_y = Math.floor( (height/blockSize) / 4 );
	start2_x = Math.floor( ((width/blockSize) / 4) * 3 );
	start2_y = Math.floor( ((height/blockSize) / 4) * 3);
}


// Draw the score in the top-left corner
var drawScore = function () {
	ctx.font = "40px bit";
	ctx.fillStyle = "#703b00";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("You: " + snake.stats.score + '  Opp: ' + snake2.stats.score, blockSize + (width_rem/2), blockSize + (height_rem/2));
	ctx.save();
	ctx.translate(width - 150, height);
	ctx.rotate(-Math.PI);
	ctx.textAlign = "center";
	ctx.fillText("You: " + snake2.stats.score + '  Opp: ' + snake.stats.score, blockSize + (width_rem/2), blockSize + (height_rem/2));
	ctx.restore();
};
// Draw score single player
var drawScoreSingle = function () {
	ctx.font = "40px bit";
	ctx.fillStyle = "#703b00";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("You: " + snake.stats.score + '  Opp: n/a', blockSize + (width_rem/2), blockSize + (height_rem/2));
};
//check game settings
var settings = {
	isPlaying: false,
	//time played
	startTime: null,
	endTime: null,
	timePlayed: null,
	time: null,
	//player settings
	console: 'typeA',
	nowalls: false,
	applex2: false,
	biteme: false,
	snakebite: false,
	speedster: false,
	skins: [],
	colors: ['#ff69b4,#f93497','#ff69b4,#f93497'],
	classic_skin: 'images/skins/classic.png',
	apple_skin: 'images/skins/apple.png',
	classic: false,
	gameInterval: 150,
	//single player
	singlePlayer: false,
	//ads
	adsViewed: false,	
};
//check snake bites
var biteMe = function(player1, player2) {
	var head1 = player1.segments[0];
	var head2 = player2.segments[0];
	var body1 = player1.segments;
	var body2 = player2.segments;
	//check if player1 bites player2
	for(var a = 0; a < body2.length; a++) {
		if ( head1.equal(body2[a]) ) {
			var bit_pieces = body2.splice(a);
			player1.stats.bit++;
			player1.stats.bit_pieces+=bit_pieces.length;
			player2.stats.bitten++;
			if (a < 4) {
				gameOver();
				return;
			}
			return;
		}
	}
	//check if player2 bites player1
	for(var a = 0; a < body1.length; a++) {
		if ( head2.equal(body1[a]) ) {
			var bit_pieces2 = body1.splice(a);
			player2.stats.bit++;
			player2.stats.bit_pieces+=bit_pieces2.length;
			player1.stats.bitten++;
			if (a < 4) {
				gameOver();
				return;
			}
			return;
		}
	}
};
var snakeBite = function(player1, player2) {
	var head1 = player1.segments[0];
	var head2 = player2.segments[0];
	var body1 = player1.segments;
	var body2 = player2.segments;
	//check if player1 bites player2
	for(var a = 0; a < body2.length; a++) {
		if ( head1.equal(body2[a]) ) {
			gameOver();
			return;
		}
	}
	//check if player2 bites player1
	for(var a = 0; a < body1.length; a++) {
		if ( head2.equal(body1[a]) ) {
			gameOver();
			return;
		}
	}
};
// Clear the interval and display Game Over text
var gameOver = function () {
	//clear intervalId
	intervalId.stop();
	intervalId = null;
	//stop time counting
	settings.endTime = new Date().getTime();
	settings.timePlayed = settings.endTime - settings.startTime;
	//gameover text
	ctx.font = settings.console === 'typeA' ? "150px dpcomic" : "120px dpcomic";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over", width / 2, (height - 201) / 2);
	//update scores
	setTimeout(updateScore, 1000);
	//display play button again
	document.getElementById('start').style.display = 'block';
	settings.isPlaying = false;
};
//update score screen
function updateScore() {
	//get scores
	var scores = calculateScores();
	//set scores
	for (score_place in scores) {
		document.querySelector('.' + score_place + ' .result').innerHTML = scores[score_place];
	}
	//set apples
	var howmany = Math.floor(scores.total_apples / 30) > 3 ? 3 : Math.floor(scores.total_apples / 30);
	if (howmany > 0) {
		var apples = document.querySelectorAll('.apple img');
		var sound = document.getElementById('apple_score');
		//remove previous apples
		for (var c = 0; c < apples.length; c++) {
			apples[c].classList.remove('show');
		}
		//add new apples
		for (var d = 0; d < howmany; d++) {
			var appl = apples[d];
			var index = d;
			setTimeout(function() {
				appl.classList.add('show');
				sound.play();
			}, (1000 + ((index+1)*500)));
		}
	}
	//display scores
	goto('gameOver');
}
function calculateScores() {
	var scorescreen = document.querySelector('.gameOver');
	var gameScores = {
		time_played: null,
		total_apples: null,
		apple_details: null,
		you_bite_details: null,
		you_bite_pieces_details: null,
		bitten_off_pieces_details: null
		//fun_details: null
	};
	//calculate time played
	var hours = ((settings.timePlayed / (1000*60*60)) % 60);
	var minutes = ((settings.timePlayed / (1000*60)) % 60);
	var seconds = (settings.timePlayed / 1000) % 60 ;
	gameScores.time_played = settings.time = (Math.floor(hours) < 10 ? ('0' + Math.floor(hours)) : Math.floor(hours)) + ':' + (Math.floor(minutes) < 10 ? ('0' + Math.floor(minutes)) : Math.floor(minutes)) + ':' + (Math.floor(seconds) < 10 ? ('0' + Math.floor(seconds)) : Math.floor(seconds));
	//calculate total apples
	gameScores.total_apples = snake.stats.score + snake2.stats.score;
	//calculate apple details
	gameScores.apple_details = snake.stats.score + '\\' + snake2.stats.score;
	//check if biting is allowed and calc accordingly
	if(settings.biteme) {
		//calculate times you bit your opponent
		gameScores.you_bite_details = snake.stats.bit + '\\' + snake2.stats.bit;
		//calculate bite pieces taken from opponent
		gameScores.you_bite_pieces_details = snake.stats.bit_pieces + '\\' + snake2.stats.bit_pieces;
		//calculate bite pieces taken from you
		gameScores.bitten_off_pieces_details = snake2.stats.bit_pieces + '\\' + snake.stats.bit_pieces;
	} else {
		//set default values of NA
		gameScores.you_bite_details = 'N/A';
		gameScores.you_bite_pieces_details = 'N/A';
		gameScores.bitten_off_pieces_details = 'N/A';
	}
	//return the scores object
	return gameScores;
}

// Create the snake and apple objects
var snake;// = new Parts.Snake([start1_x, start1_y+2], [start1_x, start1_y+1], [start1_x, start1_y], "down", "down");
var snake2;// = new Parts.Snake([start2_x, start2_y-1], [start2_x, start2_y], [start2_x, start2_y+1], "up", "up");
var apple;// = new Parts.Apple(Math.floor((width/blockSize)/2), Math.floor((height/blockSize)/2));
var apple2;// = new Parts.Apple(Math.floor(Math.random() * (widthInBlocks - 2)) + 1, Math.floor(Math.random() * (heightInBlocks - 2)) + 1);