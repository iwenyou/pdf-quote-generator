export function calculateValues(product, defaults) {
  const shippingRate = defaults.shippingRate || 0;
  const importTaxRate = defaults.importTaxRate || 0;
  const storageFee = defaults.storageFee || 0;
  const exchangeRate = defaults.exchangeRate || 1;
  const profitMargin = defaults.profitMargin || 0.6;
  const discountRate = defaults.discountRate || 1;

  const price = product.selectedMaterialCost * product.size.width;
  const volume = product.size.height * product.size.width * product.size.thickness;
  const shippingCost = volume * shippingRate;
  const tax = price * importTaxRate;
  const storage = storageFee;
  const total_cost = price + shippingCost + tax + storage;
  const final_price = total_cost / profitMargin;
  const in_usd = final_price / exchangeRate;
  const profits = final_price - total_cost;
  const displayedPrice = in_usd / discountRate;

  return {
    price,
    volume,
    shippingCost,
    tax,
    storage,
    total_cost,
    final_price,
    in_usd,
    profits,
    displayedPrice
  };
}

export function calculateValuesForAllSpaces(spaces, defaults) {
  return spaces.map(space => {
    const updatedProducts = space.products.map(product => {
      const calculatedValues = calculateValues(product, defaults);
      return { ...product, ...calculatedValues };
    });
    return { ...space, products: updatedProducts };
  });
}
