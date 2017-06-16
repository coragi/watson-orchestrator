import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MensagemComponent } from './mensagem/mensagem.component';
import { WatsonService } from './watson.service';

// Define the routes
// a principio, qq rota envia para o componente AppComponent
// Por simplicidade, retirei o router
// const ROUTES = [
//   {
//     path: '',
//     redirectTo: 'app',
//     pathMatch: 'full'
//   },
//   {
//     path: 'app',
//     component: AppComponent
//   }
// ];

@NgModule({
  declarations: [
    AppComponent,
    MensagemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
//    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [WatsonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
