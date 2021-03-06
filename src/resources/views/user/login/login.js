import './login.scss';
import {tips, showPop, hidePop, countdown, swip, common, lazy} from '../../../../public/js/common';
import {ajaxGet, ajaxPost, formData} from '../../../../public/js/ajax';
import {user_pop_module} from '../../../../public/js/user';
/* 加载全局注册模块 */
user_pop_module.init();
if(document.querySelector('.js-reg')){
    document.querySelector('.js-reg').addEventListener('click', (e) => {
        user_pop_module.pop_open(0);
    });
}
let _loginSel = document.querySelectorAll('.js-pop-login');
if(_loginSel&&_loginSel.length>0){
    Array.prototype.forEach.call(_loginSel, (el, index) => {
        el.addEventListener('click', (e) => {
            user_pop_module.pop_open(1);
        });
    });
}
if(document.querySelector('.js-pop-reg')){
    document.querySelector('.js-pop-reg').addEventListener('click', (e) => {
        user_pop_module.pop_open(0);
    });
}

tips();
let login = {
    code_url: config.code_url,
    login_url: config.login_url,
    gt_url: config.gt_url,
    validate_flag: false,
    prev_click: false,
    before: function(){
        console.log('before')
    },
    login_before: function(){
        let _dots = document.querySelector('.js-l-dots');
        if(_dots&&_dots.classList.contains('hidden')){
            _dots.classList.remove('hidden');
        }
    },
    login_success: function(data, paras){
        window.location.reload();
    },
    login_error: function(){
        let _dots = document.querySelector('.js-l-dots');
        if(_dots&&!_dots.classList.contains('hidden')){
            _dots.classList.add('hidden');
        }
    },
    success: function(data, paras){
        console.log('success');
    },
    val_suc: function(data){
        console.log('val success')
    },
    error: function(){
        console.log('error')
    },
    alert: function(data){
        let _dots = document.querySelector('.js-l-dots');
        if(_dots&&!_dots.classList.contains('hidden')){
            _dots.classList.add('hidden');
        }
        showPop(data.message);
        setTimeout(function () {
            hidePop();
        }, 1500);
    },
    gt_validate_succ: function (data) {
        initGeetest({
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: true,
            product: config.gt_product,
            lang: config.gt_lang,
            http: config.gt_http,
            width: '100%'
        }, login.gt_handler)
    },
    gt_handler: function (captchaObj) {
        captchaObj.appendTo(document.querySelector('#captcha'));
        captchaObj.onReady(function(){

        }).onSuccess(function(){
            login.validate_flag = captchaObj.getValidate();
        }).onError(function(){
            captchaObj.reset();
        })
    }
};
/* 图片延迟加载 */
lazy();
document.querySelector('.js-get-code').addEventListener('click', (e) => {
    if(login.prev_click){
        return;
    }
    let _el = document.querySelector('.js-get-code');
    let _phone = document.querySelector('.js-phone-num').value;
    if(!/^1\d{10}$/gi.test(_phone)){
        login.alert({
            'message': '手机号码格式不正确'
        })
    }
    else if(!_phone){
        login.alert({
            'message': '请输入手机号码'
        })
    }
    else if(!login.validate_flag){
        login.alert({
            'message': '请滑动验证码'
        })
    }
    else {
        let computedTime = 60;
        login.prev_click = true;
        let timer = setInterval(() => {
            computedTime --;
            _el.innerHTML = '已发送(' + computedTime + 's)';
            if (computedTime === 0) {
                login.prev_click = false;
                clearInterval(timer);
                _el.innerHTML = '获取验证码';
            }
        }, 1000);
        ajaxPost(
            login.code_url,
            {
                'cellphone': _phone,
                'action': 'login',
                'geetest_challenge': login.validate_flag.geetest_challenge,
                'geetest_validate': login.validate_flag.geetest_validate,
                'geetest_seccode': login.validate_flag.geetest_seccode
            },
            login.val_suc,
            login.before,
            login.error,
            {},
            login.alert
        );
    }
});
document.querySelector('.js-clear-fork').addEventListener('click', (e) => {
    document.querySelector('.js-phone-num').value = '';
});
document.querySelector('.js-phone-num').addEventListener('keyup', (e) => {
    if(document.querySelector('.js-phone-num').value){
        document.querySelector('.js-clear-fork').classList.remove('hidden');
    }else {
        document.querySelector('.js-clear-fork').classList.add('hidden');
    }
});
document.querySelector('.js-login').addEventListener('click', (e) => {
    let _phone = document.querySelector('.js-phone-num').value;
    let _msg = document.querySelector('.js-msg-num').value;
    if(!/^1\d{10}$/gi.test(_phone)){
        login.alert({
            'message': '手机号码格式不正确'
        })
    }
    else if(!_phone){
        login.alert({
            'message': '请输入手机号码'
        })
    }
    else if(!_msg){
        login.alert({
            'message': '请输入短信验证码'
        })
    }
    else {
        ajaxPost(
            login.login_url,
            formData.serializeForm('quickLogin'),
            login.login_success,
            login.login_before,
            login.login_error,
            {},
            login.alert
        );
    }
});
ajaxGet(
    login.gt_url + "?t=" + (new Date()).getTime(),
    login.gt_validate_succ,
    login.before,
    login.error,
    'json'
);