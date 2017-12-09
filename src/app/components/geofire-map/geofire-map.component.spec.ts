import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofireMapComponent } from './geofire-map.component';

describe('GeofireMapComponent', () => {
  let component: GeofireMapComponent;
  let fixture: ComponentFixture<GeofireMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeofireMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofireMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
