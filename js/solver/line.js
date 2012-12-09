Line = function(path){
	var board = $('.board');
	this.segments = [];
	for(var i=0; i<path.length-1; i++){
		var from = path[i];
		var to = path[i+1];
		var fx = from.x,
		fy = from.y,
		tx = to.x,
		ty = to.y;
		this.segments.push(this.getSegment(fx,fy,tx,ty, to.dom, from.dom).appendTo(board));
	}
}

Line.prototype.clearLine = function(){
	arrayMap(this.segments, function(segment){
		segment.remove();
	});
	this.segments = [];
}

Line.prototype.getSegment = function(fx, fy, tx, ty, to, from){
	var x = tx-fx;
	var y = ty-fy;
	var ftop = from.offset().top + from.height()/2 - cellSize/8.,
	fleft = from.offset().left + from.width()/2 - cellSize/8.,
	ttop = to.offset().top + to.height()/2 - cellSize/8.,
	tleft = to.offset().left + to.width()/2 - cellSize/8.
	if(x == 1 && y == 0){
		return $('<div class="line"></div>').css({
			top:ftop + 'px',
			left:fleft + 'px',
			width:cellSize*5./4 + 'px',
			height:cellSize/4. + 'px',
			'-webkit-border-radius': cellSize/8. + 'px'
		});
	}
	if(x == -1 && y == 0){
		return $('<div class="line"></div>').css({
			top:ttop + 'px',
			left:tleft + 'px',
			width:cellSize*5./4 + 'px',
			height:cellSize/4. + 'px',
			'-webkit-border-radius': cellSize/8. + 'px'
		});
	}
	if(x == 0 && y == 1){
		return $('<div class="line vertical"></div>').css({
			top:ftop - cellSize/4. + 'px',
			left:fleft + 'px',
			width:cellSize*5./4 + 'px',
			height:cellSize/4. + 'px',
			'-webkit-border-radius': cellSize/8. + 'px'
		});
	}
	if(x == 0 && y == -1){
		return $('<div class="line vertical"></div>').css({
			top:ttop - cellSize/4. + 'px',
			left:tleft + 'px',
			width:cellSize*5./4 + 'px',
			height:cellSize/4. + 'px',
			'-webkit-border-radius': cellSize/8. + 'px'
		});
	}
	if(x==1 && y==1){
		return $('<div class="line drdiagonal"></div>').css({
			top:ftop + 'px',
			left:fleft + 'px',
			width:cellSize*Math.sqrt(2) +cellSize/4.+ 'px',
			height:cellSize/4. + 'px',
			'-webkit-border-radius': cellSize/8. + 'px',
		    '-moz-transform-origin': cellSize/8.+'px' + ' center',
		    '-webkit-transform-origin': cellSize/8.+'px' + ' center',
		    '-o-transform-origin':  cellSize/8.+'px' + ' center'

		});
	}
	if(x==-1 && y==-1){
		return $('<div class="line drdiagonal"></div>').css({
			top:ttop + 'px',
			left:tleft + 'px',
			width:cellSize*Math.sqrt(2) +cellSize/4.+ 'px',
			height:cellSize/4. + 'px',
			'-webkit-border-radius': cellSize/8. + 'px',
		    '-moz-transform-origin': cellSize/8.+'px' + ' center',
		    '-webkit-transform-origin': cellSize/8.+'px' + ' center',
		    '-o-transform-origin':  cellSize/8.+'px' + ' center'
		});
	}
	if(x==-1 && y==1){
		return $('<div class="line dldiagonal"></div>').css({
			top:ttop + 'px',
			left:tleft + 'px',
			width:cellSize*Math.sqrt(2) +cellSize/4.+ 'px',
			height:cellSize/4. + 'px',
			'-webkit-border-radius': cellSize/8. + 'px',
		    '-moz-transform-origin': cellSize/8.+'px' + ' center',
		    '-webkit-transform-origin': cellSize/8.+'px' + ' center',
		    '-o-transform-origin':  cellSize/8.+'px' + ' center'
		});
	}
	if(x==1 && y==-1){
		return $('<div class="line dldiagonal"></div>').css({
			top:ftop + 'px',
			left:fleft + 'px',
			width:cellSize*Math.sqrt(2) +cellSize/4.+ 'px',
			height:cellSize/4. + 'px',
			'-webkit-border-radius': cellSize/8. + 'px',
		    '-moz-transform-origin': cellSize/8.+'px' + ' center',
		    '-webkit-transform-origin': cellSize/8.+'px' + ' center',
		    '-o-transform-origin':  cellSize/8.+'px' + ' center'
		});
	}
}