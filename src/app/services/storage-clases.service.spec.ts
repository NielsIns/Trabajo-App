import { TestBed } from '@angular/core/testing';

import { StorageClasesService } from './storage-clases.service';

describe('StorageClasesService', () => {
  let service: StorageClasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageClasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
