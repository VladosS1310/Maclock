/**
 * Copyright © 2019 Studio Raz. All rights reserved.
 * See LICENSE.txt for license details.
 */

define([
    'jquery'
], function ($) {
    'use strict';

    jQuery.migrateMute = true;
    let $body = $('body');
    let $headerRightDesktop = $('.header-right.desktop');
    let $minicartWrapperNotDesktop = $('.header-right').not('.desktop').find('.minicart-wrapper');
    let $blockSearchNotDesktop = $('.header-right').not('.desktop').find('.block-search');

    if ($body.width() >= 1024) {
        if ($minicartWrapperNotDesktop.length !== 0) {
            if ($headerRightDesktop.find('.minicart-wrapper').length !== 0) {
                $headerRightDesktop.find('.minicart-wrapper').html($minicartWrapperNotDesktop.html());
            }
            $minicartWrapperNotDesktop.remove();
        }
        if ($blockSearchNotDesktop.length !== 0) {
            $blockSearchNotDesktop.remove();
        }
    } else {
        if ($headerRightDesktop.find('.minicart-wrapper').length !== 0) {
            $headerRightDesktop.find('.minicart-wrapper').remove();
        }
        if ($headerRightDesktop.find('.block-search').length !== 0) {
            $headerRightDesktop.find('.block-search').remove();
        }
    }
    $(window).resize(function() {
        let $headerRightDesktop = $('.header-right.desktop');
        let $minicartWrapper = $('.header-right > .minicart-wrapper');
        let $blockSearch = $('.header-right > .block-search');

        if ($(this).width() >= 1024) {
            // Ensure block-search and minicart-wrapper are in desktop header
            if ($headerRightDesktop.find('.block-search').length === 0) {
                $headerRightDesktop.prepend($blockSearch);
            }
            if ($headerRightDesktop.find('.minicart-wrapper').length === 0) {
                $headerRightDesktop.prepend($minicartWrapper);
            }
        } else {
            // Move minicart-wrapper and block-search to non-desktop header
            $('.header-right').not('.desktop').each(function () {
                let $currentHeader = $(this);
                if ($currentHeader.find('.minicart-wrapper').length === 0) {
                    $minicartWrapper.not('.desktop').appendTo($currentHeader);
                }
                if ($currentHeader.find('.block-search').length === 0) {
                    $blockSearch.not('.desktop').appendTo($currentHeader);
                }
            });
        }
    });

    $('.ub-mega-menu-vertical ul.mega-menu li.has-child').on('click', 'span.menu-parent-icon, a.has-child', function (e) {
        e.preventDefault();

        // Close siblings elements
        $(this).parent().siblings('.has-child').children().removeClass('active');

        // Open/close current element
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings('.menu-parent-icon, .child-content, .menu-group-link').addClass('active');
        } else {
            $(this).removeClass('active').siblings('.menu-parent-icon, .child-content, .menu-group-link').removeClass('active');
        }
    });
});
