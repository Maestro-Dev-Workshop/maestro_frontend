import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCell } from './map-cell';

describe('MapCell', () => {
  let component: MapCell;
  let fixture: ComponentFixture<MapCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
