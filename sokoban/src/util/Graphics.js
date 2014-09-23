var sokoban = (function() {
    this.util = (function() {
        
        this.Graphics = function() {
            this.mvMatrix = mat4.create();
            this.pMatrix = mat4.create();
            this.gl = null;
            this.shaderProgram = null;
            
            var matrixStack = [];
            
            this.getNormalMatrix = function () {
                var normalMatrix = mat3.create();
                mat3.normalFromMat4(normalMatrix, this.mvMatrix);
                
                return normalMatrix;
            };
            
            this.pushMatrix = function(matrix) {
                var copy = mat4.create();
                mat4.copy(copy, matrix);
                matrixStack.push(copy);
            };

            this.popMatrix = function() {
                if (matrixStack.length === 0) {
                    throw "Invalid popMatrix!";
                }
                return matrixStack.pop();
            };
            
            this.pushMvMatrix = function () {
                this.pushMatrix(this.mvMatrix);
            };
            
            this.popMvMatrix = function () {
                this.mvMatrix = this.popMatrix();
            };
            
            this.setMatrixUniforms = function () {
                this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
                this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
            };
            
            this.perspective = function (fovy, aspect, near, far) {
                mat4.perspective(this.pMatrix, fovy, aspect, near, far);
            };
            
            this.identity = function() {
                mat4.identity(this.mvMatrix);
            };
            
            this.translate = function(x, y, z) {
                mat4.translate(this.mvMatrix, this.mvMatrix, [x, y, z]);
            };
            
            this.scale = function(x, y, z) {
                mat4.scale(this.mvMatrix, this.mvMatrix, [x, y, z]);
            };
            
            this.rotate = function(angle, vector) {
                mat4.rotate(this.mvMatrix, this.mvMatrix, angle, vector);
            };
            
            this.degToRad = function (degrees) {
                return degrees * Math.PI / 180;
            };
            
        };
    
        return this;
    }).call(this.util || {});
    return this;
}).call(sokoban || {});