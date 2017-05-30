// Nome: João Pedro Berno Zanutto
// nºUSP: 8956672

function addAdmin(var admin, var bd){
    var adminsObjectStore = db.transaction("admins", "readwrite").objectStore("admins");
    let request = adminsObjectStore.add(admin);
    request.onerror = function(e){
        alert("Something wrong happende:\n" + e.target.error.name)
    }
    request.onsuccess = function(e){
        alert(admin["auser"] + " was added sucesfully");
    }
}

var adminData = [
    { auser: "admin", apwd: "admin", aname: "admin", amail: "admin@admin.com", atel: "00-0000-0000", photo: "none"}
];

function loadDB(var db){
    let admins = db.createObjectStore("admins", {keyPath: "auser"});
    admins.createIndex("amail", "amail", {unique : true});
    admins.createIndex("atel", "atel", {unique: true});
    
}