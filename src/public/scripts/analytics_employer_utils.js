let app_rate_chart = '';


// APPLICATION RATE CHART
$(document).ready(function(){
    
    const ctx = $('#app_rate_chart');
    const data = JSON.parse(ctx.attr('data-application-rate'));

    const dates = data.map(date => new Date(date.date));
    const counts = data.map(count => count.count);
    const curr_date = new Date();

    const chart_data = {
    labels: dates,
        datasets: [{
            label: 'Applying Rate',
            data: counts,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const config = {
        type: 'bar',
        data: chart_data,
        options: {
            scales: {
                x: {
                    type: 'time',
                    grid: {
                        offset: false
                    },
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM d yyyy',
                            week: 'MMM d yyyy',
                            month: 'MMM yyyy',
                            year: 'yyyy'
                        },
                        tooltipFormat: 'MMM d, yyyy'
                    },
                    min: new Date(dates[0].getFullYear(), dates[0].getMonth(), 1),
                    max: new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 1)
                },

                y: {
                    suggestedMin: 0,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    };

    app_rate_chart = new Chart(ctx, config);

});


// APPLICATION RATE FILTERS
$(document).ready(function(){

    $('.app_rate_filters').click(function(){

        $('.app_rate_filters').removeClass('filter_selected');
        $(this).addClass('filter_selected');

        const filter_type = $(this).attr('data-filter-type');

        const data = JSON.parse($('#app_rate_chart').attr('data-application-rate'));
        const dates = data.map(date => new Date(date.date));
        
        let min_date;
        let max_date;
        const curr_date = new Date();

        if (filter_type === 'day') {

            min_date = new Date(dates[0].getFullYear(), dates[0].getMonth(), 1);
            max_date = new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 1);

        } else if (filter_type === 'week') {

            min_date = new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate() - 1);
            max_date = new Date(curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate() + 7);

        } else if (filter_type === 'month') {

            min_date = new Date(dates[0].getFullYear(), dates[0].getMonth(), 1);
            max_date = new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 1);

        } else if (filter_type === 'year') {

            min_date = new Date(dates[0].getFullYear(), 0, 1);
            max_date = new Date(curr_date.getFullYear(), 11, 0);

        }


        app_rate_chart.config.options.scales.x.time.unit = filter_type;
        app_rate_chart.config.options.scales.x.min = min_date;
        app_rate_chart.config.options.scales.x.max = max_date;
        app_rate_chart.update();

    });

});