//  Module Imports:
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AgmCoreModule } from '@agm/_dev/packages/core';

//  Comopnent Imports
import { AppComponent } from './app.component';

//  Misc. Imports
import { environment } from '../environments/environment';
import { MapComponent } from './components/map/map.component';
import { PointService } from './services/point.service';
import { PolygonService } from './services/polygon.service';
import { MapService } from './services/map.service';


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
    BrowserModule
  ],
  providers: [
    PointService,
    PolygonService,
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
