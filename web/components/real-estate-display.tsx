"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RealEstateMap } from "./real-estate-map";
import type { RealEstateProperty } from "@/lib/ai/tools/get-real-estate";

interface MockRealEstateDisplayProps {
  properties: RealEstateProperty[];
  isVisible: boolean;
  onClose: () => void;
}

export function MockRealEstateDisplay({
  properties,
  isVisible,
  onClose,
}: MockRealEstateDisplayProps) {
  const [showMap, setShowMap] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* overlay to close on outside click */}
          <motion.div
            className="fixed z-40 bg-black top-0 left-0 w-screen h-dvh"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="fixed top-0 right-0 z-50 h-dvh w-full max-w-xl bg-background border-l border-border flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <h2 className="text-lg font-bold">Bất động sản</h2>
                <p className="text-xs text-muted-foreground">
                  Hiển thị {properties.length} bất động sản
                </p>
              </motion.div>
              <motion.button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors p-2"
                aria-label="Close"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {showMap ? (
                  <motion.div
                    key="map"
                    className="p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-full overflow-hidden">
                      <RealEstateMap properties={properties} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="details"
                    className="p-4 space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="font-bold">Chi tiết bất động sản</h3>
                    <div className="space-y-3">
                      {properties.map((property, index) => (
                        <RealEstateCard key={property.id} property={property} index={index} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer - Toggle buttons */}
            <motion.div
              className="border-t border-border p-3 flex gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              <motion.button
                onClick={() => setShowMap(true)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${showMap
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Bản đồ
              </motion.button>
              <motion.button
                onClick={() => setShowMap(false)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${!showMap
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Chi tiết
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function RealEstateCard({
  property,
  index,
}: {
  property: RealEstateProperty;
  index: number;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [property.imageUrl];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen]);

  return (
    <>
      <motion.div
        className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow relative group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.2 }}
      >
        {/* Image */}
        <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={property.name}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => {
              setLightboxIndex(currentImageIndex);
              setLightboxOpen(true);
            }}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ›
              </button>
              <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {currentImageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <h4 className="font-semibold text-sm">{property.name}</h4>
        <p className="text-xs text-muted-foreground mb-2">
          {property.location}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <div>
            <p className="text-muted-foreground">Giá</p>
            <p className="font-semibold text-green-600">
              {property.price?.toLocaleString("vi-VN")}{" "}
              {property.priceUnit || "VNĐ"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Diện tích</p>
            <p className="font-semibold">{property.area} m²</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">
            Mô tả chung
          </p>
          <p className="text-xs text-muted-foreground leading-snug text-justify">
            {property.description}
          </p>
        </div>
      </motion.div>

      {/* 🔍 Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/80 z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
            />

            {/* Image */}
            <motion.div
              className="fixed inset-0 z-[101] flex items-center justify-center px-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <img
                src={images[lightboxIndex]}
                className="max-h-[90vh] max-w-full rounded-lg object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Close */}
              <button
                className="absolute top-4 right-4 text-white text-xl"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 text-white text-3xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(
                        (i) => (i - 1 + images.length) % images.length
                      );
                    }}
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-4 text-white text-3xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((i) => (i + 1) % images.length);
                    }}
                  >
                    ›
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
