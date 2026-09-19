"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchInvoices, createInvoice, createCheckoutSession } from "@/app/api/billing";
import { fetchOwners } from "@/app/api/owners";

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth();
  
  const [invoices, setInvoices] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Invoice State
  const [isCreating, setIsCreating] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ owner_id: "", due_date: "", items: [{ description: "", quantity: 1, unit_price: "" }] });
  
  // Payment State
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;
    
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      alert("Payment successful! Your invoice is now marked as Paid.");
      // Clean up URL
      window.history.replaceState(null, "", "/billing");
    }
    if (query.get("canceled")) {
      alert("Payment was canceled.");
      window.history.replaceState(null, "", "/billing");
    }

    loadData();
  }, [user, authLoading]);

  async function loadData() {
    setLoading(true);
    try {
      const invs = await fetchInvoices();
      setInvoices(invs);
      
      if (user.role === "staff") {
        const owns = await fetchOwners();
        setOwners(owns);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load billing data.");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newInvoice.owner_id || !newInvoice.due_date) return alert("Fill all required fields");
    
    // Process items
    const parsedItems = newInvoice.items.map(item => ({
      ...item,
      quantity: parseInt(item.quantity) || 1,
      unit_price: parseFloat(item.unit_price) || 0
    }));

    try {
      await createInvoice({
        owner_id: parseInt(newInvoice.owner_id),
        due_date: newInvoice.due_date,
        items: parsedItems
      });
      setIsCreating(false);
      setNewInvoice({ owner_id: "", due_date: "", items: [{ description: "", quantity: 1, unit_price: "" }] });
      loadData();
    } catch (err) {
      alert("Failed to create invoice");
    }
  };

  const handlePay = async (invoiceId, amount) => {
    setPayingInvoiceId(invoiceId);
    try {
      const { url } = await createCheckoutSession(invoiceId);
      window.location.href = url; // Redirect to Stripe
    } catch (err) {
      alert(err.message || "Payment failed");
      setPayingInvoiceId(null);
    }
  };

  if (authLoading || loading) return <div className="p-8 text-center">Loading Billing...</div>;

  const totalOutstanding = invoices
    .filter(i => i.status === "Pending")
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  return (
    <div className="min-h-screen bg-[#f6f4ef] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-3xl p-8 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Invoicing 💳</h1>
            <p className="text-gray-600">
              {user.role === "staff" ? "Manage customer invoices and payments." : "View and pay your outstanding clinic bills."}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Total Outstanding</p>
            <p className="text-4xl font-extrabold text-red-600">${totalOutstanding.toFixed(2)}</p>
          </div>
        </div>

        {/* STAFF CONTROLS */}
        {user.role === "staff" && (
          <div className="flex justify-end">
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-bold shadow-sm transition-all"
            >
              {isCreating ? "Cancel" : "+ Generate Invoice"}
            </button>
          </div>
        )}

        {/* CREATE FORM */}
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-yellow-100">
            <h2 className="text-xl font-bold mb-6">Create New Invoice</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Customer</label>
                <select 
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
                  value={newInvoice.owner_id}
                  onChange={(e) => setNewInvoice({...newInvoice, owner_id: e.target.value})}
                  required
                >
                  <option value="">Select a customer...</option>
                  {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Due Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
                  value={newInvoice.due_date}
                  onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
                  required
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Line Items</h3>
            {newInvoice.items.map((item, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <input 
                  type="text" placeholder="Description (e.g. Rabies Vaccine)" required
                  className="flex-1 p-3 rounded-xl border border-gray-200 bg-gray-50"
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...newInvoice.items];
                    newItems[index].description = e.target.value;
                    setNewInvoice({...newInvoice, items: newItems});
                  }}
                />
                <input 
                  type="number" placeholder="Qty" required min="1"
                  className="w-24 p-3 rounded-xl border border-gray-200 bg-gray-50"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...newInvoice.items];
                    newItems[index].quantity = e.target.value;
                    setNewInvoice({...newInvoice, items: newItems});
                  }}
                />
                <input 
                  type="number" placeholder="Price ($)" required min="0" step="0.01"
                  className="w-32 p-3 rounded-xl border border-gray-200 bg-gray-50"
                  value={item.unit_price}
                  onChange={(e) => {
                    const newItems = [...newInvoice.items];
                    newItems[index].unit_price = e.target.value;
                    setNewInvoice({...newInvoice, items: newItems});
                  }}
                />
              </div>
            ))}
            
            <button 
              type="button"
              onClick={() => setNewInvoice({...newInvoice, items: [...newInvoice.items, {description: "", quantity: 1, unit_price: ""}]})}
              className="text-sm font-medium text-yellow-600 hover:text-yellow-700 mb-6"
            >
              + Add another item
            </button>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all">
                Save Invoice
              </button>
            </div>
          </form>
        )}

        {/* INVOICE LIST */}
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-gray-500">
              No invoices found.
            </div>
          ) : (
            invoices.map(invoice => (
              <div key={invoice.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-500 font-mono text-sm">INV-{invoice.id.toString().padStart(4, '0')}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    {invoice.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-600 max-w-sm">
                        <span>{item.quantity}x {item.description}</span>
                        <span>${(item.quantity * item.unit_price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-4">Due by: {new Date(invoice.due_date).toLocaleDateString()}</p>
                </div>
                
                <div className="flex flex-col items-end gap-4 min-w-[200px]">
                  <p className="text-3xl font-extrabold text-gray-900">${invoice.total_amount.toFixed(2)}</p>
                  
                  {user.role === "customer" && invoice.status === "Pending" && (
                    <button 
                      disabled={payingInvoiceId === invoice.id}
                      onClick={() => handlePay(invoice.id, invoice.total_amount)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-md transition-all disabled:opacity-50"
                    >
                      {payingInvoiceId === invoice.id ? "Processing..." : "Pay Now"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
