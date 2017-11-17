var chobongki=chobongki || {};
chobongki.common=(()=>{
   var init = (ctx)=>{
	   chobongki.session.init(ctx);
	   chobongki.index.init();
   };
   return {init:init}
})();


chobongki.index=(()=>{  
	var $wrapper,$navbar,$container,ctx,img,js,css,temp;
	var init=function(){
		js=sessionStorage.getItem('j');
        ctx=sessionStorage.getItem('x');        
        onCreate();
    };
    var onCreate=function(){                    
          $('#email').html(compUI.input('useremail','text').addClass('cho_input').css({'background-color':'white'}).attr('placeholder','이메일 주소'));
          $('#pass').html(compUI.input('userpass','password').addClass('cho_input').css({'background-color':'white'}).attr('placeholder','비밀번호'));
          $('#facebookDi').html(compUI.btn('facebookBtn').addClass('cho_button').css({'background-color':'#3B5998'}).text('페이스북 계정으로 로그인'));
          $('#joinDiv').html(compUI.btn('join').addClass('cho_button').attr({'data-toggle':'modal', 'data-target':"#myModal222"}).css({'background-color':'#ffb380'}).text('회원가입'));
          $('#loginDiv').html(compUI.btn('login').addClass('cho_button').css({'background-color':'#ff5a5f'}).text('로그인'));  
          $('#joinaddBtn1').html(compUI.input('addemail','text').addClass('cho_input').css({'background-color':'white'}).attr('placeholder','이메일 주소'));
          $('#joinaddBtn2').html(compUI.input('addfirstname','text').addClass('cho_input').css({'background-color':'white'}).attr('placeholder','이름'));
          $('#joinaddBtn3').html(compUI.input('addlastname','text').addClass('cho_input').css({'background-color':'white'}).attr('placeholder','성'));
          $('#joinaddBtn4').html(compUI.input('addpass','text').addClass('cho_input').css({'background-color':'white'}).attr('placeholder','비밀번호'));
          $('#addlogin').html(compUI.btn('addloginafter').addClass('cho_button').css({'background-color':'#ff5a5f'}).text('로그인'));
          $('#addjoin').html(compUI.btn('addjoin').addClass('cho_button').css({'background-color':'#ffb380'}).text('회원가입'));
          $('#joinaddBtn0').html(compUI.btn('search').css({'background-color':'white'}).text('이메일중복조회'));
          $('#homeBtn111').click(()=>{
             app.common.init(ctx);
          });
          $('#search').click(()=>{
        	  var $addemail=$('#addemail').val();
              $.ajax({
            	  url :ctx+'/get/search',
                  method : 'post',
                  data  : JSON.stringify({
                	  'memberId' : $addemail
                  }),
                  contentType : 'application/json',
                  success : d=>{
                	  if(d.msg=='success'){
                		  alert('가입가능한 이메일입니다');
                	  }else{
                		  alert('중복된 이메일입니다');
                		  $('#useremail').val("");
                	  }                                                      
                  },
	              error : (x,s,m)=>{
	              }
              });  
          });   
            
          $('#addjoin').attr({'data-toggle':'modal', 'data-target':"#myModal111"}).click(()=>{
        	  var $addemail=$('#addemail').val();
              var $addfirstname=$('#addfirstname').val();
              var $addlastname=$('#addlastname').val();
              var $addpass=$('#addpass').val();
              var $addyear=$('#addyear').val();
              var $addmonth=$('#addmonth').val();
              var $addday=$('#addday').val();
              var $name=$('#addlastname').val()+$('#addfirstname').val();
              var $birthdate=$('#addyear').val()+'-'+$('#addmonth').val()+'-'+$('#addday').val();
              var arr=[$addemail,$name,$birthdate,$addpass];
         
              if($addemail==""){
            	  alert('메일주소 값이 빠졌습니다 ');
            	  e.preventDefault();
              }else{
            	  if($addfirstname==""){
            		  alert('이름 값이 빠졌습니다 ');
            		  e.preventDefault(); 
            	  }else{
            		  if($addlastname==""){
            			  alert('이름 입력 값이 빠졌습니다 ');
                          e.preventDefault(); 
                      }else{
                    	  if($addpass==""){
                    		  alert('비밀번호 입력 값이 빠졌습니다 ');
                              e.preventDefault(); 
                    	  }else{
                    		  $.ajax({
                    			  url :ctx+'/get/insert',
                                  method : 'post',
                                  data  : JSON.stringify({
                                	  'memberId' : $addemail,
                                	  'name' : $name,
                                	  'memberPassword' : $addpass,
                                	  'birthdate' : $birthdate,
                                  }),
                                  contentType : 'application/json',
                                  success : d=>{
                                	  alert('가입성공 !!');
                                      app.common.init(ctx);
                                  },
                                  error : (x,s,m)=>{
                                	  app.common.init(ctx);
                                  }
                    		  });
                                
                    	  }
                      }
                  }
              }                         
          });
          $('#joinDiv').click(()=>{
        	  $('body').html(cho.join());
        	  chobongki.common.init(ctx);  
          });
          $('#facebookDiv').click(()=>{
             alert('구현되지 않은 기능입니다.');
          });
          $('#loginDiv').click(e=>{
        	  e.preventDefault();
        	  
        	  var _$email=$('#useremail').val();
        	  var _$pass=$('#userpass').val();
        	  
        	  if(checkValid.email_check(_$email) && _$pass!=""){
        		  $.ajax({
        			  url :ctx+'/get/login', 
        			  method : 'POST',               
        			  data  : JSON.stringify({
        				  'memberId' : _$email,
        				  'memberPassword' : _$pass
        			  }),
        			  contentType : 'application/json',
        			  success : d=>{
        				  if(d.msg=='success'){                                
        					  if(d.list.memberRole=='admin'){
        						  alert('안녕하세요. 관리자님!');
        						  jw.common.init(ctx);
        					  }else{
	                              sessionStorage.setItem('sname',d.list.name);
	                              sessionStorage.setItem('smemberid',d.list.memberId);
	                              sessionStorage.setItem('sregdate',d.list.regdate);
	                              sessionStorage.setItem('sbirthdate',d.list.birthdate);
	                              sessionStorage.setItem('spassword',d.list.memberPassword);
	                              app.common.init(ctx);                                                                                               
	                          }        
        				  }else{
        					  alert('아이디 비밀번호가 일치하지않습니다.');
        				  }
        			  },
        			  error : (x,s,m)=>{
        				  alert('에러발생! '+m);
		              }
        		  });
        	  }else if(checkValid.email_check(_$email) && _$pass===""){
        		  alert('비밀번호를 입력하세요');
        	  }else{
        		  if(_$email===""){
            		  alert('이메일을 입력하세요');
            	  }else{
            		  alert('올바른 이메일 형식이 아닙니다.\n다시 확인해 주세요');
            	  }
        	  }
         });
    }; 

    return {init:init };
})();

/*******************************
 * 로그인 vaildation check
 *******************************/
var checkValid = {
	email_check : x=>{
		var regExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
		var flag = false;
		
		if(x==="admin"){
			flag = true;
		}else if(x.match(regExp) != null) {
			flag = true;
		}else{
			flag = false;
		}
		return flag;
	}
}

chobongki.profile=(e=>{
   var init=function(ctx){
	   ctx=$$('x');
       $('<div/>',{'id':'bkcontainer'}).appendTo('#content');
       $('#bkcontainer').html(cho.profile());
       $('#lastname').val(sessionStorage.getItem('sname').substring(1));
       $('#firstname').val(sessionStorage.getItem('sname').substring(0,1));
       $('#email').val(sessionStorage.getItem('smemberid'));
       $('#year option[value='+sessionStorage.getItem('sbirthdate').substring(0,4)+']').attr('selected', true);
       $('#month option[value='+sessionStorage.getItem('sbirthdate').substring(5,7)+']').attr('selected', true);
       $('#day option[value='+sessionStorage.getItem('sbirthdate').substring(8,10)+']').attr('selected', true);
       $('#deleteBtn').after(compUI.btn('delete').addClass('cho_button1').text('탈퇴'));
       
       $('#delete').click(()=>{
    	   alert('탈퇴');
    	   var $password = prompt('비밀번호를 입력');
    	   if($password==sessionStorage.getItem('spassword')){
    		   alert('비밀번호가 일치합니다');
    		   $.ajax({
    			   url :ctx+'/get/delete', 
    			   method : 'POST',               
    			   data  : JSON.stringify({
    				   'memberId' :sessionStorage.getItem('smemberid')
    			   }),
    			   contentType : 'application/json',
    			   success : d=>{
    				   if(d.msg=='success'){
    					   alert('삭제 실패 !!');
    					   app.common.init(ctx);                                                                                               
                       }else{
                           alert('삭제 되었습니다!!');
                           sessionStorage.clear();
                           app.common.init(ctx);
                       }            
	               },
	               error : (x,s,m)=>{
	               }
    		   });  
 
    	   }else{
    		   alert('비밀번호가 다릅니다'); 
    	   };
       });
       
       $('#menu5').click(()=>{
    	   $('<div/>',{'id':'bkcontainer'}).appendTo('#content');
           chobongki.profile.init();
       });
      
       $('#hkgogo').click(()=>{
           //$('#navbar').html(app.navbar.init()).css({'padding-top': '6px','margin-bottom':' 5%'});
           $('#airbnbText').remove();
           $('#bk_test').empty();
           $('#bk_test').html(jw.resiHost.list(ctx));
           $('#footer').html(main.footer()).css({'margin-top': '10%'});
       });
       
       $('#btnrev').click(()=>{
           //$('#navbar').html(app.navbar.init()).css({'padding-top': '6px','margin-bottom':' 5%'});
           $('#airbnbText').remove();
           $('#bk_test').empty();
           $('#bk_test').html(jw.resvBoard.list(ctx));
           $('#footer').html(main.footer()).css({'margin-top': '10%'});
       });
         
       $('#btnprofile').click(()=>{
    	   //$('#navbar').html(app.navbar.init()).css({'padding-top':'10px','margin-bottom':'5%'});
           $('#airbnbText').remove();
           $('#bk_test').empty();
           $('#footer').html(main.footer()).css({'margin-top': '55%'});
           $('#bk_test').html(cho.profile2());
           //프로필2입력
           $('#profileName').val(sessionStorage.getItem('sname'));
           $('#regdate').val(sessionStorage.getItem('sregdate'));
           $('#cho_img').html('사진');
           ///사진
       });
       
       $('#update').click(()=>{
    	   ///수정하기
    	   var $lastname=$('#lastname').val();
           var $firstname=$('#firstname').val();
           var $memberid=sessionStorage.getItem('smemberid');
            
           $.ajax({
        	   url :ctx+'/get/update', 
               method : 'POST',               
               data  : JSON.stringify({
            	   'memberId' :$memberid,
                   'name'  :$lastname,
                   'birthdate' : $firstname
               }), 
               contentType : 'application/json',
               success : d=>{
            	   var $name=$firstname+$lastname;                  
            	   sessionStorage.setItem('sname',$name);
            	   alert('업데이트가 완료되었습니다.');
            	   chobongki.profile.init(ctx);             
               },
               error : (x,s,m)=>{
            	   alert('통신에러'+m);
               }
           });
             
	       chobongki.profile.init();
       });
   };
   
   return { init:init };
})();


// -----------템플릿---------------//
var cho={
		join :()=>{
			return '<div style="margin-left: 40%; margin-top: 1%;"><img style="margin-left: -63%;margin-top: -87%;" src="resources/img/fff.JPG"><div style="width: 30%; display: inline-block;">'
              +'         <div id="homeBtn111">   <svg viewBox="0 0 1000 1000" role="presentation" aria-hidden="true" focusable="false" style="height:2em;width:2em;display:block;fill:#FF5A5F;" data-reactid="25">'
              +'               <path d="M499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-102 119.1-149.1 141.1-265.1 90-340.2-30-43-73-64-128.1-64-111 0-172.1 94-148.1 203.1 14 59 51 126.1 110 201.1-37 41-72 70-103 88-24 13-47 21-69 23-101 15-180.1-83-144.1-184.1 5-13 15-37 32-74l1-2c55-120.1 122.1-256.1 199.1-407.2l2-5 22-42c17-31 24-45 51-62 13-8 29-12 47-12 36 0 64 21 76 38 6 9 13 21 22 36l21 41 3 6c77 151.1 144.1 287.1 199.1 407.2l1 1 20 46 12 29c9.2 23.1 11.2 46.1 8.2 70.1zm46-90.1c-7-22-19-48-34-79v-1c-71-151.1-137.1-287.1-200.1-409.2l-4-6c-45-92-77-147.1-170.1-147.1-92 0-131.1 64-171.1 147.1l-3 6c-63 122.1-129.1 258.1-200.1 409.2v2l-21 46c-8 19-12 29-13 32-51 140.1 54 263.1 181.1 263.1 1 0 5 0 10-1h14c66-8 134.1-50 203.1-125.1 69 75 137.1 117.1 203.1 125.1h14c5 1 9 1 10 1 127.1.1 232.1-123 181.1-263.1z" data-reactid="26"></path>'
              +'            </svg></div>'
              +'<br/>'
	          +' <div style="margin-left: 40%" id="logincenter"> '
	          +' <div  class="cho_form" action="" method="post"> '
	          +'   <div id="container_cho"> '
	          +'<div style="text-align:center">'
	          +'<label style="margin: 0 auto;">페이스북 또는 구글로 회원 가입하세요. </label> '
	          +'</div>'
	          +'<hr/>'
	          +'<div id="joinaddBtn0">' // 회원가입
	          +'</div>'
	          +'<div id="joinaddBtn1">' // 회원가입
	          +'</div>'
	          +'<div id="joinaddBtn2">' // 회원가입
	          +'</div>'
	          +'<div id="joinaddBtn3">' // 회원가입
	          +'</div>'
	          +'<div id="joinaddBtn4">' // 회원가입
	          +'</div>'
	          +'<br/>'
	          +'<label style="margin: 0 auto;">생년월일</label> '
	          +'<abbr title="회원 가입을 하시려면 만 18세 이상이어야합니다.생일은 다른 회원에게는 공개되지 않습니다">?</abbr>'
	          +'<br/>'
	          +'<br/>'
	          +'<div style="" >'
	          +'<select class="cho_select" id="addmonth" >'
	          +'<option value="01">1월</option>'
	          +'<option value="02">2월</option>'
	          +'<option value="03">3월</option>'
	          +'<option value="04">4월</option>'
	          +'<option value="05">5월</option>'
	          +'<option value="06">6월</option>'
	          +'<option value="07">7월</option>'
	          +'<option value="08">8월</option>'
	          +'<option value="09">9월</option>'
	          +'<option value="10">10월</option>'
	          +'<option value="11">11월</option>'
	          +'<option value="12">12월</option>'
	          +'  </select> &nbsp&nbsp'
	          +'<select class="cho_select" id="addday" >'
	          +'<option value="01">1일</option>'
	          +'<option value="02">2일</option>'
	          +'<option value="03">3일</option>'
	          +'<option value="04">4일</option>'
	          +'<option value="05">5일</option>'
	          +'<option value="06">6일</option>'
	          +'<option value="07">7일</option>'
	          +'<option value="08">8일</option>'
	          +'<option value="09">9일</option>'
	          +'<option value="10">10일</option>'
	          +'<option value="11">11일</option> '
	          +'<option value="12">12일</option> '
	          +'<option value="13">13일</option> '
	          +'<option value="14">14일</option> '
	          +'<option value="15">15일</option> '
	          +'<option value="16">16일</option> '
	          +'<option value="17">17일</option> '
	          +'<option value="18">18일</option> '
	          +'<option value="19">19일</option> '
	          +'<option value="20">20일</option> '
	          +'<option value="21">21일</option> '
	          +'<option value="22">22일</option> '
	          +'<option value="23">23일</option> '
	          +'<option value="24">24일</option> '
	          +'<option value="25">25일</option> '
	          +'<option value="26">26일</option> '
	          +'<option value="27">27일</option> '
	          +'<option value="28">28일</option> '
	          +'<option value="29">29일</option> '
	          +'<option value="30">30일</option> '
	          +'<option value="31">31일</option> '
	          +'  </select >&nbsp&nbsp&nbsp&nbsp'
	          +'<select class="cho_select" id="addyear">'
	          +'<option value="1970">1970년</option>'
	          +'<option value="1971">1970년</option>'
	          +'<option value="1972">1972년</option>'
	          +'<option value="1973">1973년</option>'
	          +'<option value="1974">1974년</option>'
	          +'<option value="1975">1975년</option>'
	          +'<option value="1976">1976년</option>'
	          +'<option value="1977">1977년</option>'
	          +'<option value="1978">1978년</option>'
	          +'<option value="1979">1979년</option>'
	          +'<option value="1980">1980년</option> '
	          +'<option value="1981">1981년</option> '
	          +'<option value="1982">1982년</option> '
	          +'<option value="1983">1983년</option> '
	          +'<option value="1984">1984년</option> '
	          +'<option value="1985">1985년</option> '
	          +'<option value="1986">1986년</option> '
	          +'<option value="1987">1987년</option> '
	          +'<option value="1988">1988년</option> '
	          +'<option value="1989">1989년</option> '
	          +'<option value="1990">1990년</option> '
	          +'<option value="1991">1991년</option> '
	          +'<option value="1992">1992년</option> '
	          +'<option value="1993">1993년</option> '
	          +'<option value="1994">1994년</option> '
	          +'<option value="1995">1995년</option> '
	          +'<option value="1996">1996년</option> '
	          +'<option value="1997">1997년</option> '
	          +'<option value="1998">1998년</option> '
	          +'<option value="1999">1999년</option> '
	          +'<option value="2000">2000년</option> '
	          +'<option value="2001">2001년</option> '
	          +'  </select>'
	          +'</div>'
	          +'<br/>'
	          +' <input type="checkbox" name="" value="" > 에이비앤비와 에어비앤비 파트너의 마케팅 및 정책 관련 소식을 수신하고 싶습니다.'
	          +'<br/>'
	          +'<br/>'
	          +'<p style="color:gray; "><h5>회원 가입 또는 계속하기를 클릭하면 에어비앤비의 서비스 약관,결제 서비스약관,개인정보 보호정책,차별 금지 정책에 동의하는것입니다.</h5></p> '
	          +'<div id="addjoin">'
	          +'</div>'
	          +'<hr/>'
	          +'</div> '
	           +' </div> '
	          +' </div></div></div>';
         
               },
      profile :()=>{return '<div id="cho555"><div  style= "height: 100%;padding-bottom: 0%;><div style="margin-top: 4%"><ul class="cho_ul">'
               +'<li class="cho_li"><div class="cho_menu" id="menu1">알림판</div></li>'
               +'<li class="cho_li"><div class="cho_menu" id="menu2">메세지</div></li>'
               +'<li class="cho_li"><div class="cho_menu" id="btnrev">예약 목록</div></li>'
               +'<li class="cho_li"><div class="cho_menu" id="btnprofile">프로필 보기</div></li>'
               +'<li class="cho_li"><div class="cho_menu" id="menu5">프로필 수정</div></li>'
               +'<li class="cho_li"><div class="cho_menu" id="hkgogo">숙소등록현황</div></li>'
               +'<li class="cho_li"><div class="cho_menu" id="menu7">여행크레딧</div></li>'
            +'</ul></div>'
          
        
         +'<div id="bk_test">'
         +'<div class="row22">'
            +'<div class="row33" >'
            +'이름 (예:길동)&nbsp&nbsp&nbsp&nbsp<input class="cho_input_text" id="lastname" type="text" placeholder="이름"/><br/><br/>'
            +'성 (예:홍)&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input class="cho_input_text" id="firstname" type="text" placeholder="성"/><br />'
            +'<div class="cho_textbox">공개 프로필에는 성을 제외한 이름만 표시됩니다. 예약 요청 시 때 호스트는 회원님의 성과 이름을 모두 확인할 수 있습니다.</div>'
            +'이메일&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input class="cho_input_text" id="email" type="text" placeholder="cho1036216@gmail.com"/><br />'
            +'<div class="cho_textbox">이메일 주소는 다른 에어비앤비 회원에게 공개되지 않습니다.</div>'
            +'거주지주소&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input  class="cho_input_text" id="addres" type="text" placeholder="서울시 양천구 ....(자세히입력하세요)"/><br />'
            +'</div>'
               +'<div style="margin-left: 10.6%">'
                     +'생년월일&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<select class="cho_select" id="month" >'
                     +'<option value="01">1월</option>'
                     +'<option value="02">2월</option>'
                     +'<option value="03">3월</option>'
                     +'<option value="04">4월</option>'
                     +'<option value="05">5월</option>'
                     +'<option value="06">6월</option>'
                     +'<option value="07">7월</option>'
                     +'<option value="08">8월</option>'
                     +'<option value="09">9월</option>'
                     +'<option value="10">10월</option>'
                     +'<option value="11">11월</option>'
                     +'<option value="12">12월</option>'
                       +'</select>'
                     +'<select  class="cho_select" id="day" >'
                     +'<option value="1">1일</option>'
                     +'<option value="2">2일</option>'
                     +'<option value="3">3일</option>'
                     +'<option value="4">4일</option>'
                     +'<option value="5">5일</option>'
                     +'<option value="6">6일</option>'
                     +'<option value="7">7일</option>'
                     +'<option value="8">8일</option>'
                     +'<option value="9">9일</option>'
                     +'<option value="10">10일</option>'
                     +'<option value="11">11일</option> '
                     +'<option value="12">12일</option> '
                     +'<option value="13">13일</option> '
                     +'<option value="14">14일</option> '
                     +'<option value="15">15일</option> '
                     +'<option value="16">16일</option> '
                     +'<option value="17">17일</option> '
                     +'<option value="18">18일</option> '
                     +'<option value="19">19일</option> '
                     +'<option value="20">20일</option> '
                     +'<option value="21">21일</option> '
                     +'<option value="22">22일</option> '
                     +'<option value="23">23일</option> '
                     +'<option value="24">24일</option> '
                     +'<option value="25">25일</option> '
                     +'<option value="26">26일</option> '
                     +'<option value="27">27일</option> '
                     +'<option value="28">28일</option> '
                     +'<option value="29">29일</option> '
                     +'<option value="30">30일</option> '
                     +'<option value="31">31일</option> '
                     +'&nbsp;&nbsp;&nbsp'
                     +'</select>'
                     +'<select  class="cho_select" id="year" >'
                     +'<option value="1970">1970년</option>'
                     +'<option value="1971">1971년</option>'
                     +'<option value="1972">1972년</option>'
                     +'<option value="1973">1973년</option>'
                     +'<option value="1974">1974년</option>'
                     +'<option value="1975">1975년</option>'
                     +'<option value="1976">1976년</option>'
                     +'<option value="1977">1977년</option>'
                     +'<option value="1978">1978년</option>'
                     +'<option value="1979">1979년</option>'
                     +'<option value="1980">1980년</option> '
                     +'<option value="1981">1981년</option> '
                     +'<option value="1982">1982년</option> '
                     +'<option value="1983">1983년</option> '
                     +'<option value="1984">1984년</option> '
                     +'<option value="1985">1985년</option> '
                     +'<option value="1986">1986년</option> '
                     +'<option value="1987">1987년</option> '
                     +'<option value="1988">1988년</option> '
                     +'<option value="1989">1989년</option> '
                     +'<option value="1990">1990년</option> '
                     +'<option value="1991">1991년</option> '
                     +'<option value="1992">1992년</option> '
                     +'<option value="1993">1993년</option> '
                     +'<option value="1994">1994년</option> '
                     +'<option value="1995">1995년</option> '
                     +'<option value="1996">1996년</option> '
                     +'<option value="1997">1997년</option> '
                     +'<option value="1998">1998년</option> '
                     +'<option value="1999">1999년</option> '
                     +'<option value="2000">2000년</option> '
                     +'<option value="2001">2001년</option> '
                       +'</select>'
                     +'<div class="cho_textbox">이 정보는 통계 목적으로 사용되며 다른 회원들에게 절대 공개되지 않습니다.</div>  '
                     +'전화번호&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input class="cho_input_text" id="phone" type="text" placeholder="010-1234-5678"/>'
                     +'<div class="cho_textbox">예약이 완료될 경우에만 공유됩니다. 번호가 공유되면 개인적으로 연락할 수 있습니다</div><br />'
                     +'자기소개 &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'
                     +'<textarea class="" id="myprofile"></textarea><br /><br />'
                     +'<div class="aaa">'
                     +'<span id="update"><input style="text-align: center; background-color:#ffb380 ; color:white" class="cho_btn2" type="button" value="수정하기" /></span>'
                     +'<span id="delete"><input style="text-align: center; background-color:#ff5a5f ; color:white" class="cho_btn2" type="button" value="탈퇴" /></span></div><br><br><br>'
                     +'</div>'
         +'</div></div></div></div></div>'

                     
                  },
      
      profile2:()=>{ 
         return '<div id="cho555" style= "height: 100%;padding-bottom: 0%;><div style="margin-top: 4%">'
         /*<ul class="cho_ul">'
         +'<li class="cho_li"><div class="cho_menu" id="menu1">알림판</div></li>'
         +'<li class="cho_li"><div class="cho_menu" id="menu2">메세지</div></li>'
         +'<li class="cho_li"><div class="cho_menu" id="btnrev">예약 목록</div></li>'
         +'<li class="cho_li"><div class="cho_menu" id="btnprofile">프로필 보기</div></li>'
         +'<li class="cho_li"><div class="cho_menu" id="menu5">프로필 수정</div></li>'
         +'<li class="cho_li"><div class="cho_menu" id="hkgogo">숙소등록현황</div></li>'
         +'<li class="cho_li"><div class="cho_menu" id="menu7">여행크레딧</div></li>'
      +'</ul>'*/
            +'<div class="profile2">'
            +'<div id="#cho_img">'
            +'<img src="resources/img/profile.jpg" alt="" />'
            +'</div>'
            +'제출'
            +'${number}'
            +'<a href="resources/upload/${filename}">${filename}</a><br/>'
            +' <span style="margin-left: 7%; margin-top:2% ; font-size: xx-large; font-weight:bold;" >안녕하세요  '+sessionStorage.getItem('sname')+' 입니다</span>'
           +' <div style="margin-left: 12%; margin-top: 2%; font-size: large ;font-weight: bold;">가입날짜  '+sessionStorage.getItem('sregdate')+'</div>'
          +'</div> '
                
            
            +'</div>'
      }, profileNav:()=>{ 
          return '<div id="cho555" style= "height: 100%;padding-bottom: 0%;><div style="margin-top: 4%"><ul class="cho_ul">'
          +'<li class="cho_li"><div class="cho_menu" id="menu1">알림판</div></li>'
          +'<li class="cho_li"><div class="cho_menu" id="menu2">메세지</div></li>'
          +'<li class="cho_li"><div class="cho_menu" id="btnrev">예약 목록</div></li>'
          +'<li class="cho_li"><div class="cho_menu" id="btnprofile">프로필 보기</div></li>'
          +'<li class="cho_li"><div class="cho_menu" id="menu5">프로필 수정</div></li>'
          +'<li class="cho_li"><div class="cho_menu" id="hkgogo">숙소등록현황</div></li>'
          +'<li class="cho_li"><div class="cho_menu" id="menu7">여행크레딧</div></li>'
          +'</ul>'
          +'</div>'
       }
}
// -----------컴프---------------//

var compUI={
      btn : (x,y)=>{return $('<button/>',{id : x, type : y});},
      br : x=>{return $('<br/>')},
      div : x=>{return $('<div/>',{id:x});},  // 돔방식 리턴 받을때 append, after..
      div11 : ()=>{return '';},   // 스트링방식 리턴 받을때 html.
      image : (x,y)=>{return $('<img/>',{id : x, src : y});},
      input : (x,y)=>{return $('<input/>',{id : x, type : y});},
      h1 : x=>{return $('<h1/>',{id:x});},
      h2 : x=>{return $('<h2/>',{id:x});},
      h3 : x=>{return $('<h3/>',{id:x});},
      span : x=>{return $('<span/>',{id:x});},
      iTxt : x=>{return $('<input/>',{id:x ,type :'text'});},
      aBtn : x=>{return $('<a/>',{href:'#' , role :'button' , id:x });},
      }
// -----------세션---------------//

chobongki.session=
{
   init : (x)=>{
         sessionStorage.setItem('x',x);
         sessionStorage.setItem('j',x+'/resources/js');
         sessionStorage.setItem('c',x+'/resources/css');
         sessionStorage.setItem('i',x+'/resources/img');
      
           },
   getPath : (x)=>{
         return sessionStorage.getItem(x);
           }
};
var $$= function(x){return chobongki.session.getPath(x);};


////=====페이스북 api====///
/*(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/ko_KR/sdk.js#xfbml=1&version=v2.10&appId=1697133987026933";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function() {
    FB.init({
      appId      : '1726756034297526',
      xfbml      : true,
      version    : 'v2.10'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
   
  FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
  });
  function checkLoginState () { 
       FB . getLoginStatus ( function ( response ) { 
         statusChangeCallback ( response ); }); 
  }
  FB.login(function(response) {
          if (response.status === 'connected') {
            // Logged into your app and Facebook.
          } else {
            // The person is not logged into this app or we are unable to tell. 
          }
        });*/