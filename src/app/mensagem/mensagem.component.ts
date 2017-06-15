import { Component, OnInit } from '@angular/core';
import { WatsonService } from '../watson.service';

@Component({
  selector: 'app-mensagem',
  templateUrl: './mensagem.component.html',
  styleUrls: ['./mensagem.component.css']
})
export class MensagemComponent implements OnInit {
  // instantiate posts to an empty array
  msgs: any;

  constructor(private watsonService: WatsonService) { }

  ngOnInit() {
    // Retrieve posts from the API
    this.watsonService.pesquisaDiscovery('algoritmo').subscribe(msgs => {
      console.log(msgs);
      this.msgs = msgs.results;
    });
  }
}