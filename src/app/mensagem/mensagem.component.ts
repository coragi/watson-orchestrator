import { Component, OnInit, Input } from '@angular/core';
import { Mensagem } from './mensagem.model';

@Component({
  selector: 'app-mensagem',
  templateUrl: './mensagem.component.html',
  styleUrls: ['./mensagem.component.css']
})
  
export class MensagemComponent implements OnInit {
  @Input() mensagem: Mensagem;
  
  ngOnInit() {
  }

}
