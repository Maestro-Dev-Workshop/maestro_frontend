import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadOverlay } from './file-upload-overlay';

describe('FileUploadOverlay', () => {
  let component: FileUploadOverlay;
  let fixture: ComponentFixture<FileUploadOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploadOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
