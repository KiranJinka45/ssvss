import React from "react";
import { notFound } from "next/navigation";
import { CATALOG, getSareeBySku } from "@/data/catalog";
import { ProductDetailView } from "@/components/product/ProductDetailView";

export function generateStaticParams() {
  return CATALOG.map((saree) => ({
    sku: saree.sku.toLowerCase(),
  }));
}

interface ProductPageProps {
  params: Promise<{ sku: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { sku } = await params;
  const saree = getSareeBySku(sku);

  if (!saree) {
    notFound();
  }

  // Related sarees from the same category
  const similarSarees = CATALOG.filter(
    (item) => item.category === saree.category && item.sku !== saree.sku
  ).slice(0, 3);

  return <ProductDetailView saree={saree} similarSarees={similarSarees} />;
}