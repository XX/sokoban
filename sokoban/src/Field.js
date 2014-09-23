var sokoban = (function() {
    
    this.Field = function(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        
        this.cells = new Array(rows);
        for (var i = 0; i < rows; ++i) {
            this.cells[i] = new Array(cols);
        }
    };
    
    return this;
}).call(sokoban || {}); 
