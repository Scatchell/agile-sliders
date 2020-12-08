$(document).ready(function () {
    bulmaSlider.attach();
    let sliders = new Sliders();
    sliders.attach();

    function prepareSliderVersionData() {
        let $sliders = $('.slider');
        let sliderData = $sliders.map(function () {
            return {name: $(this).attr('id').replace('slider-', ''),
                current_pos: parseInt($(this).val())}
        }).get();

        return {
            sliders: sliderData
        };
    }

    $("#save-session").click(function (e) {
        $.post({
            url: window.location.pathname + "/version",
            data: JSON.stringify(prepareSliderVersionData()),
            contentType: 'application/json; charset=utf-8'
        }).done(function (data) {
            //todo updated!
        }).fail(function (data) {
            //todo failed...
        });

        e.preventDefault();
    });

});