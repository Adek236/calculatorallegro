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

// Events
AuctionPrice.addEventListener("click", selectValueAfterClick);
PurchasePrice.addEventListener("click", selectValueAfterClick);
ProfitMax.addEventListener("click", selectValueAfterClick);

AuctionPrice.addEventListener("change", convertByAuctionPrice);
ProfitMax.addEventListener("change", convertByProfitMax);
PurchasePrice.addEventListener("change", purchasePriceToggle);

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
function convertByAuctionPrice() {
  // Subscribe additional cost
  const addIsSubCost = IsSub.checked ? 0 : 1;

  // If purchase price is available
  if (PurchasePrice.value > 0) {
    // Portal max margin cost
  const calculatePortalMarginCostMax = (Number(AuctionPrice.value)*Number(Category.value));
  // Portal max margin cost minimum is 0.31, if is more expensive so go on that cost
  const portalMarginCostMax =
  calculatePortalMarginCostMax >= 0.31 ? calculatePortalMarginCostMax : 0.31;
  const costCalculateMax = addIsSubCost + calculateDeliveryPrice(AuctionPrice.value) + portalMarginCostMax + Number(Wage.value)

   // Portal Min margin cost
   const calculatePortalMarginCostMin = (Number(AuctionPrice.value) + Number(DeliveryPriceMax.value)) *
   Number(Category.value);
   // Portal Min margin cost minimum is 0.31, if is more expensive so go on that cost
   const portalMarginCostMin =
   calculatePortalMarginCostMin >= 0.31 ? calculatePortalMarginCostMin : 0.31;
   const costCalculateMin = addIsSubCost + calculateDeliveryPrice(AuctionPrice.value) + portalMarginCostMin + Number(Wage.value)

    const purchasePriceWithVat = Number(PurchasePrice.value)+(Number(PurchasePrice.value)*Number(VAT.value));

    const profitMaxCalculate = Number(AuctionPrice.value) - purchasePriceWithVat - costCalculateMax;
    const profitMinCalculate = Number(AuctionPrice.value) - purchasePriceWithVat - costCalculateMin;



    // Update UI (need to improve, some bugs with round up)
    ProfitMin.value = profitMinCalculate.toFixed(2);
    ProfitMax.value = profitMaxCalculate.toFixed(2);
    
    return;
  }

  // If purchase price is not available

  // Calculate delivery cost
  const deliveryCost =
    Number(DeliveryPrice.value) > 0
      ? 0
      : calculateDeliveryPrice(AuctionPrice.value);


  // Portal margin cost
  const calculatePortalMarginCost =
    (Number(AuctionPrice.value) + Number(DeliveryPrice.value)) *
    Number(Category.value);
  // Portal margin cost minimum is 0.31, if is more expensive so go on that cost
  const portalMarginCost =
    calculatePortalMarginCost >= 0.31 ? calculatePortalMarginCost : 0.31;

  // Total cost
  const costCalculate =
    portalMarginCost + Number(Wage.value) + Number(deliveryCost) + addIsSubCost;

  // Update UI (need to improve, some bugs with round up)
  Cost.value = costCalculate.toFixed(2);
}

function convertByProfitMax() {
  AuctionPrice.value = ProfitMax.value;
}

function calculateDeliveryPrice(amount) {
  // If amount less than 39.99 is no additional cost
  // if (amount <= 39.99) return 0;
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
}

function selectValueAfterClick() {
  // Mark value after click at input
  this.select();
}
