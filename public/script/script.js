//slideshow
$(document).ready(function () {

    // color on change
    $('#modalProductColorOption').change(function () {
        // if size option is available
        var sizeOptionStatus = $('#modalProductSizeOption').is(':enabled');
        var theSizeSelected = $('#modalProductSizeOption').val();

        var theColorSelected = $(this).val();
        var theColorSelectedId = $('#modalAddToCart').val();
        var selectedData = {
            findData: {
                productId: theColorSelectedId,
                color: theColorSelected,
            }
        }
        // if size option available and selected
        var findQtyFromColor = 0;
        if (sizeOptionStatus && theSizeSelected != null && theSizeSelected != '') {
            selectedData.findData.size = theSizeSelected;
            findQtyFromColor = 1
        }
        if (findQtyFromColor || !sizeOptionStatus) {
            selectedData = JSON.stringify(selectedData);
            $.ajax({
                type: "post",
                datatype: "json",
                data: {
                    selectedData
                },
                url: '/api/colorSizeOnChange',
                success: function (doc) {
                    // // update size option
                    if (doc.length == 0 || doc[0].qty == 0) {
                        //if size and color out of stock
                        // disable qty select
                        $('#modalProductQuantityOption').prop('disabled', true);
                        $('#modalProductQuantityOption').empty();
                        $('#modalProductQuantityOption').css('display', 'none');
                        // disable Add To Cart Button
                        $('#modalAddToCart').text('Out of Stock');
                        $('#modalAddToCart').prop('disabled', true);
                    } else {
                        //if size and color available in stock
                        $('#modalProductQuantityOption').css('display', 'block');
                        $('#modalProductQuantityOption').prop('disabled', false);
                        $('#modalProductQuantityOption').empty();
                        $('#modalProductQuantityOption').append('<option value="" disabled selected>Quantity</option>');
                        for (var i = 0; i < doc[0].qty; i++) {
                            var qtySelection = i + 1;
                            $('#modalProductQuantityOption').append('<option value="' + qtySelection + '">' + qtySelection + '</option>');
                        }
                    }
                }
            });
        }
    });


    $('#modalProductSizeOption').change(function () {
        // if color option is available
        var colorOptionStatus = $('#modalProductColorOption').is(':enabled');
        var theColorSelected = $('#modalProductColorOption').val();

        var theSizeSelected = $(this).val();
        var theSizeSelectedId = $('#modalAddToCart').val();
        var selectedData = {
            findData: {
                productId: theSizeSelectedId,
                size: theSizeSelected,
            }
        }

        // if size option available and selected
        var findQtyFromSize = 0;
        if (colorOptionStatus && theColorSelected != null && theColorSelected != '') {
            selectedData.findData.color = theColorSelected;
            findQtyFromSize = 1;
        }

        if (findQtyFromSize || !colorOptionStatus) {

            selectedData = JSON.stringify(selectedData);
            $.ajax({
                type: "post",
                datatype: "json",
                data: {
                    selectedData
                },
                url: '/api/colorSizeOnChange',
                success: function (doc) {
                    // // update size option
                    if (doc.length == 0 || doc[0].qty == 0) {
                        //if size and color out of stock
                        $('#modalAddToCart').text('Out of Stock');
                        $('#modalAddToCart').prop('disabled', true);
                    } else {
                        //if size and color available in stock
                        $('#modalProductQuantityOption').css('display', 'block');
                        $('#modalProductQuantityOption').prop('disabled', false);
                        $('#modalProductQuantityOption').empty();
                        $('#modalProductQuantityOption').append('<option value="" disabled selected>Quantity</option>');
                        for (var i = 0; i < doc[0].qty; i++) {
                            var qtySelection = i + 1;
                            $('#modalProductQuantityOption').append('<option value="' + qtySelection + '">' + qtySelection + '</option>');
                        }
                    }
                }
            });
        }
    });

    $("#navCategoryLink > a").click(function () {
        // remove highlight nav link and <i>
        $("#navCategoryLink > a").removeClass('logoBlueBG');
        $("#navCategoryLink > a > i").removeClass('fa fa-caret-right w3-margin-right');

        // add highlight to nav link and add <i>
        $(this).addClass('logoBlueBG');
        jQuery(this).children("i").addClass('fa fa-caret-right w3-margin-right');

        
    });

}); //document ready


function plusDivs(n) {
    showDivs(slideIndex += n);
}

function currentDiv(n) {
    showDivs(slideIndex = n);

}


//slide show
function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    if (n > x.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = x.length
    }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" w3-red", "");
    }
    x[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " w3-red";

}

function userLoginBtn() {
    document.getElementById('userLogin').style.display = 'block';
    $('.userInfo').css('display', 'none');
    $('.loginPage').css('display', 'none');
    $.ajax({
        datatype: 'json',
        url: '/api/',
        success: function (data) {
            dataJson = JSON.parse(data);
            if (dataJson.login) {
                $('.userInfo').css('display', 'block');
            } else {
                $('.loginPage').css('display', 'block');
            }
        },
    });
}

function checkLoginForBtn(n) {
    $.ajax({
        datatype: 'json',
        url: '/api/',
        success: function (data) {
            dataJson = JSON.parse(data);
            if (dataJson.login) {
                $('#' + n).css('display', 'block');
            } else {
                document.getElementById('userLogin').style.display = 'block';
                $('.userInfo').css('display', 'none');
                $('.loginPage').css('display', 'none');
                $('.loginPage').css('display', 'block');
            }
        },
    });
}

function productOnClick(pId) {
    document.getElementById('ProductDetail').style.display = 'block';
    document.getElementById('cartModalLoading').style.display = 'block';
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: '/api/addToCartModal',
        data: {
            id: pId
        },
        success: function (doc) {


            dataJson = JSON.parse(doc);
            var price = dataJson['productInfo'].price.split(".");
            $('#productInfoName').text(dataJson['productInfo'].productName)
            $("#cartModalImg").attr("src", 'img/' + dataJson['productInfo'].img);
            $('#cartModalDescription').text(dataJson['productInfo'].description);
            $('#cartModalPrice0').text('$' + price[0]);
            $('#cartModalPrice1').text('.' + price[1]);
            $('#modalAddToCart').val(dataJson['productInfo']._id);
            var productQty = dataJson['productQty'];

            // initial: disable and empty all option
            $('#modalProductColorOption').prop('disabled', true);
            $('#modalProductColorOption').empty();
            $('#modalProductColorOption').css('display', 'none');

            $('#modalProductSizeOption').prop('disabled', true);
            $('#modalProductSizeOption').empty();
            $('#modalProductSizeOption').css('display', 'none');

            $('#modalProductQuantityOption').prop('disabled', true);
            $('#modalProductQuantityOption').empty();
            $('#modalProductQuantityOption').css('display', 'none');
            $('#modalProductQuantityOption').append('<option value="" disabled selected>Quantity</option>');


            // check in stock
            var numQty = 0;
            var colorOption, sizeOption = false;
            var appendDefaultColor = 1;
            var appendDefaultSize = 1;
            for (var i = 0; i < productQty.length; i++) {
                numQty = numQty + productQty[i].qty;

                // add option of color
                if (productQty[i].color == null || productQty[i].color == "") {} else {
                    if (appendDefaultColor) {
                        $('#modalProductColorOption').css('display', 'block');
                        appendDefaultColor = 0;

                        $('#modalProductColorOption').prop('disabled', false);
                        $('#modalProductColorOption').append('<option value="" disabled selected>Color</option>');
                    }

                    // remove duplicate color option
                    if (!$('select#modalProductColorOption option[value="' + productQty[i].color + '"]').length) {
                        // add new color option
                        $('#modalProductColorOption').append(' <option value="' + productQty[i].color + '">' + productQty[i].color + '</option>');
                    }


                }

                // add option of size
                if (productQty[i].size == null || productQty[i].size == "") {} else {
                    if (appendDefaultSize) {
                        $('#modalProductSizeOption').css('display', 'block');
                        appendDefaultSize = 0;

                        $('#modalProductSizeOption').prop('disabled', false);
                        $('#modalProductSizeOption').append('<option value="" disabled selected>Size</option>');
                    }
                    if (!$('select#modalProductSizeOption option[value="' + productQty[i].size + '"]').length) {
                        //add new size option
                        $('#modalProductSizeOption').append(' <option value="' + productQty[i].size + '">' + productQty[i].size + '</option>');
                    }

                }
            }

            // show quantity option when Color and Size are not available
            if (appendDefaultColor && appendDefaultSize) {

                if (numQty <= 0) {
                    $('#modalSizeUiOption').remove();
                    $('#modalAddToCart').text('Out of Stock');
                    $('#modalAddToCart').prop('disabled', true);
                } else {
                    $('#modalProductQuantityOption').css('display', 'block');
                    appendDefaultSize = 0;

                    $('#modalProductQuantityOption').prop('disabled', false);

                    for (var numberQty = 0; numberQty < numQty; numberQty++) {
                        var NumQtyPlusOne = numberQty + 1;
                        $('#modalProductQuantityOption').append('<option value="' + NumQtyPlusOne + '">' + NumQtyPlusOne + '</option>');
                    }
                }
            }
            // check button status when out of stock
            if (numQty <= 0) {
                $('#modalSizeUiOption').remove();
                $('#modalAddToCart').text('Out of Stock');
                $('#modalAddToCart').prop('disabled', true);
            } else {
                $('#modalAddToCart').text('Add to Cart');
                $('#modalAddToCart').prop('disabled', false);
            }

            document.getElementById('cartModalLoading').style.display = 'none';
        }
    });

}

// function addOptionToModalProductInfo(addToId, optionValue, OptionDescription) {
//     $('#' + addToId).append('<option value="" disabled selected>' + OptionDescription + '</option>');
//     for (var oi = 0; oi < optionValue.length;)
//         $('#' + addToId).append(' <option value="' + optionValue + '">' + optionValue + '</option>');
// }