// Nome: João Pedro Berno Zanutto
// nºUSP: 8956672

/*jshint esversion: 6 */
/*globals $:false */

// Tive problemas com a atualização das tabelas da homepage pois não está sendo possível chamar
//  a função que faz o refresh das tabelas assim que o documento é carregado

$("document").ready(function () {
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

    // Pega o usuário logado
    var user = window.location.href.split('user=').pop();

    // Faz o refresh da lista de produtos
    function refreshProducts() {
        $(".produto").remove();
        var stock = db.transaction("produto").objectStore("produto");
        stock.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if (cursor) {
                if (cursor.value.pstock > 0) {
                    $("#productContents").append("<div class=\"col-md-6 produto\"> <div class=\"product\"> <h3>" +
                        cursor.value.pname + "</h3> <img src=\"" + cursor.value.imgURL +
                        "\" heigth=\"100px\" width=\"100px\" class=\"foto\"><p>" +
                        cursor.value.pdescription + "</p>" +
                        "<h4> R$ " + cursor.value.pprice + "</h4>" +
                        "<input value=\"0\" type=\"number\" class=\"sel\" min=\"0\" max=\"100\"></input>" +
                        "</div></div>");
                }
                cursor.continue();
            }
        };
    }

    // EventHandler da entrada na loja de produtos
    $("#lojaButton").click(function () {
        refreshProducts();
    });

    // EventHandler da entrada no carrinho de compras
    $("#buyBtn").click(function () {
        var allTotal = 0.0;

        $(".product").each(function () {
            $("#carrinhoProducts .compra").remove();
            if ($(this).children(".sel").val() === "0" || $(this).children(".sel").val() === undefined) {} else {
                let quantity = $(this).children(".sel").val();
                let obStore = db.transaction("produto").objectStore("produto");
                var request = obStore.index("pname");
                request.get($(this).children("h3").text()).onsuccess = function (event) {
                    let total = quantity * event.target.result.pprice;
                    allTotal = allTotal + total;
                    $("#allTotal h4").remove();
                    $("#allTotal").append("<h4>R$ " + allTotal + "</h4>");
                    $("#carrinhoProducts").append("<tr class=\"compra\"><td class=\"compraName\">" +
                        event.target.result.pname + "</td><td class=\"compraQuant\">" +
                        quantity + "</td><td>" +
                        event.target.result.pprice + "</td><td>" +
                        total + "</td></tr>");
                };
            }
        });
    });

    // EventHandler da confirmação da compra
    $("#finishButton").click(function () {
        $(".compra").each(function () {
            let productName = $(this).children(".compraName").text();
            let productQuantity = $(this).children(".compraQuant").text();
            var request = db.transaction("produto").objectStore("produto").index("pname");
            request.get(productName).onsuccess = event => {
                if (productQuantity > event.target.result.pstock) {
                    alert("A quantidade de " + productName + " no carrinho é maior que a quantidade em estoque, venda do produto impedida.\nA quantidade em estoque é: " + event.target.result.pstock);
                } else {
                    event.target.result.pstock -= productQuantity;
                    request = db.transaction("produto", "readwrite").objectStore("produto").put(event.target.result);

                    let log = {
                        type: "Venda",
                        client: user,
                        name: productName,
                        quantity: productQuantity,
                        price: (productQuantity * event.target.result.pprice)
                    };
                    request = db.transaction("log", "readwrite").objectStore("log").add(log);
                    alert("Venda de " + productName + " realizada com sucesso!");
                }
            };
        });
        refreshProducts();
    });

    // Estrutura do Animal
    // petname UNQ
    // petage
    // pettype
    // petrace
    // petsex
    // petowner

    // EventHandler da criação de um animal
    $("#addAnimal").click(function () {
        let animal = {
            petname: $("#petname").val(),
            petage: $("#petage").val(),
            pettype: $("#pettype").val(),
            petrace: $("#petrace").val(),
            petsex: $("#petsex").val(),
            petowner: user
        };

        if ($("#petname").val() === "" || $("#petage").val() === "" || $("#petrace").val() === "")
            alert("Nenhum campo pode estar em branco");
        else {
            var ObStore = db.transaction('animal', "readwrite").objectStore('animal');
            let request = ObStore.add(animal);

            // Mensagem de erro com o erro encontrado
            request.onerror = function (e) {
                alert(e.target.error);
            };

            // Mensagem informando o sucesso da operação
            request.onsuccess = function (e) {
                alert("Cadastro realizado com sucesso!");
            };
        }
    });

    // Função que faz o refresh da tabela de animais na página inicial do cliente
    function refreshAnimalTable() {
        $("#animals td").remove();
        var animal = db.transaction("animal").objectStore("animal");
        animal.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if (cursor && cursor.value.petowner == user) {
                $("#animals tbody").append("<tr><td>" + cursor.value.petname + "</td><td>" + cursor.value.petage + "</td><td>" + cursor.value.pettype + "</td><td>" + cursor.value.petrace + "</td><td>" + cursor.value.petsex + "</td></tr>");
                cursor.continue();
            }
        };
    }

    // EventHandler do botão home
    $("#hButton").click(function () {
        refreshAnimalTable();
    });

    // EventHandler do botão de agendar serviços
    $("#srvButton").click(event => {
        refreshWeeks();
        refreshServices();
        refreshAnimalSelector();
    });

    $("#weekSelector").change(event => {
        refreshCalendar();
    });

    // Função que faz o refresh nas opções de semana no agendamento de seviços
    function refreshWeeks() {
        $("#weekSelector option").remove();
        $("#weekSelector").append("<option>Selecione uma opção</option>");
        var week = db.transaction("semana").objectStore("semana");
        week.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if (cursor) {
                $("#weekSelector").append("<option value='" + cursor.key + "'>" + cursor.value.weekname + "</option>");
                cursor.continue();
            }
        };
    }

    // Função que faz refresh do seletor de serviços
    function refreshServices() {
        $("#serviceSelector option").remove();

        var service = db.transaction("service").objectStore("service");
        service.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if (cursor) {
                $("#serviceSelector").append("<option value='" + cursor.key + "'>" + cursor.value.sname + " (R$" + cursor.value.sprice + ")</option>");
                cursor.continue();
            }
        };
    }

    // Função que faz refresh do seletor de animais
    function refreshAnimalSelector() {
        $("#animalSelector option").remove();

        var animal = db.transaction("animal").objectStore("animal");
        animal.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if (cursor) {
                $("#animalSelector").append("<option value='" + cursor.key + "'>" + cursor.value.petname + "</option>");
                cursor.continue();
            }
        };
    }

    // Função que faz refresh da tabela do calendario
    function refreshCalendar() {
        $("#calendarTable .col").remove();

        let week = $("#weekSelector").find(":selected").text();
        var request = db.transaction("semana").objectStore("semana").index("weekname");
        request.get(week).onsuccess = event => {
            var i, y;
            // Passa i por todos os trs da tabela
            for (i = 0; i < 10; i++) {
                // Passa y por todos os tds da tabela
                for (y = 0; y < 5; y++) {
                    // Slot vazio
                    if (event.target.result.calendar[y][i] === 0) {
                        $("#line" + i).append("<td class='col'><input type='radio' name='date' value='" + y + "'> Horario Vago</input></td>");
                    } else { // Slot ocupado
                        $("#line" + i).append("<td class='col'>Ocupado</td>");
                    }
                }
            }
        };
    }
});
