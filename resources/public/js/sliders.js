class Sliders {
    constructor() {
        this.$sliders = $('input.slider').not('.slider-version');
        this.initialSliderAmount = this.totalSliderAmount();
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
        this.$sliders.each(function (){
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

    moreThanOneSliderUnaltered() {
        return this.$sliders.not('.altered').length > 1;
    }

    setSuggestedValues() {
        let inequalSliders = this.$sliders.filter('.is-danger');
        let currentTotalSliderAmount = this.totalSliderAmount();
        let sliders = this;
        inequalSliders.each(function () {
            let slider = new Slider($(this));
            let difference = sliders.initialSliderAmount - currentTotalSliderAmount;
            slider.suggestSliderValue(difference);
        });
    }

    attach() {
        let sliders = this;

        this.$sliders.each(function () {
            $(this).change(function () {
                if (sliders.moreThanOneSliderUnaltered()) {
                    let slider = new Slider($(this));
                    slider.markAltered();
                    slider.clearSuggestedValue();
                }

                if (sliders.totalSliderAmount() === sliders.initialSliderAmount) {
                    sliders.resetAllSliders();
                } else {
                    sliders.highlightAllUnalteredSliders();
                    sliders.setSuggestedValues();
                }
            });
        });
    }
}
