export class GmapMarker {
    position: google.maps.LatLng;
    constructor(public marker: google.maps.Marker) {
        this.position = marker.getPosition();
    }
}
