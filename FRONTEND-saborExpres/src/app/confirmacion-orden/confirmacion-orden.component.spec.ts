import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionOrdenComponent } from './confirmacion-orden.component';

describe('ConfirmacionOrdenComponent', () => {
  let component: ConfirmacionOrdenComponent;
  let fixture: ComponentFixture<ConfirmacionOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionOrdenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
