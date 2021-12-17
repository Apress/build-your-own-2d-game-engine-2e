// This is the vertex shader 
//

attribute vec3 aVertexPosition;  // Vertex shader expects one vertex position

void main(void) {
    // Convert the vec3 into vec4 for scan conversion and
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = vec4(aVertexPosition, 1.0); 
}
