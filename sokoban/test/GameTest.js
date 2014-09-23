var sokoban = (function() {
    this.test = (function() {
        
        this.GameTest = function() {
            
            var level = {
                number: 0,
                startText: "Level 0",
                endText: "Level 0 completed",
                plan: ["OOOOO",
                        "O--*O",
                        "O-#+O",
                        "OOOOO"]
            };

            var config = {
                levels: [level]
            };
            
            this.game = new sokoban.Game(config);

            this.testLoadLevel = function() {
                var level = this.game.levels[0];
                var cells = level.field.cells;
                var str = "";
                cells.forEach(function (line) {
                    line.forEach(function (cell) {
                        str += cell;
                    });
                    str += "\n";
                });
                alert(str);
            };
            
            this.testLoadShader = function() {
                alert(fragmentSh.program);
            }
            
            this.run = function() {
                this.testLoadLevel();
            };
        };
        
        return this;
    }).call(this.test || {});
    return this;
}).call(sokoban || {}); 
