"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Ball extends engine.GameObject {
    constructor(texture, x, y) {
        super(null);

        this.mRenderComponent = new engine.TextureRenderable(texture);
        this.mRenderComponent.setColor([1, 0, 0, 0]);
        this.mRenderComponent.getXform().setPosition(x, y);
        this.mRenderComponent.getXform().setSize(5, 5);

        this.setVisibility(true);

        this.bb = new engine.BoundingBox(
            [x, y],
            5,
            5
        );

        this.speedX = 0;
        this.speedY = 0;
        
    }

    update() {
        if (this.speedX > 1) {
            this.speedX = 1;
        }
        if (this.speedY > 1) {
            this.speedY = 1;
        }
        let xform = this.getXform();
        xform.incXPosBy(this.speedX);
        xform.incYPosBy(this.speedY);
        this.bb.setBounds(
            [xform.getXPos(), xform.getYPos()],
            5,
            5
        );
    }

    checkBounds(numPlayers) {
        let xform = this.getXform();
        if (xform.getXPos() <= 50 && xform.getXPos() >= -50 &&
            xform.getYPos() <= -50
        ) {
            
            if (numPlayers >= 1) {
                return 0;
            } else {
                this.reflect(false);
                // this.reset();
            }
        }
        if (xform.getXPos() <= 50 && xform.getXPos() >= -50 &&
            xform.getYPos() >= 50
        ) {
            // console.log("off the top");
            if (numPlayers >= 2) {
                return 1;
            } else {
                // console.log("reflect");
                this.reflect(false);
                // this.reset();
            }
        }
        if (xform.getYPos() <= 50 && xform.getYPos() >= -50 &&
            xform.getXPos() >= 50
        ) {
            
            if (numPlayers >= 3) {
                return 2;
            } else {
                this.reflect(true);
                // this.reset();
            }
        }
        if (xform.getYPos() <= 50 && xform.getYPos() >= -50 &&
            xform.getXPos() <= -50
        ) {
            
            if (numPlayers >= 4) {
                return 3;
            } else {
                this.reflect(true);
                // this.reset();
            }
        }
        return -1;
    }

    reflect(reflectX) {
        if (reflectX) {
            this.speedX = -this.speedX;
        } else {
            this.speedY = -this.speedY;
        }
    }

    setSpeed(x, y){
        this.speedX = x;
        this.speedY = y;
    }

    getSpeedX() {
        return this.speedX;
    }

    getSpeedY() {
        return this.speedY;
    }

    checkCollisionWithPlayer(other) {
        let xform = this.getXform();
        let otherBB = other.getBB();
        if (this.bb.intersectsBound(otherBB)) {
            this.speedX += other.getXMovement();
            if (this.speedX > 1) {
                this.speedX = 1;
            }
            this.speedY += other.getYMovement();
            if (this.speedY > 1) {
                this.speedY = 1;
            }
            if (other.isVertical()) {
                this.reflect(true);
            } else {
                this.reflect(false);
            }
            return other.getPlayerNum();
        }
        return -1;
    }

    reset(){
        this.mRenderComponent.getXform().setPosition(0, 0);
    }
}

export default Ball;