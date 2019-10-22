var Util = {
    randomInteger: function(min, max) {
        var rand = min + Math.random() * (max - min)
        rand = Math.round(rand);
        return rand;
    },
    scrollToEl: function(el, target) {
        target.animate({ scrollTop: el.offset().top  }, 500);
    },
    trimString: function(string) {
        return string.split(' ').join('');
    }
}

var App = {
    init: function(op) {
        var _t = this;

        _t['variantPicker'] = $('.choice__group-variant');
        _t['state'] = op;

        _t['searchBtn'] = $('.js-search');

        _t._updateChoice();

        _t.variantPicker.on('click', function(event) {
            var vatinatType = $(event.target).closest('.choice__group').attr('data-option-type'),
                vatinatValue = $(event.target).attr('data-variant-value');
            _t.state[vatinatType] = vatinatValue;
            _t._updateChoice();
        });

        _t.searchBtn.on('click', function(event) {
            event.preventDefault();
            $('.app__choice').hide();
            $('.page').addClass('results-has-shown')
            $('.app__result').show();
            setTimeout(function() {
                _t._showResults();
            }, 1000)
        });

        _t._getGeo();

        $(document).on('geolocation', function(event) {
            $('.js-geo').text(event.city)
        });
    },
    _updateChoice: function() {
        var _t = this;
        for (type in _t.state) {
            var typeGroup = $('.choice__group[data-option-type="' + type + '"]');
            typeGroup.find('.choice__group-current').text(_t.state[type]);
            typeGroup.find('[data-variant-value="' + _t.state[type] + '"]').addClass('active').siblings().removeClass('active');

            var resultGroup = $('.result__choice'),
                resultItem = resultGroup.find('[data-option-type="' + type + '"]');

            if (type === "hair") {
                resultItem.css('background-image', 'url(img/' + _t.state[type] + '.jpg)');
            } else {
                resultItem.html(_t.state[type]);
            }
        }
        _t._cangeImage();
    },
    _cangeImage: function() {
        var _t = this;

        _t['imageUrlChoice'] = "img/choice/" + _t.state['hair'] + "-" + _t.state['chest'] + "-" + _t.state['ass'] + ".png";
        _t['imageUrlResult'] = "img/result/brunette-l-l.jpg";

        var previewCurrent = $('.choice__preview-current'),
            previewNext = $('.choice__preview-next');

        previewNext.css('background-image', 'url(' + _t.imageUrlChoice + ')');
        previewNext.fadeIn(400, function() {
            previewCurrent.css('background-image', 'url(' + _t.imageUrlChoice + ')');
            previewCurrent.fadeIn(400, function() {
                previewNext.fadeOut(400);
            });
        });
    },
    _getGeo: function() {
        $.get('http://ip-api.com/json/', function(data) {
            $(document).trigger({
                type: "geolocation",
                city: data.city
            })
        })
    },
    _showResults: function() {
        var _t = this;

        $('.statistics__list').fadeIn();
        var statItems = $('.statistics__item'),
            endTimeOut = 0;

        statItems.each(function(index, el) {
            var count = $(el).find('b').text();

            endTimeOut = index * 500;
            setTimeout(function() {
                $(el).fadeIn(200);
                _t._animateValue($(el).find('b'), 0, count, 200)
            }, endTimeOut)
        });

        setTimeout(function() {
            $('.statistics__result').fadeIn(400);
            Util.scrollToEl($('.statistics__result'), $('.page'));
            $('.statistics__status').addClass('success');
            $('.statistics__btn').addClass('show');
            $('.profile__ava--1').css('background-image', 'url(' + _t.imageUrlResult + ')');
            $('.profile').addClass('stop');
        }, endTimeOut + 400)
    },
    _animateValue: function(el, start, end, duration) {
        var range = end - start;
        var current = start;
        var increment = end > start ? 1 : -1;
        var stepTime = Math.abs(Math.floor(duration / range));
        var obj = $(el);
        var timer = setInterval(function() {
            current += increment;
            obj.text(current);
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
}

$(function() {
    App.init({
        'hair': 'red',
        'chest': 'l',
        'ass': 's'
    })
});