import { Component, OnInit } from '@angular/core';
import { GeoService } from '@app/services/geo.service';

@Component({
  selector: 'geofire-map',
  templateUrl: './geofire-map.component.html',
  styleUrls: ['./geofire-map.component.css']
})
export class GeofireMapComponent implements OnInit {

  lat: number;
  lng: number;

  markers: any;
  subscription: any;

  constructor(private geoSvc: GeoService) { }

  ngOnInit() {
    this.getUserLocation();
    this.subscription = this.geoSvc.hits.subscribe(hits => {
      this.markers = hits;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  mapClick(e) {
    let coords = [ e.coords.lat, e.coords.lng ]
    this.geoSvc.setLocation(coords);
  }

  private getUserLocation() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
       this.lat = position.coords.latitude;
       this.lng = position.coords.longitude;

       this.geoSvc.getLocations(100, [this.lat, this.lng]);
     });
   }
 }
}
