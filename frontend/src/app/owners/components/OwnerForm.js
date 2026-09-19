"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOwner, updateOwner } from "../../api/owners";

const STORAGE_KEY = "owner-form-draft";

export default function OwnerForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  /* RESTORE DRAFT */
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setForm(JSON.parse(saved));
    }
  }, [initialData]);

  /* SAVE DRAFT */
  useEffect(() => {
    if (!isEdit) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }
  }, [form, isEdit]);

  /* VALIDATION */
  function validateField(name, value) {
    switch (name) {
      case "name":
        return value.trim() ? "" : "Name is required";

      case "email":
        return /^[^@]+@[^@]+\.[^@]+$/.test(value)
          ? ""
          : "Enter a valid email address";

      case "phone":
        return value.replace(/\D/g, "").length === 10
          ? ""
          : "Phone number must be 10 digits";

      default:
        return "";
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const formattedValue =
      name === "phone" ? formatPhone(value) : value;

    setForm((prev) => ({ ...prev, [name]: formattedValue }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, formattedValue),
      }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  }

  /*  FORM VALID */
  const isFormValid =
    form.name.trim() &&
    /^[^@]+@[^@]+\.[^@]+$/.test(form.email) &&
    form.phone.replace(/\D/g, "").length === 10;

  /* SUBMIT */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        phone: form.phone.replace(/\D/g, ""),
      };

      if (isEdit) {
        await updateOwner(initialData.id, payload);
      } else {
        await createOwner(payload);
        localStorage.removeItem(STORAGE_KEY);
      }

      router.push("/owners");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg border max-w-xl space-y-6"
    >
      <h2 className="text-2xl font-extrabold text-gray-900">
        {isEdit ? "Edit Owner" : "Add New Owner"}
      </h2>

      {/* NAME */}
      <Field
        label="Owner Name"
        name="name"
        value={form.name}
        error={errors.name}
        touched={touched.name}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* EMAIL */}
      <Field
        label="Email Address"
        name="email"
        type="email"
        value={form.email}
        error={errors.email}
        touched={touched.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* PHONE */}
      <Field
        label="Phone Number"
        name="phone"
        value={form.phone}
        error={errors.phone}
        touched={touched.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="XXX XXX XXXX"
      />

      {/* ADDRESS */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Address
        </label>
        <textarea
          rows={3}
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Street, City, State"
          className="
            w-full rounded-lg border border-gray-300
            px-3 py-2 text-gray-900
            placeholder:text-gray-400
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          "
        />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            isFormValid
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading
            ? "Saving..."
            : isEdit
            ? "Update Owner"
            : "Create Owner"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/owners")}
          className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* FIELD COMPONENT */
function Field({
  label,
  name,
  value,
  error,
  touched,
  onChange,
  onBlur,
  type = "text",
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full rounded-lg border px-3 py-2 text-gray-900
          placeholder:text-gray-400
          focus:ring-2 ${
            error && touched
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-indigo-500"
          }`}
      />
      {error && touched && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}

/* PHONE FORMATTER */
function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const parts = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!parts) return value;

  return [parts[1], parts[2], parts[3]].filter(Boolean).join(" ");
}
