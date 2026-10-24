import React, { useState, useEffect, useRef } from "react";
import { Service } from "../types";
import { useCatalog } from "../lib/useCatalog";
import { isService } from "../lib/api";
import { services as serviceCatalog } from "../data/clinic";
import { Activity, Smile, Baby, FlaskConical, Pill, Home, Check, ChevronRight, X, Clock, Banknote, ShieldCheck } from "lucide-react";

export default function Services() {
  const { data: services, loading, error } = useCatalog("/services", serviceCatalog, isService);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selectedService || !dialog) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [selectedService]);

  // Icon mapper function
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Activity":
        return <Activity className="w-6 h-6 text-emerald-600" />;
      case "Smile":
        return <Smile className="w-6 h-6 text-emerald-600" />;
      case "Baby":
        return <Baby className="w-6 h-6 text-emerald-600" />;
      case "FlaskConical":
        return <FlaskConical className="w-6 h-6 text-emerald-600" />;
      case "Pills":
        return <Pill className="w-6 h-6 text-emerald-600" />;
      case "Home":
        return <Home className="w-6 h-6 text-emerald-600" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      default:
        return <Activity className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section id="layanan" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Layanan Kami</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Pilihan Layanan Medis <span className="text-emerald-600">Terbaik & Komprehensif</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-600 mt-4 text-sm md:text-base leading-relaxed">
            Klinik Rani Medika menyediakan berbagai macam poli klinis dan penunjang medis yang siap melayani kebutuhan kesehatan utama keluarga Anda.
          </p>
        </div>

        {error && (
          <p role="status" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Data layanan terbaru belum dapat dimuat. Informasi yang tersedia tetap ditampilkan; konfirmasikan tarif dan layanan melalui WhatsApp klinik.
          </p>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="bg-emerald-50 w-fit p-3.5 rounded-2xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    {/* Maintain icon style on hover */}
                    <div className="group-hover:filter group-hover:brightness-0 group-hover:invert duration-300">
                      {renderIcon(srv.icon)}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-3 tracking-tight">{srv.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Est. {srv.duration}</span>
                  </div>
                  <button
                    onClick={() => setSelectedService(srv)}
                    className="inline-flex items-center text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors"
                  >
                    <span>Detail Tarif & Info</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedService && (
          <dialog
            ref={dialogRef}
            aria-labelledby="service-dialog-title"
            onCancel={(event) => {
              event.preventDefault();
              setSelectedService(null);
            }}
            onClick={(event) => {
              if (event.target !== event.currentTarget) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
                setSelectedService(null);
              }
            }}
            className="m-auto w-[calc(100%_-_2rem)] max-w-xl max-h-[calc(100dvh_-_2rem)] overflow-y-auto rounded-3xl bg-transparent p-0 backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 animate-scale-in">
              {/* Modal Banner */}
              <div className="bg-emerald-800 p-6 text-white relative">
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700/50 transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-700 rounded-xl">
                    <div className="filter brightness-0 invert">
                      {renderIcon(selectedService.icon)}
                    </div>
                  </div>
                  <div>
                    <h3 id="service-dialog-title" className="text-xl font-bold tracking-tight pr-8">{selectedService.title}</h3>
                    <p className="text-xs text-emerald-200">Informasi Tarif & Cakupan Layanan</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Deskripsi</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedService.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 text-xs">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Estimasi Tarif</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{selectedService.price}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1 text-xs">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Durasi Pemeriksaan</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{selectedService.duration}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">Cakupan Pemeriksaan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedService.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
                        <div className="w-4 h-4 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedService(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Tutup Informasi
                </button>
              </div>
            </div>
          </dialog>
        )}

      </div>
    </section>
  );
}
