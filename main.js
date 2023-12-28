$(document).ready(function(){
	var steps = $(".form").children(".step");
	$(steps).hide(); 	
	$(steps[0]).show();		
	var current_step = 0;	
	getValuesFromJson();	//Сразу после загрузки страницы подгружаем из json информацию во 2 шаг

	function Validation() {		//В ТЗ было указано, что можно Jquery, но не было ничего сказано про Jquery-плагины, поэтому я написал свою валидацию.
		let letters_only_regexp =  new RegExp("^[A-zА-яЁё]+$");		//Регулярное выражение "только буквы"
		let email_regexp = new RegExp("^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$");	//Регулярное выражение для е-мейла
		let password_regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/g;	//Регулярное выражение "Как минимум 1 заглавная буква, 1 строчная буква, 1 спец. символ и 1 цифра"

		$(".form form input").each(function(){	
			let name = $(this).attr("name");
			if ($(this).prop("required") && $(this).val() == "") {	
				$(this).after("<span class='error'>This field is required!</span>");
				$(this).addClass("error_field");

			}else{	
				if (name == "first_name" || name == "last_name"){	
					if(!$(this).val().match(letters_only_regexp)){	
						$(this).after("<span class='error'>Must be only letters!</span>");
						$(this).addClass("error_field");
						return false;
					}
				}else if (name == "email") {	
					if (!$(this).val().match(email_regexp)) {	
						$(this).after("<span class='error'>Must be like email!</span>");
						$(this).addClass("error_field");
						return false;
					}
				}else if (name == "password") {	
					if (!$(this).val().match(password_regexp)) {	
						$(this).after("<span class='error'>Must be at least one number, uppercase and lowercase, one special character</span>");
						$(this).addClass("error_field");
						return false;
					}else{
						if ($("#password").val() != $("#password_confirm").val()) {
							$("#password_confirm").after("<span class='error'>Passwords aren't equal!</span>");
							$("#password_confirm").addClass("error_field");
							return false;
						}else{
							$(".form").animate({
								"margin-left" : -4000,
							}, 500, function(){
								changeStep(current_step);
								$(".form").animate({
									"margin-left" : 0,
								}, 500);
							});
							
						}
					}
				}	
			}
		});	
	}


	function getValuesFromJson(){	//Работает с данным джсоном из ТЗ,  заполняет получеными данными селекты
		let obj = '{"Sales":["Sales Manager","Account Manager"],"Marketing":["Creative Manager","Marketing Coordinator","Content Writer"],"Technology":["Project Manager","Software Developer","PHP programmer","Front End","Quality Assurance"]}';

		obj =  JSON.parse(obj); 
		let html;
		let vacancy;
		
  		for (let key in obj){
  			departments += "<option value='" + key + "'>" + key + "</option>";
  		}
  		$("#departments").html("<option value='' id='null'>Departments</option>" + departments);

  		$("#departments").change(function(){
  			$("#null").remove();
  			$("#vacancy").removeAttr("disabled");
  			changeDepartment(obj);
  		});
	}

	function changeDepartment(obj){		//Запоняет значения поля вакансии в зависимости от поля отдела
		let department = $("#departments").val();
		vacancy = "";
		  for(let key in obj[department]){      
		    vacancy += "<option value='" + obj[department][key] + "'>" + obj[department][key] + "</option>";
		  }
		  $("#vacancy").html(vacancy);
	}

	function getData(){		//Собирает данные из заполненых полей и выводит в таблицу на последнем шаге
		let inputs = [$("#first_name").val() + " " + $("#last_name").val(), $("#login").val(), $("#email").val(), $("#company_name").val(), $("#departments").val(), $("#vacancy").val(), $("#password").val()];
	    let tr = $('#step_3 tr td:nth-child(2)');
	    tr.each(function(index){
	        $(this).html(inputs[index]);
	    });
		$("#send").click(function(){	//Запись в localStorage при отправке и попап с благодарностью
			let inputs = [$("#first_name").val() + " " + $("#last_name").val(), $("#login").val(), $("#email").val(), $("#company_name").val(), $("#departments").val(), $("#vacancy").val(), $("#password").val()];
  			localStorage.setItem(inputs, inputs);
  			$(".popup_wrapper").css("display", "flex");
	  		$(".popup_wrapper").animate({
	  			opacity : 1,
	  		}, 2000, function(){
	  			setTimeout(function(){
	  				$(".popup_wrapper").animate({
		  				opacity : 0,
		  			}, 2000, function(){
		  				$(".popup_wrapper").hide();
		  			});
	  			}, 4000);
	  		});
	  	});
	}

	function changeStep(i){		//Увеличивает шаг на 1, если на последнем шаге, то выводит данные
		$(steps).hide();
		i++;
		if (i == 2) {
			if ($("#departments").val() == "") {
				i = 1;
				$("#departments")
				$("#departments").after("<span class='error'>Select something is required!</span>");
				$("#departments").addClass("error_field");			
			}
	  		getData();
	  	}
		current_step = i;
		$(steps[i]).show();
	}

	$(".next_step").click(function(){	//Обработчик клика по кнопке перехода между шагами
		$(".error").remove();
		$("input").removeClass("error_field");
		$("select").removeClass("error_field");
		Validation();
	});

  	$("#edit").click(function(){	//Если решили изменить данные
  		$(".form").animate({
  			"margin-left" : -4000,
  		},500, function(){
  			inputs = [];
  			$(steps).hide();
			$(steps[0]).show();
			current_step = 0;
			$(".form").animate({
	  			"margin-left" : 0,
	  		},500);
	  	});
  	});
});
