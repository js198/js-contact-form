$(document).ready(function() {

  var firstName = $('input[type=text][name=firstName]');
  var surname = $('input[type=text][name=surname]');
  var dob = $('input[type=text][name=dateOfBirth]');
  var msg = $('textarea[type=text][name=message]');
  var postcode = $('input[type=text][name=postcode]');
  var pclookup = $('#postcode_lookup');
  var houseno = $('input[type=text][name=houseno]');
  var addressBox = [$('#line1'), $('#town'), $('#county'), $('#postcode')];
  var checkBox = $('input[type=checkbox][name=checkBox]');
  var submitBtn = $('#submitButton');

  //clear fields not working
  var clearFields = function() {
    firstName.val('');
    surname.val('');
    dob.val('');
    postcode.val('');
    pclookup.val('');
    houseno.val('');
    for (var i = 0; i < addressBox.length; i++) {
      addressBox[i].val('');
    }
    msg.val('');
    checkBox.prop('checked', false);
  }

  clearFields();

  //validater plugin
  $('#contactForm').validate({
    rules: {
      firstName: {
        required: true,
        lettersonly: true,
        minlength: 1
      },
      surname: {
        required: true,
        lettersonly: true,
        minlength: 1
      },
      dateOfBirth: {
        required: true,
        dobFormat: true
      },
      line1: {
        required: true
      },
      town: {
        required: true
      },
      postcode: {
        required: true,
        postcodeUK: true
      },
      message: {
        required: true,
        minlength: 5
      },
      checkBox: 'required'
    },
    messages: {
      firstName: {
        required: "You've gotta have a name :-)"
      },
      surname: {
        required: "Don't forget your surname."
      },
      dateOfBirth: {
        required: "Please enter your date of birth."
      },
      line1: {
        required: "Don't forget the house no. and street."
      },
      town: {
        required: "And town!"
      },
      postcode: {
        required: "Please enter your UK postcode."
      },
      message: {
        required: "You've gotta have a message."
      },
      checkBox: {
        required: false
      }
    }
  });

  //additional validator methods
  $.validator.addMethod("postcodeUK", function(value, element) {
    return this.optional(element) || /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test(value);
  }, "Must be a valid UK postcode");

  $.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[a-z]+$/i.test(value);
  }, "Letters only please");

  $.validator.addMethod("dobFormat", function(value, element) {
    return this.optional(element) || /^((?:0[0-9])|(?:[1-2][0-9])|(?:3[0-1]))\/((?:0[1-9])|(?:1[0-2‌​]))\/((?:19|20)\d{2})$/i.test(value);
  }, "Make sure it follows this format: DD/MM/YYYY");

  //postcode lookup api
  $('#postcode_lookup').getAddress({
    api_key: 'CbFmQdKhCESmAmpH7Iz1GQ11303',
    //addressSearch: "https://api.getAddress.io/find/"+postcode+"/"+houseno+"?api-key="+api_key,
    output_fields: {
      line_1: '#line1',
      post_town: '#town',
      county: '#county',
      postcode: '#postcode'
    }
  });

  //submit button
  $('#contactForm').on('submit', function(e) {
    var form = $('#contactForm').valid();
    console.log(form);
    e.preventDefault();

    function createTextFile() {

      //sort through address values
      var newAddressArr = [];
      var address;

      for (var i = 0; i < addressBox.length; i++) {
        (function(e) {
          l = e;
          newAddressArr.push(addressBox[l].val());
        })(i);
      }

      address = newAddressArr.join(', ');
      address = address.replace(/\s,/g, '');

      //create text file
      console.log(firstName.val() + " " + surname.val() + "(D.O.B: " + dob.val() + ") with the address: " + address + " sent the following message: " + msg.val());
      console.log('submitted');

      var blob = new Blob([firstName.val() + " " + surname.val() + "(date of birth: " + dob.val() + ") from the following address: " + address + " sent the following message: " + msg.val()], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, "contactenquiry.txt");
    }

    if (form == true) {
      createTextFile();
      $('.messageSent').addClass('activate');
      //setTimeout(function(){$('.messageSent').removeClass('activate');}, 6000);
      //submit leads to infinite loop
      //$('#contactForm').submit();
      //refresh page after allowing createTextFile() to run
      clearFields();
      $('html, body').animate({
        scrollTop: 0
      }, 'slow');
      setTimeout(function() {
        location.reload();
      }, 3000);
    } else {
      e.preventDefault();
      console.log('somethings up');
    }
  });

});	