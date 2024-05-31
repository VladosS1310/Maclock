/**
 * Copyright © 2019 Studio Raz. All rights reserved.
 * See LICENSE.txt for license details.
 */

define([
    'jquery'
], function ($) {
    'use strict';

    var $gallery = $('[data-gallery-role=gallery-placeholder]');

    if (!$gallery.length) return;

    $gallery.on('gallery:loaded', function () {
        var $fotorama = $gallery.find('[data-gallery-role="gallery"]');
        var api = $('[data-gallery-role="gallery-placeholder"]').data('gallery');

        $(getCounterTemplate(0, 0, 'of')).insertAfter($gallery);

        $fotorama.on('fotorama:ready fotorama:show', function (e, fotorama) {
            $('.fotorama__counter').replaceWith(getCounterTemplate(fotorama.activeIndex + 1, fotorama.size, 'of'));

            setTimeout(() => {
                $('.product-picture-text-wrapper').css("display", "flex");
            }, 600)
        });
        $('.fotorama__thumb__arr--right').on("click", () => {
            api.next();
        })
        $('.fotorama__thumb__arr--left').on("click", () => {
            api.prev();
        })

        document.getElementsByClassName('fotorama__nav')[0].addEventListener('mousedown', function handler() {
            this.removeEventListener('mousedown', handler);
        });

        const galleryContainer = document.getElementsByClassName('fotorama__nav__shaft')[0];
        const galleryContainerMain = document.getElementsByClassName('fotorama__nav')[0];
        const galleryItems = document.getElementsByClassName('fotorama__nav__frame');
        const maxHeight = Array.from(galleryItems).reduce((acc, item) => acc += item.offsetHeight, 0) - galleryContainerMain.clientHeight;
        galleryContainer.onmousedown = function(event) {
            let shiftY = event.pageY - galleryContainer.getBoundingClientRect().top;
            moveAt(event.pageY);

            function moveAt(pageY) {
                const shift = pageY - shiftY - galleryContainerMain.getBoundingClientRect().top;
                const point = shift > 0 ? 0 : Math.min(Math.abs(maxHeight), Math.abs(shift));
                galleryContainer.style = `transform:translate3d(0,${-point}px,0)`;
            }

            function onMouseMove(event) {
                if($(galleryContainer).length) {
                    moveAt(event.pageY);
                    return;
                }
                clearInternalBinds();
            }

            document.addEventListener('mousemove', onMouseMove);

            galleryContainer.onmouseup = () => clearInternalBinds();

            function clearInternalBinds() {
                document.removeEventListener('mousemove', onMouseMove);
                galleryContainer.onmouseup = null;
            }
        };

        galleryContainer.ondragstart = function() {
            return false;
        };

        if ($(".fotorama__thumb__arr--right").length) {
            $(".fotorama__thumb__arr--right").insertAfter($(".fotorama"));
        }

        if ($(".fotorama__thumb__arr--left").length) {
            $(".fotorama__thumb__arr--left").insertAfter($(".fotorama"));
        }

        $(window).resize(function () {
            if ($(".fotorama__nav").height() > $(".fotorama__nav__shaft").height()) {
                let retreat = $(".fotorama__nav").height() - $(".fotorama__nav__shaft").height() - 30;
                $(".fotorama__thumb__arr--right").css("bottom", `${retreat}px`);
            } else {
                $(".fotorama__thumb__arr--right").css("bottom", "-30px");
            }
        }).resize();

        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    if ($(".fotorama__nav").height() > $(".fotorama__nav__shaft").height()) {
                        let retreat = $(".fotorama__nav").height() - $(".fotorama__nav__shaft").height() - 30;
                        $(".fotorama__thumb__arr--right").css("bottom", `${retreat}px`);
                    } else {
                        $(".fotorama__thumb__arr--right").css("bottom", "-30px");
                    }
                }
            });
        });

        let config = { childList: true, subtree: true };

        observer.observe(galleryContainerMain, config);

        // Зупиняємо спостереження за мутаціями при необхідності (пізніше)
        // observer.disconnect();
    });

    function getCounterTemplate(currentItem, itemsTotal, text) {
        return '<span class="fotorama__counter"><span class="fotorama__counter-active"> ' + currentItem + ' </span><span class="fotorama__counter-text"> ' + $.mage.__(text) + ' </span><span class="fotorama__counter-size"> ' + itemsTotal+ ' </span></span>';
    }
});
