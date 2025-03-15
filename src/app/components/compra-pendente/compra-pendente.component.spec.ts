import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraPendenteComponent } from './compra-pendente.component';

describe('CompraPendenteComponent', () => {
  let component: CompraPendenteComponent;
  let fixture: ComponentFixture<CompraPendenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraPendenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraPendenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
