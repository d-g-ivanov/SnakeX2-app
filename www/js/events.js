/************* GENERAL *************/
//disable default events
function disableEvent(evt) {
	evt.preventDefault();
	evt.stopPropagation();
	evt.stopImmediatePropagation();
}
//get index of child within parent
function getChildNumber(node) {
  return Array.prototype.indexOf.call(node.parentNode.children, node);
}
/***********************************/
//horizontal navigation to fiven screen
function goto(screen) {
	//screen move
	var where = screen || event.target.getAttribute('data-where') || null;
	var destination = where ? document.querySelector('.' + where) : '';
	var newScreen = destination ? getChildNumber( destination ) : 0;

	if (where) {
		//handle ads
		displayAdsOnScreenChange(where);
		
		//slide to new screen
		screens.forEach(function(screen){
			screen.style.transform = 'translate3d(' + ((getChildNumber(screen) - newScreen) * 100) + '%, 0, 0)';
			screen.classList.remove('active');
		});
		setTimeout(function(){
			destination.classList.add('active');
		}, 700);
		destination.scrollTop = 0;
		
		//slide background
		var game = document.getElementById('game');
		var newX = -(newScreen * screens[0].getBoundingClientRect().width);
		game.style.backgroundPosition = newX + 'px 0';
	} else {
		return;
	}
}
/********* MENU NAVIGATION *********/
//handling menugroup events
function actionPicker(event) {
	event.preventDefault();
	event.stopPropagation();
	//button sound
	btnSound();
	//screen move
	goto();
	//action
	var action = event.target.getAttribute('data-action');
	if (action) {
		window[action](event);
	}
}
//display sub menu
function displaySubmenu(event) {
	event.preventDefault();
	event.stopPropagation();
	//toggle hamburger
	var mbuttons = document.querySelectorAll('.menu_icon');
	var submenu = document.querySelector('.submenu');
	//change button status
	mbuttons.forEach(function(mbutton){
		mbutton.classList.toggle('open');
	});
	//toggle submenu
	submenu.classList.toggle('active');
	//play button sound
	btnSound();
	//pause/start game
	(settings.isPlaying && intervalId) ? intervalId.stopped ? intervalId.start() : intervalId.stop() : '';
}
//resume game button
function resumeGame() {
	event.preventDefault();
	event.stopPropagation();
	//hide submenu
	var submenu = document.querySelector('.submenu');
	submenu.classList.remove('active');
	//reset player menu button
	var mbuttons = document.querySelectorAll('.menu_icon');
	mbuttons.forEach(function(mbutton){
		mbutton.classList.remove('open');
	});
	//pause/start game
	intervalId ? intervalId.stopped ? intervalId.start() : intervalId.stop() : '';
}
//restart game
function restartGame() {
	event.preventDefault();
	event.stopPropagation();
	//toggle hamburger
	var mbuttons = document.querySelectorAll('.menu_icon');
	var submenu = document.querySelector('.submenu');
	//change button status
	mbuttons.forEach(function(mbutton){
		mbutton.classList.toggle('open');
	});
	//toggle submenu
	submenu.classList.toggle('active');
	//actual game restart
	startGame();
}
//toggle score details
function toggleScoreDetails() {
	event.preventDefault();
	event.stopPropagation();
	var gameOverScreen = document.querySelector('.gameOver');
	gameOverScreen.classList.toggle('scoreDetails');
}
//update game setting state on checkbox state change
function gameSettings_boxes(event){
	event.preventDefault();
	event.stopPropagation();
	//button sound
	btnSound();
	//change setting
	var state = event.target.value;//getAttribute('value');
	
	settings[state] = !settings[state];
	
	//check for settings overlap
	if (state === 'biteme' && settings.snakebite) {
		document.getElementById('snakebite').checked = false;
		settings.snakebite = false;
	} else if (state === 'snakebite' && settings.biteme) {
		document.getElementById('biteme').checked = false;
		settings.biteme = false;
	} else if (state === 'classic') {
		toggleClassic(event);
	}
}
//update game setting state on radio state change
function gameSettings_radio(event) {
	event.preventDefault();
	event.stopPropagation();
	//button sound
	btnSound();
	//change setting
	var state = event.target.value;
	settings.console = state;
	var consoles = document.querySelectorAll('.gameScreen .playerGroup-btn');
	
	consoles.forEach(function(console){
		console.classList.remove('typeA', 'typeB');
		console.classList.add(state);
	});
	
	//update canvas
	activate_canvas(settings.console);
}
//update game setting state on palette state change
function updatePlayerSettings(el) {
	var snake = el.parentNode.parentNode.parentNode.getAttribute('data-snake');
	var setting = el.parentNode.parentNode.getAttribute('data-setting');

	settings[setting][ parseInt(snake) ] = el.getAttribute('data-data');
}
//swatches
function updateSwatches(event) {
	event.preventDefault();
	event.stopPropagation();
	if (event.target.tagName === "LI") {
		//button sound
		btnSound();
		var items = event.target.parentNode.querySelectorAll('li');
		items.forEach(function(item) { item.classList.remove('selected'); });
		
		event.target.classList.add('selected');
		event.target.parentNode.parentNode.classList.remove('drop');
		
		updatePlayerSettings(event.target);
	}
}
//button click sound
function btnSound() {
	event.preventDefault();
	event.stopPropagation();
	btn_sound.play();
}
//background sound toggle
function bg_sound_toggle() {
	event.preventDefault();
	event.stopPropagation();
	//button sound
	btnSound();
	this.checked ? bg_sound.play() : bg_sound.pause();
}
//game submenu
function toggleSubmenu(event) {
	event.preventDefault();
	event.stopPropagation();
	//button sound
	btnSound();
	var parentEl = event.target.parentNode.parentNode;
	
	parentEl.querySelector('.drop') && parentEl.querySelector('.drop') !== event.target.parentNode ? parentEl.querySelector('.drop').classList.remove('drop') : '';
	
	event.target.parentNode.classList.toggle('drop');
}
//single player game
function singlePlayer() {
	settings.singlePlayer = true;
}
//single player game
function playMulti() {
	settings.singlePlayer = false;
}
//turn to classic game
function toggleClassic(event) {
	event.preventDefault();
	event.stopPropagation();
	var screen = document.querySelector('.gameScreen');
	var toggle = getChildNumber(event.target) ? screen.classList.add('classic') : screen.classList.remove('classic');
}
/***********************************/


/********* GAME RELATED *********/
//game loop
function gameLoop() {
	//behind the scenes canvas
	ctx.clearRect(0, 0, width, height);
	drawScore();
	snake.move();
	snake2.move();
	if (settings.biteme) { biteMe(snake, snake2); }
	if (settings.snakebite) { snakeBite(snake, snake2); }
	snake.draw();
	snake2.draw();
	apple.draw();
	if (settings.applex2) { apple2.draw(); }	
}
//game loop single player
function gameLoopSingle() {
	//behind the scenes canvas
	ctx.clearRect(0, 0, width, height);
	drawScoreSingle();
	snake.move();
	snake.draw();
	apple.draw();
	if (settings.applex2) { apple2.draw(); }	
}
//game start
var intervalId = null;
function startGame() {
	document.getElementById('start').style.display = 'none';
	var game = document.querySelector('.gameScreen');
	game.classList.contains('classic') ? settings.classic = true : settings.classic = false;
	//create players
	snake = new Parts.Snake([start1_x, start1_y+2], [start1_x, start1_y+1], [start1_x, start1_y], "down", "down", settings.classic ? 'black' : settings.colors[0].split(','));
	//snake skin
	if( ( settings.skins[0] && (settings.skins[0] !== "null") ) || settings.classic){
		snake.setSkin(settings.classic ? settings.classic_skin : (settings.colors[0] === '#2a5ffc,#0040ff' || settings.colors[0] === '#8000ff,#5a00b5') ? (settings.skins[0] + 'b.png') : (settings.skins[0] + 'a.png'));
	}
	snake2 = new Parts.Snake([start2_x, start2_y-1], [start2_x, start2_y], [start2_x, start2_y+1], "up", "up", settings.classic ? 'black' : settings.colors[1].split(','));
	//snake skin
	if( ( settings.skins[1] && (settings.skins[1] !== "null") ) || settings.classic) {
		snake2.setSkin(settings.classic ? settings.classic_skin : (settings.colors[1] === '#2a5ffc,#0040ff' || settings.colors[1] === '#8000ff,#5a00b5') ? (settings.skins[1] + 'b.png') : (settings.skins[1] + 'a.png'));
	}
	apple = new Parts.Apple(Math.floor((width/blockSize)/2), Math.floor((height/blockSize)/2));
	apple.calcRange();
	apple.setSkin(settings.classic ? settings.classic_skin : settings.apple_skin);
	apple2 = new Parts.Apple(Math.floor(Math.random() * (widthInBlocks - 2)) + 1, Math.floor(Math.random() * (heightInBlocks - 2)) + 1);
	apple2.calcRange();
	apple2.setSkin(settings.classic ? settings.classic_skin : settings.apple_skin);
	//check seetings for game interval
	if (settings.speedster) settings.gameInterval = 250;
	
	//set game interval and decide whether it would be a single or a multiplayer game
	if (settings.singlePlayer) {
		intervalId = Utils.setVariableInterval(gameLoopSingle, settings.gameInterval);
	} else {
		intervalId = Utils.setVariableInterval(gameLoop, settings.gameInterval);
	}
	
	//start time counting
	settings.startTime = new Date().getTime();
	//start game interval
	settings.isPlaying = true;
	intervalId.start();
}


// Convert keycodes to directions
var directions = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"
};
var directions2 = {
	87: "up", //W
	68: "right", //D
	83: "down", //S
	65: "left" //A
};

// The keydown handler for handling direction key presses
function onKeyPressMove(event) {
	if (settings.isPlaying) {
		var newDirection = directions[event.keyCode];
		var newDirection2 = directions2[event.keyCode];
		if (newDirection !== undefined) {
			snake.setDirection(newDirection);
		}
		if (newDirection2 !== undefined) {
			snake2.setDirection(newDirection2);
		}
	}
}

function onButtonMove(event) {
	if (settings.isPlaying) {
		var player = this.parentElement.id;
		var button = event.target;
		if (button.tagName !== "BUTTON") {
			while ((button = button.parentElement) && (button !== null) && button.tagName !== "BUTTON");
		}
		if(button.classList.contains('menu_icon')) {
			button.classList.toggle('open');
		} else {
			var newDirection = button.getAttribute('data-direction'); 
			if (player === 'player1') snake.setDirection(newDirection);
			if (player === 'player2') snake2.setDirection(newDirection);
		}
	}
}
/***********************************/




/********* ACTIVATE EVENTS *********/
/*screens*/
//screen buttons and navigation
var menuGroups = document.querySelectorAll('.screen button');
menuGroups.forEach(function(btn){
	if ( !btn.getAttribute('data-direction') ) {
		//btn.addEventListener('click', actionPicker);
		Utils.onEvent(btn, 'click tap', actionPicker);
	}
});

/*settings*/
//onchange event for checkboxes
var checkboxes = document.querySelectorAll('.screen input[type="checkbox"]');
checkboxes.forEach(function(check){
	//check.addEventListener('change', gameSettings_boxes);
	Utils.onEvent(check, 'change', gameSettings_boxes);
});
//onchange event for radio buttons
var radios = document.querySelectorAll('.screen input[type="radio"]');
radios.forEach(function(rad){
	//rad.addEventListener('change', gameSettings_radio);
	Utils.onEvent(rad, 'change', gameSettings_radio);
});
//swatches click events
document.querySelectorAll('.swatches').forEach(function(swatch) {
	//swatch.addEventListener('click', updateSwatches);
	Utils.onEvent(swatch, 'click touchend', updateSwatches);
});

//sounds
var sound = document.getElementById('sound'); //sound control button
sound.addEventListener('change', bg_sound_toggle);

var bg_sound = document.getElementById('background_sound'); //background melogy contol
bg_sound.volume = 0.2;

var btn_sound = document.getElementById('button_press'); //button click/tap melody control


/*game screen submenu*/
//open game settings to display swatches open
document.querySelectorAll('.menu_button').forEach(function(menu) {
	//menu.addEventListener('click', toggleSubmenu, false);
	Utils.onEvent(menu, 'click touchend', toggleSubmenu);
});

/*in-game events*/
//keypresses to move the snake
document.body.addEventListener('keydown', onKeyPressMove);

//click/touch of player buttons to move the snake
var playerGroups = document.querySelectorAll('.playerGroup-btn button');
playerGroups.forEach(function(btn){
	if (btn.classList.contains('menu_icon')) {
		//btn.addEventListener('click', displaySubmenu, true);
		Utils.onEvent(btn, 'click touchend', displaySubmenu);
	} else {
		//btn.addEventListener('click', onButtonMove, true);
		Utils.onEvent(btn, 'click touchstart', onButtonMove);
	}
});
/***********************************/




