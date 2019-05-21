    $(document).ready(function(){
        $("#jubi-secIframe").fadeIn(500);                
        $('#chatProceed').fadeIn(1000);
        $('.chatProceed-botimg').fadeIn(1000);                            
        $('#chatprocedWelcome').fadeIn(1500);                            
        $('#continueFreshChat').fadeIn(2000); 
        $('#continueChat').fadeIn(2500);                            
        $('#startFreshChat').fadeIn(3000);                            
        $('#jubi-textInput').fadeIn(1000);        
        $(".jubi-iconMenu").click(function(){
            $(".jubiSecMenucontent").toggle(200)
        })
        $(".jubiSecMenucontent").click(function (){
            $(".jubiSecMenucontent").hide(200);
        })
        $("#pm-data").click(function () {
            $(".jubiSecMenucontent").hide(200);
        }) 
        $("#jubi-answerBottom").click(function () {
            document.getElementById("jubi-answerBottom").style.height = "26px";
            $("#jubi-bottomClick").show();
            $("#button-send").show();            
            $("#voice-buttons").hide();                    
        })   
        $("#jubi-secCloseview").click(function(){
            $("#jubi-aside_fullopenview").show(200);
            $("#jubi-secCloseview").hide(200);
            $("#jubi-secCloseMsg").hide(200);  
        })
        $("#jubi-secHideChat").click(function(){
            $("#jubi-aside_fullopenview").hide(200);
            $("#jubi-secCloseview").show(200); 
        })
        $("#jubi-btnClose").click(function(){
            $("#jubi-secCloseMsg").hide(200);
        }) 
        
        /* ==========================
                Textarea height
         =========================== */   
         $("body").on('keypress', 'jubi-bottomClick', function(e) {   
            document.getElementById("jubi-answerBottom").style.height = "26px";
            $('#button-send').show();
            $('#button-send').css('display','block !important');
            $('#button-send').css('display','block');
         })

         $("body").on('keydown', '#jubi-answerBottom', function(e) {
            var answer = $("#jubi-answerBottom").val();
            var textareaElmnt = document.getElementById("jubi-answerBottom");
            var textareaheightnow = textareaElmnt.scrollHeight;
            console.log("textareaheightnow: " +  textareaheightnow)	            
            if(textareaheightnow < 26){
                document.getElementById("jubi-answerBottom").style.height = "26px";
            }		
            else {	
                    document.getElementById("jubi-answerBottom").style.height = textareaheightnow + "px";
                }
            if (answer=="") {
                console.log("if (answer=='')");
                document.getElementById("jubi-answerBottom").style.height = "26px";
            }	
            
            $('#button-send').show();
            $('#button-send').css('display','block !important');
            $('#button-send').css('display','block');	
        });

        
        $("#jubi-answerBottom").click(function () {
            $("#jubi-bottomClick").show();
            $("#button-send").show();
            $('#button-send').show();
            $("#voice-buttons").hide();
        })
        $("#jubi-bottomClick").click(function () {
            $("#jubi-bxinput").show();
            $("#jubi-bottomClick").show();
            $("#button-send").show();
        })
        $("#jubi-redSend").click(function () {
            $("#jubi-bxinput").show();
            $("#jubi-bottomClick").show();
            $("#button-send").show();
            $("#jubi-redSend").show();
        })
        



        
        $("body").click(function (e) {
            setTimeout(function () {
                if ($("textarea").is(":focus")) {
                    $("#jubi-bottomClick").show();
                    $("#jubi-bxinput").show();
                    $("#voice-buttons").hide();
                    $("#keyboard-icon").hide();
                    $('#jubi-redSend').show();
                    $('#jubi-graySend').hide();
                    $('#button-send').show();
                    $('#button-send').css('display','block !important');
                    $('#button-send').css('display','block');
                }
                else {
                    // $("#jubi-bottomClick").hide(200);
                    // $("#voice-buttons").show(200);                    
                    $('#jubi-redSend').hide();
                    $('#jubi-graySend').show();
                    $('#button-send').show();
                    $('#button-send').css('display','block !important');
                    $('#button-send').css('display','block');
                }
            }, 500);
        });
    });           
    
    function openChatbot(){
        $("#jubi-aside_fullopenview").show(200);
        $("#jubi-secCloseview").hide(200);
        $("#jubi-secCloseMsg").hide(200);  
    }