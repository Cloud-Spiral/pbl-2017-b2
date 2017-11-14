//アイコン上で吹き出しが出てくるように
$(function () {
  $('span').hover(function() {
    $(this).next('p').show();
  }, function(){
    $(this).next('p').hide();
  });
});