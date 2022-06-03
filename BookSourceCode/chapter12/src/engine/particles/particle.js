/* 
 * File: particle.js
 * Defines a particle
 */
"use strict";

import * as loop from "../core/loop.js";
import * as particleSystem from "../components/particle_system.js";
import ParticleRenderable from "../renderables/particle_renderable.js";
import * as debugDraw from "../core/debug_draw.js";

let kSizeFactor = 0.2;

class Particle {
    /**
     * @classdesc Defines a square particle that has physics support. The size and color of a particle can change over a set lifetime.
     * <p>Found in Chapter 10, page 649 of the textbook</p>
     * Examples: 
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter10/10.1.particles/index.html 10.1 Simple Particles},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter10/10.2.particle_collisions/index.html 10.2 Particle Collision},
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter10/10.3.particle_emitters/index.html 10.3 Particle Emitters}
     * 
     * 
     * @param {string} texture - path to the texture file for this Particle
     * @param {float} x - starting X world coordinate 
     * @param {float} y - starting Y world coordinate 
     * @param {integer} life - number of cycles this particle lives for
     * @returns {Particle} a new Particle instance
     */
    constructor(texture, x, y, life) {
        this.mRenderComponent = new ParticleRenderable(texture);
        this.setPosition(x, y);

        // position control
        this.mVelocity = vec2.fromValues(0, 0);
        this.mAcceleration = particleSystem.getSystemAcceleration();
        this.mDrag = 0.95;

        // Color control
        this.mDeltaColor = [0, 0, 0, 0];

        // Size control
        this.mSizeDelta = 0;

        // Life control
        this.mCyclesToLive = life;
    }

    /**
     * Draw a cross marker on this Particle for debugging
     * @method
     * @param {Camera} aCamera - the Camera to draw to
     */
    drawMarker(aCamera) {
        let size = this.getSize();
        debugDraw.drawCrossMarker(aCamera, this.getPosition(), size[0] * kSizeFactor, [0, 1, 0, 1]);
    }

    /**
     * Draw the ParticleRenderable of this Particle to the Camera
     * @method
     * @param {Camera} aCamera - the Camera to draw to
     */
    draw(aCamera) {
        this.mRenderComponent.draw(aCamera);
    }

    /**
     * Update the position, velocity, size, and color of this Particle
     * @method
     */
    update() {
        this.mCyclesToLive--;

        let dt = loop.getUpdateIntervalInSeconds();

        // Symplectic Euler
        //    v += a * dt
        //    x += v * dt
        let p = this.getPosition();
        vec2.scaleAndAdd(this.mVelocity, this.mVelocity, this.mAcceleration, dt);
        vec2.scale(this.mVelocity, this.mVelocity, this.mDrag);
        vec2.scaleAndAdd(p, p, this.mVelocity, dt);

        // update color
        let c = this.mRenderComponent.getColor();
        vec4.add(c, c, this.mDeltaColor);
    
        // update size
        let xf = this.mRenderComponent.getXform();
        let s = xf.getWidth() * this.mSizeDelta;
        xf.setSize(s, s);
    }

    /**
     * Set the final color for this Particle by changing the delta color accordingly
     * @method
     * @param {vec4} f - final target [R,G,B,A] color array 
     */
    setFinalColor = function(f) {    
        vec4.sub(this.mDeltaColor, f, this.getColor());
        if (this.mCyclesToLive !== 0) {
            vec4.scale(this.mDeltaColor, this.mDeltaColor, 1/this.mCyclesToLive);
        }
    }

    /**
     * Set the current color of this Particle
     * @method
     * @param {vec4} c - [R,G,B,A] color array
     */
    setColor(c) { this.mRenderComponent.setColor(c); }

    /**
     * Returns the current color of this particle
     * @method
     * @returns {vec4} [R,G,B,A] color array
     */
    getColor() { return this.mRenderComponent.getColor(); }

    /**
     * Returns whether the bounds are set to be drawn
     * @method
     * @returns {boolean} mDrawBounds - true if bounds are being drawn
     */
    getDrawBounds() { return this.mDrawBounds; }

    /**
     * Set whether the bounds of this Particle are drawn
     * @method
     * @param {boolean} d - true to draw bounds
     */
    setDrawBounds(d) { this.mDrawBounds = d; }

    /**
     * Returns the X,Y world coordinate position of this Particle
     * @method
     * @returns {vec2} current position vector
     */
    getPosition() { return this.mRenderComponent.getXform().getPosition(); }

    /**
     * Set the X,Y world coordinate position of this Particle
     * @method
     * @param {float} xPos - the new X position
     * @param {float} yPos - the new Y position
     */
    setPosition(xPos, yPos) { 
        this.mRenderComponent.getXform().setXPos(xPos); 
        this.mRenderComponent.getXform().setYPos(yPos); 
    }

    /**
     * Returns the current world coordinate size of this Particle
     * @method
     * @returns {float} the Particle's size
     */
    getSize() { return this.mRenderComponent.getXform().getSize(); }

    /**
     * Set the X and Y world coordinate size of this Particle
     * @method
     * @param {float} x - horizontal size
     * @param {float} y - vertical size
     */
    setSize(x, y) { this.mRenderComponent.getXform().setSize(x, y); }

    /**
     * Returns the X,Y world coordinate velocity vector of this Particle
     * @method
     * @returns {vec} mVelocity - velocity vector
     */
    getVelocity() { return this.mVelocity; }

    /**
     * Set the X,Y world coordinate velocity vector of this Particle
     * @method
     * @param {float} x - horizontal velocity 
     * @param {float} y - vertical velocity
     */
    setVelocity(x, y) { 
        this.mVelocity[0] = x;
        this.mVelocity[1] = y;
    }
    /**
     * Returns the X,Y world coordinate acceleration vector of this Particle
     * @method
     * @returns {vec2} mAcceleration - acceleration vector
     */
    getAcceleration() { return this.mAcceleration; }
    /**
     * Set the X,Y world coordinate acceleration vector of this Particle
     * @method
     * @param {float} x - horizontal acceleration
     * @param {float} y - vertical acceleration
     */
    setAcceleration(x, y) { 
        this.mAcceleration[0] = x;
        this.mAcceleration[1] = y;
    }

    /**
     * Set the velocity drag multiplier of this Particle
     * <p> On update calls the velocity is multiplied by this value</p>
     * @method
     * @param {float} d - drag multiplier value
     */
    setDrag(d) { this.mDrag = d; }
    /**
     * Returns the drag value of this Particle
     * @method
     * @returns {float} mDrag - drag value
     */
    getDrag() { return this.mDrag; }

    /**
     * Set the size changing factor
     * <p> On update calls the size is multiplied by this value</p>
     * @method
     * @param {float} d - multipier applied on every update
     */
    setSizeDelta(d) { this.mSizeDelta = d; }

    /**
     * Returns whether this Particle has reached the end of its lifetime
     * @method
     * @returns {boolean} true if lifetime has ended
     */
    hasExpired() { return (this.mCyclesToLive < 0); }
}

export default Particle;