import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { LatLng } from '@agm/core/services/google-maps-types';
import * as fb from 'firebase';
import { AgmPolygon } from '@agm/core/directives/polygon';
import { MapService } from './services/map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // @ViewChild('map') map;

  pathDoc: AngularFirestoreDocument<any>;
  pathsCollection: Observable<any>;
  path = [];
  polyTest: AgmPolygon;

  constructor(
    //  Remove this:
    private db: AngularFirestore
  ) {
  }

  ngOnInit() {


    //  Experiments:
    this.pathDoc = this.db.doc('polyPaths/path4');
    this.pathsCollection = this.db.collection('polyPaths').valueChanges();
    this.pathDoc.valueChanges().subscribe(path => {
      if (path)
        this.path = path.points;
    })
  }

  ngAfterViewInit() {

    //  Deprecated?
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => this.showPosition(position));
    // }
    // else {
    //   alert('Geolocation is not supported by this browser.');
    // }
    // this.db.collection('markers').valueChanges().subscribe((markers: any) => {
    //   this.markers = markers;
    // });
  }

  saveActivePolygon(mapComponent) {
    mapComponent.saveActivePolygon();
  }

  removeActivePolygon(mapComponent) {
    mapComponent.removeActivePolygon();
  }

  mapClick($e) {
    // this.path.push({
    //   lat: $e.coords.lat,
    //   lng: $e.coords.lng
    // });
    // this.pathDoc.set({ points: this.path });
    // this.polyPath.push({
    //   lat: $e.coords.lat,
    //   lng: $e.coords.lng
    // });

    // console.log(this.polyPath);
    // let geopoint = new fb.firestore.GeoPoint($e.coords.lat, $e.coords.lng);
    // this.db.collection('markers').add({ geopoint: geopoint });
  }

  polyClick(path, event) {
    // console.log(path, event);
    // console.log(event.latLng.lat());
    // console.log(event.latLng.lng());
  }

  polyMouseUp(path, event) {
    console.log(event);
    if (event.vertex) {
      path.points[event.vertex] = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }
    }
    else if (event.edge) {
      path.points.splice(path.points[event.edge], 0, {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    }
    console.log(path);
  }

  // showPosition(position) {
  //   this.lat = position.coords.latitude;
  //   this.lng = position.coords.longitude;
  // }

}
