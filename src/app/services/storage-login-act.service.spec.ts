import { TestBed } from '@angular/core/testing';

import { StorageLoginActService } from './storage-login-act.service';

describe('StorageLoginActService', () => {
  let service: StorageLoginActService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageLoginActService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
