// Initialize app
var myApp = new Framework7();
var $$ = Dom7;
var idList = [];
var nameList = [];
var address = "";
var addressNick = "";
var time = "";
var socket = io('http://localhost:3000');

//Define Swiper element
var mainSwiper = myApp.swiper('.swiper-container', {
  pagination:'.swiper-pagination'
});

//With
//Get all checked names and gather which names are which. Handle sumbit box.


$( ".name-li" ).click(function() {
  if (idList.length == 0) {
    $('.before').append('<div class="sumbmit-with"><p id="test" class="confirm-with close-popup">Confirm</p></div>')
  }
  if ( $.inArray($(this).children('span').attr("_id"), idList) > -1 ) {

    var index = idList.indexOf($(this).children('span').attr("_id"));
    console.log(index);
    idList.splice(index, 1);
    nameList.splice(index,1);
    var arrString = JSON.stringify(idList)
    if (arrString == "[]") {
      $('.before').empty();
    }
    $(this).css("font-weight", "400");
    $(this).children('.name-check').css("background-color", "white");

  }else {

    idList.push($(this).children('span').attr("_id"));
    nameList.push($(this).children('span').text());
    $(this).css("font-weight", "700");
    $(this).children('.name-check').css("background-color", "#c0e7ef");

  }
});

//Place results into box.
$(document).on('click','#test',function(){
  var first = nameList[0];
  var num = idList.length - 1;
  if (num == 0) {
    $('.who').children('span').text(''+first+'')
  }else if(num == 1){
    $('.who').children('span').text(''+first+' and '+num+' other ...')
  }else {
    $('.who').children('span').text(''+first+' and '+num+' others ...')
  }
});


//Deal with at popup. Store at Values
$( ".time" ).click(function() {
  $('.at-popup').fadeIn();
});


$( ".at-submit" ).click(function() {
  address = $('.at-address').val();
  addressNick = $('.at-nick').val();
  time = $('.at-time').val();
  $('.time').children('span').text(addressNick);
  $('.at-popup').fadeOut();
});

//Package data to the server.

$( ".submit" ).click(function() {
  var arrString = JSON.stringify(idList)

  //Tell the user is not all required feilds are needed

  if (addressNick == "" || $('.verb-input').val() == "" || arrString == "[]" || time == "" ) {
    alert('Please fill out all fields')
  }else if(address == "") {
    var serverData = {
      friendId: idList,
      addressNick: addressNick,
      time: time,
      verb: $('.verb-input').val()
    };
    socket.emit('newEvent', serverData,0)
    $('.at-nick').val('');
    $('.at-time').val('');
    $('.at-address').val('');
  }else {
    var serverData = {
      friendId: idList,
      address: address,
      addressNick: addressNick,
      time: time,
      verb: $('.verb-input').val()
    }
    socket.emit('newEvent', serverData,1)
    $('.at-nick').val('');
    $('.at-time').val('');
    $('.at-address').val('');
  }
});

//Event sucsessfull callback

socket.on('eventSuc', function (venue) {
	eventAddSuc();
})

function eventAddSuc() {
  $('.at-popup').after('<div class="suc"><h1>Event Created!</h1><div onclick="$(\'.suc\').fadeOut();" class="suc-submit">Cool</div></div>')
  $('.suc').fadeIn();

  //Reset Inputs
  var idList = [];
  var nameList = [];
  var address = "";
  var addressNick = "";
  var time = "";
  $('.verb-input').val('')
  $('.who').children('span').text('')
  $('.time').children('span').text('');
}
