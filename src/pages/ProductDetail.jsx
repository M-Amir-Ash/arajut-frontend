import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImageWithFallback from "../components/ImageWithFallback";
import ProductGrid from "../components/ProductGrid";
import { useCart } from "../context/CartContext";
import { useData } from "../context/DataContext";
import { formatRupiah } from "../utils/format";
import NotFound from "./NotFound";

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, loading, error, refresh } = useData();
  const product = products.find((item) => item.slug === slug);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const images = product
    ? [...new Set([product.image, ...(product.images || [])].filter(Boolean))]
    : [];

  if (loading && !product)
    return (
      <div className="container-page py-24 text-center text-ink/55">
        Memuat produk...
      </div>
    );
  if (error && !product)
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">Produk belum dapat dimuat</h1>
        <p className="mt-2 text-ink/60">{error}</p>
        <button
          onClick={refresh}
          className="mt-5 rounded-full bg-primary px-6 py-3 font-bold text-white"
        >
          Coba lagi
        </button>
      </div>
    );
  if (!product) return <NotFound />;

  const displayedImage = Math.min(activeImage, Math.max(images.length - 1, 0));
  const related = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 4);
  const add = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  const previous = () =>
    setActiveImage((current) => (current - 1 + images.length) % images.length);
  const next = () => setActiveImage((current) => (current + 1) % images.length);

  return (
    <div className="container-page py-10">
      <div className="mb-7 text-sm text-ink/55">
        <Link to="/products" className="hover:text-primary">
          Produk
        </Link>{" "}
        / {product.name}
      </div>
      <div className="grid gap-9 lg:grid-cols-2">
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-cream">
            {images.length ? (
              <ImageWithFallback
                src={images[displayedImage]}
                alt={`${product.name} - gambar ${displayedImage + 1}`}
                className="aspect-square h-full w-full object-cover"
              />
            ) : (
              <div className="grid aspect-square place-items-center text-center">
                <div>
                  <span className="text-7xl">🧶</span>
                  <p className="mt-3 font-bold">Gambar belum tersedia</p>
                </div>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previous}
                  aria-label="Gambar sebelumnya"
                  className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl shadow hover:bg-white"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Gambar berikutnya"
                  className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl shadow hover:bg-white"
                >
                  ›
                </button>
                <span className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-bold text-white">
                  {displayedImage + 1} / {images.length}
                </span>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((src, index) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => setActiveImage(index)}
                  className={`shrink-0 overflow-hidden rounded-xl border-2 ${displayedImage === index ? "border-primary" : "border-transparent"}`}
                  aria-label={`Tampilkan gambar ${index + 1}`}
                >
                  <ImageWithFallback
                    src={src}
                    alt=""
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="lg:py-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blush px-3 py-1 text-xs font-bold text-primary">
              {product.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${product.readyStock ? "bg-[#E3F0E4] text-[#387052]" : "bg-sky text-[#426778]"}`}
            >
              {product.readyStock ? "Ready Stock" : "Pre-order"}
            </span>
          </div>
          <h1 className="mt-5 font-serif text-4xl font-bold md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-extrabold text-primary">
            {formatRupiah(product.price)}
          </p>
          <p className="mt-6 whitespace-pre-line leading-8 text-ink/70">{product.description}</p>
          <div className="mt-7 grid grid-cols-2 gap-3 rounded-2xl bg-cream p-5 text-sm">
            <div>
              <span className="text-ink/55">Stok tersedia</span>
              <p className="mt-1 font-bold">{product.stock} buah</p>
            </div>
            {!product.readyStock && (
              <div>
                <span className="text-ink/55">Estimasi produksi</span>
                <p className="mt-1 font-bold">{product.preorderDuration}</p>
              </div>
            )}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-blush bg-white">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
                className="focus-ring h-12 w-12 rounded-full text-xl disabled:opacity-30"
              >
                −
              </button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={qty >= product.stock}
                className="focus-ring h-12 w-12 rounded-full text-xl disabled:opacity-30"
              >
                +
              </button>
            </div>
            <button
              onClick={add}
              disabled={!product.stock}
              className="focus-ring flex-1 rounded-full bg-primary px-7 py-3.5 font-bold text-white hover:bg-[#d97985] disabled:opacity-50"
            >
              {added ? "✓ Ditambahkan" : "Tambah ke Keranjang"}
            </button>
          </div>
          <p className="mt-5 text-sm text-ink/55">
            ♡ Dibuat secara handmade oleh perajin lokal Indonesia
          </p>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-18">
          <h2 className="mb-7 font-serif text-3xl font-bold">
            Kamu mungkin juga suka
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
