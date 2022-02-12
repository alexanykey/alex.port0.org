function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
    obj.style.width = obj.contentWindow.document.documentElement.scrollwidth + 'px';
}

function ajaxer(url, callback) {
    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function () {
        if (200 === req.status) {
            callback(req.responseText);
        } else {
            callback('<div class="ajaxerror">Помилка завантаження</div>');
        }
    };
    req.send();
}

Element.prototype.ajaxloader = function (url, element = '', callback) {
    ajaxer(url, (response) => {
        let y = document.createElement('div');
        y.innerHTML = response;

        if (y.querySelector(element)) {
            this.innerHTML = (element) ? y.querySelector(element).innerHTML : response;
            callback();
            response = new DOMParser().parseFromString(response, "text/html");
            top.document.title = response.title;
        } else {
            location = url;
            return false;
        }
    });
}

function findParentLink(o) {
    return findParentLink(o.parent);
}
addEventListener('DOMContentLoaded', e => {

    document.body.addEventListener('click', e => {
        const animatioDuration = 30; // milliseconds per frame
        let link = (e.target.tagName.match(/a/i)) ? e.target : e.target.parentNode;
        if (link.tagName.match(/a/i)) {
            if (link.href.match(/(alex\.port|alexanykey|127\.0\.0)/)) {
                if (!(link.href.match(/\.\w+$/) && !link.href.match(/\.html?$/))) {
                    let content = top.document.querySelector('CONTENT');
                    if (content) {
                        e.preventDefault();
                        let op = 1, hidden = 0, fo = setInterval(() => {
                            op -= .1;
                            content.style.opacity = op;
                            if (0 >= op) {
                                clearInterval(fo);
                                content.insertAdjacentHTML('beforebegin','<div class="loader"></div>');
                                hidden = 1;
                                content.ajaxloader(link.href, 'CONTENT', () => {
                                    top.history.pushState("page:" + top.document.title, top.document.title, link.href);
                                    let fi = setInterval(() => {
                                        if (1 == hidden) {
                                            op += .1;
                                            content.style.opacity = op;
                                            if (1 <= op) {
                                                top.document.querySelector('.loader').remove();
                                                clearInterval(fi);
                                            }
                                        }
                                    }, animatioDuration);
                                });
                            }
                        }, animatioDuration);


                    }
                }
            } else {
                link.target = '_blank';
            }

        }

    });


});

