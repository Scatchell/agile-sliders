class Slider {
    constructor($slider) {
        this.$slider = $slider;
        this.$suggestedSliderVal = $slider.parent().find('.suggested-position');
    }

    currentSliderValue() {
        return this.$slider.val();
    }

    clearSuggestedValue() {
        this.$suggestedSliderVal.text("");
    }

    markAltered() {
        this.$slider.addClass("altered");
    }

    suggestSliderValue(suggestedVal) {
        this.clearSuggestedValue();
        let actionHelper;
        if (parseInt(suggestedVal) > 0) {
            actionHelper = 'Add';
        } else {
            actionHelper = 'Lower';
        }

        this.$suggestedSliderVal.text(actionHelper + ' ' + Math.abs((suggestedVal / 10)));
    }

}
