export const authValidation = {
  validateEmail: (email: string): string | null => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    return null;
  },

  validatePassword: (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  },

  validateSignIn: (data: { email: string; password?: string }) => {
    const errors: Record<string, string> = {};
    const emailError = authValidation.validateEmail(data.email);
    if (emailError) errors.email = emailError;

    if (data.password !== undefined) {
      const passwordError = authValidation.validatePassword(data.password);
      if (passwordError) errors.password = passwordError;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
