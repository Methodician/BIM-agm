import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class MapService {

  constructor(
    private db: AngularFirestore
  ) { }


  //  Might refactor code to marker and polygon services...

  getMarkers() {
    return this.db.collection('markers');
  }

  getMarkerById(id: string) {
    return this.getMarkers().doc(id);
  }

  addMarker(marker) {
    let id = this.db.createId();
    marker.id = id;
    return this.getMarkerById(id).set(marker);
  }

  updateMarker(marker) {
    return this.getMarkerById(marker.id).update(marker);
  }

  getPolygons() {
    return this.db.collection('polygons');
  }

  getPolygonById(id: string) {
    return this.getPolygons().doc(id);
  }

  addPolygon(polygon) {
    let id = this.db.createId();
    polygon.id = id;
    return this.getPolygonById(id).set(polygon);
  }

  updatePolygon(polygon) {
    return this.getPolygonById(polygon.id).update(polygon);
  }

  setActivePolygon(polygon) {
    return this.getPolygonById('active').set(polygon);
  }

  deletePolygon(id: string) {
    return this.getPolygonById(id).delete();
  }
}
