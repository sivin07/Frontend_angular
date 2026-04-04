import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Labtestcompleted } from './labtestcompleted';

describe('Labtestcompleted', () => {
  let component: Labtestcompleted;
  let fixture: ComponentFixture<Labtestcompleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Labtestcompleted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Labtestcompleted);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
