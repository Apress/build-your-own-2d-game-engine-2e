/*
 * File: particle_system.js 
 * Particle System support
 */
"use strict";
import Transform from "../utils/transform.js";
import RigidCircle from "../rigid_shapes/rigid_circle.js";
import CollisionInfo from "../rigid_shapes/collision_info.js";

  // Operate in Strict mode such that variables must be declared before used!
  /**
   * Particle physics support for velocity, acceleration, and collision of particles with RigidShapes
   * <p>Found in Chapter 10, page 648 of the textbook </p>
   * Examples:
   * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter10/10.1.particles/index.html 10.1 Particles}, 
   * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter10/10.2.particle_collisions/index.html 10.2 Particles Colliding with Rigid Shapes},
   * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter10/10.3.particle_emitters/index.html 10.3 Particle Emitters}
   * 
   * 
   * @module particle_system
   */

let mXform = null;  // for collision with rigid shapes
let mCircleCollider = null;
let mCollisionInfo = null;
let mFrom1to2 = [0, 0];
/**
 * Initialize the Transform, RigidCircle, and CollisionInfo for the particle system
 * @static
 */
function init() {
    mXform = new Transform();
    mCircleCollider = new RigidCircle(mXform, 1.0);
    mCollisionInfo = new CollisionInfo();
}

let mSystemAcceleration = [0, -50.0];   
/**
 * Returns the acceleration vector for the system
 * @static
 * @returns {vec2} the system acceleration
 */
function getSystemAcceleration() { return vec2.clone(mSystemAcceleration); }

/**
 * Set the particle system acceleration
 * @static
 * @param {float} x - the acceleration in the x direction
 * @param {float} y - the acceleration in the y direction
 */
function setSystemAcceleration(x, y) {
    mSystemAcceleration[0] = x;
    mSystemAcceleration[1] = y;
}


function resolveCirclePos(circShape, particle) {
    let collision = false;
    let pos = particle.getPosition();
    let cPos = circShape.getCenter();
    vec2.subtract(mFrom1to2, pos, cPos);
    let dist = vec2.length(mFrom1to2);
    if (dist < circShape.getRadius()) {
        vec2.scale(mFrom1to2, mFrom1to2, 1/dist);
        vec2.scaleAndAdd(pos, cPos, mFrom1to2, circShape.getRadius());
        collision = true;
    }
    return collision;
}

function resolveRectPos(rectShape, particle) {
    let collision = false;
    let s = particle.getSize();
    let p = particle.getPosition();
    mXform.setSize(s[0], s[1]); // referred by mCircleCollision
    mXform.setPosition(p[0], p[1]);  
    if (mCircleCollider.boundTest(rectShape)) {
        if (rectShape.collisionTest(mCircleCollider, mCollisionInfo)) {
            // make sure info is always from rect towards particle
            vec2.subtract(mFrom1to2, mCircleCollider.getCenter(), rectShape.getCenter());
            if (vec2.dot(mFrom1to2, mCollisionInfo.getNormal()) < 0)
                mCircleCollider.adjustPositionBy(mCollisionInfo.getNormal(), -mCollisionInfo.getDepth());
            else
                mCircleCollider.adjustPositionBy(mCollisionInfo.getNormal(), mCollisionInfo.getDepth());
            p = mXform.getPosition();
            particle.setPosition(p[0], p[1]);
            collision = true;
        }
    }
    return collision;
}

// obj: a GameObject (with potential mRigidBody)
// pSet: set of particles (ParticleSet)
/**
 * Resolve collisions between a GameObject and each Particle within a ParticleSet
 * @static
 * @param {GameObject} obj - the GameObject to collide against
 * @param {ParticleSet} pSet - the ParticleSet to collide with
 * @returns {boolean} true if a collision occured for 
 */
function resolveRigidShapeCollision(obj, pSet) {
    let j;
    let collision = false;

    let rigidShape = obj.getRigidBody();
    for (j = 0; j < pSet.size(); j++) {
        if (rigidShape.getType() == "RigidRectangle")
            collision = resolveRectPos(rigidShape, pSet.getObjectAt(j)) || collision;
        else if (rigidShape.getType() == "RigidCircle")
            collision = resolveCirclePos(rigidShape, pSet.getObjectAt(j)) || collision;
    }

    return collision;
}


// objSet: set of GameObjects (with potential mRigidBody)
// pSet: set of particles (ParticleSet)
/**
 * Resolve collisions between each GameObject in a GameObjectSet and each Particle within a ParticleSet
 * @static
 * @param {GameObjectSet} objSet - the GameObjectSet to collide against
 * @param {ParticleSet} pSet - the ParticleSet to collide with
 * @returns {boolean} true if a collision occured
 */
function resolveRigidShapeSetCollision(objSet, pSet) {
    let i, j;
    let collision = false;
    if ((objSet.size === 0) || (pSet.size === 0))
        return false;
    for (i=0; i<objSet.size(); i++) {
        let rigidShape = objSet.getObjectAt(i).getRigidBody();
        for (j = 0; j<pSet.size(); j++) {
            if (rigidShape.getType() == "RigidRectangle")
                collision = resolveRectPos(rigidShape, pSet.getObjectAt(j)) || collision;
            else if (rigidShape.getType() == "RigidCircle")
                    collision = resolveCirclePos(rigidShape, pSet.getObjectAt(j)) || collision;
        }
    }
    return collision;
}

export {init,
        getSystemAcceleration, setSystemAcceleration, 
        resolveRigidShapeCollision, resolveRigidShapeSetCollision}