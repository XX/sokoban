var sokoban = (function() {
    this.cell = (function() {
        
        var BOX_CHAR = '#';
        
        this.Box = function () {
            var prototype = new sokoban.cell.Cube("img/crate.gif", null);
            for (var property in prototype) this[property] = prototype[property];
            
            this.char = BOX_CHAR;
            this.onPlace = false;
            this.posRow = 0;
            this.posCol = 0;
            
            var moveSpeed = 0.01;
            
            this.move = function (field, dir) {
                var newRow = this.posRow + dir[0];
                var newCol = this.posCol + dir[1];
                var startTx = -dir[1];
                var startTz = -dir[0];
                
                var tempCell = field.cells[newRow][newCol];

                field.cells[newRow][newCol] = this;
                field.cells[this.posRow][this.posCol] = this.underCell;
                this.posRow = newRow;
                this.posCol = newCol;
                this.underCell = tempCell;
                
                if (field.cells[this.posRow][this.posCol].char !== sokoban.cell.Place.char
                        && field.cells[newRow][newCol].underCell.char === sokoban.cell.Place.char) {
                    this.onPlace = true;
                } else if (field.cells[this.posRow][this.posCol].char === sokoban.cell.Place.char
                        && field.cells[newRow][newCol].underCell.char !== sokoban.cell.Place.char) {
                    this.onPlace = false;
                }

                this.animation.tx.start = startTx;
                this.animation.tx.current = startTx;
                this.animation.tx.end = 0.0;
                this.animation.tx.calculateTransform(moveSpeed);

                this.animation.tz.start = startTz;
                this.animation.tz.current = startTz;
                this.animation.tz.end = 0.0;
                this.animation.tz.calculateTransform(moveSpeed);

                this.animation.beginAnimate = true;
                
                return {
                    fromRow: newRow - dir[0],
                    fromCol: newCol - dir[1],
                    toRow: newRow,
                    toCol: newCol
                };
            };
            
        };
        
        this.Box.char = BOX_CHAR;
    
        return this;
    }).call(this.cell || {});
    return this;
}).call(sokoban || {}); 
