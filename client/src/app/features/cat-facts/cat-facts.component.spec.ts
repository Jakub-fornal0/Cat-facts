import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatFactsComponent } from './cat-facts.component';

describe('CatFactsComponent', () => {
  let component: CatFactsComponent;
  let fixture: ComponentFixture<CatFactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatFactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatFactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
