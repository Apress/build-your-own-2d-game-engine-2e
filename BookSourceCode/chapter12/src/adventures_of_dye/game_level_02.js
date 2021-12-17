"use strict";

import engine from "../engine/index.js";

import SceneFileParser from "./util/scene_file_parser.js";
import Hero from "./objects/hero.js"

class GameLevel_02 extends engine.Scene {
    constructor(level) {
        super();
        this.kHeroSprite = "assets/hero_sprite.png";
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kPlatform = "assets/platform.png";
        this.kPlatformNormal = "assets/platform_normal.png";
        this.kWall = "assets/wall.png";
        this.kWallNormal = "assets/wall_normal.png";

        // specifics to the level
        this.kLevelFile = "assets/" + level + "/" + level + ".xml";  // e.g., assets/Level1/Level1.xml
        this.kBg = "assets/" + level + "/bg.png";
        this.kBgNormal = "assets/" + level + "/bg_normal.png";
        this.kBgLayer = "assets/" + level + "/bgLayer.png";
        this.kBgLayerNormal = "assets/" + level + "/bgLayer_normal.png";

        this.kDyeBoss_Bottom = "assets/" + level + "/DyeBoss_Bottom.png";
        this.kDyeBoss_Top = "assets/" + level + "/DyeBoss_Top.png";
        this.kDyeBoss_CenterSpawn = "assets/" + level + "/DyeBoss_CenterSpawn.png";
        this.kDyeBoss_Eyeballs = "assets/" + level + "/DyeBoss_Eyeballs.png";
        this.kDyeBoss_WeakPoint_Blue = "assets/" + level + "/DyeBoss_WeakPoint_Blue.png";
        this.kDyeBoss_WeakPoint_Green = "assets/" + level + "/DyeBoss_WeakPoint_Green.png";
        this.kDyeBoss_WeakPoint_Red = "assets/" + level + "/DyeBoss_WeakPoint_Red.png";


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

        this.mLgtIndex = 2;
        this.mLgtRotateTheta = 0;

        this.mAllPlatforms = new engine.GameObjectSet();
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

        engine.texture.load(this.kBg);
        engine.texture.load(this.kBgNormal);
        engine.texture.load(this.kBgLayer);
        engine.texture.load(this.kBgLayerNormal);

        engine.texture.load(this.kDyeBoss_Bottom);
        engine.texture.load(this.kDyeBoss_Top);
        engine.texture.load(this.kDyeBoss_CenterSpawn);
        engine.texture.load(this.kDyeBoss_Eyeballs);
        engine.texture.load(this.kDyeBoss_WeakPoint_Blue);
        engine.texture.load(this.kDyeBoss_WeakPoint_Green);
        engine.texture.load(this.kDyeBoss_WeakPoint_Red);
    }

    unload() {
        engine.LayerManager.cleanUp();

        engine.xml.unload(this.kLevelFile);
        engine.texture.unload(this.kHeroSprite);
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kPlatform);
        engine.texture.unload(this.kPlatformNormal);
        engine.texture.unload(this.kWall);
        engine.texture.unload(this.kWallNormal);

        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kBgNormal);
        engine.texture.unload(this.kBgLayer);
        engine.texture.unload(this.kBgLayerNormal);

        engine.texture.unload(this.kDyeBoss_Bottom);
        engine.texture.unload(this.kDyeBoss_Top);
        engine.texture.unload(this.kDyeBoss_CenterSpawn);
        engine.texture.unload(this.kDyeBoss_Eyeballs);
        engine.texture.unload(this.kDyeBoss_WeakPoint_Blue);
        engine.texture.unload(this.kDyeBoss_WeakPoint_Green);
        engine.texture.unload(this.kDyeBoss_WeakPoint_Red);
    }

    init() {
        // set ambient lighting
        engine.defaultResources.setGlobalAmbientColor([1, 1, 1, 1]);
        engine.defaultResources.setGlobalAmbientIntensity(0.2);

        // parse the entire scene
        let parser = new SceneFileParser(this.kLevelFile);
        this.mCamera = parser.parseCamera();
        this.mGlobalLightSet = parser.parseLights();

        // parse background, needs the camera as a reference for parallax
        parser.parseBackground(this.mThisLevel, this.mCamera, this.mGlobalLightSet);

        parser.parseWall(this.kWall, this.kWallNormal, this.mGlobalLightSet);
        let p = parser.parsePlatform(this.kPlatform, this.kPlatformNormal, this.mGlobalLightSet);
        let i;
        for (i = 0; i < p.length; i++) {
            this.mAllPlatforms.addToSet(p[i]);
        }

        // parsing of actors can only begin after background has been parsed
        // to ensure proper support shadow
        // for now here is the hero
        this.mIllumHero = new Hero(this.kHeroSprite, null, 2, 6, this.mGlobalLightSet);

        let b = parser.parseBoss(this.kDyeBoss_Bottom, this.kDyeBoss_Top, this.kDyeBoss_CenterSpawn,
            this.kDyeBoss_Eyeballs, this.kDyeBoss_WeakPoint_Blue, this.kDyeBoss_WeakPoint_Green,
            this.kDyeBoss_WeakPoint_Red, null, this.mGlobalLightSet, this.mIllumHero);

        this.mNextLevel = parser.parseNextLevel();

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(-9.5, 4);
        this.mMsg.setTextHeight(0.7);

        this.mMatMsg = new engine.FontRenderable("Status Message");
        this.mMatMsg.setColor([1, 1, 1, 1]);
        this.mMatMsg.getXform().setPosition(-9.5, 20);
        this.mMatMsg.setTextHeight(0.7);
        engine.layer.addToLayer(engine.layer.eFront, this.mMsg);
        engine.layer.addToLayer(engine.layer.eFront, this.mMatMsg);

        // Add hero into the layer manager and as shadow caster
        // Hero should be added into Actor layer last
        // Hero can only be added as shadow caster after background is created
        engine.layer.addToLayer(engine.layer.eActors, this.mIllumHero);
        engine.layer.addAsShadowCaster(this.mIllumHero);


        this.mSlectedCh = this.mIllumHero;
        // this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
        this.mSelectedChMsg = "";

        this.mPeekCam = new engine.Camera(
            vec2.fromValues(0, 0),
            120,
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
        this.mAllParticles.update(this.mAllParticles);
        engine.layer.updateAllLayers();

        let xf = this.mIllumHero.getXform();
        this.mCamera.setWCCenter(xf.getXPos(), 8);
        let p = vec2.clone(xf.getPosition());
        this.mGlobalLightSet.getLightAt(this.mLgtIndex).set2DPosition(p);

        this.mMatMsg.setText("P: to peek the entire level; L: to change level to: " + this.mNextLevel);

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

        // physics simulation
        this._physicsSimulation();

        let platBox;
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



    }

    _physicsSimulation() {
        // Hero platform
        engine.physics.processObjToSet(this.mIllumHero, this.mAllPlatforms);

        // Minion platform
        engine.physics.processSetToSet(this.mAllMinions, this.mAllPlatforms);
    }

    next() {
        super.next();
        let nextLevel = new GameLevel_02(this.mNextLevel);  // next level to be loaded
        nextLevel.start();
    }
}

export default GameLevel_02;