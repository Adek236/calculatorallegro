// Catch all elements
const AuctionPrice = document.getElementById("auction-price");
const PurchasePrice = document.getElementById("purchase-price");
const VAT = document.getElementById("vat");
const ProfitMin = document.getElementById("profit-min");
const ProfitMax = document.getElementById("profit-max");
const Cost = document.getElementById("cost");
const IsSub = document.getElementById("is-sub");
const Category = document.getElementById("category");
const Wage = document.getElementById("wage");
const DeliveryPriceLabel = document.getElementById("delivery-price-label");
const DeliveryPrice = document.getElementById("delivery-price");
const DeliveryPriceMin = document.getElementById("delivery-price-min");
const DeliveryPriceMax = document.getElementById("delivery-price-max");
const ProfitBox = document.getElementById("profit-box");
const CostBox = document.getElementById("cost-box");

const TablePurchasePrice = document.getElementById("t-purchase-price");
const TablePortalMargin = document.getElementById("t-margin");
const TablePortalMarginPromo = document.getElementById("t-margin-promo");
const TableWage = document.getElementById("t-wage");
const TableTransport = document.getElementById("t-transport");
const TableSubscribe = document.getElementById("t-subscribe");
const TableCost = document.getElementById("t-cost");
const TableAuctionPrice = document.getElementById("t-auction-price");
const TableProfitMin = document.getElementById("t-profit-min");
const TableProfitMax = document.getElementById("t-profit-max");

// Events
AuctionPrice.addEventListener("click", selectValueAfterClick);
PurchasePrice.addEventListener("click", selectValueAfterClick);
ProfitMax.addEventListener("click", selectValueAfterClick);

AuctionPrice.addEventListener("change", convertByAuctionPrice);
// ProfitMax.addEventListener("change", convertByProfitMax);
PurchasePrice.addEventListener("change", purchasePriceToggle);
VAT.addEventListener("change", convertByAuctionPrice);
IsSub.addEventListener("change", convertByAuctionPrice);
Wage.addEventListener("change", convertByAuctionPrice);
Category.addEventListener("change", convertByAuctionPrice);
DeliveryPrice.addEventListener("change", convertByAuctionPrice);
DeliveryPriceMax.addEventListener("change", convertByAuctionPrice);

// Data
const DeliveryPriceScope = {
  // Delivery cost scope based at allegro dpd transport 'smart'
  // its maximum cost of transport
  "0,39.99": 0,
  "40,49.99": 2.09,
  "50,59.99": 2.49,
  "60,69.99": 2.79,
  "70,79.99": 3.49,
  "80,99.99": 4.99,
  "100,149.99": 5.99,
  "150,199.99": 6.99,
  "200,299.99": 9.49,
  "300,999.99": 10.99,
};

// Functions
function costCalculate(deliveryCost = 0) {
  // Subscribe additional cost
  const addIsSubCost = IsSub.checked ? 0 : 1;
  // Portal margin cost
  const calculatePortalMarginCost =
    (Number(AuctionPrice.value) + Number(deliveryCost)) *
    Number(Category.value);
  // Portal max margin cost minimum is 0.31, if is more expensive so go on that cost
  const portalMarginCost =
    calculatePortalMarginCost >= 0.31 ? calculatePortalMarginCost : 0.31;
  // Delivery cost - if smart calculate additional cost
  const deliveryCostFinal =
    deliveryCost > 0 ? 0 : calculateDeliverySmartCost(AuctionPrice.value);

  return (obj = {
    totalCost:
      addIsSubCost + deliveryCostFinal + portalMarginCost + Number(Wage.value),
    subscribeCost: addIsSubCost,
    deliveryCost: deliveryCostFinal,
    portalMarginCost: portalMarginCost,
    wageCost: Number(Wage.value),
  });
}

function convertByAuctionPrice() {
  // If purchase price is available
  if (PurchasePrice.value > 0) {
    const costCalculateMax = costCalculate();
    const costCalculateMin = costCalculate(Number(DeliveryPriceMax.value));
    // Add vat to purchase price
    const purchasePriceWithVat =
      Number(PurchasePrice.value) +
      Number(PurchasePrice.value) * Number(VAT.value);
    const profitMaxCalculate =
      Number(AuctionPrice.value) - purchasePriceWithVat - costCalculateMax.totalCost;
    const profitMinCalculate =
      Number(AuctionPrice.value) - purchasePriceWithVat - costCalculateMin.totalCost;

    // Update UI (need to improve, some bugs with round up)
    ProfitMin.value = profitMinCalculate.toFixed(2);
    ProfitMax.value = profitMaxCalculate.toFixed(2);

    TablePurchasePrice.innerText = purchasePriceWithVat;
    TableAuctionPrice.innerText = AuctionPrice.value;
    TablePortalMargin.innerText = `${costCalculateMax.portalMarginCost.toFixed(2)} - ${costCalculateMin.portalMarginCost.toFixed(2)}`;
    TableWage.innerText = Wage.value;
    TableTransport.innerText = `${costCalculateMax.deliveryCost} - ${costCalculateMin.deliveryCost}`;
    TableSubscribe.innerText = costCalculateMax.subscribeCost;
    TableCost.innerText = `${costCalculateMax.totalCost.toFixed(2)} - ${costCalculateMin.totalCost.toFixed(2)}`;
    TableProfitMin.innerText = profitMinCalculate.toFixed(2);
    TableProfitMax.innerText = profitMaxCalculate.toFixed(2);
    

    return;
  }

  // If purchase price is not available
  const costCalculateResult = costCalculate(Number(DeliveryPrice.value));

  // Update UI (need to improve, some bugs with round up)
  Cost.value = costCalculateResult.totalCost.toFixed(2);

  TableAuctionPrice.innerText = AuctionPrice.value;
  TablePortalMargin.innerText = costCalculateResult.portalMarginCost.toFixed(2);
  TablePortalMarginPromo.innerText = (Number(TablePortalMargin.innerText)*0.75).toFixed(2);
  TableWage.innerText = Wage.value;
  TableTransport.innerText = costCalculateResult.deliveryCost;
  TableSubscribe.innerText = costCalculateResult.subscribeCost;
  TableCost.innerText = Cost.value;
}

function calculateDeliverySmartCost(amount) {
  // If amount less than 39.99 is no additional cost
  // Additional delivery cost based at auction price
  const result = Object.keys(DeliveryPriceScope).find((el) => {
    return (
      Number(el.split(",")[0]) <= Number(amount) &&
      Number(el.split(",")[1]) >= Number(amount)
    );
  });
  return DeliveryPriceScope[result];
}

// UI fn
function purchasePriceToggle() {
  // If purchase price available show profits and min, max delivery
  if (PurchasePrice.value > 0) {
    CostBox.classList.add("d-none");
    ProfitBox.classList.remove("d-none");
    ProfitBox.classList.add("d-flex");
    DeliveryPrice.classList.add("d-none");
    DeliveryPriceMin.classList.remove("d-none");
    DeliveryPriceMin.classList.add("d-flex");
    DeliveryPriceMax.classList.remove("d-none");
    DeliveryPriceMax.classList.add("d-flex");
    DeliveryPriceLabel.innerText = "Koszt transportu (min - max):";
    VAT.disabled = false;
    convertByAuctionPrice();
    return;
  }
  // If not show only cost and just delivery
  ProfitBox.classList.add("d-none");
  CostBox.classList.remove("d-none");
  CostBox.classList.add("d-flex");
  DeliveryPrice.classList.remove("d-none");
  DeliveryPrice.classList.add("d-flex");
  DeliveryPriceMin.classList.add("d-none");
  DeliveryPriceMin.classList.remove("d-flex");
  DeliveryPriceMax.classList.add("d-none");
  DeliveryPriceMax.classList.remove("d-flex");
  DeliveryPriceLabel.innerText = "Koszt transportu:";
  VAT.disabled = true;
  convertByAuctionPrice();
}

function selectValueAfterClick() {
  // Mark value after click at input
  this.select();
}
