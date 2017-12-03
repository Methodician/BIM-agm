import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapService } from '../../services/map.service';
import * as fb from 'firebase';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { google } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  mapCenter;
  @Input() markers: any[]
  @Input() polygons: any[]
  polygons$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // markersCollection;
  activePolyDoc;
  activePolygon;
  activePolygon$: BehaviorSubject<any> = new BehaviorSubject<any>({ paths: [] });
  activePaths = [];

  config = {
    isAddingMarkers: false,
    isAddingPolygon: false,
    isEditingPolygon: false
  }

  constructor(
    private mapSvc: MapService,

  ) { }

  ngOnInit() {

    // this.markersCollection = this.mapSvc.getMarkers();
    this.mapSvc.getMarkers().valueChanges().subscribe(markers => {
      this.markers = markers;
    });
    this.mapSvc.getPolygons().valueChanges().subscribe(polygons => {
      this.polygons = polygons;
      this.polygons$.next(polygons);
    });
    //  Will later refactor to be user specific by concatinating uid or maybe putting under user doc
    // this.activePolyDoc = this.mapSvc.getPolygonById('active');
    // this.activePolyDoc.valueChanges().subscribe(polygon => {
    //   if (polygon) {
    //     this.activePolygon = polygon;
    //     this.activePolygon$.next(polygon);
    //   }
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

  mapClick(e) {
    console.log(e);
    if (this.config.isAddingMarkers) {
      this.addMarker(e);
    }
    if (this.config.isAddingPolygon) {
      // this.updateActivePolygon(e)
    }
  }

  // polyClick(polygon, e) {
  //   console.log('polygon:', polygon);
  //   console.log('event:', e);
  // }

  polyMouseUp(polygon, e, index) {
    console.log('polygon:', polygon);
    console.log('event:', e);
    console.log('index:', index);
    if (!this.config.isEditingPolygon) {
      console.log(this.polygons);
      this.config.isEditingPolygon = true;
      this.activePolygon = this.polygons[index];
      // this.activePolygon.isBeingEdited = true;
      // this.polygons[index].isBeingEdited = true;
      this.activePolygon$.next(this.activePolygon);
      this.polygons.splice(index, 1);
      this.polygons$.next(this.polygons);
      console.log(this.polygons);
    }
    else {
      // if (e.vertex) {
      //   this.activePolygon.paths[e.vertex] = {
      //     lat: e.latLng.lat(),
      //     lng: e.latLng.lng()
      //   }
      //   this.activePolygon$.next(this.activePolygon);
      // }
      // else if (e.edge) {
      //   this.activePolygon.paths.splice(this.activePolygon.paths[e.edge], 0, {
      //     lat: e.latLng.lat(),
      //     lng: e.latLng.lng()
      //   });
      //   this.activePolygon$.next(this.activePolygon);
      // }
    }

  }

  activePolyMouseUp(e) {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    if (e.vertex != undefined) {
      this.activePolygon.paths[e.vertex] = { lat, lng };
      this.activePolygon$.next(this.activePolygon);
    }
    else if (e.edge != undefined) {
      this.activePolygon.paths.splice(this.activePolygon.paths[e.edge], 0, { lat, lng });
      this.activePolygon$.next(this.activePolygon);
    }
  }

  addMarker(e) {
    let geopoint = new fb.firestore.GeoPoint(e.coords.lat, e.coords.lng);
    this.mapSvc.addMarker({ geopoint });
  }

  // updateActivePolygon(e) {
  //   this.activePaths.push({
  //     lat: e.coords.lat,
  //     lng: e.coords.lng
  //   });
  //   this.activePolyDoc.set({
  //     paths: this.activePaths
  //   });
  // }

  saveActivePolygon() {
    if (this.activePolygon.id) {
      this.mapSvc.updatePolygon(this.activePolygon)
        .then(success => {
          console.log('Active polygon edits sved to database.', this.activePolygon.id);
        })
    }
    else {
      this.mapSvc.addPolygon(this.activePolygon)
        .then(() => {
          console.log('New polygon added to database.');
          // this.mapSvc.deletePolygon('active');
        })
        .catch(err => {
          alert("Sorry, we couldn't save your changes. Here's the database error:" + err);
        });
    }
    this.activePolygon = { paths: [] };
    this.activePolygon$.next(this.activePolygon);
    this.config.isEditingPolygon = false;
    this.config.isAddingPolygon = false;
  }

  removeActivePolygon() {
    // this.mapSvc.updatePolygon({
    //   id: 'active',
    //   paths: []
    // });
    this.activePolygon.paths = [];
    this.activePolygon$.next(this.activePolygon);
    this.config.isEditingPolygon = false;
  }

  showPosition(lat: number, lng: number) {
    this.mapCenter = {
      lat,
      lng
    };
  }

  get mapPosition() {
    return this.mapCenter;
  }

}
