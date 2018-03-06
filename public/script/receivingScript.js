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


        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/api/showProductQty',
            data: {
                productId: data._id
            },
            success: function (doc) {
                console.log(doc);
                $('#modalReceivingProductName').text(data.productName);
                $('#modalReceivingIPN').text(data.ipn);
                $("#modalReceivingTable").empty();
                if (Object.keys(doc).length > 0) {
                    $('<tr><th>Quantity</th><th>Color</th><th>Size</th><th>Location</th><th>Receive</th></tr>').appendTo('#modalReceivingTable');

                    for (var i in doc) {
                        var TR = $('<tr></tr>');
                        var TD = $('<td></td>');
                        var receiveBtn = $('<button onclick="modalReceiveBtnToggle()">+</button>');
                        $('<td>'+ doc[i].qty +'</td>').appendTo(TR);
                        $('<td>'+ doc[i].color +'</td>').appendTo(TR);
                        $('<td>'+ doc[i].size +'</td>').appendTo(TR);
                        $('<td>'+ doc[i].locationId.location +'</td>').appendTo(TR);
                        receiveBtn.val(doc[i]._id);
                        TD.append(receiveBtn);
                        TD.append('<input type="number" min="0" style="display:none" name="' + doc[i]._id + '">');

                        TD.appendTo(TR);
                        TR.addClass('w3-border-bottom w3-hover-sand');
                        // TR.addClass('w3-hover-sand');
                        TR.appendTo('#modalReceivingTable');
                    }                   
                } else {
                    $('<p>0 result.</p>').appendTo('#modalReceivingTable')
                }

            }
        });
    });



}); //document.ready end

function modalReceiveBtnToggle(){
    $(selector).toggle(speed,easing,callback)
}