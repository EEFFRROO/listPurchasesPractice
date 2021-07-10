$(document).ready(() => {

    // $("body").append("<div class='test'/>");
    main();

    const namePurchase = $(".nameNewPurchase")[0];
    const pricePurchase = $(".priceNewPurchase")[0];
    const amountPurchase = $(".amountNewPurchase")[0];
    const totalNewPurchase = $(".totalNewPurchase")[0];

    $(".priceNewPurchase").on("input", changeNewPurchaseTotal);
    $(".amountNewPurchase").on("input", changeNewPurchaseTotal);
    // amountPurchase.onchange = changeTotal;


    $(".addNewPurchaseBtn").click(clickAddNewPurchase);

    function main() {
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
        editBtn = $(`<button class='purchaseItem ${randId} editBtn btn btn-outline-success px-2.5' disabled>&#9998;</button>`);
        editBtn.click((editBtn) => {
            $("#" + editBtn.target.classList[1]).remove();
            createFinal();
        });
        editTd.className = "p-0"
        editTd.append(editBtn[0]);
        deleteTd = createTd();
        deleteBtn = $(`<button class='purchaseItem ${randId} deleteBtn btn btn-outline-danger px-3'>&#10008;</button>`);
        deleteBtn.click((deleteBtn) => {
            $("#" + deleteBtn.target.classList[1]).remove();
            deletePurchaseFromStorage(deleteBtn.target.classList[1]);
            createFinal();
        });
        deleteTd.className = "p-0"
        deleteTd.append(deleteBtn[0]);
        purchaseName = createTd(name, "purchaseItem");
        purchasePrice = createTd(price, "purchaseItem");
        purchaseAmount = createTd(amount, "purchaseItem");
        purchaseTotal = createTd(total, "purchaseItem total");
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

    function createDiv(text = null, className = null) {
        div = $("<div/>")[0];
        div.innerText = text;
        div.className = className;
        return div;
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