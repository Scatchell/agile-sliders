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


    let saveSession = (outputVersion) => {
        return function (e) {
            let type = outputVersion ? "output" : "version";

            let postUrl =
                sessionIdPath(window.location.pathname) + "/" + type;
            $.post({
                url: postUrl,
                data: JSON.stringify(prepareSliderVersionData()),
                contentType: 'application/json; charset=utf-8'
            }).done(function (data) {
                window.location.href = "/session/" + data['session-id'] + "/" + type + "/" + data['version-name'];
            }).fail(function (data) {
                let $errors = $('#errors');
                $errors.show();
                $errors.html("<h3>Errors:</h3><ol></ol>");
                for (const [key, value] of Object.entries(data.responseJSON.errors)) {
                    $('#errors ol').append(`<li>${value}</li>`);
                }
            });

            e.preventDefault();
        }
    };

    $("#version-name").keypress(function (e) {
        if (e.which === 13) {
            let outputVersion = $(this).hasClass('output-version');
            saveSession(outputVersion)(e);
        }
    });

    $("#save-session").click(saveSession(false));

    $("#save-output-session").click(saveSession(true));

    $("#show-aggregate").click(function () {
        let redirectUrl =
            sessionIdPath(window.location.pathname) + "/aggregate"

        window.location.href = redirectUrl;
    });
});