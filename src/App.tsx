import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Profile from "./components/Profile";
import Services from "./components/Services";
import Doctors from "./components/Doctors";
import Address from "./components/Address";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [activeSection, setActiveSection] = useState("beranda");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  // Smooth scroll navigate to ID with header offset
  const handleNavigate = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // accounts for the sticky header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleSelectDoctorToBook = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    // Smooth scroll to the contact/booking section
    setTimeout(() => {
      handleNavigate("kontak");
    }, 100);
  };

  const handleClearSelectedDoctor = () => {
    setSelectedDoctorId("");
  };

  // Scrollspy: update active navbar state on scroll
  useEffect(() => {
    const sections = ["beranda", "profil", "layanan", "dokter", "alamat", "ulasan", "kontak"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // offset for triggers

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Sticky Header */}
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Sections */}
      <main>
        {/* Beranda (Home) */}
        <Hero
          onNavigateToBooking={() => handleNavigate("kontak")}
          onNavigateToServices={() => handleNavigate("layanan")}
        />

        {/* Profil (About Clinic) */}
        <Profile />

        {/* Layanan (Services) */}
        <Services />

        {/* Dokter (Doctors list with scheduling and CTA booking hook) */}
        <Doctors onSelectDoctorToBook={handleSelectDoctorToBook} />

        {/* Alamat (Address and mock vector interactive map) */}
        <Address />

        {/* Ulasan (Google Reviews simulation with dynamic review submittal) */}
        <Reviews />

        {/* Kontak (Booking Appointment forms with auto pre-select doctor hook) */}
        <Contact
          selectedDoctorId={selectedDoctorId}
          onClearSelectedDoctor={handleClearSelectedDoctor}
        />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
