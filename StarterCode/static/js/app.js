function populate_dropdown(){
   var dropdown = d3.select("#selDataset")
   d3.json("samples.json").then(function(data) {
    var names = data.names;
    names.forEach(element => {
        dropdown.append("option").text(element).property("value", element)
    });
    option_changed(names[0])
  });
}
populate_dropdown(); 

function option_changed(dropdown_option){
    console.log("thisiskool") //Using this to test periodically throughout to see if the Console will react. 
    d3.json("samples.json").then(function(data) {
        var samples = data.samples
        var results = samples.filter(sample => sample.id==dropdown_option)
        console.log(results)
    }
    )}

    function display_data(option,Dataset) {
	    var mtdata = Dataset.metadata.filter(row => row.id == option);
	    d3.select("#sample-metadata").html(display_object(mtdata[0]));
	        
	}
	
	function display_object(obj) {
	    var str = "";
	    Object.entries(obj).forEach(([key,value]) => {
	        str += `<br>${key}:${value}</br>`;
	        if(key=="wfreq"){
	            buildGauge(value);
	            console.log("gauge value is:" +value);
	        }
	    });
	    return str;
	}
	
	function display_bar_chart(option,DataSet) {
	    var barData = DataSet.samples.filter(sample => sample.id == option);
	    console.log(barData);
	    var y = barData.map(row =>row.otu_ids);  
	    var y1 =[];
	    for(i=0;i<y[0].length;i++){
	    y1.push(`OTU ${y[0][i]}`);
	    }
	    var x = barData.map(row =>(row.sample_values));
	    var text = barData.map(row =>row.otu_labels);
	    var trace = {
	        x:x[0].slice(0,10),
	        y:y1.slice(0,10),
	        text:text[0].slice(0,10),
	        type:"bar",
	        orientation:"h",
	        
	    };
	    var data = [trace];
	    var layout = {
	        yaxis: {
	            autorange: "reversed" 
	        }
	    }
	    Plotly.newPlot("bar",data,layout);
	}
	
	function display_bubble_chart(option,DataSet) {
	    var barData = DataSet.samples.filter(sample => sample.id == option);
	    console.log(barData); 
	    var x = barData.map(row =>row.otu_ids); 
	    var y = barData.map(row =>row.sample_values); 
	    var text = barData.map(row =>row.otu_labels);
	    var marker_size = barData.map(row =>row.sample_values);
	    var marker_color = barData.map(row =>row.otu_ids);
	    console.log(x[0]);
	    console.log(y[0]);
	    console.log(text);
	    var trace1 = {
	        x:x[0],
	        y:y[0],
	        text: text[0],
	        mode:"markers",
	        marker: {
	            color: marker_color[0],
	            size: marker_size[0]
	        }
	    };
	    var data = [trace1];
	    var layout = {
	        xaxis:{
	            title: "OTU ID"
	        }
	    };
	    Plotly.newPlot("bubble",data,layout);
	}
	init();
function getPlots(id) {
	    d3.json("samples.json").then (sampledata =>{
	        console.log(sampledata)
	        var ids = sampledata.samples[0].otu_ids;
	        console.log(ids)
	        var sampleValues =  sampledata.samples[0].sample_values.slice(0,10).reverse();
	        console.log(sampleValues)
	        var labels =  sampledata.samples[0].otu_labels.slice(0,10);
	        console.log (labels)
	        var OTU_top = ( sampledata.samples[0].otu_ids.slice(0, 10)).reverse();
	        var OTU_id = OTU_top.map(d => "OTU " + d);
	        console.log(`OTU IDS: ${OTU_id}`)
	        var labels =  sampledata.samples[0].otu_labels.slice(0,10);
	        console.log(`OTU_labels: ${labels}`)
	        var trace = {
	            x: sampleValues,
	            y: OTU_id,
	            text: labels,
	            marker: {
	            color: 'blue'},
	            type:"bar",
	            orientation: "h",
	        };
	        var data = [trace];
	        var layout = {
	            title: "Top 10 OTU",
	            yaxis:{
	                tickmode:"linear",
	            },
	            margin: {
	                l: 100,
	                r: 100,
	                t: 100,
	                b: 30
	            }
	        };
	        Plotly.newPlot("bar", data, layout);
	        var trace1 = {
	            x: sampledata.samples[0].otu_ids,
	            y: sampledata.samples[0].sample_values,
	            mode: "markers",
	            marker: {
	                size: sampledata.samples[0].sample_values,
	                color: sampledata.samples[0].otu_ids
	            },
	            text:  sampledata.samples[0].otu_labels
	        };
	        var layout_2 = {
	            xaxis:{title: "OTU ID"},
	            height: 600,
	            width: 1000
	        };
	        var data1 = [trace1];
	    Plotly.newPlot("bubble", data1, layout_2); 
	    });
	}  
	function getDemoInfo(id) {
	d3.json("samples.json").then((data)=> {
	        var metadata = data.metadata;
	        console.log(metadata)
	        var result = metadata.filter(meta => meta.id.toString() === id)[0];
            var demographicInfo = d3.select("#sample-metadata");
	        demographicInfo.html("");
	        Object.entries(result).forEach((key) => {   
	            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
	        });
	    });
	}
	function optionChanged(id) {
	    getPlots(id);
	    getDemoInfo(id);
	}
	function init() {
	    var dropdown = d3.select("#selDataset");
	    d3.json("samples.json").then((data)=> {
	        console.log(data)
	        data.names.forEach(function(name) {
	            dropdown.append("option").text(name).property("value");
	        });
	        getPlots(data.names[0]);
	        getDemoInfo(data.names[0]);
	    });
	}
	init();