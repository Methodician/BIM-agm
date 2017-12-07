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
// import { GoogleMapsAPIWrapper } from '@agm/_dev/packages/core/services/google-maps-api-wrapper';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'bim-earth'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyChU-B6alfi0jRmSeYMqbenOVpbDo6DYNM'
    }),
    AgmJsMarkerClustererModule,
    BrowserModule
  ],
  providers: [
    PointService,
    PolygonService,
    MapService,
    ClusterManager
    // GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
