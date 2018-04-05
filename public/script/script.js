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
                        //if size and color available, enable Add to cart btn
                        $('#modalAddToCart').text('Add To Cart');
                        $('#modalAddToCart').prop('disabled', false);
                        //if size and color available, enable Add to Cart btn
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
                        // disable qty select
                        $('#modalProductQuantityOption').prop('disabled', true);
                        $('#modalProductQuantityOption').empty();
                        $('#modalProductQuantityOption').css('display', 'none');
                        //if size and color out of stock
                        $('#modalAddToCart').text('Out of Stock');
                        $('#modalAddToCart').prop('disabled', true);
                    } else {
                        //if size and color available, enable Add to cart btn
                        $('#modalAddToCart').text('Add To Cart');
                        $('#modalAddToCart').prop('disabled', false);
                        //if size and color available, enable qty option
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

    $("#addToCartForm").on("submit", function (event) {
        event.preventDefault();
        //check login status
        // if not logged in, display login modal

        // if logged in, add items to database
        var addToCartFormData = $(this).serializeArray();
        // addToCartFormData = JSON.stringify(addToCartFormData);
        var convertFormData = objectifyForm(addToCartFormData);
        console.log(convertFormData);
        // $('.fa-shopping-cart').css("color", "red");
        // alert('Add To Cart');
    });


}); //document ready




// nav onClick
function navOnClick(id) {
    $.ajax({
        type: 'post',
        datatype: 'json',
        url: '/api/displayProductByCategory',
        data: {
            categoryId: id,
        },
        success: function (doc) {
            // remove highlight nav link and <i>
            $("#navCategoryLink > a").removeClass('logoBlueBG');
            $("#navCategoryLink > a > i").removeClass('fa fa-caret-right w3-margin-right');
            // remove highlight in acc link
            $("#navAccList > a").removeClass('logoBlueBG');
            $("#navAccList > a > i").removeClass('fa fa-caret-right w3-margin-right');

            // add highlight to nav link
            $("#" + id).addClass('logoBlueBG');
            $("#" + id + "> i").addClass('fa fa-caret-right w3-margin-right');

            console.log(doc);
            // display products to product grid
            $("#productGrid").empty();
            if (doc == null) {
                $("#totalItemFound >p").empty().text('0 item');
                $("#productGrid").append('<h3>0 result.</h3>');
            } else {
                for (var i = 0; i < doc.length; i++) {
                    //     var price = doc[i].productId.price.split(".");

                    //     var grid = document.querySelector('#productGrid');
                    //     var item = document.createElement('article');

                    // salvattore.appendElements(grid, [item]);
                    // item.outerHTML = 'I’ve been appended!';

                    //    $("#productGrid").append('<div class="w3-card-4"><div class="w3-display-container w3-text-white"><a id="'+ doc[i].productId._id +'" onclick="productOnClick(this.id)"><img src="img/'+ doc[i].productId.img +'" style="width: 100%"></a></div><div class="productRowInfo"><div class="w3-padding-small"><p class="productPrice"><span class="w3-xlarge">'+ price[0] +'<span class="w3-small">.'+ price[1] +'</span></span></p><p class="productNameOnHomePage">'+ doc[i].productId.productName +'</p></div></div></div>');


                }
            }

        }
    });
}


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
            $('#addToCartFormProductId').val(dataJson['productInfo']._id);
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

function objectifyForm(formArray) {//serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
      returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}