/* 
 * File: shader_support.js
 * Support the loading, compiling, and linking of shader code
 * 
 * Notice: although in different files, access to symbols defined in other files
 *         can be established via "import" and "export statements"  
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as core from "./core.js";                   // access symbols defined as "core" module
import * as vertexBuffer from "./vertex_buffer.js";  // access symbols defined as "vertexBuffer" module

let mCompiledShader = null;
// Reference to the shader program stored in mGL context.
let mVertexPositionRef = null;
// mGL reference to the attribute to be used by the VertexShader


function init(vertexShaderID, fragmentShaderID) {
    let gl = core.getGL();

    // Step A: load and compile vertex and fragment shaders
    let vertexShader = loadAndCompileShader(vertexShaderID, gl.VERTEX_SHADER);
    let fragmentShader = loadAndCompileShader(fragmentShaderID, gl.FRAGMENT_SHADER);

    // Step B: Create and link the shaders into a program.
    mCompiledShader = gl.createProgram();
    gl.attachShader(mCompiledShader, vertexShader);
    gl.attachShader(mCompiledShader, fragmentShader);
    gl.linkProgram(mCompiledShader);

    // Step C: check for error
    if (!gl.getProgramParameter(mCompiledShader, gl.LINK_STATUS)) {
        throw new Error("Error linking shader");
        return null;
    }

    // Step D: Gets a reference to the aVertexPosition attribute within the shaders.
    mVertexPositionRef = gl.getAttribLocation(mCompiledShader, "aVertexPosition");
}


// Activate the shader for rendering
function activate() {
    // Step A: access to the webgl context
    let gl = core.getGL();

    // Step B: identify the compiled shader to use
    gl.useProgram(mCompiledShader);

    // Step C: bind the vertex buffer to the attribute defined in the vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.get());
    gl.vertexAttribPointer(this.mVertexPositionRef,
        3,              // each element is a 3-float (x,y.z)
        gl.FLOAT,      // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);             // offsets to the first element
    gl.enableVertexAttribArray(this.mVertexPositionRef);

}

//**-----------------------------------
// Private methods not visible outside of this file
// **------------------------------------

// 
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function loadAndCompileShader(id, shaderType) {
    let shaderSource = null, compiledShader = null;

    // Step A: Get the shader source from index.html
    let shaderText = document.getElementById(id);
    shaderSource = shaderText.firstChild.textContent;

    let gl = core.getGL();
    // Step B: Create the shader based on the shader type: vertex or fragment
    compiledShader = gl.createShader(shaderType);

    // Step C: Compile the created shader
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        throw new Error("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
}

//
// export the class, the default keyword says importer of this class cannot change the name "SimpleShader"
// for this reason, to import this class, one must issue
//      import SimpleShader from "./simple_shader.js";
// attempt to change name, e.g., 
//      import SimpleShader as MyShaderName from "./simple_shader.js";
// will result in failure
// 
export { init, activate }