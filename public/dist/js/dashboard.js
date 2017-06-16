
var sensors = "Balcony box";
var colors = ['darkorange', 'cyan', 'blue', 'crimson', 'gold', 'darkviolet', 'deeppink', 'limegreen', 'darkgreen', 'chocolate'];

update_graphs = function() {
    if (sensors === []) {
        sensors = "get";
    }

	$.ajax({
        type: "GET",
        url: "/api/sensors",
        data: "sensor=" + sensors,
        success: function(data) {
            if (data.sensors_ids) {
                sensors = data.sensors_ids;
                update_graphs();
            } else {
                    update_canvas(data);
                }
        }
            
    });
}

update_canvas = function(data) {
    var sens_ctx = $("#sens1_temp").get(0).getContext("2d");

    var dates = [];
    var temp = [];
    var humi = [];

    data.forEach(function (item) {
        dates.push(item.time);
        temp.push(item.temperature);
        humi.push(item.humidity);
    });

    var sens_chart_data = {
        labels: dates,
        datasets: [{
            label: "Температура",
            backgroundColor: "rgba(243, 156, 18, 0.6)",
            fill: false,
            data: temp
        }, {
            label: "Влажность",
            backgroundColor: "rgba(85, 170, 255, 0.6)",
            fill: false,
            data: humi
        }]
    };
    
    var sens_chart_options = {
        responsive: true,
        legend: {
            display: true
        },
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    };

    var sensor_chart = new Chart(sens_ctx, {
        type: "line",
        data: sens_chart_data,
        options: sens_chart_options});

    console.log(sensor_chart)

};

switch_roz_on = function() {
    $.ajax({
        type: "POST",
        url: "/roz_on",
        success: function(data) {
            if (data.error) {       // if server replied an error,
                return;     // that's all
            }
            $('#roz_box').removeClass('roz_turned_off').addClass('roz_turned_on');
        }
    });
};

switch_roz_off = function() {
    $.ajax({
        type: "POST",
        url: "/roz_off",
        data: "",
        success: function(data) {
            if (data.error) {       // if server replied an error,
                return;     // that's all
            }
            $('#roz_box').removeClass('roz_turned_on').addClass('roz_turned_off');
        }
    });
};

roz_status = function() {
    $.ajax({
        type: "POST",
        url: "/roz_status",
        success: function(data) {
            if (data.error) {       // if server replied an error,
                return;     // that's all
            }
            $('#roz_box').removeClass('roz_turned_on').addClass('roz_turned_off');
        }
    });
};

$(document).ready(function() {

    update_graphs();
    $(document).on("click", "#roz_on", switch_roz_on);
    $(document).on("click", "#roz_off", switch_roz_off);

});
