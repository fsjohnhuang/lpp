define(function(require, exports, module){
  window.$ = require('$');
  var Canvas = require('./src/vml/Canvas');
  var Polyline = require('./src/vml/cmp/Polyline');
  
  var canvas = Canvas({
    style: 'width: 900px; height: 400px;' 
  });
  canvas.ready(function(){
    var polyline = Polyline({
      strokeWeight: '5px',
      strokeColor: 'red',
      points: '0,0 100,100 150,100 150,200',
      filled: false,
      id: 'p'
    }); 
    polyline.points = [{x: 0, y: 0},{x: 100, y: 50},{x: 150, y: 100},{x: 200, y: 100},{x: 250, y: 150}];
    this.append(polyline);

    // 移动Polyline
    $('#next').click(function(){
        polyline.next(1000);
    });
    $('#prev').click(function(){
        polyline.prev(1000);
    });
  });
  canvas.appendTo(document.body);

  /*var fx = require('./src/fx/animate');
  $.extend(fx, require('./src/fx/fadeOut'), require('./src/fx/fadeIn'), require('./src/fx/fadeTo'));
  var EvtQueue = require('./src/EvtQueue');
  var q = EvtQueue.create();
  q.register('animate', function(release, dom, css, during){
    fx.animate(dom, css, during, function(){
      release();
    });
  }, $('#name')[0]);
  q.register('fadeOut', function(release, dom, during){
    fx.fadeOut(dom, during, function(){
      release();
    });
  }, $('#name')[0]);
  q.register('fadeIn', function(release, dom, during){
    fx.fadeIn(dom, during, function(){
      release();
    });
  }, $('#name')[0]);
  q.register('fadeTo', function(release, dom, opacity, during){
    fx.fadeTo(dom, opacity, during, function(){
      release();
    });
  }, $('#name')[0]);
  $('#cl').click(function(evt){
    q.call('animate', { 
      left: 300,
      color: '#ff00ee',
      backgroundColor: '#556523',
      top: 200
    }, 2000, function(evt){
      evt.release();
    });*/
    /*q.call('fadeIn', 4000, function(evt){
          evt.release();
        });
    q.call('fadeTo', 0.5, 1000, function(evt){
          evt.release();
        });
    q.call('fadeOut', 200, function(evt){
          evt.release();
        });
    q.call('fadeIn', 4000, function(evt){
          evt.release();
        });*/
  //});
});
