jQuery(document).ready(function ($) {
  var player = document.querySelector('audio');
  var $play_button = $('.play');
  var $pause_button = $('.pause');
  var $bar = $('.bar');
  var update_time;

  function startNupdate() {
    document.querySelector('audio').pause();
    player.play();
    $play_button.hide();
    $pause_button.show();

    function pad(num, size) {
      var s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    }
    clearInterval(update_time);
    update_time = setInterval(function () {
      var gradients = '';
      for (var i = 0; i < player.buffered.length; i++) {
        var perc_start = (player.buffered.start(i) / player.duration * 100).toString();
        var perc_end = (player.buffered.end(i) / player.duration * 100).toString();
      }

      var minutes = pad(Math.floor(player.currentTime / 60), 2);
      var seconds = pad(Math.floor(player.currentTime - minutes * 60), 2);
      $('.elapsed span').html(minutes + ':' + seconds);
      $('.position-marker').css({
        "left": player.currentTime / player.duration * 100 + '%' });

    }, 1000);
  }

  $bar.on('click', function (event) {
    var pos_perc = event.offsetX / event.target.offsetWidth;
    player.currentTime = player.duration * pos_perc;
    startNupdate();
  });

  $play_button.on('click', function () {
    startNupdate();
  });
  $pause_button.on('click', function () {
    player.pause();
    $pause_button.hide();
    $play_button.show();
    clearInterval(update_time);
  });
});