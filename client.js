// Nome: João Pedro Berno Zanutto
// nºUSP: 8956672

/*jshint esversion: 6 */
/*globals $:false */

$("document").ready(function () {
    var user = window.location.href.split('/').pop();

    var request = window.indexedDB.open("DBSystem2");
    var db;

    // Mensagem de erro caso o banco não consiga ser aberto
    request.onerror = function (event) {
        alert(request.errorCode);
    };

    // Inicializa o banco
    request.onsuccess = function (event) {
        db = request.result;
    };

    // EventHandler da entrada na loja de produtos
    $("#lojaButton").click(function () {
        $(".produto").remove();
        var stock = db.transaction("produto").objectStore("produto");
        stock.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if (cursor) {
                $("#productContents").append("<div class=\"col-md-6 produto\"> <div class=\"product\"> <h3>" +
                    cursor.value.pname + "</h3> <img src=\"" + cursor.value.imgURL +
                    "\" heigth=\"100px\" width=\"100px\" class=\"foto\"><p>" +
                    cursor.value.pdescription + "</p>" +
                    "<h4> R$ " + cursor.value.pprice + "</h4>" +
                    "<input value=\"0\" type=\"number\" class=\"sel\" min=\"0\" max=\"100\"></input>" +
                    "</div></div>");
                cursor.continue();
            }
        };
    });

    // EventHandler da entrada no carrinho de compras
    $("#buyBtn").click(function () {
        var allTotal = 0.0;
        
        $(".product").each(function () {
            $("#carrinhoProducts td").remove();
            if ($(this).children(".sel").val() === "0" || $(this).children(".sel").val() === undefined) {
            } else {
                let quantity = $(this).children(".sel").val();
                let obStore = db.transaction("produto").objectStore("produto");
                var request = obStore.index("pname");
                request.get($(this).children("h3").text()).onsuccess = function (event) {
                    let total = quantity * event.target.result.pprice;
                    allTotal = allTotal + total;
                    $("#allTotal h4").remove();
                    $("#allTotal").append("<h4>R$ " +allTotal + "</h4>");
                    $("#carrinhoProducts").append("<tr><td>" +
                        event.target.result.pname + "</td><td>" +
                        quantity + "</td><td>" +
                        event.target.result.pprice + "</td><td>" +
                        total + "</td></tr>");
                };
            }
        });
    });

    // EventHandler da confirmação da compra
    $("").click(function(){
        
    });


});
