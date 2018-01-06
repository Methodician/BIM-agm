import { GmapBoundary } from './gmap-boundary';
import { GmapCoordinate } from './gmap-coordinate';

/**
 * Wrapper class for common items of a google maps shape.
 */
export class GmapShape {
    /**
     * Northeast lat/lng coordinate.
     */
    public ne: GmapCoordinate;

    /**
     * Southwest lat/lng coordinate.
     */
    public sw: GmapCoordinate;

    /**
     * Center lat/lng coordinate.
     */
    public center: GmapCoordinate;

    /**
     * Bounds of the shape.
     */
    public bounds: google.maps.LatLngBounds;

    /**
   * Area of the shape in meters squared.
   */
    public area: number;

    /**
     * Type of shape.
     */
    public shapeType: string;

    constructor() { }

    /**
     * Gets the center lat/lng coordinate of the shape.
     */
    getCenter(): GmapCoordinate {
        return this.center;
    }

    /**
     * Gets northeast lat/lng coordinate of the shape.
     */
    getNE(): GmapCoordinate {
        return this.ne;
    }

    /**
     * Gets southeast lat/lng coordinate of the shape.
     */
    getSW(): GmapCoordinate {
        return this.sw;
    }

    /**
     * Get the bounds as an object containing NE and SW.
     */
    getBoundary(): GmapBoundary {
        return new GmapBoundary(this.ne, this.sw);
    }
}
