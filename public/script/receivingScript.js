var rowIndexNum;
$(document).ready(function () {
    // datatable set up
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

        //get the row index when click
        rowIndexNum = table.row(this).index();

        //add name to productQty modal
        $("#productQty").attr("name", data._id);

        // display product information in the header of modal
        $('#modalReceivingProductName').text(data.productName);
        $('#modalReceivingIPN').text(data.ipn);
        
        
        showProductQtyInModal(data._id);
    });

    $('#addNewLocationForm').submit(function (event) {
        event.preventDefault();
        var newLocationQtyArray = $('#addNewLocationForm').serializeArray();

        var newLocationQty = {};
        for (var i = 0; i < newLocationQtyArray.length; i++) {
            newLocationQty[newLocationQtyArray[i]['name']] = newLocationQtyArray[i]['value'];
        }

        var jsonNewLocationQty = JSON.stringify(newLocationQty);
        $.ajax({
            type: "post",
            dataType: "json",
            url: "/api/newLocationQty",
            data: {
                jsonNewLocationQty
            },
            success: function (newLQty) {
                closeAddNewLocationForm();
                
                showProductQtyInModal($("#productQty").attr("name"));
            }
        });

    });




}); //document.ready end

function modalReceiveBtnToggle(inputId) {
    $('#' + inputId).toggle();
}

function modalReceivingEnterNumberBtn(btnVal) {
    var qtyToUpdate = $("input[name=" + btnVal + "]").val();

    var qtyToUpdateArry = {
        pQtyId: btnVal,
        qtyToUpdate: qtyToUpdate,
    }

    jsonQtyToUpdateArry = JSON.stringify(qtyToUpdateArry);

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/api/qtyUpdate',
        data: {
            jsonQtyToUpdateArry
        },
        success: function (newQty) {

            //update display value in table row
            $('#td' + btnVal).html(newQty.qty);

            // clear input field
            $("input[name=" + btnVal + "]").val('');

            // hide input field
            $('#' + btnVal).toggle();
        }
    });
}



function addNewLocationBtn() {
    document.getElementById('addNewLocationForm').style.display = "block";
    document.getElementById('addNewLocationBtn').style.display = "none";
    document.getElementById("addNewLocationForm").reset();

    $('#addNewLocationForm select').empty();

    var addLocationOption = $('#addNewLocationForm select').append('<option name="" value="" disabled selected>Choose your option</option>');


    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/api/location',
        success: function (locationList) {
            for (let i in locationList) {
                addLocationOption.append('<option value="' + locationList[i]._id + '">' + locationList[i].location + '</option>');
            }
        }
    });

    // add productId to addNewLocationForm input: display: none
    var receiveProductIpnToNewLocation = $('#modalReceivingIPN').text();
    $('#newLocationQtyProductIPN').val(receiveProductIpnToNewLocation);
}

function closeAddNewLocationForm() {
    document.getElementById("addNewLocationForm").reset();
    document.getElementById('addNewLocationForm').style.display = "none";
    document.getElementById('addNewLocationBtn').style.display = "block";
}

function productQtyClose() {


    closeAddNewLocationForm();
    document.getElementById('productQty').style.display = 'none';
}

function showProductQtyInModal(data_id) {
    $("#modalReceivingTable").empty();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/api/showProductQty',
        data: {
            productId: data_id
        },
        success: function (doc) {





            if (Object.keys(doc).length > 0) {
                $('<tr><th>Quantity</th><th>Color</th><th>Size</th><th>Location</th><th style="width: 200px">Receive</th></tr>').appendTo('#modalReceivingTable');


                // loop all info in table
                for (var i in doc) {
                    var TR = $('<tr></tr>');
                    var TD = $('<td></td>');


                    $('<td id="td' + doc[i]._id + '">' + doc[i].qty + '</td>').appendTo(TR);
                    $('<td>' + doc[i].color + '</td>').appendTo(TR);
                    $('<td>' + doc[i].size + '</td>').appendTo(TR);
                    $('<td>' + doc[i].locationId.location + '</td>').appendTo(TR);

                    // btn to show input and enter button
                    var receiveBtn = $('<button style="display: inline-block" onclick="modalReceiveBtnToggle($(this).val())">+</button>');
                    receiveBtn.val(doc[i]._id);
                    TD.append(receiveBtn);

                    // append input after "+"" button
                    TD.append('<span id="' + doc[i]._id + '" style="display:none"><span><input style="width: 80px;" name="' + doc[i]._id + '" type="number"></span><span><button value="' + doc[i]._id + '" onclick="modalReceivingEnterNumberBtn($(this).val())">Enter</button></span></span>');

                    TD.appendTo(TR);
                    TR.addClass('w3-border-bottom w3-hover-sand');
                    TR.appendTo('#modalReceivingTable');
                }
            } else {
                $('<p>0 result.</p>').appendTo('#modalReceivingTable')
            }

        }
    });
}