// Nome: João Pedro Berno Zanutto
// nºUSP: 8956672

/*jshint esversion: 6 */
/*globals $:false */

$("document").ready(function(){
    var user = window.location.href.split('/').pop();
    
    var request = window.indexedDB.open("DBSystem2");
    var db;
    
    // Mensagem de erro caso o banco não consiga ser aberto
    request.onerror = function(event) {
        alert(request.errorCode);
    };
    
    // Inicializa o banco
    request.onsuccess = function(event) {
        db = request.result;
    };
    
    $("#lojaButton").click(function(){
        $(".produto").remove();
        
        var stock = db.transaction("produto").objectStore("produto");
        stock.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if(cursor){
                $("#productContents").append("<div class=\"col-md-6 produto\"> <div class=\"product\"> <h4>" +
                                            cursor.value.pname + "</h4> <img src=\"" + cursor.value.imgURL + 
                                             "\" heigth=\"100px\" width=\"100px\" class=\"foto\"><p>" +
                                            cursor.value.pdescription+ "</p>"+
                                            "<button type=\"button\" class=\"btn btn-success\">Comprar</button>"+
                                            "</div></div>");
                cursor.continue();
            }
        };
    });
});