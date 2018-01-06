import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapService } from '@services/map.service';
import * as fb from 'firebase';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { google } from '@agm/_dev/packages/core/services/google-maps-types';
// if add this to tsconfig.json: "@agm/core/*": ["../node_modules/@agm/_dev/packages/core/*"] then can do following...
// import { google } from '@agm/core/services/google-maps-types';
import { Polygon } from '@models/polygon';
// import { JsonImportService } from '@app/services/json-import.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  mapCenter;
  @Input() markers: any[]
  @Input() polygons: Polygon[]
  polygons$: BehaviorSubject<Polygon[]> = new BehaviorSubject<Polygon[]>(null);

  // markersCollection;
  // activePolyDoc;
  activePolygon: Polygon = { paths: [] };
  activePolygon$: BehaviorSubject<Polygon> = new BehaviorSubject<Polygon>(this.activePolygon);
  polygonForUpdate;
  activePaths = [];

  jsonImport: Object;

  config = {
    isAddingMarkers: false,
    isAddingPolygon: false,
    isEditingPolygon: false,
    isEditingNewPolygon: false
  }

  constructor(
    private mapSvc: MapService,
    // private jsonSvc: JsonImportService
  ) { }

  ngOnInit() {
    // const jsonObject = this.jsonSvc.getData();
    // this.jsonImport = jsonObject;
    // console.log(this.jsonImport);

    // this.markersCollection = this.mapSvc.getMarkers();
    this.mapSvc.getMarkers().valueChanges().subscribe(markers => {
      console.log(markers.length);
      this.markers = markers;
    });
    this.mapSvc.getPolygons().valueChanges().subscribe((polygons: Polygon[]) => {
      this.polygons = polygons;
      this.polygons$.next(polygons);
    });

    // this.activePolygon$.subscribe(polygon => {
    //   console.log(polygon);
    // });
  }

  ngAfterViewInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position.coords.latitude, position.coords.longitude);
      });
    }
    else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  layerClick(e, json) {
    console.log(json);
    // console.log(e);
    // const feature = e.feature;
    // const lat = e.latLng.lat();
    // const lng = e.latLng.lng();
    // console.log('feature', feature);
    // console.log('lat and lng', lat, lng);
  }

  startCreatePolygon() {
    this.activePaths = [];
    this.activePolygon.id = null;
    this.updateActivePolygon()
    this.config.isAddingPolygon = true;
    this.config.isAddingMarkers = false;
    this.config.isEditingPolygon = false;
  }

  startCreatingMarkers() {
    this.config.isAddingMarkers = true;
  }

  stopCreatingMarkers() {
    this.config.isAddingMarkers = false;
  }

  startMarkerStresstest() {
    // this.startCreatingMarkers();
    let rand = Math.random;
    const maxLat = 48.3;
    const minLat = 25.4;
    const maxLng = -66.75;
    const minLng = -124.85;
    setInterval(() => {
      const lat = rand() * (maxLat - minLat) + minLat;
      const lng = rand() * (maxLng - minLng) + minLng;
      const event = {
        coords: {
          lat, lng
        }
      };
      this.addMarker(event);
      console.log(event);
    }, 200)
    // for (let i = 1; i < 200; i++) {
    //   const lat = rand() * (maxLat - minLat) + minLat;
    //   const lng = rand() * (maxLng - minLng) + minLng;
    //   const event = {
    //     coords: {
    //       lat, lng
    //     }
    //   };
    //   this.addMarker(event);
    // }
    // console.log('stress test done');
    // this.stopCreatingMarkers();
  }

  mapClick(e) {
    if (this.config.isAddingMarkers) {
      this.addMarker(e);
    }
    else if (this.config.isAddingPolygon && !(this.activePaths.length > 1)) {
      this.activePaths.push({
        lat: e.coords.lat,
        lng: e.coords.lng
      });
      this.updateActivePolygon();
      if (this.activePaths.length > 1)
        this.config.isEditingNewPolygon = true;
    }
    // else if (this.config.isAddingPolygon && this.activePaths.length > 1)
  }


  polyPathChange(e) {
    if (this.config.isEditingPolygon || this.config.isEditingNewPolygon) {
      this.getPathFromChange(e).then(paths => {
        this.activePaths = paths;
      });
    }

  }

  getPathFromChange(pathChangeEvent) {
    return pathChangeEvent.then(e => {
      return e.map((item, index) => {
        return {
          lat: item.lat(),
          lng: item.lng()
        }
      });
    });
  }

  polyMouseUp(polygon, e, index) {
    console.log('polygon:', polygon);
    if (!this.config.isEditingPolygon) {
      this.config.isEditingPolygon = true;
      this.activePolygon = this.polygons[index];
      this.activePolygon$.next(this.activePolygon);
      this.activePaths = this.activePolygon$.value.paths;
      this.polygons.splice(index, 1);
      this.polygons$.next(this.polygons);
      // console.log(this.polygons);
    }
    else {

    }

  }

  activePolyMouseUp(e) {
  }



  addMarker(e) {
    // console.log(e);
    let geopoint = new fb.firestore.GeoPoint(e.coords.lat, e.coords.lng);
    // console.log(geopoint);
    this.mapSvc.addMarker({ geopoint });
  }

  // GeoPoint {_lat: 48.28319289548349, _long: -124.8486328125}
  // map.component.ts:143 GeoPoint {_lat: 46.316584181822186, _long: -66.7529296875}
  // map.component.ts:143 GeoPoint {_lat: 25.403584973186707, _long: -79.1455078125}
  // map.component.ts:143 GeoPoint {_lat: 32.13840869677249, _long: -119.4873046875}
  // updateActivePolygon(e) {
  //   this.activePaths.push({
  //     lat: e.coords.lat,
  //     lng: e.coords.lng
  //   });
  //   this.updateActivePolygon()
  //   console.log(this.activePolygon);
  //   // this.activePolygon.paths = this.activePaths;
  //   // this.activePolygon$.next(this.activePaths);
  // }

  saveActivePolygon() {
    this.config.isEditingPolygon = false;
    this.config.isAddingPolygon = false;
    this.config.isEditingNewPolygon = false;
    this.activePolygon.paths = this.activePaths
    if (this.activePolygon.id) {
      this.mapSvc.updatePolygon(this.activePolygon)
        .then(success => {
          console.log('Active polygon edits sved to database.', this.activePolygon);
          this.activePaths = [];
          this.updateActivePolygon();
        })
    }
    else {
      this.mapSvc.addPolygon(this.activePolygon)
        .then(() => {
          console.log('New polygon added to database.');
          this.activePaths = [];
          this.updateActivePolygon();
          // this.mapSvc.deletePolygon('active');
        })
        .catch(err => {
          alert("Sorry, we couldn't save your changes. Here's the database error:" + err);
        });
    }
    // this.activePolygon$.next(this.activePolygon);
  }

  removeActivePolygon() {
    // this.mapSvc.updatePolygon({
    //   id: 'active',
    //   paths: []
    // });
    this.activePaths = [];
    this.updateActivePolygon();
    this.config.isEditingPolygon = false;
    this.config.isAddingPolygon = false;
  }

  showPosition(lat: number, lng: number) {
    this.mapCenter = {
      lat,
      lng
    };
  }

  updateActivePolygon() {
    this.activePolygon.paths = this.activePaths;
    if (this.activePaths.length > 1) {
      this.activePolygon$.next(this.activePolygon);
    }
  }

  shouldShowActivePolygon() {
    return this.activePolygon.paths.length > 1 && (this.config.isAddingPolygon || this.config.isEditingPolygon);
  }

  get mapPosition() {
    return this.mapCenter;
  }

}
