import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthBackground } from './auth-background';

describe('AuthBackground', () => {
  let component: AuthBackground;
  let fixture: ComponentFixture<AuthBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthBackground]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthBackground);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
