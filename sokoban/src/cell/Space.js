var sokoban = (function() {
    this.cell = (function() {
        
        var SPACE_CHAR = '-';
        
        this.Space = function() {
            this.char = SPACE_CHAR;
            this.underCell = this;
            
            this.init = function(graph) {
                // Free space
            };
            
            this.draw = function(graph) {
                // Free space
            };
        };
        
        this.Space.char = SPACE_CHAR;
    
        return this;
    }).call(this.cell || {});
    return this;
}).call(sokoban || {}); 
