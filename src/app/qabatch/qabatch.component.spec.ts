/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QABatchComponent } from './qabatch.component';

describe('QABatchComponent', () => {
  let component: QABatchComponent;
  let fixture: ComponentFixture<QABatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QABatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QABatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
