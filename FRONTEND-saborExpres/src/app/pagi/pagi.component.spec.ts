import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagiComponent } from './pagi.component';

describe('PagiComponent', () => {
  let component: PagiComponent;
  let fixture: ComponentFixture<PagiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
