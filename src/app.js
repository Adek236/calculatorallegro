// Catch all elements
const auctionPrice = document.getElementById("auction-price");
const purchasePrice = document.getElementById("purchase-price");
const vat = document.getElementById("vat");
const profitMin = document.getElementById("profit-min");
const profitMax = document.getElementById("profit-max");
const cost = document.getElementById("cost");
const isSub = document.getElementById("is-sub");
const category = document.getElementById("category");
const wage = document.getElementById("wage");
const deliveryPrice = document.getElementById("delivery-price");
const profitBox = document.getElementById("profit-box");
const costBox = document.getElementById("cost-box");

// Events
auctionPrice.addEventListener("click", selectValueAfterClick);
purchasePrice.addEventListener("click", selectValueAfterClick);
profitMax.addEventListener("click", selectValueAfterClick);

auctionPrice.addEventListener("change", convertByAuctionPrice);
profitMax.addEventListener("change", convertByProfitMax);
purchasePrice.addEventListener("change", purchasePriceToggle);

// Functions
function convertByAuctionPrice() {
  if (purchasePrice.value > 0) {
    return;
  }
// TODO: need to add transport + abonament cost
let costCalulate = ((Number(auctionPrice.value)+Number(deliveryPrice.value))*Number(category.value))+Number(wage.value);
  
cost.value = costCalulate.toFixed(2);
}

function convertByProfitMax() {
  auctionPrice.value = profitMax.value;
}

function purchasePriceToggle() {
  if (purchasePrice.value > 0) {
    costBox.classList.add("d-none");
    profitBox.classList.remove("d-none");
    profitBox.classList.add("d-flex");
    return;
  }
  profitBox.classList.add("d-none");
  costBox.classList.remove("d-none");
  costBox.classList.add("d-flex");
}

function selectValueAfterClick() {
  this.select();
}
