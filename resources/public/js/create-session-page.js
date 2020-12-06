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

    $("#add-new-slider").click(function (e) {
        let $textAreas = $('.item-columns textarea');
        let $textInputs = $(`.item-columns input`);

        $textInputs.prop("readonly", true).addClass("is-warning");
        $textAreas.prop("readonly", true).addClass("is-warning");

        $itemColumnsClone.clone().appendTo("#session-data");
        e.preventDefault();
    });

    $("#session-form").submit(function (e) {
        console.log(JSON.stringify(prepareSessionData()));
        $.post({
            url: "/session",
            data: JSON.stringify(prepareSessionData()),
            contentType: 'application/json; charset=utf-8'
        }).done(function (data) {
            window.location.href = "/session/" + data['session-id'];
        }).fail(function (data) {
            console.log(data);
            let $errors = $('#errors');
            $errors.show();
            $errors.html("<h3>Validation errors:</h3><ol></ol>");
            for (const [key, value] of Object.entries(data.responseJSON.errors)) {
                $('#errors ol').append(`<li>${value}</li>`);
            }
        });

        e.preventDefault();
    });
});