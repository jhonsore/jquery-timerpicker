(function($){
	//
	$.fn.timerpicker = function( method )
	{
		var methods =
		{
			init :										function( options ){ 			return this.each(function(){	_init(this, options);});}
		};
		
		//----------------------------------------------------------------------
		//----------------------------------------------------------------------
		var defaults =
		{
			setTime					: false,
			activate						: function() {}
		};
		
		var boilerplate_settings;
		var boilerplate_element;

		//----------------------------------------------------------------------
		//----------------------------------------------------------------------

		// Method calling logic
		if ( methods[method] )//caso exista um método, esse método é chamado
		{
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof method === 'object' || ! method )//caso não exista um método ou seja apenas passado o objeto
		{
			return methods.init.apply( this, arguments );
		}
		else//caso o método não exista
		{
		  $.error( 'Method ' +  method + ' does not exist on jQuery.timerpicker' );
		}
		
		function _init($this, options)
		{
			boilerplate_element 						= $($this);
			boilerplate_settings 						= $.extend(defaults, options);				
			_initialize();
			_activate();
			_insertCSS();
		}
		
		function _initialize()
		{
			boilerplate_element.click(_open);

		}

		function _forceNumeric ()
		{
 			var $input = $(this);
 			var _val = $input.val().replace(/[^\d]+/g,'');
 				_val = (_val <10) ? '0'+_val:_val;

    		$input.val(_val);
		}

		function _open ()
		{
			if(!$('.ui-timerPicker',boilerplate_element).length)
			{
				boilerplate_element.css('position','relative');
				boilerplate_element.append(_getTemplateHtml());

				$('.ui-timerPicker-input',boilerplate_element).on('keyup', _forceNumeric);
				$('.ui-timerPicker-plus',boilerplate_element).click(_incrementTime);
				$('.ui-timerPicker-minus',boilerplate_element).click(_decreaseTime);
				$('.ui-timerPicker-input',boilerplate_element).val('00');

				var $el = $('.ui-timerPicker',boilerplate_element);
				$el.css('top',boilerplate_element.height());
			}
		}

		function _incrementTime ()
		{
			
		}

		function _decreaseTime ()
		{
			
		}

		function _getTemplateHtml ()
		{
			var _html_ = '<div class="ui-timerPicker">';
					_html_ += '<div class="ui-timerPicker-content">';
						_html_ += '<div class="ui-timerPicker-time">';
							_html_ += '<div class="ui-timerPicker-value">';
								_html_ += '<input type="text" class="ui-timerPicker-input">';
							_html_ += '</div>';
							_html_ += '<div class="ui-timerPicker-number-picker">';
								_html_ += '<button class="ui-timerPicker-plus"></button>';
								_html_ += '<button class="ui-timerPicker-minus"></button>';
							_html_ += '</div>';
						_html_ += '</div>';
					_html_ += '</div>';
				_html_ += "</div>";

			return _html_;
		}

		function _insertCSS ()
		{

			if(!$('body').hasClass('timerpicker-css-added'))
			{
				$('body').addClass('timerpicker-css-added');
				var _style = '<style type="text/css">';
				
				_style += '.ui-timerPicker{ position:absolute; width:100%; border:1px solid #999999; left:-1px;}'; 
				_style += '.ui-timerPicker-content{ padding:10px;}'; 
				_style += '.ui-timerPicker-time{ border:1px solid #999999;}'; 
				_style += '.ui-timerPicker-value{ display:inline-block; height:30px;}'; 
				_style += '.ui-timerPicker-input{ border:none;}'; 
				_style += '.ui-timerPicker-number-picker{ display:inline-block; height:30px;}'; 
				_style += '.ui-timerPicker-plus{ display:block}'; 
				
			
				_style +='</style>';
				$('head').append(_style);
			}
			
		}
		
		function _activate () {
			boilerplate_settings.activate.call(this, {});
		}
    
	};//-------------------------------
})(jQuery);
