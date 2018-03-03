//slideshow
$(document).ready(function () {


});


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

function userLoginBtn(){
    document.getElementById('userLogin').style.display='block';
    $('.userInfo').css('display', 'none');
    $('.loginPage').css('display', 'none');
    $.ajax({
        datatype: 'json',
        url:'/api/',
        success:function(data){
            dataJson = JSON.parse(data);
            if(dataJson.login){
                $('.userInfo').css('display', 'block');
            }else{
                $('.loginPage').css('display', 'block');
            }
        },
    });
}

function checkLoginForBtn(n){
    $.ajax({
        datatype: 'json',
        url:'/api/',
        success:function(data){
            dataJson = JSON.parse(data);
            if(dataJson.login){
                $('#'+ n).css('display', 'block');
            }else{
                document.getElementById('userLogin').style.display='block';
                $('.userInfo').css('display', 'none');
                $('.loginPage').css('display', 'none');
                $('.loginPage').css('display', 'block');
            }
        },
    });
}

function productOnClick(pId){
    document.getElementById('ProductDetail').style.display='block';
    document.getElementById('cartModalLoading').style.display='block';
    $.ajax({
        type:'POST',
        datatype: 'json',
        url:'/api/addToCartModal',
        data: {id: pId},
        success:function(doc){
            document.getElementById('cartModalLoading').style.display='none';
            dataJson = JSON.parse(doc);
            var price = dataJson['productInfo'].price.split(".");
            $('#productInfoName').text(dataJson['productInfo'].productName)
            $("#cartModalImg").attr("src",'img/'+dataJson['productInfo'].img);
            $('#cartModalDescription').text(dataJson['productInfo'].description);
            $('#cartModalPrice0').text('$'+price[0]);
            $('#cartModalPrice1').text('.'+price[1]);
            if(dataJson['productQty']){
                // console.log(data);
                // continue here&&&&&&&&&&&&&&&&&&*******************&^^^^^^^^^^^^^^^^%%


            }
        },
    });
}

//function getLoginInfo() {
//    $.ajax({
//        type: 'post',
//        url: 'content/loginStatus.php',
//        data: {
//            userData: "check",
//        },
//        error: function () {
//            console.log("ERROR");
//        },
//        async: true,
//        dataType: 'json',
//        success: function (data) {
//            console.log(data);
//            if (typeof data['adsf'] === 'undefined') {
//                // does not exist
//            } else {
//                console.log('need login');
//            }
//        },
//        type: 'GET'
//    });
//}








