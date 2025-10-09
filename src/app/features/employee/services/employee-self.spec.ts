import { TestBed } from '@angular/core/testing';

import { EmployeeSelf } from './employee-self';

describe('EmployeeSelf', () => {
  let service: EmployeeSelf;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeSelf);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
