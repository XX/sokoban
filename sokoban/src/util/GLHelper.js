var sokoban = (function() {
    this.util = (function() {

        this.GLHelper = function() {
        };

        this.GLHelper.createGL = function(canvas) {
            var gl = null;

            if (!window.WebGLRenderingContext) {
                // the browser doesn't even know what WebGL is
                window.location = "http://get.webgl.org";
            } else {
                gl = WebGLUtils.create3DContext(canvas, {antialias : true});
                if (!gl) {
                    // browser supports WebGL but initialization failed.
                    alert("Could not initialise WebGL, sorry :-(");
                    window.location = "http://get.webgl.org/troubleshooting";
                } else {
                    gl.viewportWidth = canvas.width;
                    gl.viewportHeight = canvas.height;
                }
            }

            return gl;
        };

        this.GLHelper.getShader = function(gl, shaderObject) {
            var shader;
            if (shaderObject.type === "fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (shaderObject.type === "vertex") {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return null;
            }

            gl.shaderSource(shader, shaderObject.program);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;
        };

        return this;
    }).call(this.util || {});
    return this;
}).call(sokoban || {});