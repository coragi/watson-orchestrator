import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WatsonService {

  // URL para localhost (pra dev)
  // mudar para vazio quando for pra producao
  private URL_server: string = 'http://localhost:3000';
  // variavel que armazena o contexto de uma conversa
  private context: Object;

  constructor(private http: Http) {
    this.context = {}; // inicia o contexto
  }

  msgParaWatson(msg: string) {
    var payload = {
      input: { 'text': msg },
      context: this.context
    };

    return this.http.post(this.URL_server + '/api/conversation', JSON.stringify(payload))
      .map((res: Response) => {
        this.context = res.json().context;
        return res.json();
      });
  }

  analiseNLU(texto: string) {
    return this.http.get(this.URL_server + '/api/nlu')
      .map(res => res.json());
  }
    
  pesquisaDiscovery(termo: string) {
    //a API criada no servidor que consulta o Discovery estah preparada para jogar 
    //direto o termo que vier aqui
    //entao, para pesquisas cognitivas, eh aqui que ela tem q ser montada
    //exemplo: 'enriched_text.entities.text:Noam Chomsky'
    return this.http.get(this.URL_server + '/api/discovery/' + termo)
      .map(res => res.json());
  }

  // Get all posts from the API - metodo de exemplo
  getAllPosts() {
    return this.http.get(this.URL_server + '/api/msgs')
      .map(res => res.json());
  }
}
