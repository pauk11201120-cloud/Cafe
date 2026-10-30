import { useState, useMemo } from "react";
import { products, categories, Product } from "./data/products";

interface CartItem {
  product: Product;
  quantity: number;
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "success">("cart");
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.some((note) =>
          note.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setCheckoutStep("form");
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep("success");
    setCart([]);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setCheckoutStep("cart");
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#2c1810]/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">☕</span>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[#f5e6d3] tracking-wide">
                  Specialty Coffee
                </h1>
                <p className="text-xs text-[#c4a882] hidden sm:block">
                  Премиальный спешелти-кофе
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-3 rounded-full bg-[#8b5e3c] hover:bg-[#a0714d] transition-colors text-[#f5e6d3]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4a574] text-[#2c1810] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3d2317] via-[#5c3a28] to-[#8b5e3c]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-[#f5e6d3] mb-4">
            Откройте мир спешелти-кофе
          </h2>
          <p className="text-base sm:text-lg text-[#c4a882] max-w-2xl mx-auto mb-8">
            Отборные зёрна со всего мира, обжаренные с заботой о каждой детали.
            Каждая чашка — это путешествие к истокам вкуса.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-[#d4a574]">
            <span className="flex items-center gap-1">
              <span>🌍</span> Прямые поставки
            </span>
            <span className="flex items-center gap-1">
              <span>🔥</span> Свежая обжарка
            </span>
            <span className="flex items-center gap-1">
              <span>📦</span> Быстрая доставка
            </span>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Поиск по названию, стране или вкусу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#d4a574]/30 focus:border-[#8b5e3c] focus:ring-2 focus:ring-[#8b5e3c]/20 outline-none transition-all text-[#2c1810] placeholder-[#a08060]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a08060]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#2c1810] text-[#f5e6d3] shadow-md"
                    : "bg-white text-[#5c3a28] border border-[#d4a574]/40 hover:border-[#8b5e3c] hover:bg-[#faf0e6]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-[#5c3a28] text-lg">
              Кофе не найден. Попробуйте изменить параметры поиска.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#d4a574]/20"
              >
                <div className="relative bg-gradient-to-br from-[#f5e6d3] to-[#e8d5c0] p-8 flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {product.image}
                  </span>
                  <div className="absolute top-3 right-3 bg-[#2c1810]/80 text-[#f5e6d3] text-xs px-2 py-1 rounded-full">
                    ★ {product.rating}
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[#2c1810] leading-tight">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm text-[#8b5e3c] mb-3">
                    {product.origin} • {product.weight}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.notes.map((note) => (
                      <span
                        key={note}
                        className="text-xs bg-[#faf0e6] text-[#5c3a28] px-2 py-1 rounded-full border border-[#d4a574]/30"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#2c1810]">
                      {product.price} ₽
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-2 rounded-lg bg-[#faf0e6] hover:bg-[#f5e6d3] text-[#5c3a28] transition-colors"
                        title="Подробнее"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 rounded-lg bg-[#2c1810] hover:bg-[#3d2317] text-[#f5e6d3] text-sm font-medium transition-colors"
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#2c1810] text-[#c4a882] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © 2026 Specialty Coffee. Все права защищены.
          </p>
          <p className="text-xs mt-2 text-[#8b6f52]">
            Мы обжариваем кофе каждый день, чтобы вы получали только свежий продукт.
          </p>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#faf7f2] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative bg-gradient-to-br from-[#f5e6d3] to-[#e8d5c0] p-10 flex items-center justify-center rounded-t-2xl">
              <span className="text-7xl">{selectedProduct.image}</span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#2c1810] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-[#2c1810] text-[#f5e6d3] px-2 py-1 rounded-full">
                  {selectedProduct.roast}
                </span>
                <span className="text-xs text-[#8b5e3c]">
                  ★ {selectedProduct.rating}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#2c1810] mb-1">
                {selectedProduct.name}
              </h3>
              <p className="text-[#8b5e3c] mb-4">
                {selectedProduct.origin} • {selectedProduct.weight}
              </p>
              <p className="text-[#5c3a28] leading-relaxed mb-4">
                {selectedProduct.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProduct.notes.map((note) => (
                  <span
                    key={note}
                    className="text-sm bg-[#faf0e6] text-[#5c3a28] px-3 py-1.5 rounded-full border border-[#d4a574]/30"
                  >
                    {note}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#d4a574]/20">
                <span className="text-2xl font-bold text-[#2c1810]">
                  {selectedProduct.price} ₽
                </span>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-3 rounded-xl bg-[#2c1810] hover:bg-[#3d2317] text-[#f5e6d3] font-medium transition-colors"
                >
                  Добавить в корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-[#faf7f2] w-full max-w-md h-full shadow-2xl flex flex-col">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#d4a574]/20">
              <h3 className="text-xl font-bold text-[#2c1810]">
                {checkoutStep === "cart" && "Корзина"}
                {checkoutStep === "form" && "Оформление заказа"}
                {checkoutStep === "success" && "Заказ оформлен!"}
              </h3>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-[#f5e6d3] text-[#5c3a28] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {checkoutStep === "cart" && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="text-5xl mb-4 block">🛒</span>
                      <p className="text-[#5c3a28]">Корзина пуста</p>
                      <p className="text-sm text-[#8b5e3c] mt-2">
                        Добавьте любимый кофе
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex gap-3 bg-white rounded-xl p-3 border border-[#d4a574]/20"
                        >
                          <div className="w-14 h-14 bg-[#f5e6d3] rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                            {item.product.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-[#2c1810] truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-xs text-[#8b5e3c]">
                              {item.product.price} ₽
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-[#faf0e6] hover:bg-[#f5e6d3] flex items-center justify-center text-[#5c3a28] text-sm font-bold transition-colors"
                              >
                                −
                              </button>
                              <span className="text-sm font-medium text-[#2c1810] w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-[#faf0e6] hover:bg-[#f5e6d3] flex items-center justify-center text-[#5c3a28] text-sm font-bold transition-colors"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="ml-auto p-1 text-[#a08060] hover:text-red-600 transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {checkoutStep === "form" && (
                <form
                  onSubmit={handleSubmitOrder}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-[#2c1810] mb-1">
                      Имя
                    </label>
                    <input
                      type="text"
                      required
                      value={orderForm.name}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#d4a574]/30 focus:border-[#8b5e3c] focus:ring-2 focus:ring-[#8b5e3c]/20 outline-none transition-all text-[#2c1810]"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c1810] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={orderForm.email}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#d4a574]/30 focus:border-[#8b5e3c] focus:ring-2 focus:ring-[#8b5e3c]/20 outline-none transition-all text-[#2c1810]"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c1810] mb-1">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderForm.phone}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#d4a574]/30 focus:border-[#8b5e3c] focus:ring-2 focus:ring-[#8b5e3c]/20 outline-none transition-all text-[#2c1810]"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c1810] mb-1">
                      Адрес доставки
                    </label>
                    <textarea
                      required
                      value={orderForm.address}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, address: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#d4a574]/30 focus:border-[#8b5e3c] focus:ring-2 focus:ring-[#8b5e3c]/20 outline-none transition-all text-[#2c1810] resize-none"
                      placeholder="Город, улица, дом, квартира"
                    />
                  </div>
                </form>
              )}

              {checkoutStep === "success" && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h4 className="text-xl font-bold text-[#2c1810] mb-2">
                    Спасибо за заказ!
                  </h4>
                  <p className="text-[#5c3a28]">
                    Мы отправили подтверждение на вашу почту. Ваш кофе будет
                    обжарен и отправлен в ближайшее время.
                  </p>
                  <div className="mt-6 p-4 bg-white rounded-xl border border-[#d4a574]/20">
                    <p className="text-sm text-[#8b5e3c]">
                      Номер заказа
                    </p>
                    <p className="text-lg font-bold text-[#2c1810]">
                      #{Math.floor(Math.random() * 90000) + 10000}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {checkoutStep === "cart" && cart.length > 0 && (
              <div className="border-t border-[#d4a574]/20 p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#5c3a28]">Итого:</span>
                  <span className="text-xl font-bold text-[#2c1810]">
                    {cartTotal} ₽
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-[#2c1810] hover:bg-[#3d2317] text-[#f5e6d3] font-medium transition-colors"
                >
                  Оформить заказ
                </button>
              </div>
            )}

            {checkoutStep === "form" && (
              <div className="border-t border-[#d4a574]/20 p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#5c3a28]">К оплате:</span>
                  <span className="text-xl font-bold text-[#2c1810]">
                    {cartTotal} ₽
                  </span>
                </div>
                <button
                  onClick={handleSubmitOrder}
                  className="w-full py-3 rounded-xl bg-[#2c1810] hover:bg-[#3d2317] text-[#f5e6d3] font-medium transition-colors"
                >
                  Подтвердить заказ
                </button>
                <button
                  onClick={() => setCheckoutStep("cart")}
                  className="w-full py-2 rounded-xl border border-[#d4a574]/40 text-[#5c3a28] text-sm hover:bg-[#faf0e6] transition-colors"
                >
                  ← Вернуться в корзину
                </button>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="border-t border-[#d4a574]/20 p-5">
                <button
                  onClick={closeCart}
                  className="w-full py-3 rounded-xl bg-[#2c1810] hover:bg-[#3d2317] text-[#f5e6d3] font-medium transition-colors"
                >
                  Продолжить покупки
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
