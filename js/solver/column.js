/**
 * Spell Tower Solver
 * 2012
 * https://github.com/stringham/Spell-tower-solver
 * Copyright Ryan Stringham
 */
 Column = function(size, column, board){
	this.x = column;
	this.cells = [];
	this.board = board;
	for(var i=0; i<size; i++){
		this.cells.push(new Cell(column, i, this, board));
	}
	this.dom = $('<div class="column"></div>');
	for(var i=0; i<this.cells.length; i++){
		this.dom.append(this.cells[i].dom);
	}
}

Column.prototype.removeSelected = function(){
	for(var i=0; i<this.cells.length; i++){
		if(this.cells[i].dom.hasClass('highlight') || this.cells[i].dom.hasClass('bonus')){
			this.cells[i].remove();
			this.cells.splice(i+1,1);
		}
	}
}

Column.prototype.remove = function(i,addToBottom, character){
	this.cells[i].remove(addToBottom, character);
	if(addToBottom)
		this.cells.splice(i,1);
	else
		this.cells.splice(i+1,1);
}

Column.prototype.addCell = function(addToBottom, character){
	var cell = new Cell(0,0,this,this.board);
	if(addToBottom){
		this.cells.push(cell);
		this.dom.append(cell.dom);//.hide().fadeIn('normal'));
	}
	else{
		this.cells.unshift(cell);
		this.dom.prepend(cell.dom);//.hide().fadeIn('normal'));
	}
	setSize();
	if(character)
		cell.setValue(character);
	this.board.getCells();
}
