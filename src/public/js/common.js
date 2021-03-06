import swp from 'swiper';
import LazyLoad from "vanilla-lazyload";
/* 图片延迟加载 */
const lazy = () => {
    const logEvent = (eventName, element) => {
        console.log(
            eventName,
            element.getAttribute("data-src"),
            element.getAttribute("src")
        );
    };
    const lazyLoadOptions = {
        elements_selector: ".lazy",
        to_webp: false,
        callback_enter: element => {
            logEvent("ENTERED", element);
        },
        callback_load: element => {
            logEvent("LOADED", element);
        },
        callback_set: element => {
            logEvent("SET", element);
        },
        callback_error: element => {
            logEvent("ERROR", element);
            element.src = "https://placehold.it/220x280?text=Placeholder";
        }
    };
    document.addEventListener("DOMContentLoaded", new LazyLoad(lazyLoadOptions));
};
/* banner滚动 */
const swip = (name, autoplay, loop, slidesPerView, lazy, effect, fadeEffect, navigation, pagination, on, noSwiping) => {
    new swp('.' + name, {
        autoplay: autoplay,
        loop : loop,
        slidesPerView: slidesPerView,
        lazy: lazy,
        effect: effect,
        fadeEffect: fadeEffect,
        navigation: navigation,
        pagination: pagination,
        on:on,
        noSwiping: noSwiping || false,

    });
};
/* 倒计时ui层 */
const common = {
    countSuc: (time_obj, el) => {
        if(el.querySelector('.js-d')){
            el.querySelector('.js-d').innerHTML = time_obj.day;
        }
        el.querySelector('.js-h').innerHTML = time_obj.hour;
        el.querySelector('.js-m').innerHTML = time_obj.min;
        el.querySelector('.js-s').innerHTML = time_obj.sec;
    },
    countEnd: (time_obj, el) => {
        console.log('end')
    }
};
/* 倒计时 */
const countdown = (timestamp, succ, end, hasDay) => {
    let time_obj = {}, _initTime = new Date().getTime();
    let timer = setInterval(() => {
        let nowTime = new Date();
        let endTime = new Date(timestamp * 1000 + _initTime);
        let t = endTime.getTime() - nowTime.getTime();
        if(t > 0){
            let day = Math.floor(t/86400000);
            let hour=Math.floor((t/3600000)%24);
            let min=Math.floor((t/60000)%60);
            let sec=Math.floor((t/1000)%60);
            if(hasDay){
                day = day < 10 ? '0' + day : day;
            }else {
                hour = hour + day * 24;
            }
            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            sec = sec < 10 ? '0' + sec : sec;
            // format =  `${day}天${hour}小时${min}分${sec}秒`;
            time_obj.day = day;
            time_obj.hour = hour;
            time_obj.min = min;
            time_obj.sec = sec;
            if(succ){
                succ(time_obj);
            }
        }else{
            clearInterval(timer);
            if(end){
                end(time_obj);
            }
        }
    },1000);
};
/* 弹窗提示ui */
const tips = () => {
    let pop_html = '<div class="js-tips-pop tips-pop hidden"><div class="text js-text"></div></div><div class="js-tips-bg tips-bg hidden"></div>';
    if(!document.querySelector('#tipsPop')){
        let _div = document.createElement("div");
        _div.setAttribute("id", "tipsPop");
        _div.innerHTML = pop_html;
        document.body.appendChild(_div);
    }
};
/* 弹出提示窗 */
const showPop = (msg) => {
    let _el = document.querySelector('.js-tips-pop');
    let _tips_bg = document.querySelector('.js-tips-bg');
    _el.querySelector('.js-text').innerHTML = msg;
    _el.classList.remove('hidden');
    _tips_bg.classList.remove('hidden');
};
/* 关闭提示窗 */
const hidePop = () => {
    let _el = document.querySelector('.js-tips-pop');
    let _tips_bg = document.querySelector('.js-tips-bg');
    _el.classList.add('hidden');
    _tips_bg.classList.add('hidden');
};
/* 放大镜效果 */
const ImageZoom = (container, opts) => {
    var options = JSON.parse(JSON.stringify(opts));
    if (!container) {
        return;
    }
    var data = {
        sourceImg: {
            element: null,
            width: 0,
            height: 0,
            naturalWidth: 0,
            naturalHeight: 0
        },
        zoomedImgOffset: {
            vertical: 0,
            horizontal: 0
        },
        zoomedImg: {
            element: null,
            width: 0,
            height: 0
        },
        zoomLens: {
            element: null,
            width: 0,
            height: 0
        }
    };

    var div = document.createElement('div');
    var lensDiv = document.createElement('div');
    var scaleX;
    var scaleY;
    var offset;
    data.zoomedImgOffset = options.offset || {vertical: 0, horizontal: 0};

    function getOffset(el) {
        if (el) {
            var elRect = el.getBoundingClientRect();
            return {left: elRect.left, top: elRect.top};
        }
        return {left: 0, top: 0};
    }

    function leftLimit(min) {
        return options.width - min;
    }

    function topLimit(min) {
        return options.height - min;
    }

    function getValue(val, min, max) {
        if (val < min) {
            return min;
        }
        if (val > max) {
            return max;
        }
        return val;
    }

    function getPosition(v, min, max) {
        var value = getValue(v, min, max);
        return value - min;
    }

    function zoomLensLeft(left) {
        var leftMin = data.zoomLens.width / 2;
        return getPosition(left, leftMin, leftLimit(leftMin));
    }

    function zoomLensTop(top) {
        var topMin = data.zoomLens.height / 2;
        return getPosition(top, topMin, topLimit(topMin));
    }

    function setZoomedImgSize(options, data) {
        if (options.scale) {
            data.zoomedImg.element.style.width = options.width * options.scale + 'px';
            data.zoomedImg.element.style.height = options.height * options.scale + 'px';
        } else {
            data.zoomedImg.element.style.width = options.zoomWidth + 'px';
            data.zoomedImg.element.style.height = data.sourceImg.element.style.height;
        }
    }

    function onSourceImgLoad() {
        // use height, determined by browser if height is not set in options
        options.height = options.height || data.sourceImg.element.height;
        data.sourceImg.element.style.height = options.height + 'px';

        setZoomedImgSize(options, data);

        data.sourceImg.naturalWidth = data.sourceImg.element.naturalWidth;
        data.sourceImg.naturalHeight = data.sourceImg.element.naturalHeight;
        data.zoomedImg.element.style.backgroundSize = data.sourceImg.naturalWidth + 'px ' + data.sourceImg.naturalHeight + 'px';
        if (options.zoomStyle) {
            data.zoomedImg.element.style.cssText +=  options.zoomStyle;
        }
        if (options.zoomLensStyle) {
            data.zoomLens.element.style.cssText +=  options.zoomLensStyle;
        } else {
            data.zoomLens.element.style.background = 'white';
            data.zoomLens.element.style.opacity = 0.4;
        }
        scaleX = data.sourceImg.naturalWidth / options.width;
        scaleY = data.sourceImg.naturalHeight / options.height;
        offset = getOffset(data.sourceImg.element);
        if (options.scale) {
            data.zoomLens.width = options.width / (data.sourceImg.naturalWidth / (options.width * options.scale));
            data.zoomLens.height = options.height / (data.sourceImg.naturalHeight / (options.height * options.scale));
        } else {
            data.zoomLens.width = options.zoomWidth / scaleX;
            data.zoomLens.height = options.height / scaleY;
        }
        data.zoomLens.element.style.position = 'absolute';
        data.zoomLens.element.style.width = data.zoomLens.width + 'px';
        data.zoomLens.element.style.height = data.zoomLens.height + 'px';
        data.zoomLens.element.pointerEvents = 'none';
    };

    function setup() {
        if (options.img) {
            var img = document.createElement('img');
            img.src = options.img;
            data.sourceImg.element = container.appendChild(img);
        } else {
            data.sourceImg.element = container.children[0];
        }
        data.sourceImg.element.onload = onSourceImgLoad;
        options = options || {};
        container.style.position = 'relative';
        data.sourceImg.element.style.width = options.width + 'px' || 'auto';
        data.sourceImg.element.style.height = options.height ? options.height + 'px' : 'auto';

        data.zoomLens.element = container.appendChild(lensDiv);
        data.zoomLens.element.style.display = 'none';
        data.zoomedImg.element = container.appendChild(div);

        data.zoomedImg.element.style.position = 'absolute';
        data.zoomedImg.element.style.top = data.zoomedImgOffset.vertical + 'px';
        data.zoomedImg.element.style.left = options.width + data.zoomedImgOffset.horizontal + 'px';
        data.zoomedImg.element.style.backgroundImage = 'url(' + data.sourceImg.element.src + ')';
        data.zoomedImg.element.style.backgroundRepeat = 'no-repeat';
        data.zoomedImg.element.style.display = 'none';
        container.addEventListener('mousemove', events, false);
        container.addEventListener('mouseenter', events, false);
        container.addEventListener('mouseleave', events, false);
        data.zoomLens.element.addEventListener('mouseenter', events, false);
        data.zoomLens.element.addEventListener('mouseleave', events, false);
        window.addEventListener('scroll', events, false);
        return data;
    }

    function kill() {
        container.removeEventListener('mousemove', events, false);
        container.removeEventListener('mouseenter', events, false);
        container.removeEventListener('mouseleave', events, false);
        data.zoomLens.element.removeEventListener('mouseenter', events, false);
        data.zoomLens.element.removeEventListener('mouseleave', events, false);
        window.removeEventListener('scroll', events, false);
        if (data.zoomLens && data.zoomedImg) {
            container.removeChild(data.zoomLens.element);
            container.removeChild(data.zoomedImg.element);
        }
        if (options.img) {
            container.removeChild(data.sourceImg.element);
        }
        return data;
    }

    var events = {
        handleEvent: function(event) {
            switch(event.type) {
                case 'mousemove': return this.handleMouseMove(event);
                case 'mouseenter': return this.handleMouseEnter(event);
                case 'mouseleave': return this.handleMouseLeave(event);
                case 'scroll': return this.handleScroll(event);
            }
        },
        handleMouseMove: function(event) {
            var offsetX;
            var offsetY;
            var backgroundTop;
            var backgroundRight;
            var backgroundPosition;
            if (offset) {
                offsetX = zoomLensLeft(event.clientX - offset.left);
                offsetY = zoomLensTop(event.clientY - offset.top);
                backgroundTop = offsetX * scaleX;
                backgroundRight = offsetY * scaleY;
                backgroundPosition = '-' + backgroundTop + 'px ' +  '-' + backgroundRight + 'px';
                data.zoomedImg.element.style.backgroundPosition = backgroundPosition;
                data.zoomedImg.element.style.cssText += 'z-index:3;';
                data.zoomLens.element.style.cssText += 'top:' + offsetY + 'px;' + 'left:' + offsetX + 'px;display: block;';

            }
        },
        handleMouseEnter: function() {
            data.zoomedImg.element.style.display  = 'block';
            data.zoomLens.element.style.display = 'block';

        },
        handleMouseLeave: function() {
            data.zoomedImg.element.style.display  = 'none';
            data.zoomLens.element.style.display = 'none';
        },
        handleScroll: function() {
            offset = getOffset(data.sourceImg.element);
        }
    };
    setup();

    return {
        setup: function() {
            setup();
        },
        kill: function() {
            kill();
        },
        _getInstanceInfo: function() {
            return {
                setup: setup,
                kill: kill,
                onSourceImgLoad: onSourceImgLoad,
                data: data,
                options: options
            }
        }
    }
};
/* 弹窗提示ui */
const tools = {
    getScrollTop: function () {     //滚动条在Y轴上的滚动距离
        var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        if(document.body){
            bodyScrollTop = document.body.scrollTop;
        }
        if(document.documentElement){
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    },
    getScrollHeight: function () {    //文档的总高度
        var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
        if(document.body){
            bodyScrollHeight = document.body.scrollHeight;
        }
        if(document.documentElement){
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    },
    getWindowHeight: function () {      //浏览器视口的高度
        var windowHeight = 0;
        if(document.compatMode == 'CSS1Compat'){
            windowHeight = document.documentElement.clientHeight;
        }else{
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    },
    animate: function (element, target, duration = 400, mode = 'ease-out', callback) {
        clearInterval(element.timer);

        //判断不同参数的情况
        if (duration instanceof Function) {
            callback = duration;
            duration = 400;
        }else if(duration instanceof String){
            mode = duration;
            duration = 400;
        }

        //判断不同参数的情况
        if (mode instanceof Function) {
            callback = mode;
            mode = 'ease-out';
        }

        //获取dom样式
        var attrStyle = function(attr){
            if (attr === 'opacity') {
                return Math.round(tools.getStyle(element, attr, 'float') * 100);
            } else {
                return tools.getStyle(element, attr);
            }
        }
        //根字体大小，需要从此将 rem 改成 px 进行运算
        var rootSize = parseFloat(document.documentElement.style.fontSize);

        var unit = {};
        var initState = {};

        //获取目标属性单位和初始样式值
        Object.keys(target).forEach(attr => {
            if (/[^\d^\.]+/gi.test(target[attr])) {
                unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
            }else{
                unit[attr] = 'px';
            }
            initState[attr] = attrStyle(attr);
        });

        //去掉传入的后缀单位
        Object.keys(target).forEach(attr => {
            if (unit[attr] == 'rem') {
                target[attr] = Math.ceil(parseInt(target[attr])*rootSize);
            }else{
                target[attr] = parseInt(target[attr]);
            }
        });


        var flag = true; //假设所有运动到达终点
        var remberSpeed = {};//记录上一个速度值,在ease-in模式下需要用到
        element.timer = setInterval(() => {
            Object.keys(target).forEach(attr => {
                var iSpeed = 0;  //步长
                var status = false; //是否仍需运动
                var iCurrent = attrStyle(attr) || 0; //当前元素属性址
                var speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
                var intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
                switch(mode){
                    case 'ease-out':
                        speedBase = iCurrent;
                        intervalTime = duration*5/400;
                        break;
                    case 'linear':
                        speedBase = initState[attr];
                        intervalTime = duration*20/400;
                        break;
                    case 'ease-in':
                        var oldspeed = remberSpeed[attr] || 0;
                        iSpeed = oldspeed + (target[attr] - initState[attr])/duration;
                        remberSpeed[attr] = iSpeed
                        break;
                    default:
                        speedBase = iCurrent;
                        intervalTime = duration*5/400;
                }
                if (mode !== 'ease-in') {
                    iSpeed = (target[attr] - speedBase) / intervalTime;
                    iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                }
                //判断是否达步长之内的误差距离，如果到达说明到达目标点
                switch(mode){
                    case 'ease-out':
                        status = iCurrent != target[attr];
                        break;
                    case 'linear':
                        status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                        break;
                    case 'ease-in':
                        status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                        break;
                    default:
                        status = iCurrent != target[attr];
                }

                if (status) {
                    flag = false;
                    //opacity 和 scrollTop 需要特殊处理
                    if (attr === 'opacity') {
                        element.style.filter = 'alpha(opacity:' + (iCurrent + iSpeed) + ')';
                        element.style.opacity = (iCurrent + iSpeed) / 100;
                    } else if (attr === 'scrollTop') {
                        element.documentElement.scrollTop = iCurrent + iSpeed;
                        element.body.scrollTop = iCurrent + iSpeed;
                    }else{
                        element.style[attr] = iCurrent + iSpeed + 'px';
                    }
                } else {
                    flag = true;
                }

                if (flag) {
                    clearInterval(element.timer);
                    if (callback) {
                        callback();
                    }
                }
            })
        }, 20);
    },
    getStyle: function(element, attr, NumberMode = 'int'){
        var target;
        // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
        if (attr === 'scrollTop') {
            target = element.documentElement.scrollTop || element.body.scrollTop;
            // target = element.scrollTop;
        }else if(element.currentStyle){
            target = element.currentStyle[attr];
        }else{
            target = document.defaultView.getComputedStyle(element,null)[attr];
        }
        //在获取 opactiy 时需要获取小数 parseFloat
        return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
    },
};
export {tips, showPop, hidePop, countdown, swip, common, ImageZoom, lazy, tools};

const chainAsync = fns => { let curr = 0; const next = () => fns[curr++](next); next(); };
/*
chainAsync([
  next => { console.log('0 seconds'); setTimeout(next, 1000); },
  next => { console.log('1 second');  setTimeout(next, 1000); },
  next => { console.log('2 seconds'); }
])
*/

const curry = (fn, arity = fn.length, ...args) =>
    arity <= args.length
        ? fn(...args)
        : curry.bind(null, fn, arity, ...args);
// curry(Math.pow)(2)(10) -> 1024
// curry(Math.min, 3)(10)(50)(2) -> 2

const pipe = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));

const promisify = func =>
    (...args) =>
        new Promise((resolve, reject) =>
            func(...args, (err, result) =>
                err ? reject(err) : resolve(result))
        );
// const delay = promisify((d, cb) => setTimeout(cb, d))
// delay(2000).then(() => console.log('Hi!')) -> Promise resolves after 2s

const series = ps => ps.reduce((p, next) => p.then(next), Promise.resolve());
// const delay = (d) => new Promise(r => setTimeout(r, d))
// series([() => delay(1000), () => delay(2000)]) -> executes each promise sequentially, taking a total of 3 seconds to complete

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
/*
async function sleepyWork() {
  console.log('I\'m going to sleep for 1 second.');
  await sleep(1000);
  console.log('I woke up after 1 second.');
}
*/