import { TestBed } from '@angular/core/testing';

import { MeteogramService } from './meteogram.service';

describe('MeteogramService', () => {
  let service: MeteogramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeteogramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
