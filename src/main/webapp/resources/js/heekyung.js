var hee=hee || {};

hee.common = (function(){
	var init = function(ctx){
		hee.session.init(ctx);
	};
	var onCreate=function(){
		setContextView();
		
	};
	var setContextView=function(){
		
	};
	
	return {
		init : init
	};
})();

hee.session = {
	init : function(ctx){
		sessionStorage.setItem('x',ctx);
		sessionStorage.setItem('j',ctx+'/resources/js');
		sessionStorage.setItem('i',ctx+'/resources/img');
		sessionStorage.setItem('c',ctx+'/resources/css');
	},
	getPath : function(x){
		return sessionStorage.getItem(x);
	}
};

var $$ = function(x){return hee.session.getPath(x);};


/*******************************
 * 예약페이지
 *******************************/
hee.rev = (function(){
	
	var $container, ctx, js, img;
	var init=function(x){
		js=$$('j');
		ctx=$$('x');
		img=$$('i');
		temp=js+'/template.js';
		var hostSerialNum=x;
		onCreate(hostSerialNum);
	};
	var onCreate=function(hostSerialNum){
		setContextView();
		//disable 달력 호출
		hee.logic.disable(hostSerialNum);
		
		var $menubar=$('#menubar');
		var $transBtn=$('#transBtn');
		var $searchBtn=$('#searchBtn');
		var $revBtn=$('#revBtn');
		var $review=$('#review');
		var $container=$('#container');
		var $rev_detail=$('#rev_detail');
		
		var menu = $('#menu').offset();
		$(window).scroll(function(){
			if($(document).scrollTop()>550){
				$('#menu').addClass('menufix').css({'width': '100%', 'margin-left':'0'});
				$('#menubar').css({'margin-left':'18%'});
			}else{
				$('#menu').removeClass('menufix').css({'width': '38%','margin-left':'18%'});
				$('#menubar').css({'margin-left':'0'});
			}
		});
		var rev = $('#revBar').offset();
		$(window).scroll(function(){
			if($(document).scrollTop()>550){
				$('#revBar').addClass('revfix').css({'margin-top': '0px'});
			}else{
				$('#revBar').removeClass('revfix').css({'margin-top': '-100px'});
			}
		});
		
		$.getScript(temp,()=>{
			
			var arr = ['개요','후기','호스트','위치'];
			$.each(arr, function(i,j){
				var x='#moveDiv'+i;
				var y='m'+i;
				compUI.aBtn(x,y)
					.text(j)
					.css({'font-size': '15px','margin-right':'15px', 'color':'black'})
					.appendTo($menubar);
			});
			$('a').on('click', function(event) { 
				if (this.hash !== "") { 
				  event.preventDefault(); 
				  var hash = this.hash; 
				  $('html, body').animate({scrollTop: $(hash).offset().top}, 800, function(){window.location.hash = hash;}); 
				}
			}); 
			//숙소 디테일 호출
			hee.logic.revdata(hostSerialNum);
			
			
			compUI.iBtn('trans')
				.val('이 설명을 한국어로 번역하기')
				.css({'width': '100%', 'height':'40px', 'border': '1px solid', 'text-align': 'center', 'vertical-align': 'middle', 'border-color': '#c4c4c4', 
					'background': 'white', 'font-size': '14px', 'border-radius': '4px', 'cursor': 'pointer', 'font-weight': 'bold', 'line-height': '1.43','outline-style': 'none'})
				.appendTo($transBtn)
				.click(e=>{
					alert('구현되지 않는 기능입니다.');
				});
			compUI.iBtn('search')
				.val('Go')
				.addClass('btn btn-danger')
				.css({'width':'50px','outline-style': 'none'})
				.appendTo($searchBtn)
				.click(e=>{
					hee.logic.reviewSearch(hostSerialNum);
				});
			
			//달력 시작
			$('#calender').after(reservation.cal());
			$('#pick-date-bar').css({'width': '500px','height': '40px','display': 'table-cell','vertical-align': 'middle','text-align': 'center','font-size': '16px','font-weight': '700',});
			$('#start-date').css({'float': 'left','width': '130px','text-align': 'left','margin-left': '20px',})
				.text('CHECK-IN');
			$('#end-date').css({'width': '130px','float': 'right','text-align': 'right','margin-right': '20px'})
				.text('CHECK-OUT');
			$('#calendar').css({'width': '100%','max-width': '400px'});
			
			var bean=[], date_disable=[];
			if(sessionStorage.getItem('checkday')==null){
				bean = ',';
	        	
			}else{
				var one = sessionStorage.getItem('checkday').split(',');
	            var two = sessionStorage.getItem('soldcount').split(',');
	        	for(var i=0; i<one.length;i++){
	        		var sold = (hee.logic.date_add(one[i],two[i])).split(',');
	        		bean += sold;
	        	};
        	};
        	
        	date_disable = bean.split(',');
			
			var startDate, endDate = '';
			$('#my-element').datepicker({
			    minDate: new Date(),
			    range: true,
			    onRenderCell: function (d, type) {
			    	if (type == 'day') {
		                var cellYear = d.getFullYear(),
		                    cellMonth = d.getMonth(),
		                    cellDate = d.getDate(),
		                    disabled = false,
		                    year, month, date;
		                if (cellDate == date) {
		                    disabled= true;
		                }
		                date_disable.forEach(function (date_disable) {
		                	date_disable = date_disable.split('-');
		                    year = date_disable[0];
		                    month = parseInt(date_disable[1]) - 1;
		                    date = parseInt(date_disable[2]);
		                    if (cellYear == year && cellMonth == month && cellDate == date) {
		                        disabled= true;
		                    }
		                });
		                return {
		                    disabled: disabled,
		                }
		            }
			    },
			    onSelect: function (fd, d, picker) {
			        function formatDate(date) {
			            var week = new Array('일', '월', '화', '수', '목', '금', '토');
			            var d = new Date(date),
			                month = '' + (d.getMonth() + 1) + '월',
			                date = '' + d.getDate() + '일';
			            var todayArray = d.getDay();
			            var day = week[todayArray] + '요일';
			            if (month.length < 2) month = '0' + month;
			            if (date.length < 2) date = '0' + date;
			            return [month, date, day].join(' ');
			        }
			        startDate = formatDate(d[0]);
			        endDate = formatDate(d[1]);
			        $('#start-date').text(startDate);
			        if (d.length == 1) {
			            $('#end-date').text('CHECK-OUT');
			        } else {
			            $('#end-date').text(endDate);
			        }
			        if (fd == '') {
			            $('#start-date').text('CHECK-IN');
			            $('#end-date').text('CHECK-OUT');
			        }
			
			        function formatDateForCount(date) {
			            var d = new Date(date),
			                year = d.getFullYear();
			            	month = '' + (d.getMonth() + 1),
			                date = '' + d.getDate();
			            if (month.length < 2) month = '0' + month;
			            if (date.length < 2) date = '0' + date;
			            return [year, month, date].join('-');
			        }
			        var startString = formatDateForCount(d[0]);
			        var endString = formatDateForCount(d[1]);
			        var startArray = startString.split('-');
			        var endArray = endString.split('-');
			        var start = new Date(startArray[0], Number(startArray[1]) - 1, startArray[2]);
			        var end = new Date(endArray[0], Number(endArray[1]) - 1, endArray[2]);
			        var btwcount = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24;
			        
			        sessionStorage.setItem('btwcount', btwcount);
			        sessionStorage.setItem('start_string', startString);
			        sessionStorage.setItem('end_string', endString);
			       
			        if (isNaN(btwcount)) {
			            $('#count-selected').text('');
			            return false;
			        } else {
			            $('#count-selected').text(btwcount + '박을 선택했습니다.').css({'color':'#FF5A5F','font-size':'16px','font-weight':'700', 'margin-left':'5px'});
			            
			            compUI.iBtn('dayNext')
						.val('다음')
						.addClass('btn')
						.css({'width':'80px', 'background-color':'#FF5A5F', 'border-color':'#FF5A5F','height':'35px', 'color':'white', 'font-size':'16px','outline-style': 'none', 'float':'right', 'margin-right':'7px'})
						.appendTo('#count-selected')
						.click(e=>{
							e.preventDefault();
							$('#rev_detail').empty();
							$('#rev_detail').html(regForm.personForm());
							
							compUI.btn('upRevA')
							.addClass('glyphicon glyphicon-upload')
							.css({'vertical-align': 'middle', 'border': '0', 'background': 'white', 'font-size': '25px', 'color': '#00A699','outline-style': 'none'})
							.appendTo('#revUpA');
							
							compUI.btn('downRevA')
								.addClass('glyphicon glyphicon-download')
								.css({'vertical-align': 'middle', 'border': '0', 'background': 'white', 'font-size': '25px', 'color': '#00A699','outline-style': 'none'})
								.appendTo('#revDownA');
								
							compUI.btn('upRevT')
							.addClass('glyphicon glyphicon-upload')
							.css({'vertical-align': 'middle', 'border': '0', 'background': 'white', 'font-size': '25px', 'color': '#00A699','outline-style': 'none'})
							.appendTo('#revUpT');
							
							compUI.btn('downRevT')
								.addClass('glyphicon glyphicon-download')
								.css({'vertical-align': 'middle', 'border': '0', 'background': 'white', 'font-size': '25px', 'color': '#00A699','outline-style': 'none'})
								.appendTo('#revDownT');
								
							compUI.btn('upRevC')
							.addClass('glyphicon glyphicon-upload')
							.css({'vertical-align': 'middle', 'border': '0', 'background': 'white', 'font-size': '25px', 'color': '#00A699','outline-style': 'none'})
							.appendTo('#revUpC');
							
							compUI.btn('downRevC')
								.addClass('glyphicon glyphicon-download')
								.css({'vertical-align': 'middle', 'border': '0', 'background': 'white', 'font-size': '25px', 'color': '#00A699','outline-style': 'none'})
								.appendTo('#revDownC');
								
							hee.logic.upDown(hostSerialNum);
							var result_rate = sessionStorage.getItem('ssesionPrice')*btwcount;
							
							$('#revbar_price').text('￦	'+sessionStorage.getItem('ssesionPrice')+' 원');
							$('#revbar_day').text('Χ	'+btwcount+' 박');
							$('#revbar_result').text(result_rate).css({'color':'#FF5A5F', 'font-weight':'600'});
							
							compUI.iBtn('reservation')
							.val('예약 완료')
							.addClass('btn','btn-large btn-block')
							.css({'width':'93%', 'height':'50px', 'background-color':'#FF5A5F', 'border-color':'#FF5A5F', 'color':'white', 'font-size':'22px','font-weight':'bold','outline-style': 'none'})
							.attr('data-toggle','modal')
							.attr('data-target','#myModal')
							.appendTo('#revBtn')
							.click(e=>{
								if(sessionStorage.getItem('smemberid')==null){
									e.preventDefault();
									$('#modal_body').empty();
									$('#modal_body').html(reservation.endModal());
									
								}else{
									//예약 insert 호출
									hee.logic.datePic(hostSerialNum);
								};
								
							});
							
						});
			            
			        }
			    }
			 });
	        //리뷰보드&리뷰검색 호출
			hee.logic.reviewBoard(hostSerialNum);
			hee.logic.reviewSearch(hostSerialNum);
			//구글맵
			//$('#rev_map').load(ctx+'/gmap');
			
		});
		
	};
	var setContextView=function(){
			$('#content').html(reservation.layout());
			
	};
	return {init:init};
	
})();
/*******************************
 * 예약페이지 로직단
 *******************************/
hee.logic=(function(){
	var ctx, js, temp, price;
	var init = ()=>{		
		js=$$('j');
		ctx=$$('x');
		temp=js+'/template.js';	
	};
	
	var revdata=(x)=>{
		init();
		$.ajax({
			url:ctx +'/get/rev/'+x,
			method:'post',
			data : JSON.stringify(x),
			contentType : 'application/json',
			success : d=>{
				var limit=d.detail.limit*1;
				var ssesionPrice=d.detail.price*1;
				delete sessionStorage ['mapAddress'];
				sessionStorage.setItem('ssesionPrice', ssesionPrice);
				sessionStorage.setItem('mapAddress',d.detail.addr+',');
				sessionStorage.setItem('imgAddr',d.detail.detailImg);
				$('#rev_map').load(ctx+'/gmap');
				
				$('#resiName').html(d.detail.residenceName);
				$('#host_id').html(d.detail.memberId);
				$('#price').html(d.detail.price);
				$('#imgbox').css({'background-image':'url('+d.detail.detailImg+')'});
				$('#limit_no').html('인원 '+limit+'명');
				$('#bed_num').html('침대 '+d.detail.bedNum+'개');
				$('#bed_num2').html('퀸 베드 '+d.detail.bedNum+'개');
				$('#bathroom_num').html('욕실 '+d.detail.bathroomNum+'개');
				$('#detail_cont').html(d.detail.resiContent);
				$('#addr').html(d.detail.addr);
				$('#info_hostId').html(d.detail.memberId+' 님');
				$('#loca_addr').html(d.detail.addr);
				
				if(d.detail.essentialItem===('N')){
					$('#essential').css({'text-decoration':'line-through'});
				};
				if(d.detail.wifi===('N')){
					$('#wifi').css({'text-decoration':'line-through'});
				};
				if(d.detail.pet===('N')){
					$('#pet').css({'text-decoration':'line-through'});
				};
				if(d.detail.parking===('N')){
					$('#parking').css({'text-decoration':'line-through'});
				};
				if(d.detail.tv===('N')){
					$('#tv').css({'text-decoration':'line-through'});
				};
				if(d.detail.washingMac===('N')){
					$('#washing').css({'text-decoration':'line-through'});
				};
				if(d.detail.airCondi===('N')){
					$('#aircondi').css({'text-decoration':'line-through'});
				};
				if(d.detail.kitchen===('N')){
					$('#kitchen').css({'text-decoration':'line-through'});
				};
			},
			error : (x,s,m)=>{
				alert('에러 발생'+m);
			}
		});
	};
	
	var upDown=(x)=>{
		init();
		var limit=0;
		$.ajax({
			url:ctx +'/get/rev/'+x,
			method:'post',
			data : JSON.stringify(x),
			contentType : 'application/json',
			success : d=>{
				limit=d.detail.limit*1;
			},
			error : (x,s,m)=>{
				alert('에러 발생'+m);
			}
		});
		
		var state1=0;
		var state2=0;
		var state3=0;
		$('#upRevA').click(e=>{	
			e.preventDefault();
			state1 = $('#revNumA').text()*1;
			if((state1+state2+state3)<limit){
				state1++;
			}else{
				alert('최대 인원은'+limit+'명 입니다.');
			}
			$('#revNumA').text(state1);
		});
		$('#downRevA').click(e=>{	
			e.preventDefault();
			state1 = $('#revNumA').text()*1;
			state1--;
			if(state1<0){
				alert('더 이상 줄일 수 없습니다.');
				state1 = 0;
			}
			$('#revNumA').text(state1);
		});
		$('#upRevT').click(e=>{	
			e.preventDefault();
			state2 = $('#revNumT').text()*1;
			if((state1+state2+state3)<limit){
				state2++;
			}else{
				alert('최대 인원은'+limit+'명 입니다.');
			}
			$('#revNumT').text(state2);
		});
		$('#downRevT').click(e=>{	
			e.preventDefault();
			state2 = $('#revNumT').text()*1;
			state2--;
			if(state2<0){
				alert('더 이상 줄일 수 없습니다.');
				state2 = 0;
			}
			$('#revNumT').text(state2);
		});
		$('#upRevC').click(e=>{	
			e.preventDefault();
			state3 = $('#revNumC').text()*1;
			if((state1+state2+state3)<limit){
				state3++;
			}else{
				alert('최대 인원은'+limit+'명 입니다.');
			}
			$('#revNumC').text(state3);
		});
		$('#downRevC').click(e=>{	
			e.preventDefault();
			state3 = $('#revNumC').text()*1;
			state3--;
			if(state3<0){
				alert('더 이상 줄일 수 없습니다.');
				state3 = 0;
			}
			$('#revNumC').text(state3);
		});
	};

	var reviewBoard=(x)=>{
		init();
		$('#msg').val('');
		$.ajax({
			
			url:ctx +'/list/rev',
			method:'post',
			data : JSON.stringify({
				'action':'revList',
				'search':x,
			}),
			contentType : 'application/json',
			success : d=>{
				$('#review_no').html('후기 '+d.count+'개');
				$('#reviewtb_no').html('후기 '+d.count+'개');
				
				var star=0;
				var forTb='';
				$.each(d.revList, function(i,j){
					forTb += '<tr>'
						+'	<td style="font-size: 17px; background: #EAEAEA">'+j.memberId+'</td>'
						+'</tr>'
						+'<tr>'
						+'	<td style="font-size: 17px;">'+j.regdate+'</td>'
						+'</tr>'
						+'<tr>'
						+'	<td style="font-size: 17px;">'+j.contents+'</td>'
						+'</tr>';
					star=j.revAvg*1;
				});
				$('#tbody').html(forTb);
				var starview='';
				for(var i=0; i<star; i++){
					starview += '<span class="glyphicon glyphicon-star" style="color:#00A699; vertical-align: middle"></span>';
				};
				$('#review_star').html(starview);
				$('#review_star2').html(starview);
				
			},
			error : (x,s,m)=>{
				alert('에러 발생'+m);
			}
		});
	};  
	
	var datePic =(x)=>{
		init();
		var memId = sessionStorage.getItem('smemberid');
		$('#modal_body').empty();
		$('#modal_body').html(reservation.resModal());
		
			$.ajax({
				url:ctx +'/post/rev',
				method:'post',
				data : JSON.stringify({
					'hostSerial':x,
					'memberId': sessionStorage.getItem('smemberid'),
					'checkin':sessionStorage.getItem("start_string"),
					'checkout':sessionStorage.getItem("end_string"),
					'adult':$('#revNumA').text(),
					'teen':$('#revNumT').text(),
					'child':$('#revNumC').text(),
					'resPrice':$('#revbar_result').text(),
					'solddays':sessionStorage.getItem("btwcount"),
				}),
				contentType : 'application/json',
				success : d=>{
					$('#form_price').html("￦  "+$('#revbar_result').text()+" 원");
					$('#res_img').css({'background-image':'url('+sessionStorage.getItem('imgAddr')+')'});
				},
				error : (x,s,m)=>{
					alert('에러 발생'+m);
				}
			});
			$('#formDt').html(sessionStorage.getItem('start_string')+' ~ '+sessionStorage.getItem('end_string'));
			$('#formRev_name').html($('#resiName').text());
			$('#formA').html($('#revNumA').text()+' 명');
			$('#formT').html($('#revNumT').text()+' 명');
			$('#formC').html($('#revNumC').text()+' 명');
			
			$.getScript(temp,()=>{
				$('#formCm').html(compUI.iBtn('formBtn')
						.val('예약 내역 확인')
						.attr('data-dismiss','modal')
						.addClass('btn btn-large btn-block')
						.css({'font-size': '22px','background-color':'#FF5A5F', 'border-color':'#FF5A5F','color':'white','font-weight':'bold','width':'100%','outline-style': 'none'})	
				)
			});
	};
	var reviewSearch =(x)=>{
		$('#search').click(e=>{
			$.ajax({
				url:ctx +'/list/rev',
				method:'post',
				data : JSON.stringify({
					'action':'revsearch',
					'search':x,
					'dir': $('#msg').val(),
				}),
				contentType : 'application/json',
				success : d=>{
					$('#search').val('back')
						.click(e=>{
							$('#search').val('Go');
							hee.logic.reviewBoard(x);
						});
					
					var forTb;
					$.each(d.searchList, function(i,j){
						forTb += '<tr>'
							+'	<td style="font-size: 17px; background: #EAEAEA">'+j.memberId+'</td>'
							+'</tr>'
							+'<tr>'
							+'	<td style="font-size: 17px;">'+j.regdate+'</td>'
							+'</tr>'
							+'<tr>'
							+'	<td style="font-size: 17px;">'+j.contents+'</td>'
							+'</tr>';
					});
					$('#tbody').html(forTb);
				},
				error : (x,s,m)=>{
					alert('에러 발생'+m);
				}
			});
		});
	};
var disable =(x)=>{
		init();
		$.ajax({
			url:ctx +'/list/rev',
			method:'post',
			data : JSON.stringify({
				'action':'disableDate',
				'search':x,
			}),
			contentType : 'application/json',
			success : d=>{
				var array1 = [];
				var array2 = [];
				$.each(d.disable, function(i,j){
					array1 += (j.disable)+',';
					array2 += (j.solddays*1)+',';
				});
				sessionStorage.setItem('checkday',array1);
				sessionStorage.setItem('soldcount',array2);
			},
			error : (x,s,m)=>{
				alert('에러 발생'+m);
			}
			
		});
		
		//$('#hide_btn').trigger('click');
	};
	var date_add =(x,y)=> {
	    var yy = parseInt(x.substr(0, 4), 10);
	    var mm = parseInt(x.substr(5, 2), 10);
	    var dd = parseInt(x.substr(8), 10);
	    var list = new Array;
	    list = x+',';
    	for(var i=0; i<y; i++){
    		var d = new Date(yy, mm -1 , dd + 1);
     	    yy = d.getFullYear();
     	    mm = d.getMonth() + 1; 
     	    dd = d.getDate(); 
     	    var result = yy + '-' +  mm  + '-' + dd+',';
     	    list += result;
    	}
	    return list;
    };

	return {init:init, 
		revdata:revdata, 
		reviewBoard:reviewBoard,
		datePic:datePic,
		reviewSearch:reviewSearch,
		upDown:upDown,
		disable:disable,
		date_add:date_add,
	};
})();


/*******************************
 * 숙소 등록
 *******************************/

hee.register = (function(){
	var js, temp, ctx;
	var init=function(hostSerialNum){
		js=$$('j');
		ctx=$$('x');
	    temp=js+'/template.js';
		onCreate(hostSerialNum);
	};
	var onCreate=function(hostSerialNum){
		setContentView();
		
		$.getScript(temp, ()=>{
			var addr_si ='';
			var addr_gu ='';
			var addr_doro ='';
			var addr_apt ='';
			var addr_post ='';
			var info_room ='';
			var info_limit ='';
			var info_name ='';
			var info_price ='';
			var info_bed ='';
			var info_rest ='';
			var info_cont ='';
			
			$proDiv=$('#proDiv');
			$registerCont=$('#registerCont');
			$nextBtnDiv=$('#nextBtnDiv');
			$title=$('#title');
			$progressBar=$('#progressBar');
			$registerCont.empty();
			$registerCont.append(regForm.address());
		
			$nextBtnDiv.html(compUI.btn('nextBtn','nextBtn')
				.text('다음')
				.addClass('btn')
				.css({'width': '30%','background-color':'#FF5A5F', 'border-color':'#FF5A5F', 'color':'white','height': '40px', 'font-size': '17px', 'font-weight': 'bold', 'float': 'right'}));
				
				$('#nextBtn').click(e=>{
					addr_si = $('#addr_si').val();
					addr_gu = $('#addr_gu').val();
					addr_doro = $('#addr_doro').val();
					addr_apt = $('#addr_apt').val();
					addr_post = $('#addr_post').val();
					
					if(addr_si!=='' && addr_gu!=='' && addr_doro!=='' && addr_apt!=='' && addr_post!==''){
						if(hee.valid.post_checker($('#addr_post').val())==='yes'){
							$registerCont.empty();
							$registerCont.append(regForm.info());
							$title.html('숙소 상세정보를 설정하세요.');
							$progressBar.css({'width': '50%', 'background-color': '#00A699'});
							$nextBtnDiv.html(compUI.btn('nextBtn2','nextBtn2')
								.text('다음')
								.addClass('btn')
								.css({'width': '30%', 'background-color':'#FF5A5F', 'border-color':'#FF5A5F', 'color':'white','height': '40px', 'font-size': '17px', 'font-weight': 'bold', 'float': 'right'})
								.click(e=>{
									info_room = $('#info_room').val();
									info_limit = $('#info_limit').val();
									info_name = $('#info_name').val();
									info_price = $('#info_price').val();
									
									if(hee.valid.name_checker($('#info_name').val())==='yes'){
										if(hee.valid.price_checker($('#info_price').val())==='yes'){
											$registerCont.empty();
											$('#register').css({'width':'35%','height':'750px'});
											$registerCont.append(regForm.detail());
											$title.html('숙소 옵션을 설정하세요.');
											$progressBar.css({'width': '75%', 'background-color': '#00A699'});
											($nextBtnDiv).html(compUI.btn('nextBtn2','nextBtn2')
													.text('완료')
													.addClass('btn btn-danger')
													.css({'width': '30%', 'height': '40px', 'background-color':'#FF5A5F', 'border-color':'#FF5A5F', 'color':'white','font-size': '17px', 'font-weight': 'bold', 'float': 'right'})
													.click(e=>{
														info_bed = $('#info_bed').val();
														info_rest = $('#info_rest').val();
														info_cont = $('#info_cont').val();
														
														$(":checkbox[name='info_ess']:checked").each(function(i){
															sessionStorage.setItem($(this).val(),'Y');
														});
														$(":checkbox[name='info_ess']:not(:checked)").each(function(i){
															sessionStorage.setItem($(this).val(),'N');
														});

														if(info_bed!=='' && info_rest!=='' && info_cont!==''){
															var y = {
																	'addr_si' : addr_si,
																	'addr_gu' : addr_gu,
																	'addr_doro' : addr_doro,
																	'addr_apt' : addr_apt,
																	'addr_post' : addr_post,
																	'info_room' : info_room,
																	'info_limit' : info_limit,
																	'info_name' : info_name,
																	'info_price' : info_price,
																	'info_bed' : info_bed,
																	'info_rest' : info_rest,
																	'info_cont' : info_cont,
															};
															hee.resilogic.resi(y);
															
															$registerCont.empty();
															$nextBtnDiv.remove();
															$title.remove();
															$registerCont.append(regForm.endForm());
															$progressBar.css({'width': '100%', 'background-color': '#00A699'});
															compUI.btn('confirmBtn')
																.text('확 인')
																.addClass('btn')
																.css({'width': '100%', 'height': '50px', 'background-color':'#FF5A5F', 'border-color':'#FF5A5F', 'color':'white', 'font-size': '20px', 'font-weight': 'bold'})
																.appendTo('#endBtn')
																.click(e=>{
																	app.common.init(ctx);
																});
														}else{
															alert('공백이 존재할 수 없습니다.');
														};
													})
											);
										}else{
							                alert('이용 요금을 확인해 주세요.');
							                $('#info_price').val('');
										};
									}else{
										alert('숙소 이름은 50글자까지 입력 가능합니다.');
						                $('#info_name').val('');
									};
								})
							);
						}else{
							alert('우편번호를 확인해 주세요');
			                $('#addr_post').val('');
						};
		            }else{
		            	alert('공백이 존재할 수 없습니다.');
		            }
				});
		});
	};
	var setContentView=function(){
		$('#content').html(regForm.layout());
		$('#resiColor').css({'background-color':'#FAFAFA'});
		
	};
	return{init:init}
})();
/*******************************
 * 숙소 등록 로직단
 *******************************/
hee.resilogic=(function(){
	var ctx, js, temp, price;
	var init = ()=>{		
		js=$$('j');
		ctx=$$('x');
		temp=js+'/template.js';	
	};
	var resi=(x)=>{
		init();
		var json = x;
		var zipcode = json.addr_si + ' '+ json.addr_gu + ' ' + json.addr_doro + ' ' + json.addr_apt;

		$.ajax({
			url:ctx +'/post/resi',
			method:'post',
			data : JSON.stringify({
				'memberId' : sessionStorage.getItem('smemberid'),
				'residenceName' : json.info_name,
				'price': json.info_price,
				'zipcode': json.addr_post,
				'resiContent': json.info_cont,
				'addr': zipcode,
				'limit': json.info_limit,
				//resiopt
				'wifi' : sessionStorage.getItem('wifi'),
				'bedNum' : json.info_bed,
				'pet' : sessionStorage.getItem('pet'),
				'essentialItem' : sessionStorage.getItem('essentialItem'),
				'parking' : sessionStorage.getItem('parking'),
				'bathroomNum' : json.info_rest,
				'tv' : sessionStorage.getItem('tv'),
				'washingMac' : sessionStorage.getItem('washingMac'),
				'airCondi' : sessionStorage.getItem('airCondi'),
				'kitchen' : sessionStorage.getItem('kitchen'),
			}),
			contentType : 'application/json',
			success : d=>{
				
			},
			error : (x,s,m)=>{
				alert('에러 발생'+m);
			}
		});
	};
	return {init:init,
		resi:resi};
})();
/*******************************
 * 숙소 등록 정규식
 *******************************/
hee.valid = {
	    post_checker :(x)=> {
	        var regPost = /^[0-9]{5}$/;
	        return regPost.test(x)? 'yes' : 'no';
	    },
	    name_checker :(x)=> {
	        var regName = /^.{10,49}$/;
	        return regName.test(x)? 'yes' : 'no';
	    },
	    price_checker :(x)=> {
	    	var regPrice = 200000;
	    	
	        return x<=regPrice ? 'yes' : 'no';
	    }
};
/*******************************
 * 모든 숙소 리스트
 *******************************/
hee.allRegList=(function(){
	var ctx, js, temp, price;
	var init = (y)=>{		
		js=$$('j');
		ctx=$$('x');
		temp=js+'/template.js';	
		onCreate(y);
	};
	var onCreate=(y)=>{
		
        setContentView();
    	hee.allRegLogic.search('1',y);
       
	};
	var setContentView=()=>{
	   $('#content').html(allReg.layout());
	   $('#main-navbar').css({'border-top':'1px solid #e4e4e4','box-shadow':'0 1px 5px rgba(0, 0, 0, 0.1)'});
	};
	return {init:init};
	
})();

hee.allRegLogic=(function(){
	var js, temp, ctx;
	var init=function(){
		js=$$('j');
		ctx=$$('x');
	    temp=js+'/template.js';
	};
	var select =(x)=>{
		init();
		hee.rev.init(x);
	};
	var search=(x,y)=>{
		init();
		$.ajax({
		     url : ctx+'/list/rev',
		     method : 'post',
		     contentType : 'application/json',
		     data : JSON.stringify({
				'action' : 'allRegSelect',
				'page' : x,
				'search' : y
			 }),
		     success : d=>{
					var row='';
					var frame='', addr='', price='';
					var start_page = d.startPage*1; 
					var end_page = d.endPage*1; 
					var page_size = 6; 
					var page_num = d.pageNum*1; 
					var total_page = d.totalPage*1;
					var total_count = d.count*1;
					var block_size=3; 
					
					
					$.each(d.allReg, function(i,j){
						row += '<div onclick="hee.allRegLogic.select(\''+j.hostSerial+'\')" style="float:left; width:290px; height:280px; margin-right:3em; margin-top: 5%; cursor: pointer;">' 
			         	 	+'<img src="'+j.infoImg+'" style="width:320px; height:215px"/>'
			         	 	+'<span style="font-size:17px; font-weight: 700;"> '+j.residenceName+'</span>'
			         	 	+'<br/>'
			         	 	+'<span style="font-size:17px; font-weight: 700">￦ '+j.price+'원</span></br>'
			         	 	+'</div>';
							addr += j.addr+',';
					});
					frame += row;
					sessionStorage.setItem('mapAddress', addr);
					
					var pagination = '<nav aria-label="Page navigation" style="width:350px; margin:0 auto;">'
						+'  <ul class="pagination">';
					
					if (page_num > block_size){
						var temp=0;
						if(page_num % block_size == 0){
							temp = (Math.floor(((page_num - block_size)/ block_size))*block_size)+1-block_size;
						}else{
							temp = (Math.floor(((page_num - block_size)/ block_size))*block_size)+1;
						}
						var temp2 = 1;
						pagination += '<li><a style="border-radius: 50%; margin: 0 5px; color: black;" onclick="hee.allRegLogic.search(\''+temp2+'\',\''+y+'\')" arial-label="Previous">'
							+'<span style="font-size:12px;" aria-hidden="true">&laquo;</span>'
							+'</a></li>'
							+'<li><a style="border-radius: 50%; margin: 0 5px; color: black;" onclick="hee.allRegLogic.search(\''+temp+'\',\''+y+'\')" arial-label="Previous">'
							+'<span style="font-size:12px" aria-hidden="true"><</span>'
							+'</a></li>';
					}
					var i=0;
					var temp_num=0;
					
					for(i=start_page; i<(start_page+block_size) && i<=total_page; i++){
						if(i==page_num){
							pagination += '<li class="active"><a style="border-radius: 50%; margin: 0 5px; background-color:#FF5A5F; border-color: #FF5A5F;" href="#">'+i+'</a></li>';
						}else{
							pagination += '<li><a style="border-radius: 50%; margin: 0 5px; color: black;" onclick="hee.allRegLogic.search(\''+i+'\',\''+y+'\')">'+i+'</a></li>';
						}
						temp_num = i;
					};
					if(temp_num != total_page){
						var temp=0;
						if(page_num % block_size==0){
							temp=(Math.floor(((page_num + block_size)/ block_size))*block_size)+1-block_size;
						}else{
							temp=(Math.floor(((page_num + block_size)/ block_size))*block_size)+1;
						}
						var temp2 = total_page;
						pagination += '<li><a style="border-radius: 50%; margin: 0 5px; color: black;" onclick="hee.allRegLogic.search(\''+temp+'\',\''+y+'\')" arial-label="Previous">'
						+'<span style="font-size:12px" aria-hidden="true">></span>'
						+'</a></li>'
						+'<li><a style="border-radius: 50%; margin: 0 5px; color: black;" onclick="hee.allRegLogic.search(\''+temp2+'\',\''+y+'\')" arial-label="Previous">'
						+'<span style="font-size:12px" aria-hidden="true">&raquo;</span>'
						+'</a></li>';
					};
					pagination += '</ul></nav>';
				
					$('#y_list').html(frame);
					$('#y_pagination').html(pagination);
					
					$('#y_map').load(ctx+'/gmap');
		     }
		});
		
	};
	return {init:init,
		select:select,
		search:search}
})();


/*******************************
 * 레이아웃 (예약내역, 숙소등록, 후기, 모든숙소)
 *******************************/
var reservation={
		layout:()=>{
			return '<body style="position: relative;">'
			+'<div id="container" style="width: 100%">'
			+'<div id="moveDiv0"></div>'
			+'	<div id="imgbox" style="margin: auto; width: 100%; height:550px;'
			+'	background-size: cover; background-position: left center;"> '
			+'	</div>'
			+'	<div id="menu" style="padding-top:15px; width: 38%; height:50px; margin-left:18%; background: white; border-bottom: 1px solid #D5D5D5; z-index:800">'
			+'		<div id="menubar" style="height:30px; width: 100%;">'
			+'		</div>'
			+'	</div>'
			+'	<div id="wrapper" style="margin-left:18%; width: 38%; display: inline-block;">'
			+'		<div style="width:100%; display: inline-block;">'
			+'			<div id="summary">'
			+'				<div id="title" style="padding-top:10px;">'
			+'					<div><span id="resiName" style="font-size: 36px; font-weight:bold;"></span></div>'
			+'					<div id="info" style="padding-top:4px;">'
			+'						<span id="host_id" style="font-size: 17px;"></span>'
			+'						<span style="font-size: 17px;">의 개인실</span>'
			+'						<span style="font-size: 17px;">·</span>'
			+'						<span id="review_no"style="font-size: 17px;"></span>'
			+'						<span id="review_star" style="font-size: 17px; padding-left:10px;"></span>'
			+'					</div>'
			+'					<div style="padding-top:20px;">'
			+'						<span class="glyphicon glyphicon-user" aria-hidden="true"></span>'
			+'						<span id="limit_no" style="font-size: 17px;"></span>'
			+'						<span class="glyphicon glyphicon-home" aria-hidden="true" style="padding-left:10px;"></span>'
			+'						<span style="font-size: 17px;">침실 1개</span>'
			+'						<span class="glyphicon glyphicon-bed" aria-hidden="true" style="padding-left:10px;"></span>'
			+'						<span id="bed_num" style="font-size: 17px;"></span>'
			+'						<span class="glyphicon glyphicon-tint" aria-hidden="true" style="padding-left:10px;"></span>'
			+'						<span id="bathroom_num" style="font-size: 17px;"></span>'
			+'					</div>'
			+'				</div>'
			+'			</div>'
			+'			<div id="revDetail" style="padding-top:30px;">'
			+'			<div id="transBtn"></div>'
			+'				<div style="padding-top:20px;"><span style="font-size: 17px; font-weight:bold;">숙소</span></div>'
			+'				<div style="padding-top:10px; padding-bottom: 30px; border-bottom: 1px solid #D5D5D5;">'
			+'					<span id="detail_cont" style="padding-top:10px; font-size: 17px;">'
			+'					</span>'
			+'				</div>'
			+'				<div style="padding-top:20px;"><span style="font-size: 17px; font-weight:bold;">편의시설</span></div>'
			+'					<div style="padding-top:10px; padding-bottom: 30px; border-bottom: 1px solid #D5D5D5; width:100%;">'
			+'						<div style="width:48%; display: inline-block;">'
			+'							<div style="padding-top:15px;">'
			+'								<svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" style="height: 1.2em; width: 1.2em; fill: currentcolor;">'
			+'									<path d="M23.5 4H22V2.5C22 1.12 20.884 0 19.503 0H4.497A2.502 2.502 0 0 0 2 2.495V4H.5a.5.5 0 1 0 0 1H2v15.501C2 21.331 2.67 22 3.5 22H5v.5c0 .83.67 1.5 1.5 1.5h14c.831 0 1.5-.666 1.5-1.503V5h1.5a.5.5 0 0 0 0-1zM3 2.495C3 1.675 3.674 1 4.497 1h15.006C20.33 1 21 1.67 21 2.5V4h-2v-.505A.5.5 0 0 1 19.5 3a.5.5 0 0 0 0-1A1.5 1.5 0 0 0 18 3.495V15H3V2.495zM3 16h15v2H3v-2zm.5 5a.498.498 0 0 1-.5-.499V19h15v1.505c0 .27-.226.495-.5.495h-14zM21 22.497c0 .284-.22.503-.5.503h-14a.498.498 0 0 1-.5-.5V22h11.5c.826 0 1.5-.673 1.5-1.495V5h2v17.497z" fill-rule="evenodd"></path>'
			+'								</svg>'
			+'								<span id="essential" style="font-size: 17px; padding-left:10px;">필수용품</span>'
			+'							</div>'
			+'							<div style="padding-top:15px;">'
			+'								<svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" style="height: 1.2em; width: 1.2em; fill: currentcolor;">'
			+'									<path d="M21.5 6h-9.066L15.916.777a.5.5 0 1 0-.832-.554L11.232 6H8.768L4.916.223a.5.5 0 0 0-.832.554L7.566 6H2.5A2.504 2.504 0 0 0 0 8.5v13C0 22.885 1.118 24 2.5 24h19c1.376 0 2.5-1.121 2.5-2.5v-13C24 7.116 22.882 6 21.5 6zM23 21.5c0 .826-.675 1.5-1.5 1.5h-19c-.83 0-1.5-.668-1.5-1.5v-13C1 7.674 1.675 7 2.5 7h19c.83 0 1.5.668 1.5 1.5v13zM16.508 9H5.492A2.493 2.493 0 0 0 3 11.492v7.016A2.497 2.497 0 0 0 5.492 21h11.016A2.493 2.493 0 0 0 19 18.508v-7.016A2.497 2.497 0 0 0 16.508 9zM18 18.508c0 .823-.669 1.492-1.492 1.492H5.492C4.672 20 4 19.327 4 18.508v-7.016C4 10.67 4.669 10 5.492 10h11.016c.82 0 1.492.673 1.492 1.492v7.016zM22 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill-rule="evenodd"></path>'
			+'								</svg>'
			+'								<span id="tv" style="font-size: 17px; padding-left:10px;">TV</span>'
			+'							</div>'
			+'							<div style="padding-top:15px;">'
			+'								<svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" style="height: 1.2em; width: 1.2em; fill: currentcolor;">'
			+'									<path d="M5 3.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zM3.5 4a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm4 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm0-2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zM12 6c-4.413 0-8 3.585-8 8 0 4.413 3.585 8 8 8 4.413 0 8-3.585 8-8 0-4.413-3.585-8-8-8zm0 15c-3.77 0-6.84-2.992-6.986-6.725.354-.226.843-.567.853-.574 1.64-1.051 3.308-1.062 5.847.71 2.88 2.008 4.986 1.994 6.959.73l.252-.172C18.451 18.373 15.531 21 12 21zm6.133-6.701c-1.64 1.051-3.308 1.062-5.847-.71-2.88-2.008-4.986-1.994-6.959-.73l-.252.172C5.549 9.627 8.469 7 12 7c3.77 0 6.84 2.992 6.986 6.725-.354.226-.843.567-.853.574zM21.5 0H2.501A2.505 2.505 0 0 0 0 2.5v19C0 22.875 1.121 24 2.5 24h19c1.376 0 2.5-1.121 2.5-2.5v-19C24 1.125 22.879 0 21.5 0zM23 21.5c0 .826-.676 1.5-1.5 1.5h-19c-.826 0-1.5-.676-1.5-1.5v-19C1 1.675 1.676 1 2.5 1h19c.826 0 1.5.676 1.5 1.5v19z" fill-rule="evenodd"></path>'
			+'								</svg>'
			+'								<span id="washing" style="font-size: 17px; padding-left:10px;">세탁기</span>'
			+'							</div>'
			+'							<div style="padding-top:15px;">'
			+'								<svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" style="height: 1.2em; width: 1.2em; fill: currentcolor;">'
			+'									<path d="M16 13.54V3.991A3.998 3.998 0 0 0 12 0C9.794 0 8 1.788 8 3.992v9.547A5.98 5.98 0 0 0 6 18a6 6 0 1 0 12 0 5.98 5.98 0 0 0-2-4.46zM12 23a5 5 0 0 1-3.182-8.857.5.5 0 0 0 .182-.386V3.992A2.998 2.998 0 0 1 12 1c1.656 0 3 1.341 3 2.992v9.765a.5.5 0 0 0 .182.386A5 5 0 0 1 12 23zm2-8.453V4.005a1.999 1.999 0 1 0-4 0v10.542A3.991 3.991 0 0 0 8 18a4 4 0 0 0 8 0 3.991 3.991 0 0 0-2-3.453zM12 21a3 3 0 0 1-1.285-5.712.5.5 0 0 0 .285-.451V4.005a.999.999 0 1 1 2 0v10.832a.5.5 0 0 0 .285.451A3 3 0 0 1 12 21z" fill-rule="evenodd"></path>'
			+'								</svg>'
			+'								<span id="aircondi" style="font-size: 17px; padding-left:10px;">냉난방</span>'
			+'							</div>'
			+'						</div>'
			+'						'
			+' 						<div style="width:48%; display: inline-block; ">'
			+' 							<div style="padding-top:15px;">'
			+'								<svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" style="height: 1.2em; width: 1.2em; fill: currentcolor;">'
			+'									<path d="M12 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm5.918-5.775a.5.5 0 1 1-.836.55C15.892 12.964 14.012 12 12 12s-3.892.964-5.082 2.775a.5.5 0 0 1-.836-.55C7.462 12.126 9.66 11 12 11c2.34 0 4.538 1.126 5.918 3.225zm2.982-3.03a.5.5 0 1 1-.79.61C18.45 9.662 14.886 8 12 8c-2.832 0-6.256 1.619-8.118 3.823a.5.5 0 0 1-.764-.646C5.168 8.751 8.871 7 12 7c3.19 0 7.047 1.798 8.9 4.194zm2.945-2.333a.5.5 0 0 1-.707-.017C20.198 5.765 16.434 4 12 4S3.8 5.766.862 8.845a.5.5 0 0 1-.724-.69C3.258 4.885 7.278 3 12 3s8.742 1.886 11.863 5.155a.5.5 0 0 1-.017.707z" fill-rule="evenodd"></path>'
			+'								</svg>'
			+'								<span id="wifi" style="font-size: 17px; padding-left:10px;">무선 인터넷</span>'
			+'							</div>'
			+'							<div style="padding-top:15px;">'
			+'								<svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" style="height: 1.2em; width: 1.2em; fill: currentcolor;">'
			+'									<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11zm.5-17H8v11.5a.5.5 0 0 0 1 0V13h3.5c1.93 0 3.5-1.569 3.5-3.5C16 7.57 14.43 6 12.5 6zm0 6H9V7h3.5C13.878 7 15 8.122 15 9.5c0 1.379-1.123 2.5-2.5 2.5z" fill-rule="evenodd"></path>'
			+'								</svg>'
			+'								<span id="parking" style="font-size: 17px; padding-left:10px;">건물 내 무료 주차</span>'
			+'							</div>'
			+'							<div style="padding-top:15px;">'
			+'								<svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" style="height: 1.2em; width: 1.2em; fill: currentcolor;">'
			+'									<path d="M18.84 15.347c.098.108-1.435-1.521-1.677-1.826a13.401 13.401 0 0 1-1.175-1.53c-.097-.145-.69-1.066-.857-1.304-.831-1.186-1.651-1.684-3.125-1.686V9h-.012c-1.474.003-2.294.501-3.125 1.687-.167.238-.76 1.16-.857 1.304a13.18 13.18 0 0 1-1.156 1.507c-.261.328-1.794 1.957-1.696 1.85-.485.53-.867.984-1.186 1.422-.599.826-.936 1.552-.961 2.226-.198 2.31 1.727 4.027 4.22 4.004.879 0 1.426-.198 2.21-.682l.217-.134c.788-.486 1.327-.668 2.34-.666 1.013-.002 1.552.18 2.34.666l.216.134c.785.484 1.332.682 2.215.682 2.489.023 4.414-1.695 4.215-4.028-.024-.65-.361-1.376-.96-2.202-.319-.438-.7-.892-1.186-1.423zM16.776 22c-.673 0-1.054-.138-1.695-.533l-.216-.134c-.932-.575-1.644-.816-2.857-.815h-.016c-1.213 0-1.925.24-2.857.815l-.216.134c-.64.395-1.022.533-1.69.533-1.948.018-3.364-1.245-3.218-2.943.017-.455.28-1.02.773-1.7.292-.403.652-.83 1.114-1.335-.132.145 1.45-1.536 1.722-1.88.438-.488.821-.995 1.223-1.594.107-.16.691-1.068.845-1.287C10.345 10.323 10.876 10 12 10c1.124 0 1.655.322 2.312 1.26.154.219.738 1.127.845 1.287.402.6.785 1.106 1.242 1.617.253.32 1.835 2.002 1.703 1.857.462.505.822.932 1.114 1.336.493.68.756 1.244.772 1.675.147 1.722-1.27 2.985-3.212 2.967zM8 8c1.7 0 3-1.82 3-4 0-2.18-1.3-4-3-4S5 1.82 5 4c0 2.18 1.3 4 3 4zm0-7c1.061 0 2 1.314 2 3s-.939 3-2 3-2-1.314-2-3 .939-3 2-3zM6 11c0-2.18-1.3-4-3-4s-3 1.82-3 4c0 2.18 1.3 4 3 4s3-1.82 3-4zm-3 3c-1.061 0-2-1.314-2-3s.939-3 2-3 2 1.314 2 3-.939 3-2 3zm18-7c-1.7 0-3 1.82-3 4 0 2.18 1.3 4 3 4s3-1.82 3-4c0-2.18-1.3-4-3-4zm0 7c-1.061 0-2-1.314-2-3s.939-3 2-3 2 1.314 2 3-.939 3-2 3zm-5-6c1.7 0 3-1.82 3-4 0-2.18-1.3-4-3-4s-3 1.82-3 4c0 2.18 1.3 4 3 4zm0-7c1.061 0 2 1.314 2 3s-.939 3-2 3-2-1.314-2-3 .939-3 2-3z" fill-rule="evenodd"></path>'
			+'								</svg>'
			+'								<span id="pet" style="font-size: 17px; padding-left:10px;">애완동물 입실 가능</span>'
			+'							</div>'
			+'							<div style="padding-top:15px;">'
			+'								<svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" style="height: 1.2em; width: 1.2em; fill: currentcolor;">'
			+'									<path d="M10.5 0a.5.5 0 0 0-.5.5v7.003A.498.498 0 0 1 9.51 8H8V.5a.5.5 0 1 0-1 0V8H5.49A.499.499 0 0 1 5 7.503V.5a.5.5 0 1 0-1 0v7.003C4 8.327 4.672 9 5.49 9H7v5c0 .03.012.057.017.086A1.49 1.49 0 0 0 6 15.498v7.004C6 23.33 6.672 24 7.5 24c.831 0 1.5-.67 1.5-1.498v-7.004c0-.658-.427-1.21-1.017-1.412.005-.029.017-.055.017-.086V9h1.51A1.5 1.5 0 0 0 11 7.503V.5a.5.5 0 0 0-.5-.5zM8 15.498v7.004a.496.496 0 0 1-.5.498.499.499 0 0 1-.5-.498v-7.004c0-.277.221-.498.5-.498.277 0 .5.223.5.498zM19.5 0h-2.003C16.097 0 15 1.071 15 2.5v7c0 1.428 1.096 2.5 2.497 2.5H19v2.092a1.489 1.489 0 0 0-.5-.092c-.831 0-1.5.67-1.5 1.498v7.004c0 .828.672 1.498 1.5 1.498.831 0 1.5-.67 1.5-1.498V0h-.5zm-2.003 11C16.643 11 16 10.37 16 9.5v-7c0-.87.645-1.5 1.497-1.5H19v10h-1.503zM19 22.502a.496.496 0 0 1-.5.498.499.499 0 0 1-.5-.498v-7.004c0-.277.221-.498.5-.498.277 0 .5.223.5.498v7.004z" fill-rule="evenodd"></path>'
			+'								</svg>'
			+'								<span id="kitchen" style="font-size: 17px; padding-left:10px;">부엌</span>'
			+'							</div>'
			+' 						</div>'
			+'					</div>'
			+'				<div style="padding-top:20px;"><span style="font-size: 17px; font-weight:bold;">침대/침구</span></div>'
			+'					<div style="padding-top:10px; padding-bottom: 30px; border-bottom: 1px solid #D5D5D5; width:100%;">'
			+'						<div style="width: 50px; height: 50px; background-image:url(./resources/img/bedroom.JPG);"></div>'
			+'						<div style="padding-top:5px;">'
			+'							<span id="bed_num2" style="font-size: 17px;"></span>'
			+'						</div>'
			+'					</div>'
			+'				<div style="padding-top:20px;"><span style="font-size: 17px; font-weight:bold;">예약취소</span></div>'
			+'					<div style="padding-top:10px; padding-bottom: 30px; border-bottom: 1px solid #D5D5D5; width:100%;">'
			+'						<div style="padding-top:10px;"><span id="refund" style="font-size: 17px;">엄격 환불 정책</span></div>'
			+'						<div style="padding-top:10px;"><span id="refund_de" style="font-size: 17px;">체크인 30일 전까지 예약을 취소하면 전액 환불받을 수 있습니다. 30일이 남지 않은 시점에서 취소하면 1박 요금의 50%와 수수료 전액을 환불받을 수 있습니다.</span></div>'
			+'					<div id="moveDiv1"></div>'
			+'					</div>'
			+'			</div>'
			+'			<div id="review" style="padding-top:40px;">'
			+'				<div style="width:100%; padding-bottom: 20px;">'
			+'					<div style="display: inline-block;">'
			+'						<span id="reviewtb_no" style="font-size: 28px; font-weight:bold;">후기</span>'
			+'					</div>'
			+'					<div style="display: inline-block;">'
			+'						<span id="review_star2" style="font-size: 20px;"></span>'
			+'					</div>'
			+'					<div id="search_box" style="width:300px; display: inline-block; float:right;">'
			+'						<div id="searchBtn" style="width:50px; display: inline-block; float:right;">	'
			+'						</div>'
			+'						<div style="width:200px; display: inline-block; float:right; padding-right: 10px;">'
			+'							<input id="msg" type="text" class="form-control" style="width:100%" name="searchWord" placeholder="후기 검색" >'
			+'						</div>'
			+'					</div>'
			+'				</div>'
			+'				<div id="frame_div" style="width:100%; padding-bottom: 30px; border-bottom: 1px solid #D5D5D5;">'
			+'					<table class="table">'
			+'						<tbody id="tbody">'
			+'					    </tbody>'
			+'				  	</table>'
			+'					<div id="moveDiv2"></div>'
			+'				</div>'
			+'			</div>'
			+'			<div id="host_info" style="padding-top:40px; padding-bottom: 30px; border-bottom: 1px solid #D5D5D5;">'
			+'				<span style="font-size: 28px; font-weight:bold;">호스트 : </span>'
			+'				<span id="info_hostId" style="font-size: 28px; font-weight:bold;"></span>'
			+'				<div id="host_info" style="padding-top:10px;">'
			+'					<span style="font-size: 17px;">호스트(숙소) 주소 :</span>'
			+'					<span id="addr" style="font-size: 17px;"></span>'
			+'				</div>'
			+'				<div style="padding-top:10px;">'
			+'					<img src="https://a0.muscache.com/airbnb/static/badges/verified_badge-6ee370f5ca86a52ed6198fac858ac1f4.png" width="32" height="32" class="_j86mc1" alt="인증됨" >'
			+'					<span style="font-size: 17px;">인증됨</span>'
			+'				</div>'
			+'				<div id="moveDiv3"></div>'
			+'			</div>'
			+'		</div>'
			+'		<div id="location" style="margin: 0 auto; width: 100%; padding-top:40px; padding-bottom: 20px;">'
			+'			<span style="font-size: 28px; font-weight:bold;">지역정보</span>'
			+'			<div style="padding-top:10px;">'
			+'				<span id="loca_addr" style="font-size: 17px;"></span>'
			+'			</div>'
			+'			<div id="rev_map" style="margin-top:10px; height: 500px;">'
			+'			</div>'
			+'		</div>'
			+'	</div>'
			+'	'
			+'	<div id="revBar" style="width:27%; height:430px; display: inline-block; float:right; margin-right:17%; margin-top:-100px; padding-left:3%; z-index:900">'
			+'		<div style="width:100%; height:50px; background-color: #414141; padding-top: 10px; padding-left: 20px; opacity:0.9;">'
			+'			<span style="color:white; font-size: 25px; font-weight:bold;"> ￦  </span>'
			+'			<span id="price" style="color:white; font-size: 25px; font-weight:bold;">000,000</span>'
			+'			<span style="color:white; font-size: 25px; font-weight:bold;"> 원</span>'
			+'			<span style="color:white; font-size: 17px;">/박</span>'
			+'		</div>'
			+'		<div style="width:100%; height:470px; border: 1px solid; border-color: #c4c4c4; background: white;">'
			+'			<div id="rev_detail">'
			+'			    <div style="width: 100%">'
			+'			        <div id="datepicker1" style="width: 95%; height:100%; padding-top:10px; padding-left:5%">'
			+'                      <div id="calender">        '
			+'			         </div>'
			+'			    </div>'
			+'			</div>'
			+'		</div>'
			+'	</div>'
			+'</div>'//
			+'<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" >'
			+'	  <div class="modal-dialog">'
			+'	    <div class="modal-content">'
			+'		  <div class="modal-header">'
			+'			<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>'
			+'			<div class="modal-title" id="myModalLabel" style="width: 50%;">'
			+'				<div style="width: 30px; display: inline-block;">'
			+'				<svg viewBox="0 0 1000 1000" role="presentation" aria-hidden="true" focusable="false" style="height:2em;width:2em;display:block;fill:#FF5A5F;" data-reactid="25">'
			+'					<path d="M499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-102 119.1-149.1 141.1-265.1 90-340.2-30-43-73-64-128.1-64-111 0-172.1 94-148.1 203.1 14 59 51 126.1 110 201.1-37 41-72 70-103 88-24 13-47 21-69 23-101 15-180.1-83-144.1-184.1 5-13 15-37 32-74l1-2c55-120.1 122.1-256.1 199.1-407.2l2-5 22-42c17-31 24-45 51-62 13-8 29-12 47-12 36 0 64 21 76 38 6 9 13 21 22 36l21 41 3 6c77 151.1 144.1 287.1 199.1 407.2l1 1 20 46 12 29c9.2 23.1 11.2 46.1 8.2 70.1zm46-90.1c-7-22-19-48-34-79v-1c-71-151.1-137.1-287.1-200.1-409.2l-4-6c-45-92-77-147.1-170.1-147.1-92 0-131.1 64-171.1 147.1l-3 6c-63 122.1-129.1 258.1-200.1 409.2v2l-21 46c-8 19-12 29-13 32-51 140.1 54 263.1 181.1 263.1 1 0 5 0 10-1h14c66-8 134.1-50 203.1-125.1 69 75 137.1 117.1 203.1 125.1h14c5 1 9 1 10 1 127.1.1 232.1-123 181.1-263.1z" data-reactid="26"></path>'
			+'				</svg>'
			+'				</div>'
			+'				<div style="display:inline-block;">'
			+'					<span style="font-size: 20px; font-weight:bold;">예약 정보 확인</span>'
			+'				</div>'
			+'			</div>'
			+'		</div>'
			+'	    <div id="modal_body" class="modal-body" style="margin: 0 auto; width: 80%;">'
			+'	    </div>'
			+'	    </div>'
			+'	  </div>'
			+'	</div>'
			+'</div>';
		},
		resModal: ()=>{
			return '<div id="res_img" style="margin: auto; width: 100%; height:300px;">'
			+'	      	</div>'
			+'	      	<div style="padding-top: 5px; width: 100%; height: 40px;">'
			+'	      		<span id="formRev_name" style="float:right; font-size: 25px; font-weight:bold;"></span>'
			+'	      		<br />'
			+'	      	</div>'
			+'	      	<div style="margin-top:30px; padding-top:10px; height: 40px; border-bottom: 1px solid #D5D5D5; font-size: 17px;">'
			+'	      		<span>예약 날짜 :</span>'
			+'	      		<span id="formDt" style="margin-left:10px;"></span>'
			+'	      	</div>'
			+'	      	<div style="padding-top:10px; height: 90px; font-size: 17px; border-bottom: 1px solid #D5D5D5;">'
			+'	     	 	<span>성인 : </span><span id="formA" style="margin-left:10px;"></span>'
			+'	     	 	<br />'
			+'	     	 	<span>청소년 :</span><span id="formT" style="margin-left:10px;"></span>'
			+'	     	 	<br />'
			+'	     	 	<span>유아 :</span><span id="formC" style="margin-left:10px;"></span>'
			+'	      	</div>'
			+'	      	<div style="padding-top:10px; height: 40px; font-size: 17px;">'
			+'	      		<span>총 금액 :</span>'
			+'	      		<span id="form_price" style="margin-left:10px;"></span>'
			+'	      	</div>'
			+'	    	<div id="formCm" class="modal-footer">'
			+'	   		</div>';
			
		},
		endModal: ()=>{
			return 	'<div style="padding-top: 5px; width: 100%; height: 200px; padding-top:15%;  text-align: center;">'
			+'	<span style="font-size: 24px; font-weight:bold;">예약은 로그인이 필요합니다.</span>'
			+'	</div>';
		},
		cal: ()=>{
			return  '<div id="pick-date-bar">'
            +'       <div id="start-date"></div>'
            +'       <div id="end-date" ></div><br>'
            +'       </div>'
            +'           <div id="my-element" data-language="korea" class="datepicker-here" data-multiple-dates-separator=" - "></div>'
            +'       </div>'
            +'       <p id="count-selected"></p>';
		},
};
var regForm={
		layout : ()=>{
			return '<div id="resi_container"  style="height: 100%; background-color:#FAFAFA;">'
			+'	<div id="proDiv"> '
			+'		<div class="progress"  style="height: 17px; background-color: #E7E7E7; margin-bottom:0;">'
			+'			<div id="progressBar" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 25%; background-color: #00A699;">'
			+'			    <span class="sr-only"></span>'
			+'			</div>'
			+'		</div>'
			+'	</div> '
			+'	<div> '
			+'		<div id="register" style="width: 35%; height: 650px; margin:0 auto; background-color: white; padding-top: 4%;">'
			+'			<div style="width: 100%; padding-left:10%;">'
			+'				<div>'
			+'				<span id="title" style="font-size: 30px; font-weight: 700;">숙소의  위치를 알려주세요.</span>'
			+'				</div>'
			+'				<div style="padding-top: 4%;">'
			+'					<div id="registerCont">'
			+'					</div>'
			+'				</div>'
			+'				<div id="nextBtnDiv" style="background-color: white; padding-top: 10%;  padding-right: 5%;">'
			+'				</div>'
			+'			</div>'
			+'		</div>'
			+'	</div>'
			+'</div>';
		},
		
		address : ()=>{
			return 			'	<div id="addressForm">'
			+'						<div style="padding-top: 2%; width: 100%">'
			+'							<div style="display: inline-block; width:41%; ">'
			+'								<span style="font-size: 20px;">시/도</span>'
			+'								<br />'
			+'								<select id="addr_si" style="width:100%;height:50px;font-size:17px;">'
			+'									<option value="서울특별시">서울특별시</option>'
			+'									<option value="부산광역시">부산광역시</option>'
			+'									<option value="전라북도">전라북도</option>'
			+'									<option value="경상북도">경상북도</option>'
			+'									<option value="제주특별자치도">제주특별자치도</option>'
			+'								</select>'
			+'							</div>'
			+'							<div style="display: inline-block; width:46%; padding-left:5%;">'
			+'								<span style="font-size: 20px;">구/군</span>'
			+'								<br />'
			+'								<input  id="addr_gu" style="width:100%;height:50px;font-size:17px; " type="text" placeholder="예) 마포구" name="address2">'
			+'							</div>'
			+'						</div>'
			+'						<div style="padding-top: 4%;">'
			+'							<span style="font-size: 20px;">도로명 / 건물번호 / 아파트 이름 / 건물 이름</span>'
			+'							<input id="addr_doro" style="width:88%;height:50px;font-size:17px" type="text" id="address3" placeholder="예) 백범로 23" name="address3">'
			+'						</div>'
			+'						<div style="padding-top: 4%;">'
			+'							<span style="font-size: 20px;">아파트/건물명 및 동/호수(선택사항)</span>'
			+'							<input id="addr_apt" style="width:88%;height:50px;font-size:17px" type="text" id="address4" placeholder="예) 거구장 3층" name="address4">'
			+'						</div>'
			+'						<div style="padding-top: 4%;">'
			+'							<span style="font-size: 20px;">우편번호</span>'
			+'							<br />'
			+'							<input id="addr_post" style="width:88%;height:50px;font-size:17px" type="text" id="address" placeholder="예) 06014" name="address5">'
			+'						</div>'
			+'						</div>';
		},
		
		info : ()=>{
			return '		<div id="infoForm">'
			+'			<div>'
			+'				<div>'
			+'					<span style="font-size: 20px;">숙소 유형</span>'
			+'				</div>'
			+'				<select id="house" style="width:41%;height:50px;font-size:15px">'
			+'					<option value="1">개인실</option>'
			+'				</select>'
			+'				<select id="info_room" style=" width:41%; margin-left:5%; height:50px; font-size:15px">'
			+'					<option value="1">침실 1개</option>'
			+'					<option value="2">침실 2개 </option>'
			+'					<option value="3">침실 3개 </option>'
			+'					<option value="4">침실 4개 </option>'
			+'					<option value="5">침실 5개 </option>'
			+'				</select>'
			+'			</div>	'
			+'			<div style="margin-top: 5%;">'
			+'				<div>'
			+'					<span style="font-size: 20px;">숙박 인원(명)</span>'
			+'				</div>'
			+'				<select id="info_limit" style="width:88%; height:50px; font-size:15px">'
			+'					<option value="1">인원 1명</option>'
			+'					<option value="2">인원 2명 </option>'
			+'					<option value="3">인원 3명 </option>'
			+'					<option value="4">인원 4명 </option>'
			+'					<option value="5">인원 5명 </option>'
			+'					<option value="6">인원 6명 </option>'
			+'					<option value="7">인원 7명 </option>'
			+'					<option value="8">인원 8명 </option>'
			+'					<option value="9">인원 9명 </option>'
			+'					<option value="10">인원 10명 </option>'
			+'					<option value="11">인원 11명 </option>'
			+'					<option value="12">인원 12명 </option>'
			+'					<option value="13">인원 13명 </option>'
			+'					<option value="14">인원 14명 </option>'
			+'					<option value="15">인원 15명 </option>'
			+'				</select>'
			+'         	</div>'
			+'			<div style="margin-top: 5%;">'
			+'				<span style="font-size: 20px;">숙소 이름</span>'
			+'				<input id="info_name" style="width:88%; height:50px; font-size:15px" type="text" placeholder="10자 이상 50자 이하로 입력해 주세요.">'
			+'			</div>'
			+'			<div style="margin-top: 5%;">'
			+'				<span style="font-size: 20px;">1박 (하룻밤) 이용 요금</span>'
			+'				<br />'
			+'				<span style="font-size: 15px; color: red;">※최대 200,000원을 넘길 수 없습니다.</span>'
			+'				<input id="info_price" style="width:88%; height:50px; font-size:15px" type="text" placeholder="예) 89000">'
			+'			</div>'
			+'		</div>';
		},
		
		detail: ()=>{
			return '<div style="padding-top: 2%; width: 100%">'
			+'				<div style="display: inline-block; width:41%; ">'
			+'					<span style="font-size: 20px;">침대 개수</span>'
			+'					<br />'
			+'					<select id="info_bed" style="width:100%; height:50px;font-size:17px; outline-style: none">'
			+'					<option value="1">1</option>'
			+'					<option value="2">2</option>'
			+'					<option value="3">3</option>'
			+'					<option value="3">4</option>'
			+'					<option value="3">5</option>'
			+'				</select>'
			+'				</div>'
			+'				<div style="display: inline-block; width:46%; padding-left:5%;">'
			+'					<span style="font-size: 20px;">욕실개수</span>'
			+'					<br />'
			+'					<select id="info_rest" style="width:100%; height:50px;font-size:17px; outline-style: none">'
			+'					<option value="1">1</option>'
			+'					<option value="2">2</option>'
			+'					<option value="3">3</option>'
			+'					<option value="3">4</option>'
			+'					<option value="3">5</option>'
			+'				</select>'
			+'				</div>'
			+'			</div>'
			+'			<div style="padding-top: 10%;">'
			+'				<span style="font-size: 20px;">편의시설 / 중복선택 가능</span>'
			+'			</div>'
			+'			<div style="margin-top:5px; padding-top:10px; width:88%; font-size: 20px;">'
			+'				<div>'
			+'			 	    <span><input type="checkbox" name="info_ess" value="essentialItem" checked="checked" />필수용품</span> '
			+'				    <span style="margin-left:25px;"><input type="checkbox" name="info_ess" value="tv" />티비</span> '
			+'					<span style="margin-left:25px;"><input type="checkbox" name="info_ess" value="parking"  />주차장</span>'
			+'					<span style="margin-left:25px;"><input type="checkbox" name="info_ess" value="wifi" />와이파이</span>'
			+'				</div>'
			+'				<div>'
			+'					<span><input type="checkbox" name="info_ess" value="pet" />애완동물</span>'
			+'					<span style="margin-left:25px;"><input type="checkbox" name="info_ess" value="kitchen" />부엌</span>'
			+'					<span style="margin-left:25px;"><input type="checkbox" name="info_ess" value="washingMac" />세탁기</span>'
			+'					<span style="margin-left:25px;"><input type="checkbox" name="info_ess" value="airCondi" />냉난방</span>'
			+'				</div>'
			+'			</div>'
			+'			<div>'
			+'			 	<div style="padding-top: 10%;">'
			+'					<span style="font-size: 20px;">숙소 상세 설명</span>'
			+'				</div>'
			+'				<div>'
			+'					<textarea id="info_cont" cols="60" rows="8" style="resize:none;"></textarea>'	
			+'				</div>'
			+'			</div>';

		},
		
		endForm: ()=>{
			return '<div style="width:100%; height: 650px;">'
			+'				<div style="width:180px; height:150px; margin: 0 auto; padding-top: 15%; padding-right:20%;">'
			+'					<svg viewBox="0 0 1000 1000" role="presentation" aria-hidden="true" focusable="false" style="height:10em;width:10em;display:block;fill:#FF5A5F;" data-reactid="25">'
			+'			            <path d="M499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-102 119.1-149.1 141.1-265.1 90-340.2-30-43-73-64-128.1-64-111 0-172.1 94-148.1 203.1 14 59 51 126.1 110 201.1-37 41-72 70-103 88-24 13-47 21-69 23-101 15-180.1-83-144.1-184.1 5-13 15-37 32-74l1-2c55-120.1 122.1-256.1 199.1-407.2l2-5 22-42c17-31 24-45 51-62 13-8 29-12 47-12 36 0 64 21 76 38 6 9 13 21 22 36l21 41 3 6c77 151.1 144.1 287.1 199.1 407.2l1 1 20 46 12 29c9.2 23.1 11.2 46.1 8.2 70.1zm46-90.1c-7-22-19-48-34-79v-1c-71-151.1-137.1-287.1-200.1-409.2l-4-6c-45-92-77-147.1-170.1-147.1-92 0-131.1 64-171.1 147.1l-3 6c-63 122.1-129.1 258.1-200.1 409.2v2l-21 46c-8 19-12 29-13 32-51 140.1 54 263.1 181.1 263.1 1 0 5 0 10-1h14c66-8 134.1-50 203.1-125.1 69 75 137.1 117.1 203.1 125.1h14c5 1 9 1 10 1 127.1.1 232.1-123 181.1-263.1z" data-reactid="26"></path>'
			+'			        </svg>'
			+'		        </div>'
			+'				<div style="margin: 0 auto; padding-top: 20%; padding-right:10%; text-align: center;">'
			+'					<span style="font-size: 28px; font-weight: 700;">숙소 등록이 완료되었습니다!</span>'
			+'				</div>'
			+'				<div style="width:90%; margin: 0 auto; padding-top: 25px; padding-right:10%; text-align: center;">'
			+'					<span style="font-size: 20px; font-weight: 500; padding-top: 20%">이제 회원님의 숙소에서 묵을 게스트들을 찾아 부수입을 올릴 수 있습니다.</span>'
			+'				</div>'
			+'				<div id="endBtn" style=" margin: 0 auto; padding-top: 30%; padding-right:10%">'
			+'				</div>'
			+'			</div>';
		},
		personForm:()=>{
			return '	<div style="width: 95%; height:100%; padding-top:10px; padding-left:10%">'
			+'				<div style="border-bottom: 1px solid #D5D5D5; vertical-align: middle; width:93%; height:35px;">'
			+'					<span style="font-size:20px;">인원</span>'
			+'					<span class="glyphicon glyphicon-user" style="font-size:15px;"></span>'
			+'				</div>'
			+'				<div style="margin-top:6%;">'
			+'					<div style="display: inline-block;">'
			+'			   			<span style="font-size:18px">성인</span>'
			+'					</div>'
			+'					<div style="display: inline-block; float:right; padding-right:6%;">'
			+'		        		<span id="revUpA"></span>'
			+'		        		<span id="revNumA" style="font-size:18px;">0</span>'
			+'		        		<span id="revDownA"></span>'
			+'					</div>'
			+'				</div>'
			+'				<div style="margin-top:5%;">'
			+'					<div style="display: inline-block;">'
			+'			   			<span style="font-size:18px">청소년</span>'
			+'					</div>'
			+'					<div style="display: inline-block; float:right; padding-right:6%;">'
			+'			       		<span id="revUpT"></span>'
			+'			       		<span id="revNumT" style="font-size:18px;">0</span>'
			+'			       		<span id="revDownT"></span>'
			+'					</div>'
			+'				</div>'
			+'				<div style="margin-top:5%">'
			+'					<div style="display: inline-block;">'
			+'			   			<span style="font-size:18px">유아</span>'
			+'					</div>'
			+'					<div style="display: inline-block; float:right; padding-right:6%;">'
			+'		        		<span id="revUpC"></span>'
			+'		        		<span id="revNumC" style="font-size:18px;">0</span>'
			+'		        		<span id="revDownC"></span>'
			+'					</div>'
			+'				</div>'
			+'				<div style="border-bottom: 1px solid #D5D5D5; vertical-align: middle; width:93%; height:35px; margin-top:10%">'
			+'					<span style="font-size:20px;">결제 금액</span>'
			+'					<span class="glyphicon glyphicon-credit-card" style="font-size:15px;"></span>'
			+'				</div>'
			+'				<div>'
			+'					<div style="margin-top:5%;">'
			+'						<div style="display: inline-block;">'
			+'			   				<span style="font-size:18px">1박 요금</span>'
			+'						</div>'
			+'						<div style="display: inline-block; float:right; padding-right:6%;">'
			+'			   				<span id="revbar_price" style="font-size:18px"></span>'
			+'						</div>'
			+'					</div>'
			+'					<div style="margin-top:5%;">'
			+'						<div style="display: inline-block;">'
			+'			   				<span style="font-size:18px">숙박 일수</span>'
			+'						</div>'
			+'						<div style="display: inline-block; float:right; padding-right:6%;">'
			+'			   				<span id="revbar_day" style="font-size:18px"></span>'
			+'						</div>'
			+'					</div>'
			+'					<div style="margin-top:5%;">'
			+'						<div style="display: inline-block;">'
			+'			   				<span style="font-size:18px; font-weight:600; color:#FF5A5F">총 결제 금액</span>'
			+'						</div>'
			+'						<div style="display: inline-block; float:right; padding-right:6%;">'
			+'			   				<span id="revbar_result" style="font-size:18px"></span>'
			+'			   				<span style="font-size:18px"> 원</span>'
			+'						</div>'
			+'					</div>'
			+'				</div>'
			+'			</div>'
			+'			<div id="revBtn" style="margin-top:8%; padding-left:7%;">'
			+'			</div>';
		},
		
};
var allReg={
		layout:()=>{
			return '<div style="width:100%; height:100%; border-top:1px; solid black">'
			+'	<div id="y_content" style="width:64%; height:700px; display:inline-block; margin-left: 3em; padding-top: 6%;">'
			+'		<div id="y_list" style="width:100%; height:100%">'
			+'		</div>'
			+'		<div id="y_pagination" style="width:100%; height:100%; margin-top: 6.7em;">'
			+'		</div>'
			+'	</div>'
			+'	<div id="y_map" style="width:33%; height:800px; display:inline-block; float: right; margin-top: 5em;">'
			+'	</div>'
			+'</div>';
		}
};