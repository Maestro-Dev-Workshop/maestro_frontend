import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamingUpload } from './naming-upload';

describe('NamingUpload', () => {
  let component: NamingUpload;
  let fixture: ComponentFixture<NamingUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NamingUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NamingUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
