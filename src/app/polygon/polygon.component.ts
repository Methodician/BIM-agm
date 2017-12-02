import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.css']
})
export class PolygonComponent implements OnInit {
  @Input() path;
  @Output() polyClick = new EventEmitter();
  points = [];
  editable = true;
  constructor() { }

  ngOnInit() {
    this.points = this.path.points;
  }

  click(e) {
    this.polyClick.emit(this.points);
  }

  get currentPath() {
    return this.path;
  }



}
