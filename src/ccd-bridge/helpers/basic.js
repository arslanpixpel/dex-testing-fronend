export function noOp() {
  return undefined;
}

export function isDefined(v) {
  return v !== undefined;
}

export function ensureDefined(value, errorMessage) {
  if (value === undefined) {
    throw new Error(errorMessage);
  }

  return value;
}
