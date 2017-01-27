
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

}

update_graphs();