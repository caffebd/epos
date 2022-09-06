const buttonArea = document.getElementById("sale-buttons");
const billArea = document.getElementById("bill-area");
const totalArea = document.getElementById("total-area");

let totalPrice = 0

let buttonA = {
  productName: "Samosa",
  price: 5,
};

let buttonB = {
  productName: "Singara",
  price: 8,
};

let buttonC = {
  productName: "Juice",
  price: 10,
};

let shopButtons = [buttonA, buttonB, buttonC];

console.log(shopButtons[0].price + shopButtons[1].price);

    for (let i = 0; i < shopButtons.length; i++) {
     makeButtons(i)
    }

function productInfo(count) {


    let productButtonInfo = shopButtons[count].productName
    let productButtonInfoPrice = shopButtons[count].price

    totalPrice += shopButtons[count].price;

    let productInfo = billArea.appendChild(document.createElement("p"))
    productInfo.innerHTML = `${productButtonInfo} ${productButtonInfoPrice} TK`;
    
    totalArea.innerHTML = ""

    let totalText = totalArea.appendChild(document.createElement("p"));
    totalText.innerHTML = `Total ${totalPrice} TK`;

}

function makeButtons(count) {

        let buttonSectionName = shopButtons[count].productName;

        let aButton = buttonArea.appendChild(document.createElement("button"));

        aButton.innerHTML = buttonSectionName;
    
    aButton.onclick = function (params) {
            productInfo(count)
            console.log('Button Pressed')
    }
    
}



