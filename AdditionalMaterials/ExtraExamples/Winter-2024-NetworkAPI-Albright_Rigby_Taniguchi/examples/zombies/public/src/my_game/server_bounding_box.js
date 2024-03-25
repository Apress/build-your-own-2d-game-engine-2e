// CSS 452, Winter 2024
// Team 1: Networked Multiplayer API
// Members: Ethan, Drew, Matt

const eBoundCollideStatus = Object.freeze({
    eCollideLeft: 1,
    eCollideRight: 2,
    eCollideTop: 4,
    eCollideBottom: 8,
    eInside: 16,
    eOutside: 0
});

// server-side bounding box
// the gl-matrix version used in the engine does not work on node.js
class ServerBoundingBox {
    constructor(centerPos, w, h) {
        this.mLL = []
        this.setBounds(centerPos, w, h);
        this.mCenter = centerPos;
    }

    setBounds(centerPos, w, h) {
        this.mWidth = w;
        this.mHeight = h;
        this.mLL = [centerPos[0] - w / 2, centerPos[1] - h / 2];
        this.mCenter = centerPos;
    }

    getBounds(){
        return [this.mWidth, this.mHeight];
    }

    getCenter() {
        return this.mCenter;
    }

    containsPoint(x, y) {
        return (x > this.minX()) && (x < this.maxX()) &&
            (y > this.minY()) && (y < this.maxY());
    }

    intersectsBound(otherBound) {
        return (this.minX() < otherBound.maxX()) &&
            (this.maxX() > otherBound.minX()) &&
            (this.minY() < otherBound.maxY()) &&
            (this.maxY() > otherBound.minY());
    }

    boundCollideStatus(otherBound) {
        let status = eBoundCollideStatus.eOutside;

        if (this.intersectsBound(otherBound)) {
            if (otherBound.minX() < this.minX()) {
                status |= eBoundCollideStatus.eCollideLeft;
            }
            if (otherBound.maxX() > this.maxX()) {
                status |= eBoundCollideStatus.eCollideRight;
            }
            if (otherBound.minY() < this.minY()) {
                status |= eBoundCollideStatus.eCollideBottom;
            }
            if (otherBound.maxY() > this.maxY()) {
                status |= eBoundCollideStatus.eCollideTop;
            }

            if (status === eBoundCollideStatus.eOutside) {
                status = eBoundCollideStatus.eInside;
            }
        }
        return status;
    }

    minX() { return this.mLL[0]; }
    maxX() { return this.mLL[0] + this.mWidth; }
    minY() { return this.mLL[1]; }
    maxY() { return this.mLL[1] + this.mHeight; }

    exportState() {
        return {
            lowerLeft: this.mLL,
            width: this.mWidth,
            height: this.mHeight
        }
    }
    setState(update) {
        this.mLL = update.mLL;
        this.mWidth = update.width;
        this.mHeight = update.height;
    }
}

export { ServerBoundingBox }