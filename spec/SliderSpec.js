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

    it('should report if it is able to move required distance', () => {
        let slider1 = new Slider($('#slider-1'));

        expect(slider1.canMove(10)).toBeTrue();
        expect(slider1.canMove(-10)).toBeTrue();
    });

    it('should report if it is able to move required distance', () => {
        let slider1 = new Slider($('#slider-1'));

        expect(slider1.canMove(20)).toBeFalse();
        expect(slider1.canMove(-20)).toBeFalse();
    });

});