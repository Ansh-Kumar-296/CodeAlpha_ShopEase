import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { getProducts } from "../api/productApi";
import ProductCard from "./ProductCard";

const Products = () => {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] =
    useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let data = [...products];

    const searchText = search.trim().toLowerCase();

    if (searchText) {
      data = data.filter((product) => {
        const name =
          product.name?.toLowerCase() || "";

        const description =
          product.description?.toLowerCase() || "";

        const productCategory =
          product.category?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          description.includes(searchText) ||
          productCategory.includes(searchText)
        );
      });
    }

    if (category !== "All") {
      data = data.filter(
        (product) => product.category === category
      );
    }

    if (sort === "priceLow") {
      data.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    } else if (sort === "priceHigh") {
      data.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    } else if (sort === "rating") {
      data.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    } else {
      data.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    setFilteredProducts(data);
  }, [products, search, category, sort]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      const productList = Array.isArray(data)
        ? data
        : [];

      setProducts(productList);
      setFilteredProducts(productList);
    } catch (error) {
      console.error(error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  return (
    <section className="bg-zinc-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-zinc-950">
              Featured Products
            </h1>

            <p className="text-zinc-600 mt-2">
              Explore our latest products
            </p>
          </div>

          <p className="text-zinc-600 font-medium">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-4 mb-10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full bg-white text-zinc-900 border border-zinc-300 rounded-xl pl-12 pr-4 py-3 outline-none placeholder:text-zinc-500 focus:border-black"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full lg:w-52 bg-white text-zinc-900 border border-zinc-300 rounded-xl pl-11 pr-10 py-3 outline-none focus:border-black"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="w-full lg:w-52 bg-white text-zinc-900 border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:border-black"
            >
              <option value="newest">Newest</option>

              <option value="priceLow">
                Price: Low to High
              </option>

              <option value="priceHigh">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-zinc-800">
              Loading products...
            </h2>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl text-center py-20">
            <h2 className="text-3xl font-bold text-zinc-900">
              No Products Found
            </h2>

            <p className="text-zinc-600 mt-2">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 items-stretch">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;