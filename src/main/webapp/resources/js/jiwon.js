/* project */
var jw=jw || {}; /*name space*/
jw.common = (function(){
	var init = function(ctx){
		jw.session.init(ctx);
		jw.index.init();
	};
	
	return {init : init};
})();

/*******************************
 * admin index
 *******************************/
jw.index = (function(){
	var js, ctx, temp;
	var init = function(){
		ctx = $$('x');
		js=$$('j');
		temp=js+'/template.js';
		setContentView();
	};
	
	var setContentView = function(){
		$('body').css({'padding-right':'0'});
		$('body').html(admIndex.frame());
		$.getScript(temp, ()=>{
			compUI.span('stat_btn_gostat').appendTo($('#idx_li_stat')).text('통계')
			.click(()=>{
				jw.stats.init();
			});
			compUI.span('stat_btn_goaccm').appendTo($('#idx_li_acc')).text('숙소')
			.click(()=>{
				jw.accom.init();
			});
			compUI.span('stat_btn_gobrd').appendTo($('#idx_li_brd')).text('도움말')
			.click(()=>{
				jw.board.list();
			});
			compUI.span('stat_btn_gohome').appendTo($('#navbar_R')).text('사용자화면 이동').addClass('jw_index_btngohome')
			.click(()=>{
				//main 이동
				$('body').empty();
				app.common.init(ctx);
			});
		});
		
		//default : 통계
		jw.stats.init();
	};
	
	return {init : init};
})();


/*******************************
 * 통계
 *******************************/
jw.stats = (()=>{
	var ctx, js, temp;
	var init = function(){
		js=$$('j');
		ctx = $$('x');
		temp=js+'/template.js';
		onCreate();
	};
	var onCreate = function(){
		setContentView();
	};
	
	var setContentView = function(){
		$('#content').html(statsUI.frame());
		
		//chart 호출
		jw.chart.geoChart();
		
		//split data
		$.getJSON(ctx+'/jw/get/dash', d=>{
			$('#stat_span_memCnt').text(d.data.rowNum);
			$('#stat_span_hostCnt').text(d.data.totalCnt);
			$('#stat_span_dailySale').text(d.data.sale);
			$('#stat_span_yearSale').text(d.data.limitNo);
		});
	}; 
	
	return { init : init };
})();

/*******************************
 * chart
 * 객체 literal 생성방식
 * 부품들을 (DOM객체)return 하기만 하면 됨
 *******************************/
jw.chart = (()=>{
	var ctx
	var init = ()=>{
		ctx = $$('x');
	};
	
	var geoChart = ()=>{
	      init();
	      google.charts.load('current', {'packages':['geochart'], 'mapsApiKey': 'AIzaSyB2po9awT3gcPJdB_pK8XKHVZitS2zg-1U'});
	      google.charts.setOnLoadCallback(drawRegionsMap);
	   
	      function drawRegionsMap() {
	         var url = ctx+'/jw/list/chart/geo';
	         $.getJSON(url, d=>{
	            var data = new google.visualization.DataTable(d);
	        
	            var options = {
	                 displayMode: 'regions',
	                 enableRegionInteractivity: 'true',
	                 resolution: 'provinces',
	                 region : 'KR',
	                 displayMode: 'markers',
	                 sizeAxis: { minValue: 1 },
	                 colorAxis : {colors: ['#3182BD','#9ECAE1','#DEEBF7']},
	                 keepAspectRatio: true
	              };

	              var chart = new google.visualization.GeoChart($('#stat_Rtop_chart')[0]);
	              chart.draw(data, options);
	         });
	       }
	      
	      //lineChart 호출
	       lineChart();
	   };
	
	var lineChart = ()=>{
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawChart);
	
		function drawChart() {
			var url = ctx+'/jw/list/chart/line';
			$.getJSON(url, d=>{
				var data = new google.visualization.DataTable(d);
		  
				var options = {
		        	curveType: 'function',
		        	legend: { position: 'bottom' },
		        	vAxis: {format: 'decimal'},
		        	hAxis: {titleTextStyle: {color: '#333'}, format: 'decimal'},
		        	vAxis: {minValue: 0},
		        	colors: ['#FF5A5F']
				};
				var chart = new google.visualization.AreaChart($('#stat_div_line')[0]);
				chart.draw(data, options);
			});
		}
		
		//columnChart 호출
		columnChart();
	};
	
	var columnChart = ()=>{
		google.charts.load('current', {'packages':['bar']});
	    google.charts.setOnLoadCallback(drawChart);
	    
	    function drawChart() {
	    	var url = ctx+'/jw/list/chart/column';
			$.getJSON(url, d=>{
				var data = new google.visualization.DataTable(d);
		  
				var options = {
						title : ' ',
		                bars: 'vertical',
		                vAxis: {format: 'decimal'},
		                legend: { position: 'bottom' },
		                chartArea: {left: 30, top: 10, width: '100%', height: '70%'},
		                hAxis: {textStyle: {fontSize: 15}},
		                colors: ['#01B8AA', '#374649', '#FF5A5F']
		        };
				
				var chart = new google.charts.Bar(document.getElementById('stat_div_column'));
		        chart.draw(data, google.charts.Bar.convertOptions(options));
			});
	    }
	};
	
	return { 
		init : init,
		columnChart : columnChart,
		lineChart : lineChart,
		geoChart : geoChart
	};
})();

/*******************************
 * 숙소
 *******************************/
jw.accom = (()=>{
	var ctx, js, temp, img;
	var init = function(){
		js=$$('j');
		ctx = $$('x');
		img = $$('i');
		temp=js+'/template.js';
		onCreate();
	};
	var onCreate = function(){
		setContentView();
	};
	var setContentView = function(){
		$('#content').html(accomUI.frame());
		$.getScript(temp, ()=>{
			compUI.spanX().appendTo($('#acc_titleH')).text('숙소관리').css({'font-weight':'bold', 'font-size':'20px'});
			
			//accom search bar
			compUI.input('acc_search', 'text').appendTo($('#acc_input_grp')).addClass('form-control').attr('placeholder','Search...');
			compUI.span('acc_btngrp').appendTo($('#acc_input_grp')).addClass('input-group-btn');
			compUI.btn('acc_btn_search').appendTo($('#acc_btngrp')).addClass('btn btn-default search_btn')
			.click(()=>{
				//search
				var _search = ($('#acc_search').val()==="")?'x':$('#acc_search').val();
				var url = ctx+'/jw/list/residence/'+_search+'/1';

				$.getJSON(url, d=>{
					$('#acc_list').empty();
					acclistDraw(d);
				});
			});
			compUI.spanX().addClass('glyphicon glyphicon-search').appendTo($('#acc_btn_search'));
			
			//accom list
			var url = ctx+'/jw/list/residence/x/1';
			$.getJSON(url, d=>{
				$('#acc_list').empty();
				acclistDraw(d);
			});
		});
	}; 
	
	var acclistDraw = (d)=>{
		$.each(d.list, (i,j)=>{
			compUI.div("dvwrap_"+i).appendTo($('#acc_list')).css({'float':'left', 'height':'300px', 'width':'25%', 'margin-top':'5px'});
			//image
			var mainImg = (j.infoImg === "" || j.infoImg === null)?img+'/testimg.jpg':j.infoImg;
			compUI.div("dvimg_"+i).appendTo($('#dvwrap_'+i)).css({'float':'left', 'height':'73%', 'width':'100%', 'margin-top':'5px'});
			compUI.image('img_'+j.hostSerial, mainImg).appendTo($('#dvimg_'+i)).css({'width':'97%', 'height':'100%', 'margin':'auto', 'display':'block', 'border':'1px solid #D5D5D5'});
			//content
			compUI.div("dvbtom_"+i).appendTo($('#dvwrap_'+i)).css({'float':'left', 'height':'15%', 'width':'100%', 'margin-top':'5px'});
			compUI.div("dv_T"+i).appendTo($('#dvbtom_'+i)).css({'margin-left':'5px', 'height':'38px'});
			compUI.spanX().appendTo($('#dv_T'+i)).text(j.residenceName).css({'font-weight':'bold'});
			compUI.div("dv_L"+i).appendTo($('#dvbtom_'+i)).css({'float':'left'});
			compUI.spanX().appendTo($('#dv_L'+i)).text("호스트 : "+j.memberId).css({'margin-left':'5px', 'font-weight':'bold'});
			compUI.div("dv_R"+i).appendTo($('#dvbtom_'+i)).css({'float':'right'});
			compUI.span('acc_btn_del_'+i).appendTo($('#dv_R'+i)).html('삭제').attr('displsy','inline').addClass('label label-default').css({'margin-right':'5px', 'font-size':'90%', 'cursor':'pointer'})
			.click(()=>{
				var _serial = j.hostSerial;
				if(confirm("숙소 "+j.residenceName+"을 정말 삭제하시겠습니까?")){
					$.ajax({
						url : ctx+'/jw/delete/residence',
						method : 'post',
						dataType : 'json',
						data : JSON.stringify({
		                    'boardSeq' : _serial
		                }),
						contentType : 'application/json', 
						success : d=>{
							if(d.result === "success"){
								alert("삭제성공!!");
								$('#acc_list').empty();
								setContentView();
							}else{
								alert("삭제실패!!");
							}
						},
						error : (x,s,m)=>{
							alert('에러발생! '+m);
						}
					});
				}else{
					return false;
				}
			})
		});
	}
	
	return { init : init };
})();

/*******************************
 * 게시판
 *******************************/
jw.board = (()=>{
	var js, ctx, temp, action_flag;
	var init = ()=>{
		js=$$('j');
		ctx=$$('x')
		temp=js+'/template.js';
		action_flag = "insert";
	};
	
	var list = ()=>{
		init();
		$('#content').html(boardUI.frame());
		$.getScript(temp, ()=>{
			//search bar
			compUI.input('brd_search', 'text').appendTo($('#brd_input_grp')).addClass('form-control').attr('placeholder','Search...');
			compUI.span('brd_btngrp').appendTo($('#brd_input_grp')).addClass('input-group-btn');
			compUI.btn('brd_btn_search').appendTo($('#brd_btngrp')).addClass('btn btn-default search_btn')
			.click(()=>{
				var _search = ($('#brd_search').val()==="")?'x':$('#brd_search').val();
				var url = ctx+'/jw/list/board/'+_search+'/x';
				$.getJSON(url, d=>{
					brdlistDraw(d);
					//$('#brd_pagebar').append(boardUI.pagebar());
				});
			});
			compUI.spanX().addClass('glyphicon glyphicon-search').appendTo($('#brd_btn_search'));
			
			//board button_grp 
			compUI.span('brd_btn_write').appendTo($('#brd_btn_grp')).attr('displsy','inline').html('글쓰기').addClass('label label-danger').css({'font-size':'90%', 'cursor':'pointer'})
			.click(()=>{
				detail('w');
			});
			
			//board_list
			$('#brd_list').html(boardUI.tbl());
			var url = ctx+'/jw/list/board/x/1';
			
			$.getJSON(url, d=>{
				brdlistDraw(d);
				//$('#brd_pagebar').append(boardUI.pagebar());
			});
			
			//pagebar
			$('#brd_pagebar').append(boardUI.pagebar());
			
		});
	}; 
	
	var brdlistDraw = (d)=>{
		var tr="";
		$.each(d.list, (i,j)=>{
			tr += '<tr style="height:25px; text-align:center;">'
				+ '<td>'+j.boardSeq+'</td>'
				+ '<td>'+j.cateName+'</td>'
				+ '<td>'+j.title+'</td>'
				+ '<td>'+j.regdate+'</td>'
				+ '<td id="tbl_btnarea'+j.boardSeq+'"></td>'
				+ '</tr>'
		});
		$('#brd_tbody').html(tr);	
		
		//수정&삭제 버튼
		$.each(d.list, (i,j)=>{
			compUI.span('brd_btn_modify_'+i).appendTo($('#tbl_btnarea'+j.boardSeq)).attr('displsy','inline').html('수정').addClass('label label-warning').css({'cursor':'pointer'})
			.click(()=>{
				detail('u', j.boardSeq);	
				action_flag = "update";
				$.ajax({
					url : ctx + '/jw/get/board',
					method : 'post',
					dataType : 'json',
					data : JSON.stringify({
						'boardSeq' : j.boardSeq,
						'title' : 'board_seq'
					}),
					contentType : 'application/json', 
					success : d=>{
						$("#brdD_txt_lvl1").val(d.detail.cateName);
						$('#brdD_ipt_title').val(d.detail.title);
						$('#summernote').summernote('code', d.detail.contents);
					},
					error : (x,s,m)=>{
						alert('에러발생! '+m);
					}
				});
			});
			
			compUI.span('brd_btn_del_'+i).appendTo($('#tbl_btnarea'+j.boardSeq)).html('삭제').attr('displsy','inline').addClass('label label-default').css({'margin-left':'3px', 'cursor':'pointer'})
			.click(()=>{
				if(confirm("게시글 "+j.boardSeq+"을 정말 삭제하시겠습니까?")){
					$.ajax({
						url : ctx + '/jw/delete/board',
						method : 'post',
						dataType : 'json',
						data : JSON.stringify({
							'boardSeq' : j.boardSeq,
						}),
						contentType : 'application/json', 
						success : d=>{
							if(d.result === "success"){
								alert("삭제성공!!");
								list();
							}else{
								alert("삭제실패!!");
							}
						},
						error : (x,s,m)=>{
							alert('에러발생! '+m);
						}
					});
				}else{
					return false;
				}
			});
		});
	};
	
	var detail = (x, y)=>{
		init();
		$('#content').html(boardUI.detail(x));
		$.getScript(temp, ()=>{
			var title_msg = (x ==='w')?'글쓰기':'글수정';
			var action = (x ==='w')?'post':'put';
			//board header title
			compUI.span('brdD_titleH').appendTo($('#brdD_dv_title')).text(title_msg).css({'font-weight':'bold', 'font-size':'20px', 'padding':'0 5 0 0'});
			//board button_grp 
			compUI.span('brdD_btn_golist').appendTo($('#brdD_btn_grp')).attr('displsy','inline').html('목록으로').addClass('label label-default').css({'font-size':'90%', 'cursor':'pointer'})
			.click(()=>{
				jw.board.list();
			});
			compUI.span('brdD_btn_ok').appendTo($('#brdD_btn_grp')).attr('displsy','inline').html('완료').addClass('label label-danger').css({'font-size':'90%', 'margin-left':'3px', 'cursor':'pointer'})
			.click(()=>{
				var _combo = $('#brdD_combo_lvl1').val();
				var _combo_name = $("#brdD_combo_lvl1 option:selected").text();
				var _title = $('#brdD_ipt_title').val();
				var _content = $('#summernote').summernote('code');
				var _bo_seq = (action_flag === "update")? y: "";
				
				if(_title===""){
					alert("제목을 입력하세요");
					return false;
				}
				
				$.ajax({
					 url : ctx+'/jw/'+action+'/board',
					 method : 'post',
		             dataType : 'json',
		             data : JSON.stringify({
		            	 'boardSeq' : _bo_seq,
		            	 'regdate' : _combo,
		            	 'memberId' : _combo_name,
		            	 'title' : _title,
		            	 'contents' : _content
		             }),
		             contentType : 'application/json',
		             success : d=>{
		            	 if(d.result==="success"){
		            		 alert(title_msg+" 성공!!");
		            		 list();
		            	 }else{
		            		 alert(title_msg+" 실패!!");
		            	 }
		             },
		             error : (x,s,m)=>{
		            	 alert('에러발생! '+m);
		             }
				});
			});
			
			//comboBox
			if(x ==='w'){
				compUI.select('brdD_combo_lvl1').appendTo($('#brdD_gubun')).css({'height':'30px', 'width':'100px', 'margin-right':'5px'});
				var url = ctx+'/jw/list/combo/x/x';
				$.getJSON(url, d=>{
					$('#brdD_combo_lvl1').empty();
					$.each(d.combobox, (i,j)=>{
						compUI.option(j.cateLevel, j.cateName).appendTo($('#brdD_combo_lvl1'));
	        		});
				});	
				$('#brdD_combo_lvl1').selectedIndex="0";
			}else{
				compUI.input('brdD_txt_lvl1').appendTo($('#brdD_gubun')).attr('readonly',true).css({'height':'30px', 'width':'100px', 'margin-right':'5px', 'text-align':'center'});
			}
			
			
			//input title
			compUI.input('brdD_ipt_title', 'text').appendTo($('#brdD_title')).css({'height':'30px', 'width':'100%'});
		});
		
		//위지웍 에디터 적용
		$(document).ready(()=>{ 
			$('#summernote').summernote({
				height: 400,          // 기본 높이값
			    minHeight: null,      // 최소 높이값(null은 제한 없음)
			    maxHeight: 400,       // 최대 높이값(null은 제한 없음)
			    focus: true,          // 페이지가 열릴때 포커스를 지정함
			    lang: 'ko-KR'         // 한국어 지정(기본값은 en-US)
			}); 
		});
	};
	
	return { 
		init : init,
		list : list,
		detail : detail
	};
})();



/*******************************
 * session
 * session :login 후 필요한 정보 담음
 *******************************/
jw.session=
	{
		//set
		init : (ctx)=>{
					sessionStorage.setItem('x', ctx);	//접근경로를 로그인 할때만 준다(보안)
					sessionStorage.setItem('j', ctx+'/resources/js');
					sessionStorage.setItem('i', ctx+'/resources/img');
					sessionStorage.setItem('c', ctx+'/resources/css');
			   },
		//get
		getPath : (x)=>{
			return sessionStorage.getItem(x);
		}
	};

//함수
var $$ = (x)=>{return jw.session.getPath(x);};

/*******************************
 * UI
 * index UI
 *******************************/
var admIndex = {
	frame : ()=>{
		return '<div id="container">'
				+ '<div id="header" class="jw_index_header" style="background-color:#212121">'
				+ '		<div style="float:left" class="jw_main-nav-logobox">'
                + '			<div class="jw_main-nav-logobox2">'
                + '				<div class="jw_main-nav-logobox3">'
                + '  				<svg viewBox="0 0 1000 1000" role="presentation" aria-hidden="true" focusable="false" style="display: block;fill: currentColor;height: 1em;width: 1em;">'
                + '   				<path d="M499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-102 119.1-149.1 141.1-265.1 90-340.2-30-43-73-64-128.1-64-111 0-172.1 94-148.1 203.1 14 59 51 126.1 110 201.1-37 41-72 70-103 88-24 13-47 21-69 23-101 15-180.1-83-144.1-184.1 5-13 15-37 32-74l1-2c55-120.1 122.1-256.1 199.1-407.2l2-5 22-42c17-31 24-45 51-62 13-8 29-12 47-12 36 0 64 21 76 38 6 9 13 21 22 36l21 41 3 6c77 151.1 144.1 287.1 199.1 407.2l1 1 20 46 12 29c9.2 23.1 11.2 46.1 8.2 70.1zm46-90.1c-7-22-19-48-34-79v-1c-71-151.1-137.1-287.1-200.1-409.2l-4-6c-45-92-77-147.1-170.1-147.1-92 0-131.1 64-171.1 147.1l-3 6c-63 122.1-129.1 258.1-200.1 409.2v2l-21 46c-8 19-12 29-13 32-51 140.1 54 263.1 181.1 263.1 1 0 5 0 10-1h14c66-8 134.1-50 203.1-125.1 69 75 137.1 117.1 203.1 125.1h14c5 1 9 1 10 1 127.1.1 232.1-123 181.1-263.1z"></path>'
                + '					</svg>'
                + '				</div>'
                + '			</div>'
                + '		</div>'
				+ '		<div id="navbar_L" style="float:left;">'
				+ '			<nav>'
				+ '  			<ul class="jw_navbar-ul">'
				+ '    				<li id="idx_li_stat"></li>'
				+ '   				<li id="idx_li_acc"></li>'
				+ '    				<li id="idx_li_brd"></li>'
				+ '  			</ul>'
				+ '			</nav>'
				+ '		</div>'             
				+ '		<div id="navbar_R" style="float:right"></div>'
				+ '</div>'
				+ '<div class="jw_main-nav-blank"></div>'
				+ '<div id="content">content</div>'
				+ '</div>';
	}
}

/*******************************
 * 통계 UI
 *******************************/
 var statsUI = {
	frame : ()=>{
		return '<div style="width:80%; margin:auto;">'
				+ '		<div style="display:inline-block; width:100%;">'
				+ '		<div style="float:left; width:55%">'
				+ '			<div>'
				+ '				<div class="jw_stat_title">'
				+ '					<div style="float:left"><span class="jw_header_title">> Airbnb 현황<span></div>'
				+ '					<div id="stat_dvbtn_1" style="float:right"></div>'
				+ '				</div>'
				+ '				<div>'
				+ '					<div class="jw_div_splitborder" style="margin-right:7px;">'
				+ '						<div class="jw_div_split_img"><span class="glyphicon glyphicon-user" style="font-size:70px; color:#01B8AA" /></div>'
				+ '						<div class="jw_div_split_num"><span id="stat_span_memCnt" style="color:#01B8AA;"></span></div>'
				+ '						<div class="jw_div_split_title" style="background-color:#01B8AA;"><span>가입 회원수</span></div>'
				+ '					</div>'
				+ '					<div class="jw_div_splitborder" style="margin-right:7px;">'
				+ '						<div class="jw_div_split_img"><span class="glyphicon glyphicon-home" style="font-size:70px; color:#374649" /></div>'
				+ '						<div class="jw_div_split_num"><span id="stat_span_hostCnt" style="color:#374649;"></span></div>'
				+ '						<div class="jw_div_split_title" style="background-color:#374649;"><span>호스팅 회원수</span></div>'
				+ '					</div>'
				+ '					<div class="jw_div_splitborder" style="margin-right:7px;">'
				+ '						<div class="jw_div_split_img"><span class="glyphicon glyphicon-usd" style="font-size:70px; color:#FF5A5F" /></div>'
				+ '						<div class="jw_div_split_num"><span id="stat_span_dailySale" style="color:#FF5A5F;"></span></div>'
				+ '						<div class="jw_div_split_title" style="background-color:#FF5A5F;"><span>일 매출실적</span></div>'
				+ '					</div>'
				+ '					<div class="jw_div_splitborder">'
				+ '						<div class="jw_div_split_img"><span class="	glyphicon glyphicon-menu-hamburger" style="font-size:70px; color:#F2C80F" /></div>'
				+ '						<div class="jw_div_split_num"><span id="stat_span_yearSale" style="color:#F2C80F;"></span></div>'
				+ '						<div class="jw_div_split_title" style="background-color:#F2C80F;"><span>당년 매출실적</span></div>'
				+ '					</div>'
				+ '				</div>'
				+ '			</div>'
				+ '			<div>'
				+ '				<div class="jw_stat_title">'
				+ '					<div style="float:left"><span class="jw_header_title">> 매출실적<span></div>'
				+ '					<div id="stat_dvbtn_3" style="float:right"></div>'
				+ '				</div>'
				+ '				<div id="stat_div_column" class="jw_div_border" style="height:317px;"></div>'				
				+ '			</div>'
				+ '		</div>'
				+ '		<div style="float:right; width:44%">'
				+ '			<div>'
				+ '				<div class="jw_stat_title">'
				+ '					<div style="float:left"><span class="jw_header_title">> 지역별 숙소 분포도<span></div>'
				+ '					<div id="stat_dvbtn_4" style="float:right"></div>'
				+ '				</div>'
				+ '				<div id="stat_Rtop_chart" class="jw_div_border" style="height:355px;"></div>'
				+ '			</div>'
				+ '			<div>'
				+ '				<div class="jw_stat_title">'
				+ '					<div style="float:left"><span class="jw_header_title">> 연간 사용자 가입 추이<span></div>'
				+ '					<div id="stat_dvbtn_5" style="float:right"></div>'
				+ '				</div>'
				+ '				<div id="stat_div_line" class="jw_div_border" style="height:212px;"></div>'
				+ '			</div>'
				+ '		</div>'
				+ '		</div>'
				+ '</div>';
	}
}

/*******************************
 * 숙소 UI
 *******************************/
var accomUI = {
	frame : ()=>{
		return '<div style="width:80%; margin:auto">'
				+ '		<div style="width:100%; display:inline-block;">'
				+ '			<div id="acc_titleH" style="float:left; height:34px; padding-top:5px"></div>'
				+ '			<div id="acc_input_grp" class="input-group custom-search-form" style="float:right; width:40%;"></div>'
				+ '		</div>'
				+ '		<div id="acc_list" style="width:100%; display:inline-block;"></div>'
				+ '		<div id="acc_pagebar"></div>'
				+ '</div>';	
	},
	
	item : x =>{
		return '<div style="float:left; margin-right:5px; height:178px; width:178px">A'
				+ '</div>'
	}
}



/*******************************
 * 게시판 UI
 *******************************/
var boardUI = {
	frame : ()=>{
		return '<div style="width:70%; margin: auto">'
				+ '		<div style="display:inline-block; margin: 0 auto;">'
				+ '			<div id="brd_input_grp" class="input-group custom-search-form" style="float:left; width:50%"></div>'
				+ '			<div id="brd_btn_grp" style="float:right; height:34px; padding-top:15px"></div>'
				+ '		</div>'
				+ '		<div id="brd_list"></div>'
				+ '		<div id="brd_pagebar"></div>'
				+ '</div>';
	},
	
	tbl : ()=>{
		var theadD =[
	            {width: '5%', txt:'No'},
	            {width: '12%', txt:'공지분류1'},
	            {width: '55%', txt:'제목'},
	            {width: '15%', txt:'작성일'},
	            {width: '10%', txt:' '}
            ];
		
		var tbl = '<table id="brd_tbl" class="table table-bordered" style="margin-top:10px">'
	         		+ '<thead><tr class="hanbit-table tr" >';
        
		            $.each(theadD, (i,j)=>{
		               tbl+='<th style="width:'+j.width+'; text-align:center;">'+j.txt+'</th>'
		            });
         
			        tbl += '</tr></thead><tbody id="brd_tbody">';
			        tbl += '</tbody></table>';
         
         return tbl;
	},
	
	pagebar : ()=>{
	return '<div><nav aria-label="Page navigation" style="width:314px; margin:auto;">'
		+ '      <ul id="page_form" class="pagination">'
		+ '     </ul>'
		+ ' </nav></div>'; 
	},
	
	detail : ()=>{
		return '<div style="width:80%; margin:auto">'
				+ '		<div style="width:100%; display:inline-block;">'
				+ '			<div id="brdD_dv_title" style="float:left; width:50%"></div>'
				+ '			<div id="brdD_btn_grp" style="float:right; height:28px; padding-top:5px"></div>'
				+ '		</div>'
				+ '		<div style="width:100%; display:inline-block; margin-top:10px;">'
				+ '			<div id="brdD_gubun" style="float:left; width:105px;"></div>'
				+ '			<div id="brdD_title" style="float:left; width:91.7%;"></div>'
				+ '		</div>'
				+ '		<div id="brd_content" style="width:100%; margin-top:5px; margin-right:5px"><div id="summernote"></div></div>'
				+ '</div>';
	}
}

/*******************************
 * 예약내역 list
 *******************************/
jw.resvBoard = (function(){
	var ctx, js, temp;
	var init = function(){
		ctx=$$('x');
		js=$$('j');
		temp=js+'/template.js';
    };
   
    var list = function(ctx){
       init();
       
       $('#bk_test').html(resvbrdUI.frame());
       $('#resv_list').html(resvbrdUI.tbl());
      
       var sessionId = sessionStorage.getItem('smemberid');
       var _param1 = sessionId.substring(0, sessionId.indexOf('@'));
       var _param2 = sessionId.substring(sessionId.indexOf('@')+1, sessionId.indexOf('.'));
       var _param3 = sessionId.substring(sessionId.indexOf('.')+1, sessionId.length);
     
       var url = ctx+'/jw/rev/rsvList/'+_param1+'/'+_param2+'/'+_param3;  
       $.getJSON(url, d=>{
    	   var tr="";
    	   $.each(d.list, (i,j)=>{
    		   tr += '<tr style="height:25px; text-align:center;">'
    			    + '<td>'+(i+1)+'</td>'
	   				+ '<td><a onclick="hee.rev.init(\''+j.hostSerial+'\')">'+j.residenceName+'</a></td>'
	   				+ '<td>'+j.memberId+'</td>'
	   				+ '<td>'+j.addr+'</td>'
	   				+ '<td>'+j.checkin+' / '+j.checkout+'</td>'
	   				+ '<td>'+j.totalCnt+'명</td>'
	   				+ '<td>'+j.regdate+'</td>'
	   				+ '<td id="tbl_btnarea'+(i+1)+'"></td>'
	   				+ '</tr>'
    	   });
    	   $('#resv_tbody').html(tr);
    	   /*후기작성*/
    	   $.getScript(temp, ()=>{
    		   $.each(d.list, (i,j)=>{
    			   compUI.span('rsv_btn_review_'+i).appendTo($('#tbl_btnarea'+(i+1))).attr('displsy','inline').attr('data-toggle','modal').attr('data-target','#myModal').html('후기작성').addClass('label label-warning').css({'cursor':'pointer'})
    			   .click(e=>{
    				   e.preventDefault();	
    				   $('#formCm').html(compUI.inputBtn('formBtn','submit').val('후기 작성 완료').attr('data-dismiss','modal').addClass('btn btn-danger btn-large btn-block').css({'font-size': '22px', 'font-weight':'bold','outline-style': 'none'})
    					.click(e=>{
    						e.preventDefault();	
    						 sessionStorage.setItem('seq',j.hostSerial);
    		                 
    						 var $review_star = $(':input:radio[name=reviewStar]:checked').val();
                             $.ajax({
                                     url :ctx+'/post/review',
                                     method : 'post',
                                     contentType : 'application/json',
                                     data : JSON.stringify({
                                        'action' : $review_star,
                                        'column' : $('#reviewContent').val(),
                                        'dir' : sessionStorage.getItem('seq'),
                                        'page' :sessionStorage.getItem('smemberid')
                                     }),
                                     success : data=>{
                                        alert("후기 작성 완료");
                                     },
                                     error : (x,s,m)=>{
                                        alert('error'+m);
                                     }
                             });
    					}));
    			   });
    			   
    			   compUI.span('rsv_btn_del_'+i).appendTo($('#tbl_btnarea'+(i+1))).html('삭제').attr('displsy','inline').addClass('label label-danger').css({'margin-left':'3px', 'cursor':'pointer'})
    			   .click(e=>{
    					e.preventDefault();	
    					if(confirm("예약 된 "+j.residenceName+"을\n정말 삭제하시겠습니까?")){
    						$.ajax({
    							url : ctx + '/jw/rsv/delete/rsvDel',
    							method : 'post',
    							dataType : 'json',
    							data : JSON.stringify({
    								'rsvSeq' : j.rsvSeq,
    							}),
    							contentType : 'application/json', 
    							success : d=>{
    								if(d.result === "success"){
    									alert("삭제를 완료하였습니다!!");
    									list(ctx);
    								}else{
    									alert("삭제가 실패하였습니다\n관리자에게 문의하세요");
    								}
    							},
    							error : (x,s,m)=>{
    								alert('에러발생! '+m);
    							}
    						});
    					}else{
    						return false;
    					}
    				});
    			   
        	   });
    	   });
       });
       
   };   
   return { list : list };
})();


/*숙소등록현황 -> 호스트 디테일 보기*/
jw.goDetail={
		temp : function(x){
		  $.getJSON(hee.rev.init(x));
		}
};

/*******************************
 * 호스트 숙소 list
 *******************************/
jw.resiHost = (()=>{
	var ctx, js, temp;
	var init = function(){
		ctx=$$('x');
		js=$$('j');
		temp=js+'/template.js';
    };
	
    var list = ctx=>{
        init();
        
        $('#bk_test').html(hresibrdUI.frame());
        $('#hresi_list').html(hresibrdUI.tbl());
        
        var sessionId = sessionStorage.getItem('smemberid');
        var _param1 = sessionId.substring(0, sessionId.indexOf('@'));
        var _param2 = sessionId.substring(sessionId.indexOf('@')+1, sessionId.indexOf('.'));
        var _param3 = sessionId.substring(sessionId.indexOf('.')+1, sessionId.length);
        
        var url = ctx + '/jw/rev/hresiList/'+_param1+'/'+_param2+'/'+_param3;  
        $.getJSON(url, d=>{
        	var tr="";
        	//jw.goDetail.temp(\''+hostSerial+'\')
        	$.each(d.list, (i,j)=>{
     	   		tr += '<tr style="height:25px; text-align:center;">'
     	   			+ '<td>'+(i+1)+'</td>'
 	   				+ '<td><a onclick="hee.rev.init(\''+j.hostSerial+'\')">'+j.residenceName+'</a></td>'
 	   				+ '<td>'+j.zipcode+")"+j.addr+'</td>'
 	   				+ '<td>'+j.price+'원</td>'
 	   				+ '<td>'+j.limitNo+'명</td>'
 	   				+ '<td id="tbl_btnarea'+(i+1)+'"></td>'
 	   				+ '</tr>'
     	   });
     	   $('#hresi_tbody').html(tr);
     	   
     	   $.getScript(temp, ()=>{
     		  $.each(d.list, (i,j)=>{
     			  compUI.span('hresi_btn_del_'+i).appendTo($('#tbl_btnarea'+(i+1))).html('삭제').attr('displsy','inline').addClass('label label-danger').css({'margin-left':'3px', 'cursor':'pointer'})
     			  .click(e=>{
     				  e.preventDefault();	
     				  if(confirm("등록한 숙소 "+j.residenceName+"을\n정말 삭제하시겠습니까?")){
     					  var _serial = j.hostSerial;
     					  $.ajax({
     						  url : ctx + '/jw/delete/residence',
     						  method : 'post',
     						  dataType : 'json',
     						  data : JSON.stringify({
     							  'boardSeq' : _serial,
     						  }),
     						  contentType : 'application/json', 
     						  success : d=>{
     							  if(d.result === "success"){
     								  alert("삭제를 완료하였습니다!!");
     								  list(ctx);
     							  }else{
     								  alert("삭제가 실패하였습니다\n관리자에게 문의하세요");
     							  }
     						  },
     						  error : (x,s,m)=>{
     							  alert('에러발생! '+m);
     						  }
     					  });
     				  }else{
     					  return false;
     				  }
     			  });
     			  
     			  
     		  });
     	   });

        });        
    };
	
    return { list : list };
})();


/*******************************
 * 예약내역 list UI (board)
 *******************************/
 var resvbrdUI = {
	frame : ()=>{
		return '<div id="jw-content" style="width:80%; margin:auto">'
			+ '		<div style="display:inline-block;">'
	        + '			<span style="font-size: 20px; font-weight:bold;">예약 내역</span>'
	        + '		</div>'	
            + '     <div id="resv_list">'
            + ' 	</div>'
            + '     <div id="resv_pagebar"></div>'
            + '</div>'
            +' <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" >'
            +'				  <div class="modal-dialog">'
            +'				    <div class="modal-content">'
            +'				      <div class="modal-header">'
            +'						<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>'
            +'						<div class="modal-title" id="myModalLabel" style="width: 50%;">'
            +'							<div style="width: 30px; display: inline-block;">'
            +'							<svg viewBox="0 0 1000 1000" role="presentation" aria-hidden="true" focusable="false" style="height:2em;width:2em;display:block;fill:#FF5A5F;" data-reactid="25">'
            +'								<path d="M499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-102 119.1-149.1 141.1-265.1 90-340.2-30-43-73-64-128.1-64-111 0-172.1 94-148.1 203.1 14 59 51 126.1 110 201.1-37 41-72 70-103 88-24 13-47 21-69 23-101 15-180.1-83-144.1-184.1 5-13 15-37 32-74l1-2c55-120.1 122.1-256.1 199.1-407.2l2-5 22-42c17-31 24-45 51-62 13-8 29-12 47-12 36 0 64 21 76 38 6 9 13 21 22 36l21 41 3 6c77 151.1 144.1 287.1 199.1 407.2l1 1 20 46 12 29c9.2 23.1 11.2 46.1 8.2 70.1zm46-90.1c-7-22-19-48-34-79v-1c-71-151.1-137.1-287.1-200.1-409.2l-4-6c-45-92-77-147.1-170.1-147.1-92 0-131.1 64-171.1 147.1l-3 6c-63 122.1-129.1 258.1-200.1 409.2v2l-21 46c-8 19-12 29-13 32-51 140.1 54 263.1 181.1 263.1 1 0 5 0 10-1h14c66-8 134.1-50 203.1-125.1 69 75 137.1 117.1 203.1 125.1h14c5 1 9 1 10 1 127.1.1 232.1-123 181.1-263.1z" data-reactid="26"></path>'
            +'							</svg>'
            +'							</div>'
            +'							<div style="display:inline-block;">'
            +'								<span style="font-size: 20px; font-weight:bold;">숙소 후기</span>'
            +'							</div>'
            +'						</div>'
            +'					</div>'
            +'				    <div class="modal-body" style="margin: 0 auto; width: 80%;">'
            +'				      	'
            +'				      	<div style="width: 100%">'
            +'				      		<span style="font-size: 22px; ">이 숙소의 후기를 남겨주세요!</span>'
            +'				      	</div>'
            +'				      	<div style="width: 100%; margin-top: 6%">'
            +'					      	<div style="width: 100%">'
            +'					      		<span style="font-size: 17px;">숙소의 총 평점을 선택하세요.</span>'
            +'					      	</div>'
            +'					      	<div>'
            +'							    <p><span><input id="reviewStar1" type="radio" name="reviewStar" value="1" />1점</span> '
            +'							    <span style="margin-left:25px; font-size: 17px;"><input id="reviewStar2" type="radio" name="reviewStar" value="2" />2점</span> '
            +'								<span style="margin-left:25px; font-size: 17px;"><input id="reviewStar3" type="radio" name="reviewStar" value="3"  />3점</span>'
            +'								<span style="margin-left:25px; font-size: 17px;"><input id="reviewStar4" type="radio" name="reviewStar" value="4" />4점</span>'
            +'								<span style="margin-left:25px; font-size: 17px;"><input id="reviewStar5" type="radio" name="reviewStar" value="5" />5점</span></p>'
            +'							</div>'
            +'						</div>'
            +'						<div style="width: 100%; margin-top: 6%; margin-bottom: 6%">'
            +'							<div style="width: 100%">'
            +'					      		<span style="font-size: 17px;">구체적인 후기 내용을 남겨주세요.</span>'
            +'					      	</div>'
            +'							<div>'
            +'								<textarea id="reviewContent" name="detail_cont" cols="57" rows="7"></textarea>'
            +'							</div>'
            +'					    </div>	'
            +'				    </div>'
            +'				    <div id="formCm" class="modal-footer">'
            +'				    </div>'
            +'				  </div>'
            +'				</div>'
            +'			</div>';
	},
   
	tbl : ()=>{
		var theadD =[
			{width: '3%', txt:'No'},
            {width: '25%', txt:'숙소이름'},
            {width: '10%', txt:'호스트명'},
            {width: '20%', txt:'주소'},
            {width: '16%', txt:'체크인/체크아웃'},
            {width: '7%', txt:'예약인원'},
            {width: '8%', txt:'예약일'},
            {width: '10%', txt:' '}
        ];
      
		var tbl = '<table id="resv_tbl" class="table table-bordered" style="width:100%; margin-top:10px">'
				+ '<thead><tr class="hanbit-table tr" >';
		
				$.each(theadD, (i,j)=>{
					tbl+='<th style="width:'+j.width+'; text-align:center;">'+j.txt+'</th>'
				});
         
                tbl += '</tr></thead><tbody id="resv_tbody">';
                tbl += '</tbody></table>';
         
        return tbl;
	}
}

/*******************************
 * 호스트 숙소 list UI (board)
 *******************************/
 var hresibrdUI = {
 	frame : ()=>{
 		return '<div id="jw-content" style="width:80%; margin:auto">'
 			 + '	 <div style="display:inline-block;">'
 	         + '		<span style="font-size: 20px; font-weight:bold;">숙소 등록 내역</span>'
 	         + '	 </div>'	
             + '     <div id="hresi_list">'
             + ' 	 </div>'
             + '     <div id="hresi_pagebar"></div>'
             + '</div>';
 	},
    
 	tbl : ()=>{
 		var theadD =[
 			{width: '4%', txt:'No'},
            {width: '30%', txt:'숙소이름'},
            {width: '30%', txt:'주소'},
            {width: '7%', txt:'가격/1박'},
            {width: '7%', txt:'총인원'},
            {width: '7%', txt:' '}
        ];
       
 		var tbl = '<table id="hresi_tbl" class="table table-bordered" style="width:100%; margin-top:10px">'
 				+ '<thead><tr class="hanbit-table tr" >';
 		
 				$.each(theadD, (i,j)=>{
 					tbl+='<th style="width:'+j.width+'; text-align:center;">'+j.txt+'</th>'
 				});
          
                tbl += '</tr></thead><tbody id="hresi_tbody">';
                tbl += '</tbody></table>';
          
        return tbl;
 	}
 }
 