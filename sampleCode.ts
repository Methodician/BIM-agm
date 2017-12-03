//  EDIT A POLYGON:
// onPolyMouseUp(polygon: any, event: any) {
//     if(event.vertex != undefined) {
//       // User dragged a point on the polygon
//       console.log("User dragged point");

//       // Update existing point
//       polygon.paths[event.vertex] = {
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng()
//       }
//     } else if(event.edge != undefined) {
//       // User added a new vertex
//       console.log("User created new point", event);

//       // Insert new point into polygon paths
//       polygon.paths.splice(polygon.paths[event.edge], 0, {
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng()
//       }); 
//     }

//     // API request to update polygon

//     console.log(polygon);
//   }
// HTML
// <agm-polygon *ngFor="let polygon of geofencePolygons"
//                             [paths]="polygon.paths"
//                             [fillColor]="polygon.colour"
//                             [fillOpacity]="0.35"
//                             [strokeColor]="polygon.colour"
//                             [strokeOpacity]="0.8"
//                             [strokeWeight]="2"
//                             [editable]="true"
//                             (polyMouseUp)="onPolyMouseUp(polygon, $event)">
//                 </agm-polygon>

//  EDITED A POLYGON?:
// this._mapsAPILoader.load().then(() => {
//     this.setPoly(this._agmPolygon);
// });

// public setPoly(poly: AgmPolygon) {
// if (poly != null) {
// this.getPolygon(poly).then(polygon => {
// let path = polygon.getPath();

// google.maps.event.addListener(path, "insert_at", (vertex: number) => {
// this._ngZone.run(() => {
// console.log("new test insert_at" + vertex);
// this.polygonSelected = this.updateGeographyPointsFromPath(
// this.polygonSelected,
// path
// );
// console.log(this.polygonSettings.polygonSelected);
// });
// });

// google.maps.event.addListener(path, "set_at", (vertex: number) => {
// this._ngZone.run(() => {
// //console.log("new test set_at" + vertex);
// this.polygonSelected = this.updateGeographyPointsFromPath(
// this.polygonSelected, path
// );
// });
// });
// });
// } else {
// this.getPolygon(this._agmPolygon).then(polygon => {
// let path = polygon.getPath();

// google.maps.event.clearListeners(path, "insert_at");
// google.maps.event.clearListeners(path, "set_at");
// });
// }

// this._agmPolygon = poly;
// }
// private getPolygon(poly: AgmPolygon): Promise<Polygon> {
// let polyAsAny = <any>poly;
// let polygonMap = polyAsAny._polygonManager._polygons.get(poly);

// return polygonMap as Promise<Polygon>;
// }

// private updateGeographyPointsFromPath(
// polygonSelected: any,
// path: Array<LatLng>
// ): any {
// polygonSelected = [];
// path.forEach(element => {
// polygonSelected.push({
// lat: element.lat(),
// lng: element.lng()
// });
// });
// return polygonSelected;  }

//  SOMETHING ABOUT ROUTING:
// constructor(
//     private mapsAPILoader: MapsAPILoader,
//     private mapsWrapper: GoogleMapsAPIWrapper,
//     private ngZone: NgZone
// ) {}

// ngOnInit() {
//     // Create search FormControl
//     this.originControl      = new FormControl();
//     this.destinationControl = new FormControl();

//     // Override default position with current one
//     if (!this._setCurrentPosition(this.position)) {
//         // ... whatever
//     }

//     // Setup Autocomplete
//     this.mapsAPILoader.load().then(() => {
//         const acOrigin      = new google.maps.places.Autocomplete(this.origin.nativeElement,      { types: ['address'] });
//         const acDestination = new google.maps.places.Autocomplete(this.destination.nativeElement, { types: ['address'] });

//         acOrigin.addListener('place_changed', this._autoCompleteHandler(acOrigin, this.originMarker));
//         acDestination.addListener('place_changed', this._autoCompleteHandler(acDestination, this.destinationMarker));
//     });
// }

// public onMapReady(map) {
//     this._map               = map;
//     this._directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true})
//     this._directionsDisplay.setMap(this._map);
// }

// private _computeRouting(): boolean {
//     if (!this.originMarker.latitude) { return false; }
//     if (!this.destinationMarker.latitude) { return false; }

//     const directionsService = new google.maps.DirectionsService;

//     // Show  directions
//     const directionRequest: google.maps.DirectionsRequest = {
//         origin           : { lat: this.originMarker.latitude,      lng: this.originMarker.longitude },
//         destination      : { lat: this.destinationMarker.latitude, lng: this.destinationMarker.longitude },
//         waypoints        : [],
//         optimizeWaypoints: true,
//         travelMode       : google.maps.TravelMode.DRIVING
//     };

//     directionsService.route(directionRequest, (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
//         if (status === google.maps.DirectionsStatus.OK) {
//             console.log(result);
//             this._directionsDisplay.setDirections(result);

//             this.distance =
//                 (result.routes[0].legs
//                     .map(leg => leg.distance.value)
//                     .reduce((sum, item) => sum + item, 0) / 1000
//                 ).toFixed(1);
//         } else {
//             console.log('Directions request failed due to ' + status);
//         }
//     });

//     return true;
// }

// private _autoCompleteHandler(autocompleteElement:  google.maps.places.Autocomplete, marker: Marker) {
//     return () => {
//         this.ngZone.run(() => {
//             const place: google.maps.places.PlaceResult = autocompleteElement.getPlace();

//             // verify result
//             if (place.geometry === undefined || place.geometry === null) {
//                 return;
//             }

//             // Update marker
//             [marker.latitude, marker.longitude] = [place.geometry.location.lat(), place.geometry.location.lng()];

//             if (!this._computeRouting()) {
//                 // Centers the map on the latest marker
//                 this.position = marker;
//             }
//         });
//     };
// }

// private _setCurrentPosition(marker: Marker) {
//     if ('geolocation' in navigator) {
//         navigator.geolocation.getCurrentPosition((position) => {
//             [marker.latitude, marker.longitude] = [position.coords.latitude, position.coords.longitude];
//         });
//         return true;
//     }
//     return false;
// }

//  SOMETHING ABOUT SEARCH BY COUNTRY:
// @ViewChild('search') searchElementRef: ElementRef;

//   constructor (
//                private mapsAPILoader: MapsAPILoader,
//                private ngZone: NgZone) {
// }

// ngAfterViewInit () {
//     this.mapsAPILoader.load().then(() => {
//       const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
//       autocomplete.addListener('place_changed', () => {
//         this.ngZone.run(() => {
//           // get the place result
//           const place: google.maps.places.PlaceResult = autocomplete.getPlace();

//           // verify result
//           if (place.geometry === undefined || place.geometry === null) {
//             return;
//           }

//           // set latitude, longitude
//             this.latitude: place.geometry.location.lat();
//             this.longtitude: place.geometry.location.lng();
//         });
//       });
//     });
//   }


//  SOMETHING ABOUT CHECK BOUNDS AND RESIZE
// <agm-map (mapReady)="resizeMap()"></agm-map>
// in order to check bounds, you can refer to this bit of code I just pasted above a few days ago:
//   import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core'
//   ...
//   latNorth: number
//   @ViewChild(AgmMap) mapElement: any
//   constructor( private _mapsWrapper: GoogleMapsAPIWrapper ) {}
//   ...

//   checkBounds() {

//     const ln = this.mapElement._mapsWrapper.getBounds()
//       .then( (latLngBounds) => {
//         return latLngBounds.getNorthEast().lat()
//       })
//     ln.then( x => this.latNorth = x

//  LOOKS LIKE A COOL MAP ACCESSOR SERVICE:
// @Component({
//     selector: 'app-map-accessor',
//     template: '',
//   })
//   export class MapAccessorComponent implements OnInit {
//     constructor(private _googleMapsAPIWrapperr: GoogleMapsAPIWrapper,
//                 private _mapAccessor: MapAccessor,
//                 private _markerManager: MarkerManager) {
//     }

//     ngOnInit() {
//       this._googleMapsAPIWrapperr.getNativeMap().then((map: GoogleMap) => {
//         console.log(map);
//         this._mapAccessor.nativeMap = map;
//         this._mapAccessor.markerManager = this._markerManager;

//         }
//       )
//     }
//   }
//   That is my, but i have a MapAccessor is a simple service which i own
//    import { Injectable } from '@angular/core';
//   import { Observable, Subject } from 'rxjs';
//   import { GoogleMap } from '@agm/core/services/google-maps-types';
//   import { MarkerManager, AgmMarker } from '@agm/core';
//   import { EventLocation } from '../models/event-location.model';
//   @Injectable()

//   export class MapAccessor {
//     private _nativeMap;
//     private _markerManager;

//     markers: Map<EventLocation, AgmMarker> = new Map<EventLocation, AgmMarker>();

//     getMap: Subject<GoogleMap> = new Subject<GoogleMap>();
//     set nativeMap(val: GoogleMap) {
//       this._nativeMap = val;
//       this.getMap.next(val);
//     }

//     get nativeMap(): GoogleMap {
//       return this._nativeMap;
//     }


//     getMarkerManager: Subject<MarkerManager> = new Subject<MarkerManager>();
//     set markerManager(val: MarkerManager) {
//       this._markerManager = val;
//       this.getMarkerManager.next(val);
//     }

//     get markerManager(): MarkerManager {
//       return this._nativeMap;
//     }

//     addMarker(location: EventLocation, marker: AgmMarker): void {
//       this.markers.set(location, marker);
//     }

//     getMarker(location): AgmMarker {
//       return this.markers.get(location);
//     }

//     removeMarker(location): void {
//       this.markers.delete(location);
//     }
//   }

//   JP Lew @jplew Oct 13 12:01
//   ok, i'm making my own map accessor service, just a sec

//   brunsten @brunsten Oct 13 12:01
//   The map there is just so that i can target a marker from my data type.
//   And then i have this directive, which i place on each marker in the view
//    import { Directive, Host, Input, OnDestroy, OnInit } from '@angular/core';
//   import { AgmMarker } from '@agm/core';
//   import { MapAccessor } from '../../services/map-accessor.service';
//   @Directive({
//     selector: '[app-marker-accessor]'
//   })
//   export class MarkerAccessorDirective implements OnInit, OnDestroy {

//     @Input('app-marker-accessor') markerAccessor: any;

//     constructor(@Host() private _markerComponent: AgmMarker, private _mapAccessor: MapAccessor) {

//     }

//     ngOnInit(): void {
//       this._mapAccessor.addMarker(this.markerAccessor, this._markerComponent);
//     }

//     ngOnDestroy(): void {
//       this._mapAccessor.removeMarker(this.markerAccessor);
//     }
//   }