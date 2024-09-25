class FieldError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
    this.name = "FieldError";
  }
}

export default FieldError;
