import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetMusicCell } from './sheet-music-cell';

describe('SheetMusicCell', () => {
  let component: SheetMusicCell;
  let fixture: ComponentFixture<SheetMusicCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetMusicCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetMusicCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
