import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
} from "lucide-react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

const initialForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  image: "",
  stock: "",
};

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      description: product.description || "",
      image: product.image || "",
      stock: product.stock || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        alert("Product updated successfully");
      } else {
        await addProduct(productData);
        alert("Product added successfully");
      }

      closeForm();
      loadProducts();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Product operation failed"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);
      alert("Product deleted successfully");
      loadProducts();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900">
              Products
            </h1>

            <p className="text-zinc-500 mt-2">
              Add, edit and delete store products
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package size={24} />

              <h2 className="text-xl font-bold">
                All Products
              </h2>
            </div>

            <span className="bg-zinc-100 px-4 py-2 rounded-lg font-semibold">
              Total: {products.length}
            </span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-zinc-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center text-zinc-500">
              No products found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-zinc-50">
                  <tr className="text-left">
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">
                      Category
                    </th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-center">
                      Edit
                    </th>
                    <th className="px-6 py-4 text-center">
                      Delete
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t border-zinc-200 hover:bg-zinc-50"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-xl object-cover border"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/100x100?text=Product";
                          }}
                        />
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {product.name}
                      </td>

                      <td className="px-6 py-4">
                        ₹{product.price}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-zinc-100 px-3 py-1 rounded-full text-sm">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {product.stock ?? 0}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            openEditForm(product)
                          }
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          <Pencil size={17} />
                          Edit
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          <Trash2 size={17} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-7 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="p-2 rounded-lg hover:bg-zinc-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product name"
                value={form.name}
                onChange={handleChange}
                className="border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                min="0"
                className="border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                required
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                required
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                required
              />
            </div>

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
              className="w-full mt-4 border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:border-black"
              required
            />

            <textarea
              name="description"
              placeholder="Product description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full mt-4 border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:border-black resize-none"
              required
            />

            {form.image && (
              <div className="mt-4">
                <p className="font-semibold mb-2">
                  Image preview
                </p>

                <img
                  src={form.image}
                  alt="Preview"
                  className="w-28 h-28 object-cover rounded-xl border"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={closeForm}
                className="border border-zinc-300 px-6 py-3 rounded-xl hover:bg-zinc-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-zinc-800"
              >
                {editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Admin;