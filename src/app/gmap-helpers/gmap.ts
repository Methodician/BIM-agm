export class GmapHelper {
    public style = {
        height: '100%',
        width: '100%',
        position: 'absolute',
        left: '0',
        right: '0',
        top: '0',
        'margin-bottom': '-50px'
    };

    public options = {
        center: { lat: 45.646381447532, lng: -81.6800426829945 },
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };

    constructor(centerLat?: number, centerLon?: number, zoom?: number) {
        this.options.center.lat = centerLat || this.options.center.lat;
        this.options.center.lng = centerLon || this.options.center.lng;
        this.options.zoom = zoom || this.options.zoom;
    }

    createMarker(lat: number, lng: number, title: string, draggable: boolean, icon?: string): google.maps.Marker {
        return new google.maps.Marker({
            icon: icon,
            position: { lat: lat, lng: lng },
            title: title,
            draggable: draggable,
        });
    }

    createPolygon(paths: google.maps.LatLng[], strokeOpacity?: number, strokeWeight?: number, fillColor?: string, fillOpacity?: number): google.maps.Polygon {
        return new google.maps.Polygon({
            paths: paths,
            strokeOpacity: strokeOpacity || 0.25,
            strokeWeight: strokeWeight || 2,
            fillColor: fillColor || 'yellow',
            fillOpacity: fillOpacity || 0.25
        });
    }

    getAvgCenter(paths: google.maps.LatLng[]): google.maps.LatLng {
        let lat = 0;
        let lng = 0;
        paths.forEach(p => {
            lat += p.lat();
            lng += p.lng();
        });
        return new google.maps.LatLng(lat / paths.length, lng / paths.length);
    }
}
