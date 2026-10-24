import { useState, type FormEvent } from "react";
import { Star, Plus, CheckCircle, Quote } from "lucide-react";
import type { Review } from "../types";
import { useCatalog } from "../lib/useCatalog";
import { apiEnabled, errorMessage, isReview, requestJson } from "../lib/api";

const emptyReviews: Review[] = [];
export default function Reviews() {
  const { data: reviews, setData: setReviews, loading, error: loadError, reload } = useCatalog("/reviews", emptyReviews, isReview);
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);
  const average = reviews.length ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length : 0;
  const renderStars = (value: number) => <div className="flex gap-1" aria-label={value + " dari 5 bintang"}>
    {[1, 2, 3, 4, 5].map(star => <Star key={star} aria-hidden="true" className={"w-4 h-4 " + (star <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-200")} />)}
  </div>;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setErrorMsg("");
    if (!authorName.trim() || !text.trim()) { setErrorMsg("Nama dan ulasan wajib diisi."); return; }
    setSubmitting(true);
    try {
      const review = await requestJson("/reviews", isReview, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, rating, text }),
      });
      setReviews(current => [review, ...current]);
      setSubmittedRating(review.rating);
      setAuthorName("");
      setText("");
      setRating(5);
    } catch (error) {
      setErrorMsg(errorMessage(error));
    } finally { setSubmitting(false); }
  }

  return (
    <section id="ulasan" className="py-20 md:py-28 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Ulasan Pasien</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Apa Kata Mereka Tentang <span className="text-emerald-600">Pelayanan Kami?</span></h2>
          <p className="text-slate-600 mt-4">Pengalaman yang dibagikan pengunjung melalui website Klinik Rani Medika.</p>
        </div>
        {loadError && <div role="alert" className="mb-6 text-center text-amber-700">{loadError} <button type="button" onClick={reload} className="underline">Coba lagi</button></div>}
        {!apiEnabled && <p className="text-center mb-8 text-slate-500">Ulasan online belum tersedia pada halaman ini.</p>}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto shadow-sm">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-slate-800">{reviews.length ? average.toFixed(1) : "?"}</p>
            <div className="flex justify-center my-2">{renderStars(average)}</div>
            <p className="text-xs text-slate-500">{reviews.length} ulasan website</p>
          </div>
          <div className="w-full md:max-w-sm space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const percent = reviews.length ? Math.round(reviews.filter(review => review.rating === star).length / reviews.length * 100) : 0;
              return <div key={star} className="flex items-center gap-3 text-xs text-slate-500">
                <span className="w-16">{star} bintang</span>
                <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400" style={{ width: percent + "%" }} /></div>
                <span className="w-9 text-right">{percent}%</span>
              </div>;
            })}
          </div>
          {apiEnabled && <button disabled={submitting || loading} onClick={() => { setShowForm(value => !value); setSubmittedRating(null); setErrorMsg(""); }}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold text-xs px-6 py-3.5 rounded-2xl disabled:opacity-50">
            <Plus className="w-4 h-4" />{showForm ? "Tutup Formulir" : "Tulis Ulasan Baru"}
          </button>}
        </div>

        {showForm && <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 mb-12 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-4">Bagikan Pengalaman Anda</h3>
          {submittedRating !== null ? <div role="status" className="text-center bg-emerald-50 p-6 rounded-2xl text-emerald-800">
            <CheckCircle className="w-10 h-10 mx-auto mb-2" />
            <h4 className="font-bold">Ulasan Berhasil Terkirim!</h4>
            <p>Terima kasih atas penilaian bintang {submittedRating} Anda.</p>
          </div> : <form onSubmit={submit}>
            {errorMsg && <p role="alert" className="text-rose-700 mb-4">{errorMsg}</p>}
            <fieldset disabled={submitting} className="space-y-4">
              <div>
                <label htmlFor="review-name" className="block text-sm font-semibold mb-1">Nama Lengkap Anda</label>
                <input id="review-name" required maxLength={100} value={authorName} onChange={event => setAuthorName(event.target.value)} className="w-full border border-slate-200 rounded-xl p-3" />
              </div>
              <div role="group" aria-label="Beri penilaian bintang">
                <p className="text-sm font-semibold mb-2">Beri Penilaian (Bintang)</p>
                <div className="flex gap-3">{[1, 2, 3, 4, 5].map(star => <button key={star} type="button" aria-label={star + " bintang"} aria-pressed={rating === star} onClick={() => setRating(star)} className="rounded focus-visible:outline-emerald-600">
                  <Star className={"w-8 h-8 " + (star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
                </button>)}</div>
              </div>
              <div>
                <label htmlFor="review-text" className="block text-sm font-semibold mb-1">Isi Ulasan Pengalaman Anda</label>
                <textarea id="review-text" required maxLength={2000} rows={4} value={text} onChange={event => setText(event.target.value)} className="w-full border border-slate-200 rounded-xl p-3" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="border rounded-xl px-5 py-3 text-sm">Batal</button>
                <button type="submit" className="bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl">{submitting ? "Mengirim..." : "Kirim Ulasan"}</button>
              </div>
            </fieldset>
          </form>}
        </div>}

        {loading ? <p role="status" className="text-center text-slate-500">Memuat ulasan...</p>
          : reviews.length === 0 ? <p className="text-center text-slate-500">{loadError ? "Ulasan belum dapat dimuat." : "Belum ada ulasan yang dibagikan."}</p>
          : <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map(review => <article key={review.id} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center">{review.authorAvatar}</div>
                  <div><h4 className="font-bold text-slate-800">{review.authorName}</h4><p className="text-xs text-slate-400">{review.createdAt && Number.isFinite(Date.parse(review.createdAt)) ? new Date(review.createdAt).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" }) : review.timeAgo}</p></div>
                </div>
                <Quote className="w-8 h-8 text-emerald-100" />
              </div>
              {renderStars(review.rating)}
              <p className="text-slate-600 my-4 whitespace-pre-wrap break-words">{review.text}</p>
              <p className="text-xs text-emerald-700 border-t border-slate-100 pt-3">{review.source}</p>
            </article>)}
          </div>}
      </div>
    </section>
  );
}
