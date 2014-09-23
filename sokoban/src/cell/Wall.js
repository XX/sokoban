var sokoban = (function() {
    this.cell = (function() {
        
        var WALL_CHAR = 'O';
        
        this.Wall = function () {
            var prototype = new sokoban.cell.Cube("img/cwall.jpg", null);
            for (var property in prototype) this[property] = prototype[property];
            
            this.char = WALL_CHAR;
        };
        
        this.Wall.char = WALL_CHAR;
        
    
        return this;
    }).call(this.cell || {});
    return this;
}).call(sokoban || {}); 
