(function($){

	var $messages = $('.messages-content'),
		d, h, m,
		i = 0;
	
	var ICON_URL = 'http://findicons.com/files/icons/1790/large_android/32/classic_robot.png';

	$(window).on('load', function() {
	  $messages.mCustomScrollbar();
	  
	  ChatService.registraListenerConversa(receivedMessageFromServer);
	  
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
	})

	function receivedMessageFromServer(msg) {
		$('.message.loading').remove();
		$('.chat').removeClass('login-pendente');
		
		var $mainContainer = $('.mCSB_container');
		
		var $messageContainer = $(renderServerMessage(msg))
			.appendTo($mainContainer).addClass('new');
				
		$messageContainer.find('> p').remove().each(function(){
			var $paragraphContainer = $(renderServerMessage(this.innerHTML))
				.appendTo($mainContainer).addClass('new');
			decorateMessageContainer($paragraphContainer);
		});

		decorateMessageContainer($messageContainer);
			
		setDate();
		updateScrollbar();
		i++;
		
		$('.message-input').focus();
	}

	function sendMessageToServer(msg) {
	  $(renderServerMessage('<span></span>')).addClass('loading').appendTo($('.mCSB_container'));
	  updateScrollbar();
	  
	  ChatService.mensagem(msg)
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
		var $magicButtons = $container.find('> button, > p > button');
		if ($magicButtons.length) {
			disableTyping();
			$magicButtons.click(function(){
				enableTyping();
				$magicButtons.remove();
				insertMessage($(this).text());
			});
		}
	}	
	
})(jQuery);