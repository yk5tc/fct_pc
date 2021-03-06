import 'swiper/dist/css/swiper.css';
import './shop.scss';
import "@babel/polyfill";
import {tips, showPop, hidePop, countdown, swip, common, ImageZoom, lazy, tools} from '../../../../public/js/common';
import {ajaxGet, ajaxPost, formData} from '../../../../public/js/ajax';
import {user_pop_module} from '../../../../public/js/user';
user_pop_module.init();
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
let shop = {
    getCoupon_url: config.getCouponUrl,
    post_url: config.addcart_url,
    fav_url: config.fav_url,
    buy_url: config.buy_url,
    discuss_url: config.discuss_url,
    pics: config.pics,
    points: function(total_num, chosen_num){
        let _stars = '';
        for (let i = 0; i < chosen_num; i++) {
            _stars += '<div class="stars y"></div>';
        }
        for (let i = 0; i < (total_num - chosen_num); i++) {
            _stars += '<div class="stars w"></div>';
        }
        return _stars;
    },
    proImg: function(imgs){
        let _imgs = '';
        Array.prototype.forEach.call(imgs, (el, index) => {
            _imgs += '<img src="' + el + '" class="pro-img">'
        });
        return _imgs;
    },
    insertCommet: function(data){
        let _list_items = '';
        Array.prototype.forEach.call(data.data.entries, (el, index) => {
            _list_items += '<div class="comment-item">\n' +
                '<div class="user">' +
                '<img src="' + el.photo + '" class="user-photo">' +
                '<span class="user-name">' + el.username + '</span>' +
                '</div>' +
                '<div class="speak">' +
                '<div class="points">' +
                shop.points(5, el.stars) +
                '</div>' +
                '<div class="text">' + el.text + '</div>' +
                shop.proImg(el.imgs) +
                '<div class="time">' + el.date + '</div>' +
                '</div>' +
                '</div>';
        });
        return _list_items;
    },
    insertPager: function(pager){
        /*
         *      'prev' => 0,
                'current' => $pageIndex,
                'next' => 0,
                'page_size' => $pageSize,
                'total_page' => $totalPage,
                'total' => $result->totalCount,
          *
          * */
        let _isHiddenExist = 0;
        let _pager = '<a href="javascript:;" class="js-prev links">&lt;</a>';

        for (let i = 1; i <= pager.total_page; i++) {
            if(parseInt(pager.current) === i){
                _pager += '<a href="javascript:;" class="js-links links active">' + i + '</a>';
            }
            else {
                if(i < 4 || i < parseInt(pager.current) + 2 && i > parseInt(pager.current) - 2 || i > (parseInt(pager.total_page) - 2)){
                    _pager += '<a href="javascript:;" class="js-links links">' + i + '</a>';
                    _isHiddenExist = 0;
                }
                else {
                    if(_isHiddenExist === 0){
                        _pager += '<a href="javascript:;" class="js-ellipsis links">...</a>';
                        _isHiddenExist = 1;
                    }
                }
            }
        }
        _pager += '<a href="javascript:;" class="js-next links">&gt;</a>';
        return _pager;
    },
    pagerSuccess: function(data, paras){
        let _list = document.querySelector('.js-comment-list'),
            _pager = document.querySelector('.js-pager');
        _list.innerHTML = shop.insertCommet(data);
        _pager.innerHTML = shop.insertPager(data.data.pager);
        document.querySelector('.js-loading').classList.add('hidden');
        shop.pagerBind(data.data.pager);
    },
    pagerBind: function(pager){
        document.querySelector('.js-prev').addEventListener('click', (e) => {
            if(pager.prev > 0){
                ajaxGet(shop.discuss_url + '?page=' + pager.prev, shop.pagerSuccess, shop.pagerBefore, shop.pagerError)
            }
        });
        document.querySelector('.js-next').addEventListener('click', (e) => {
            if(pager.next > 0){
                ajaxGet(shop.discuss_url + '?page=' + pager.next, shop.pagerSuccess, shop.pagerBefore, shop.pagerError)
            }
        });
        Array.prototype.forEach.call(document.querySelectorAll('.js-links'), (el, index) => {
            if(!el.classList.contains('active')){
                el.addEventListener('click', (ev) => {
                    ajaxGet(shop.discuss_url + '?page=' + (parseInt(el.innerHTML)), shop.pagerSuccess, shop.pagerBefore, shop.pagerError);
                });
            }
        });
    },
    pagerBefore: function(data, paras){
        document.querySelector('.js-loading').classList.remove('hidden');
    },
    pagerError: function(data, paras){

    },
    before: function(){
        console.log('before')
    },
    success: function(data, paras){
        console.log('success')
    },
    favSuc: function(data){
        console.log(data.data.favoriteState);
    },
    error: function(){
        console.log('error')
    },
    alert: function(data){
        showPop(data.message);
        setTimeout(function () {
            hidePop();
        }, 1500);
    }
};

/* 图片延迟加载 */
lazy();

swip(
    'photo-container', false, true, 1,
    {
        loadPrevNext: true,
        loadPrevNextAmount: 1   //提前1个slide加载图片
    },
    'fade',
    {
        crossFade: true,
    },
    {},
    {
        el: '.swiper-pagination',
        clickable :true,
        type: 'bullets',
        renderBullet: function (index, className) {
            return '<span class="en-pagination ' + className + '"><img src="' + shop.pics[index] + '" class="bu-img"/></span>';
        },
    },
    {
        slideChange: function(){
            // console.log(this.activeIndex + ':' + this.realIndex)
        },
    },
    true
);
let options = {
    width: 389,
    // height: 250,
    zoomWidth: 500,
    offset: {vertical: 0, horizontal: 10}
};
Array.prototype.forEach.call(document.querySelectorAll('.js-l-items'), (el, index) => {
    new ImageZoom(el, options);
});
swip(
    'opt-container', false, false, 4,
    true,
    'slide',
    {
        crossFade: false,
    },
    {
        nextEl: '.opt-swiper-button-next',
        prevEl: '.opt-swiper-button-prev',
    },
    {},
    {
        slideChange: function(){
            // console.log(this.activeIndex + ':' + this.realIndex)
        },
    }
);

if(document.querySelector('.js-getcoupon')){
    document.querySelector('.js-getcoupon').addEventListener('click', (e) => {
        ajaxPost(
            shop.getCoupon_url,
            {'id': el.getAttribute('data-cid')},
            shop.success(),
            shop.before(),
            shop.error(),
            {},
            shop.alert()
        );
    });
}

document.querySelector('.js-fav').addEventListener('click', (e) => {
    ajaxPost(
        shop.fav_url,
        {},
        shop.favSuc(),
        shop.before(),
        shop.error(),
        {},
        shop.alert()
    );
});
document.querySelector('.js-cart').addEventListener('click', (e) => {
    ajaxPost(
        shop.post_url,
        formData.serializeForm('addcart'),
        shop.success(),
        shop.before(),
        shop.error(),
        {},
        shop.alert()
    );
});
Array.prototype.forEach.call(document.querySelectorAll('.js-buy'), (el, index) => {
    el.addEventListener('click', (e) => {
        /*let _proId = document.querySelector('.js-proid').value;
        let _specId = '';
        if(document.querySelector('.js-spec')){
            _specId = document.querySelector('.js-spec').value;
        }
        let _num = document.querySelector('.js-inp').value;
        let _url = shop.buy_url + '?product_id=' + _proId;
            _url += '&spec_id=' + _specId;
            _url += '&buy_number=' + _num;
        location.href = _url;*/         /* 购买流程后续上线 */
        if(document.querySelector('.js-det-pop').classList.contains('hidden')){
            document.querySelector('.js-det-pop').classList.remove('hidden');
        }
    });
});
/*document.querySelector('.js-buy').addEventListener('click', (e) => {
    /!*let _proId = document.querySelector('.js-proid').value;
    let _specId = '';
    if(document.querySelector('.js-spec')){
        _specId = document.querySelector('.js-spec').value;
    }
    let _num = document.querySelector('.js-inp').value;
    let _url = shop.buy_url + '?product_id=' + _proId;
        _url += '&spec_id=' + _specId;
        _url += '&buy_number=' + _num;
    location.href = _url;*!/         /!* 购买流程后续上线 *!/
    if(document.querySelector('.js-det-pop').classList.contains('hidden')){
        document.querySelector('.js-det-pop').classList.remove('hidden');
    }
});*/
document.querySelector('.js-det-close').addEventListener('click', (e) => {
    if(!document.querySelector('.js-det-pop').classList.contains('hidden')){
        document.querySelector('.js-det-pop').classList.add('hidden');
    }
});

if(document.querySelector('.js-spec')){
    document.querySelector('.js-spec').setAttribute('value', document.querySelector('.js-specs').getAttribute('data-spec'));
    Array.prototype.forEach.call(document.querySelectorAll('.js-specs'), (el, index) => {
        el.addEventListener('click', (ev) => {
            Array.prototype.forEach.call(document.querySelectorAll('.js-specs'), (e, index) => {
                e.classList.remove('chosen');
            });
            el.classList.add('chosen');
            document.querySelector('.js-spec').setAttribute('value', el.getAttribute('data-spec'));
        });
    });
}
document.querySelector('.js-add').addEventListener('click', (e) => {
    let _tm = document.querySelector('.js-inp').value;
    document.querySelector('.js-inp').setAttribute('value', parseInt(_tm) + 1);
});

document.querySelector('.js-minus').addEventListener('click', (e) => {
    let _tm = document.querySelector('.js-inp').value;
    if(_tm > 1){
        document.querySelector('.js-inp').setAttribute('value', parseInt(_tm) - 1)
    }

});

let _tabs = document.querySelector('.js-tabs-container'), _tabs_top = _tabs.getBoundingClientRect().top + window.pageYOffset - document.body.clientTop;
document.addEventListener('scroll', (e) => {
    if(_tabs_top < tools.getScrollTop()){
        _tabs.classList.add('fixed');
    }else {
        _tabs.classList.remove('fixed');
    }
});
Array.prototype.forEach.call(document.querySelectorAll('.js-tab'), (el, index) => {
    el.addEventListener('click', (e) => {
        if(_tabs.classList.contains('fixed')){
            window.scrollTo(0,_tabs_top);
        }
        Array.prototype.forEach.call(document.querySelectorAll('.js-tab'), (e, ind) => {
            e.classList.remove('chosen');
        });
        el.classList.add('chosen');
        Array.prototype.forEach.call(document.querySelectorAll('.js-con'), (e, ind) => {
            e.classList.remove('chosen');
        });
        document.querySelectorAll('.js-con')[index].classList.add('chosen');
        if(index === 4){
            ajaxGet(shop.discuss_url, shop.pagerSuccess, shop.pagerBefore, shop.pagerError)
        }

    });
});

Array.prototype.forEach.call(document.querySelectorAll('.js-counttime'), (el) => {
    countdown(el.getAttribute('data-timenum'), (time_obj) => {
        common.countSuc(time_obj, el);
    }, (time_obj) => {
        common.countEnd(time_obj, el);
    }, !!el.querySelector('.js-d'));
});

if(document.querySelector('.js-get-link')){
    document.querySelector('.js-get-link').addEventListener('click', (e) => {
        document.querySelector('.js-pop-coupon').classList.add('show');
    });
}

document.querySelector('.js-close').addEventListener('click', (e) => {
    document.querySelector('.js-pop-coupon').classList.remove('show');
});
