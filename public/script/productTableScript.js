let updateProductFormStatus = true;
var rowIndexNum;
$(document).ready(function () {

    // update product info when Update btn pressed on modal
    $("#updateProductInfoForm").submit(function (event) {
        event.preventDefault();
        var disabled = $('#updateProductInfoForm').find(':input:disabled').removeAttr(
            'disabled');

        var iniFormData = $(this).serializeArray();
        var returnArray = {};
        for (var i = 0; i < iniFormData.length; i++) {
            if (iniFormData[i]['name'] == 'productIdForm') {
                iniFormData[i]['name'] = '_id'
            }
            returnArray[iniFormData[i]['name']] = iniFormData[i]['value'];
        }


        var formData = JSON.stringify(returnArray);
        disabled.attr('disabled', 'disabled');
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                myData: formData
            },
            url: '/api/updateProductInformation',
            success: function (infoFromUpdated) {
                // update data in the datatable
                var temp = table.row(rowIndexNum).data();
                temp['ipn'] = infoFromUpdated.ipn;
                temp['productName'] = infoFromUpdated.productName;
                temp['description'] = infoFromUpdated.description;
                temp['by'] = infoFromUpdated.by;
                temp['price'] = infoFromUpdated.price;
                table.row(rowIndexNum).data(temp).draw();
                document.getElementById('productDetails').style.display = 'none';
            }
        });

    });


    // if modal Edit product info form change
    if (updateProductFormStatus) {
        $('#updateProductInfoForm').change(function () {
            $('#modalUpdateProductBtn').prop('disabled', false);
        });
    }


    var table = $('#products').DataTable({
        "ajax": "/api/allProducts",
        stateSave: true,
        "columns": [{
                "data": "_id"
            },
            {
                "data": "ipn"
            },
            {
                "data": "productName"
            },
            {
                "data": "description"
            },
            {
                "data": "by"
            },
            {
                "data": "img"
            },
            {
                "data": "price"
            },
            {
                "data": "createDay"
            }
        ],
    });

    // click listener for table, open modal of product location and Qty
    $('#products tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        document.getElementById('productQty').style.display = 'block';
        document.getElementById('modalProductName').innerHTML = data.productName;
        // add id to Edit btn
        $('#productQtyBtn').val(data._id);

        //get the row index when click
        rowIndexNum = table.row(this).index();


        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/api/showProductQty',
            data: {
                productId: data._id
            },
            success: function (doc) {

                // display location and Qty in modal
                $('#productQtyDiv').empty();
                var table = $('<table></table>').addClass('w3-table');
                table.append(
                    '<tr><th>Location</th><th>Size</th><th>Color</th><th>Quantity</th></tr>'
                )
                if (Object.keys(doc).length > 0) {
                    for (var key in doc) {
                        var tableR = $('<tr></tr>').addClass('w3-left-align');
                        tableR.append('<td>' + doc[key].locationId.location +
                            '</td>');
                        tableR.append('<td>' + doc[key].size +
                            '</td>');
                        tableR.append('<td>' + doc[key].color +
                            '</td>');
                        tableR.append('<td>' + doc[key].qty +
                            '</td>');
                        tableR.appendTo(table);
                    }
                    table.appendTo('#productQtyDiv');
                } else {
                    var noResult = $('<p></p>').text("0 result");
                    $(noResult).appendTo('#productQtyDiv');
                }

            }
        });
    });

    // add new product modal
    $("#addNewProductForm").submit(function (event) {
        event.preventDefault();
        var newProductFormData = $(this).serializeArray();
        var newProductFormDataArray = {};
        for (var i = 0; i < newProductFormData.length; i++) {
            newProductFormDataArray[newProductFormData[i]['name']] = newProductFormData[i]['value'];
        }

        newProductFormDataArray = JSON.stringify(newProductFormDataArray);

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/api/addNewProduct",
            data: {
                newProductFormDataArray
            },
            success: function(newAddedProduct){

                // add new row to datatables
                var row = newAddedProduct;
                table.row.add(row).draw(false);
                table.order([1, 'asc']).draw();
                table.page('last').draw(false);
                document.getElementById('addNewProduct').style.display='none';
            }
        });

    });



}); //document.ready end 

// display productEdit Form
function productEditBtn() {
    document.getElementById('productQty').style.display = 'none'
    document.getElementById('productDetails').style.display = 'block';
    // disable updateBtn if no change
    $('#modalUpdateProductBtn').prop('disabled', true);

    // empty productInfo Form
    updateProductFormStatus = false;
    document.getElementById("updateProductInfoForm").reset();
    updateProductFormStatus = true;


    let findProductInfo = $('#productQtyBtn').val();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/api/getProductById',
        data: {
            productId: findProductInfo
        },
        success: function (doc) {
            jsonDoc = JSON.stringify(doc);
            $('#productIdForm').val(doc._id);
            $('#ipn').val(doc.ipn);
            $('#productName').val(doc.productName);
            $('#description').val(doc.description);
            $('#by').val(doc.by);
            $('#img').val(doc.img);
            $('#price').val(doc.price);

        },
        error: function (err) {
            console.log(err);
        }
    });
}

function navProductLocationBtn() {
    document.getElementById('productLocation').style.display = 'block';
    $('#locationListTable').empty();
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/api/location',
        success: function (locationList) {

            for (var i in locationList) {
                var locationListTableRow = $('<tr></tr>');
                locationListTableRow.append('<td>' + locationList[i].location + '</td>');
                locationListTableRow.append('<td><button class="w3-btn" id="' + locationList[i]._id + '">Edit</button></td>');
                locationListTableRow.appendTo('#locationListTable');
                locationListTableRow.addClass('w3-border-bottom');
            }
        }
    });
}

function modalAddNewLocationBtn() {
    var newLocationVal = document.getElementById('modalNewLocationInput').value;

    if (!newLocationVal == null || !newLocationVal == '') {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/api/location',
            data: {
                location: newLocationVal
            },
            success: function (newAddedLocation) {
                $('#modalNewLocationInput').val('');
                var newLocationToList = $('<tr></tr>');
                newLocationToList.append('<td>' + newAddedLocation.location + '</td>');
                newLocationToList.append('<td><button class="w3-btn" id="' + newAddedLocation._id + '">Edit</button></td>');
                newLocationToList.appendTo('#locationListTable');
                newLocationToList.addClass('w3-border-bottom');
            }
        });
    }
}



function navCategoryBtn() {
    document.getElementById('addNewCategory').style.display = 'block';
    $('#categoryListTable').empty();
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/api/category',
        success: function (categoryList) {

            for (var i in categoryList) {
                var categoryListTableRow = $('<tr></tr>');
                categoryListTableRow.append('<td>' + categoryList[i].category + '</td>');
                categoryListTableRow.append('<td><button class="w3-btn" id="' + categoryList[i]._id + '">Edit</button></td>');
                categoryListTableRow.appendTo('#categoryListTable');
                categoryListTableRow.addClass('w3-border-bottom');
            }
        }
    });
}


function modalAddNewCategoryBtn() {
    var newCategoryVal = document.getElementById('modalNewCategoryInput').value;

    if (!newCategoryVal == null || !newCategoryVal == '') {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/api/category',
            data:{
                category: newCategoryVal
            },
            success: function (categoryList) {
                $('#modalNewCategoryInput').val('');
                var newCategoryToList = $('<tr></tr>');
                newCategoryToList.append('<td>' + categoryList.category + '</td>');
                newCategoryToList.append('<td><button class="w3-btn" id="' + categoryList._id + '">Edit</button></td>');
                newCategoryToList.appendTo('#categoryListTable');
                newCategoryToList.addClass('w3-border-bottom');
            }
        });
    }
}

function navNewProductBtn() {
    document.getElementById('addNewProduct').style.display = 'block';
    $('#addNewProductCategoryList').empty();
    $.ajax({
        type: "get",
        dataType: "json",
        url: "/api/category",
        success: function (catList) {
            for (var i in catList) {
                $('<input class="w3-check" type="checkbox" name="' + catList[i].category + '" value="' + catList[i]._id + '"><label>' + catList[i].category + '</label>').appendTo('#addNewProductCategoryList');
            }
        }
    });
}

// function modalAddNewProductBtn() {
//     event.preventDefault();

//     var newProductFormData = $(this).serializeArray();
//     var newProductFormDataArray = {};
//     for (var i = 0; i < newProductFormData.length; i++) {

//         newProductFormDataArray[newProductFormData[i]['name']] = newProductFormData[i]['value'];
//     }

// }