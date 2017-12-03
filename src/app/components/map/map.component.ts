import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapService } from '../../services/map.service';
import * as fb from 'firebase';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  mapCenter;
  @Input() markers: any[]
  @Input() polygons: any[]

  // markersCollection;
  activePolyDoc;
  activePolygon;
  activePaths = [];

  config = {
    addingMarkers: false,
    addingPolygon: true
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
    });
    //  Will later refactor to be user specific by concatinating uid or maybe putting under user doc
    this.activePolyDoc = this.mapSvc.getPolygonById('active');
    this.activePolyDoc.valueChanges().subscribe(polygon => {
      this.activePolygon = polygon;
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
    if (this.config.addingMarkers) {
      this.addMarker(e);
    }
    if (this.config.addingPolygon) {
      this.updateActivePolygon(e)
    }
  }

  polyClick(polygon, e) {
    console.log('polygon:', polygon);
    console.log('event:', e);
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
