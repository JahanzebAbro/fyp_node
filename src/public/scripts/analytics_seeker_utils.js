let app_rate_chart = '';
let job_views_chart = '';

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
        type: 'line',
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

            min_date = new Date(dates[0].getFullYear(), 0, 0);
            max_date = new Date(curr_date.getFullYear(), 11, 0);

        }


        app_rate_chart.config.options.scales.x.time.unit = filter_type;
        app_rate_chart.config.options.scales.x.min = min_date;
        app_rate_chart.config.options.scales.x.max = max_date;
        app_rate_chart.update();

    });

});




// APPLICATION STATUS COUNT CHART
$(document).ready(function(){
    
    const ctx = $('#app_status_chart');
    const data = JSON.parse(ctx.attr('data-application-status'));

    const status = data.map(value => value.status);
    const counts = data.map(count => count.count);


    const chart_data = {
        labels: ['Accepted', 'Declined', 'Pending', 'Reviewing'],
        datasets: [{
            label: 'Application Status Overview',
            data: counts,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)'
            ],
            borderColor: [
                'rgb(75, 192, 192)',
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: chart_data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
              }
        }
    };

    const chart = new Chart(ctx, config);

});



// APPLICATION SAVED RATIO
$(document).ready(function(){
    
    const ctx = $('#app_saved_chart');
    const data = JSON.parse(ctx.attr('data-application-saved'));


    const chart_data = {
        labels: [
            'Not Applied',
            'Applied'
          ],
          datasets: [{
            label: 'Apply to Saved Jobs Ratio',
            data: [data.not_applied, data.applied],
            backgroundColor: [
              'rgba(47, 188, 237, 0.5)',
              'rgba(5, 204, 33, 0.5)'
            ],
            borderColor: [
                'rgb(47, 188, 237)',
                'rgb(5, 204, 33)',
            ],
            borderWidth: 1,
            hoverOffset: 4
          }]
    };

    const config = {
        type: 'doughnut',
        data: chart_data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, 
                    position: 'top', 
                    align: 'center',
                },
                title: {
                    display: true,
                    text: 'Applying Ratio in Saved Jobs'
                }
            }
        }
    };

    const chart = new Chart(ctx, config);

});




// FAVORITE INDUSTRIES RATIO
$(document).ready(function(){
    
    const ctx = $('#industry_chart');
    const data = JSON.parse(ctx.attr('data-industry'));
    const labels = data[0];
    const values = data[1]; 

    const chart_data = {
        labels: labels,
          datasets: [{
            label: 'Favorite Industries',
            data: values,
            tooltip: {
                callbacks: {
                    label: function(ctx) {
                        let label = ctx.label;
                        let value = ctx.formattedValue;

                        let sum = 0;
                        values.forEach(val => { // Add all values to sum
                            sum += Number(val); 
                        });
        
                        let percentage = (value * 100 / sum).toFixed(1) + '%';
                        return label + ": " + percentage;
                    }
                }
            },
            hoverOffset: 4
          }]
    };

    const config = {
        type: 'pie',
        data: chart_data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, 
                    position: 'top', 
                    align: 'center',
                },
                title: {
                    display: true,
                    text: 'Favorite Industries'
                }
            }
        }
    };

    const chart = new Chart(ctx, config);

});




// JOB VIEWS RATE CHART
$(document).ready(function(){
    
    const ctx = $('#job_views_chart');
    const data = JSON.parse(ctx.attr('data-job-views'));

    const dates = data.map(date => new Date(date.view_date));
    const counts = data.map(count => count.view_count);
    const curr_date = new Date();

    const chart_data = {
    labels: dates,
    datasets: [{
        label: 'Job Viewing',
        data: counts,
        fill: false,
        backgroundColor: 'rgb(76, 204, 37)',
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
                        tooltipFormat: 'MMM d, yyyy',
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

    job_views_chart = new Chart(ctx, config);

});


// JOB VIEWS FILTERS
$(document).ready(function(){

    $('.job_views_filters').click(function(){

        $('.job_views_filters').removeClass('filter_selected');
        $(this).addClass('filter_selected');

        const filter_type = $(this).attr('data-filter-type');
        
        const data = JSON.parse($('#job_views_chart').attr('data-job-views'));
        const dates = data.map(date => new Date(date.view_date));
        
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
            max_date = new Date(curr_date.getFullYear(), 12, 0);

        }


        job_views_chart.config.options.scales.x.time.unit = filter_type;
        job_views_chart.config.options.scales.x.min = min_date;
        job_views_chart.config.options.scales.x.max = max_date;
        job_views_chart.update();

    });

});