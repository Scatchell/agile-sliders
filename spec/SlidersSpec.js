'use strict';

describe('Sliders', () => {
    beforeEach(() => {
        setFixtures(
            "<div id=\"fixture\">\n" +
            "   <div class=\"column\">" +
            "       <input id=\"slider-1\" class=\"slider has-output is-fullwidth is-large\" min=\"0\" max=\"20\"\n" +
            "              value=\"10\" step=\"10\" type=\"range\">\n" +
            "       <div class=\"suggested-position\"></div>\n" +
            "   </div>" +
            "   <div class=\"column\">" +
            "       <input id=\"slider-2\" class=\"slider has-output is-fullwidth is-large\" min=\"0\" max=\"20\"\n" +
            "              value=\"10\" step=\"10\" type=\"range\">\n" +
            "       <div class=\"suggested-position\"></div>\n" +
            "   </div>" +
            "   <div class=\"column\">" +
            "       <input id=\"slider-3\" class=\"slider has-output is-fullwidth is-large\" min=\"0\" max=\"20\"\n" +
            "              value=\"10\" step=\"10\" type=\"range\">\n" +
            "       <div class=\"suggested-position\"></div>\n" +
            "   </div>" +
            "</div>\n")

        new Sliders().attach();
    });

    describe(' - slider highlighting - highlight', () => {
        it('other sliders when one is changed', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');

            $slider1.val("20");
            $slider1.trigger('change');

            expect($slider1).not.toHaveClass('is-danger');
            expect($slider2).toHaveClass('is-danger');
        });

        it('only other sliders not already changed', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("20");
            $slider1.trigger('change');
            $slider2.val("20");
            $slider2.trigger('change');

            expect($slider1).not.toHaveClass('is-danger');
            expect($slider2).not.toHaveClass('is-danger');
            expect($slider3).toHaveClass('is-danger');
        });

        it('only sliders that have reset since the last time everything was equal', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("0");
            $slider1.trigger('change');
            $slider2.val("20");
            $slider2.trigger('change');
            $slider2.val("10");
            $slider2.trigger('change');

            expect($slider2).not.toHaveClass('is-danger');
            expect($slider1).toHaveClass('is-danger');
            expect($slider3).toHaveClass('is-danger');
        });

        it('NONE of the sliders if they are all equal', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("20");
            $slider1.trigger('change');
            $slider2.val("0");
            $slider2.trigger('change');

            expect($slider1).not.toHaveClass('is-danger');
            expect($slider2).not.toHaveClass('is-danger');
            expect($slider3).not.toHaveClass('is-danger');
        });

        it('last remaining unaltered slider even if changed', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("40");
            $slider1.trigger('change');
            $slider2.val("40");
            $slider2.trigger('change');
            $slider3.val("40");
            $slider3.trigger('change');

            expect($slider1).not.toHaveClass('is-danger');
            expect($slider2).not.toHaveClass('is-danger');
            expect($slider3).toHaveClass('is-danger');
        });

    });

    describe(' - slider values - ', () => {
        it('suggest "add" value of others if one slider is changed', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("0");
            $slider1.trigger('change');

            let $slider1SuggestedPos = $slider1.parent().find('.suggested-position');
            let $slider2SuggestedPos = $slider2.parent().find('.suggested-position');
            let $slider3SuggestedPos = $slider3.parent().find('.suggested-position');
            expect($slider1SuggestedPos).not.toContainText('Add 1');
            expect($slider2SuggestedPos).toContainText('Add 1');
            expect($slider3SuggestedPos).toContainText('Add 1');
        });

        it('suggest "subtract" value of others if one slider is changed', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("60");
            $slider1.trigger('change');

            let $slider1SuggestedPos = $slider1.parent().find('.suggested-position');
            let $slider2SuggestedPos = $slider2.parent().find('.suggested-position');
            let $slider3SuggestedPos = $slider3.parent().find('.suggested-position');
            expect($slider1SuggestedPos).not.toContainText('Lower 1');
            expect($slider2SuggestedPos).toContainText('Lower 1');
            expect($slider3SuggestedPos).toContainText('Lower 1');
        });

        it('should clear all suggestions when sliders made equal', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("20");
            $slider1.trigger('change');

            $slider1.val("10");
            $slider1.trigger('change');

            let $slider1SuggestedPos = $slider1.parent().find('.suggested-position');
            let $slider2SuggestedPos = $slider2.parent().find('.suggested-position');
            let $slider3SuggestedPos = $slider3.parent().find('.suggested-position');
            expect($slider1SuggestedPos).not.toContainText('Lower 1');
            expect($slider2SuggestedPos).not.toContainText('Lower 1');
            expect($slider3SuggestedPos).not.toContainText('Lower 1');
        });
    });
});