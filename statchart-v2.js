var chartMonoColors = (function () {
  var colors = [],
    base = Highcharts.getOptions().colors[0],
    i;
  for (i = -5; i < 5; i += 1) {
    // Start out with a darkened base color (negative brighten), and end
    // up with a much brighter color
    colors.push(Highcharts.Color(base).brighten(i / 10).get());
  }
  return colors;
}());

function DotStatChart(id, categories, otpl, opts, title, subtitle, link) {
  
  this.debug = (opts && opts.debug)?true:false;

  // debug ?
  this.dbg = function(s) {
    if (this.debug) { console.log(s); }
  }
  
  this.id = id;
  this.categories = categories;
  this.dbg('CATEGORIES = ');
  this.dbg(this.categories);
  this.rawdata = false;
  this.animating = false;

  this.options = {
    title: {
      useHTML: true,
      text: title?title:''
    },
    subtitle: {
      useHTML: (subtitle && link)?true:false,
      text: subtitle?(link?('<a href="'+link+'" target="_blank">'+subtitle+'</a>'):subtitle):''
    },
    exporting: {
      menuItemDefinitions: {
        showDatTable: {
          text: 'Show Data Table',
          onclick: function() {
            jQuery('#'+id+'-modal .modal-body').html(this.getTable());
            jQuery('#'+id+'-modal').modal();
          }
        },
        sourceLink: {
          text: 'View Data in PDH.stat',
          onclick: function() {
            window.open(link.replace(/&amp;/g, "&"), '_blank');
          }
        }
      },
      showTable: false
    },
    dotStatChartOptions: {
      rawDataType: ''
    }
  };

  // this.dbg(this.options);
  this.dbg('TEMPLATE = ');
  this.dbg(otpl);
  
  if (otpl) {
    this.dbg('MERGING TEMPLATE OPTIONS...');
    jQuery.extend(true, this.options, otpl);
    this.dbg(this.options);
  }
  
  this.loader = '<svg viewBox="0 0 135 140" xmlns="http://www.w3.org/2000/svg" class="highcharts-loader"><rect x="0" y="5" width="15" height="140" rx="6"><animate attributeName="height" begin="0s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite" /><animate attributeName="y" begin="0s" dur="1s" values="25;35;45;55;65;75;85;95;105;5;25" calcMode="linear" repeatCount="indefinite" /></rect><rect x="30" y="50" width="15" height="100" rx="6"><animate attributeName="height" begin="0.25s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite" /><animate attributeName="y" begin="0.25s" dur="1s" values="25;35;45;55;65;75;85;95;105;5;25" calcMode="linear" repeatCount="indefinite" /></rect><rect x="60" y="25" width="15" height="120" rx="6"><animate attributeName="height" begin="0.5s" dur="1s" values="90;80;70;60;45;30;140;120;120;110;100" calcMode="linear" repeatCount="indefinite" /><animate attributeName="y" begin="0.5s" dur="1s" values="55;65;75;85;100;115;5;25;25;35;45" calcMode="linear" repeatCount="indefinite" /></rect><rect x="90" y="30" width="15" height="120" rx="6"><animate attributeName="height" begin="0.25s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite" /><animate attributeName="y" begin="0.25s" dur="1s" values="25;35;45;55;65;75;85;95;105;5;25" calcMode="linear" repeatCount="indefinite" /></rect><rect x="120" y="70" width="15" height="80" rx="6"><animate attributeName="height" begin="0.5s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite" /><animate attributeName="y" begin="0.5s" dur="1s" values="25;35;45;55;65;75;85;95;105;5;25" calcMode="linear" repeatCount="indefinite" /></rect></svg>';
  
  // this.series = false;

  this.dbg('EXTENDING OPTIONS...');
  
  jQuery.extend(true, this.options, opts);
  // check exporting options
  if (!this.options.exporting.buttons) {
    this.options.exporting.buttons = {
      contextButton: {
        menuItems: ['viewFullscreen','printChart','showDatTable','separator','downloadPNG','downloadPDF','downloadSVG']
      }
    };
    // 'downloadCSV',
  }
  // do we have a link ?
  if (link) {
    this.options.exporting.buttons.contextButton.menuItems.unshift('sourceLink');
  }

  // @todo check options are valid
  this.dbg(this.options);

  // Add categories
  if (categories) {
    for (var j=0; j < this.options.xAxis.length; j++) {
      this.options.xAxis[j].categories = this.categories;
    }
  }
  
  this.initHtml = function() {
    var $d = jQuery('#'+this.id);
    if (!$d[0]) {
      alert('ERR: Target div #'+this.id+' not found');
      return false;
    }
    var tabs = this.options.showTable || this.debug;
    var html = '';
    if (tabs) {
      html += '<div class="sdd-chart-panel">'
        + '<ul class="nav nav-tabs" id="dotstat-sdg451-tabs" role="tablist">'
        + '<li class="nav-item">'
        + '<a class="nav-link active" data-toggle="tab" href="#'+this.id+'-chart" role="tab" aria-controls="home" aria-selected="true">Chart</a>'
        + '</li>';
      if (this.options.showTable) {
        html += '<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#'+this.id+'-data-table" role="tab" aria-controls="profile" aria-selected="false">Data Table</a></li>';
      }
      if (this.debug) {
        html += '<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#'+this.id+'-jsondata" role="tab" aria-controls="contact" aria-selected="false">JSON</a></li>';
      }
      html += '</ul>'
        + '<div class="tab-content" id="'+this.id+'-content">'
        + '<div id="'+this.id+'-chart" class="highcharts-chart tab-pane fade show active">'
    } else {
      html += '<div id="'+this.id+'-chart" class="highcharts-chart">';
    }
    html += this.loader
      +'</div>';
    
    if (this.options.showTable) {
      html += '<div id="'+this.id+'-data-table" class="highcharts-data-table tab-pane fade">Loading...</div>';
    }
    if (this.debug) {    
      html += '<div id="'+this.id+'-jsondata" class="highcharts-jsondata tab-pane fade">...</div>';
    }
    if (tabs) {
      html += '</div></div>';
    }
    if (this.options.exporting && this.options.exporting.buttons.contextButton.menuItems.indexOf('showDatTable') !== -1) {
      html += '<div class="modal fade" id="'+this.id+'-modal"><div class="modal-dialog modal-lg" role="document"><div class="modal-content">'
      +'<div class="modal-header"><div class="modal-title" id="dotstat-sdg451-modal-title">Data Table</div><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body highcharts-data-table"></div></div></div></div>';
    }
    $d.html(html);
    return true;
  }
  
  // generate chart
  this.render = function() {
    
    var obj = this;
    var htmlswitch = '';
    
    switch(this.options.dotStatChartOptions.rawDataType) {
      case 'poppyramid':
        this.options.series = [ {
          name: 'Male',
          data: jQuery.map( this.rawdata['Male'], function(a) { return 0 - a ; }),
          color: '#9cf'
        }, {
          name: 'Female',
          data: jQuery.map( this.rawdata['Female'], function(a) { return a ; }),
          color: '#f9c'
        } ];
        break;
      case 'poppyramid_multi':
        this.datasets = [];
        for (var kn in this.rawdata) {
          this.datasets.push(kn);
        }
        this.dbg('MULTI PYRAMID:');
        this.dbg(this.datasets);
        var first = this.datasets[0];
        if (this.options.dotStatChartOptions.defaultSet) {
          first = this.options.dotStatChartOptions.defaultSet;
        }
        this.options.series = [ {
          name: 'Male',
          data: jQuery.map(this.rawdata[first]['Male'], function(a) { return 0 - a ; }),
          color: '#9cf'
        }, {
          name: 'Female',
          // data: [...this.rawdata[first]['Female']],
          data: jQuery.map(this.rawdata[first]['Female'], function(a) { return a; }),
          color: '#f9c'
        } ];
        htmlswitch = '<div class="spc-chart-switching-buddy">'
          +'<select onchange="'+this.id.replace('-','_')+'.switch(this.value)">';
        for(var j=0; j<this.datasets.length; j++) {
          htmlswitch += '<option value="'+this.datasets[j]+'"';
          if (first == this.datasets[j]) {
            htmlswitch += ' selected="selected"';
          }
          htmlswitch += '>'+this.datasets[j]+'</option>';
        }
        htmlswitch += '</select>'
          +'<button type="button" onclick="'+this.id.replace('-','_')+'.animate(this)"></button>'
          +'</div>';
        break;
      default:
        this.options.series = [ { data: this.rawdata } ];
        break;
    }
        
    obj.dbg('Rendering...');
    obj.dbg(this.options);
    
    this.chart = Highcharts.chart(this.id+'-chart', this.options, function() {
      if (obj.options.showTable ) {
        jQuery('#'+obj.id+'-data-table').html(this.getTable());
      }  
    });

    if (htmlswitch) {
      jQuery('#'+this.id).prepend(htmlswitch);
    }
    
  };
  
  // launch
  this.go = function(data) {
    this.rawdata = data;
    if (this.initHtml()) {
      if (this.debug) {
        jQuery('#'+this.id+'-jsondata').html(JSON.stringify(data)); //.beautifyJSON();
      }
      this.render();
    }
  };

  // load new data
  this.switch = function(val) {
    if (this.animating) {
      window.clearInterval(this.animating);
      jQuery('#'+this.id+' .spc-chart-switching-buddy button').removeClass('pause');
      this.animating = false;
    }
    this.chart.series[0].setData(jQuery.map( this.rawdata[val]['Male'], function(a) { return 0 - a ; }));
    this.chart.series[1].setData(this.rawdata[val]['Female']);
  }

  // animate

  this.animate = function(elb) {
    var obj = this;
    if (this.animating) {
      window.clearInterval(this.animating);
      jQuery(elb).removeClass('pause');
      this.animating = false;
    } else {
      jQuery(elb).addClass('pause');
      this.animating = window.setInterval(function() {
        var els = jQuery('#'+obj.id+' .spc-chart-switching-buddy select');
        var opts = [];
        var cv = els.val();
        var nx = 0;
        var is = false;
        els.children('option').map(function(idx, opt) {
          opts.push(opt.value);
          if (is && !nx) {
            nx = idx;
          }
          if (cv == opt.value) {
            is = true;
          }
        });
        els.prop('selectedIndex', nx);
        var val = els.val();
        obj.chart.series[0].setData(jQuery.map(obj.rawdata[val]['Male'], function(a) { return 0 - a ; }));
        obj.chart.series[1].setData(obj.rawdata[val]['Female']);
      }, obj.options.dotStatChartOptions.speed);
    }
  }
  
  return this;
  
}