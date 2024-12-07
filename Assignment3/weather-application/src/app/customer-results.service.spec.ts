import { TestBed } from '@angular/core/testing';

import { CustomerResultsService } from './customer-results.service';

describe('CustomerResultsService', () => {
  let service: CustomerResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
