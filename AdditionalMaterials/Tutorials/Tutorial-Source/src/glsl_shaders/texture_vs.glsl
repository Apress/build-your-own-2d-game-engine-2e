//
// This is the vertex shader 

//
attribute vec3 aVertexPosition;      // Vertex shader expects one vertex position
attribute vec2 aTextureCoordinate;   // This is the texture coordinate attribute

// texture coordinate that maps image to the square
varying vec2 vTexCoord;

// to transform the vertex position
uniform mat4 uModelXformMatrix;
uniform mat4 uCameraXformMatrix;

void main(void) { 
    // Convert the vec3 into vec4 for scan conversion and
    // transform by uModelXformMatrix and uCameraXformMatrix before
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = uCameraXformMatrix * uModelXformMatrix * vec4(aVertexPosition, 1.0); 
    
    // pass the texture coordinate to the fragment shader
    vTexCoord = aTextureCoordinate;
}