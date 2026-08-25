import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseOverlay } from './base-overlay';

describe('BaseOverlay', () => {
  let component: BaseOverlay;
  let fixture: ComponentFixture<BaseOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
