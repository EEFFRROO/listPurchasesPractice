$(document).ready(() => {

    // $("body").append("<div class='test'/>");
    main();

    function main() {
        createNewPurchase("Название", "Цена", "Количество", "Стоимость");

        createNewPurchase("Помидоры", 57, 2);
        createNewPurchase("Чипсы", 105, 3);
        createFinal();
    }

    function clickAddNewPurchase() {

    }

    function createNewPurchase(name, price, amount, header = null) {
        purchase = createDiv(null, "purchase");
        if (!header) {
            purchaseTotal = createDiv(parseFloat(price) * parseInt(amount), "purchaseItem total");
            headerClass = "";
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
        // console.log(purchase);
        $(".purchasesList").append(purchase);
    }

    function createFinal() {
        $(".finalPurchase").remove();
        purchase = createDiv(null, "finalPurchase");
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