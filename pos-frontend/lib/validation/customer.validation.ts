export const customerValidation = {
  validateCustomer: (data: any) => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim() === "") {
      errors.name = "Customer name is required";
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "Invalid email format";
      }
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
