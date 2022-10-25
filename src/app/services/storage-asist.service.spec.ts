import { TestBed } from '@angular/core/testing';

import { StorageAsistService } from './storage-asist.service';

describe('StorageAsistService', () => {
  let service: StorageAsistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageAsistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
