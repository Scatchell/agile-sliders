const toItems = (arr1) => arr1.reduce((sliderList, sliderName) => {
    sliderList.push({
        name: sliderName,
        step: 10,
        initial_pos: 50
    })
    return sliderList;
}, []);

function prepareSessionData() {
    return {
        name: $('#session-name').val(),
        sliders: toItems($('.session-slider-title').map(function (index, el) {
            return $(el).val()
        }).get())
    };
}

$(document).ready(function () {
    let $itemColumnsClone = $(".item-columns").clone();

    let createNewItemOnKey = function (e) {
        if ((e.ctrlKey && e.which === 13) || e.metaKey && e.which === 13) {
            createNewSlider($itemColumnsClone);
            e.preventDefault();
        }
    };

    function createNewSlider($itemColumnsClone) {
        let $textAreas = $('.item-columns textarea');
        let $textInputs = $(`.item-columns input`);

        $textInputs.prop("readonly", true).addClass("is-warning");
        $textAreas.prop("readonly", true).addClass("is-warning");

        $itemColumnsClone.clone().appendTo("#session-data");

        let $newItem = $('input.session-slider-title').last();

        $newItem.keydown(createNewItemOnKey);
        $newItem.focus();
    }


    $("#add-new-slider").click(function (e) {
        createNewSlider($itemColumnsClone);
        e.preventDefault();
    });

    $("#session-form").submit(function (e) {
        $.post({
            url: "/session",
            data: JSON.stringify(prepareSessionData()),
            contentType: 'application/json; charset=utf-8'
        }).done(function (data) {
            window.location.href = "/session/" + data['session-id'];
        }).fail(function (data) {
            let $errors = $('#errors');
            $errors.show();
            $errors.html("<h3>Validation errors:</h3><ol></ol>");
            for (const [key, value] of Object.entries(data.responseJSON.errors)) {
                $('#errors ol').append(`<li>${value}</li>`);
            }
        });

        e.preventDefault();
    });

    $('input.session-slider-title').keydown(createNewItemOnKey);
});