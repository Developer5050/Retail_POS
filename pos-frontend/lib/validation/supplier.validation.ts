export const supplierValidation = {
  validateSupplier: (data: any) => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim() === "") {
      errors.name = "Supplier name is required";
    }

    if (!data.company || data.company.trim() === "") {
      errors.company = "Company name is required";
    }

    if (!data.phone || data.phone.trim() === "") {
      errors.phone = "Phone number is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
