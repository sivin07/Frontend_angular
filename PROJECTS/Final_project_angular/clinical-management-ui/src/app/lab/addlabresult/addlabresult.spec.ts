import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addlabresult } from './addlabresult';

describe('Addlabresult', () => {
  let component: Addlabresult;
  let fixture: ComponentFixture<Addlabresult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addlabresult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addlabresult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
