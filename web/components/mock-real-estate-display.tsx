"use client";

import { useState } from "react";
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
                        <motion.div
                          key={property.id}
                          className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <img
                            src={property.imageUrl}
                            alt={property.name}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <h4 className="font-semibold text-sm line-clamp-2">
                            {property.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {property.location}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Giá</p>
                              <p className="font-semibold text-green-600">
                                ${property.price}M
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Diện tích</p>
                              <p className="font-semibold">
                                {property.area} m²
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {property.description}
                          </p>
                        </motion.div>
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
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  showMap
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
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  !showMap
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
