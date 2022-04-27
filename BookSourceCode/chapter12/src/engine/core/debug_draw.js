/*
 * File: debug_draw.js
 * Support drawing of basic shapes for debugging purposes
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import LineRenderable from "../renderables/line_renderable.js";

/**
 * Support drawing of basic shapes for debugging purposes
 * @module debug_draw
 */

let kDrawNumCircleSides = 16;    // for approx circumference as line segments
let mUnitCirclePos = [];
let mLine = null;

/**
 * Initialize the LineRenderable and list of circle points for simple drawing
 * @export debug_draw
 */
function init() {
    mLine = new LineRenderable();
    mLine.setPointSize(5);  // make sure when shown, its visible
    let deltaTheta = (Math.PI * 2.0) / kDrawNumCircleSides;
    let theta = deltaTheta;
    let i, x, y;
    for (i = 1; i <= kDrawNumCircleSides; i++) {
        let x = Math.cos(theta);
        let y = Math.sin(theta);
        mUnitCirclePos.push([x, y]);
        theta = theta + deltaTheta;
    }
}

/**
 * Draws a LineRenderable from p1 to p2
 * @export debug_draw
 * @param {Camera} camera - the Camera to draw to
 * @param {vec2} p1 - the first X,Y world coordinate vertex
 * @param {vec2} p2 - the second X,Y world coordinate vertex
 * @param {boolean} drawVertex - true to draw the vertices
 * @param {vec4} color - [R,G,B,A] color array for the line
 */
function drawLine(camera, p1, p2, drawVertex, color) {
    mLine.setColor(color);
    mLine.setDrawVertices(drawVertex);
    mLine.setFirstVertex(p1[0], p1[1]);
    mLine.setSecondVertex(p2[0], p2[1]);
    mLine.draw(camera);
    mLine.setDrawVertices(false);
}

/**
 * Draw a series of lines that simulate a circle using kDrawNumCircleSides
 * @export debug_draw
 * @param {Camera} camera - the Camera to draw to
 * @param {vec2} pos - X,Y world coordinate position of the circle's center
 * @param {float} radius - the radius of the cirlce
 * @param {vec4} color - [R,G,B,A] color array for the circle
 */
function drawCircle(camera, pos, radius, color) {
    mLine.setColor(color);
    let prevPoint = vec2.clone(pos);
    prevPoint[0] += radius;
    let i, x, y;
    for (i = 1; i <= kDrawNumCircleSides; i++) {
        x = pos[0] + radius * mUnitCirclePos[i-1][0];
        y = pos[1] + radius * mUnitCirclePos[i-1][1];
        mLine.setFirstVertex(prevPoint[0], prevPoint[1]);
        mLine.setSecondVertex(x, y);
        mLine.draw(camera);
        prevPoint[0] = x;
        prevPoint[1] = y;
    }
}

/**
 * Draw a cross marker
 * @export debug_draw
 * @param {Camera} camera - the Camera to draw to
 * @param {vec2} p - X,Y world coordinate position of the cross's center
 * @param {float} size - the world coordinate radius of the cross
 * @param {vec4} color - [R,G,B,A] color array for the circle
 */
function drawCrossMarker(camera, p, size, color) {
    mLine.setColor(color);
    mLine.setFirstVertex(p[0] - size, p[1] + size); // TOP LEFT
    mLine.setSecondVertex(p[0] + size, p[1] - size);// BOTTOM RIGHT
    mLine.draw(camera);

    mLine.setFirstVertex(p[0] + size, p[1] + size); // TOP RIGHT
    mLine.setSecondVertex(p[0] - size, p[1] - size);// BOTTOM LEFT
    mLine.draw(camera);
}

// vertices: 0 to 3 of vec2
/**
 * Draw a rectangle frame
 * @export debug_draw
 * @param {Camera} camera - the Camera to draw to
 * @param {vec2[]} vertices - array with the four vec2(X,Y) world coordinate vertices of the rectangle
 * @param {vec4} color - [R,G,B,A] color array for the circle
 */
function drawRectangle(camera, vertices, color) {
    mLine.setColor(color);
    let i = 0;
    for (i = 0; i < 4; i++) {
        let j = (i + 1) % 4;
        mLine.setFirstVertex(vertices[i][0], vertices[i][1]);
        mLine.setSecondVertex(vertices[j][0], vertices[j][1]);
        mLine.draw(camera);
    }
}

export {
    init,
    drawLine, drawCrossMarker, drawCircle, drawRectangle
}