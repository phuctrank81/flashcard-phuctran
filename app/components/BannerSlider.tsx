import React from 'react'

const Slider = () => {
  const BannerSlider = () => {
  const [current, setCurrent] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 text-white mb-8 shadow-lg">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            className={`w-full flex-shrink-0 ${slide.color} h-64 md:h-72 flex items-center justify-center`}
          >
            <div className="max-w-4xl mx-auto px-6 md:px-12 flex items-center gap-8 w-full">
              <div className="hidden md:flex flex-shrink-0 bg-white/10 p-6 rounded-full backdrop-blur-sm">
                {slide.icon}
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
                  Featured Tip
                </span>
                <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">{slide.title}</h2>
                <p className="text-slate-300 text-sm md:text-lg max-w-xl leading-relaxed">{slide.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              current === idx ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
}

export default Slider