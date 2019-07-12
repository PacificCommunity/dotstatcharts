# dotstatcharts
Javascript JSON (.Stat SDMX) parser and highchart visualization

The statchart.js processes data from .stat and generates charts
1) Query .Stat Data NSI service
2) Parse JSON returned by .stat to create a JS array containing data for highchart
3) Call highcharts to display data in a chart

[Test it on codepen](https://codepen.io/stanozr/pen/LKaavR)

## Requirements

#### CSS
- bootstrap

#### Javascript
- jquery
- bootstrap (for tabs support)
- highcharts
  - exporting
  - export-data
- pretty-json (if debug is turned on)
- statchart.js (obvioulsy)

## Limitations 
This version does not support time series, only simple data

## How to use

Going step by step, using the example used in example.html file from this repository.

### Browse for data in .stat
Use .stat data explorer, browse and filter until you get the expected results

For our example we're going to use the [SDG 4.5.1 indicator](https://stats.pacificdata.org/data-explorer/#/vis?locale=en&endpointId=disseminate&agencyId=SPC&code=DF_SDG&version=1.0&activeFilterId=SERIES&viewerId=BarChart&data=.SE_ACS_ELECT..........&startPeriod=2007&endPeriod=2018).

Click on the __API queries__ tab and copy the _data query_:  
https://stats.pacificdata.org/data-nsi/Rest/data/SPC,DF_SDG,1.0/.SE_TOT_GPI......ISCED11_10..../?startPeriod=2007&endPeriod=2018&dimensionAtObservation=AllDimensions

### Define parameters
#### Set minimal parameters, debug mode ON

A minimal call would look like so :
```js
new DotStatChart(
  'dotstat-div',
  'SDG Test',
  'https://stats.pacificdata.org',
  { debug:true }
).go(
  QUERY_URI,
  { }
);
```

The QUERY_URI parameter is the query you previously got from .stat

#### Reading the JSON object returned
The JSON returned is shown under the JSON tab.
The data is defined in the `dataSets[0].observations` onject. A row looks like so :
```
  0:0:0:0:0:0:0:0:0:0:0:0:0: {
    0: 100
    1: 0
    2: 0
    3: 0
    4: 0
    5: 0
  }
```

The key, containing a colon separated list of numbers, is related with the data defined in the structure.dimensions.observation object.

For instance, the first 0 in the string corresponds to the first dimension "FREQ" :
```js
  0: {
    id: "FREQ"
    name: "Frequency"
    keyPosition: 0
    role: "FREQ"
    values: {
      0: {
        id: "A"
        name: "Annual"
      }
    }
  }
```

Looking at the dimensions, we now know what each number means (starting from index = 0) :
0) Frequency
1) SDG Indicator or Series
2) Reference Area
3) Sex Breakdown

and so on...

What we want here is the name of the country, the year, and the index.

Country is in index 2 "Reference Area".  
Its value looks like this :
```js
values: {
  0: {
    id: "FM"
    name: "Federated States of Micronesia (FSM)"
  }
```

We want to display the 2 letters country code as the x-axis legend.
1) This information in in the dimension #2, so we access it through `dim[2]`
2) The 2 letter code is in the `id` property, which we access through `dim[2].id`
3) We will assign this value to the `name` property, as required by highcharts

So our first parser parameter is : `"name": "dim[2].id"`

We then want :
- the full name of the country to be in variable `label`
- the year the data has been collected in variable `year`

Now the value is not in the dimension array, but in the values array.  
And in fact, it is the first indexed value, which we access using the `val[0]` parameter.  
Highcharts requires the y-axis value to be assigned to property `y`.  
Our y-axis value is defined as : `"y": "val[0]"`

Our full parser parameters then becomes :
```json
  {
    "name": "dim[2].id",
    "label": "dim[2].name",
    "year": "dim[12].name",
    "y": "val[0]"
  }
```

#### Update Javascript call with parser parameters
Modify your code to include the parameters we've just defined :
```js
new DotStatChart(
  'dotstat-div',
  'SDG Test',
  'https://stats.pacificdata.org',
  { }
).go(
  QUERY_URI,
  {
    "name": "dim[2].id",
    "label": "dim[2].name",
    "year": "dim[12].name",
    "y": "val[0]"
  }
);
```

Launch again and check the chart

#### Refine highcharts options
Go to highcharts.com and check out the [Highcharts API](https://api.highcharts.com/highcharts/) to learn more about its options.
A good place to start is also by looking at [Highcharts demos](https://www.highcharts.com/demo).

Don't forget to turn Debug mode OFF

## Test it on codepen
https://codepen.io/stanozr/pen/LKaavR
