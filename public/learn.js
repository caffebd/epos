const firebaseConfig = {
  apiKey: "AIzaSyCPycPLcodDE45vdrYL2fa7_gxdY57XFAg",

  authDomain: "luke-kitchen.firebaseapp.com",

  projectId: "luke-kitchen",

  storageBucket: "luke-kitchen.appspot.com",

  messagingSenderId: "1014727580332",

  appId: "1:1014727580332:web:a81023ebd0a3d1d3ba5d09",

  measurementId: "G-40QXT2D1KW",
};

const firebaseApp = firebase.initializeApp({
  ...firebaseConfig,
  projectId: firebaseConfig.projectId,
});

//database
const db = firebaseApp.firestore();

const buttonArea = document.getElementById("sale-buttons");
const billArea = document.getElementById("bill-area");
const totalArea = document.getElementById("total-area");
const saleCount = document.getElementById("sale-count");

const dateArea = document.getElementById("date-area");

let totalPrice = 0;

let thisPurchase = [];

let allPurchases = [];

let changeGivenArea;

let todaysDate = "";

let date = new Date();

let year = date.getFullYear();
let month = date.getMonth() + 1; // (note zero index: Jan = 0, Dec = 11)
let day = date.getDate();
let monthName = date.toLocaleString("default", { month: "long" });

todaysDate = `${day} ${monthName} ${year}`;

dateArea.innerHTML = todaysDate;

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
  makeButtons(i);
}


function writeToFirestore() {
  
  let date = new Date();

  console.log(date)

  let year = date.getFullYear(); //2022
  let month = date.getMonth() + 1; // (note zero index: Jan = 0, Dec = 11)
  let day = date.getDate(); //13

  let docID = `${day}${month}${year}`;

  console.log(docID);

  db.collection("kitchen")
    .doc(docID)
    .set({
        allPurchases,
      })
      .then((ref) => { // = > 
        console.log("All Saved");
      });
}



function deleteItem(count) {
  thisPurchase.splice(count, 1);

  productInfo();
}

//What the computer is doing/thinking
//What the user sees

function productInfo() {
  billArea.innerHTML = "";
  totalPrice = 0;

  let header = billArea.appendChild(document.createElement("h3"));
  header.innerHTML = "New Bill";

  for (let i = 0; i < thisPurchase.length; i++) {
    console.log(thisPurchase[i].productName);
    let itemInfo = billArea.appendChild(document.createElement("p"));
    itemInfo.innerHTML = `${thisPurchase[i].productName} ${thisPurchase[i].price} TK`;

    let deleteBtn = itemInfo.appendChild(document.createElement("button"));
    deleteBtn.innerHTML = "x";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function (event) {
      deleteItem(i);
    };

    totalPrice += thisPurchase[i].price;
  }

  let totalPriceInfo = billArea.appendChild(document.createElement("p"));
  totalPriceInfo.innerHTML = `TOTAL: ${totalPrice}`;

  showCashTaken();
}

function showCashTaken() {
  let paidArea = billArea.appendChild(document.createElement("div"));
  paidArea.className = "paid-area grid-item-bill";

  let cashTakenLabel = paidArea.appendChild(document.createElement("h3"));
  cashTakenLabel.innerHTML = "Paid:";

  let cashTakenForm = paidArea.appendChild(document.createElement("input"));
  cashTakenForm.className = "paid-field";

  let paidBtn = paidArea.appendChild(document.createElement("button"));
  paidBtn.innerHTML = "PAID";
  paidBtn.className = "paid-btn";

  paidBtn.onclick = function (event) {
    showChange(cashTakenForm.value);
  };

  changeGivenArea = billArea.appendChild(document.createElement("div"));
}

function showChange(cashTaken) {
  changeGivenArea.innerHTML = "";

  console.log(cashTaken);

  if (isNaN(cashTaken)) return;
  //20        //30
  let change = cashTaken - totalPrice;
  //-10

  changeGivenArea.className = "paid-area grid-item-bill";

  let changeDue = changeGivenArea.appendChild(document.createElement("h3"));

  if (change < 0) {
    changeDue.innerHTML = "NOT ENOUGH CASH PAID";
    changeDue.className = "warning";
  } else {
    changeDue.innerHTML = `Change Due: ${change} TK`;

    let doneBtn = changeGivenArea.appendChild(document.createElement("button"));
    doneBtn.innerHTML = "DONE";
    doneBtn.className = "done-btn";

    doneBtn.onclick = function (event) {
      transactionComplete();
    };
  }
}

//localStorage.setItem("allPurchases", JSON.stringify(allPurchases));

function transactionComplete() {
  let completePurchase = {
    items: thisPurchase,
    total: totalPrice,
  };

  allPurchases.push(completePurchase);

  writeToFirestore()

  saleCount.innerHTML = `Sale Number ${allPurchases.length + 1}`;

  thisPurchase = [];
  billArea.innerHTML = "";
  totalPrice = 0;
  let header = billArea.appendChild(document.createElement("h3"));
  header.innerHTML = "Bill";
}

function buyItem(item) {
  thisPurchase.push(item);

  productInfo();
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
  };
}
