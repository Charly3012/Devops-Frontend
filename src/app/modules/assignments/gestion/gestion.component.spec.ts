import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionComponent } from './gestion.component';
import { AssignmentService } from '../services/assignment.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GestionComponent', () => {
  let component: GestionComponent;
  let fixture: ComponentFixture<GestionComponent>;
  let assignmentServiceSpy: jasmine.SpyObj<AssignmentService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AssignmentService', ['getAssignments', 'getAssignmentById', 'createAssignment', 'updateAssignment', 'deleteAssignment']);

    await TestBed.configureTestingModule({
      declarations: [ GestionComponent ],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: AssignmentService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionComponent);
    component = fixture.componentInstance;
    assignmentServiceSpy = TestBed.inject(AssignmentService) as jasmine.SpyObj<AssignmentService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load assignments on init', () => {
    assignmentServiceSpy.getAssignments.and.returnValue(of({ data: { data: [], current_page: 1, last_page: 1 } }));
    component.ngOnInit();
    expect(assignmentServiceSpy.getAssignments).toHaveBeenCalled();
  });
});
