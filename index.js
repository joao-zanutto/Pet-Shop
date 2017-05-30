// Nome: João Pedro Berno Zanutto
// nºUSP: 8956672

import {loadDB, } from 'db';

$('document').ready(function(){
    var request = window.indexedDB.open("DBSystem", 1);
    var db;
    
    // Mensagem de erro caso o banco não consiga ser aberto
    request.onerror = function(event) {
        alert(request.errorCode);
    };
    
    // upgrade needed do banco, cria as tabelas e altera caso necessário
    request.onupgradeneeded = function(event){
        db = request.result;
        loadDB(bd);
    };
    
    // Mensagem de sucesso, retorna o banco para o objeto db
    request.onsuccess = function(event) {
        db = request.result;
    };
    
    
});
