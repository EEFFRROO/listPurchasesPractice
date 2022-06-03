$(() => {

    start();

    const namePurchase = $(".nameNewPurchase");
    const pricePurchase = $(".priceNewPurchase");
    const amountPurchase = $(".amountNewPurchase");
    const totalNewPurchase = $(".totalNewPurchase");

    pricePurchase.on("input", changeNewPurchaseTotal);
    amountPurchase.on("input", changeNewPurchaseTotal);

    $(".addNewPurchaseBtn").on('click', clickAddNewPurchase);

    function start() {
        $('.purchasesList').find('tbody').html('');
        readFromStorage();
        createFinal();
    }

    function readFromStorage() {
        let storage = localStorage.getItem("purchases");
        if (storage) {
            storage = JSON.parse(storage);
            for (let i = 0; i < storage.length; i++) {
                createNewPurchase(storage[i].name, storage[i].price, storage[i].amount, storage[i].id);
            }
        }
    }

    function addPurchaseToStorage(name, price, amount, id) {
        let storage = localStorage.getItem("purchases");
        if (!storage) {
            storage = [];
        } else {
            storage = JSON.parse(storage);
        }
        let data = { name: name, price: price, amount: amount, id: id };
        storage.push(data);
        storage = JSON.stringify(storage);
        localStorage.setItem("purchases", storage);
    }

    function deletePurchaseFromStorage(id) {
        let tempStorage;
        let storage = localStorage.getItem("purchases");
        if (storage) {
            storage = JSON.parse(storage);
            tempStorage = [];
            for (let i = 0; i < storage.length; i++) {
                if (storage[i].id != id) {
                    tempStorage.push(storage[i]);
                }
            }
        }
        tempStorage = JSON.stringify(tempStorage);
        localStorage.setItem("purchases", tempStorage);
    }

    function editPurchase(id, name, price, amount) {
        let tempStorage;
        let storage = localStorage.getItem("purchases");
        if (storage) {
            storage = JSON.parse(storage);
            tempStorage = [];
            for (let i = 0; i < storage.length; i++) {
                if (storage[i].id != id) {
                    tempStorage.push(storage[i]);
                } else {
                    tempStorage.push({ name: name, price: price, amount: amount, id: id });
                }
            }
        }
        tempStorage = JSON.stringify(tempStorage);
        localStorage.setItem("purchases", tempStorage);
    }

    function clickAddNewPurchase() {
        if (namePurchase.val() && pricePurchase.val() && amountPurchase.val()) {
            if (isNaN(parseFloat(pricePurchase.val())))
                alert("Неверное введена цена");
            else if (isNaN(parseInt(amountPurchase.val())))
                alert("Неверное введено количество");
            else {
                let randId = parseInt(Math.random() * 10000);
                while ($("#" + randId).length) {
                    randId = parseInt(Math.random() * 10000);
                }
                addPurchaseToStorage(namePurchase.val(), pricePurchase.val(), amountPurchase.val(), randId);
                createNewPurchase(namePurchase.val(), pricePurchase.val(), amountPurchase.val(), randId);
                createFinal();
                namePurchase.val("");
                pricePurchase.val("");
                amountPurchase.val("1");
            }
        } else {
            alert("Заполните все поля");
        }
    }

    function changeNewPurchaseTotal() {
        let price = pricePurchase.val();
        let amount = amountPurchase.val();
        if (!isNaN(parseFloat(price)) && !isNaN(parseInt(amount))) {
            totalNewPurchase.val(parseFloat(price) * parseInt(amount));
        }
    }

    function createNewPurchase(name, price, amount, randId) {
        let total = parseFloat(price) * parseInt(amount);
        let tbody = $(".purchasesList tbody");
        let purchase = createTr();
        purchase.attr({id: randId});
        let editTd = createTd();
        let editBtn = createEditBtn(randId);
        editTd.addClass("p-0");
        editTd.append(editBtn[0]);
        let deleteTd = createTd();
        let deleteBtn = createDeleteBtn(randId);
        deleteTd.addClass("p-0");
        deleteTd.append(deleteBtn[0]);
        let purchaseName = createTd(name, "purchaseItem item" + randId);
        let purchasePrice = createTd(price, "purchaseItem item" + randId);
        let purchaseAmount = createTd(amount, "purchaseItem item" + randId);
        let purchaseTotal = createTd(total, "purchaseItem total ");
        purchase.append(purchaseName);
        purchase.append(purchasePrice);
        purchase.append(purchaseAmount);
        purchase.append(purchaseTotal);
        purchase.append(editTd);
        purchase.append(deleteTd);
        tbody.append(purchase);
    }

    function createFinal() {
        let tbody = $('.purchasesList tbody');
        $(".finalPurchase").remove();
        let purchase = createTr("finalPurchase");
        let finalName = createTh("Итого", "purchaseItem finalName");
        finalName.attr({colspan: 3});
        let sum = 0;
        $(".total").each(function() {
            sum += parseFloat(this.innerText);
        });
        let finalPrice = createTh(sum, "purchaseItem finalPrice");
        finalPrice.attr({colspan: 3});
        purchase.append(finalName);
        purchase.append(finalPrice);

        tbody.append(purchase);
    }

    function createDeleteBtn(randId) {
        let deleteBtn = $(`<button class='purchaseItem ${randId} deleteBtn btn btn-outline-danger px-3'>&#10008;</button>`);
        deleteBtn.on('click', (deleteBtn) => {
            $("#" + deleteBtn.target.classList[1]).remove();
            deletePurchaseFromStorage(deleteBtn.target.classList[1]);
            createFinal();
        });
        return deleteBtn;
    }

    function createEditBtn(randId) {
        let editBtn = $(`<button class='purchaseItem ${randId} editBtn btn btn-outline-info px-2.5'>&#9998;</button>`);
        editBtn.on('click', function() {
            let className = ".item" + editBtn[0].classList[1];
            $(className).each(function () {
                let value = $(this).text();
                $(this).html(`<input class="edit form-control" value="${value}">`);
            });
            editBtn.replaceWith(createAcceptEditBtn(editBtn, className, randId));
            createFinal();
        });
        return editBtn;
    }

    function createAcceptEditBtn(editBtn, className, id) {
        let acceptBtn = $("<button class='btn btn-outline-success px-2.5'>&#10003;</button>");
        acceptBtn.on('click', function() {
            let arr = [];
            $(className).each(function () {
                let value = $(this).find('input').val();
                $(this).text(value);
                arr.push(value);
            });
            editPurchase(id, arr[0], arr[1], arr[2]);
            start();
        });
        return acceptBtn;
    }
    
    function createTr(className = '') {
        let tr = $("<tr/>");
        tr.addClass(className);
        return tr;
    }

    function createTd(text = '', className = '') {
        let td = $("<td/>");
        td.addClass(className);
        td.text(text);
        return td;
    }

    function createTh(text = '', className = '') {
        let th = $("<th/>");
        th.addClass(className);
        th.text(text);
        return th;
    }

});