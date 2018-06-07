
let timeElapsed;
	var timeDiff  =  {
	start:function (){
		d = new Date();
		time  = d.getTime();
		okudustimer();// Call after load.
	},
	end:function (){
		d = new Date();
		timeElapsed = d.getTime()- time;
		return timeElapsed;
	},
	showTimer: function(){
		console.log(timeElapsed);

	}
}

function Sudoku() {
	this.matrix = new Array(81);

	this.matrix.clear();

	this.level = 0;

	this.shuffle = function(matrix) { 
		
		for (var i = 0; i < 9; i++)
			for (var j = 0; j < 9; j++)
				matrix[i * 9 + j] = (i*3 + Math.floor(i/3) + j) % 9 + 1;

		// randomly shuffle the numbers in the matrix . 
		for(var i = 0; i < 42; i++) {
			var n1 = Math.ceil(Math.random() * 9);
			var n2;
			do {
				n2 = Math.ceil(Math.random() * 9);
			}
			while(n1 == n2);

			for(var row = 0; row < 9; row++) {
				for(var col = 0; col < col; col++) {
					if(matrix[row * 9 + col] == n1)
						matrix[row * 9 + col] = n2;
					else if(matrix[row * 9 + col] == n2)
						matrix[row * 9 + col] = n1;
				}
			}
		}

	
		for (var c = 0; c < 42; c++) { //42 because the answer to everything.
			var s1 = Math.floor(Math.random() * 3);
			var s2 = Math.floor(Math.random() * 3);

			for(var row = 0; row < 9; row++) {
				var tmp = this.matrix[row * 9 + (s1 * 3 + c % 3)];
				this.matrix[row * 9 + (s1 * 3 + c % 3)] = this.matrix[row * 9 + (s2 * 3 + c % 3)];
				this.matrix[row * 9 + (s2 * 3 + c % 3)] = tmp;
			}
		}

		for (var s = 0; s < 42; s++) {
			var c1 = Math.floor(Math.random() * 3);
			var c2 = Math.floor(Math.random() * 3);

			for(var row = 0; row < 9; row++) {
				var tmp = this.matrix[row * 9 + (s % 3 * 3 + c1)];
				this.matrix[row * 9 + (s % 3 * 3 + c1)] = this.matrix[row * 9 + (s % 3 * 3 + c2)];
				this.matrix[row * 9 + (s % 3 * 3 + c2)] = tmp;
			}
		}

		
		for (var s = 0; s < 42; s++) {
			var r1 = Math.floor(Math.random() * 3);
			var r2 = Math.floor(Math.random() * 3);

			for(var col = 0; col < 9; col++)
			{
				var tmp = this.matrix[(s % 3 * 3 + r1) * 9 + col];
				this.matrix[(s % 3 * 3 + r1) * 9 + col] = this.matrix[(s % 3 * 3 + r2) * 9 + col];
				this.matrix[(s % 3 * 3 + r2) * 9 + col] = tmp;
			}
		}

		
	}

	this.maskBoardEasy = function(matrix, mask) {
		var i, j, k;
		for(i = 0; i < 81; i++)
			mask[i] = matrix[i];

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				for (var k = 0; k < 5; k++) {
					var c;
					do {
						c = Math.floor(Math.random() * 9);
					}
					while(mask[(i * 3 + Math.floor(c / 3)) * 9 + j * 3 + c % 3] == 0);

					mask[(i * 3 + Math.floor(c / 3)) * 9 + j * 3 + c % 3] = 0;
				}
			}
		}
	}

	/* This method scans all three blocks that contains the specified cell
		The value if it exists in the matrix (The entire Board)
		the order of the array is then again randomized;

		It has 3 parameters
		matrix = The Current state of the puzzle in whole.
		cell = The cell that needs a value to be populated. 
		avail the array to recieve the available values. and if this is null
		it just counts the values and doesn't return them. 	
	*/

	this.getAvailable = function(matrix, cell, avail)
	{
		var i, j, row, col, r, c;
		var arr = new Array(9);
		arr.clear();

		row = Math.floor(cell / 9);
		col = cell % 9;

		// row
		for(i = 0; i < 9; i++)
		{
			j = row * 9 + i;
			if(matrix[j] > 0)
				arr[matrix[j] - 1] = 1;
		}

		// col
		for(i = 0; i < 9; i++)
		{
			j = i * 9 + col;
			if(matrix[j] > 0)
			{
				arr[matrix[j] - 1] = 1;
			}
		}

		// square m x n (Who knew Matrices in 10th class will be usefull like this?)
		r = row - row % 3;
		c = col - col % 3;
		for(i = r; i < r + 3; i++)
			for(j = c; j < c + 3; j++)
				if(matrix[i * 9 + j] > 0)
					arr[matrix[i * 9 + j] - 1] = 1;

		j = 0;
		if(avail != null)
		{
			for(i = 0; i < 9; i++)
				if(arr[i] == 0)
					avail[j++] = i + 1;
		}
		else
		{
			for(i = 0; i < 9; i++)
				if(arr[i] == 0)
					j++;
			return j;
		}

		if(j == 0)
			return 0;

		for(i = 0; i < 18; i++)
		{
			r = Math.floor(Math.random() * j);
			c = Math.floor(Math.random() * j);
			row = avail[r];
			avail[r] = avail[c];
			avail[c] = row;
		}

		return j;
	}
//Gets the specified cell in the gameboard. 
	this.getCell = function(matrix)
	{
		var cell = -1, n = 10, i, j;
		var avail = new Array(9);
		avail.clear();

		for(i = 0; i < 81; i++)
		{
			if(matrix[i] == 0)
			{
				j = this.getAvailable(matrix, i, null);

				if(j < n)
				{
					n = j;
					cell = i;
				}

				if (n == 1)
					break;
			}
		}

		return cell;
	}

	this.solve = function(matrix)
	{
		var i, j, ret = 0;
		var cell = this.getCell(matrix);

		if(cell == -1)
			return 1;

		var avail = new Array(9);
		avail.clear();

		j = this.getAvailable(matrix, cell, avail);
		for(i = 0; i < j; i++)
		{
			matrix[cell] = avail[i];

			if(this.solve(matrix) == 1)
				return 1;

			
		}

		matrix[cell] = 0;
		return 0;
	}

	this.enumSolutions = function(matrix)
	{
		var i, j, ret = 0;
		var cell = this.getCell(matrix);

		// if getCell returns -1 the board is completely filled which
		// means we found a solution. return 1 for this solution(1 is an alias).
		if(cell == -1)
			return 1;

		var avail = new Array(9);
		avail.clear();

		j = this.getAvailable(matrix, cell, avail);
		for(i = 0; i < j; i++)
		{
			//assing the found value to the matrix cell to solve the board.
			matrix[cell] = avail[i];
			//append the new value and return it.
			ret += this.enumSolutions(matrix);

			if(ret > 1)
				break;
		}

		matrix[cell] = 0;
		return ret;
	}

	this.maskBoard = function(matrix, mask)
	{
		var i, j, k, r, c, n = 0, a, hints = 0, cell, val;
		var avail = new Array(9);
		avail.clear();

		var tried = new Array(81);
		tried.clear();

		// start with a cleared out board
		mask.clear();

		do
		{
			// choose a cell at random.
			do
			{
				cell = Math.floor(Math.random() * 81);
			}
			while((mask[cell] != 0) || (tried[cell] != 0));
			val = matrix[cell];

			// see how many values can go in the cell. 
			//getAvailable method 
			i = this.getAvailable(mask, cell, null);

			if(i > 1)
			{
				
				var cnt, row = Math.floor(cell / 9), col = cell % 9;

				cnt = 0; 
				for(i = 0; i < 9; i++)
				{	
					
					if(i == col)
						continue;

					j = row * 9 + i; 
					if(mask[j] > 0)
						continue;

					a = this.getAvailable(mask, j, avail);
					for(j = 0; j < a; j++)
					{
						if(avail[j] == val)
						{
							cnt++;
							break;
						}
						avail[j] = 0;
					}
				}

		
				if(cnt > 0)
				{
					// col
					cnt = 0;
					for(i = 0; i < 9; i++)
					{
						if(i == row)
							continue;

						j = i * 9 + col;
						if(mask[j] > 0)
							continue;
						a = this.getAvailable(mask, j, avail);
						for(j = 0; j < a; j++)
						{
							if(avail[j] == val)
							{
								cnt++;
								break;
							}
							avail[j] = 0;
						}
					}

					if(cnt > 0)
					{
						// square
						cnt = 0;
						r = row - row % 3;
						c = col - col % 3;
						for(i = r; i < r + 3; i++)
						{
							for(j = c; j < c + 3; j++)
							{
								if((i == row) && (j == col))
									continue;
	
								k = i * 9 + j;
								if(mask[k] > 0)
									continue;
								a = this.getAvailable(mask, k, avail);
								for(k = 0; k < a; k++)
								{
									if(avail[k] == val)
									{
										cnt++;
										break;
									}
									avail[k] = 0;
								}
							}
						}

						if(cnt > 0)
						{
							mask[cell] = val;
							hints++;
						}
					}
				}
			}

			tried[cell] = 1;
			n++;
		}
		while(n < 81);

		
		do
		{
			do
			{
				cell = Math.floor(Math.random() * 81);
			}
			while((mask[cell] == 0) || (tried[cell] == 0));

			val = mask[cell];

			var t = this;
			var solutions = 0;

			mask[cell] = 0;
			solutions = this.enumSolutions(mask);

			if(solutions > 1)
				mask[cell] = val;

			tried[cell] = 0;
			hints--;
		}
		while(hints > 0);

		}

	this._checkVal = function(matrix, row, col, val) {
		var i, j, r, c;
	
		for(i = 0; i < 9; i++)
		{
			if((i != col) && (matrix[row * 9 + i] == val))
				return false;
		}

		// check col
		for(i = 0; i < 9; i++)
		{
			if((i != row) && (matrix[i * 9 + col] == val))
				return false;
		}

		// check square
		r = row - row % 3;
		c = col - col % 3;
		for(i = r; i < r + 3; i++)
			for(j = c; j < c + 3; j++)
				if(((i != row) || (j != col)) && (matrix[i * 9 + j] == val))
					return false;

		return true;
	}
	this.checkVal = function(row, col, val)
	{
		return this._checkVal(this.matrix, row, col, val);
	}


	this.setVal = function(row, col, val)
	{
		this.matrix[row * 9 + col] = val;
	}


	this.getVal = function(row, col)
	{
		return this.matrix[row * 9 + col];
	}

	this._newGame = function() {
		var i, hints = 0;
		var mask = new Array(81);


		this.matrix.clear();

		
		this.solve(this.matrix);

		this.maskBoard(this.matrix, mask);

		if(this.level == 0)
			hints = 12;
		else if(this.level == 1)
			hints = 8;

		for(i = 0; i < hints; i++)
		{
			do
			{
				var cell = Math.floor(Math.random() * 81);
			}
			while(mask[cell] != 0);

			mask[cell] = this.matrix[cell];
		}

		
		this.save = this.matrix;

		
		this.matrix = mask;

		timeDiff.start();
		okudostimer();
	}

	this.done;

	this._doHints = function(matrix, mask, tried, hints)
	{
		
		if(hints > 0)
		{
			do
			{
				cell = Math.floor(Math.random() * 81);
			}
			while((mask[cell] == 0) || (tried[cell] == 0));

			val = mask[cell];

			var t = this;
			var solutions = 0;

			mask[cell] = 0;
			solutions = this.enumSolutions(mask);
			//console.log("timeout");

			if(solutions > 1)
				mask[cell] = val;

			tried[cell] = 0;
			hints--;
			var t = this;
			setTimeout(function(){t._doHints(matrix, mask, tried, hints);}, 50);
		}
		else
		{
			this._doStart(mask);
			this.done();
		}

	
	}

	this._doMask = function(matrix, mask)
	{
		var i, j, k, r, c, n = 0, a, hints = 0, cell, val;
		var avail = new Array(9);
		avail.clear();

		var tried = new Array(81);
		tried.clear();

		
		mask.clear();

	
		do
		{
			
			do
			{
				cell = Math.floor(Math.random() * 81);
			}
			while((mask[cell] != 0) || (tried[cell] != 0));
			val = matrix[cell];

			
			i = this.getAvailable(mask, cell, null);

			if(i > 1)
			{
				
				var cnt, row = Math.floor(cell / 9), col = cell % 9;

				cnt = 0; 
				for(i = 0; i < 9; i++)
				{	
					
					if(i == col)
						continue;

					j = row * 9 + i; 

					
					if(mask[j] > 0)
						continue;

				
					a = this.getAvailable(mask, j, avail);

					
					for(j = 0; j < a; j++)
					{
						if(avail[j] == val)
						{
							cnt++;
							break;
						}
						avail[j] = 0;
					}
				}

				
				if(cnt > 0)
				{
					// col
					cnt = 0;
					for(i = 0; i < 9; i++)
					{
						if(i == row)
							continue;

						j = i * 9 + col;
						if(mask[j] > 0)
							continue;
						a = this.getAvailable(mask, j, avail);
						for(j = 0; j < a; j++)
						{
							if(avail[j] == val)
							{
								cnt++;
								break;
							}
							avail[j] = 0;
						}
					}

					if(cnt > 0)
					{
						// square
						cnt = 0;
						r = row - row % 3;
						c = col - col % 3;
						for(i = r; i < r + 3; i++)
						{
							for(j = c; j < c + 3; j++)
							{
								if((i == row) && (j == col))
									continue;
	
								k = i * 9 + j;
								if(mask[k] > 0)
									continue;
								a = this.getAvailable(mask, k, avail);
								for(k = 0; k < a; k++)
								{
									if(avail[k] == val)
									{
										cnt++;
										break;
									}
									avail[k] = 0;
								}
							}
						}

						if(cnt > 0)
						{
							mask[cell] = val;
							hints++;
						}
					}
				}
			}

			tried[cell] = 1;
			n++;
		}
		while(n < 81);

		var t = this;
		setTimeout(function(){t._doHints(matrix, mask, tried, hints);}, 50);
	}

	this._doStart = function(mask) {
		var i, hints = 0;
		
		if(this.level == 0)
			hints = 12;
		else if(this.level == 1)
			hints = 8;

		for(i = 0; i < hints; i++)
		{
			do
			{
				var cell = Math.floor(Math.random() * 81);
			}
			while(mask[cell] != 0);

			mask[cell] = this.matrix[cell];
		}

		
		this.save = this.matrix;

		this.matrix = mask;

		timeDiff.start();
	}

	this.newGame = function() {
		var mask = new Array(81);

		this.matrix.clear();

		this.solve(this.matrix);

		this._doMask(this.matrix, mask);
	}

	this.solveGame = function() {
		this.matrix = this.save;
		timeDiff.showTimer();

	}

	this.gameFinished = function()
	{
		for(var i = 0; i < 9; i++)
		{
			for(var j = 0; j < 9; j++)
			{
				var val = this.matrix[i * 9 + j];
				if((val == 0) || (this._checkVal(this.matrix, i, j, val) == false))
					return 0;
			}
		}

		return timeDiff.end();
	}

	this.getBoardString = function()
	{
		var str = "";
       		for(var i = 0; i < 81; i++)
        	{
			str += this.matrix[i];
	        }

		str = str = str.replace(/0/g, '.');
        	return str;
	}
}

Array.prototype.clear = function() {
	var i = this.length;
	while (i--) {
		this[i] = 0;
	}
}

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}


