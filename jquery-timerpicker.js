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
			setTime					: false,//put current time in timer picker text
			activate				: function() {}//timer ativated
		};
		
		var boilerplate_settings;
		var boilerplate_element;

		//----------------------------------------------------------------------
		//----------------------------------------------------------------------

		// Method calling logic
		if ( methods[method] )
		{
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof method === 'object' || ! method )
		{
			return methods.init.apply( this, arguments );
		}
		else
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
			_create();
		
			$(window).mousedown(_checkClose);
			$(window).click(_checkClose);
		}

		function _checkClose (__evt__)
		{
			var _check = $(__evt__.target).closest('.ui-timerPicker');
			console.log('close');
			if(!_check.length && !boilerplate_element.is($(__evt__.target)))
			{
				_close();
			}
		}

		function _close ()
		{
			if($('.ui-timerPicker-on').length)
			{
				$('.ui-timerPicker-wrapper',$('.ui-timerPicker-on')).hide();
				$('.ui-timerPicker-on').removeClass('ui-timerPicker-on');
			}
		}

		function _forceNumeric (__evt__)
		{
			evt = __evt__ || window.event;
		    var charCode = evt.keyCode || evt.which;
		    var charStr = String.fromCharCode(charCode);

		    //let's add just numbers
		    if(charCode >=48 && charCode <= 57)
		    {
				var $input = $(this);

				var _max = ($input.closest('.ui-timerPicker-hour').length) ? 23 : 59;

	 			var _val = $input.val();
	 			var _newChar = charStr.replace(/[^\d]+/g,'');
	 			var _replace = _val.charAt(1)+_newChar;
	 			_replace = (Number(_replace) > _max) ? '00' : _replace;

	    		_changeValue (this,_replace);
		    }
		    else if (charCode == 38 || charCode == 39)//key up
		    {
		    	_incrementTime (this);
		    }
		    else if (charCode == 40 || charCode == 37)//key down
		    {
				_decreaseTime(this);
		    }
 			
		}

		function _create()
		{
			boilerplate_element.css('position','relative');
			boilerplate_element.append(_getTemplateHtml());
			_addEvents ();
			$('.ui-timerPicker-choice',boilerplate_element).click(function(){_open(this);});

			if(boilerplate_settings.setTime)
			{
				var _dt = new Date();
				var _hour = (_dt.getHours() <= 9) ? "0"+_dt.getHours()  : _dt.getHours() ;
				var _minutes = (_dt.getMinutes() <= 9) ? '0'+_dt.getMinutes() : _dt.getMinutes();
				var _time = _hour+ ":" + _minutes;
				$('.ui-timerPicker-choice-text',boilerplate_element).html(_time);
				$('.ui-timerPicker-hour .ui-timerPicker-input',boilerplate_element).val(_hour);
				$('.ui-timerPicker-minute .ui-timerPicker-input',boilerplate_element).val(_minutes);
			}
		}

		function _open (__el__)
		{
			_close ();
			$('.ui-timerPicker-wrapper',$(__el__).closest('.ui-timerPicker')).show();
			$(__el__).parent().addClass('ui-timerPicker-on');
		}

		function _addEvents ()
		{
			$('.ui-timerPicker-input',boilerplate_element).on('keyup', _forceNumeric);
				$('.ui-timerPicker-plus',boilerplate_element).click(function(){_incrementTime(this);});
				$('.ui-timerPicker-minus',boilerplate_element).click(function(){_decreaseTime(this);});
				$('.ui-timerPicker-input',boilerplate_element).val('00');

				$('.ui-timerPicker-input',boilerplate_element).attr('maxlength','2');

				var $el = $('.ui-timerPicker-wrapper',boilerplate_element);
				$el.css('top',boilerplate_element.height());
				var $choice = $('.ui-timerPicker-choice',boilerplate_element);
				$choice.css('height',boilerplate_element.height());
		}

		function _incrementTime (__el__)
		{
			var $el = $(__el__);
			var _max = ($el.closest('.ui-timerPicker-hour').length) ? 23 : 59;
			var _input = $el.closest('.ui-timerPicker-time').find('.ui-timerPicker-input');
			var _newvalue = Number(_input.val())+1;
			_newvalue = (_newvalue < 10) ? String('0'+_newvalue) : _newvalue;
			_newvalue = (_newvalue > _max) ? String('00') : _newvalue;
			
			_changeValue (__el__,_newvalue);
		}

		function _decreaseTime (__el__)
		{
			var $el = $(__el__);
			var _max = ($el.closest('.ui-timerPicker-hour').length) ? 23 : 59;
			var _input = $el.closest('.ui-timerPicker-time').find('.ui-timerPicker-input');
			var _newvalue = Number(_input.val())-1;
			
			_newvalue = (_newvalue < 0) ? String(_max) : _newvalue;
			_newvalue = (_newvalue < 10) ? String('0'+_newvalue) : _newvalue;

			_changeValue (__el__,_newvalue);
		}

		function _changeValue (__el__,__newvalue)
		{
			var $el = $(__el__);
			var _input = $el.closest('.ui-timerPicker-time').find('.ui-timerPicker-input');
			_input.val(__newvalue);
			_input.focus();

			var _hour = $('.ui-timerPicker-hour .ui-timerPicker-input',boilerplate_element).val();
			var _minute = $('.ui-timerPicker-minute .ui-timerPicker-input',boilerplate_element).val();
			var _formated_time = _hour+" : "+_minute;
			$('.ui-timerPicker-choice-text',boilerplate_element).html(_formated_time);

		}

		function _getTemplateHtml ()
		{
			var _html_ = '<div class="ui-timerPicker">';
					_html_ += '<div class="ui-timerPicker-choice">';
						_html_ += '<span class="ui-timerPicker-choice-text">00:00</span>';
					_html_ += '</div>';
					_html_ += _getTimerPickerWrapper();
				_html_ += "</div>";

			return _html_;
		}

		function _getTimerPickerWrapper()
		{
			var _html_ = '<div class="ui-timerPicker-wrapper">';
				_html_ += '<div class="ui-timerPicker-content">';
					_html_ += '<div class="ui-timerPicker-time ui-timerPicker-hour">';
						_html_ += '<div class="ui-timerPicker-value">';
							_html_ += '<input type="text" tabindex="1" class="ui-timerPicker-input">';
						_html_ += '</div>';
						_html_ += '<div class="ui-timerPicker-number-picker">';
							_html_ += '<button class="ui-timerPicker-plus ui-timerPicker-button"><em></em></button>';
							_html_ += '<button class="ui-timerPicker-minus ui-timerPicker-button"><em></em></button>';
						_html_ += '</div>';
					_html_ += '</div>';
					_html_ += '<div class="ui-timerPicker-separator">:</div>';
					_html_ += '<div class="ui-timerPicker-time ui-timerPicker-minute">';
						_html_ += '<div class="ui-timerPicker-value">';
							_html_ += '<input type="text" tabindex="2" class="ui-timerPicker-input">';
						_html_ += '</div>';
						_html_ += '<div class="ui-timerPicker-number-picker">';
							_html_ += '<button class="ui-timerPicker-plus ui-timerPicker-button"><em></em></button>';
							_html_ += '<button class="ui-timerPicker-minus ui-timerPicker-button"><em></em></button>';
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
				
				_style += '.ui-timerPicker-wrapper{ display:none; position:absolute; width:100%; border:1px solid #999999; left:-1px;}'; 
				_style += '.ui-timerPicker-content{ padding: 5px 10px;}'; 
				_style += '.ui-timerPicker-time{ width:40%; border:1px solid #999999; position:relative; display:inline-block;}'; 
				_style += '.ui-timerPicker-value{ display:inline-block; height:20px;}'; 
				_style += '.ui-timerPicker-input{ font-family: sans-serif; font-size:12px; border:none; outline:none; width:20px; padding:3px 0 0 5px;}'; 
				_style += '.ui-timerPicker-number-picker{ display:inline-block; height:20px; position:absolute; top:0; right:0;}'; 
				_style += '.ui-timerPicker-button{ margin-top:2px;  outline:none; display:block;-webkit-appearance: none; -moz-appearance: none; appearance: none; border-radius: 0; -webkit-border-radius: 0; -moz-border-radius: 0; background:none; border:none;}'; 
				_style += '.ui-timerPicker-plus em{ cursor:pointer; display:block; width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 4px solid #333333;}'; 
				_style += '.ui-timerPicker-minus em{ cursor:pointer; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 4px solid #333333;}'; 
				_style += '.ui-timerPicker-separator{ padding:5px 10px; display:inline-block;}'; 
				_style += '.ui-timerPicker-choice-text{ cursor:pointer; font-family: sans-serif; font-size:12px; display:block; padding: 3px 0 0 10px;}'; 
			
				_style +='</style>';
				$('head').append(_style);
			}
			
		}
		
		function _activate () {
			boilerplate_settings.activate.call(this, {});
		}
    
	};//-------------------------------
})(jQuery);
