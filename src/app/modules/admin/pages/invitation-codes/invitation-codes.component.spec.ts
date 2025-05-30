import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationCodesComponent } from './invitation-codes.component';

describe('InvitationCodesComponent', () => {
  let component: InvitationCodesComponent;
  let fixture: ComponentFixture<InvitationCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
