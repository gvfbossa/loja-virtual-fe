import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailDestaqueComponent } from './thumbnail-destaque.component';

describe('ThumbnailDestaqueComponent', () => {
  let component: ThumbnailDestaqueComponent;
  let fixture: ComponentFixture<ThumbnailDestaqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThumbnailDestaqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailDestaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
