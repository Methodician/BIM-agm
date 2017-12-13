import { Injectable } from '@angular/core';

import * as data from 'assets/geojson/natural-earth-mapshaper/ne_10m_admin_0_countries.json';


@Injectable()
export class JsonImportService {

  constructor() { }

  getData(){
    let output = <any>data;
    // const firstCoords = output.features[0].geometry.coordinates[0][0][0];
    // console.log(firstCoords);
    // output.features[0].geometry.coordinates[0][0].push(firstCoords);
    return output;
  }

}
