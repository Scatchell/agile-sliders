'use strict';

describe('Sliders', () => {
    beforeEach(() => {
        setFixtures(
            "<div id=\"fixture\">\n" +
            "   <div class=\"column\">" +
            "       <input id=\"slider-1\" class=\"slider has-output is-fullwidth is-large\" min=\"0\" max=\"20\"\n" +
            "              value=\"0\" step=\"10\" type=\"range\">\n" +
            "       <div class=\"suggested-position\"></div>\n" +
            "   </div>" +
            "   <div class=\"column\">" +
            "       <input id=\"slider-2\" class=\"slider has-output is-fullwidth is-large\" min=\"0\" max=\"20\"\n" +
            "              value=\"10\" step=\"10\" type=\"range\">\n" +
            "       <div class=\"suggested-position\"></div>\n" +
            "   </div>" +
            "   <div class=\"column\">" +
            "       <input id=\"slider-3\" class=\"slider has-output is-fullwidth is-large\" min=\"0\" max=\"20\"\n" +
            "              value=\"20\" step=\"10\" type=\"range\">\n" +
            "       <div class=\"suggested-position\"></div>\n" +
            "   </div>" +
            "   <button class=\"button\" id=\"save-output-session\" type=\"submit\">Save Output Session Results</button>" +
            "   <button class=\"button\" id=\"save-session\" type=\"submit\">Save Session Results</button>" +
            "</div>\n")

        let $slider1 = $('#slider-1');
        let $slider2 = $('#slider-2');
        let $slider3 = $('#slider-3');

        new Sliders($('input.slider')).attach();
        $slider1.val("10");
        $slider1.trigger('change');

        $slider2.val("10");
        $slider2.trigger('change');

        $slider3.val("10");
        $slider3.trigger('change');
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

        it('all unaltered sliders even if they cannot be moved to equalize', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("20");
            $slider1.trigger('change');
            $slider2.val("20");
            $slider2.trigger('change');
            $slider3.val("20");
            $slider3.trigger('change');

            expect($slider1).toHaveClass('is-danger');
            expect($slider2).toHaveClass('is-danger');
            expect($slider3).not.toHaveClass('is-danger');
        });
    });

    describe(' - slider values - ', () => {
        it('suggest "add" value of sliders if one slider is changed', () => {
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

        it('suggest "subtract" value of sliders if one slider is changed', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("20");
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

        it('should only suggest adding if possible within slider', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("0");
            $slider1.trigger('change');

            $slider2.val("0");
            $slider2.trigger('change');

            let $slider3SuggestedPos = $slider3.parent().find('.suggested-position');
            expect($slider3SuggestedPos).toContainText('Add 1');
        });

        it('should suggest addition correctly even if slider is moved multiple times', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("0");
            $slider1.trigger('change');

            $slider2.val("20");
            $slider2.trigger('change');

            $slider2.val("10");
            $slider2.trigger('change');

            let $slider1SuggestedPos = $slider1.parent().find('.suggested-position');
            expect($slider1SuggestedPos).toContainText('Add 1');

            let $slider2SuggestedPos = $slider2.parent().find('.suggested-position');
            expect($slider2SuggestedPos).not.toContainText('Add');

            let $slider3SuggestedPos = $slider3.parent().find('.suggested-position');
            expect($slider3SuggestedPos).toContainText('Add 1');
        });

        it('should suggest subtraction correctly even if slider is moved multiple times', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("20");
            $slider1.trigger('change');

            $slider2.val("0");
            $slider2.trigger('change');

            $slider2.val("10");
            $slider2.trigger('change');

            let $slider1SuggestedPos = $slider1.parent().find('.suggested-position');
            expect($slider1SuggestedPos).toContainText('Lower 1');

            let $slider2SuggestedPos = $slider2.parent().find('.suggested-position');
            expect($slider2SuggestedPos).not.toContainText('Lower');

            let $slider3SuggestedPos = $slider3.parent().find('.suggested-position');
            expect($slider3SuggestedPos).toContainText('Lower 1');
        });

        it('should highlight all other sliders if last slider does not make all equal', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider2.val("20");
            $slider2.trigger('change');

            $slider3.val("20");
            $slider3.trigger('change');

            $slider1.val("0");
            $slider1.trigger('change');

            let $slider1SuggestedPos = $slider1.parent().find('.suggested-position');
            expect($slider1SuggestedPos).not.toContainText('Lower 1');
            expect($slider1SuggestedPos).not.toHaveClass('danger');

            let $slider2SuggestedPos = $slider2.parent().find('.suggested-position');
            expect($slider2SuggestedPos).toContainText('Lower 1');

            let $slider3SuggestedPos = $slider3.parent().find('.suggested-position');
            expect($slider3SuggestedPos).toContainText('Lower 1');
        });

        it('should not highlight other slider if it cannot be moved required distance', () => {
            let $slider1 = $('#slider-1');
            let $slider2 = $('#slider-2');
            let $slider3 = $('#slider-3');

            $slider1.val("0");
            $slider1.trigger('change');

            $slider2.val("10");
            $slider2.trigger('change');

            $slider3.val("20");
            $slider3.trigger('change');

            $slider2.val("0");
            $slider2.trigger('change');

            let $slider3SuggestedPos = $slider3.parent().find('.suggested-position');
            expect($slider3SuggestedPos).not.toContainText('Add');
        });
    });

    it('should make save session button clickable when sliders equal', () => {
        let $slider1 = $('#slider-1');

        $slider1.val("20");
        $slider1.trigger('change');

        let $saveSessionButton = $("#save-session");
        let $saveOutputSessionButton = $("#save-output-session");

        expect($saveSessionButton).toBeDisabled();
        expect($saveOutputSessionButton).toBeDisabled();

        $slider1.val("10");
        $slider1.trigger('change');

        expect($saveSessionButton).not.toBeDisabled();
        expect($saveOutputSessionButton).not.toBeDisabled();
    });
});