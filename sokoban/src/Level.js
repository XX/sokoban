var sokoban = (function() {
    
    var SCALE = 0.2;
    
    this.Level = function(rows, cols) {
        this.number = null;
        this.startText = null;
        this.endText = null;
        this.field = new sokoban.Field(rows, cols);
                
        var isWin = false;
        var doker = null;
        
        var movement = [];
        var moves = 0;
        var pushes = 0;
        
        this.getMoves = function () {
            return moves;
        };
        
        this.isLevelComplete = function () {
            return isWin;
        };
        
        this.initObjects = function (graph) {
            var cells = this.field.cells;
            for (var i = 0; i < cells.length; ++i) {
                for (var j = 0; j < cells[i].length; ++j) {
                    cells[i][j].init(graph);
                }
            }
        };
        
        this.draw = function (graph) {
            var gl = graph.gl;
            var rows = this.field.rows;
            var cols = this.field.cols;
            var cells = this.field.cells;
            
            var shiftX = -cols * SCALE * 0.5;
            var shiftZ = -rows * SCALE * 0.5;

            isWin = true;
            for (var i = 0; i < rows; ++i) {
                for (var j = 0; j < cols; ++j) {
                    if (cells[i][j].char === sokoban.cell.Doker.char) {
                        doker = cells[i][j];
                        doker.posRow = i;
                        doker.posCol = j;
                        if (cells[i][j].underCell.char === sokoban.cell.Place.char) {
                            isWin = false;
                        }
                    } else if (cells[i][j].char === sokoban.cell.Box.char) {
                        cells[i][j].posRow = i;
                        cells[i][j].posCol = j;
                    } else if (isWin && cells[i][j].char === sokoban.cell.Place.char) {
                        isWin = false;
                    }
                    
                    graph.pushMvMatrix();
                    
                    graph.translate(j * SCALE + shiftX, 0.0, i * SCALE + shiftZ);
                    graph.scale(SCALE, SCALE, SCALE);
                    
                    cells[i][j].draw(graph);
                    
                    graph.popMvMatrix();
                }
            }
        };
    
        this.move = function(dir) {
            var cells = this.field.cells;

            if (!doker.animation.isPlayback()) {
                if (cells[doker.posRow + dir[0]][doker.posCol + dir[1]].char === sokoban.cell.Space.char
                        || cells[doker.posRow + dir[0]][doker.posCol + dir[1]].char === sokoban.cell.Place.char) {
                    
                    movement.push(
                            doker.move(this.field, dir));
                    
                    moves++;
                } else if (cells[doker.posRow + dir[0]][doker.posCol + dir[1]].char === sokoban.cell.Box.char
                        && (cells[doker.posRow + dir[0] * 2][doker.posCol + dir[1] * 2].char === sokoban.cell.Place.char
                        || cells[doker.posRow + dir[0] * 2][doker.posCol + dir[1] * 2].char === sokoban.cell.Space.char)) {
                    
                    var box = cells[doker.posRow + dir[0]][doker.posCol + dir[1]];
                    var oldState = box.onPlace;
                    
                    movement.push(
                            box.move(this.field, dir));
                    
                    if (oldState !== box.onPlace) {
                        box.onPlace ? pushes++ : pushes--;
                    }
                    
                    movement.push(
                            doker.move(this.field, dir));
                    
                    moves++;
                }
            }
        };
        
        this.reset = function() {
            moves = 0;
            pushes = 0;
            var cells = this.field.cells;
            for (var i = movement.length - 1; i >= 0; --i) {
                var move = movement[i];
                var tempCell = cells[move.fromRow][move.fromCol];

                cells[move.fromRow][move.fromCol] = cells[move.toRow][move.toCol];
                cells[move.toRow][move.toCol] = cells[move.toRow][move.toCol].underCell;
                cells[move.fromRow][move.fromCol].underCell = tempCell;
            }
            movement = [];
        };

    };
    
    this.Level.parse = function (configLevels) {
        
        function parseLevel(configLevel) {
            var level = new sokoban.Level(configLevel.plan.length, configLevel.plan[0].length);
            level.number = configLevel.number;
            level.startText = configLevel.startText;
            level.endText = configLevel.endText;
            
            for (var i = 0; i < level.field.rows; ++i) {
                var line = configLevel.plan[i];
                for (var j = 0; j < level.field.cols; ++j) {
                    level.field.cells[i][j] = sokoban.Level.parseCell(line[j]);
                }
            }
            
            return level;
        }
        
        var levels = [];

        configLevels.forEach(function(configLevel) {
            levels.push(parseLevel(configLevel));
        });

        return levels;
    };
    
    this.Level.parseCell = function (ch) {
        var cell = null;

        switch (ch) {
            case sokoban.cell.Space.char:
                cell = new sokoban.cell.Space();
                break;
            case sokoban.cell.Wall.char:
                cell = new sokoban.cell.Wall();
                break;
            case sokoban.cell.Box.char:
                cell = new sokoban.cell.Box();
                break;
            case sokoban.cell.Place.char:
                cell = new sokoban.cell.Place();
                break;
            case sokoban.cell.Doker.char:
                cell = new sokoban.cell.Doker();
                break;
            default:
                cell = new sokoban.cell.Space();
                break;
        }

        return cell;
    };
    
    return this;
}).call(sokoban || {});