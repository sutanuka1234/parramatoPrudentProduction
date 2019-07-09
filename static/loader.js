"use strict";
(function () {

    function load(x, s) {
        return new Promise(function (resolve, reject) {
            console.log("file-loading");

            s.onload = s.onreadystatechange = function () {
                var r = false;

                if (!r && (!this.readyState || this.readyState == 'complete')) {
                    r = true;
                    console.log("file-loading success");
                    return resolve();
                }
            };

            s.onerror = function (e) {
                console.log("file-loading failed");
                return reject(e);
            };
            // console.log(s)
            x.appendChild(s);
        });
    }

    async function loadJs(jsUrls) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            var scriptsArr = [];
            var x = document.getElementsByTagName('head')[0];

            for (var _iterator = Object.keys(jsUrls)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;
                var _url = jsUrls[key];
                if (!isMyScriptLoaded(_url)) {
                    // document.writeln("<script type='text/javascript' src='" + _url + "'></script>");
                    var s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.src = _url;
                    s.async = true;
                    s.defer = true;
                    await load(x, s);
                }
            }
        } catch (err) {
            console.log(err);
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
    async function loadCss(cssUrls) {
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
                    link.async = true;
                    link.defer = true;
                    // head.appendChild(link);
                    await load(head, link);
                }
            }
        } catch (err) {
            console.log(err);
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
        pmTheme: "./css/theme.css"
    });
    loadJs({
        crypt: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js",
        jQuery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
        bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js",
        carousel: "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js",
        socket: "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js",
        responsiveVoice: "https://code.responsivevoice.org/responsivevoice.js",
        nluComponent: "https://unpkg.com/compromise@latest/builds/compromise.min.js",
        bundle: "https://parramato.com/bot-view/parramatoPrudentProduction_571731615155/dev/js/bundle.test.js",
        // bundle: "./js/bundle.test.js"
        jubiEvents:"./js/jubievents.js"
    });
    window.directMultiplier = 1;
    window.fallbackMultiplier = 0.8;
    window.speechOnBrowser = "Hindi Female"
    window.speechGenderBackend = "FEMALE"
    window.speechLanguageCodeBackend = "en-US"
    window.jubiUrl = 'https://parramato.com/bot-view/parramatoPrudentProduction_571731615155/dev/';
    window.jubiModal = {
        url: 'wss://142.93.220.139',
        path: '/prudent-parramato/socket',
        static: {
            url: window.jubiUrl,
            scripts: {
            },
            css: {
            },
            images: { "logo": "https://parramato.com/bot-view/parramatoPrudentProduction_571731615155/dev/images/logo.png", "sendIcon": "./images/icon_send.png", "sendIconActive": "./images/iconRed_send.png", "loaderBotChat": "./images/loading_new.gif", "userIcon": "./images/rightUser.png", "botIcon": "./images/boticon.png", "logoIcon": "./images/logo-icon.png", "voiceIcon": "https://parramato.com/bot-view/parramatoPrudentProduction_571731615155/dev/images/voice.png", "closeWebView": "https://parramato.com/bot-view/parramatoPrudentProduction_571731615155/dev/images/closeWebView.png", "attachment": "https://parramato.com/bot-view/parramatoPrudentProduction_571731615155/dev/images/attachment.png", "permissionIcon": "./images/loading_new.gif" },
            text: {
                closeMessage: '',
                headMessage: 'Ask me anything.'
            }
        }
    };
    window.passphraseMiddleware = "YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE"
    window.voiceEnable = true;
    window.chatPersistence = true;
    window.mainpage = '<section class="sec_main" id="jubisecmain" style="display: none;"></section>';
    window.leftpanel = '';
    window.templateOpenView = '';
    window.rightpanel = 
    '<div class="rightPage" id="rightpanel" style="display:none;">'+
        '<section class="jubichatbot" id="jubichatbot" style="display: none;"></section>'+
    '</div>'+
    '<aside id="jubi-aside_fullopenview">'+
        '<section class="pm-sec_calliframe" id="pm-secIframe">' +
            '<section class="pm-sec_scroll2 pm-sec_openview" id="pm-mainSec">' +
            '<section id="pm-permission-view" style="display:none" >' +
            '<section class="pm-sec_show_option_on_start" id="pm-sec_show_option_on_start" style="display:block">' +
            '<div class="chatProceed" id="chatProceed">' +
            '<div class="chatProceed-botimg">' +
            '<img src="./images/loading_new.gif" class="img-responsive">' +
            '</div>' +
            '<p>Welcome back! Let us begin...</p>' +
            '<ul>' +
            '<li>' +
            '<a href="javascript:void(0)" id="jubi-continue-storage" >Continue from where we left</a>' +
            '</li>' +
            '<li>' +
            '<a href="javascript:void(0)" id="jubi-start-fresh">Start fresh</a>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</section>' +
            '</section>'+

            '<section id="pm-heading" class="pm-sec_newHeader">' +
            '<div class="pm-titleheader" >' +
            '<h3>' +
            '<img src="./images/logo-icon.png" class="img-responsive"><span class="pm-headOnline" >&nbsp;</span>' +
            '</h3>' +
            '</div>' +
            '<p>Chat and Invest. Ask me anything</p>' +
            '<section class="secHideChat" id="secHideChat" onclick="hideChatBot()" style="display: block;">' +
            '<img src="https://www.fundzbot.com/images/icon_close.png" class="img-responsive mobileClose">' +
            '</section>' +
            '</section>' +

            '<section class="pm-sec_chatbody" id="pm-data" >' +
            '<div class="pm-bxChatbox pm-bxChat chatWindow" id="pm-buttonlock">' +
            '</div>' +
            '</section>' +


            '<div id="jubi-recording-text">' +
            '<p id="jubi-result-text">' +
            '<span class="jubi-grey-text"><span>' +
            '</p>' +
            '</div>' +

            '<section id="jubi-textInput" class="jubi-sec_newFooter footer-two" style="float:left;width:100%;display:block;">' +
            '<article class="artMenu">' +
            '<article class="secMenucontent" id="secMenucontent" style="display: none;">' +
            '<section class="sec_dropdown">' +
            '<h3 onclick="toggleFooterMenu()">Menu</h3>' +
            '<ul>' +
            '<li class="menu_val" onclick="window.askBot(`Start Over`);toggleFooterMenu()">Start over</li>' +
            '<li class="menu_val" onclick="window.askBot(`Invest`);toggleFooterMenu()">Invest</li>' +
            '<li class="menu_val" onclick="window.askBot(`Switch`);toggleFooterMenu()">Switch</li>' +
            '<li class="menu_val" onclick="window.askBot(`Redeem`);toggleFooterMenu()">Redeem</li>' +
            '<li class="menu_val" onclick="window.askBot(`Get account statement`);toggleFooterMenu()">Get account statement</li>' +
            '<li class="menu_val" onclick="window.askBot(`Transaction Details`);toggleFooterMenu()">Transaction Details</li>' +
            '<li class="menu_val" onclick="window.askBot(`Nach Mandate`);toggleFooterMenu()">Nach Mandate</li>' +
            '<li class="menu_val" onclick="window.askBot(`Talk to Customer Care`);toggleFooterMenu()">Talk to Customer Care</li>' +
            '<li class="menu_val" onclick="window.askBot(`Cancel conversation`);toggleFooterMenu()">Cancel conversation</li>' +
            '</ul>' +
            '</section>' +
            '<div class="trianglearrow">' +
            '<img src="https://www.fundzbot.com/images/triangledown.png" class="img-responsive">' +
            '</div>' +
            '</article>' +
            '<div class="iconMenu" id="show-footer-menu" onclick="toggleFooterMenu()"><i class="fa fas fa-bars"></i></div>' +
            '</article>' +
            '<aside class="jubi-muteUnmuteVoice" style="display:none;">' +
            '<div id="jubi-unmuteVoice">' +
            '<img src="https://parramato.com/bot-view/parramatoPrudentProduction_571731615155/dev/images/unmute.png">' +
            '</div>' +
            '<div id="jubi-muteVoice">' +
            '<img src="https://parramato.com/bot-view/parramatoPrudentProduction_571731615155/dev/images/mute.png">' +
            '</div>' +
            '</aside>' +


            '<div class="voice-buttons" id="voice-buttons" style="display:none;">' +
            '<div class="voiceIcon" id="button-play-ws">' +
            '<img src="https://parramato.com/bot-view/parramatoPrudentProduction_571731615155/dev/images/voice.png" class="img-fluid">' +
            '</div>' +
            '<div class="voicePulse" id="button-stop-ws">' +
            '<div class="sk-three-bounce">' +
            '<div class="sk-child sk-bounce1"></div>' +
            '<div class="sk-child sk-bounce2"></div>' +
            '<div class="sk-child sk-bounce3"></div>' +
            '</div>' +
            '<div class="stop-recording">Listening...</div>' +
            '</div>' +
            '</div>' +
            '<div class="jubi-bxinput" id="jubi-bxinput">' +
            '<textarea id="jubi-answerBottom" placeholder="Type here..." style="resize:none;overflow:hidden;" autofocus></textarea> ' +
            '<div class="datasendButtons">' +
            '<div class="sendIcon" id="button-send">' +
            '<button id="jubi-bottomClick" type="submit" onclick="return false;">' +
            '<img src="./images/icon_send.png" id="jubi-graySend" class="img-responsive" style="display: block;">' +
            '<img src="./images/iconRed_send.png" id="jubi-redSend" class="img-responsive" style="display: none;">' +
            '</button>' +

            '</div>' +
            '<div class="uploadbox" style="display:none;">' +
            '<label>' +
            '<div class="inputfile">' +
            '<img src="https://parramato.com/bot-view/parramatoPrudentProduction_571731615155/dev/images/attachment.png" class="img-responsive">' +
            '<input class="jubi-file-upload" type="file" name="fileName" >' +
            '</div>' +
            '<div class="button-section" style="display:none">' +
            '<button type="submit">Submit</button>' +
            '</div>' +
            '</label>' +
            '</div>' +
            '<div class="keyboard-icon" id="keyboard-icon" style="display:none;">' +
            '<i class="fa fa-keyboard-o" aria-hidden="true"></i>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="jubi-new_copyright" id="jubi-new_copyright">' +
            '<div class="shareIcons">' +
            '<h5>Share on: </h5>' +
            '<ul>' +
            '<li class="whatsappLi"><a target="_blank" href="https://api.whatsapp.com/send?text=https://www.fundzbazar.com/"><i class="fa fab fa-whatsapp" aria-hidden="true" title="Share on whatsapp"></i></a></li>' +
            '<li class="facebookLi"><a href="http://www.facebook.com/share.php?u=https://www.fundzbazar.com/" onclick="return fbs_click()" target="_blank"><i class="fa fab fa-facebook" title="Share on Facebook"></i></a></li>' +
            '<li class="twitterLi"><a target="_blank" href="https://twitter.com/intent/tweet?url=https://www.fundzbazar.com/"><i class="fa fab fa-twitter" title="Share on Twitter"></i></a></li>' +
            '<li class="linkedinLi"><a href="http://www.linkedin.com/shareArticle?mini=true&amp;url=https://www.fundzbazar.com/&amp;title=TEST&amp;summary=TEST&amp;source=My Website Name" target="_new"> <i class="fa fa-linkedin" title="Share on Linkedin"></i></a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</section>' +
            '</section>' +
            '</section>'+
        '</aside>';
    window.loadPermissionView ='';

    window.runOnJubiStartEvent = true;
})();


function handleConnectionChange(event) {
    let netStatus = document.getElementById("internet-detect");
    if (event.type == "offline") {
        netStatus.style.display = "block";
        netStatus.innerHTML = '<p class="offline">You are offline</p>';
    }
    if (event.type == "online") {
        netStatus.innerHTML = '<p class="online">You are online</p>';
        setTimeout(function () {
            netStatus.style.display = "none";
        }, 2000)
    }
}
window.addEventListener('online', handleConnectionChange);
window.addEventListener('offline', handleConnectionChange);