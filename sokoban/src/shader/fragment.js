var fragmentSh = {
    type: "fragment",
    program: (function () {/*
    #ifdef GL_ES
        precision mediump float;
    #endif

    varying vec2 vTextureCoord;
    varying vec3 vLightWeight;
    varying vec4 vColor;

    uniform sampler2D uSampler;

    void main(void) {
        vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
        vec4 color = vColor * textureColor;
        gl_FragColor = vec4(color.rgb * vLightWeight, color.a);
    }
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]
};