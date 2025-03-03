export function formatPhoneNumber(phone: string) {
  return phone
    .replace(/\D/g, "") // Remove tudo que não for número
    .replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4") // Formato (XX) XXXXX-XXXX
    .replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3"); // Formato (XX) XXXX-XXXX
}
