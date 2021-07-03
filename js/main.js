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
        createNewPurchase("Название", "Цена", "Количество", "Стоимость");


        createNewPurchase("Помидоры", 57, 2);
        createNewPurchase("Чипсы", 105, 3);
        createNewPurchase("Большая пачка чипсов", 55, 4);
        createFinal();
    }

    function addPurchaseToStorage(name, price, amount, total) {
        // code...
    }

    function clickAddNewPurchase() {
        if (namePurchase.value && pricePurchase.value && amountPurchase.value) {
            if (isNaN(parseFloat(pricePurchase.value)))
                alert("Неверное введена цена");
            else if (isNaN(parseInt(amountPurchase.value)))
                alert("Неверное введено количество");
            else {
                createNewPurchase(namePurchase.value, pricePurchase.value, amountPurchase.value);
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

    function createNewPurchase(name, price, amount, header = null) {
        randId = parseInt(Math.random() * 10000);
        while ($("#" + randId).length)
            randId = parseInt(Math.random() * 10000);
        purchase = createDiv(null, "purchase");
        purchase.id = randId;
        deleteBtn = null;
        if (!header) {
            headerClass = "";
            purchaseTotal = createDiv(parseFloat(price) * parseInt(amount), "purchaseItem total");
            deleteBtn = $(`<button class='purchaseItem ${randId} deleteBtn'>X</button>`);
            deleteBtn.click((deleteBtn) => {
                $("#" + deleteBtn.target.classList[1]).remove();
                createFinal();
            });
        } else {
            headerClass = " purchaseHeader";
            purchaseTotal = createDiv(header, "purchaseItem" + headerClass);
        }
        purchaseName = createDiv(name, "purchaseItem" + headerClass);
        purchasePrice = createDiv(price, "purchaseItem" + headerClass);
        purchaseAmount = createDiv(amount, "purchaseItem" + headerClass);
        purchase.append(purchaseName);
        purchase.append(purchasePrice);
        purchase.append(purchaseAmount);
        purchase.append(purchaseTotal);
        if (deleteBtn) {
            purchase.append(deleteBtn[0]);
        }
        $(".purchasesList").append(purchase);
    }

    function createFinal() {
        $(".finalPurchase").remove();
        purchase = createDiv(null, "finalPurchase purchase");
        finalName = createDiv("Итого", "purchaseItem finalName");
        sum = 0;
        $(".total").each(function() {
            sum += parseFloat(this.innerText);
        });
        finalPrice = createDiv(sum, "purchaseItem finalPrice");
        purchase.append(finalName);
        purchase.append(finalPrice);
        $(".purchasesList").append(purchase);
    }

    function createDiv(text = null, className = null) {
        div = $("<div/>")[0];
        div.innerText = text;
        div.className = className;
        return div;
    }

});