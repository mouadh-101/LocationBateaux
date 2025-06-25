import { TestBed } from '@angular/core/testing';

import { MokeDataService } from './moke-data.service';

describe('MokeDataService', () => {
  let service: MokeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MokeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
