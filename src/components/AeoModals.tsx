"use client";

import { useState, useEffect } from "react";
import { ContactForm } from "./ContactForm";
import { ServiceModal } from "./ServiceModal";

export function AeoModals() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setIsFormOpen(true);
    window.addEventListener('openContactForm', openHandler);
    // backwards compat
    (window as any).toggleContactForm = openHandler;
    (window as any).openServiceModal = (service: any) => {
       setSelectedService(service);
       setIsServiceModalOpen(true);
    };
    return () => {
      window.removeEventListener('openContactForm', openHandler);
    };
  }, []);

  return (
    <>
      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <ServiceModal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)} 
        service={selectedService}
      />
    </>
  );
}
