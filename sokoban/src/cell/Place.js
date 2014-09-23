var sokoban = (function() {
    this.cell = (function() {
        
        var PLACE_CHAR = '+';
        
        this.Place = function() {
            this.char = PLACE_CHAR;
            this.underCell = new sokoban.cell.Space();
            this.animation = new sokoban.util.Animation();
            this.texture = null;
            this.color = new Float32Array([0, 0, 0.9, 1]);
            
            var positionBuffer = null;
            var indexBuffer = null;
            
            sokoban.util.TextureManager.addTexturedObject(this);
            
            this.init = function (graph) {
                initBuffers(graph);
            };
            
            this.loadTexture = function (graph) {
                this.texture = sokoban.util.TextureManager.loadEmptyTexture(graph);
            };
            
            this.draw = function (graph) {
                var gl = graph.gl;
                
                graph.pushMvMatrix();
                
                this.underCell.draw(graph);
                this.animation.animate();
                
                graph.translate(this.animation.tx.current, this.animation.ty.current, this.animation.tz.current);
                graph.rotate(graph.degToRad(this.animation.rx.current), [1, 0, 0]);
                graph.rotate(graph.degToRad(this.animation.ry.current), [0, 1, 0]);
                graph.rotate(graph.degToRad(this.animation.rz.current), [0, 0, 1]);

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.vertexAttribPointer(graph.shaderProgram.vertexPositionAttribute,
                        positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.uniform4fv(graph.shaderProgram.vertexColorUniform, this.color);
                gl.uniform1i(graph.shaderProgram.isLightNotUseUniform, 1);
                
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.uniform1i(graph.shaderProgram.samplerUniform, 0);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                graph.setMatrixUniforms();
                gl.drawElements(gl.LINE_STRIP, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                
                graph.popMvMatrix();
            };
            
            function initBuffers(graph) {
                var gl = graph.gl;
                
                positionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                var vertices = [
                    -0.4,  0.0,  0.0,
                     0.0,  0.0,  0.2,
                     0.4,  0.0,  0.0,
                     0.0,  0.0, -0.2,
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
                positionBuffer.itemSize = 3;
                positionBuffer.numItems = vertices.length / positionBuffer.itemSize;
                
                indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                var vertexIndices = [
                    0, 1,
                    1, 2,
                    2, 3,
                    3, 0
                ];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
                indexBuffer.itemSize = 1;
                indexBuffer.numItems = vertexIndices.length / indexBuffer.itemSize;
            }
            
        };
        
        this.Place.char = PLACE_CHAR;
    
        return this;
    }).call(this.cell || {});
    return this;
}).call(sokoban || {}); 
