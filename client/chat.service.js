(function($){
	
	window.ChatService = new function ChatService() {
		
		var ENDERECO_API = location.protocol == 'file:' ? 
				'http://localhost:3000/api/' : 
				location.protocol + '//' + location.host + '/api/';
				
		// Procura por nome_usuario no hash da URL.
		var nomeUsuario = (/[#\?]nome_usuario=([^\?&]+)/.exec(location.hash) || [])[1];
		
		var contextoConversacao = {};
		var listenersConversa = [];
		
		this.mensagem = function(msg) {

			var payload = {
				input: {
					text: msg 
				},
				context: contextoConversacao
			};
			
			payload.context.nome_usuario = nomeUsuario;
			
			$.ajax(ENDERECO_API + 'conversation/', {
				data: JSON.stringify(payload), 
				contentType : 'application/json', 
				type : 'POST'
			}).done(function(dado){
				console.log('Retorno do servidor de conversação', dado);
				contextoConversacao = dado.context;
				listenersConversa.forEach(function(listener){
					listener(dado.output.text[0], dado);
				});
			}).fail(function(textStatus, errorThrown){
				console.error('Erro ao comunicar com o servidor de conversação', textStatus, errorThrown);
			});		
		
		};
		
		this.pesquisa = function(tipo, texto) {
			
			$.get(ENDERECO_API + 'discovery/' + (tipo || ''), {
				q: texto
			}).done(function(dado){
				console.log('Retorno do servidor de pesquisa', dado);
			}).fail(function(textStatus, errorThrown){
				console.error('Erro ao comunicar com o servidor de pesquisa', textStatus, errorThrown);
			});
			
		}
		
		this.registraListenerConversa = function(listener) {
			listenersConversa.push(listener);
		};

		this.isLoginPendente = function() {
			return !nomeUsuario;
		};
		
		this.login = function(dados) {
			if (dados) {
				nomeUsuario = dados.nome_usuario;
			}			
			this.mensagem('Olá');
		};
		
		function invocaListenersConversa(texto, dado) {
		}
		
	};
	
})(jQuery);