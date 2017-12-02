import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { LatLng } from '@agm/core/services/google-maps-types';
import * as fb from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  lat: number = 51.678418;
  lng: number = 7.809007;
  markers: Observable<any>;

  polyPath = [
    {
      lat: 45.505107,
      lng: -122.746799
    },
    {
      lat: 45.504910,
      lng: -122.746016
    },
    {
      lat: 45.504662,
      lng: -122.746378
    },
    {
      lat: 45.504466,
      lng: -122.747389
    }
  ]

  constructor(private db: AngularFirestore) {

  }

  ngOnInit() {
    this.markers = this.db.collection('markers').valueChanges();

  }

  ngAfterViewInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => this.showPosition(position));
    }
    else {
      alert('Geolocation is not supported by this browser.');
    }
    // this.db.collection('markers').valueChanges().subscribe((markers: any) => {
    //   this.markers = markers;
    // });
  }

  mapClick($e) {
    console.log($e);
    let geopoint = new fb.firestore.GeoPoint($e.coords.lat, $e.coords.lng);
    this.db.collection('markers').add({ geopoint: geopoint });
  }

  showPosition(position) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  }

}
