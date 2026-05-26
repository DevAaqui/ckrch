"use client";

import { Chip } from "@heroui/react";
import { Sparkles } from "@gravity-ui/icons";

import { ImageCard } from "@/components/ImageCard";
import { galleryItems, VANISH_THRESHOLD } from "@/lib/images";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Chip color="accent" size="sm" variant="soft">
            <Sparkles className="size-3" />
            <Chip.Label>HeroUI v3 · Tailwind v4 · Next.js</Chip.Label>
          </Chip>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Vanish Gallery
          </h1>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base">
            Tap any image{" "}
            <span className="font-medium text-white">
              {VANISH_THRESHOLD} times
            </span>{" "}
            to make it fade away. Once it&apos;s gone, the image is cleared and
            a hidden context takes its place. Try it on your phone — every card
            is fully responsive.
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
          by design.
        </p>
      </footer>
    </main>
  );
}
