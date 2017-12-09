//  Module Imports:
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AgmCoreModule } from '@agm/_dev/packages/core';
import { AgmJsMarkerClustererModule } from '@agm/_dev/packages/js-marker-clusterer';

//  Comopnent Imports
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';

//  Misc. Imports
import { environment } from '../environments/environment';
import { PointService } from './services/point.service';
import { PolygonService } from './services/polygon.service';
import { MapService } from './services/map.service';
import { ClusterManager } from '@agm/_dev/packages/js-marker-clusterer/services/managers/cluster-manager';
import { GeofireMapComponent } from './components/geofire-map/geofire-map.component';
import { GeoService } from '@app/services/geo.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { GoogleMapsAPIWrapper } from '@agm/_dev/packages/core/services/google-maps-api-wrapper';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GeofireMapComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig, 'bim-earth'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    }),
    AgmJsMarkerClustererModule,
    BrowserModule
  ],
  providers: [
    PointService,
    PolygonService,
    MapService,,
    GeoService,
    ClusterManager,
    // GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
