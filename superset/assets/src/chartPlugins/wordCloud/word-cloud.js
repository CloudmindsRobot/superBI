
    var INTERVAL_TRANSFORM_TIMER;

    var DEFAULT_OPTION = {
        radius: 120, // 滚动半径，单位px
        maxFont: 24, // 最大字体大小
        color: null, // 字体颜色。为空时随机
        rotateAngleXbase: 600, // 默认旋转速度基数，数越小速度越快
        rotateAngleYbase: 600,
        hover: true, // 是否开启悬浮联动
        minFont: 12
    }

    function hasown(obj, key) {
        return obj.hasOwnProperty(key)
    }


    function initMouseEvents() {

    }

    function calculateFontSize(minVal, option) {
        return function (val) {
            const fontSize = (val / minVal) * option.minFont;
            return fontSize < option.maxFont ? fontSize : option.maxFont;
        }
    }

    function renderList(parentNode, data, templateFunc) {
        var html = "";
        for (let i = 0; i < data.length; i++) {
            html += templateFunc(data[i], i);
        }

        parentNode.innerHTML = html;
    }

    function getMinVal(data) {
        var minVal = Infinity;
        for (var i = 0; i < data.length; i++) {
            if (minVal > data[i].count) {
                minVal = data[i].count;
            }
        }

        return minVal;
    }

    function initPositions(wc, data) {
        var children = wc.el.children;
        var minVal = getMinVal(data);
        var calc = calculateFontSize(minVal, wc.option);
        for (let i = 0, length = data.length; i < length; i++) {
            // 获取球面上均匀的点的经纬度 θ = arccos( ((2*num)-1)/all - 1); Φ = θ*sqrt(all * π);
            const angleX = Math.acos((2 * (i + 1) - 1) / length - 1);
            const angleY = angleX * Math.sqrt(length * Math.PI);
            // 根据经纬度获取点的坐标，球中心的点坐标是 (0,0,0) x=r*sinθ*cosΦ   y=r*sinθ*sinΦ   z=r*cosθ;
            const x =
                wc.option.radius * Math.sin(angleX) * Math.cos(angleY);
            const y =
                wc.option.radius * Math.sin(angleX) * Math.sin(angleY);
            const z = wc.option.radius * Math.cos(angleX);
            if (wc.option.color) {
                children[i].style.color = wc.option.color;
            } else {
                // 随机颜色
                children[i].style.color =
                    "rgb(" +
                    Math.round(255 * Math.random()) +
                    "," +
                    Math.round(255 * Math.random()) +
                    "," +
                    Math.round(255 * Math.random()) +
                    ")";
            }
            // 每个标签对象都有四对值
            const tagElm = children[i];
            tagElm.style.fontSize = calc(data[i].count) + "px";
            const tag = {
                x: x,
                y: y,
                z: z,
                ele: tagElm
            };
            wc.tagList.push(tag);
            startAnimation(wc);
        }
    }

    function startAnimation(wc) {
        clearInterval(INTERVAL_TRANSFORM_TIMER);
        INTERVAL_TRANSFORM_TIMER = setInterval(function () {
            updateFrame(wc);
        }, 16);
    }

    function updateFrame(wc) {
        for (var i = 0; i < wc.tagList.length; i++) {
            var item = wc.tagList[i];
            rotateX(wc, item);
            rotateY(wc, item);
            setPosition(wc, item, wc.option.radius);
        }
    }

    function rotateX(wc, tag) {
        var cos = Math.cos(wc.rotateAngleX);
        var sin = Math.sin(wc.rotateAngleX);
        var y1 = tag.y * cos - tag.z * sin;
        var z1 = tag.y * sin + tag.z * cos;
        tag.y = y1;
        tag.z = z1;
    }

    function rotateY(wc, tag) {
        var cos = Math.cos(wc.rotateAngleY);
        var sin = Math.sin(wc.rotateAngleY);
        var x1 = tag.z * sin + tag.x * cos;
        var z1 = tag.z * cos - tag.x * sin;
        tag.x = x1;
        tag.z = z1;
    }

    function setPosition(wc, tag, r) {
        // 设置每个标签的坐标位置和字体大小以及透明度
        if (wc.el) {
            tag.ele.style.transform =
                "translate(" +
                (tag.x +
                    wc.el.offsetWidth / 2 -
                    tag.ele.offsetWidth / 2) +
                "px," +
                (tag.y +
                    wc.el.offsetHeight / 2 -
                    tag.ele.offsetHeight / 2) +
                "px)";
            tag.ele.style.opacity = tag.z / r / 2 + 0.7;
        }
    }

    function initEl(wrapper) {
        var html = '<div class="tag-cloud" ref="wrapper"></div>'
        wrapper.innerHTML = html;
        return wrapper.firstChild;
    }

    function WordCloud(selectorOrElement, option) {
        if (!selectorOrElement) {
            return;
        }
        var wrapper
        if(selectorOrElement.nodeType !== undefined) {
            wrapper = selectorOrElement;
        }else {
            wrapper = document.querySelector(selectorOrElement);
        }
        
        // var mergedOption = {};
        // let keys = Object.keys(DEFAULT_OPTION);
        // for (var i = 0; i < keys.length; i++) {
        //     mergedOption[keys[i]] = DEFAULT_OPTION[keys[i]];
        //     if (option && hasown(option, keys[i])) {
        //         mergedOption[keys[i]] = option[keys[i]];
        //     }
        // }

        var el = initEl(wrapper);
        this.el = el;
        this.setOption(option);
        this._init();
    }


    WordCloud.prototype = {
        setOption(option) {
            var mergedOption = {};
            let keys = Object.keys(DEFAULT_OPTION);
            for (var i = 0; i < keys.length; i++) {
                mergedOption[keys[i]] = DEFAULT_OPTION[keys[i]];
                if (option && hasown(option, keys[i])) {
                    mergedOption[keys[i]] = option[keys[i]];
                }
            }
            this.option = mergedOption;
        },
        _init(data) {
            this.rotateAngleX = Math.PI / this.option.rotateAngleXbase;
            this.rotateAngleY = Math.PI / this.option.rotateAngleYbase;
            this.tagList = [];
            // 鼠标悬浮改变转速和方向
            if (this.option.hover) {
                initMouseEvents();
            }
            if (data) {
                renderList(this.el, data, function (item) {
                    return "<p>" + item.name + "</p>"
                });

                initPositions(this, data);
            }
        },
        setData(data) {
            this._init(data);
        },
        startAnimation: startAnimation,
    }


export default WordCloud;