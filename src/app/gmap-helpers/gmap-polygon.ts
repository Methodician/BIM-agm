import { GmapCoordinate } from './gmap-coordinate';
import { GmapShape } from './gmap-shape';

/**
 * Wrapper class for google.maps.Polygon.
 */
export class GmapPolygon extends GmapShape implements IGmapShape {

    /**
     * Path of the polygon.
     */
    public path: google.maps.MVCArray<any>;

    /**
     * Sets the path, sets the area, sets the bounds, and sets north, east, south, and west.
     * @param polygon
     */
    constructor(public polygon: google.maps.Polygon) {
        super();
        this.shapeType = GmapPolygon.name;
        this.setPath();
        this.setArea();
        this.setBounds();
        this.setNESW();
    }

    /**
     * Checks if a point is within this polygon.
     * Code borrowed and modified for Typescript from: https://github.com/tparkin/Google-Maps-Point-in-Polygon/blob/master/maps.google.polygon.containsLatLng.js#L4
     * @param lat
     * @param lng
     */
    containsLatLng(lat: number, lng: number): boolean {
        // Exclude points outside of bounds as there is no way they are in the poly
        if (!this.bounds && !this.bounds.contains(new google.maps.LatLng(lat, lng))) {
            return false;
        }

        // result variable and index for 2nd vertex
        let inPoly = false;
        let j;

        // Raycast point in polygon method
        const numPaths = this.polygon.getPaths().getLength();
        for (let p = 0; p < numPaths; p++) {
            const path = this.polygon.getPaths().getAt(p);
            const numPoints = path.getLength();
            j = numPoints - 1;

            for (let i = 0; i < numPoints; i++) {
                const vertex1 = path.getAt(i);
                const vertex2 = path.getAt(j);

                if (vertex1.lng() < lng && vertex2.lng() >= lng || vertex2.lng() < lng && vertex1.lng() >= lng) {
                    if (vertex1.lat() + (lng - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < lat) {
                        inPoly = !inPoly;
                    }
                }
                j = i;
            }
        }
        return inPoly;
    }

    /**
     * Sets the bounds of this polygon.
     * Code borrowed and modified for Typescript from: https://github.com/tparkin/Google-Maps-Point-in-Polygon/blob/master/maps.google.polygon.containsLatLng.js#L4
     */
    setBounds(): void {
        const bounds = new google.maps.LatLngBounds();
        const paths = this.polygon.getPaths();

        for (let p = 0; p < paths.getLength(); p++) {
            const path = paths.getAt(p);
            for (let i = 0; i < path.getLength(); i++) {
                // extend the current bounds to contain the given point
                bounds.extend(path.getAt(i));
            }
        }
        this.bounds = bounds;
    }


    /**
     * Sets the area of the polygon in meters squared.
     */
    setArea() {
        this.area = google.maps.geometry.spherical.computeArea(this.path.getArray());
    }

    /**
    * Sets the center from the google maps object. Abstracts cluttered class to our minimial class.
    */
    setCenter() {
        throw new Error('Method not implemented.');
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
     * Sets the path of this polygon.
     */
    setPath() {
        this.path = this.polygon.getPath();
    }
}
