$(document).ready(() => {

    start();

    const namePurchase = $(".nameNewPurchase")[0];
    const pricePurchase = $(".priceNewPurchase")[0];
    const amountPurchase = $(".amountNewPurchase")[0];
    const totalNewPurchase = $(".totalNewPurchase")[0];

    $(".priceNewPurchase").on("input", changeNewPurchaseTotal);
    $(".amountNewPurchase").on("input", changeNewPurchaseTotal);

    $(".addNewPurchaseBtn").click(clickAddNewPurchase);

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
        data = { name: name, price: price, amount: amount, id: id };
        storage.push(data);
        storage = JSON.stringify(storage);
        localStorage.setItem("purchases", storage);
    }

    function deletePurchaseFromStorage(id) {
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
        if (namePurchase.value && pricePurchase.value && amountPurchase.value) {
            if (isNaN(parseFloat(pricePurchase.value)))
                alert("Неверное введена цена");
            else if (isNaN(parseInt(amountPurchase.value)))
                alert("Неверное введено количество");
            else {
                randId = parseInt(Math.random() * 10000);
                while ($("#" + randId).length) {
                    randId = parseInt(Math.random() * 10000);
                }
                addPurchaseToStorage(namePurchase.value, pricePurchase.value, amountPurchase.value, randId);
                createNewPurchase(namePurchase.value, pricePurchase.value, amountPurchase.value, randId);
                createFinal();
                namePurchase.value = "";
                pricePurchase.value = "";
                amountPurchase.value = "1";
            }
        } else {
            alert("Заполните все поля");
        }
    }

    function changeNewPurchaseTotal() {
        price = pricePurchase.value;
        amount = amountPurchase.value;
        if (!isNaN(parseFloat(price)) && !isNaN(parseInt(amount))) {
            totalNewPurchase.value = parseFloat(price) * parseInt(amount);
        }
    }

    function createNewPurchase(name, price, amount, randId) {
        let total = parseFloat(price) * parseInt(amount);
        let tbody = $(".purchasesList tbody")[0];
        purchase = createTr();
        purchase.id = randId;
        editTd = createTd();
        editBtn = createEditBtn(randId);
        editTd.className = "p-0"
        editTd.append(editBtn[0]);
        deleteTd = createTd();
        deleteBtn = createDeleteBtn(randId);
        deleteTd.className = "p-0"
        deleteTd.append(deleteBtn[0]);
        purchaseName = createTd(name, "purchaseItem item" + randId);
        purchasePrice = createTd(price, "purchaseItem item" + randId);
        purchaseAmount = createTd(amount, "purchaseItem item" + randId);
        purchaseTotal = createTd(total, "purchaseItem total ");
        purchase.append(purchaseName);
        purchase.append(purchasePrice);
        purchase.append(purchaseAmount);
        purchase.append(purchaseTotal);
        purchase.append(editTd);
        purchase.append(deleteTd);
        tbody.append(purchase);
    }

    function createFinal() {
        let tbody = $('.purchasesList tbody')[0];
        $(".finalPurchase").remove();
        purchase = createTr("finalPurchase");
        finalName = createTh("Итого", "purchaseItem finalName");
        finalName.colSpan="3";
        sum = 0;
        $(".total").each(function() {
            sum += parseFloat(this.innerText);
        });
        finalPrice = createTh(sum, "purchaseItem finalPrice");
        finalPrice.colSpan="3";
        purchase.append(finalName);
        purchase.append(finalPrice);
        tbody.append(purchase);
    }

    function createDeleteBtn(randId) {
        let deleteBtn = $(`<button class='purchaseItem ${randId} deleteBtn btn btn-outline-danger px-3'>&#10008;</button>`);
        deleteBtn.click((deleteBtn) => {
            $("#" + deleteBtn.target.classList[1]).remove();
            deletePurchaseFromStorage(deleteBtn.target.classList[1]);
            createFinal();
        });
        return deleteBtn;
    }

    function createEditBtn(randId) {
        let editBtn = $(`<button class='purchaseItem ${randId} editBtn btn btn-outline-info px-2.5'>&#9998;</button>`);
        editBtn.click(function() {
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
        acceptBtn.click(function() {
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
        let tr = $("<tr/>")[0];
        tr.className = className;
        return tr;
    }

    function createTd(text = '', className = '') {
        let td = $("<td/>")[0];
        td.className = className;
        td.innerText = text;
        return td;
    }

    function createTh(text = '', className = '') {
        let th = $("<th/>")[0];
        th.className = className;
        th.innerText = text;
        return th;
    }

});