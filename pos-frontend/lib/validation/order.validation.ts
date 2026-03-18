export const orderValidation = {
  validateOrder: (data: any) => {
    const errors: Record<string, string> = {};

    if (!data.customerId) {
      errors.customerId = "Customer is required";
    }

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      errors.items = "At least one item is required in the order";
    } else {
      data.items.forEach((item: any, index: number) => {
        if (!item.productId) {
          errors[`items.${index}.productId`] = "Product is required";
        }
        if (!item.quantity || item.quantity <= 0) {
          errors[`items.${index}.quantity`] = "Quantity must be greater than 0";
        }
        if (!item.price || item.price <= 0) {
          errors[`items.${index}.price`] = "Price must be greater than 0";
        }
      });
    }

    if (data.total === undefined || data.total < 0) {
      errors.total = "Total amount cannot be negative";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
