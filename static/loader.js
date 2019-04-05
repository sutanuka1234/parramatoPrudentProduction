
        "use strict";
            (function () {
                function loadJs(jsUrls) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = Object.keys(jsUrls)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var key = _step.value;

                            var _url = jsUrls[key];
                            if (!isMyScriptLoaded(_url)) {
                                document.writeln("<script type='text/javascript' src='" + _url + "'></script>");
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }
                function isMyScriptLoaded(url) {
                    var scripts = document.getElementsByTagName('script');
                    for (var i = scripts.length; i--;) {
                        if (scripts[i].src == url) return true;
                    }
                    return false;
                }

                function isMyCssLoaded(url) {
                    var scripts = document.getElementsByTagName('link');
                    for (var i = scripts.length; i--;) {
                        if (scripts[i].src == url) return true;
                    }
                    return false;
                }
                function loadCss(cssUrls) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = Object.keys(cssUrls)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var key = _step2.value;

                            var _url2 = cssUrls[key];
                            if (!isMyCssLoaded(_url2)) {
                                var head = document.getElementsByTagName('head')[0];
                                var link = document.createElement('link');
                                link.rel = 'stylesheet';
                                link.type = 'text/css';
                                link.href = _url2;
                                link.media = 'all';
                                head.appendChild(link);
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
                loadCss({
        bootstrapFont: "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css",
        muliFont: "https://fonts.googleapis.com/css?family=Muli:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i",
        owl: "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.css",
        bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
        owlTheme: "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css",
        pmTheme: "./theme.css"
    });
    loadJs({
        crypt: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js",
        jQuery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
        bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js",
        carousel: "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js",
        socket: "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js",
        responsiveVoice :"https://code.responsivevoice.org/responsivevoice.js",
        nluComponent:"https://unpkg.com/compromise@latest/builds/compromise.min.js",
        bundle: "https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/js/bundle.js"
    });
                window.directMultiplier=1;
            window.fallbackMultiplier=0.8;
            window.speechOnBrowser="Hindi Female"
            window.speechGenderBackend="FEMALE"
            window.speechLanguageCodeBackend="en-US"
            window.jubiUrl='https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/';
            window.jubiModal={
                url:'wss://development.jubi.ai',
                path:'/prudent-uat/socket',
                static:{
                    url:window.jubiUrl,
                    scripts:{
                    },
                    css:{
                    },
                    images:{"logo":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/logo.png","sendIcon":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/icon_send.png","sendIconActive":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/iconRed_send.png","loaderBotChat":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/response-loading.gif","userIcon":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/user.png","botIcon":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/boticon.png","logoIcon":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/logo-icon.png","voiceIcon":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/voice.png","closeWebView":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/closeWebView.png","attachment":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/attachment.png","permissionIcon":"https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/parrot_loader.gif"},
                    text:{
                        closeMessage:'',
                        headMessage:'Ask me anything.'
                    }
                }
            };
            window.passphraseMiddleware="YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE"
            window.voiceEnable=true;
            window.chatPersistence = true;
                window.mainpage =   '<section class="sec_main" id="jubisecmain" style="display: none;"></section>';
                window.leftpanel =  '<div class="leftPage" id="leftpanel"><div class="leftpanelBg"><div class="leftpage_opacity">&nbsp</div></div><div class="leftContent"><div class="logo"><img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/logo.png" class="img-fluid" ></div><h2>Ask me anything.</h2></div></div>';   
                window.rightpanel = '<div class="rightPage" id="rightpanel"><section class="jubichatbot" id="jubichatbot" style="display: none;"></section></div>';
                window.templateOpenView = '<section class="pm-sec_calliframe" id="pm-secIframe"  style="display:none">'+
                '<section class="pm-sec_scroll2 pm-sec_openview" id="pm-mainSec">' + 

                    '<section id="pm-heading" class="pm-sec_newHeader">'+
                        '<div class="pm-titleheader" >'+
                            '<h3>'+
                                '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/logo-icon.png" class="img-responsive"><span class="pm-headOnline" >&nbsp;</span>'+
                            '</h3>'+
                        '</div>'+
                        '<p>Ask me anything.</p>'+
                    '</section>'+

                    '<section class="pm-sec_chatbody" id="pm-data" >'+
                        '<div class="pm-bxChatbox pm-bxChat chatWindow" id="pm-buttonlock">'+
                        '</div>'+
                    '</section>'+


                    '<div id="jubi-recording-text">'+
                        '<p id="jubi-result-text">'+
                            '<span class="jubi-grey-text"><span>'+
                        '</p>'+
                    '</div>'+

                    '<section id="pm-textInput" class="pm-sec_newFooter footer-one" style="float:left;width:100%;display:none;">'+
                        '<div class="inputArea">'+
                            '<div class="pm-bxform">' +
                                '<div class="pm-bxinput">' +
                                    '<textarea id="pm-answerBottom" placeholder="Type a message here..." style="resize:none;overflow:hidden;" autofocus></textarea>' +
                                '</div>' +
                                '<button id="pm-bottomClick" type="submit" onclick="return false;">'+
                                    '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/icon_send.png" id="graySend" class="img-responsive" style="display: block;">'+
                                '</button>'+
                                '<div class="uploadbox">' +
                                    '<label>' +
                                        '<div class="inputfile">' +
                                            '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/attachment.png" class="img-responsive">' +
                                            '<input class="jubi-file-upload" type="file" name="fileName" >' +
                                        '</div>' +
                                        '<div class="button-section" style="display:none">' +
                                            '<button type="submit">Submit</button>' +
                                        '</div>' +
                                    '</label>'+
                                '</div>' +
                            '</div>' +
                        '</div>'+

                        '<div class="jubi-new_copyright" id="jubi-new_copyright">' +
                            'Powered by <a href="https://www.jubi.ai/" target="_blank">jubi.ai</a>' +
                        ' </div>' +
                    '</section> ' +

                    '<section id="jubi-textInput" class="jubi-sec_newFooter footer-two" style="float:left;width:100%;">'+

                        '<aside class="jubi-muteUnmuteVoice">'+
                            '<div id="jubi-unmuteVoice">'+
                                '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/unmute.png">'+
                            '</div>'+
                            '<div id="jubi-muteVoice">'+
                                '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/mute.png">'+
                            '</div>'+
                        '</aside>'+
                    
                    
                        '<div class="voice-buttons" id="voice-buttons">'+
                            '<div class="voiceIcon" id="button-play-ws">'+
                                '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/voice.png" class="img-fluid">'+
                            '</div>'+
                            '<div class="voicePulse" id="button-stop-ws">'+
                                '<div class="sk-three-bounce">'+
                                    '<div class="sk-child sk-bounce1"></div>'+
                                    '<div class="sk-child sk-bounce2"></div>'+
                                    '<div class="sk-child sk-bounce3"></div>'+
                                '</div>'+
                                '<div class="stop-recording">Listening...</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="jubi-bxinput" id="jubi-bxinput" style="display:none;">'+
                            '<textarea id="jubi-answerBottom" placeholder="Type a message here..." style="resize:none;overflow:hidden;" autofocus></textarea> '+
                        '</div>'+
                        '<div class="datasendButtons">'+
                            '<div class="sendIcon" id="button-send">'+
                                '<button id="jubi-bottomClick" type="submit" onclick="return false;">'+
                                    '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/icon_send.png" id="jubi-graySend" class="img-responsive" style="display: block;">'+
                                    '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/iconRed_send.png" id="jubi-redSend" class="img-responsive" style="display: none;">'+
                                '</button>'+
                                
                            '</div>'+
                            '<div class="uploadbox">' +
                                '<label>' +
                                    '<div class="inputfile">' +
                                        '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/attachment.png" class="img-responsive">' +
                                        '<input class="jubi-file-upload" type="file" name="fileName" >' +
                                    '</div>' +
                                    '<div class="button-section" style="display:none">' +
                                        '<button type="submit">Submit</button>' +
                                    '</div>' +
                                '</label>'+
                            '</div>' +
                            '<div class="keyboard-icon" id="keyboard-icon" >'+
                                '<i class="fa fa-keyboard-o" aria-hidden="true"></i>'+
                            '</div>'+        
                        '</div>'+
                        '<div class="jubi-new_copyright" id="jubi-new_copyright">' +
                            'Powered by <a href="https://www.jubi.ai/" target="_blank">jubi.ai</a>' +
                        ' </div>' +
                    '</section>'+
                '</section>' +       
            '</section>';
                window.loadPermissionView = 
    '<section id="pm-permission-view" style="display:none" >'+
        '<section id="pm-heading" class="pm-sec_newHeader">'+
            '<div class="pm-titleheader" >'+
                '<h3>'+
                    '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/logo-icon.png" class="img-responsive"><span class="pm-headOnline" >&nbsp;</span>'+
                '</h3>'+
            '</div>'+
            '<p>Ask me anything.</p>'+
        '</section>'+
        '<section class="pm-sec_show_option_on_start" id="pm-sec_show_option_on_start" style="display:block">'+         
            '<div class="chatProceed" id="chatProceed">'+
                '<div class="chatProceed-botimg">'+
                    '<img src="https://parramato.s3.ap-south-1.amazonaws.com/ClonePrudentProduction_432543815345/dev/images/parrot_loader.gif" class="img-responsive">'+
                '</div>'+
                '<p>Welcome back! Let us begin...</p>'+
                '<ul>'+
                    '<li>'+
                        '<a href="javascript:void(0)" id="jubi-continue-storage" >Continue from where we left</a>'+
                    '</li>'+
                    '<li>'+
                        '<a href="javascript:void(0)" id="jubi-start-fresh">Start fresh</a>'+
                    '</li>'+
                '</ul>'+
            '</div>'+
        '</section>'+
    '</section>';
    
            })();
            
    