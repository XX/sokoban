var sokoban = (function() {
    this.util = (function() {
                
        this.TextureManager = (function() {
            var objects = [];
            var textures = {};
            var emptyTexture = null;
            var resourcePath = "";
            
            var entry = function() {
            };
    
            entry.readTexture = function(graph, path, textureLoadHandler) {
                if (typeof textureLoadHandler === 'undefined') {
                    textureLoadHandler = handleLoadedTexture;
                }
                
                var texture = null;
                if (path in textures) {
                    texture = textures[path];
                } else {
                    var image = new Image();

                    var texture = graph.gl.createTexture();
                    texture.image = image;

                    image.loaded = false;
                    image.onload = function() {
                        textureLoadHandler(graph, texture);
                        image.loaded = true;
                    };
                    image.src = (resourcePath ? resourcePath + '/' : '') + path;

                    textures[path] = texture;
                }
                
                return texture;
            };

            function handleLoadedTexture(graph, texture) {
                var gl = graph.gl;

                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.generateMipmap(gl.TEXTURE_2D);

                gl.bindTexture(gl.TEXTURE_2D, null);
            }
            
            entry.addTexturedObject = function (object) {
                objects.push(object);
            };
            
            entry.loadTextures = function (graph, resPath) {
                resourcePath = resPath;
                for (var i = 0; i < objects.length; ++i) {
                    objects[i].loadTexture(graph);
                }
            };
            
            entry.loadEmptyTexture = function (graph) {
                if (emptyTexture === null) {
                    var gl = graph.gl;
                    emptyTexture = gl.createTexture();

                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

                    gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
                    var whitePixel = new Uint8Array([255, 255, 255, 255]);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);

                    gl.bindTexture(gl.TEXTURE_2D, null);
                }
                return emptyTexture;
            };
            
            return entry;
        })();
    
        return this;
    }).call(this.util || {});
    return this;
}).call(sokoban || {});