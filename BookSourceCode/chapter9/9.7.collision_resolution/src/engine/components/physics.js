/*
 * File: physics.js
 *  
 * core of the physics component
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import CollisionInfo from "../rigid_shapes/collision_info.js";

let mSystemAcceleration = [0, -20];        // system-wide default acceleration
let mPosCorrectionRate = 0.8;               // percentage of separation to project objects
let mRelaxationCount = 15;                  // number of relaxation iterations

let mCorrectPosition = true;
let mHasMotion = true;

// getters and setters
function getSystemAcceleration() { return vec2.clone(mSystemAcceleration); }
function setSystemAcceleration(x, y) {
    mSystemAcceleration[0] = x;
    mSystemAcceleration[1] = y;
}

function getPositionalCorrection() { return mCorrectPosition; }
function togglePositionalCorrection() { mCorrectPosition = !mCorrectPosition; }

function getHasMotion() { return mHasMotion; }
function toggleHasMotion() { mHasMotion = !mHasMotion; }

function getRelaxationCount() { return mRelaxationCount; }
function incRelaxationCount(dc) { mRelaxationCount += dc; }

let mS1toS2 = [0, 0];
let mCInfo = new CollisionInfo();

function positionalCorrection(s1, s2, collisionInfo) {
    if (!mCorrectPosition)
        return;

    let s1InvMass = s1.getInvMass();
    let s2InvMass = s2.getInvMass();

    let num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * mPosCorrectionRate;
    let correctionAmount = [0, 0];
    vec2.scale(correctionAmount, collisionInfo.getNormal(), num);
    s1.adjustPositionBy(correctionAmount, -s1InvMass);
    s2.adjustPositionBy(correctionAmount, s2InvMass);
}

function resolveCollision(b, a, collisionInfo) {
    let n = collisionInfo.getNormal();

    // Step A: Compute relative velocity
    let va = a.getVelocity();
    let vb = b.getVelocity();
    let relativeVelocity = [0, 0];
    vec2.subtract(relativeVelocity, va, vb);

    // Step B: Determine relative velocity in normal direction
    let rVelocityInNormal = vec2.dot(relativeVelocity, n);

    // if objects moving apart ignore
    if (rVelocityInNormal > 0) {
        return;
    }

    // Step C: Compute collision tangent direction
    let tangent = [0, 0];
    vec2.scale(tangent, n, rVelocityInNormal);
    vec2.subtract(tangent, tangent, relativeVelocity);
    vec2.normalize(tangent, tangent);
    // Relative velocity in tangent direction
    let rVelocityInTangent = vec2.dot(relativeVelocity, tangent);

    // Step D: Determine the effective coefficients    
    let newRestituion = (a.getRestitution() + b.getRestitution()) * 0.5;
    let newFriction = 1 - ((a.getFriction() + b.getFriction()) * 0.5);

    // Step E: Impulse in the normal and tangent directions
    let jN = -(1 + newRestituion) * rVelocityInNormal;
    jN = jN / (a.getInvMass() + b.getInvMass());

    let jT = (newFriction - 1) * rVelocityInTangent;
    jT = jT / (a.getInvMass() + b.getInvMass());

    // Step F: Update velocity in both normal and tangent directions
    vec2.scaleAndAdd(va, va, n, (jN * a.getInvMass()));
    vec2.scaleAndAdd(va, va, tangent, (jT * a.getInvMass()));

    vec2.scaleAndAdd(vb, vb, n, -(jN * b.getInvMass()));
    vec2.scaleAndAdd(vb, vb, tangent, -(jT * b.getInvMass()));
}

// collide two rigid shapes
function collideShape(s1, s2, infoSet = null) {
    let hasCollision = false;
    if ((s1 !== s2) && ((s1.getInvMass() !== 0) || (s2.getInvMass() !== 0))) {
        if (s1.boundTest(s2)) {
            hasCollision = s1.collisionTest(s2, mCInfo);
            if (hasCollision) {
                // make sure mCInfo is always from s1 towards s2
                vec2.subtract(mS1toS2, s2.getCenter(), s1.getCenter());
                if (vec2.dot(mS1toS2, mCInfo.getNormal()) < 0)
                    mCInfo.changeDir();
                positionalCorrection(s1, s2, mCInfo);
                resolveCollision(s1, s2, mCInfo);
                // for showing off collision mCInfo!
                if (infoSet !== null) {
                    infoSet.push(mCInfo);
                    mCInfo = new CollisionInfo();
                }
            }
        }
    }
    return hasCollision;
}

// collide a given GameObject with a GameObjectSet
function processObjToSet(obj, set, infoSet = null) {
    let j = 0, r = 0;
    let hasCollision = false;
    let s1 = obj.getRigidBody();
    for (r = 0; r < mRelaxationCount; r++) {
        for (j = 0; j < set.size(); j++) {
            let s2 = set.getObjectAt(j).getRigidBody();
            hasCollision = collideShape(s1, s2, infoSet) || hasCollision;
        }
    }
    return hasCollision;
}

// collide between all objects in two different GameObjectSets
function processSetToSet(set1, set2, infoSet = null) {
    let i = 0, j = 0, r = 0;
    let hasCollision = false;
    for (r = 0; r < mRelaxationCount; r++) {
        for (i = 0; i < set1.size(); i++) {
            let s1 = set1.getObjectAt(i).getRigidBody();
            for (j = 0; j < set2.size(); j++) {
                let s2 = set2.getObjectAt(j).getRigidBody();
                hasCollision = collideShape(s1, s2, infoSet) || hasCollision;
            }
        }
    }
    return hasCollision;
}

// collide all objects in the GameObjectSet with themselves
function processSet(set, infoSet = null) {
    let i = 0, j = 0, r = 0;
    let hasCollision = false;
    for (r = 0; r < mRelaxationCount; r++) {
        for (i = 0; i < set.size(); i++) {
            let s1 = set.getObjectAt(i).getRigidBody();
            for (j = i + 1; j < set.size(); j++) {
                let s2 = set.getObjectAt(j).getRigidBody();
                hasCollision = collideShape(s1, s2, infoSet) || hasCollision;
            }
        }
    }
    return hasCollision;
}

export {
    // Physics system attributes
    getSystemAcceleration, setSystemAcceleration,


    togglePositionalCorrection,
    getPositionalCorrection,

    getRelaxationCount,
    incRelaxationCount,

    getHasMotion,
    toggleHasMotion,

    // collide and response two shapes 
    collideShape,

    // Collide
    processSet, processObjToSet, processSetToSet
}