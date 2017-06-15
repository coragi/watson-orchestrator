import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagemComponent } from './mensagem.component';

describe('MensagemComponent', () => {
  let component: MensagemComponent;
  let fixture: ComponentFixture<MensagemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensagemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
