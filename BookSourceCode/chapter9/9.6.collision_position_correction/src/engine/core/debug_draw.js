/*
 * File: debug_draw.js
 * Support drawing of basic shapes for debugging purposes
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import LineRenderable from "../renderables/line_renderable.js";

let kDrawNumCircleSides = 16;    // for approx circumference as line segments
let mUnitCirclePos = [];
let mLine = null;

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

function drawLine(camera, p1, p2, drawVertex, color) {
    mLine.setColor(color);
    mLine.setDrawVertices(drawVertex);
    mLine.setFirstVertex(p1[0], p1[1]);
    mLine.setSecondVertex(p2[0], p2[1]);
    mLine.draw(camera);
    mLine.setDrawVertices(false);
}

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