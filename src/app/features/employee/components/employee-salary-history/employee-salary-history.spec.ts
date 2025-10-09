import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryHistory } from './employee-salary-history';

describe('EmployeeSalaryHistory', () => {
  let component: EmployeeSalaryHistory;
  let fixture: ComponentFixture<EmployeeSalaryHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalaryHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalaryHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
