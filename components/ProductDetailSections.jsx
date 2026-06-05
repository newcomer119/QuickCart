"use client";
import Image from "next/image";
import { useState } from "react";
import { FiCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";
import {
  parseLines,
  parseLabeledItems,
  parseSpecLines,
  parseFaqs,
  getDimensionRows,
} from "@/lib/parseProductFields";
import { assets } from "@/assets/assets";

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h2>
    </div>
  );
}

function CheckList({ items }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-600">
          <FiCheck className="text-green-600 mt-1 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProductDescriptionSection({ description }) {
  if (!description) return null;
  const paragraphs = description.split("\n\n").filter(Boolean);
  return (
    <section className="py-10 border-t border-gray-200">
      <SectionHeading
        icon={<span className="text-orange-500 text-xl">📄</span>}
        title="Product Description"
      />
      <div className="space-y-4 text-gray-600 leading-relaxed max-w-4xl">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

export function KeyFeaturesSection({ keyFeatures }) {
  const items = parseLabeledItems(keyFeatures);
  if (!items.length) return null;
  return (
    <section className="py-10 border-t border-gray-200">
      <SectionHeading
        icon={<span className="text-orange-500 text-xl">⭐</span>}
        title="Key Features"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-5 bg-gray-50/50"
          >
            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MaterialSection({ additionalInfo, image }) {
  if (!additionalInfo) return null;
  return (
    <section className="py-10 border-t border-gray-200">
      <SectionHeading
        icon={<span className="text-orange-500 text-xl">🔧</span>}
        title="Material & Build Quality"
      />
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {additionalInfo}
        </p>
        {image && (
          <div className="rounded-lg overflow-hidden bg-gray-100 aspect-video relative">
            <Image
              src={image}
              alt="Material"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function SpecTable({ title, rows, fallbackRows }) {
  const data = rows.length ? rows : fallbackRows;
  if (!data.length) return null;
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="px-4 py-2.5 font-medium text-gray-600 border-b border-gray-100 w-2/5">
                {row.label}
              </td>
              <td className="px-4 py-2.5 text-gray-800 border-b border-gray-100">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Dimensions & weight — always shows all four rows */
export function DimensionsWeightTable({ product, compact = false, className = "" }) {
  const rows = getDimensionRows(product);
  return (
    <div className={className}>
      <h3
        className={`font-semibold text-gray-900 mb-2 ${
          compact ? "text-sm" : "text-base mb-3"
        }`}
      >
        Dimensions & Weight
      </h3>
      <table
        className={`w-full border border-gray-200 rounded-lg overflow-hidden ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td
                className={`font-medium text-gray-600 border-b border-gray-100 w-2/5 ${
                  compact ? "px-3 py-2" : "px-4 py-2.5"
                }`}
              >
                {row.label}
              </td>
              <td
                className={`text-gray-800 border-b border-gray-100 ${
                  compact ? "px-3 py-2" : "px-4 py-2.5"
                }`}
              >
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SpecsAndDimensionsSection({ product }) {
  const customSpecs = parseSpecLines(product.technicalSpecifications);
  const defaultSpecs = [
    { label: "Product Name", value: product.name },
    { label: "Printing Technology", value: "FDM 3D Printing" },
    { label: "Material", value: product.materialType || "PLA+" },
    { label: "Finish", value: "Matte" },
    {
      label: "Color",
      value: Array.isArray(product.colors)
        ? product.colors.join(", ")
        : product.colors || "—",
    },
    { label: "Country of Origin", value: "India" },
  ];

  return (
    <section className="py-10 border-t border-gray-200">
      <SectionHeading
        icon={<span className="text-orange-500 text-xl">📐</span>}
        title="Technical Specs & Dimensions"
      />
      <div className="grid md:grid-cols-2 gap-8">
        <SpecTable
          title="Technical Specifications"
          rows={customSpecs}
          fallbackRows={defaultSpecs}
        />
        <DimensionsWeightTable product={product} />
      </div>
    </section>
  );
}

// Pass isLamp={true} for lamp products to show the "No Power Required" badge
export function CompatibilitySection({ compatibility, isLamp = false }) {
  if (!compatibility) return null;
  return (
    <section className="py-10 border-t border-gray-200">
      <SectionHeading
        icon={<span className="text-orange-500 text-xl">🔌</span>}
        title="Compatibility"
      />
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <p className="md:col-span-2 text-gray-600 leading-relaxed whitespace-pre-line">
          {compatibility}
        </p>
        {isLamp && (
          <div className="border border-green-200 bg-green-50 rounded-lg p-5 text-center">
            <span className="text-3xl">🔌</span>
            <p className="font-semibold text-green-800 mt-2">No Power Required</p>
            <p className="text-xs text-green-700 mt-1">Display anywhere</p>
          </div>
        )}
      </div>
    </section>
  );
}

const IDEAL_ICONS = ["🏠", "💼", "🎁", "🛋️", "📚", "✨"];

export function IdealForSection({ idealFor }) {
  const items = parseLines(idealFor);
  if (!items.length) return null;
  return (
    <section className="py-10 border-t border-gray-200">
      <SectionHeading
        icon={<span className="text-orange-500 text-xl">🎯</span>}
        title="Ideal For"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {items.map((label, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg bg-gray-50/30"
          >
            <span className="text-2xl mb-2">{IDEAL_ICONS[i % IDEAL_ICONS.length]}</span>
            <span className="text-sm font-medium text-gray-800">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function IncludedAndCareSection({ boxIncludes, careInstructions }) {
  const included = parseLines(boxIncludes);
  const care = parseLines(careInstructions);
  if (!included.length && !care.length) return null;
  return (
    <section className="py-10 border-t border-gray-200">
      <div className="grid md:grid-cols-2 gap-10">
        {included.length > 0 && (
          <div>
            <SectionHeading
              icon={<span className="text-orange-500 text-xl">📦</span>}
              title="What's Included"
            />
            <CheckList items={included} />
          </div>
        )}
        {care.length > 0 && (
          <div>
            <SectionHeading
              icon={<span className="text-orange-500 text-xl">🧽</span>}
              title="Care Instructions"
            />
            <CheckList items={care} />
          </div>
        )}
      </div>
    </section>
  );
}

export function FaqSection({ product }) {
  const faqs = parseFaqs(product.faq1, product.faq2, product.faq3, product.faq4);
  const [openIndex, setOpenIndex] = useState(0);
  if (!faqs.length) return null;
  return (
    <section className="py-10 border-t border-gray-200">
      <SectionHeading
        icon={<span className="text-orange-500 text-xl">❓</span>}
        title="Frequently Asked Questions"
      />
      <div className="space-y-2 max-w-3xl">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition"
            >
              {faq.question}
              {openIndex === i ? (
                <FiChevronUp className="shrink-0" />
              ) : (
                <FiChevronDown className="shrink-0" />
              )}
            </button>
            {openIndex === i && (
              <div className="px-4 py-3 text-gray-600 text-sm border-t border-gray-200 bg-white">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function TrustBar() {
  return (
    <section className="py-10 border-t border-gray-200 bg-orange-50/40 rounded-xl px-6 my-6">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
          <span>✓ Premium Quality</span>
          <span>✓ Secure Payment</span>
          <span>✓ COD Available</span>
        </div>
      </div>
    </section>
  );
}