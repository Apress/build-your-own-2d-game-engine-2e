/*
 * File: Material.js
 * Simple Phong illumination model material: Ka, Kd, KS, and Shininess.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

class Material {
    /**
     * @classdesc Simple Phong illumination model material: Ka, Kd, Ks, and Shininess
     * <p>Found in Chapter 8, page 465 of the textbook</p>
     * Example:
     * {@link https://mylesacd.github.io/build-your-own-2d-game-engine-2e-doc/BookSourceCode/chapter8/8.5.material_and_specularity/index.html 8.5 Materials and Specularity}
     * 
     * @constructor
     * @returns {Material} a new Material instance
     */
    constructor() {
        this.mKa = vec4.fromValues(0.0, 0.0, 0.0, 0);
        this.mKs = vec4.fromValues(0.2, 0.2, 0.2, 1);
        this.mKd = vec4.fromValues(1.0, 1.0, 1.0, 1);
        this.mShininess = 20;
    }

    /**
     * Set the ambient light coefficient vector for this Material
     * @method
     * @param {vec4} a - new ambient light coefficient vector
     */
    setAmbient(a) { this.mKa = vec4.clone(a); }
    /**
     * Returns the ambient light coefficient vector for this Material
     * @method
     * @returns {vec4} mKa - ambient light coefficient vector
     */
    getAmbient() { return this.mKa; }

    /**
     * Set the light diffusion coefficient vector for this Material
     * @method
     * @param {vec4} d - new light diffusion coefficient vector
     */
    setDiffuse(d) { this.mKd = vec4.clone(d); }
    /**
     * Returns the light diffusion coefficient vector for this Material
     * @method
     * @returns {vec4} mKd - light diffusion coefficient vector
     */
    getDiffuse() { return this.mKd; }

    /**
     * Set the specular reflection coefficient vector for this Material
     * @method
     * @param {vec4} s - new specular reflection coefficient vector
     */
    setSpecular(s) { this.mKs = vec4.clone(s); }
     /**
     * Returns the specular reflection coefficient vector for this Material
     * @method
     * @returns {vec4} mKs - specular reflection coefficient vector
     */
    getSpecular() { return this.mKs; }

    /**
     * Set the shininess coefficient vector for this Material
     * @method
     * @param {vec4} s - new shininess coefficient vector
     */
    setShininess(s) { this.mShininess = s; }

    /**
     * Returns the shininess coefficient vector for this Material
     * @method
     * @returns {vec4} mShininess - shininess coefficient vector
     */
    getShininess() { return this.mShininess; }
}

export default Material;