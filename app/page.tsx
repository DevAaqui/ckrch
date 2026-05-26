"use client";

import { useEffect } from "react";
import { Chip } from "@heroui/react";
import { Sparkles } from "@gravity-ui/icons";

import { ImageCard } from "@/components/ImageCard";
import { galleryItems, VANISH_THRESHOLD } from "@/lib/images";

export default function HomePage() {
  useEffect(() => {
    const cardId = new URLSearchParams(window.location.search).get("card");
    if (!cardId) return;
    document
      .getElementById(cardId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Chip color="accent" size="sm" variant="soft">
            <Sparkles className="size-3" />
            <Chip.Label>HeroUI v3 · Tailwind v4 · Next.js</Chip.Label>
          </Chip>
          <Chip color="danger" size="sm" variant="soft">
            <Chip.Label>🪳 Infestation mode</Chip.Label>
          </Chip>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The Cockroach Gallery
          </h1>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base">
            Every tap on an image{" "}
            <span className="font-medium text-white">summons a cockroach</span>{" "}
            that scuttles onto the photo. Reach{" "}
            <span className="font-medium text-white">
              {VANISH_THRESHOLD} cockroaches
            </span>{" "}
            and the swarm converges to{" "}
            <span className="font-medium text-rose-300">
              eat the image alive
            </span>{" "}
            — revealing a hidden message underneath. Fully responsive. Tap with
            caution.
          </p>
        </div>
      </header>

      <section
        aria-label="Image gallery"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
      >
        {galleryItems.map((item) => (
          <ImageCard key={item.id} item={item} />
        ))}
      </section>

      <footer className="mt-4 flex flex-col items-center gap-1 pb-4 pt-2 text-center text-xs text-white/40 sm:text-sm">
        <p>
          Built with HeroUI v3, Tailwind CSS v4, and Next.js. Mobile responsive
          by design. No real cockroaches were harmed.
        </p>
      </footer>
    </main>
  );
}
