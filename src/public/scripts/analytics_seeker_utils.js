
// APPLICATION RATE CHART
$(document).ready(function(){
    
    const ctx = $('#app_rate_chart');
    const data = JSON.parse(ctx.attr('data-application-rate'));

    const dates = data.map(date => date.date);
    const counts = data.map(count => count.count);


    const chart_data = {
    labels: dates,
    datasets: [{
        label: 'Application Rate',
        data: counts,
        fill: false,
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
                    time: {
                        displayFormats: {
                            day: 'MMM d'
                        },
                        tooltipFormat: 'MMM d, yyyy'
                    }
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

    const chart = new Chart(ctx, config);

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

    const dates = data.map(date => date.view_date);
    const counts = data.map(count => count.view_count);


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
                    time: {
                        displayFormats: {
                            day: 'MMM d'
                        },
                        tooltipFormat: 'MMM d, yyyy'
                    }
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

    const chart = new Chart(ctx, config);

});
