import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as GeoFire from "geofire";
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class GeoService {

  dbRef: any;
  geoFire: any;

  hits = new BehaviorSubject([]);

  constructor(private db: AngularFireDatabase) {
    this.dbRef = this.db.list('/locations');
    this.geoFire = new GeoFire(this.dbRef.query.ref);
  }

  /// Adds GeoFire data to database
  setLocation(coords: Array<number>, key?: string){
    if(!key)
      key = this.db.createPushId();
    this.geoFire.set(key, coords)
    .then(_ => console.log('location updated'))
    .catch(err => console.log(err));
  }

  getLocations(radius: number, coords: Array<number>){
    this.geoFire.query({
      center: coords,
      radius
    })
    .on('key_entered', (key, location, distance) => {
      let hit = { location, distance }
      //  NOTE PATTERN!!! Been wondering a better way to grab value from BehaviorSubject in-line... This could prevent the need to store an associated variable too!
      let currentHits = this.hits.value;

      currentHits.push(hit);
      this.hits.next(currentHits);
    });
  }

}
