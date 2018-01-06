import { GmapCoordinate } from './gmap-coordinate';
import { GmapShape } from './gmap-shape';

/**
 * Wrapper class for google.maps.Circle.
 */
export class GmapCircle extends GmapShape implements IGmapShape {

    /**
     * Radius of the circle in meters.
     */
    public radius: number;

    /**
     * Instantiates the circle, sets the area, sets the center, sets north, east, south, and west, sets the radius, and sets the bounds.
     * @param circle
     */
    constructor(public circle: google.maps.Circle) {
        super();
        this.shapeType = GmapCircle.name;
        this.setRadius();
        this.setArea();
        this.setCenter();
        this.setBounds();
        this.setNESW();
    }

    /**
     * Sets the area of the circle in meters squared.
     */
    setArea() {
        this.area = Math.PI * Math.pow(this.radius, 2);
    }

    /**
     * Sets the bounds of this circle.
     */
    setBounds() {
        this.bounds = this.circle.getBounds();
    }

    /**
     * Sets the center from the google maps object. Abstracts cluttered class to our minimial class.
     */
    setCenter() {
        // abstract away from their cluttered objects and use our minimal custom objects
        const circleCenter = this.circle.getCenter();
        this.center = new GmapCoordinate(circleCenter.lat(), circleCenter.lng());
    }

    /**
     * Sets North, East, South and West from the google maps object. Abstracts cluttered class to our minimal class.
     */
    setNESW() {
        // get google maps ne and sw
        const ne = this.bounds.getNorthEast();
        const sw = this.bounds.getSouthWest();

        // abstract away from their cluttered objects and use our minimal custom objects
        this.ne = new GmapCoordinate(ne.lat(), ne.lng());
        this.sw = new GmapCoordinate(sw.lat(), sw.lng());
    }

    /**
     * Sets the radius of this circle.
     */
    setRadius() {
        this.radius = this.circle.getRadius();
    }
}