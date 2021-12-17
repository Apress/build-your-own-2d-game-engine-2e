/*
 * File: game_level_01.js 
 * This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// local
import SceneFileParser from "./util/scene_file_parser.js";
import Hero from "./objects/hero.js"

import GameLevel_02 from "./game_level_02.js";

class GameLevel_01 extends engine.Scene {
    constructor(level) {
        super();
        this.kHeroSprite = "assets/hero_sprite.png";
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kPlatform = "assets/platform.png";
        this.kPlatformNormal = "assets/platform_normal.png";
        this.kWall = "assets/wall.png";
        this.kWallNormal = "assets/wall_normal.png";
        this.kParticle = "assets/EMPPulse.png";
        this.kDoorTop = "assets/DoorInterior_Top.png";
        this.kDoorBot = "assets/DoorInterior_Bottom.png";
        this.kDoorSleeve = "assets/DoorFrame_AnimSheet.png";
        this.kButton = "assets/DoorFrame_Button_180x100.png";
        this.kProjectileTexture = "assets/EMPPulse.png";

        // specifics to the level
        this.kLevelFile = "assets/" + level + "/" + level + ".xml";  // e.g., assets/Level1/Level1.xml
        this.kBg = "assets/" + level + "/bg.png";
        this.kBgNormal = "assets/" + level + "/bg_normal.png";
        this.kBgLayer = "assets/" + level + "/bgLayer.png";
        this.kBgLayerNormal = "assets/" + level + "/bgLayer_normal.png";

        this.kLevelFinishedPosition = 65;

        // The camera to view the scene
        this.mCamera = null;
        this.mPeekCam = null;
        this.mShowPeek = false;

        this.mMsg = null;
        this.mMatMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mIllumHero = null;

        this.mGlobalLightSet = null;

        this.mThisLevel = level;
        this.mNextLevel = null;
        this.mRestart = false;

        this.mLgtIndex = 2;
        this.mLgtRotateTheta = 0;

        this.mAllWalls = new engine.GameObjectSet();
        this.mAllPlatforms = new engine.GameObjectSet();
        this.mAllButtons = new engine.GameObjectSet();
        this.mAllDoors = new engine.GameObjectSet();
        this.mAllMinions = new engine.GameObjectSet();
        this.mAllParticles = new engine.ParticleSet();
    }

    load() {
        engine.xml.load(this.kLevelFile);
        engine.texture.load(this.kHeroSprite);
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kPlatform);
        engine.texture.load(this.kPlatformNormal);
        engine.texture.load(this.kWall);
        engine.texture.load(this.kWallNormal);
        engine.texture.load(this.kParticle);
        engine.texture.load(this.kDoorTop);
        engine.texture.load(this.kDoorBot);
        engine.texture.load(this.kDoorSleeve);
        engine.texture.load(this.kButton);
        engine.texture.load(this.kProjectileTexture);

        engine.texture.load(this.kBg);
        engine.texture.load(this.kBgNormal);
        engine.texture.load(this.kBgLayer);
        engine.texture.load(this.kBgLayerNormal);
    }

    unload() {
        engine.layer.cleanUp();

        engine.xml.unload(this.kLevelFile);
        engine.texture.unload(this.kHeroSprite);
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kPlatform);
        engine.texture.unload(this.kPlatformNormal);
        engine.texture.unload(this.kWall);
        engine.texture.unload(this.kWallNormal);
        engine.texture.unload(this.kParticle);
        engine.texture.unload(this.kDoorTop);
        engine.texture.unload(this.kDoorBot);
        engine.texture.unload(this.kDoorSleeve);
        engine.texture.unload(this.kButton);
        engine.texture.unload(this.kProjectileTexture);

        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kBgNormal);
        engine.texture.unload(this.kBgLayer);
        engine.texture.unload(this.kBgLayerNormal);
    }

    init() {
        // set ambient lighting
        engine.defaultResources.setGlobalAmbientColor([1, 1, 1, 1]);
        engine.defaultResources.setGlobalAmbientIntensity(0.2);

        // parse the entire scene
        let parser = new SceneFileParser(this.kLevelFile);
        this.mCamera = parser.parseCamera();
        this.mGlobalLightSet = parser.parseLights();

        let m = parser.parseMinions(this.kMinionSprite, null, this.mGlobalLightSet);
        let i;
        for (i = 0; i < m.length; i++) {
            this.mAllMinions.addToSet(m[i]);
        }
        // parse background, needs the camera as a reference for parallax
        parser.parseBackground(this.mThisLevel, this.mCamera, this.mGlobalLightSet);

        let w = parser.parseWall(this.kWall, this.kWallNormal, this.mGlobalLightSet);
        for (i = 0; i < w.length; i++) {
            this.mAllWalls.addToSet(w[i]);
        }

        let p = parser.parsePlatform(this.kPlatform, this.kPlatformNormal, this.mGlobalLightSet);
        for (i = 0; i < p.length; i++) {
            this.mAllPlatforms.addToSet(p[i]);
        }

        let d = parser.parseDoors(this.kDoorTop, this.kDoorBot, this.kDoorSleeve, this.mGlobalLightSet);
        for (i = 0; i < d.length; i++) {
            this.mAllDoors.addToSet(d[i]);
        }

        let b = parser.parseButtons(this.kButton, this.mGlobalLightSet);
        for (i = 0; i < b.length; i++) {
            this.mAllButtons.addToSet(b[i]);
        }

        // parsing of actors can only begin after background has been parsed
        // to ensure proper support shadow
        // for now here is the hero
        this.mIllumHero = new Hero(this.kHeroSprite, null, 2, 6, this.mGlobalLightSet);

        this.mNextLevel = parser.parseNextLevel();


        // Add hero into the layer manager and as shadow caster
        // Hero should be added into Actor layer last
        // Hero can only be added as shadow caster after background is created
        engine.layer.addToLayer(engine.layer.eActors, this.mIllumHero);
        engine.layer.addAsShadowCaster(this.mIllumHero);

        this.mPeekCam = new engine.Camera(
            vec2.fromValues(0, 0),
            64,
            [0, 0, 320, 180],
            2
        );
        this.mShowPeek = false;
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();
        engine.layer.drawAllLayers(this.mCamera);

        this.mAllParticles.draw(this.mCamera);

        if (this.mShowPeek) {
            this.mPeekCam.setViewAndCameraMatrix();
            engine.layer.drawAllLayers(this.mPeekCam);
        }
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.mCamera.update();  // to ensure proper interpolated movement effects
        engine.layer.updateAllLayers();

        let xf = this.mIllumHero.getXform();
        this.mCamera.setWCCenter(xf.getXPos(), 8);
        let p = vec2.clone(xf.getPosition());
        //p[0] -= 8;
        this.mGlobalLightSet.getLightAt(this.mLgtIndex).set2DPosition(p);


        if (this.mShowPeek) {
            this.mPeekCam.setWCCenter(p[0], p[1]);
            this.mPeekCam.update();
        }
        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.mShowPeek = !this.mShowPeek;
        }
        if (engine.input.isKeyClicked(engine.input.keys.L)) {
            this.next();
        }

        let onPlatform = false;
        let touchMinion = false;

        // physics simulation
        this._physicsSimulation(onPlatform, touchMinion);

        let i;
        let collided = false;
        let collisionInfo = new engine.CollisionInfo();
        for (i = 0; i < this.mAllPlatforms.size(); i++) {
            let platBox = this.mAllPlatforms.getObjectAt(i).getRigidBody();
            collided = this.mIllumHero.getJumpBox().collisionTest(platBox, collisionInfo);
            if (collided) {
                this.mIllumHero.canJump(true);
                break;
            }
        }

        for (i = 0; i < this.mAllMinions.size(); i++) {
            let minionBox = this.mAllMinions.getObjectAt(i).getRigidBody();
            collided = this.mIllumHero.getRigidBody().collisionTest(minionBox, collisionInfo);
            if (collided) {
                this.mRestart = true;
                // this.next();
            }
        }

        let j;
        for (i = 0; i < this.mAllMinions.size(); i++) {
            let p = this.mAllMinions.getObjectAt(i).getProjectiles();
            collided = engine.particleSystem.resolveRigidShapeCollision(this.mIllumHero, p);
                if (collided) {
                    this.mRestart = true;
                    // this.next();
                }
            
        }

        for (i = 0; i < this.mAllButtons.size(); i++) {
            let buttonBox = this.mAllButtons.getObjectAt(i).getRigidBody();
            collided = this.mIllumHero.getRigidBody().collisionTest(buttonBox, collisionInfo);
            if (collided) {
                this.mAllButtons.getObjectAt(i).pressButton();
            }
        }

        let allUnlocked = false;
        for (i = 0; i < this.mAllButtons.size(); i++) {
            if (this.mAllButtons.getObjectAt(i).getButtonState() === true) {
                allUnlocked = true;
            } else {
                allUnlocked = false;
                break;
            }
        }

        if (allUnlocked) {
            this.mAllDoors.getObjectAt(0).unlockDoor();
        }

        if (this.mIllumHero.getXform().getXPos() > this.kLevelFinishedPosition) {
            this.mRestart = false;
            this.next();
        }
    }

    _physicsSimulation(onPlatform, touchMinion) {
        // Hero platform
        engine.physics.processObjToSet(this.mIllumHero, this.mAllPlatforms);
        engine.physics.processObjToSet(this.mIllumHero, this.mAllWalls);
        engine.physics.processObjToSet(this.mIllumHero, this.mAllDoors);

        // Minion platform
        engine.physics.processSetToSet(this.mAllMinions, this.mAllPlatforms);

    }

    next() {
        super.next();

        if (this.mRestart === true) {
            let nextLevel = new GameLevel_01("Level1");  // next level to be loaded
            nextLevel.start();
        } else {
            let nextLevel = new GameLevel_02(this.mNextLevel);  // next level to be loaded
            nextLevel.start();
        }
    }
}

export default GameLevel_01;
