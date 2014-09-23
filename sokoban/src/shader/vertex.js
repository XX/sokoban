var vertexSh = {
    type: "vertex",
    program: (function () {/*
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec3 aVertexNormal;
    
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    uniform mat3 uNMatrix;
    
    uniform vec4 uVertexColor;
    uniform int uIsLightNotUse;

    varying vec2 vTextureCoord;
    varying vec3 vLightWeight;
    varying vec4 vColor;

    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vTextureCoord = aTextureCoord;
        vColor = uVertexColor;

        if (uIsLightNotUse != 0) {
            vLightWeight = vec3(1.0, 1.0, 1.0);
        } else {
            vec3 transformedNormal = uNMatrix * aVertexNormal;
            vec3 lightingDirection = vec3(0.25, 0.25, 0.5);
            vec3 ambientColor = vec3(0.6, 0.6, 0.6);
            vec3 directionalColor = vec3(0.3, 0.3, 0.3);

            float directionalLightWeight = max(dot(transformedNormal, lightingDirection), 0.0);
            vLightWeight = ambientColor + directionalColor * directionalLightWeight;
        }
    }
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]
};