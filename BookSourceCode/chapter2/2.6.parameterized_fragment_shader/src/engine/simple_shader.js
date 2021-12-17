/* 
 * File: simple_shader.js
 * 
 * Defines the SimpleShader class
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as core from "./core.js";
import * as vertexBuffer from "./vertex_buffer.js";

class SimpleShader {

    // constructor of SimpleShader object
    constructor(vertexShaderPath, fragmentShaderPath) {
        // instance variables
        // Convention: all instance variables: mVariables
        this.mCompiledShader = null;  // reference to the compiled shader in webgl context  
        this.mVertexPositionRef = null; // reference to VertexPosition within the shader
        this.mPixelColorRef = null;     // reference to the pixelColor uniform in the fragment shader

        let gl = core.getGL();
        // 
        // Step A: load and compile vertex and fragment shaders
        this.mVertexShader = loadAndCompileShader(vertexShaderPath, gl.VERTEX_SHADER);
        this.mFragmentShader = loadAndCompileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);

        // Step B: Create and link the shaders into a program.
        this.mCompiledShader = gl.createProgram();
        gl.attachShader(this.mCompiledShader, this.mVertexShader);
        gl.attachShader(this.mCompiledShader, this.mFragmentShader);
        gl.linkProgram(this.mCompiledShader);

        // Step C: check for error
        if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
            throw new Error("Shader linking failed with [" + vertexShaderPath + " " + fragmentShaderPath +"].");
            return null;
        }

        // Step D: Gets a reference to the aVertexPosition attribute within the shaders.
        this.mVertexPositionRef = gl.getAttribLocation(this.mCompiledShader, "aVertexPosition");

        // Step E: Gets a reference to the uniform variable uPixelColor in the fragment shader
        this.mPixelColorRef = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
    }

    
    // Activate the shader for rendering
    activate(pixelColor) {
        let gl = core.getGL();
        gl.useProgram(this.mCompiledShader);
        
        // bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.get());
        gl.vertexAttribPointer(this.mVertexPositionRef,
            3,              // each element is a 3-float (x,y.z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        gl.enableVertexAttribArray(this.mVertexPositionRef);
        
        // load uniforms
        gl.uniform4fv(this.mPixelColorRef, pixelColor);
    }
}

//**-----------------------------------
// Private methods not visible outside of this file
// **------------------------------------

// 
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function loadAndCompileShader(filePath, shaderType) {
    let xmlReq, shaderSource = null, compiledShader = null;
    let gl = core.getGL();

    // Step A: Request the text from the given file location.
    xmlReq = new XMLHttpRequest();
    xmlReq.open('GET', filePath, false);
    try {
        xmlReq.send();
    } catch (error) {
        throw new Error("Failed to load shader: " + filePath + " [Hint: you cannot double click index.html to run this project. " +
                "The index.html file must be loaded by a web-server.]");
        return null;
    }
    shaderSource = xmlReq.responseText;

    if (shaderSource === null) {
        throw new Error("WARNING: Loading of:" + filePath + " Failed!");
        return null;
    }

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
//-- end of private methods


//
// export the class, the default keyword says importer of this class cannot change the name "SimpleShader"
// for this reason, to import this class, one must issue
//      import SimpleShader from "./simple_shader.js";
// attempt to change name, e.g., 
//      import SimpleShader as MyShaderName from "./simple_shader.js";
// will result in failure
// 
export default SimpleShader;