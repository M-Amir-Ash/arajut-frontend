import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import EmptyState from "../components/EmptyState";
import ImageWithFallback from "../components/ImageWithFallback";
import ProductGrid from "../components/ProductGrid";
import { useData } from "../context/DataContext";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { products, categories, settings, loading, settingsLoading, error, refresh } = useData();
  const featured = products
    .filter((product) => product.featured && product.active !== false)
    .slice(0, 8);
  const productCategories = new Set(
    products
      .filter((product) => product.active !== false)
      .map((product) => product.category),
  );
  const activeCategories = categories
    .filter(
      (category) =>
        category.active !== false && productCategories.has(category.name),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const heroImage = settings.heroImage;
  const customProduct = products.find(
    (product) => product.slug === "custom-crochet-order",
  );
  const submit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      {error && (
        <div className="container-page pt-5">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={refresh} className="font-bold underline">
              Coba lagi
            </button>
          </div>
        </div>
      )}
      <section className="overflow-hidden bg-cream">
        <div className="container-page grid items-center gap-8 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block rounded-full bg-blush px-4 py-2 text-sm font-bold text-primary">
              {settings.heroBadge}
            </span>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight md:text-6xl">
              {settings.heroHeading}
              <br />
              <span className="text-primary">{settings.heroHighlight}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-ink/70">
              {settings.heroDescription}
            </p>
            <form
              onSubmit={submit}
              className="mt-7 flex max-w-lg rounded-full bg-white p-1.5 shadow-md"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 rounded-full px-5 outline-none"
                placeholder="Apa yang kamu cari?"
                aria-label="Cari produk"
              />
              <button className="focus-ring rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-[#d97985]">
                Cari
              </button>
            </form>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            {settingsLoading && (
              <div
                role="status"
                aria-label="Memuat gambar hero"
                className="absolute inset-0 z-20 aspect-[4/5] animate-pulse rounded-[3rem] bg-gradient-to-br from-blush to-sky shadow-xl"
              />
            )}
            <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-sky"></div>
            <div className="absolute -right-8 bottom-5 h-52 w-52 rounded-full bg-blush"></div>
            {heroImage ? (
              <ImageWithFallback
                src={heroImage}
                alt="Koleksi rajut Arajut"
                loading="eager"
                fetchPriority="high"
                className="relative aspect-[4/5] w-full rounded-[3rem] object-cover shadow-xl"
              />
            ) : (
              <div className="relative grid aspect-[4/5] w-full place-items-center rounded-[3rem] bg-blush text-center shadow-xl">
                <div>
                  <span className="text-7xl">🧶</span>
                  <p className="mt-4 font-serif text-2xl font-bold">Arajut</p>
                </div>
              </div>
            )}
            <div className="absolute -bottom-4 -left-3 rounded-2xl bg-white p-4 shadow-lg">
              <p className="font-serif text-xl font-bold text-primary">
                100% Handmade
              </p>
              <p className="text-xs text-ink/60">Dibuat oleh perajin lokal</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-bold uppercase tracking-widest text-primary">
              Jelajahi
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold">
              Kategori pilihan
            </h2>
          </div>
          <Link
            to="/products"
            className="focus-ring rounded font-bold text-primary hover:text-ink"
          >
            Lihat semua →
          </Link>
        </div>
        {loading && activeCategories.length === 0 ? (
          <p className="mt-8 text-center text-ink/55">Memuat kategori...</p>
        ) : activeCategories.length ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {activeCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="Kategori belum tersedia"
              text="Kategori produk akan tampil setelah ditambahkan oleh admin."
            />
          </div>
        )}
      </section>
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-primary">
              Favorit kamu
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold">
              Produk unggulan
            </h2>
          </div>
          <div className="mt-9">
            {loading && products.length === 0 ? (
              <p className="text-center text-ink/55">Memuat produk...</p>
            ) : (
              <ProductGrid products={featured} />
            )}
          </div>
        </div>
      </section>
      <section className="container-page py-16">
        <div className="grid overflow-hidden rounded-3xl bg-ink md:grid-cols-2">
          <div className="p-9 text-white md:p-14">
            <p className="font-bold uppercase tracking-widest text-[#F3A8B0]">
              Sesuai imajinasimu
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold">
              {settings.promoTitle}
            </h2>
            <p className="mt-4 text-white/70">{settings.promoDescription}</p>
            <Link
              to={
                customProduct
                  ? `/products/${customProduct.slug}`
                  : "/products?category=Custom"
              }
              className="focus-ring mt-7 inline-block rounded-full bg-primary px-6 py-3 font-bold hover:bg-[#f0a8b0]"
            >
              Mulai custom order
            </Link>
          </div>
          <div className="flex min-h-72 items-center justify-center bg-blush p-8 text-center">
            <div>
              <span className="text-8xl">🧶</span>
              <p className="mt-4 font-serif text-2xl font-bold">
                Dari benang menjadi cerita
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
