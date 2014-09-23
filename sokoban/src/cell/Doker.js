var sokoban = (function() {
    this.cell = (function() {
        
        var DOKER_CHAR = '*';
        
        this.Doker = function() {
            var prototype = new sokoban.util.Model(dokerModel, "img/doker.jpg");
            for (var property in prototype) this[property] = prototype[property];
            
            this.underCell = new sokoban.cell.Space();
            this.animation = new sokoban.util.Animation();
            
            this.char = DOKER_CHAR;
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

                this.animation.tx.start = startTx;
                this.animation.tx.current = startTx;
                this.animation.tx.end = 0.0;
                this.animation.tx.calculateTransform(moveSpeed);

                this.animation.tz.start = startTz;
                this.animation.tz.current = startTz;
                this.animation.tz.end = 0.0;
                this.animation.tz.calculateTransform(moveSpeed);
                
                var angle = dir[0] * -90;
                if (angle === 0 && dir[1] !== 0) {
                    angle = dir[1] * -90 + 90;
                } 
                this.animation.ry.start = angle;
                this.animation.ry.current = angle;
                this.animation.ry.end = angle;

                this.animation.beginAnimate = true;
                
                return {
                    fromRow: newRow - dir[0],
                    fromCol: newCol - dir[1],
                    toRow: newRow,
                    toCol: newCol
                };
            };
            
        };
        
        this.Doker.char = DOKER_CHAR;
    
        return this;
    }).call(this.cell || {});
    return this;
}).call(sokoban || {}); 
