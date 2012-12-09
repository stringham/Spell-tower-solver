/**
 * Spell Tower Solver
 * 2012
 * https://github.com/stringham/Spell-tower-solver
 * Copyright Ryan Stringham
 */
 
Cell = function(x, y, column, board){
	this.dom = $('<div class="cell empty"></div>');
	this.x = x;
	this.y = y;
	this.board = board;
	this.column = column;
	this.createTextarea();
}

Cell.prototype.remove = function(addToBottom, character){
	var me = this;
	this.dom.delay(numRemoved*50).hide();
	me.dom.remove();
	me.column.addCell(addToBottom, character);
	numRemoved++;
}

Cell.prototype.clear = function(){
	this.setValue('');
}

Cell.prototype.setValue = function(value){
	var character = value[0] || '';
	var me=this;
	if(!(/[a-z]|[A-Z]/.test(character))){
		this.dom.animate({'backgroundColor':'#000000'},1000, function(){
			me.dom.addClass('empty');
			me.textarea.val('')
			me.dom.css({'backgroundColor':''});
		});
		this.textarea.animate({'backgroundColor':'#000000'},1000, function(){
			me.textarea.css({'backgroundColor':''});
		});
	}
	else{
		me.textarea.val(character.toUpperCase());
		this.dom.animate({'backgroundColor':'#EEE8AA'},300, function(){
			me.dom.removeClass('empty');
			me.dom.css({'backgroundColor':''});
		});
		this.textarea.animate({'backgroundColor':'#EEE8AA'},1000, function(){
			me.textarea.css({'backgroundColor':''});
		});
	}
}

Cell.prototype.getValue = function(){
	return this.textarea.val();
}

Cell.prototype.focus = function(){
	this.textarea.focus();
}

Cell.prototype.setLocation = function(x,y){
	if(!this.board)
		return;
	this.textarea.attr('tabindex',y*this.board.width + x + 1);
	this.x = x;
	this.y = y;
	return this;
}

Cell.prototype.createTextarea = function(){
	var me = this;
	this.textarea = $('<textarea></textarea>').keydown(function(e){
		//if(e.which >= 65 && e.which <= 90 || e.which == 32)
		if(e.which == 49){
			this.value='QU';
			me.dom.addClass('smaller');
			me.dom.removeClass('empty');
		} else{
			me.dom.removeClass('smaller');
		}
		keydown = true;
	}).keyup(function(e){
		if(!keydown)
			return;
		keydown = false;
		switch(e.which){
			case 37: //left
				if(me.x>0){
					me.board.cells[me.x-1][me.y].focus();
				}
				return;
				break;
			case 38: //up
				if(me.y>0){
					me.board.cells[me.x][me.y-1].focus();
				}
				return;
				break;
			case 39: //right
				if(me.x<me.board.width-1){
					me.board.cells[me.x+1][me.y].focus();
				}
				return;
				break;
			case 40: //down
				if(me.y<me.board.height-1){
					me.board.cells[me.x][me.y+1].focus();
				}
				return;
				break;
		}
		if(e.which == 13){
			me.textarea.blur();
			solve();
		}
		me.setValue(String.fromCharCode(e.which));
		if(e.which == 8){
			me.setValue('');
			if($('#fill-row').attr('checked')){
				if(me.x > 0){
					me.board.cells[me.x-1][me.y].focus();
				}
				else if(me.y> 0){
					me.board.cells[me.board.width-1][me.y-1].focus();
				}
				else{
					me.board.cells[me.board.width-1][me.board.height-1].focus();
				}
			} else if($('#fill-col').attr('checked')){
				if(me.y > 0){
					me.board.cells[me.x][me.y-1].focus();
				}
				else if(me.x > 0){
					me.board.cells[me.x-1][me.board.height-1].focus();
				}
				else{
					me.board.cells[me.board.width-1][me.board.height-1].focus();
				}
			}
		}
		else {//if(e.which >=65 && e.which <=90 || e.which == 32 || e.which == 49){
				if($('#fill-row').attr('checked')){
					if(me.x < me.board.width-1){
						me.board.cells[me.x+1][me.y].focus();
					}
					else if(me.y< me.board.height-1){
						me.board.cells[0][me.y+1].focus();
					}
					else{
						me.board.cells[0][0].focus();
					}
				} else if($('#fill-col').attr('checked')){
					if(me.y < me.board.height-1){
						me.board.cells[me.x][me.y+1].focus();
					}
					else if(x< me.board.width-1){
						me.board.cells[me.x+1][0].focus();
					}
					else{
						me.board.cells[0][0].focus();
					}
				}
		}
	}).click(function(e){
		me.board.unHighlightAll();
		board.selectSolutions(me.x, me.y);
	}).mouseup(function(){
		clearTimeout(me.pressTimer);
	}).mousedown(function(){
		if(iOS){
			me.textarea.blur();
			me.board.fillPrompt(me.x,me.y);
		}
		me.pressTimer = setTimeout(function(){
			me.textarea.blur();
			me.board.fillPrompt(me.x,me.y);
		}, 1000);
	}) .attr('maxlength','1').appendTo(this.dom);
}
