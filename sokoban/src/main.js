var sokoban = (function() {
        
    var imports = [
        {type: "res", fileName: "obj/doker.json.js"},
        {type: "mod", fileName: "shader/fragment.js"},
        {type: "mod", fileName: "shader/vertex.js"},
        {type: "mod", fileName: "util/GLHelper.js"},
        {type: "mod", fileName: "util/Graphics.js"},
        {type: "mod", fileName: "util/Animation.js"},
        {type: "mod", fileName: "util/AnimateParameter.js"},
        {type: "mod", fileName: "util/TextureManager.js"},
        {type: "mod", fileName: "util/ModelManager.js"},
        {type: "mod", fileName: "util/Model.js"},
        {type: "mod", fileName: "cell/Space.js"},
        {type: "mod", fileName: "cell/Cube.js"},
        {type: "mod", fileName: "cell/Box.js"},
        {type: "mod", fileName: "cell/Doker.js"},
        {type: "mod", fileName: "cell/Place.js"},
        {type: "mod", fileName: "cell/Wall.js"},
        {type: "mod", fileName: "Field.js"},
        {type: "mod", fileName: "Level.js"},
        {type: "mod", fileName: "Game.js"},
        {type: "mod", fileName: "GameRunner.js"},
        //{type: "test", fileName: "GameTest.js"}
    ];
    
    this.main = function(params) {
        var runner = new sokoban.GameRunner(params);
        runner.run();
    };
    
    this.mainDev = function(params) {
        var gamePath = params.gamePath;
        var libPath = params.libPath = params.libPath || gamePath + "/lib";
        var resPath = params.resPath = params.resPath || gamePath + "/res";
        var count = 0;
        
        imports.forEach(function (entry) {
            
            // Build script path
            var path = entry.fileName;
            if (entry.type === "mod") {
                path = gamePath + "/src/" + path;
            } else if (entry.type === "lib") {
                path = libPath + "/" + path;
            } else if (entry.type === "test") {
                path = gamePath + "/test/" + path;
            } else if (entry.type === "res") {
                path = resPath + "/" + path;
            }
            
            // Load script
            loadScript(path, function() {
                count++;
                if (count === imports.length) {
                    // All scripts loaded - run game
                    this.main(params);
                }
            });
        });
    };
    
    function loadScript(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }
    
    return this;
}).call(sokoban || {});