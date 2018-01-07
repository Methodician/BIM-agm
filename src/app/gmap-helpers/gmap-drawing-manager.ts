//  Comes from https://github.com/SebastianM/angular-google-maps/issues/958
import { GmapMarker } from './gmap-marker';
import { GmapPolyline } from './gmap-polyline';
import { GmapCircle } from './gmap-circle';
import { GmapPolygon } from './gmap-polygon';
import { GmapRectangle } from './gmap-rectangle';
import { ChangeDetectorRef } from '@angular/core';
// import { google } from '@agm/_dev/packages/core/services/google-maps-types';
//  declare var google: any;
export class GmapDrawingManager extends google.maps.drawing.DrawingManager {

    public circles = new Array<GmapCircle>();
    public markers = new Array<GmapMarker>();
    public polygons = new Array<GmapPolygon>();
    public rectangles = new Array<GmapRectangle>();
    public polylines = new Array<GmapPolyline>();

    private options = {
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
            position: this.isMobile() ? google.maps.ControlPosition.BOTTOM_CENTER : google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.RECTANGLE,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.POLYLINE
            ]
        },
        markerOptions: {
            position: null,
            draggable: true,
        },
        circleOptions: {
            editable: true,
            strokeWeight: 2,
            draggable: true,
        },
        polygonOptions: {
            editable: true,
            strokeWeight: 2,
            draggable: true
        },
        polylineOptions: {
            editable: true,
            strokeWeight: 2,
            draggable: true
        },
        rectangleOptions: {
            editable: true,
            strokeWeight: 2,
            draggable: true
        }
    };

    constructor(private _map?: any, private _changeDetector?: ChangeDetectorRef) {

        // inherit from drawing manager
        super();

        // set the map options
        this.setOptions(this.options);

        // add drawing manager to the map
        this.setMap(this._map);

        // wire up events
        this.addListener('circlecomplete', (circle: google.maps.Circle) => {

            // // used to test if the bounds are correct
            // const circleBounds = circle.getBounds();
            // const ne = circleBounds.getNorthEast();
            // const sw = circleBounds.getSouthWest();

            // const rectangle = new google.maps.Rectangle({
            //     strokeColor: '#FF0000',
            //     strokeOpacity: 0.8,
            //     strokeWeight: 2,
            //     fillColor: '#FF0000',
            //     fillOpacity: 0.35,
            //     map: this._map,
            //     bounds: {
            //         north: ne.lat(),
            //         south: sw.lat(),
            //         east: ne.lng(),
            //         west: sw.lng()
            //     }
            // });
            this.circles.push(new GmapCircle(circle));
            this.detectChanges();
        });
        this.addListener('polygoncomplete', (polygon: google.maps.Polygon) => {
            const p = new GmapPolygon(polygon);
            this.polygons.push(new GmapPolygon(polygon));

            // test to see if bounds were correct
            // const rectangle = new google.maps.Rectangle({
            //     strokeColor: '#FF0000',
            //     strokeOpacity: 0.8,
            //     strokeWeight: 2,
            //     fillColor: '#FF0000',
            //     fillOpacity: 0.35,
            //     map: this._map,
            //     bounds: {
            //         north: p.getNE().lat,
            //         south: p.getSW().lat,
            //         east: p.getNE().lng,
            //         west: p.getSW().lng
            //     }
            // });
            this.detectChanges();
        });
        this.addListener('markercomplete', (marker: google.maps.Marker) => {
            console.log(marker);
            this.markers.push(new GmapMarker(marker));
            this.detectChanges();
        });
        this.addListener('polylinecomplete', (polyline: google.maps.Polyline) => {
            console.log(polyline);
            this.polylines.push(new GmapPolyline(polyline));
            this.detectChanges();
        });
        this.addListener('rectanglecomplete', (rectangle: google.maps.Rectangle) => {
            this.rectangles.push(new GmapRectangle(rectangle));
            this.detectChanges();
        });
    }

    // detect changes manually or else view doesn't get updated quick enough
    detectChanges() {
        this._changeDetector.detectChanges();
    }

    toggleVisibility() {
        this.options.drawingControl = !this.options.drawingControl;
        this.setOptions(this.options);
    }

    show() {
        this.options.drawingControl = true;
        this.setOptions(this.options);
    }

    hide() {
        this.options.drawingControl = false;
        this.setOptions(this.options);
    }

    clearMarkers(isClearAll: boolean) {
        this.toggleMarkers(false);
        this.markers.length = 0;
        if (!isClearAll) {
            this.detectChanges();
        }
    }

    clearPolygons(isClearAll: boolean) {
        this.togglePolygons(false);
        this.polygons.length = 0;
        if (!isClearAll) {
            this.detectChanges();
        }
    }

    clearRectangles(isClearAll: boolean) {
        this.toggleRectangles(false);
        this.rectangles.length = 0;
        if (!isClearAll) {
            this.detectChanges();
        }
    }

    clearPolylines(isClearAll: boolean) {
        this.togglePolylines(false);
        this.polylines.length = 0;
        if (!isClearAll) {
            this.detectChanges();
        }
    }

    clearCircles(isClearAll: boolean) {
        this.toggleCircles(false);
        this.circles.length = 0;
        if (!isClearAll) {
            this.detectChanges();
        }
    }

    toggleCircles(isVisible: boolean) {
        this.circles.forEach(c => {
            c.circle.setMap(isVisible ? this._map : null);
        });
    }

    togglePolylines(isVisible: boolean) {
        this.polylines.forEach(pl => {
            pl.polyline.setMap(isVisible ? this._map : null);
        });
    }

    toggleRectangles(isVisible: boolean) {
        this.rectangles.forEach(r => {
            r.rectangle.setMap(isVisible ? this._map : null);
        });
    }

    togglePolygons(isVisible: boolean) {
        this.polygons.forEach(p => {
            p.polygon.setMap(isVisible ? this._map : null);
        });
    }

    toggleMarkers(isVisible: boolean) {
        this.markers.forEach(m => {
            m.marker.setMap(isVisible ? this._map : null);
        });
    }

    clearAllShapes() {
        this.clearMarkers(true);
        this.clearPolygons(true);
        this.clearRectangles(true);
        this.clearPolylines(true);
        this.clearCircles(true);
        this.detectChanges();
    }

    toggleEditable(isEditable: boolean) {
        // reverse options
        this.options.circleOptions.editable = isEditable;
        this.options.rectangleOptions.editable = isEditable;
        this.options.polygonOptions.editable = isEditable;
        this.options.polylineOptions.editable = isEditable;

        // set the shapes already drawn
        this.circles.forEach(c => {
            c.circle.setEditable(isEditable);
        });

        this.rectangles.forEach(r => {
            r.rectangle.setEditable(isEditable);
        });

        this.polygons.forEach(pg => {
            pg.polygon.setEditable(isEditable);
        });

        this.polylines.forEach(pl => {
            pl.polyline.setEditable(isEditable);
        });
    }

    toggleDrawingMode(circle: boolean, rectangle: boolean, polygon: boolean, polyline: boolean, marker) {
        const modes = [];
        if (marker) {
            modes.push(google.maps.drawing.OverlayType.MARKER);
        }
        if (circle) {
            modes.push(google.maps.drawing.OverlayType.CIRCLE);
        }
        if (rectangle) {
            modes.push(google.maps.drawing.OverlayType.RECTANGLE);
        }
        if (polygon) {
            modes.push(google.maps.drawing.OverlayType.POLYGON);
        }
        if (polyline) {
            modes.push(google.maps.drawing.OverlayType.POLYLINE);
        }

        // set new modes in options
        this.options.drawingControlOptions.drawingModes = modes;
        this.setOptions(this.options);

        // sets current drawing mode to null so we don't accidentally draw a shape we disabled
        this.setDrawingMode(null);
    }

    // Insane check for mobile so we can position the drawing manager toolbar appropriately
    // http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    public isMobile(): boolean {
        let check = false;
        ((a => {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        }))(navigator.userAgent || navigator.vendor);
        return check;
    }
}
