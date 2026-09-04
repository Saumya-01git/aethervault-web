// Utility module for name and password validation & strength evaluation

/**
 * Validates a user name to ensure it contains letters and is not purely numeric (e.g. "123").
 * @param {string} name 
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required.' };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long.' };
  }

  const isPurelyNumeric = /^\d+$/.test(trimmed);
  const hasLetters = /[a-zA-Z]/.test(trimmed);

  if (isPurelyNumeric || !hasLetters) {
    return {
      isValid: false,
      error: "Invalid name format. Name must contain at least 2 letters and cannot consist only of numbers (e.g. '123') or invalid characters."
    };
  }

  return { isValid: true, error: null };
}

/**
 * Evaluates password strength and criteria.
 * @param {string} password 
 * @returns {{ score: number, label: string, color: string, percentage: number, criteria: { minLength: boolean, hasUppercase: boolean, hasLowercase: boolean, hasNumber: boolean, hasSpecial: boolean } }}
 */
export function calculatePasswordStrength(password) {
  const pwd = password || '';

  const criteria = {
    minLength: pwd.length >= 8,
    hasUppercase: /[A-Z]/.test(pwd),
    hasLowercase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[^A-Za-z0-9]/.test(pwd)
  };

  const metCount = Object.values(criteria).filter(Boolean).length;

  let score = 0;
  let label = 'Very Weak';
  let color = 'bg-slate-700';
  let percentage = 0;

  if (pwd.length === 0) {
    return { score: 0, label: '', color: 'bg-slate-700', percentage: 0, criteria };
  }

  if (pwd.length < 6) {
    return { score: 1, label: 'Too Short', color: 'bg-red-500', percentage: 20, criteria };
  }

  if (metCount <= 2) {
    score = 1;
    label = 'Weak';
    color = 'bg-red-500';
    percentage = 25;
  } else if (metCount === 3) {
    score = 2;
    label = 'Fair';
    color = 'bg-amber-500';
    percentage = 50;
  } else if (metCount === 4) {
    score = 3;
    label = 'Good';
    color = 'bg-blue-500';
    percentage = 75;
  } else if (metCount === 5) {
    score = 4;
    label = 'Strong';
    color = 'bg-emerald-500';
    percentage = 100;
  }

  return { score, label, color, percentage, criteria };
}

/**
 * Validates a password before submission.
 * @param {string} password 
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: 'Password is required.' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true, error: null };
}
