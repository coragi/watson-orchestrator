import { Component, EventEmitter, OnInit, AfterViewChecked, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Mensagem } from './mensagem/mensagem.model';
import { WatsonService } from './watson.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnInit, AfterViewChecked {
  @ViewChild('myMensagens') myScrollContainer: ElementRef;
  //mensagens: EventEmitter<Mensagem[]> = new EventEmitter<Mensagem[]>();
  mensagens: Mensagem[];

  constructor(private watsonService: WatsonService) {
    this.mensagens = [];
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.scrollToBottom();

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }



  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  enviaMensagem(msg_usuario): void {
    //cria mensagem
    let m = new Mensagem(msg_usuario.value);

    //envia mensagem para a tela
    this.mensagens.push(m);

    //limpa o campo de mensagem
    msg_usuario.value = '';

    //envia mensagem para o Conversation
    this.watsonService.msgParaWatson(m.msg_usuario)
      .subscribe(
      (result: any) => {
        console.log("result", result);

        let retorno = result.output.text[0];
        if (retorno == 'pesquisar_discovery') {
          let term = result.input.text;
          //pesquisa no Discovery

          //enriquece no NLU
          // passa o texto para o NLU

         //montar a query para o Discovery com o resultado do NLU
         // term = "query=enriched_text.entities" + nlu_json.entities[0]; 
          this.watsonService.pesquisaDiscovery(term)
            .subscribe(
            (result_discovery: any) => {
              console.log("discovery", result_discovery);
              let num_resultados = result_discovery.matching_results;
              m.msg_watson = '<h3><span class="label label-primary">Pesquisei na minha base de conhecimento e encontrei <b>'
                + num_resultados + '</b> resultado(s). O mais relevante é:</h3></span><br>' + result_discovery.passages[0].passage_text;
              //result_discovery.passages[0].passage_text
            }
            );

        } else {
          m.msg_watson = '<h3><span class="label label-primary">' + result.output.text[0] + '</span></h3>';
          if (result.intents.length > 0) {
            m.intencao = '#' + result.intents[0].intent;
            m.confianca = result.intents[0].confidence;
          }
        }
      }
      );
  }
}
