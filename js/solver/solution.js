/**
 * Spell Tower Solver
 * 2012
 * https://github.com/stringham/Spell-tower-solver
 * Copyright Ryan Stringham
 */
 Solution = function(word, path) {
	this.word = word;
	this.path = path;
	this.score = '';// score(path);
	this.isHighlighted = false;
}

Solution.prototype.highlight = function(){
	if(this.isHighlighted)
		return;
	for(var i=0; i<this.path.length; i++){
		this.path[i].dom.addClass('highlight');
	}
	var bonus = this.board.getBonusCells(this.path);
	for(var i=0; i<bonus.length; i++)
		bonus[i].dom.addClass('bonus');
	if(this.dom)
		this.dom.addClass('selected');
	this.line = new Line(this.path);
	this.selectedWord = this;
	this.isHighlighted = true;
}

Solution.prototype.unHighlight = function(){
	if(!this.isHighlighted)
		return;
	for(var i=0; i<this.path.length; i++){
		this.path[i].dom.removeClass('highlight');
	}
	var bonus = this.board.getBonusCells(this.path);
	for(var i=0; i<bonus.length; i++)
		bonus[i].dom.removeClass('bonus');
	if(this.dom){
		this.dom.removeClass('selected');
	}
	this.line.clearLine();
	delete this.line;
	this.isHighlighted = false;
}

