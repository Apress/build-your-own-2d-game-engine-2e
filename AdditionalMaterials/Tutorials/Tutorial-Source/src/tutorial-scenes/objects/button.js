import engine from "../../engine/index.js";

const kWidth = 2.25;
const kHeight = 2;

class Button extends engine.GameObject {
    constructor(cx, cy, texture, type, lightSet) {
        super(null);
        this.mIsUnlocked = false;
        this.mButton = new engine.LightRenderable(texture);
        this.mRenderComponent = this.mButton;

        let i;
        for (i = 2; i < lightSet.numLights(); i++) {
            this.mButton.addLight(lightSet.getLightAt(i));
        }

        this.buildSprite(cx, cy);

        let rigidShape = new engine.RigidRectangle(this.getXform(), kWidth, kHeight);
        rigidShape.setMass(0);  // ensures no movements!
        rigidShape.toggleDrawBound();
        this.setRigidBody(rigidShape);
    }


    buildSprite(atX, atY) {
        this.mButton.getXform().setPosition(atX, atY);
        this.mButton.getXform().setSize(kWidth, kHeight);
        this.mButton.getXform().setZPos(2);
        this.mButton.setElementPixelPositions(0, 180, 0, 155);
    }

    pressButton() {
        this.mButton.setElementPixelPositions(180, 360, 0, 155);
        this.mIsUnlocked = true;
    }

    getButtonState() {
        return this.mIsUnlocked;
    }
}

export default Button;