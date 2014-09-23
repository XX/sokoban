var sokoban = (function() {
    
    this.Game = function(config) {
        var levels = sokoban.Level.parse(config.levels);
        var currentLevelIndex = 0;
        var resourcePath = config.resPath;
        var totalMovements = 0;
        
        var canvasId = config.canvasId;
        var helper = sokoban.util.GLHelper;
        var graph = new sokoban.util.Graphics();
        var beginAnimation = new sokoban.util.Animation();
        var spaceMode = false;
        
        var pressedKeys = [];
        var mouse = {
            button: [0, 0, 0],
            lastX: null,
            lastY: null,
            isDown: function () {
                return this.button[0] || this.button[1] || this.button[0];
            }
        };
        
        this.start = function() {
            init();
            setTimeout(function() {
                loop();
            }, 500);
        };
        
        function loop() {
            requestAnimFrame(loop);
            handleKeys();
            draw();
        }
        
        function init() {
            var canvas = document.getElementById(canvasId);
            
            graph.gl = helper.createGL(canvas);
            initShaders();
            initLevel();
            initInput();

            var gl = graph.gl;
            gl.clearColor(0.9, 0.9, 1.0, 1.0);
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            
            gl.depthFunc(gl.LEQUAL);
            // TODO: http://stackoverflow.com/questions/15242507/perspective-correct-texturing-of-trapezoid-in-opengl-es-2-0
            // gl.hint(gl.PERSPECTIVE_CORRECTION_HINT, gl.NICEST);
        };
        
        function initShaders() {
            var gl = graph.gl;
            var shaderProgram = graph.shaderProgram;
            
            var fragmentShader = helper.getShader(gl, fragmentSh);
            var vertexShader = helper.getShader(gl, vertexSh);
                        
            shaderProgram = gl.createProgram();
            
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert("Could not initialise shaders");
            }

            gl.useProgram(shaderProgram);

            shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

            shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
            gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
            
            shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
            gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

            shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
            shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
            shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
            shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
            shaderProgram.vertexColorUniform = gl.getUniformLocation(shaderProgram, "uVertexColor");
            shaderProgram.isLightNotUseUniform = gl.getUniformLocation(shaderProgram, "uIsLightNotUse");
            
            graph.shaderProgram = shaderProgram;
        }
        
        function showCompleteMessage(isShow) {
            var messageId = document.getElementById(config.messageId);
            if (isShow) {
                messageId.style.visibility = "visible";
            } else {
                messageId.style.visibility = "hidden";
            }
        }
        
        function setLevelNumberText() {
            config.levelNumberIds.forEach(function(id) {
                document.getElementById(id).innerHTML =
                        levels[currentLevelIndex].number;
            });
        }
        
        function setLevelMovementsText() {
            setTimeout(function() {
                document.getElementById(config.levelMovingsId).innerHTML =
                    levels[currentLevelIndex].getMoves();
            }, 0);
        }
        
        function setTotalMovementsText() {
            document.getElementById(config.totalMovingsId).innerHTML = totalMovements;
        }
        
        function initLevel() {
            showCompleteMessage(false);
            
            setLevelNumberText();
            setLevelMovementsText();
            setTotalMovementsText();
            
            initObjects();
            initTextures();
            initAnimation();
        }
        
        function initObjects() {
            sokoban.util.ModelManager.resourcePath = resourcePath;
            levels[currentLevelIndex].initObjects(graph);
        }
        
        function initTextures() {
            sokoban.util.TextureManager.loadTextures(graph, resourcePath);
        }
        
        function initAnimation() {
            var animation = beginAnimation;
            
            animation.rx.start = 37.5;
            animation.rx.end = 90.0;
            animation.rx.current = animation.rx.start;

            animation.ry.start = 37.0;
            animation.ry.end = 0.0;
            animation.ry.current = animation.ry.start;

            animation.tz.start = -10.0;
            animation.tz.end = -4.0;
            animation.tz.current = animation.tz.start;
            
            animation.speed = 0.002;
            animation.calculateTransform();
        }
        
        function cameraPosition() {
            var animation = beginAnimation;
            
            animation.rx.start = animation.rx.current;
            animation.ry.start = animation.ry.current;
            animation.tz.start = animation.tz.current;

            if (spaceMode) {
                animation.rx.end = animation.rx.old;
                animation.ry.end = animation.ry.old;
                animation.tz.end = animation.tz.old;
            } else {
                animation.rx.old = animation.rx.current;
                animation.ry.old = animation.ry.current;
                animation.tz.old = animation.tz.current;

                animation.rx.end = 90.0;
                animation.ry.end = 0.0;
                animation.tz.end = -4.0;
            }
            animation.calculateTransform();
            
        }
        
        function animate() {
            var animation = beginAnimation;
            animation.animate();
            graph.translate(animation.tx.current, animation.ty.current, animation.tz.current);
            graph.rotate(graph.degToRad(animation.rx.current), [1, 0, 0]);
            graph.rotate(graph.degToRad(animation.ry.current), [0, 1, 0]);
            graph.rotate(graph.degToRad(animation.rz.current), [0, 0, 1]);
        };
        
        function initInput() {
            document.onkeydown = handleKeyDown;
            document.onkeyup = handleKeyUp;
            
            canvas = document.getElementById(canvasId);
            canvas.onmousedown = handleMouseDown;
            
            document.onmouseup = handleMouseUp;
            document.onmousemove = handleMouseMove;
        }
        
        function move(dir) {
            levels[currentLevelIndex].move(dir);
            setLevelMovementsText();
        }

        function handleKeyDown(event) {
            pressedKeys[event.keyCode] = true;
            // Space
            if (event.keyCode === 32) {
                cameraPosition();
            }
            // Backspace or R
            if (event.keyCode === 8 || event.keyCode === 82) {
                levels[currentLevelIndex].reset();
                setLevelMovementsText();
                showCompleteMessage(false);
            }
        }

        function handleKeyUp(event) {
            pressedKeys[event.keyCode] = false;
            // Space
            if (event.keyCode === 32) {
                spaceMode = !spaceMode;
            }
        }
        
        function handleKeys() {
            if (pressedKeys[37] || pressedKeys[65]) {
                // Left cursor key
                // or A key
                move([0, -1]);
            }
            if (pressedKeys[39] || pressedKeys[68]) {
                // Right cursor key
                // or D key
                move([0, 1]);
            }
            if (pressedKeys[38] || pressedKeys[87]) {
                // Up cursor key
                // or W key
                move([-1, 0]);
            }
            if (pressedKeys[40] || pressedKeys[83]) {
                // Down cursor key
                // or S key
                move([1, 0]);
            }
            if (pressedKeys[33]) {
                // PgUp key
                beginAnimation.tz.current += 0.1;
                beginAnimation.tz.end = beginAnimation.tz.current;
            }
            if (pressedKeys[34]) {
                // PgDn key
                beginAnimation.tz.current -= 0.1;
                beginAnimation.tz.end = beginAnimation.tz.current;
            }
        }

        var moonRotationMatrix = mat4.create();
        mat4.identity(moonRotationMatrix);

        function handleMouseDown(event) {
            mouse.button[event.button] = true;
            mouse.lastX = event.clientX;
            mouse.lastY = event.clientY;
        }

        function handleMouseUp(event) {
            mouse.button[event.button] = false;
        }

        function handleMouseMove(event) {
            if (!mouse.isDown()) {
                return;
            }
            var newX = event.clientX;
            var newY = event.clientY;

            var animation = beginAnimation;
            if (mouse.button[0]) { //Если опущена левая кнопка при перемещении
                if (mouse.lastX > newX) animation.ry.current -= (mouse.lastX - newX) / 2; //Вычисляем новые значения углов,
                if (mouse.lastX < newX) animation.ry.current += (newX - mouse.lastX) / 2; //учитывая смещение курсора относительно
                if (mouse.lastY > newY) animation.rx.current -= (mouse.lastY - newY) / 2; //предыдущего положения
                if (mouse.lastY < newY) animation.rx.current += (newY - mouse.lastY) / 2;
                animation.rx.end = animation.rx.current;
                animation.ry.end = animation.ry.current;
            }
            if (mouse.button[1]) { //Если опущена средняя кнопка при перемещении
                if (mouse.lastY > newY) animation.tz.current += 0.1; //Если мышь перемещаем вверх, то приближаемся
                if (mouse.lastY < newY) animation.tz.current -= 0.1; //Если мышь перемещаем вниз, то удаляемся
                animation.tz.end = animation.tz.current;
            }
            spaceMode = false;
            
            mouse.lastX = newX;
            mouse.lastY = newY;
        }
        
        function draw() {
            var gl = graph.gl;
            
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            graph.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
            graph.identity();
            
            animate();
            levels[currentLevelIndex].draw(graph);
            logic();
        }
        
        function logic() {
            if (levels[currentLevelIndex].isLevelComplete()) {
                showCompleteMessage(true);
                if (pressedKeys[13]) {
                    totalMovements += levels[currentLevelIndex].getMoves();
                    if (nextLevel()) {
                        initLevel();
                    } else {
                        //game.exit();
                    }
                }
            }
        }
        
        function nextLevel() {
            if (++currentLevelIndex >= levels.length) {
                currentLevelIndex = levels.length - 1;
                return false;
            }
            return true;
        }
        
    };
    
    return this;
}).call(sokoban || {});
