//
// This is the vertex shader 
attribute vec3 aVertexPosition;  // Vertex shader expects one vertex position

// to transform the vertex position
uniform mat4 uModelXformMatrix;
uniform mat4 uCameraXformMatrix;

// used for line drawing 
uniform float uPointSize;

void main(void) {
    // Convert the vec3 into vec4 for scan conversion and
    // transform by uModelXformMatrix and uCameraXformMatrix before
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = uCameraXformMatrix * uModelXformMatrix * vec4(aVertexPosition, 1.0); 

    // only use for line drawing
    gl_PointSize = uPointSize;
}