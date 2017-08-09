(function($){

	var $messages = $('.messages-content'),
		d, h, m,
		i = 0;
	
	var ICON_URL = 'http://findicons.com/files/icons/1790/large_android/32/classic_robot.png';

	$(window).on('load', function() {
	  $messages.mCustomScrollbar();
	  
	  ChatService.registraListenerConversa(receivedEventFromServer);
	  
	  setTimeout(function() {
		login();
	  }, 100);
	});

	function updateScrollbar() {
	  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
		scrollInertia: 10,
		timeout: 0
	  });
	}

	function setDate(){
	  d = new Date()
	  if (m != d.getMinutes()) {
		m = d.getMinutes();
		$('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
	  }
	}
	
	function login() {
		if (!ChatService.isLoginPendente()) {
			ChatService.login();
			return;
		}
		
		var $nomeUsuario = $('.login input[name="nome_usuario"]');
		var nomeUsuario = ($nomeUsuario.val() || '').trim();
		if (nomeUsuario) {
			ChatService.login({
				nome_usuario: nomeUsuario
			});
		} else {
			$nomeUsuario.focus();
		}
	}

	function insertMessage(msg) {
		var msg = msg || $('.message-input').val();
		if ($.trim(msg) == '') {
			return false;
		}
		$('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
		setDate();
		$('.message-input').val(null);
		updateScrollbar();
		sendMessageToServer(msg);
	}

	$('.message-submit').click(function() {
	  insertMessage();
	});

	$(window).on('keydown', function(e) {
	  if (e.which == 13) {
		if (ChatService.isLoginPendente()) {
			login();
		} else {
			insertMessage();
		}
		return false;
	  }
	});
	
	function receivedEventFromServer(retorno, dados) {
		if (retorno.tipo == 'mensagem') {
			receivedMessageFromServer(retorno.texto, dados);
		} else if (retorno.tipo == 'pesquisa') {			
			receivedSearchResultsFromServer(retorno.resultados, dados);
		} else {
			console.error('Tipo de mensagem inesperado: ' + retorno.tipo, retorno);
		}
	}

	function receivedMessageFromServer(msg, dados) {
		$('.chat').removeClass('login-pendente');
		hideServerInProgress();
		
		var $mainContainer = $('.mCSB_container');
		
		var $messageContainer = $(renderServerMessage(msg))
			.appendTo($mainContainer).addClass('new');
				
		var $paragraphs = $messageContainer.find('> p').remove();
		decorateMessageContainer($messageContainer);

		if ($paragraphs.length) {
			showServerInProgress();
			
			iterateCollectionWithDelay($paragraphs, function(el){
				hideServerInProgress();
				
				var $paragraphContainer = $(renderServerMessage(el.innerHTML))
					.appendTo($mainContainer).addClass('new');
				decorateMessageContainer($paragraphContainer);
				
				showServerInProgress();
			}, hideServerInProgress);
		}
		
		$messageContainer.find('> pesquisa').remove().each(function(){
			var $this = $(this);
			var tipo = $this.attr('tipo');
			var pergunta = dados.input.text;
			ChatService.pesquisa(tipo, pergunta);
		});
			
		setDate();
		updateScrollbar();
		i++;
		
		$('.message-input').focus();
	}

	function receivedSearchResultsFromServer(resultados, dados) {
		var html = tim('<ul class="search-results">{{resultados}}</ul>', {
			resultados: resultados.map(function(res){
				return tim('<li class="search-result collapsed">' + 
					'<h3>{{titulo}}<i class="fa fa-angle-down"></i></h3>' + 
					'<fieldset><legend>Problema</legend><div>{{problema}}</div></fieldset>' +
					'<fieldset><legend>Solução</legend><div>{{solucao}}</div></fieldset>' +
					'</li>', res);
			}).join('\n')
		});
		
		receivedMessageFromServer(html);
	}
	
	function sendMessageToServer(msg) {
		showServerInProgress();
		ChatService.mensagem(msg)
	}
	
	function showServerInProgress() {
		$(renderServerMessage('<span></span>')).addClass('loading').appendTo($('.mCSB_container'));
		updateScrollbar();
	}
	
	function hideServerInProgress() {
		$('.message.loading').remove();
	}
	
	function disableTyping() {
		$('.chat').addClass('showing-modal');
	}
	
	function enableTyping() {
		$('.chat').removeClass('showing-modal');
	}
	
	function renderServerMessage(msg) {
		return tim('<div class="message new"><figure class="avatar"><img src="{{iconUrl}}" /></figure>{{msg}}</div>', {
			msg: msg,
			iconUrl: ICON_URL
		});
	}
	
	function decorateMessageContainer($container) {
		// Buttons
		var $magicButtons = $container.find('> button, > p > button');
		if ($magicButtons.length) {
			disableTyping();
			$magicButtons.click(function(){
				enableTyping();
				$magicButtons.remove();
				insertMessage($(this).text());
			});
		}
		
		// Videos
		var $videos = $container.find('video[ats-universidade]').each(function(){
			var $video = $(this);
			var path = $video.attr('ats-universidade');
			var fullPath = '/universidade/video/' + path;
			
			$video.attr({ controls: 'controls' }).css({
				width: '100%',
				'max-height': ($messages.height() - 8) + 'px'
			});
			
			$('<source type="video/mp4">').attr('src', fullPath).appendTo($video);
		});
		
		// Search results
		$container.find('.search-result > h3').click(function(){
			$(this).parent().toggleClass('collapsed');
		}).first().parent().removeClass('collapsed');
	}
	
	function iterateCollectionWithDelay(collection, callback, done) {
		var position = 0;
		
		function randomDelay(f) {
			window.setTimeout(f, 800 + Math.trunc(Math.random() * 800));
		}
		
		function next() {
			if (position < collection.length) {
				callback(collection[position]);
			}
			
			position++;			
			if (position < collection.length) {
				randomDelay(next);
			} else {
				done && done();
			}
		}
		
		randomDelay(next);
	}
	
})(jQuery);