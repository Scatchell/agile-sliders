class Sliders {
    constructor($sliders) {
        this.$sliders = $sliders;
        this.$saveButtons = $('#save-session,#save-output-session');

        this.initialSliderAmount = this.$sliders.map(function (val, i) {
            return $(this).attr('max');
        }).get().reduce(function (total, val) {
            return total + parseInt(val);
        }, 0) / 2;
    }

    totalSliderAmount() {
        let sliderValues = this.$sliders.map(function (val, i) {
            let slider = new Slider($(this));
            return slider.currentSliderValue();
        }).get();

        return sliderValues.reduce(function (total, val) {
            return total + parseInt(val);
        }, 0);
    }

    unalterAllSliders() {
        this.$sliders.removeClass("altered");
    }

    unhighlightAllSliders() {
        this.$sliders.removeClass("is-danger");
    }

    resetSliderSuggestions() {
        this.$sliders.each(function () {
            new Slider($(this)).clearSuggestedValue();
        });
    }

    resetAllSliders() {
        this.unalterAllSliders();
        this.unhighlightAllSliders();
        this.resetSliderSuggestions();
    }

    highlightAllUnalteredSliders() {
        this.unhighlightAllSliders();
        this.$sliders.not('.altered').addClass("is-danger");
    }

    inequalSliders() {
        return this.$sliders.filter('.is-danger');
    }

    setSuggestedValuesFor(slidersToChange) {
        //todo change to inequalSliders function
        let sliders = this;
        let currentTotalSliderAmount = sliders.totalSliderAmount();
        slidersToChange.inequalSliders().each(function () {
            let slider = new Slider($(this));
            let difference = sliders.initialSliderAmount - currentTotalSliderAmount;
            slider.suggestSliderValue(difference);
        });
    }

    updateSaveButtonState() {
        let sliders = this;
        if (sliders.totalSliderAmount() === sliders.initialSliderAmount) {
            sliders.$saveButtons.removeAttr('disabled');
        } else {
            sliders.$saveButtons.attr('disabled', 'disabled');
        }
    }

    onlyUnalteredSlider(slider) {
        return this.$sliders.not('.altered').length === 1 && !slider.isAltered();
    }

    thatCanMove(distance) {
        let $slidersThatCanMove = this.$sliders.filter(function () {
            let $slider = new Slider($(this));
            return $slider.canMove(distance);
        });
        return $slidersThatCanMove.length === 0 ?
            this :
            new Sliders($slidersThatCanMove);
    }

    attach() {
        let sliders = this;

        this.updateSaveButtonState();

        this.$sliders.each(function () {
                let recalculateSliderSuggestions = function () {
                    let slider = new Slider($(this));

                    if (sliders.totalSliderAmount() === sliders.initialSliderAmount) {
                        sliders.resetAllSliders();
                    } else {
                        if (sliders.onlyUnalteredSlider(slider)) {
                            sliders.resetAllSliders();
                            slider.markAltered();
                        } else {
                            slider.clearSuggestedValue();
                            slider.markAltered();
                        }

                        let difference = sliders.initialSliderAmount - sliders.totalSliderAmount();
                        let slidersToChange = sliders.thatCanMove(difference);
                        slidersToChange.highlightAllUnalteredSliders();
                        sliders.setSuggestedValuesFor(slidersToChange);
                    }

                    sliders.updateSaveButtonState();
                };

                $(this).change(recalculateSliderSuggestions);
            }
        );
    }
}
