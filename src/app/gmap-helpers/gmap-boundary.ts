import { GmapCoordinate } from './gmap-coordinate';
export class GmapBoundary {
    constructor(public ne: GmapCoordinate, public sw: GmapCoordinate) { }
}