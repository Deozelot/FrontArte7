type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function message(el: Control): string {
  const v = el.validity;
  if (v.valueMissing) return "Este campo es obligatorio";
  if (v.typeMismatch) return "Introduce una URL válida, p. ej. https://…";
  if (v.rangeUnderflow || v.rangeOverflow) return `Debe estar entre ${el.getAttribute("min") ?? "—"} y ${el.getAttribute("max") ?? "∞"}`;
  if (v.customError) return el.validationMessage;
  return "Valor no válido";
}

const labelOf = (el: Control) => el.closest("label");

// Validates in Spanish; the message is shown under the field via label[data-error]. Returns true when valid.
export function validateForm(form: HTMLFormElement): boolean {
  let first: Control | null = null;
  for (const el of Array.from(form.elements) as Control[]) {
    if (!("validity" in el) || !el.willValidate) continue;
    const label = labelOf(el);
    if (el.validity.valid) {
      label?.removeAttribute("data-error");
      el.removeAttribute("aria-invalid");
      continue;
    }
    label?.setAttribute("data-error", message(el));
    el.setAttribute("aria-invalid", "true");
    first ??= el;
  }
  first?.focus();
  return !first;
}

export function clearFieldError(e: React.FormEvent<HTMLFormElement>) {
  const el = e.target as Control;
  labelOf(el)?.removeAttribute("data-error");
  el.removeAttribute("aria-invalid");
}
