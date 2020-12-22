'use strict';

describe('Slider', () => {
    beforeEach(() => {
        setFixtures(
            "<div id=\"fixture\">\n" +
            "   <div class=\"column\">" +
            "       <input id=\"slider-1\" class=\"slider has-output is-fullwidth is-large\" min=\"0\" max=\"20\"\n" +
            "              value=\"10\" step=\"10\" type=\"range\">\n" +
            "       <div class=\"suggested-position\"></div>\n" +
            "   </div>" +
            "</div>\n")

        new Sliders($('input.slider')).attach();
    });

    it('should only suggest to add up to maximum of slider', () => {
        let slider1 = new Slider($('#slider-1'));

        slider1.suggestSliderValue(50);
        let $suggestedPosition = $('.suggested-position');
        expect($suggestedPosition).toContainText("Add 1");
    });

    it('should only suggest to lower up to minimum of slider', () => {
        let slider1 = new Slider($('#slider-1'));

        slider1.suggestSliderValue(-50);
        let $suggestedPosition = $('.suggested-position');
        expect($suggestedPosition).toContainText("Lower 1");
    });

    it('should report if it is able to move toward required destination', () => {
        let $slider1 = $('#slider-1');
        let slider = new Slider($slider1);

        $slider1.val("10");
        $slider1.trigger('change');

        expect(slider.canMoveToward(20)).toBeTrue();
        expect(slider.canMoveToward(-20)).toBeTrue();
    });

    it('should report if it is NOT able to move toward required destination', () => {
        let $slider1 = $('#slider-1');
        let slider = new Slider($slider1);

        $slider1.val("0");
        $slider1.trigger('change');

        expect(slider.canMoveToward(-10)).toBeFalse();
    });

});