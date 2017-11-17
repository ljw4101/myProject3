/*hayun  병하기전*/
var app =app ||{};
app.common=(function(){
	var init=x=>{		
		app.session.init(x);		
		app.main.init();
	};
	return{init:init};
})();

app.loginRequire=(function(){
	var init =function(){};
	return {init:init};
	
})();

app.main=(()=>{
	var $navbar, $navbar2, $content, img, js,temp,footer, ctx;
	var init=()=>{		
		ctx = $$('x');
		img = $$('i');
		js = $$('j');
		$navbar=$('#navbar');
		temp=js + '/template.js';
		bongki = js + '/bongki.js';
		onCreate();
	};
	

	var onCreate=()=>{
		$.getScript(temp,()=>{
			 $('body').css({'padding-right':'0'});
	         $('body').html(compUI.div('container'));
	         $('#container').append(compUI.div('navbar')).css('mim-width','800px');
	         
	         if(sessionStorage.getItem('smemberid')==null){
	         $('#navbar').append(main.navbar2());
	         }else{
	         $('#navbar').append(main.navbar());
	         };
	         $('#navbar').append(main.navbarTxt());
			
			$('#mainLogobox').after('<nav/>',{'id':'mainNabMenu'});
			/* 프로필가기mainProfile */
			 $('#mainProfile').click(e=>{
					$('#navbar').css({'padding-top':'10px','margin-bottom':'5%'});
					$('#airbnbText').remove();
			    	$('#content').empty();
			    	$('#footer').html(main.footer()).css({'margin-top': '55%'});
					   chobongki.profile.init();
			    });
			
			 $('#mainOut').click(e=>{
	                $('#content').empty();
	                sessionStorage.clear();
	                app.common.init(ctx);
	             });
			 
		    $('#mainHelp').click(e=>{
		    	alert('도움말 : 구현되지 않은 기능입니다.');
			  
		    });
	
		    $('#mainLogin').attr({'data-toggle':'modal', 'data-target':"#myModal111"}).click(e=>{		    	
		    	 chobongki.common.init(ctx);
		    });
		    
		    $('#mainJoin').click(e=>{
	              $('body').html(cho.join());
	              chobongki.index.init(ctx); 
	          });
		    
		    $('#mainHost').click(e=>{
	             $('#navbar').css({'padding-top':'10px','margin-bottom':'5%'});
	             $('#airbnbText').remove();
	             $('#content').empty().css({'padding-bottom':'0'});
	             hee.common.init(ctx);
	             hee.register.init();
	          });
		    
		    $('#mainAdmin').click(e=>{
		    	$('body').empty();
		    	$('#content').remove();
		    	jw.common.init(ctx);
		    });
		    
		    $('#mainSearch').click(e=>{
		    	$('#mainSearch').tooltip();
		    	var _searchCity =$('#searchCity').val();
		    	if(_searchCity == null){
		    		$('#airbnbText').remove();
			    	$('#content').empty();
			    	$('#content').css({'padding-bottom':'0'});
			    	hee.common.init(ctx);
			    	hee.allRegList.init(_searchCity);
		    	}else{
		    		sessionStorage.setItem('searchCity',_searchCity);
		    		$('#airbnbText').remove();
				    $('#content').empty();
				    $('#content').css({'padding-bottom':'0'});
				    hee.common.init(ctx);
				    hee.allRegList.init(_searchCity);
		    	}
			 
		    });
		  
		    $('#navbar').after(compUI.div('content'));
		    
		    $('#content').addClass('hy-content').css({'height':'100%','width':'100%'});
		    $('#content').append(mainPG.lookup());
		    $('#content').append(mainPG.hostels());		    
		    $('#content').append(mainPG.top3());
		    $('#roomsSeeAll').append(compUI.btn('roomsSeeAllBtn','button'));
		    
		    $('#lookupHostel').click(e=>{
		    	sessionStorage .removeItem('data');
		    	$('#airbnbText').remove();
			    $('#content').empty();
			    $('#content').css({'padding-bottom':'0'});
			    hee.common.init(ctx);
			    hee.allRegList.init('');
		    });
		    		    
		    $('#roomsSeeAllBtn').css({'background-color':'transparent','border-color':'transparent'}).text('전체보기 >').click(e=>{
		    	$('#airbnbText').remove();
			    $('#content').empty();
			    $('#content').css({'padding-bottom':'0'});
			    hee.common.init(ctx);
			    hee.allRegList.init('');
		    });
		    
		    
		    /* 인기 여행지 */
		   var roomarr=[
			   	{a:'파리',d:'https://a0.muscache.com/4ea/air/r:w284-h426-sfit,e:fjpg-c75/pictures/d915ce17-d822-426d-b549-0c7b641fec56.jpg'},
		    	{a:'마이애미',d:'https://a0.muscache.com/4ea/air/r:w284-h426-sfit,e:fjpg-c75/pictures/04598d26-f40d-4c44-8725-99e157fbb7ab.jpg'},
		    	{a:'도쿄',d:'https://a0.muscache.com/4ea/air/r:w284-h426-sfit,e:fjpg-c75/pictures/1d8ecdb4-da01-4d35-9c9e-2ef6ca604eca.jpg'},
		    	{a:'케이프타운',d:'https://a0.muscache.com/4ea/air/r:w284-h426-sfit,e:fjpg-c75/pictures/0e2e4ace-7f04-4895-b7c6-482c99e69908.jpg'},
		    	{a:'런던',d:'https://a0.muscache.com/4ea/air/r:w284-h426-sfit,e:fjpg-c75/pictures/ebbb24af-52d6-490c-89e9-16cc560140e8.jpg'},
		    	{a:'서울',d:'https://a0.muscache.com/4ea/air/r:w284-h426-sfit,e:fjpg-c75/pictures/0c79a1b5-333a-421b-b9e3-effb8b9b9958.jpg'},
		    	{a:'나이로비',d:'https://a0.muscache.com/4ea/air/r:w284-h426-sfit,e:fjpg-c75/pictures/0b5c2ac4-6ce6-4433-ae45-73727bc14ced.jpg'},
		    	{a:'샌프란시스코',d:'https://a0.muscache.com/4ea/air/r:w284-h426-sfit,e:fjpg-c75/pictures/5be8a4f2-0aab-4bb8-b892-61527da7b550.jpg'},
		    	{a:'아바나',d:'https://a0.muscache.com/4ea/air/r:w284-h426-sfit,e:fjpg-c75/pictures/8346a424-a1dc-4c50-921d-a5226b44529f.jpg'},
		    	{a:'디트로이트',d:'https://a0.muscache.com/4ea/air/r:w284-h426-sfit,e:fjpg-c75/pictures/650757ef-ed35-49b6-a3a0-ce289ab57b42.jpg'},
		    ];
		    
		    var rommbanner='';
		    $.each(roomarr,(i,j)=>{
		    	rommbanner+='<div style="float:left; width: 16%;">'
			    	+'  <img src="'+j.d+'" style="width: 158px; height:240px;" /><br>'
			    	+'<span style="padding: 8px; font-size:1.3em; font-weight:600; color:#484848;">'+j.a+'</span>'
			    	+'</div>';
 		    });
		    
    		$('#rooms').append(rommbanner);
		    $('.rooms-carousel').flickity({
		    	  cellAlign: 'left',
		    	  autoPlay: 0,
		    	});

		    var mainUrl = ctx+'/jw/list/residence/x/x';
			$.getJSON(mainUrl, d=>{
				 var jy_slider='';
				  $.each(d.list,(i,j)=>{
					 jy_slider += '<div class="carousel-cell" id="'+j.hostSerial+'" onclick="app.selectHost.temp(\''+j.hostSerial+'\')">'
							 + '   <img class="carousel-img" src="'+j.infoImg+'" />'
							 + '  </div>'
							 + '</div>';
				  });
				  $('#jy-flickity').append(jy_slider);
				  $('.main-carousel').flickity({
					   cellAlign: 'left',
					   autoPlay: 1500
				  });
			});
		    
			/* jw-footer */
			$('#container').after(main.footer());
	         
		});
	};
	
		return{init:init};
})();

app.selectHost={
		temp:function(x){
			 $.getJSON(hee.rev.init(x));
			 $('#airbnbText').remove();
		}
};

var mainPG={lookup:()=>{return '<div id="lookup" style="width:90%;  height:200px; margin:-1% 9%">'
	 +'  <div id="around" style="width:70%; margin-left:10%;">'
	 +' <h3 style="font-weight: bold;font-size: xx-large;color: #434343;margin-bottom: -2px;">에어비앤비 둘러보기</h3>'
	 +'</div>'
	 +'<br/>'
	+'	 <div style="width:85%; height:150px; margin-left:10%;">'
	+'<a id="lookupHostel" style="text-decoration:none; cursor: pointer; z-index:900;">'
	+'  <div id="box1" style="float:left; width:22%; height:50%; border: 1px solid #EAEAEA; box-shadow:3px 3px 8px #EAEAEA; display: inline-block;">'
	+'     <div id="Imagebox1" style="float:left; width:40%; height:100%; background-image:url(https://a0.muscache.com/ac/pictures/8b7519ec-2c82-4c09-8233-fd4d2715bbf9.jpg);'
	+'     background-size: cover;">'
	+'     </div>'
	+'     <div id="textbox1" style="float:left; width:30%; height:100%; margin-top: 9%; margin-left:5%;">'
	+'        <span style="font-size:17px;">'
	+'           숙소'
	+'        </span>'
	+'     </div>'
	+'  </div>'
	+'</a>'
	+'  <div id="box2" style="margin-left:20px; float:left; width:22%; height:50%;' 
	+'     border: 1px solid #EAEAEA; box-shadow:3px 3px 8px #EAEAEA; display: inline-block;">'
	+'     <div id="Imagebox2" style="float:left; width:40%; height:100%;'
	+'     background-image:url(https://a0.muscache.com/ac/pictures/d3811ff7-cc34-471b-8aee-b0d613db0052.jpg);'
	+'     background-size: cover;">'
	+'     </div>'
	+'<a style="text-decoration: none;" title="미구현 기능입니다.">'
	+'     <div id="textbox2" style="float:left; width:30%; height:100%; margin-top: 9%; margin-left:5%;">'
	+'        <span style="font-size:17px; width: 100%">'
	+'        트립'
	+'        </span>'
	+'     </div>'
	+'</a>'
	+'  </div>'
	+'  <div id="box3" style="margin-left:20px; float:left; width:22%; height:50%;' 
	+'     border: 1px solid #EAEAEA; box-shadow:3px 3px 8px #EAEAEA; display: inline-block;;">'
	+'     <div id="Imagebox3" style="float:left; width:40%; height:100%;'
	+'     background-image:url(https://a0.muscache.com/ac/pictures/da2d8e97-90b7-409f-94ac-5ab0327c289b.jpg);'
	+'     background-size: cover;">'
	+'     </div>'
	+'<a style="text-decoration: none;" title="미구현 기능입니다.">'
	+'     <div id="textbox3" style="float:left; width:30%; height:100%; margin-top: 9%; margin-left:5%;">'
	+'        <span style="font-size:17px;">'
	+'           음식'
	+'        </span>'
	+'     </div>'
	+'</a>'
	+'  </div>'
	+' </div>'
	+'</div>';},
	
	top3 :()=>{return '<div style="width: 66%; margin: -4% 17.5%;">'
	+'	<div  style="width: 50%;position: relative;">'
	+'<span><h3 style="font-weight: bold;font-size: xx-large;color: #434343;margin:0 0px 26px 9px">인기 여행지</h3></span>'
	+'<span id="roomsSeeAll" style="position: absolute;right: 10%; top: 0;">'
	+'</span></div>'
	+'<div id="rooms" class="rooms-carousel">'
	+'</div>'
    +'  </div>';
	},
	hostels:()=>{return '<div style="width: 82%; height:400px; margin: 4% 18%; position:relative;">'
		+'	<div  style="width: 90%;position: relative;">'
		+'<span><h3 style="font-weight: bold;font-size: xx-large;color: #434343;margin-bottom: -2px;">숙소</h3></span>'
		+'<span id="roomsSeeAll" style="position: absolute;right: 10%; top: 0;">'
		+'</span></div>'
		+'<div style="width:100%;margin: 43px 40px 9px -131px;"><div id="jy-flickity" class="main-carousel"></div></div>'
	    +'  </div>';}
};

/* navbar */
app.navbar=(function(){
	var js,temp,ctx;
	var init=()=>{		
		ctx = $$('x');
		img = $$('i');
		js = $$('j');
		temp=js+'/template.js';
		onCreate();
	};
	var onCreate=function(){
		$.getScript(temp,()=>{
			main.navbar();
			$('#mainLogobox').after('<nav/>',{'id':'mainNabMenu'});
			/* 프로필가기mainProfile */
			 $('#mainProfile').click(e=>{
					$('#navbar').html(main.navbar()).css({'padding-top':'10px','margin-bottom':'5%'});
					$('#airbnbText').remove();
			    	$('#content').empty();
			    	$('#footer').html(main.footer()).css({'margin-top': '55%'});
					   chobongki.profile.init();
			    });
			
		  
		    $('#mainJoin').attr({'data-toggle':'modal', 'data-target':"#myModal222"}).click(e=>{
				   chobongki.common.init();
		    });
		    $('#mainLogin').attr({'data-toggle':'modal', 'data-target':"#myModal111"}).click(e=>{		    	
		    			   chobongki.common.init(ctx);
		    });
		    $('#mainJoin').click(e=>{
	              $('body').html(cho.join());
	                chobongki.index.init(); 
	          });
			 $('#mainOut').click(e=>{
	                $('#content').empty();
	                sessionStorage.clear();
	                app.common.init(ctx);
	             });
			 
			 $('#mainHost').click(e=>{
	              $('#content').empty();
	              $('#content').css({'padding-bottom':'0'});
	              $('#airbnbText').remove();
	             hee.common.init(ctx);
	             hee.register.init();
	          });
			 
		    $('#mainAdmin').click(e=>{
		    	$('body').empty();
		    	$('#content').remove();
		    	jw.common.init(ctx);
		    });
		    
		    $('#mainLogobox').click(e=>{
		    	sessionStorage.removeItem('searchCity');
		    	app.common.init(ctx);
		    }); 
		});
	};
	return {init: init}
})();


/* session */
app.session=
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

var $$= function(x){return app.session.getPath(x);};
