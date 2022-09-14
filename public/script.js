//https://flatpickr.js.org/ for date Picker


const firebaseConfig = {
  apiKey: "AIzaSyCzmhLrfYEZ-QsshwVxGy2BBCvzDh2kBbQ",
  authDomain: "caffe-epos.firebaseapp.com",
  projectId: "caffe-epos",
  storageBucket: "caffe-epos.appspot.com",
  messagingSenderId: "737228991857",
  appId: "1:737228991857:web:589cb9aca88ec01cbd5ad0",
  measurementId: "G-377FEBWZH4",
};

const firebaseApp = firebase.initializeApp({
  ...firebaseConfig, projectId: firebaseConfig.projectId
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth()

function checkAuth() {
  if (localStorage.hasOwnProperty("auth")) {
    let isAuth = localStorage.getItem("auth");
    if (isAuth == "false") location.href = "/";
  } else {
    location.href = "/";
  }
}

checkAuth()

function signOut() {
  localStorage.setItem("auth", "false")
  auth
  .signOut()
  .then(
    function () {
      console.log("Signed Out");
      location.href = "/"
    },
    function (error) {
      console.error("Sign Out Error", error);
    }
  );
}



const buttonArea = document.getElementById("sale-buttons");
const billArea = document.getElementById("bill-area");
const saleCount = document.getElementById("sale-count");

const dateArea = document.getElementById("date-area");

const dailySalesArea = document.getElementById("daily-sales");

const datePicker = document.getElementById("date-picker");

let changeGivenArea;

let todaysDate = ""

  let date = new Date();

  let year = date.getFullYear();
  let month = date.getMonth() + 1; // (note zero index: Jan = 0, Dec = 11)
  let day = date.getDate();

  let monthName = date.toLocaleString("default", { month: "long" });

let totalPrice = 0;

let thisPurchase = [];

let allPurchases = [];

let buttonA = {
  name: "Samosa",
  price: 5,
  img: "assets/samosa.png",
};

let buttonB = {
  name: "Singara",
  price: 5,
  img: "assets/singara.png",
};

let buttonC = {
  name: "Cake",
  price: 10,
  img: "assets/cake.png",
};

let buttonD = {
  name: "Rice",
  price: 8,
  img: "assets/rice.png",
};

let allButtons = [buttonA, buttonB, buttonC, buttonD];



function dateChanged(selectedDates, dateStr, instance) {
  month = selectedDates[0].getMonth() + 1;
  day = selectedDates[0].getDate();
  year = selectedDates[0].getFullYear();
  monthName = selectedDates[0].toLocaleString("default", { month: "long" });

    getDoc(day, month, monthName, year).then((result) => {
      // console.log(`Doc Found ${result}`)

      dailySalesArea.innerHTML = "";
      allPurchases = []

      if (result === undefined) return
      

      allPurchases = result;

      if (dailySalesArea != null) showDailySales();
    });

}


// if (localStorage.hasOwnProperty("allPurchases")) {
//   let loadedPurchases = localStorage.getItem("allPurchases");
//   allPurchases = JSON.parse(loadedPurchases);
// }

function clearDatabase() {
  localStorage.removeItem("allPurchases");
  allPurchases = [];
  saleCount.innerHTML = `Sale Number ${allPurchases.length + 1}`;
}

async function getDoc(day, month, monthName, year) {


  let docID = `${day}${month}${year}`;


  todaysDate = `${day} ${monthName} ${year}`;

  dateArea.innerHTML = todaysDate;

  allPurchases = [];

  try {
    let doc = await db.collection("kitchen").doc(docID).get();
    let salesDoc = doc.data();
    console.log("salesDoc", salesDoc["allPurchases"]);

    return salesDoc["allPurchases"];
  } catch (err) {
    console.log("Error getting document: ", err);
  }
}


getDoc(day, month, monthName, year)
  .then((result) => {
    // console.log(`Doc Found ${result}`)

    allPurchases = [];

    if (result!=undefined) allPurchases = result;

    if (buttonArea != null) setupButtons();
    if (dailySalesArea != null) showDailySales();
  });

function writeToFirestore() {

let date = new Date();

let year = date.getFullYear(); 
let month = date.getMonth() + 1; // (note zero index: Jan = 0, Dec = 11)
let day = date.getDate();

let docID = `${day}${month}${year}`;


  db.collection("kitchen")
    .doc(docID)
    .set({
      allPurchases,
    })
    .then((ref) => {
      console.log("All Saved");
    });
}

function transactionComplete(params) {
  let completePurchase = {
    items: thisPurchase,
    total: totalPrice,
  };

  allPurchases.push(completePurchase);

  //localStorage.setItem("allPurchases", JSON.stringify(allPurchases));

  saleCount.innerHTML = `Sale Number ${allPurchases.length + 1}`;

  thisPurchase = [];
  billArea.innerHTML = "";
  totalPrice = 0;
  let header = billArea.appendChild(document.createElement("h3"));
  header.innerHTML = "Bill";

  writeToFirestore();
}

function deleteItem(toDelete) {
  thisPurchase.splice(toDelete, 1);
  updateItems();
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

  let change = cashTaken - totalPrice;

  changeGivenArea.className = "paid-area grid-item-bill";

  changeGivenArea.innerHTML = "";

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

function updateTotal() {
  totalPrice = 0;
  let totalDisplay = billArea.appendChild(document.createElement("h3"));
  for (let i = 0; i < thisPurchase.length; i++) {
    totalPrice += thisPurchase[i].price;
  }
  totalDisplay.className = "grid-item-bill";
  totalDisplay.innerHTML = `TOTAL ${totalPrice} TK`;
}

function updateItems() {
  billArea.innerHTML = "";
  let header = billArea.appendChild(document.createElement("h3"));
  header.innerHTML = "Bill";

  for (let i = 0; i < thisPurchase.length; i++) {
    let newItem = billArea.appendChild(document.createElement("p"));
    newItem.className = "grid-item-bill";
    newItem.innerHTML = `${thisPurchase[i].name} ${thisPurchase[i].price} TK    `;
    let deleteBtn = newItem.appendChild(document.createElement("button"));
    deleteBtn.innerHTML = "X";
    deleteBtn.className = "delete-btn";

    deleteBtn.onclick = function (event) {
      deleteItem(i);
    };
  }
  updateTotal();
  showCashTaken();
}

function buyItem(item) {
  thisPurchase.push(item);
  updateItems();
}

function saleItemClicked(purchases, total) {
  billArea.innerHTML = "";
  let header = billArea.appendChild(document.createElement("h3"));
  header.innerHTML = "Bill";

  for (let i = 0; i < purchases.length; i++) {
    let newItem = billArea.appendChild(document.createElement("p"));
    newItem.className = "grid-item-bill";
    newItem.innerHTML = `${purchases[i].name} ${purchases[i].price} TK    `;
  }

  let totalItem = billArea.appendChild(document.createElement("h3"));
  totalItem.innerHTML = `TOTAL: ${total}TK`;
}

function setupButtons() {
  for (let i = 0; i < allButtons.length; i++) {
    let itemBtn = buttonArea.appendChild(document.createElement("button"));
    //itemBtn.innerHTML = allButtons[i].name;

    itemBtn.onclick = function (event) {
      buyItem(allButtons[i]);
    };

    itemBtn.className = "item-btn";
    
    //itemBtn.appendChild(document.createElement("br"))

    let imageBox = itemBtn.appendChild(document.createElement("img"));
    imageBox.src = allButtons[i].img;
    imageBox.style.height = "100px";
    imageBox.style.width = "100px";

    let nameBox = itemBtn.appendChild(document.createElement("p"));
    nameBox.innerHTML = allButtons[i].name;



  }

  saleCount.innerHTML = `Sale Number ${allPurchases.length + 1}`;
}

function showDailySales() {
  let allSalesTotal = 0;

  for (let i = 0; i < allPurchases.length; i++) {
    let newItem = dailySalesArea.appendChild(document.createElement("p"));
    newItem.className = "item-all-sales";
    newItem.innerHTML = `${i + 1}) ${allPurchases[i].total} TK  `;
    allSalesTotal += allPurchases[i].total;
    let items = allPurchases[i].items;
    newItem.onclick = function () {
      saleItemClicked(items, allPurchases[i].total);
    };
  }
  dailySalesArea.appendChild(document.createElement("hr"));

  let totalSales = dailySalesArea.appendChild(document.createElement("h3"));
  totalSales.innerHTML = `Total Sales: ${allSalesTotal} TK`;
}



