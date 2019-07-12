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
This version can only display simple data, not timeseries for now

## How to use
#### Browse for data in .stat
Use .stat data explorer, browse and filter until you get the expected results
Get the query URI

#### Update javascript
Set Debug mode to ON, and launch away
Check the full JSON returned, and try to guess where the data is in JSON objects and arrays
Write parser parameters
Launch again and check the chart
Turn Debug mode OFF

## Test it on codepen
https://codepen.io/stanozr/pen/LKaavR
