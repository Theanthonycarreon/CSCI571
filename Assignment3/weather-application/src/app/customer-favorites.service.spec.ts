import { TestBed } from '@angular/core/testing';

import { CustomerFavoritesService } from './customer-favorites.service';

describe('CustomerFavoritesService', () => {
  let service: CustomerFavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerFavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
