import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShinyBtn } from './shiny-btn';

describe('ShinyBtn', () => {
  let component: ShinyBtn;
  let fixture: ComponentFixture<ShinyBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShinyBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShinyBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
