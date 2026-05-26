"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import { AVAILABLE_COLORS } from "@/lib/productColors";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_URL =
  "https://wa.me/918533801868?text=" +
  encodeURIComponent("Hi! I'm interested in 3D Printing Filament from Filament Freaks.");

const features = [
  {
    title: "High Quality",
    description: "Consistent diameter and premium resin for flawless prints every time.",
  },
  {
    title: "Durable",
    description: "Strong, reliable filament built to withstand demanding projects.",
  },
  {
    title: "Smooth Printing",
    description: "Excellent flow and layer adhesion for smooth, professional results.",
  },
  {
    title: "Multiple Colors",
    description: "A wide palette of vibrant colors to match any creative vision.",
  },
];

const whyChoose = [
  "Trusted by makers and professionals across India",
  "Wide range of colors and materials",
  "Fast shipping and responsive support",
  "Competitive pricing on premium filament",
];

const showcaseColors = AVAILABLE_COLORS.slice(0, 16);

export default function FilamentLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-slate-100 px-6 py-16 md:px-16 lg:px-32 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-orange-600">
              Filament Freaks
            </p>
            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-5xl md:leading-tight">
              Premium 3D Printing Filament for Perfect Prints
            </h1>
            <p className="mt-4 text-base text-gray-600 md:text-lg">
              High-quality, vibrant filament engineered for smooth layers, strong parts, and stunning finishes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <button
                onClick={() => router.push("/3d-printing-filament")}
                className="rounded-full bg-orange-600 px-8 py-3 font-medium text-white transition hover:bg-orange-700"
              >
                Order Now
              </button>
              <button
                onClick={() => {
                  document.getElementById("colors")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full border border-orange-600 px-8 py-3 font-medium text-orange-600 transition hover:bg-orange-50"
              >
                Explore Colors
              </button>
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <Image
              src={assets.Printer}
              alt="3D Printing Filament"
              className="w-56 md:w-80"
              priority
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:px-16 lg:px-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 md:text-3xl">
            Why Our Filament Stands Out
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-orange-600">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="colors" className="bg-slate-50 px-6 py-14 md:px-16 lg:px-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 md:text-3xl">
            Available Colors
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Choose from our full range of filament colors
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {showcaseColors.map((color) => (
              <span
                key={color}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm"
              >
                {color}
              </span>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">
            + {AVAILABLE_COLORS.length - showcaseColors.length} more colors available
          </p>
        </div>
      </section>

      <section className="px-6 py-14 md:px-16 lg:px-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 md:text-3xl">
            Why Choose Filament Freaks
          </h2>
          <ul className="mx-auto mt-8 max-w-xl space-y-4">
            {whyChoose.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <Image src={assets.checkmark} alt="" className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-14 md:px-16 lg:px-32 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 md:text-3xl">
            Product Gallery
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {[assets.banner, assets.banner2, assets.banner3, assets.kitchen, assets.Laptop, assets.Printer].map(
              (img, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  <Image src={img} alt={`Filament product ${i + 1}`} className="h-40 w-full object-cover md:h-52" />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="bg-orange-600 px-6 py-16 text-center text-white md:px-16 lg:px-32">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to Print Something Amazing?</h2>
          <p className="mt-3 text-orange-100">
            Order premium filament today or chat with us on WhatsApp for custom orders.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => router.push("/3d-printing-filament")}
              className="rounded-full bg-white px-8 py-3 font-medium text-orange-600 transition hover:bg-orange-50"
            >
              Order Now
            </button>
            <button
              onClick={() => {
                document.getElementById("colors")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full border-2 border-white px-8 py-3 font-medium text-white transition hover:bg-orange-700"
            >
              Explore Colors
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3 font-medium text-white transition hover:bg-[#20bd5a]"
            >
              <FaWhatsapp className="h-5 w-5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <p className="py-6 text-center text-sm text-gray-500">
        <Link href="/" className="text-orange-600 hover:underline">
          ← Back to Filament Freaks Store
        </Link>
      </p>
    </div>
  );
}
