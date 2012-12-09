/**
 * Spell Tower Solver
 * 2012
 * https://github.com/stringham/Spell-tower-solver
 * Copyright Ryan Stringham
 */

Board = function(width, height){
	this.columns = [];
	this.width = width;
	this.height = height;
	for(var i=0; i<width; i++){
		this.columns.push(new Column(height, i, this));
	}
	this.dom = $('<div class="board"></div>');
	for(var i=0; i<width; i++){
		this.dom.append(this.columns[i].dom);
	}

	this.visited = [];
	for(var i=0; i<this.width; i++){
		this.visited.push([]);
		for(var j=0; j<this.height; j++){
			this.visited[i].push(false);
		}
	}
	Solution.prototype.board = this;

	this.solutionInstructions = 'Double click a word to see the definition. To use the word on the board either click \'Use\' when the word is selected, or hold shift when double clicking that word.';
}

Board.prototype.getCell = function(column, row){
	return this.columns[column].cells[row];
}

Board.prototype.getCells = function(){
	this.cells = [];
	for(var i=0; i<this.width; i++){
		this.cells.push([]);
		for(var j=0; j<this.height; j++){
			if(this.columns[i].cells[j])
				this.cells[i].push(this.columns[i].cells[j].setLocation(i,j));
		}
	}
	return this.cells;
}
var numRemoved = 0;

Board.prototype.removeSelected = function(){
	numRemoved = 0;
	for(var i=0; i<this.columns.length; i++){
		this.columns[i].removeSelected();
	}
	this.clearSolutions();
	arrayMap(this.solutions, function(solution){
		if(solution.line)
			solution.line.clearLine();
	});
}

Board.prototype.clear = function(){
	for(var i = 0; i<this.columns.length; i++){
		for(var j=0; j< this.columns[i].cells.length; j++){
				this.columns[i].cells[j].clear();
		}
	}
	this.unHighlightAll();
	this.clearSolutions();
}

Board.prototype.clearSolutions = function(){
	solutionsDom = $('.solutions');
	solutionsDom.fadeOut('normal', function(){
		solutionsDom.children().remove();
		solutionsDom.show();
	});
}

Board.prototype.nonEmptyCells = function(){
	var ret = [];
	for(var i = 0; i<this.columns.length; i++){
		for(var j=0; j< this.columns[i].cells.length; j++){
			if(!this.columns[i].cells[j].dom.hasClass('empty'))
				ret.push(this.columns[i].cells[j]);
		}
	}
	return ret;
}

Board.prototype.createBoard = function(){
	this.letters = [];
	for(var i=0; i<this.width; i++){
		this.letters.push([]);
		for(var j=0; j<this.height; j++){
			this.letters[i].push(this.cells[i][j].getValue());
		}
	}
}

Board.prototype.solve = function(){
	this.getCells();
	$('.solutions').children().remove();
	this.createBoard();
	this.unHighlightAll();
	this.solutions = [];
	count = 0;
	this.oneAtATime(shuffle(this.nonEmptyCells()),0);
}

var shuffle = function(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

Board.prototype.oneAtATime = function(nonempty,i){
	if(nonempty.length == 0)
		return;
	var me = this;
	this.traverse(nonempty[i].x, nonempty[i].y,'',[]);
	i++;
	if(i == nonempty.length){
		this.solutions.sort(function(a,b){
			if(a.word.length > b.word.length)
				return -1;
			if(a.word.length < b.word.length)
				return 1;
			// if(a.score > b.score)
			// 	return -1;
			// if(a.score < b.score)
			// 	return 1;
			if(a.word < b.word)
				return -1;
			if(a.word > b.word)
				return 1;
			return 0;
		});
			
		me.showSolutions();
		setTimeout(function() {me.unHighlightAll();}, 100);
		return;
	}
	count++;
	$('.solutions').children().remove();
	console.log($('.solutions').height());
	$('.solutions').append('<span class="percent" >' + Math.ceil((100.*count)/(nonempty.length)) + '%</span>');
	// $('.percent').css('line-height', this.solutionHeight + 'px');
	setTimeout(function() {
		me.oneAtATime(nonempty,i);
		if(me.selectedWord)
			me.selectedWord.unHighlight();
		if(me.solutions.length > 0){
			me.selectedWord = me.solutions[me.solutions.length-1];
			me.selectedWord.highlight();
		}
	}, 1);
}

Board.prototype.traverse = function(x, y, value, path){
	if(x<0 || y < 0 || x >= this.width || y >= this.height)
		return;
	if(this.letters[x][y] == '')
		return;
	if(this.visited[x][y])
		return;
	if(!isValidPrefix(value))
		return;

	path.push(this.cells[x][y]);
	this.visited[x][y] = true;

	if((value+this.letters[x][y]).length >=3 && isWord(value + this.letters[x][y])){
		this.solutions.push(new Solution(value + this.letters[x][y], path.slice()));
	}

	for(var i=-1; i<2; i++){
		for(var j=-1; j<2; j++){
			this.traverse(x+i,y+j,value+this.letters[x][y], path);
		}
	}

	this.visited[x][y] = false;
	path.pop();
}


Board.prototype.getBonusCells = function(path){
	var me = this;
	var use = [];
	if(path.length > 4){
		arrayMap(path, function(cell){
			var x = cell.x,
			y = cell.y;
			if(x>0 && !arrayContains(use, me.cells[x-1][y]) && !arrayContains(path, me.cells[x-1][y]))
				use.push(me.cells[x-1][y]);
			if(x<me.width-1 && !arrayContains(use, me.cells[x+1][y]) && !arrayContains(path, me.cells[x+1][y]))
				use.push(me.cells[x+1][y]);
			if(y>0 && !arrayContains(use, me.cells[x][y-1]) && !arrayContains(path, me.cells[x][y-1]))
				use.push(me.cells[x][y-1]);
			if(y<me.height-1 && !arrayContains(use, me.cells[x][y+1]) && !arrayContains(path, me.cells[x][y+1]))
				use.push(me.cells[x][y+1]);
			if('QZJX'.indexOf(me.cells[x][y].getValue()) != -1){
				for(var i=0; i<me.width; i++){
					if(!arrayContains(use, me.cells[i][y]) && !arrayContains(path, me.cells[i][y]))
						use.push(me.cells[i][y]);
				}
			}
		});
	}
	else{
		arrayMap(path,function(cell){
			var x = cell.x,
			y = cell.y;
			if('QZJX'.indexOf(me.cells[x][y].getValue()) != -1){
				for(var i=0; i<me.width; i++){
					if(!arrayContains(use, me.cells[i][y]) && !arrayContains(path, me.cells[i][y]))
						use.push(me.cells[i][y]);
				}
			}
		})
	}
	return use;
}

Board.prototype.unHighlightAll = function(force){
	arrayMap(this.solutions, function(solution){
		solution.unHighlight();
		if(solution.dom && force)
			solution.dom.removeClass('hide selected starts');
	});
}

Board.prototype.showSolutions = function(){
	var me = this;
	var solutionDom = $('.solutions');
	solutionDom.children().remove();
	solutionDom.append($('<span class="title" >Solutions:</span><span class="instructions">'+this.solutionInstructions+'</span><br>'))
	arrayMap(this.solutions, function(solution){
		solution.dom = $('<div class="solution">' + solution.word + '</div>').click(function(e){
			e.stopPropagation();
			me.unHighlightAll();
			solution.highlight();
			$('.qtip').hide({effect:function(api){
				$(this).stop(0, 1).fadeOut(400);
			}});
		}).dblclick(function(e){
			e.stopPropagation();
			e.preventDefault();
			if(e.shiftKey)
				useWord(e.ctrlKey);
			else{
				if(definitions[solution.word])
					return;
				define(solution.word, function(){
					createTipsFor(solution);
				});
			}
		}).appendTo(solutionDom);
	});
}

Board.prototype.shiftUp = function(){
	numRemoved = 0;
	for(var i=0; i<this.columns.length; i++){
		this.columns[i].remove(0,true);
	}
	this.getCells();
}

Board.prototype.shiftDown = function(){
	numRemoved = 0;
	for(var i=0; i<this.columns.length; i++){
		this.columns[i].remove(this.columns[i].cells.length-1,false);
	}
	this.getCells();
}

Board.prototype.distribution = {'A': 9,
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

Board.prototype.randomChar = function(){
	var choice = Math.random()*100;
	for(letter in distribution){
		if(choice < distribution[letter])
			return letter;
	}
}

Board.prototype.addRow = function(){
	numRemoved = 0;
	for(var i=0; i<this.columns.length; i++){
		this.columns[i].remove(0,true, this.randomChar());
	}
}

Board.prototype.destroy = function(){
	this.dom.remove()
	this.columns = [];
	this.width = null;
	this.height = null;
}

Board.prototype.selectSolutions = function(x,y){
	var me=this;
	arrayMap(this.solutions, function(solution){
			if(arrayContains(solution.path, me.cells[x][y])){
				solution.dom.addClass('selected').removeClass('hide');
				if(solution.path[0] == me.cells[x][y]){
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

Board.prototype.fillRow = function(rowNum, value){
	var i;
	for(i = 0; i<this.width && i < value.length; i++){
		this.cells[i][rowNum].setValue(value[i]);
	}
	return value.substr(i);
}

Board.prototype.fillPrompt = function(x,y){
	var me = this;
	fillPrompt('Enter the characters you would<br>like to fill from this point:', function(value){
		if(!value || value.length == 0)
			return;
		var remainder = me.fillRow(y,Array(x+1).join(' ') + value);
		y++;
		while(remainder.length>0 && y < me.height)
			remainder = me.fillRow(y++, remainder);
	});
}