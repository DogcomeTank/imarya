

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

        // find item in productQty
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
                        //if size and color available, change value of addToCartFormProductQtyId
                        $('#addToCartFormProductQtyId').val(doc[0]._id);
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

        // find item in productQty
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
                        //if size and color available, change value of addToCartFormProductQtyId
                        $('#addToCartFormProductQtyId').val(doc[0]._id);
                        //if size and color available, enable Add to cart btn
                        $('#modalAddToCart').text('Add To Cart');
                        $('#modalAddToCart').prop('disabled', false);
                        ``
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

    // $("#addToCartForm").on("change", function(e){
    //     var an = $("#addToCartForm").serializeArray();
    //     console.log(an);
    // })
    $("#addToCartForm").on("submit", function (event) {
        event.preventDefault();
        //check login status
        // if not logged in, display login modal

        // if logged in, add items to database
        var addToCartFormData = $(this).serializeArray();
        var convertFormData = objectifyForm(addToCartFormData);
        convertFormData = JSON.stringify(convertFormData);
        $.ajax({
            type: "POST",
            datatype: "JSON",
            data: {
                convertFormData
            },
            url: "/openApi/addToCart",
            success: function (doc) {
                // shopping cart animation
                $('.fa-shopping-cart').addClass('logoPink');
                $('.fa-shopping-cart').removeClass('runShoppingCartAnimation');
                setTimeout(" $('.fa-shopping-cart').addClass('runShoppingCartAnimation');", 100)

                // close modal 
                document.getElementById('ProductDetail').style.display = 'none';
            }
        });

    });


}); //document ready


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
                // display shopping cart madal
                $('#' + n).css('display', 'block');
                // display items
                shoppingCartItemDisplay();
            } else {
                // if not login, display user login modal
                document.getElementById('userLogin').style.display = 'block';
                $('.userInfo').css('display', 'none');
                $('.loginPage').css('display', 'none');
                $('.loginPage').css('display', 'block');
            }
        },
    });
}

function shoppingCartItemDisplay() {
    $.ajax({
        type: "POST",
        datatype: "json",
        url: "/openApi/userCartItems",
        success: function (doc) {
            // if not item in shopping cart
            if (doc.length == 0) {
                $('.scList').empty();
            } else {
                // if item found on database
                $('.scList').empty();
                var totalInShoppingCart = 0;
                for (var i = 0; i < doc.length; i++) {
                    // doc = userCart populate productId 
                    totalInShoppingCart = doc[i].qty * Number(doc[i].productId.price) + totalInShoppingCart;
                    $('.scList').append('<div class="w3-card-4 scCard w3-row whiteBG" id="remove' + doc[i]._id + '"><div class="w3-col s4"><img src="/img/' + doc[i].productId.img + '" class="scImg w3-padding-left w3-padding-right w3-margin-top"></div><div class="w3-padding-small scInfoRight w3-col s8"><h5 id="shoppingCartProductName">' + doc[i].productId.productName + '</h5><button class="removeBtnStyle removeItemInShoppingCart" onclick="removeItemInShoppingCart(this.value)" value="' + doc[i]._id + '"><i class="fa fa-remove"></i></button><p id="shoppingCartProductDescription">' + doc[i].productId.description + '</p><p><div class="w3-col s5 logoPink">$' + doc[i].productId.price + '</div><form onsubmit="event.preventDefault()" id="updateShoppingCartQtyForm" class="w3-col s5"><input type="text" name="productId" value="' + doc[i].productId._id + '" style="display:none"><input type="text" name="color" value="' + doc[i].color + '" style="display:none"><input type="text" name="size" value="' + doc[i].size + '" style="display:none"><span><button value="' + doc[i]._id + '" onclick="cartItemSub(this.value)" class="removeBtnStyle">-</button></span><span id="scItemQty'+ doc[i]._id +'">' + doc[i].qty + '</span><span><button value="' + doc[i]._id + '" onclick="cartItemAdd(this.value)" class="removeBtnStyle">+</button></span></form></p></div></div>');
                }
                totalInShoppingCart = Math.round(totalInShoppingCart * 100) / 100
                $('#shoppingCartTotal').text('$' + totalInShoppingCart);
            }
        }
    });
}

function removeItemInShoppingCart(a) {

    var deleteItemConform = confirm('Delete this item');
    if (deleteItemConform) {
        $.ajax({
            type: "post",
            datatype: "json",
            data: {a:a},
            url: "/openApi/removeItemInShoppingCart",
            success: function (doc) {
                if (doc.status) {
                    $("#remove" + doc.userCartId).remove();
                }
            }
        });
    }
}

function cartItemAdd(a) {
    let data = {};
    data.action = "a";
    data.val = a;
    $.ajax({
        type: 'post',
        datatype: 'json',
        data: data,
        url: '/openApi/addOrSubtractCartItem',
        success: function (doc) {
            if (doc.maxQty) {
                alert('Sorry, we only have ' + doc.qtyInStock + ' in stock.');
            }
            if(doc.newQty){
                $('#scItemQty'+a).text(doc.newQty);
            }
            updateShoppingCartTotal();
        }
    });
}

function cartItemSub(a) {
    let data = {};
    data.action = "s";
    data.val = a;

    $.ajax({
        type: 'post',
        datatype: 'json',
        data: data,
        url: '/openApi/addOrSubtractCartItem',
        success: function (doc) {
            if (doc.remove) {
                $('#remove' + a).remove();
            }
            if(doc.newQty){
                $('#scItemQty'+a).text(doc.newQty);
            }
            updateShoppingCartTotal();
        }
    });
}

function updateShoppingCartTotal(){
    $.ajax({
        type: 'post',
        datatype: 'json',
        url: '/openApi/getTotalInCart',
        success: function (doc) {
            doc = Math.round(doc * 100) / 100
            $('#shoppingCartTotal').text('$'+doc);
        }
    });
}



function objectifyForm(formArray) { //serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}