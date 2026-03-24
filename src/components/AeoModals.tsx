"use client";

import { useState, useEffect } from "react";
import { ContactForm } from "./ContactForm";
import { ServiceModal } from "./ServiceModal";

export function AeoModals() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  useEffect(() => {
    (window as any).toggleContactForm = () => setIsFormOpen(!isFormOpen);
    (window as any).openServiceModal = (service: any) => {
       setSelectedService(service);
       setIsServiceModalOpen(true);
    };
  }, [isFormOpen]);

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
