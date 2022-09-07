const buttonArea = document.getElementById("sale-buttons");
const billArea = document.getElementById("bill-area");
const totalArea = document.getElementById("total-area");

let totalPrice = 0

let thisPurchase = []

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

function productInfo() {

  billArea.innerHTML = ""
  totalPrice = 0
  
  let header = billArea.appendChild(document.createElement("h3"));
  header.innerHTML = "New Bill"

  for (let i = 0; i < thisPurchase.length; i++) {
    console.log(thisPurchase[i].productName)
    let itemInfo = billArea.appendChild(document.createElement("p"));
    itemInfo.innerHTML = `${thisPurchase[i].productName} ${thisPurchase[i].price} TK` 
    totalPrice += thisPurchase[i].price;
  }

  let totalPriceInfo = billArea.appendChild(document.createElement("p"));
  totalPriceInfo.innerHTML = `TOTAL: ${totalPrice}`;


    // let productButtonInfo = shopButtons[count].productName
    // let productButtonInfoPrice = shopButtons[count].price

    // totalPrice += shopButtons[count].price;

    // let productInfo = billArea.appendChild(document.createElement("p"))
    // productInfo.innerHTML = `${productButtonInfo} ${productButtonInfoPrice} TK`;
    
    // totalArea.innerHTML = ""

    // let totalText = totalArea.appendChild(document.createElement("p"));
    // totalText.innerHTML = `Total ${totalPrice} TK`;

}

function buyItem(item) {
  thisPurchase.push(item)

  productInfo()
}

function makeButtons(count) {

        let buttonSectionName = shopButtons[count].productName;

        let aButton = buttonArea.appendChild(document.createElement("button"));

        aButton.innerHTML = buttonSectionName;
    
    aButton.onclick = function (params) {
      buyItem(shopButtons[count]); //send item name & item price

      //e.g. shopButtons[0] =
      // let buttonA = {
      //   productName: "Samosa",
      //   price: 5,
      // };
      
      //console.log("Button Pressed");
    }
    
}



