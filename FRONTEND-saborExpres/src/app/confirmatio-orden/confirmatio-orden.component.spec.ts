import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmatioOrdenComponent } from './confirmatio-orden.component';

describe('ConfirmatioOrdenComponent', () => {
  let component: ConfirmatioOrdenComponent;
  let fixture: ComponentFixture<ConfirmatioOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmatioOrdenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmatioOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
