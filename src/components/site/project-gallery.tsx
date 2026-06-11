"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { MediaType, ProjectMedia } from "@/lib/types";

function isExternalVideo(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

function toEmbedUrl(url: string) {
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

function MediaGrid({
  items,
  title,
  onSelect,
}: {
  items: ProjectMedia[];
  title: string;
  onSelect: (url: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((media) => (
        <button
          key={media.id}
          onClick={() => onSelect(media.url)}
          className="group relative aspect-[4/3] overflow-hidden bg-card"
        >
          <Image
            src={media.url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>
      ))}
    </div>
  );
}

export function ProjectGallery({
  media,
  title,
}: {
  media: ProjectMedia[];
  title: string;
}) {
  const t = useTranslations("projects");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const byType = (type: MediaType) =>
    media
      .filter((m) => m.type === type)
      .sort((a, b) => a.sort_order - b.sort_order);

  const photos = byType("photo");
  const renders = byType("render");
  const plans = byType("plan");
  const videos = byType("video");

  const tabs = [
    { value: "photo", label: t("tabPhotos"), items: photos },
    { value: "render", label: t("tabRenders"), items: renders },
    { value: "plan", label: t("tabPlans"), items: plans },
    { value: "video", label: t("tabVideo"), items: videos },
  ].filter((tab) => tab.items.length > 0);

  if (tabs.length === 0) return null;

  return (
    <>
      <Tabs defaultValue={tabs[0].value}>
        <TabsList className="mb-6 flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="border border-border px-4 py-2 text-xs uppercase tracking-[0.15em] data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab.label} ({tab.items.length})
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.value === "video" ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {tab.items.map((video) =>
                  isExternalVideo(video.url) ? (
                    <iframe
                      key={video.id}
                      src={toEmbedUrl(video.url)}
                      title={title}
                      className="aspect-video w-full border-0 bg-card"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={video.id}
                      src={video.url}
                      controls
                      className="aspect-video w-full bg-card object-contain"
                    />
                  )
                )}
              </div>
            ) : (
              <MediaGrid
                items={tab.items}
                title={title}
                onSelect={setLightbox}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent
          showCloseButton
          className="max-w-5xl border-border bg-background p-2 sm:p-3"
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {lightbox ? (
            <div className="relative max-h-[80svh] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox}
                alt={title}
                className="mx-auto max-h-[80svh] w-auto object-contain"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
