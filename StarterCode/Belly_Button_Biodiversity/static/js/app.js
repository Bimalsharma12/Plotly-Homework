function buildMetadata(sample) {
  // Using `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");

  // @TODO: Complete the following function that builds the metadata panel

  var url = "/metadata/" + sample;
  d3.json(url).then(function(response){
    // Use `Object.keys` to add each key and value pair to the panel
    Object.keys(response).forEach(function(key){
      console.log(key, response[key]);

      d3.select("#sample-metadata").append("p").text(`${key}: ${response[key]}`);
    });

  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/" + sample;
  // Using `d3.json` to fetch the metadata for a sample
    d3.json(url).then(function(response){
      console.log(response);
      var trace1 = {
        type: "pie",
        values: (response.sample_values).slice(0,10),
        labels: (response.otu_ids).slice(0,10),
        text: (response.otu_labels).slice(0,10)
      }

      var data1 = [trace1];
      var layout1 = {
        title: "Top 10 Samples",
      }

      Plotly.newPlot("pie", data1, layout1);

      var trace2 = {
        x: response.otu_ids,
        y: response.sample_values,
        mode: 'markers',
        text: (response.otu_labels),
        marker: {
          size: response.sample_values,
          color: response.otu_ids,
        }
      }
      var data2 = [trace2];
      var layout2 = {
        title: "Sample bubble chart",
        xaxis: {title: "OTU id"},
        yaxis: {title: "values", autorange: true}
      }

      Plotly.newPlot("bubble", data2, layout2);
    });

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
