import { fetchAuth } from "./config";

export async function fetchInvoices() {
  const res = await fetchAuth(`/invoices/`);
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
}

export async function fetchInvoiceById(id) {
  const res = await fetchAuth(`/invoices/${id}`);
  if (!res.ok) throw new Error("Failed to fetch invoice details");
  return res.json();
}

export async function createInvoice(invoiceData) {
  const res = await fetchAuth(`/invoices/`, {
    method: "POST",
    body: JSON.stringify(invoiceData),
  });
  if (!res.ok) throw new Error("Failed to create invoice");
  return res.json();
}

export async function payInvoice(id, paymentData) {
  const res = await fetchAuth(`/invoices/${id}/pay`, {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
  if (!res.ok) throw new Error("Failed to process payment");
  return res.json();
}
