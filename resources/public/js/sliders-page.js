$(document).ready(function () {
    bulmaSlider.attach();
    let sliders = new Sliders();
    sliders.attach();

    function prepareSliderVersionData() {
        let $sliders = $('.slider');
        let sliderData = $sliders.map(function () {
            return {
                name: $(this).attr('id').replace('slider-', ''),
                current_pos: parseInt($(this).val())
            }
        }).get();

        return {
            version_name: $('#version-name').val(),
            sliders: sliderData
        };
    }

    $("#save-session").click(function (e) {
        let postUrl =
            (window.location.pathname.includes("/version")
                ? window.location.pathname
                : window.location.pathname + "/version");
        console.log(postUrl);
        $.post({
            url: postUrl,
            data: JSON.stringify(prepareSliderVersionData()),
            contentType: 'application/json; charset=utf-8'
        }).done(function (data) {
            window.location.href = "/session/" + data['session-id'] + "/version/" + data['version-name'];
        }).fail(function (data) {
            //todo failed...
        });

        e.preventDefault();
    });

});