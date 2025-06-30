import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizatorRequestsComponent } from './organizator-requests.component';

describe('OrganizatorRequestsComponent', () => {
  let component: OrganizatorRequestsComponent;
  let fixture: ComponentFixture<OrganizatorRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizatorRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizatorRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
