export const productValidation = {
  validateProduct: (data: any) => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim() === "") {
      errors.name = "Product name is required";
    }

    if (!data.category || data.category.trim() === "") {
      errors.category = "Category is required";
    }

    if (data.purchasePrice === undefined || data.purchasePrice <= 0) {
      errors.purchasePrice = "Purchase price must be greater than 0";
    }

    if (data.salePrice === undefined || data.salePrice <= 0) {
      errors.salePrice = "Sale price must be greater than 0";
    }

    if (data.stock === undefined || data.stock < 0) {
      errors.stock = "Stock cannot be negative";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
