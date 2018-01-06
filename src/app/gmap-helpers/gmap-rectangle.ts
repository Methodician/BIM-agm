import { GmapCoordinate } from './gmap-coordinate';
import { GmapShape } from './gmap-shape';

/**
 * Wrapper class for google.maps.Circle.
 */
export class GmapRectangle extends GmapShape implements IGmapShape {
    /**
     * Sets bounds, sets center, sets north, east, south, west, and sets area.
     * @param rectangle
     */
    constructor(public rectangle: google.maps.Rectangle) {
        super();
        this.shapeType = GmapRectangle.name;
        this.setBounds();
        this.setCenter();
        this.setNESW();
        this.setArea();
    }

    /**
     * Set area for this rectangle.
     */
    setArea() {
        const path = [
            new google.maps.LatLng(this.ne.lat, this.ne.lng),
            new google.maps.LatLng(this.sw.lat, this.ne.lng),
            new google.maps.LatLng(this.sw.lat, this.ne.lng),
            new google.maps.LatLng(this.ne.lat, this.sw.lng)
        ];
        this.area = google.maps.geometry.spherical.computeArea(path);
    }

    /**
     * Set center for this rectangle.
     */
    setCenter() {
        const centerRectangle = this.bounds.getCenter();
        this.center = new GmapCoordinate(centerRectangle.lat(), centerRectangle.lng());
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
     * Sets the bounds of this rectangle.
     */
    setBounds() {
        this.bounds = this.rectangle.getBounds();
    }
}
