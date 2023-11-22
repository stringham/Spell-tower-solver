/**
 * Spell Tower Solver
 * 2012
 * https://github.com/stringham/Spell-tower-solver
 * Copyright Ryan Stringham
 */
var cellSize = 40,
	dictionaryLength,
	board,
	count;

var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );

var arrayMap = function(a, f) {
	if(!a)
		return;
	
	var aLen = a.length;
	for(var i = 0; i < aLen; i++) {
		if(f(a[i], i) == false)
			break;
	}
}

var arrayContains = function(a, val) {
	for(var i = 0; i < a.length; i++) {
		if(a[i] == val)
			return true;
	}
	return false;
}

var createTipsFor = function(clickedSolution){
	arrayMap(board.solutions, function(solution){
		if(solution.word == clickedSolution.word){
			var definition = formatDefinition(solution.word);
			solution.dom.qtip({
				content: {
					text: definition, 
					title: {
						text: '<span class ="definition-title">' + solution.word.capitalize() + '</span>',
						button: true
					}
				},
				position: {
					my: 'top right', // Use the corner...
					at: 'bottom center' // ...and opposite corner
				},
				show: {
					event: 'click', // Don't specify a show event...
					ready: solution == clickedSolution // ... but show the tooltip when ready
				},
				hide: {
					event: false,
					//inactive: 1500,
					// Don't hide it on a regular event
					effect: function(api) {
						// Do a regular fadeOut, but add some spice!
						$(this).stop(0, 1).fadeOut(400);
					}
				},
				style: {
					classes: 'ui-tooltip-shadow ui-tooltip-' + 'blue'
				}
			});
			first = false;
		}
	});
}

var selectSolutions = function(cell){
	arrayMap(solutions, function(solution){
		if(arrayContains(solution.path, cell)){
			solution.dom.addClass('selected').removeClass('hide');
			if(solution.path[0] == cell){
				solution.dom.addClass('starts');
			}
			else
				solution.dom.removeClass('starts');
		}
		else{
			solution.dom.removeClass('selected').removeClass('starts');
			if($('#filter').attr('checked')){
				solution.dom.addClass('hide').qtip('hide');
			}
			else
				solution.dom.removeClass('hide');
		}
	});
	$('.qtip').qtip('reposition');
}


function dialogue(content, title) {
	$('<div />').qtip(
	{
		content: {
			text: content,
			title: title
		},
		position: {
			my: 'center', at: 'center', // Center it...
			target: $(window) // ... in the window
		},
		show: {
			ready: true, // Show it straight away
			modal: {
				on: true, // Make it modal (darken the rest of the page)...
				blur: false // ... but don't close the tooltip when clicked
			}
		},
		hide: false, // We'll hide it maunally so disable hide events
		style: 'ui-tooltip-light ui-tooltip-rounded ui-tooltip-dialogue', // Add a few styles
		events: {
			// Hide the tooltip when any buttons in the dialogue are clicked
			render: function(event, api) {
				$('button', api.elements.content).click(api.hide);
				$('input', api.elements.content).keyup(function(e){
					if(e.which == 13)
						api.hide();
				});
			},
			// Destroy the tooltip once it's hidden as we no longer need it!
			hide: function(event, api) { api.destroy(); }
		}
	});
}

function resizePrompt(callback)
{
	// Content will consist of a question elem and input, with ok/cancel buttons
	var newwidth = $('<input />', { val: '', maxlength: '2', width: '55'}).css('float','left').keyup(function(e){
			if(e.which == 13)
				callback( newwidth.val(), newheight.val() );
		}),
		newheight = $('<input />', { val: '', maxlength: '2', width: '55'}).css({'float':'left','margin-left':'5px'}).keyup(function(e){
			if(e.which == 13)
				callback( newwidth.val(), newheight.val() );
		}),
		ok = $('<button />', { 
			text: 'Resize',
			click: function() { callback( newwidth.val(), newheight.val() ); }
		}).css({'clear': 'both', 'float':'left'}),
		cancel = $('<button />', {
			text: 'Cancel',
			click: function() { callback(null); }
		}).css('float','right');

	newwidth.attr('placeholder','Wide: ' + board.width);
	newheight.attr('placeholder','High: ' + board.height);

	dialogue(newwidth.add(newheight).add(ok).add(cancel), 'Resize' );
}

function fillPrompt(question, callback)
{
	// Content will consist of a question elem and input, with ok/cancel buttons
	var message = $('<p />', { html: question }),
		value = $('<input />', { val: ''}).keyup(function(e){
			if(e.which == 13)
				callback(value.val());
		}),
		ok = $('<button />', { 
			text: 'Fill',
			click: function() { callback(value.val());}
		}).css('float','left'),
		cancel = $('<button />', {
			text: 'Cancel',
			click: function() { callback(null); }
		}).css('float','left');

	value.attr('placeholder','Fill');

	dialogue( message.add(value).add(ok).add(cancel), 'Auto Fill' );
}

$('document').ready(function(){
	// board = new Board(8,16);
	board = new Board(9,13);
	cells = board.getCells();
	$('.boardandoptions').prepend(board.dom);
	init();

	var callResize = function(){
		board = new Board(parseInt($('#widthBox').val()),parseInt($('#heightBox').val()));
		$('.boardandoptions').prepend(board.dom);
		setSize();
	};


	$('.resize').click(function(){
		resizePrompt(function(width, height){
			if(width && height){
				board.destroy();
				board = new Board(width,height);
				$('.boardandoptions').prepend(board.dom);
				setSize();
			}
			else if(width){
				var height = board.height;
				board.destroy();
				board = new Board(width,height);
				$('.boardandoptions').prepend(board.dom);
				setSize();
			}
			else if(height){
				var width = board.width;
				board.destroy();
				board = new Board(width,height);
				$('.boardandoptions').prepend(board.dom);
				setSize();
			}

		});
	});

	var saved = window.location.hash;
	if(saved.length > 1){
		saved = saved.substr(1);
		try{
			var decoded = JSON.parse(decodeURIComponent(saved));
			if(decoded['w'] && decoded['h'] && decoded['t']){
				board.destroy();
				board = new Board(decoded['w'], decoded['h']);
				cells = board.getCells();
				$('.boardandoptions').prepend(board.dom);
				setSize();
				board.fillBoard(0,0,decoded['t']);
				setTimeout(function() {board.solve();}, 1500);
			}
		} catch(e){}
	}
	
});

var init = function(){
	loadDictionary();

	if(typeof String.prototype.startsWith != 'function'){
		String.prototype.startsWith = function(str){
			return this.indexOf(str) == 0;
		};
	}
	
	if(typeof String.prototype.capitalize != 'function'){
		String.prototype.capitalize = function() {
			return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
		}
	}

	setSize();
	// setTimeout(setSize, 2000); 

}

// $(window).resize(function(){
// 	setSize();
// });

var setSize = function(){
	if(!board)
		return;
	var wheight = window.innerHeight;
	var wwidth = window.innerWidth;
	var boardHeight = wheight - $('.options').height()-5;
	var boardWidth = $('.options').width()+15;
	cellSize = Math.max(Math.min(boardHeight/board.height,boardWidth/board.width)-3,25);

	$('.solutions').css({'left':(board.width*(cellSize+2) + 15) + 'px', 'height':(board.height*(cellSize+2))}).click(function(){board.unHighlightAll(true)});
	$('.cell').css({'width':cellSize + 'px', 'height':cellSize + 'px'}).children().css({'width':cellSize + 'px', 'height':cellSize + 'px'});
	$('.cell textarea').css({'font-size':cellSize*.9, '-webkit-border-radius': Math.max(cellSize*.15,6) + 'px', 'border-radius': cellSize*.15 + 'px','width':cellSize + 'px', 'height':cellSize + 'px'});
	//$('.resize').css({'left':$('.board').width(), 'top':$('.board').height()+$('.board').offset().top});
	$('.boardandoptions').css({width: $('.options').width()});
//	console.log(board.cells[board.width-1][0].dom.offset().left);
	$('.board').attr('height',board.height).attr('width',board.width).css({'width':Math.max(board.columns[0].dom.width()*board.width+2,$('.options').width()) + 'px', 'height': board.height*(cellSize + 2) + 'px'});
	board.solutionHeight = board.height*(cellSize+2);
}

var loadDictionary = function(){
	dictionaryLength = dictionary.length;
}

var clearBoard = function(){
	board.clear();
}

var solve = function(){
	board.solve();
	var serialized = {w:board.width, h:board.height, t:board.getText()};
	window.location.hash = encodeURIComponent(JSON.stringify(serialized));
}



var isValidPrefix = function(pre){
	var begin = 0,
	end = dictionaryLength -1,
	mid;
	while(begin < end){
		mid = Math.floor((begin+end)/2);
		if(pre < dictionary[mid])
			end = mid;
		else if(pre > dictionary[mid])
			begin = mid+1;
		if(dictionary[mid].startsWith(pre))
			return true;
	}
	return false;
}

var isWord = function(word){
	var begin = 0,
	end = dictionaryLength -1,
	mid;
	while(begin < end){
		mid = Math.floor((begin+end)/2);
		if(word < dictionary[mid])
			end = mid;
		else if(word > dictionary[mid])
			begin = mid+1;
		if(dictionary[mid] == word)
			return true;
	}
	return false;
}

var shiftUp = function(){
	board.shiftUp();
}

var shiftDown = function(){
	board.shiftDown();
}

var result;
var definitions = {};

var define = function(word, callback){
	if(!definitions[word]){
		$.ajax({
			url:'http://api.wordnik.com//v4/word.json/' + word.toLowerCase() + '/definitions?includeRelated=false&includeTags=false&useCanonical=true&api_key=65b0129099adcdb690710ae9eea1c505093d5319ee79bef06',
			dataType: 'json',
			type: 'GET',
			success: function(data){
				definitions[word] = data;
				callback();
			}
		});
	}
	else
		callback();
}

var formatDefinition = function(word){
	var result = '';
	arrayMap(definitions[word], function(def, i){
		result += '<div class="definition"> <span class="number">' + (i+1) + '. </span><span class="definition-text">' + def.text + '</span><br><span class="partOfSpeech">(' + def.partOfSpeech + ')</span>' + '</div>';
	});
	if(result == '')
		return 'Unable to find definition.';
	return result;
}

var useWord = function(thenSolve){
	if(!board.selectedWord)
		return;
	board.removeSelected();
	if(thenSolve)
		solve();
}

points = {'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2, 'h': 4, 'i': 1, 'j': 8, 'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1, 's': 1, 't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10};

var score = function(path){
	var total = 0;

	if(typeof(path) == 'string'){
		for(i = 0; i<path.length; i++){
			total += points[path[i].toLowerCase()] || 0;
		}
		return total;	
	}

	var bonus = getBonusCells(path);
	for(i = 0; i<path.length; i++){
		total += points[path[i].val().toLowerCase()] || 0;
	}
	for(i = 0; i<bonus.length; i++){
		total += points[bonus[i].val().toLowerCase()] || 0;
	}
	return total*path.length;
}

distribution = {'A': 9,
'B': 11,
'C': 13,
'D': 17,
'E': 29,
'F': 31,
'G': 34,
'H': 36,
'I': 45,
'J': 46,
'K': 47,
'L': 51,
'M': 53,
'N': 59,
'O': 67,
'P': 69,
'Q': 70,
'R': 76,
'S': 80,
'T': 86,
'U': 90,
'V': 92,
'W': 94,
'X': 95,
'Y': 97,
'Z': 98,
 '': 100
}

var randomChar = function(){
	var choice = Math.random()*100;
	for(letter in distribution){
		if(choice < distribution[letter])
			return letter;
	}
}

var addRow = function(){
	board.addRow();
}