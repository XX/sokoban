var sokoban = (function() {
    
    var testLevel = {
        number: 0,
        plan: ["OOOOO",
               "O--*O",
               "O-#+O",
               "OOOOO"]
    };
    
    var Level1 = {
        number: 1,
        plan: ["----OOOOO----------",
               "----O---O----------",
               "----O#--O----------",
               "--OOO--#OO---------",
               "--O--#-#-O---------",
               "OOO-O-OO-O---OOOOOO",
               "O---O-OO-OOOOO--++O",
               "O-#--#----------++O",
               "OOOOO-OOO-O*OO--++O",
               "----O-----OOOOOOOOO",
               "----OOOOOOO--------"]
    };
    
    var Level2 = {
        number: 2,
        plan: ["OOOOOOOOOOOO--",
               "O++--O-----OOO",
               "O++--O-#--#--O",
               "O++--O#OOOO--O",
               "O++------OO--O",
               "O++--O-O*-#-OO",
               "OOOOOO-OO#-#-O",
               "--O-#--#-#-#-O",
               "--O----O-----O",
               "--OOOOOOOOOOOO"]
    };

    var Level3 = {
        number: 3,
        plan: ["--------OOOOOOOO-",
               "--------O-----*O-",
               "--------O-#O#-OO-",
               "--------O-#--#O--",
               "--------OO#-#-O--",
               "OOOOOOOOO-#-O-OOO",
               "O++++--OO-#--#--O",
               "OO+++----#--#---O",
               "O++++--OOOOOOOOOO",
               "OOOOOOOO---------"]
    };
    
    var Level4 = {
        number: 4,
        plan: ["--------------OOOOOOOO",
               "--------------O--++++O",
               "---OOOOOOOOOOOO--++++O",
               "---O----O--#-#---++++O",
               "---O-###O#--#-O--++++O",
               "---O--#-----#-O--++++O",
               "---O-##-O#-#-#OOOOOOOO",
               "OOOO--#-O-----O-------",
               "O---O-OOOOOOOOO-------",
               "O----#--OO------------",
               "O-##O##-*O------------",
               "O---O---OO------------",
               "OOOOOOOOO-------------"]
    };
    
    var Level5 = {
        number: 5,
        plan: ["--------OOOOO----",
               "--------O---OOOOO",
               "--------O-O#OO--O",
               "--------O-----#-O",
               "OOOOOOOOO-OOO---O",
               "O++++--OO-#--#OOO",
               "O++++----#-##-OO-",
               "O++++--OO#--#-*O-",
               "OOOOOOOOO--#--OO-",
               "--------O-#-#--O-",
               "--------OOO-OO-O-",
               "----------O----O-",
               "----------OOOOOO-"]
    };

    var config = {
        levels: [testLevel, Level1, Level2, Level3, Level4, Level5]
    };
    
    this.GameRunner = function(params) {
        
        for (var key in params) {
            config[key] = params[key];
        }
        this.game = new sokoban.Game(config);
        
        this.run = function() {
            this.game.start();
        };
    };
    
    return this;
}).call(sokoban || {}); 
