import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsSkeletonComponent } from './comments-skeleton.component';

describe('CommentsSkeletonComponent', () => {
  let component: CommentsSkeletonComponent;
  let fixture: ComponentFixture<CommentsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
