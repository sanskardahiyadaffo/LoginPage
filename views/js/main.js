let value = '';
let image_data;
(function ($) {
    "use strict";
    /*****************************************************
     * Custun settings
     * ************** */
    $('#photoInput').change(
        () => {
            if (document.getElementById('photoInput').value != '') {
                image_data = document.getElementById('photo-text').innerHTML;
                document.getElementById('photo-text').innerHTML = '';


            } else {
                document.getElementById('photo-text').innerHTML = image_data;
            }
        }
    );

    $('#photoInput').change(function (elm) {
        let path = elm.target.files[0];

        if ($.inArray(path.type, ['image/gif', 'image/jpeg', 'image/png']) >= 0) {
            var FR = new FileReader();
            FR.onload = (data) => {
                path = data.target.result;
                console.log(path);
                document.getElementById('DisplayPhoto').src = path;
                // $('#photo-DIV').css("background-image", `url('${path}')`)
            }
            FR.readAsDataURL(path)
        } else {
            alert('Invalid File Type\n*Only jpeg, png and gif are allowed..!!');
        }
    });

    $('#pass2').keyup(function () {
        // console.log('Done');
        value = $('#pass1').val().trim();
        let val = $(this).val().trim();
        if (val == value.substr(0, val.length).trim()) {
            $('#pass2').css({ 'background-color': 'white' });
            $('#pass1').css({ 'background-color': 'white' });
        } else {
            $('#pass2').css({ 'background-color': 'rgba(255,0,0,0.1)' });
            $('#pass1').css({ 'background-color': 'rgba(255,0,0,0.1)' });
        }
    });
    $('#pass1').keyup(function () {
        // console.log('Done');
        value = $('#pass2').val().trim();
        let val = $(this).val().trim();
        if (val == value.substr(0, val.length).trim()) {
            $('#pass2').css({ 'background-color': 'white' });
            $('#pass1').css({ 'background-color': 'white' });
        } else {
            $('#pass2').css({ 'background-color': 'rgba(255,0,0,0.1)' });
            $('#pass1').css({ 'background-color': 'rgba(255,0,0,0.1)' });
        }
        if ($(this).val().trim() != "") {
            $('#pass2').prop('disabled', false);
        } else {
            $('#pass2').prop('disabled', true);
            $('#pass2').css({ 'background-color': 'rgba(0, 0, 0, 0.1)' });
        }
    });
    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function () {
        $(this).on('blur', function () {
            // console.log($(this).val());

            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    });


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
        var check = true;
        if ($('#pass1').val() && $('#pass2').val())
            if ($('#pass1').val().trim() != $('#pass2').val().trim()) {
                check = false;
                showValidate('#pass1');
                showValidate('#pass2');

            }

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            console.log($(input).attr('id'));

            if ($(input).val().trim() == '') {
                if ($(input).attr('id') == 'pass1' || $(input).attr('id') == 'pass2') {
                    return true
                }
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function () {
        if (showPass == 0) {
            $(this).next('input').attr('type', 'text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type', 'password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }

    });


})(jQuery);