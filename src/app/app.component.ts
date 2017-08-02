import { Component, EventEmitter, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Mensagem } from './mensagem/mensagem.model';
import { WatsonService } from './watson.service';
import { Observable } from 'rxjs';

//importa as variaveis de ambiente
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewChecked {
  //referencia ao div das mensagens
  @ViewChild('myMensagens') myScrollContainer: ElementRef;
  //vetor de mensagens que aparece na tela
  mensagens: Mensagem[];

  constructor(private watsonService: WatsonService) {
    this.mensagens = [];
  }
  //apos cada atualizacao da view, manda o scroll pra ultima msg
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // metodo para fazer a ultima mensagem ficar visivel  
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
 
    //quando for apenas DISCOVERY, o chat é apenas um campo de pesquisa na base
    //assim, o usuario deve colocar a query completa se for usar enriched_text por exemplo
	/*
    if (environment.discovery_flag && !environment.nlu_flag && !environment.conversation_flag) {
      this.watsonService.pesquisaDiscovery(m.msg_usuario)
        .subscribe(
        (result_discovery: any) => {
          m.msg_watson = 'Resultados: ' + result_discovery.matching_results + '<br><br><b>Texto do resultado mais relevante:</b><br>'
            + result_discovery.results[0].text;
        }
        );
    }
	*/
  }
}
