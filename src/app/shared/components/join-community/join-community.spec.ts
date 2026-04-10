import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinCommunity } from './join-community';

describe('JoinCommunity', () => {
  let component: JoinCommunity;
  let fixture: ComponentFixture<JoinCommunity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinCommunity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinCommunity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
