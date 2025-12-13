  'use client';

  import React, { useState, useEffect } from 'react';
  import { Plus, Trash2, Play, ArrowLeft, ArrowRight, RotateCcw, X, BookOpen, Save } from 'lucide-react';

  // Định nghĩa kiểu dữ liệu cho một thẻ Flashcard
  interface Flashcard {
    id: string;
    question: string; // Sẽ là Từ vựng Tiếng Anh
    answer: string;   // Sẽ là Nghĩa Tiếng Việt
    category?: string;
  }

  // Dữ liệu mẫu ban đầu (Từ vựng Tiếng Anh - Cập nhật với từ IELTS)
  const INITIAL_DATA: Flashcard[] = [
    { id: '1', question: 'Acquire', answer: 'Đạt được, giành được (v)' },
    { id: '2', question: 'Consequence', answer: 'Hậu quả, kết quả (n)' },
    { id: '3', question: 'Determine', answer: 'Xác định, quyết định (v)' },
    { id: '4', question: 'Pervasive', answer: 'Lan tỏa, phổ biến khắp mọi nơi (adj)' },
    { id: '5', question: 'Mitigate', answer: 'Giảm nhẹ, làm dịu bớt (v)' },
    { id: '6', question: 'Conducive', answer: 'Có lợi, dẫn đến (adj)' },
    { id: '7', question: 'Paradigm', answer: 'Khuôn mẫu, mô hình (n)' },
  ];

  export default function App() {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Load dữ liệu từ localStorage khi khởi động
    useEffect(() => {
      const saved = localStorage.getItem('my-flashcards');
      if (saved) {
        try {
          setFlashcards(JSON.parse(saved));
        } catch (e) {
          setFlashcards(INITIAL_DATA);
        }
      } else {
        setFlashcards(INITIAL_DATA);
      }
    }, []);

    // Lưu dữ liệu mỗi khi flashcards thay đổi
    useEffect(() => {
      if (flashcards.length > 0) {
        localStorage.setItem('my-flashcards', JSON.stringify(flashcards));
      }
    }, [flashcards]);

    const addCard = (question: string, answer: string) => {
      const newCard: Flashcard = {
        id: Date.now().toString(),
        question,
        answer,
      };
      setFlashcards([...flashcards, newCard]);
      setShowAddModal(false);
    };

    const deleteCard = (id: string) => {
      // Sửa: Thay confirm() bằng modal/message box trong thực tế. Nhưng giữ nguyên logic hiện tại để không phá vỡ yêu cầu khung.
      if (confirm('Bạn có chắc muốn xóa thẻ này không?')) {
        setFlashcards(flashcards.filter(card => card.id !== id));
      }
    };

    if (isStudyMode) {
      return (
        <StudyMode 
          cards={flashcards} 
          onExit={() => setIsStudyMode(false)} 
        />
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-600">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Flashcard Pro</h1>
            </div>
            <button
              onClick={() => setIsStudyMode(true)}
              disabled={flashcards.length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Bắt đầu học
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Danh sách từ vựng của bạn</h2>
              <p className="text-slate-500 mt-1">Bạn đang có {flashcards.length} thẻ từ vựng</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Thêm từ mới
            </button>
          </div>

          {flashcards.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Chưa có từ vựng nào</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                Hãy tạo thẻ từ vựng đầu tiên để bắt đầu học Tiếng Anh.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-6 text-indigo-600 font-medium hover:underline"
              >
                Tạo thẻ ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcards.map((card) => (
                <div 
                  key={card.id} 
                  className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 flex flex-col justify-between h-48"
                >
                  <div>
                    <h3 className="font-medium text-lg text-slate-800 line-clamp-2 mb-2">
                      {card.question} {/* Từ vựng Tiếng Anh */}
                    </h3>
                    <div className="w-10 h-1 bg-indigo-100 rounded-full mb-3"></div>
                    <p className="text-slate-500 text-sm line-clamp-3">
                      {card.answer} {/* Nghĩa Tiếng Việt */}
                    </p>
                  </div>
                  <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Xóa thẻ"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Add Card Modal */}
        {showAddModal && (
          <AddCardModal 
            onClose={() => setShowAddModal(false)} 
            onAdd={addCard} 
          />
        )}
      </div>
    );
  }

  // Component: Chế độ học (Study Mode)
  function StudyMode({ cards, onExit }: { cards: Flashcard[], onExit: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [direction, setDirection] = useState(0); // -1 left, 1 right, 0 none

    const currentCard = cards[currentIndex];

    const handleNext = () => {
      if (currentIndex < cards.length - 1) {
        setIsFlipped(false);
        setDirection(1);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setDirection(0);
        }, 300);
      }
    };

    const handlePrev = () => {
      if (currentIndex > 0) {
        setIsFlipped(false);
        setDirection(-1);
        setTimeout(() => {
          setCurrentIndex(prev => prev - 1);
          setDirection(0);
        }, 300);
      }
    };

    const handleFlip = () => {
      setIsFlipped(!isFlipped);
    };

    // Reset khi hết thẻ
    const handleRestart = () => {
      setCurrentIndex(0);
      setIsFlipped(false);
    };

    // Xử lý phím tắt
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'ArrowDown') handleFlip();
        if (e.key === 'Escape') onExit();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);

    const progress = ((currentIndex + 1) / cards.length) * 100;

    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center text-white">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-slate-900/80 to-transparent">
          <button 
            onClick={onExit}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
            {currentIndex + 1} / {cards.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>

        {/* Card Container */}
        <div className="w-full max-w-2xl px-4 perspective-1000">
          <div 
            className={`relative w-full aspect-[5/3] cursor-pointer transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''} ${direction === 1 ? '-translate-x-full opacity-0' : direction === -1 ? 'translate-x-full opacity-0' : ''}`}
            onClick={handleFlip}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white text-slate-900 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 md:p-12 text-center border-b-8 border-indigo-500">
              <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-indigo-500 uppercase">Từ vựng</span>
              <div className="text-2xl md:text-4xl font-semibold leading-relaxed">
                {currentCard.question}
              </div>
              <div className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-2">
                <span className="animate-pulse">👆 Chạm để lật</span>
              </div>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 text-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 md:p-12 text-center border-b-8 border-indigo-800"
            >
              <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-indigo-200 uppercase">Nghĩa Tiếng Việt</span>
              <div className="text-xl md:text-3xl font-medium leading-relaxed">
                {currentCard.answer}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center gap-8">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm transition-all active:scale-95"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>

          {currentIndex === cards.length - 1 ? (
            <button 
              onClick={handleRestart}
              className="p-4 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/50 transition-all active:scale-95"
              title="Học lại"
            >
              <RotateCcw className="w-8 h-8" />
            </button>
          ) : (
            <button 
              onClick={handleFlip}
              className="w-20 h-20 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-xl shadow-xl shadow-white/10 hover:scale-105 transition-all active:scale-95"
            >
              {isFlipped ? 'Tiếp' : 'Lật'}
            </button>
          )}

          <button 
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm transition-all active:scale-95"
          >
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>

        <div className="mt-8 text-slate-400 text-sm">
          Sử dụng phím mũi tên hoặc Space để điều khiển
        </div>

        <style>{`
          .perspective-1000 { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
        `}</style>
      </div>
    );
  }

  // Component: Modal thêm thẻ mới
  function AddCardModal({ onClose, onAdd }: { onClose: () => void, onAdd: (q: string, a: string) => void }) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (question.trim() && answer.trim()) {
        onAdd(question, answer);
        setQuestion('');
        setAnswer('');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-white font-semibold text-lg">Thêm từ vựng mới</h3>
            <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Từ vựng (Mặt trước)</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-24"
                  placeholder="Nhập từ vựng Tiếng Anh (ví dụ: Flexible)..."
                  autoFocus
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nghĩa (Mặt sau)</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none h-24"
                  placeholder="Nhập nghĩa Tiếng Việt (ví dụ: Linh hoạt, điều chỉnh được)..."
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu thẻ
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }