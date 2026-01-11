import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionConfigOverlay } from './extension-config-overlay';

describe('ExtensionConfigOverlay', () => {
  let component: ExtensionConfigOverlay;
  let fixture: ComponentFixture<ExtensionConfigOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtensionConfigOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtensionConfigOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
