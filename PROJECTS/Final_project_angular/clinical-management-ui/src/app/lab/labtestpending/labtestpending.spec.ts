import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Labtestpending } from './labtestpending';

describe('Labtestpending', () => {
  let component: Labtestpending;
  let fixture: ComponentFixture<Labtestpending>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Labtestpending]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Labtestpending);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
