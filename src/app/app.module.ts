//  Module Imports:
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AgmCoreModule } from '@agm/core';

//  Comopnent Imports
import { AppComponent } from './app.component';

//  Misc. Imports
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
