var sokoban = (function() {
    this.cell = (function() {
        
        this.Cube = function(texturePath, color) {
            this.underCell = new sokoban.cell.Space();
            this.animation = new sokoban.util.Animation();
            this.texturePath = texturePath || null;
            this.texture = null;
            this.color = color || new Float32Array([1, 1, 1, 1]); // white (empty) color
            
            var positionBuffer = null;
            var textureCoordBuffer = null;
            var indexBuffer = null;
            var normalBuffer = null;
                        
            this.init = function (graph) {
                initBuffers(graph);
                sokoban.util.TextureManager.addTexturedObject(this);
            };
            
            this.loadTexture = function (graph) {
                if (this.texturePath !== null) {
                    this.texture = sokoban.util.TextureManager.readTexture(graph, this.texturePath);
                } else {
                    this.texture = sokoban.util.TextureManager.loadEmptyTexture(graph);
                }
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
                        
                gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
                gl.vertexAttribPointer(graph.shaderProgram.textureCoordAttribute,
                        textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
                                
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.uniform1i(graph.shaderProgram.samplerUniform, 0);

                gl.uniform4fv(graph.shaderProgram.vertexColorUniform, this.color);
                gl.uniform1i(graph.shaderProgram.isLightNotUseUniform, 0);
                
                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                gl.vertexAttribPointer(graph.shaderProgram.vertexNormalAttribute,
                        normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                
                gl.uniformMatrix3fv(graph.shaderProgram.nMatrixUniform, false, graph.getNormalMatrix());

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                graph.setMatrixUniforms();
                gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);                
                
                graph.popMvMatrix();
            };
            
            function initBuffers(graph) {
                var gl = graph.gl;
                
                positionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                var vertices = [
                    // Передняя грань
                    -0.5, -0.5,  0.5,
                     0.5, -0.5,  0.5,
                     0.5,  0.5,  0.5,
                    -0.5,  0.5,  0.5,

                    // Задняя грань
                    -0.5, -0.5, -0.5,
                    -0.5,  0.5, -0.5,
                     0.5,  0.5, -0.5,
                     0.5, -0.5, -0.5,

                    // Верхняя грань
                    -0.5,  0.5, -0.5,
                    -0.5,  0.5,  0.5,
                     0.5,  0.5,  0.5,
                     0.5,  0.5, -0.5,

                    // Нижняя грань
                    -0.5, -0.5, -0.5,
                     0.5, -0.5, -0.5,
                     0.5, -0.5,  0.5,
                    -0.5, -0.5,  0.5,

                    // Правая грань
                     0.5, -0.5, -0.5,
                     0.5,  0.5, -0.5,
                     0.5,  0.5,  0.5,
                     0.5, -0.5,  0.5,

                    // Левая грань
                    -0.5, -0.5, -0.5,
                    -0.5, -0.5,  0.5,
                    -0.5,  0.5,  0.5,
                    -0.5,  0.5, -0.5,
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
                positionBuffer.itemSize = 3;
                positionBuffer.numItems = 24;
                
                // Cube texture buffer
                textureCoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
                var textureCoords = [
                    // Front face
                    0.0, 0.0,
                    1.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0,

                    // Back face
                    1.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0,
                    0.0, 0.0,

                    // Top face
                    0.0, 1.0,
                    0.0, 0.0,
                    1.0, 0.0,
                    1.0, 1.0,

                    // Bottom face
                    1.0, 1.0,
                    0.0, 1.0,
                    0.0, 0.0,
                    1.0, 0.0,

                    // Right face
                    1.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0,
                    0.0, 0.0,

                    // Left face
                    0.0, 0.0,
                    1.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0,
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
                textureCoordBuffer.itemSize = 2;
                textureCoordBuffer.numItems = 24;
                
                // Cube index buffer
                indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                var cubeVertexIndices = [
                    0, 1, 2,      0, 2, 3,    // Front face
                    4, 5, 6,      4, 6, 7,    // Back face
                    8, 9, 10,     8, 10, 11,  // Top face
                    12, 13, 14,   12, 14, 15, // Bottom face
                    16, 17, 18,   16, 18, 19, // Right face
                    20, 21, 22,   20, 22, 23  // Left face
                ];
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
                indexBuffer.itemSize = 1;
                indexBuffer.numItems = 36;
                
                normalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                var vertexNormals = [
                  // Front face
                   0.0,  0.0,  1.0,
                   0.0,  0.0,  1.0,
                   0.0,  0.0,  1.0,
                   0.0,  0.0,  1.0,

                  // Back face
                   0.0,  0.0, -1.0,
                   0.0,  0.0, -1.0,
                   0.0,  0.0, -1.0,
                   0.0,  0.0, -1.0,

                  // Top face
                   0.0,  1.0,  0.0,
                   0.0,  1.0,  0.0,
                   0.0,  1.0,  0.0,
                   0.0,  1.0,  0.0,

                  // Bottom face
                   0.0, -1.0,  0.0,
                   0.0, -1.0,  0.0,
                   0.0, -1.0,  0.0,
                   0.0, -1.0,  0.0,

                  // Right face
                   1.0,  0.0,  0.0,
                   1.0,  0.0,  0.0,
                   1.0,  0.0,  0.0,
                   1.0,  0.0,  0.0,

                  // Left face
                  -1.0,  0.0,  0.0,
                  -1.0,  0.0,  0.0,
                  -1.0,  0.0,  0.0,
                  -1.0,  0.0,  0.0,
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
                normalBuffer.itemSize = 3;
                normalBuffer.numItems = 24;
            }
            
        };
    
        return this;
    }).call(this.cell || {});
    return this;
}).call(sokoban || {}); 
