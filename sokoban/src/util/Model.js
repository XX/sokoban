var sokoban = (function() {
    this.util = (function() {
        
        this.Model = function(modelData, texturePath, color) {
            this.modelData = modelData;
            this.texturePath = texturePath || null;
            this.texture = null;
            this.color = color || new Float32Array([1, 1, 1, 1]); // white (empty) color
            this.graph = null;
            
            var positionBuffer = null;
            var textureCoordBuffer = null;
            var indexBuffer = null;
            var normalBuffer = null;
            
            this.init = function (graph) {
                this.graph = graph;
                initBuffers(graph, this.modelData);
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
            
            function initBuffers(graph, modelData) {
                var gl = graph.gl;

                positionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.verts), gl.STATIC_DRAW);
                positionBuffer.itemSize = 3;
                positionBuffer.numItems = modelData.verts.length / 3;

                textureCoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.texcoords), gl.STATIC_DRAW);
                textureCoordBuffer.itemSize = 2;
                textureCoordBuffer.numItems = modelData.texcoords.length / 2;

                indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelData.indices), gl.STATIC_DRAW);
                indexBuffer.itemSize = 1;
                indexBuffer.numItems = modelData.indices.length;
                
                normalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelData.normals), gl.STATIC_DRAW);
                normalBuffer.itemSize = 3;
                normalBuffer.numItems = modelData.normals.length / 3;
            }
        };
    
        return this;
    }).call(this.util || {});
    return this;
}).call(sokoban || {});