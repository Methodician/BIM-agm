import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  lat: number = 51.678418;
  lng: number = 7.809007;
  items: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.items = db.collection('items').valueChanges();
  }

  ngAfterViewInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => this.showPosition(position));
    }
    else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  showPosition(position) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  }
}
