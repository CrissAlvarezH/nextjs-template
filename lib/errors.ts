export class PublicError extends Error {}

export class UserDoesNotExistsError extends PublicError {
  message = "Usuario no existe";
}

export class IncorrectCredentialsError extends PublicError {
  message = "Credenciales incorrectas";
}

export class IncorrectAuthMethodError extends PublicError {
  message = "Este usuario ingresó con otro metodo de autenticación";
}

export class EmailNotValidatedError extends PublicError {
  message = "El email aun no ha sido validado, revise su bandeja de entrada";
}

export class UnauthorizedError extends PublicError {
  message = "No autorizado";
}

export class UnauthenticatedUserError extends PublicError {
  message = "Usuario no autenticado";
}

export class InvalidLinkError extends PublicError {
  message = "Enlace invalido";
}

export class EmailTakenError extends PublicError {
  message = "El email ya esta siendo usado";
}

export class InvalidIdentifierError extends PublicError {
  message = "El id es invalido"
}

export class InvalidParamTypeError extends PublicError {
  message = "Tipo del parametro es invalido"
}

export class InternalServerError extends Error {}

export class DatabaseError extends InternalServerError {
  message = "database error";
}
