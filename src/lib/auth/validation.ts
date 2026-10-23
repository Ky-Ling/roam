// Client-side checks for the auth forms. Each returns an error message, or undefined when valid.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MIN_PASSWORD_LENGTH = 8

export const normalizeEmail = (email: string) => email.trim().toLowerCase()

export const validateName = (name: string) => (name.trim() ? undefined : "Enter your full name.")

export const validateEmail = (email: string) => {
  const value = normalizeEmail(email)
  if (!value) return "Enter your email address."

  return EMAIL_PATTERN.test(value) ? undefined : "Enter a valid email address."
}

export const validatePassword = (password: string) => {
  if (!password) return "Enter a password."

  return password.length >= MIN_PASSWORD_LENGTH ? undefined : `Use at least ${MIN_PASSWORD_LENGTH} characters.`
}
