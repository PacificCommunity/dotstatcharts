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

Going step by step, using the [example from this repository](https://pacificcommunity.github.io/dotstatcharts/example.html).

Read from the [Manual - Learning by example](docs/LEARNING.md).

## Test it on codepen
https://codepen.io/stanozr/pen/LKaavR
