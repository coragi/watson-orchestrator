import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment } from '../environments/environment';

@Injectable()
export class WatsonService {

  // URL das APIs - eh definida em environment.ts
  private URL_server: string = environment.apiURL;

  // variavel que armazena o contexto de uma conversa
  private context: Object;

  constructor(private http: Http) {
    this.context = {}; // inicializa o contexto
  }

  msgParaWatson(msg: string) {
    var payload = {
      input: { 'text': msg },
      context: this.context
    };
	
	let body = JSON.stringify(payload );
	let headers = new Headers({ 'Content-Type': 'application/json' });
	let options = new RequestOptions({ headers: headers });

    return this.http.post(this.URL_server + '/api/conversation', JSON.stringify(payload), options)
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
