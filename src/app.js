// Catch all elements
const AuctionPrice = document.getElementById("auction-price");
const PurchasePrice = document.getElementById("purchase-price");
const VAT = document.getElementById("vat");
const ProfitStandard = document.getElementById("profit-min");
const ProfitSmart = document.getElementById("profit-max");
const ProfitSmartBelow45 = document.getElementById("profit-below45");
const Cost = document.getElementById("cost");
const IsSub = document.getElementById("is-sub");
const Category = document.getElementById("category");
const Wage = document.getElementById("wage");
const DeliveryPriceLabel = document.getElementById("delivery-price-label");
const DeliveryPrice = document.getElementById("delivery-price");
const DeliveryPriceMin = document.getElementById("delivery-price-min");
const DeliveryPriceMax = document.getElementById("delivery-price-max");
const ProfitBox = document.getElementById("profit-box");
const ProfitBelow45Box = document.getElementById("profit-below45-box");
const CostBox = document.getElementById("cost-box");
const Is4PercentMinus = document.getElementById("margin-below45");
const IsMarginPromo = document.getElementById("margin-promo");
const IsAdditionalCost = document.getElementById("additional-cost");
const IsAdditionalCostWrap = document.getElementById("additional-cost-wrap");
const IsAdditionalCostBox = document.getElementById("additional-cost-box");



const TablePurchasePrice = document.getElementById("t-purchase-price");
const TablePortalMargin = document.getElementById("t-margin");
const TablePortalMarginPromo = document.getElementById("t-margin-promo");
const TableWage = document.getElementById("t-wage");
const TableTransport = document.getElementById("t-transport");
const TableSubscribe = document.getElementById("t-subscribe");
const TableCost = document.getElementById("t-cost");
const TableAuctionPrice = document.getElementById("t-auction-price");
const TableProfitMin = document.getElementById("t-profit-min");
const TableProfitSmart = document.getElementById("t-profit-max");
const TableProfitSmartBelow45 = document.getElementById("t-profit-below45");
const TableProfitSmartBelow45Box = document.getElementById("t-profit-below45-box");

// Events
AuctionPrice.addEventListener("click", selectValueAfterClick);
PurchasePrice.addEventListener("click", selectValueAfterClick);
ProfitSmart.addEventListener("click", selectValueAfterClick);

AuctionPrice.addEventListener("change", convertByAuctionPrice);
// ProfitSmart.addEventListener("change", convertByProfitSmart);
PurchasePrice.addEventListener("change", purchasePriceToggle);
VAT.addEventListener("change", convertByAuctionPrice);
IsSub.addEventListener("change", convertByAuctionPrice);
IsMarginPromo.addEventListener("change", convertByAuctionPrice);
IsAdditionalCostBox.addEventListener("change", convertByAuctionPrice);
IsAdditionalCost.addEventListener("change", convertByAuctionPrice);
Wage.addEventListener("change", convertByAuctionPrice);
Category.addEventListener("change", convertByAuctionPrice);
DeliveryPrice.addEventListener("change", convertByAuctionPrice);
DeliveryPriceMax.addEventListener("change", convertByAuctionPrice);

Is4PercentMinus.addEventListener("change", toggleProfitSmartBelow45Box);
IsAdditionalCost.addEventListener("change", toggleAdditionalCostBox);

// Data
const DeliveryPriceScope = {
  // Delivery cost scope based at allegro dpd transport 'smart'
  // its maximum cost of transport
  // 0,39.99 real cost is not 0 but about 5,65%, repaired further, here need to be 0 at now
  "0,39.99": 0,
  "40,49.99": 2.54,
  "50,59.99": 2.79,
  "60,79.99": 3.19,
  "80,119.99": 4.54,
  "120,199.99": 7.69,
  "200,999.99": 10.09
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
    const costCalculateSmart = costCalculate();
    const costCalculateSmartPromotion = Number(costCalculateSmart.portalMarginCost*0.75);
    const finalCalculateSmartCost = IsMarginPromo.checked ? costCalculateSmart.totalCost + costCalculateSmartPromotion  : costCalculateSmart.totalCost;
    
    const costCalculateStandard = costCalculate(Number(DeliveryPriceMax.value));
    // Need to fix promo, only 75% of cost without delivery cost, need to check? 
    const costCalculateStandardPromotion = Number(costCalculateStandard.totalCost*0.75);
    const finalCalculateStandardCost = IsMarginPromo.checked ? costCalculateStandard.totalCost + costCalculateStandardPromotion  : costCalculateStandard.totalCost;

    // Add vat to purchase price
    const purchasePriceWithVat =
      Number(PurchasePrice.value) +
      Number(PurchasePrice.value) * Number(VAT.value);
    const profitSmartCalculate =
      Number(AuctionPrice.value) - purchasePriceWithVat - finalCalculateSmartCost;
      const profitSmartBelow45Calculate = profitSmartCalculate - (Number(AuctionPrice.value)*0.0565);
    const profitStandardCalculate =
      Number(AuctionPrice.value) - purchasePriceWithVat - finalCalculateStandardCost;

        // Addition cost - eg. cost of package BETA
  const additionalCost = IsAdditionalCost.checked ? Number(IsAdditionalCostBox.value) : 0;

    // Update UI (need to improve, some bugs with round up)
    ProfitStandard.value = profitStandardCalculate.toFixed(2)-(additionalCost);
    ProfitSmart.value = profitSmartCalculate.toFixed(2)-additionalCost;
    ProfitSmartBelow45.value = profitSmartBelow45Calculate.toFixed(2)-additionalCost;

    TablePurchasePrice.innerText = purchasePriceWithVat.toFixed(2);
    TableAuctionPrice.innerText = AuctionPrice.value;
    TablePortalMargin.innerText = `${costCalculateSmart.portalMarginCost.toFixed(2)} - ${costCalculateStandard.portalMarginCost.toFixed(2)}`;
    TablePortalMarginPromo.innerText = `${costCalculateSmartPromotion.toFixed(2)} - ${costCalculateStandardPromotion.toFixed(2)}`;
    TableWage.innerText = Wage.value;
    TableTransport.innerText = `${costCalculateSmart.deliveryCost} - ${costCalculateStandard.deliveryCost}`;
    TableSubscribe.innerText = costCalculateSmart.subscribeCost;
    TableCost.innerText = `${(costCalculateSmart.totalCost+additionalCost).toFixed(2)} - ${(costCalculateStandard.totalCost+additionalCost).toFixed(2)}`;
    TableProfitMin.innerText = profitStandardCalculate.toFixed(2)-additionalCost;
    TableProfitSmart.innerText = profitSmartCalculate.toFixed(2)-additionalCost;    
    TableProfitSmartBelow45.innerText = profitSmartBelow45Calculate.toFixed(2)-additionalCost;    

    return;
  }

  // If purchase price is not available
  const costCalculateResult = costCalculate(Number(DeliveryPrice.value));
  const costMarginPromotion = Number(costCalculateResult.portalMarginCost*0.75);

  // Update UI (need to improve, some bugs with round up)
  Cost.value = costCalculateResult.totalCost.toFixed(2);

  TableAuctionPrice.innerText = AuctionPrice.value;
  TablePortalMargin.innerText = costCalculateResult.portalMarginCost.toFixed(2);
  TablePortalMarginPromo.innerText = costMarginPromotion.toFixed(2);
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
    if (Is4PercentMinus.checked) {
      ProfitBelow45Box.classList.remove("d-none");
      ProfitBelow45Box.classList.add("d-block");
    }
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

function toggleProfitSmartBelow45Box() {
  if (Is4PercentMinus.checked) {
    ProfitBelow45Box.classList.remove("d-none");
    ProfitBelow45Box.classList.add("d-block");
    return;
  }
  ProfitBelow45Box.classList.remove("d-block");
  ProfitBelow45Box.classList.add("d-none");
}

function toggleAdditionalCostBox() {
  if (IsAdditionalCost.checked) {
    IsAdditionalCostWrap.classList.remove("d-none");
    IsAdditionalCostWrap.classList.add("d-block");
    return;
  }
  IsAdditionalCostWrap.classList.remove("d-block");
  IsAdditionalCostWrap.classList.add("d-none");
}

function selectValueAfterClick() {
  // Mark value after click at input
  this.select();
}
