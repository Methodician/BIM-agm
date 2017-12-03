import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapService } from '../../services/map.service';
import * as fb from 'firebase';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
    this.activePolyDoc = this.mapSvc.getPolygonById('active');
    this.activePolyDoc.valueChanges().subscribe(polygon => {
      if (polygon) {
        this.activePolygon = polygon;
        this.activePolygon$.next(polygon);
      }
    });
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
      this.updateActivePolygon(e)
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
      //this.activePolygon = this.polygons[index];
      // this.activePolygon.isBeingEdited = true;
      // this.polygons[index].isBeingEdited = true;
      this.mapSvc.setActivePolygon(this.polygons[index]);
      this.polygons.splice(index, 1);
      this.polygons$.next(this.polygons);
      console.log(this.polygons);
    }
    else {

    }

  }

  addMarker(e) {
    let geopoint = new fb.firestore.GeoPoint(e.coords.lat, e.coords.lng);
    this.mapSvc.addMarker({ geopoint });
  }

  updateActivePolygon(e) {
    this.activePaths.push({
      lat: e.coords.lat,
      lng: e.coords.lng
    });
    this.activePolyDoc.set({
      paths: this.activePaths
    });
  }

  saveActivePolygon(id?: string) {
    if (id) {
      //  Will handle edits here
      return;
    }
    else {
      this.mapSvc.addPolygon(this.activePolygon)
        .then(() => {
          this.mapSvc.deletePolygon('active');
        })
        .catch(err => {
          alert("Sorry, we couldn't save your changes. Here's the database error:" + err);
        });
    }
  }

  removeActivePolygon() {
    this.mapSvc.updatePolygon({
      id: 'active',
      paths: []
    });
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
