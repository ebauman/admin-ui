import { TestBed } from '@angular/core/testing';

import { VmclaimService } from './vmclaim.service';

describe('VmclaimService', () => {
  let service: VmclaimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VmclaimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
