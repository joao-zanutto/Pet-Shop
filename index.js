// Nome: João Pedro Berno Zanutto
// nºUSP: 8956672

/*jshint esversion: 6 */
/*globals $:false */

$('document').ready(function(){
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
        people.createIndex("name", "name", {unique: false});
        people.createIndex("mail", "mail", {unique : true});
        people.createIndex("tel", "tel", {unique: true});
        
        // Cria a tabela produtos
        let produto = db.createObjectStore("produto", {keyPath: "pid"});
        produto.createIndex("pname", "pname", {unique: false});
        
        // Cria a tabela serviços
        let service = db.createObjectStore("service", {keyPath: "sid"});
        service.createIndex("sname", "sname", {unique: true});
        
        // Adiciona o admin
        var person = {usr: "admin", pwd: "admin", name: "admin", email: "admin", tel: "admin", address: "admin", type: "adm"};
        var ObStore = db.transaction("people", "readwrite").objectStore("people");
        let personAdd = ObStore.add(person);
    };
    
    // Mensagem de sucesso, retorna o banco para o objeto db
    request.onsuccess = function(event) {
        db = request.result;
    };
    
    // EventHandler do botão de login
    $("#login").click(function(){
        var obStore = db.transaction("people").objectStore("people");
        var request = obStore.index("name");
        
        request.get($("#user").val()).onsuccess = function(event){
            
            if(event.target.result === undefined){
                alert("Usuário não cadastrado");
            } else if(event.target.result.pwd === $("#pwd").val()){
                if(event.target.result.type === "adm")
                    window.open("admin.html?user="+ event.target.result.usr ,"_self");
                else
                    window.open("client.html?user=" + event.target.result.usr, "_self");
            } else {
                alert("Senha errada");
            }
        };
        
        
    });
});
