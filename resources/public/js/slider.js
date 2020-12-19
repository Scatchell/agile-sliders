class Slider {
    constructor($slider) {
        this.$slider = $slider;
        this.stepValue = parseInt($slider.attr("step"));
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

    sliderMaxValue() {
        return parseInt(this.$slider.attr('max'));
    }

    isAltered() {
        return this.$slider.hasClass("altered");
    }

    canMove(distance) {
        let sliderMaxAddMovement = this.sliderMaxValue() - this.currentSliderValue();
        let sliderMaxLowerMovement = this.currentSliderValue() - 0;

        return distance < 0 ?
            Math.abs(distance) <= sliderMaxLowerMovement :
            Math.abs(distance) <= sliderMaxAddMovement;
    }

    suggestSliderValue(suggestedVal) {
        this.clearSuggestedValue();
        let slider = this;

        let actionHelper;
        let maxDistance;
        let currentSliderValue = parseInt(slider.currentSliderValue());
        if (suggestedVal > 0) {
            maxDistance = Math.abs(currentSliderValue - slider.sliderMaxValue());
            actionHelper = 'Add';
        } else {
            maxDistance = Math.abs(currentSliderValue - 0);
            actionHelper = 'Lower';
        }

        let suggestedValueWithinBounds = Math.min(Math.abs(suggestedVal), maxDistance);

        let suggestedValueToShow = Math.abs(suggestedValueWithinBounds / slider.stepValue);
        this.$suggestedSliderVal.text(actionHelper + ' ' + suggestedValueToShow);
    }
}
