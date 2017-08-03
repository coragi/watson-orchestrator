(function($){

	var $messages = $('.messages-content'),
		d, h, m,
		i = 0;

	$(window).on('load', function() {
	  $messages.mCustomScrollbar();
	  
	  ChatService.registraListenerConversa(receivedMessageFromServer);
	  
	  setTimeout(function() {
		sendMessageToServer();
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
		insertMessage();
		return false;
	  }
	})

	function receivedMessageFromServer(msg) {
		$('.message.loading').remove();
		
		var $messageContainer = $('<div class="message new"><figure class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" /></figure>' + msg + '</div>')
			.appendTo($('.mCSB_container')).addClass('new');
			
		var $magicButtons = $messageContainer.find('> button');
		$magicButtons.click(function(){
			$magicButtons.remove();
			insertMessage($(this).text());
		});		
			
		setDate();
		updateScrollbar();
		i++;
	}

	function sendMessageToServer(msg) {
	  if ($('.message-input').val() != '') {
		return false;
	  }
	  $('<div class="message loading new"><figure class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" /></figure><span></span></div>').appendTo($('.mCSB_container'));
	  updateScrollbar();
	  
	  ChatService.mensagem(msg)
	}		
	
})(jQuery);