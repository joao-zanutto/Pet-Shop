// Nome: João Pedro Berno Zanutto
// nºUSP: 8956672

/*jshint esversion: 6 */
/*globals $:false */

$("document").ready(function(){
    var request = window.indexedDB.open("DBSystem1", 2);
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
    
    // Função que adiciona uma pessoa a tabela
    function addPeople(person){
        var pplObStore = db.transaction("people", "readwrite").objectStore("people");
        let request = pplObStore.add(person);
        // Mensagem de erro com o erro encontrado
        request.onerror = function(e){
            alert(e.target.error);
        };

        // Mensagem informando o sucesso da operação
        request.onsuccess = function(e){
            alert(person.usr + " foi cadastrado com sucesso!");
        };
    }
    
    // EventHandler do cadastro de novo administrador
    $("#addAdmin").click(function() {
        let person = { usr: $("#ausr").val(), pwd: $("#apwd").val(), name: $("#aname").val(), mail: $("#amail").val(), tel: $("#atel").val(), address: "none", type: "adm"};
        
        if(person.usr !== "" || person.pwd !== "" || person.name !== "" || person.mail !== "" || person.tel !== "")
            addPeople(person);
        else
            alert("Nenhum campo pode estar em branco!");
    });
    
    // EventHandler do cadastro de novo cliente
    $("#addClient").click(function(){
        let person = { usr: $("#cusr").val(), pwd: $("#cpwd").val(), name: $("#cname").val(), mail: $("#cmail").val(), tel: $("#ctel").val(), address: $("#cadr").val(), type: "client"};
        
        if(person.usr !== "" || person.pwd !== "" || person.name !== "" || person.mail !== "" || person.tel !== "" || person.address !== "")
            addPeople(person);
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
                                       "</td><td>" + cursor.value.tel + "</td>" + "</tr");
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
                                       "</td><td>" + cursor.value.tel + "</td><td>" + cursor.value.address + "</td></tr");
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
    
    
});