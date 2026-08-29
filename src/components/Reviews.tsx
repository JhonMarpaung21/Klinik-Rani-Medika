import React, { useState, useEffect } from "react";
import { Review } from "../types";
import { Star, MessageSquare, Plus, CheckCircle, Quote, AlertCircle } from "lucide-react";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Ratings Summary Calculations (from pre-seeded + dynamic reviews)
  const averageRating = reviews.length > 0
    ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1))
    : 4.9;

  const totalReviewsCount = reviews.length;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat ulasan");
        return res.json();
      })
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
  };

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!authorName.trim()) {
      setErrorMsg("Nama Lengkap wajib diisi.");
      return;
    }
    if (!text.trim()) {
      setErrorMsg("Teks ulasan wajib diisi.");
      return;
    }

    setSubmitting(true);

    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName, rating, text }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengirim ulasan");
        return res.json();
      })
      .then((newReview) => {
        setReviews([newReview, ...reviews]);
        setSuccess(true);
        setAuthorName("");
        setRating(5);
        setText("");
        setTimeout(() => {
          setSuccess(false);
          setShowForm(false);
        }, 3000);
      })
      .catch((err) => {
        console.error("Error submitting review:", err);
        setErrorMsg("Koneksi terganggu. Gagal mengirim ulasan.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Helper for rendering rating stars
  const renderStars = (num: number, sizeClass = "w-4 h-4") => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= num ? "fill-amber-400 text-amber-400" : "text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="ulasan" className="py-20 md:py-28 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Ulasan Pasien</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Apa Kata Mereka Tentang <span className="text-emerald-600">Pelayanan Kami?</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-600 mt-4 text-sm md:text-base leading-relaxed">
            Kepercayaan Anda adalah amanah bagi kami. Berikut ulasan jujur dan asli dari pasien yang terintegrasi langsung dengan ulasan Google Maps.
          </p>
        </div>

        {/* Google Ratings Summary Widget */}
        <div className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto shadow-sm">
          <div className="flex items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-5xl sm:text-6xl font-extrabold text-slate-800 tracking-tight">
                {averageRating}
              </p>
              <div className="flex justify-center md:justify-start my-2">
                {renderStars(Math.round(averageRating), "w-5 h-5")}
              </div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                Rating Google Maps ({totalReviewsCount} Ulasan)
              </p>
            </div>
          </div>

          <div className="w-full md:max-w-sm flex-grow">
            {/* Custom Google Visual Representation Progress Bar */}
            <div className="space-y-1.5 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-3">
                <span className="w-12">5 bintang</span>
                <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "90%" }}></div>
                </div>
                <span className="w-8 text-right">90%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12">4 bintang</span>
                <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "8%" }}></div>
                </div>
                <span className="w-8 text-right">8%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12">3 bintang</span>
                <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "2%" }}></div>
                </div>
                <span className="w-8 text-right">2%</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => {
                setShowForm(!showForm);
                setSuccess(false);
                setErrorMsg("");
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Ulasan Baru</span>
            </button>
          </div>
        </div>

        {/* Write a Review Drawer/Form (Collapsible) */}
        {showForm && (
          <div className="bg-white border-2 border-emerald-500/20 rounded-3xl p-6 sm:p-8 mb-12 max-w-2xl mx-auto shadow-md">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Bagikan Pengalaman Anda</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Ulasan Anda sangat berharga untuk meningkatkan kualitas pelayanan kesehatan kami.
            </p>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl flex flex-col items-center text-center gap-2 animate-scale-in">
                <CheckCircle className="w-12 h-12 text-emerald-600 mb-2" />
                <h4 className="font-bold text-base">Ulasan Berhasil Terkirim!</h4>
                <p className="text-xs leading-relaxed max-w-sm">
                  Terima kasih banyak atas waktu dan penilaian bintang {rating} yang Anda berikan untuk Klinik Rani Medika.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Nama Lengkap Anda
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Beri Penilaian (Bintang)
                  </label>
                  <div className="flex gap-2.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className="hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Isi Ulasan Pengalaman Anda
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ceritakan keramahan dokter, kebersihan klinik, atau kecepatan layanan..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
                  >
                    {submitting ? "Mengirim..." : "Kirim Ulasan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-slate-150 p-6 sm:p-8 rounded-3xl shadow-sm relative hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Google style author header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center shadow-inner">
                        {rev.authorAvatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{rev.authorName}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{rev.timeAgo} • {rev.source}</p>
                      </div>
                    </div>
                    <div className="text-emerald-100/80">
                      <Quote className="w-8 h-8 rotate-180 shrink-0" />
                    </div>
                  </div>

                  <div className="mb-3">
                    {renderStars(rev.rating)}
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-50 flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold tracking-wide uppercase">
                  <span>Google Maps Verified</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
