// Nome: João Pedro Berno Zanutto
// nºUSP: 8956672

/*jshint esversion: 6 */
/*globals $:false */

$("document").ready(function(){
    var request = window.indexedDB.open("DBSystem2");
    var db;
    
    // Mensagem de erro caso o banco não consiga ser aberto
    request.onerror = function(event) {
        alert(request.errorCode);
    };
    
    // upgrade needed do banco, cria as tabelas e altera caso necessário
    request.onupgradeneeded = function(event){
        db = request.result;
        
        // Cria a tabela pessoas
        let people = db.createObjectStore("people", {keyPath: "usr"});
        people.createIndex("mail", "mail", {unique : true});
        people.createIndex("tel", "tel", {unique: true});
        
        // Cria a tabela pessoas
        let produto = db.createObjectStore("produto", {keyPath: "pid"});
        produto.createIndex("pname", "pname", {unique: false});
        
        // Cria a tabela serviços
        let service = db.createObjectStore("service", {keyPath: "sid"});
        service.createIndex("sname", "sname", {unique: true});
    };
    
    // Inicializa o banco
    request.onsuccess = function(event) {
        db = request.result;
    };
    
    //Modelo de pessoa
    //  usr      PK
    //  pwd
    //  name
    //  email    UNQ
    //  tel      UNQ
    //  address
    //  type     'adm' or 'client'
    
    // EventHandler do cadastro de novo administrador
    $("#addAdmin").click(function() {
        let person = { usr: $("#ausr").val(), pwd: $("#apwd").val(), name: $("#aname").val(), mail: $("#amail").val(), tel: $("#atel").val(), address: "none", type: "adm"};
        
        if(person.usr !== "" || person.pwd !== "" || person.name !== "" || person.mail !== "" || person.tel !== "")
            addToTable(person, "people");
        else
            alert("Nenhum campo pode estar em branco!");
    });
    
    // EventHandler do cadastro de novo cliente
    $("#addClient").click(function(){
        let person = { usr: $("#cusr").val(), pwd: $("#cpwd").val(), name: $("#cname").val(), mail: $("#cmail").val(), tel: $("#ctel").val(), address: $("#cadr").val(), type: "client"};
        
        if(person.usr !== "" || person.pwd !== "" || person.name !== "" || person.mail !== "" || person.tel !== "" || person.address !== "")
            addToTable(person, "people");
        else
            alert("Nenhum campo pode estar em branco!");
    });
    
    // Função que da refresh na tabela de admins
    function refreshAdmTable(){
        $("#admins td").remove();
        
        var admins = db.transaction("people").objectStore("people");
        admins.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if(cursor && cursor.value.type == 'adm'){
                $("#admins tbody").after("<tr><td>" + cursor.key + "</td><td>" + cursor.value.name + "</td><td>" + cursor.value.mail +
                                       "</td><td>" + cursor.value.tel + "</td>" + "</tr>");
                cursor.continue();
            }
        };
    }
    
    // EventHandler da abertura da janela de administradores
    $("#admTable").click(function() {
        refreshAdmTable();
    });  
    
    // Função que da refresh na tabela de clients
    function refreshClientTable(){
        $("#clients td").remove();
        
        var clients = db.transaction("people").objectStore("people");
        clients.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if(cursor && cursor.value.type == 'client'){
                $("#clients tbody").after("<tr><td>" + cursor.key + "</td><td>" + cursor.value.name + "</td><td>" + cursor.value.mail +
                                       "</td><td>" + cursor.value.tel + "</td><td>" + cursor.value.address + "</td></tr>");
                cursor.continue();
            }
        };
    }
    
    // Event Handler da abertura da janela de clientes
    $("#clientTable").click(function(){
        refreshClientTable();
    });
    
    // Função que deleta pessoas
    function deletePerson(person){
        var pplObStore = db.transaction("people", "readwrite").objectStore("people");
        let request = pplObStore.get(person).onsuccess = function(e){
            request = pplObStore.delete(person);
            request.onerror = function(e){
                alert(e.target.error);
            };
            request.onsuccess = function(e){
                alert(person + " deletado com sucesso!");
                refreshAdmTable();
                refreshClientTable();
            };
        };
    }
    
    // EventHandler da remoção de pessoas
    $("#deletePersonButton1").click(function(){
        deletePerson($("#deletePerson1").val());
    });
    
    // EventHandler da remoção de pessoas
    $("#deletePersonButton2").click(function(){
        deletePerson($("#deletePerson2").val());
    });
    
    // Modelo de Produto
    //  pid  PK
    //  pname
    //  pprice
    //  pstock
    //  ptype
    //  pdescription
    
    // EventHandler do cadastro de produto
    $("#addProduto").click(function(){
        var produto = {pid: $("#pid").val(),
                       pname: $("#pname").val(),
                       pprice: parseFloat($("#pprice").val()),
                       pstock: parseInt($("#pstock").val()),
                       ptype: $('input[name=optradio]:checked', '#ptype').val(),
                       pdescription: $("#pdescription").val()};
                
        if(produto.ptype === undefined){
            alert("O tipo de produto não pode estar vazio");
        } else if(isNaN(produto.pprice) || produto.pprice <= 0.0) {
            alert("Preço deve ser um número real e maior que zero");
        } else if(isNaN(produto.pstock) || produto.pstock < 0) {
            alert("Quantidade no estoque deve ser um número inteiro e maior ou igual a zero");
        } else {
            addToTable(produto, "produto");
        }
    });
    
    // Atualiza a tabela do estoque de produtos
    function refreshStockTable(){
        $("#stock td").remove();
        
        var stock = db.transaction("produto").objectStore("produto");
        stock.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if(cursor){
                $("#stock tbody").after("<tr><td>" +
                                        cursor.key + "</td><td>" +
                                        cursor.value.pname + "</td><td>" +
                                        cursor.value.pprice + "</td><td>" +
                                        cursor.value.ptype + "</td><td>" +
                                        cursor.value.pstock + "</td></tr>");
                cursor.continue();
            }
        };
    }
    
    // Atualiza o seletor de produtos do estoque
    function refreshStockSelector(){
        $("#stockList option").remove();
        
        var stock = db.transaction("produto").objectStore("produto");
        stock.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if(cursor){
                $("#stockList").append("<option>" + cursor.value.pname + "</option>");
                cursor.continue();
            }
        };
    }
    
    // EventHandler que chama os eventos de atualização para quando a tab é selecionada
    $("#stockButton").click(function(){
        refreshStockTable();
        refreshStockSelector();
    });
    
    // Botão que subtrai uma unidade à quantidade do produto no estoque
    $("#pminus").click(function(){
        let productName = $("#stockList option:selected").text();
        let objectStore = db.transaction(["produto"], "readwrite").objectStore("produto");
        var index = objectStore.index("pname");

        index.get(productName).onsuccess = function(event) {
            let data = event.target.result;
            if(data.pstock<= 0)
                alert("Número no estoque não pode ser abaixo de zero");
            else{
                data.pstock--;

                let requestUpdate = objectStore.put(data);
                requestUpdate.onsuccess = function(event) {
                    refreshStockTable();
                };
            }
        };
    });
    
    // Botão que soma uma unidade à quantidade do produto no estoque
    $("#padd").click(function(){
        let productName = $("#stockList option:selected").text();
        let objectStore = db.transaction(["produto"], "readwrite").objectStore("produto");
        var index = objectStore.index("pname");

        index.get(productName).onsuccess = function(event) {
            let data = event.target.result;
            data.pstock++;

            let requestUpdate = objectStore.put(data);
            requestUpdate.onsuccess = function(event) {
                refreshStockTable();
            };
        };
    });
    
    // Botão que remove um produto do estoque de produtos
    $("#premove").click(function(){
        let productName = $("#stockList option:selected").text();
        let objectStore = db.transaction(["produto"], "readwrite").objectStore("produto");
        var request = objectStore.index("pname");
        
        if(confirm("Você tem certeza que quer deletar este produto?")){
            request.get(productName).onsuccess = function(event) {
                let pid = event.target.result.pid;
                objectStore.delete(pid).onsuccess = function(event){
                    refreshStockSelector();
                    refreshStockTable();
                    alert("Produto deletado com sucesso!");
                };
            };
        }
    });
    
    // Modelo de Serviço
    //  sid  PK
    //  sname UNQ
    //  sprice
    //  sdescription
    
    // EventHandler para adição de novos serviços
    $("#serviceAdd").click(function(){
        var service = {sid: $("#sid").val(),
                       sname: $("#sname").val(),
                       sprice: parseFloat($("#sprice").val()),
                       sdescription: $("#sdescription").val()};
                
        if(isNaN(service.sprice) || service.sprice <= 0.0) {
            alert("Preço deve ser um número real e maior que zero");
        } else if(service.sid === "" || service.sname === "" || service.sprice === ""){
            alert("Nenhum campo pode estar vazio");
        } else {
            addToTable(service, "service");
        }
    });
    
    
    // Função que adiciona um objeto a sua tabela
    function addToTable(object, table){
        var ObStore = db.transaction(table, "readwrite").objectStore(table);
        let request = ObStore.add(object);
        
        // Mensagem de erro com o erro encontrado
        request.onerror = function(e){
            alert(e.target.error);
        };
        
        // Mensagem informando o sucesso da operação
        request.onsuccess = function(e){
            alert("Cadastro realizado com sucesso!");
        };
    }
});