/**
 * Valida si una contraseña es segura.
 * Criterios: Mínimo 8 caracteres, al menos una mayúscula, un número y un caracter especial.
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "La contraseña debe tener al menos 8 caracteres.",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "La contraseña debe contener al menos una letra mayúscula.",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "La contraseña debe contener al menos un número.",
    };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message:
        "La contraseña debe contener al menos un carácter especial (ej: !@#$%).",
    };
  }

  return { isValid: true, message: "Contraseña segura." };
}

/**
 * Valida si un nombre de usuario tiene un formato correcto.
 * Criterios: Entre 3 y 20 caracteres, solo letras, números y guiones bajos, sin espacios.
 */
export function validateUsername(username: string): {
  isValid: boolean;
  message: string;
} {
  if (username.length < 3 || username.length > 20) {
    return { isValid: false, message: "El nombre de usuario debe tener entre 3 y 20 caracteres." };
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: "El nombre de usuario solo puede contener letras, números y guiones bajos sin espacios." };
  }
  return { isValid: true, message: "Nombre de usuario válido." };
}

/**
 * Valida si un teléfono tiene un formato correcto.
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\+\-\s]{7,15}$/;
  return phoneRegex.test(phone);
}
