import { TestBed } from '@angular/core/testing';
import { AssignmentService } from './assignment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AssignmentService', () => {
  let service: AssignmentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AssignmentService]
    });
    service = TestBed.inject(AssignmentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});