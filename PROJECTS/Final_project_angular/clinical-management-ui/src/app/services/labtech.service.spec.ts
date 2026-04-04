import { TestBed } from '@angular/core/testing';

import { LabtechService } from './labtech.service';

describe('LabtechService', () => {
  let service: LabtechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabtechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
