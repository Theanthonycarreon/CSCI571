import { TestBed } from '@angular/core/testing';

import { TempChartService } from './temp-chart.service';

describe('TempChartService', () => {
  let service: TempChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
