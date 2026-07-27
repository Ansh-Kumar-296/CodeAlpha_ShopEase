function Hero() {
  return (
    <section className="min-h-[85vh] bg-[#0f0f0f] text-white flex items-center justify-center px-10">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* Left Side */}
        <div>
          <p className="text-gray-400 uppercase tracking-[6px] mb-3">
            New Collection 2026
          </p>

          <h1 className="text-6xl font-extrabold leading-tight">
            Upgrade Your
            <br />
            Lifestyle.
          </h1>

          <p className="text-gray-400 mt-6 text-lg max-w-lg">
            Discover premium gadgets, fashion, and accessories at unbeatable
            prices. Fast delivery and secure checkout.
          </p>

          <div className="mt-10 flex gap-5">
            <button className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:scale-105 transition">
              Shop Now
            </button>

            <button className="border border-gray-600 px-8 py-3 rounded-xl hover:border-white transition">
              Explore
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700"
            alt="Product"
            className="rounded-3xl w-[500px] shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;