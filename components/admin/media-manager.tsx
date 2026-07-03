"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  removeBandPhoto,
  updateBandPhotoMetadata,
  updateHeroSettings,
  uploadMedia,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BandPhoto, BandPhotosSettings, HeroSettings } from "@/lib/types/database";
import { getLogoUrl } from "@/lib/brand";

type MediaManagerProps = {
  hero: HeroSettings;
  bandPhotos: BandPhotosSettings;
};

type SaveResult = { error?: string; success?: boolean };

function BandPhotoCard({
  photo,
  index,
  onSave,
  onRemove,
}: {
  photo: BandPhoto;
  index: number;
  onSave: (formData: FormData) => Promise<SaveResult>;
  onRemove: () => void;
}) {
  const [alt, setAlt] = useState(photo.alt);
  const [caption, setCaption] = useState(photo.caption);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const fieldId = `photo-${index}`;

  useEffect(() => {
    setAlt(photo.alt);
    setCaption(photo.caption);
  }, [photo.alt, photo.caption, photo.url]);

  useEffect(() => {
    setSaved(false);
  }, [photo.url]);

  function handleSave(formData: FormData) {
    setSaved(false);
    startTransition(async () => {
      const result = await onSave(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setSaved(true);
      toast.success("Photo metadata saved.");
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800">
      <div className="relative h-40">
        <Image
          src={photo.url}
          alt={alt || "Band photo preview"}
          fill
          className="object-cover"
        />
      </div>
      <form action={handleSave} className="space-y-3 p-3">
        <input type="hidden" name="url" value={photo.url} />
        <div className="space-y-2">
          <Label htmlFor={`${fieldId}-alt`}>Alt text</Label>
          <Input
            id={`${fieldId}-alt`}
            name="alt"
            value={alt}
            onChange={(event) => {
              setAlt(event.target.value);
              setSaved(false);
            }}
            placeholder="Describe the image for accessibility"
            className="border-zinc-700 bg-zinc-950"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldId}-caption`}>Caption</Label>
          <Textarea
            id={`${fieldId}-caption`}
            name="caption"
            rows={2}
            value={caption}
            onChange={(event) => {
              setCaption(event.target.value);
              setSaved(false);
            }}
            placeholder="Optional caption shown on the site"
            className="border-zinc-700 bg-zinc-950"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="bg-red-600 hover:bg-red-500"
          >
            {isPending ? "Saving…" : "Save metadata"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={onRemove}
          >
            Remove
          </Button>
          {saved ? (
            <span className="text-sm text-emerald-400">Saved</span>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export function MediaManager({ hero, bandPhotos }: MediaManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [heroSaved, setHeroSaved] = useState(false);

  async function handleUpload(kind: "logo" | "band-photo", formData: FormData) {
    formData.set("kind", kind);
    startTransition(async () => {
      const result = await uploadMedia(formData);
      if (result.error) {
        setMessage(result.error);
        toast.error(result.error);
        return;
      }
      setMessage("Upload complete.");
      toast.success("Upload complete.");
      router.refresh();
    });
  }

  function handleHeroUpdate(formData: FormData) {
    setHeroSaved(false);
    startTransition(async () => {
      const result = await updateHeroSettings(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setHeroSaved(true);
      toast.success("Hero settings saved.");
      router.refresh();
    });
  }

  async function handlePhotoMetadataUpdate(formData: FormData): Promise<SaveResult> {
    const result = await updateBandPhotoMetadata(formData);
    if (result.error) {
      return { error: result.error };
    }
    return { success: true };
  }

  async function handleRemovePhoto(url: string) {
    const formData = new FormData();
    formData.set("url", url);
    startTransition(async () => {
      await removeBandPhoto(formData);
      setMessage("Photo removed.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Media</h2>
        <p className="mt-2 text-zinc-400">
          Upload the band logo, hero image, and gallery photos. Edit alt text and
          captions after uploading.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle>Upload Logo</CardTitle>
            <CardDescription className="text-zinc-400">
              Stored in the `logos` bucket and linked to the hero section.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={(formData) => handleUpload("logo", formData)}
              className="space-y-4"
            >
              <Input
                type="file"
                name="file"
                accept="image/*"
                required
                className="border-zinc-700 bg-zinc-950"
              />
              <Button
                type="submit"
                disabled={isPending}
                className="bg-red-600 hover:bg-red-500"
              >
                Upload Logo
              </Button>
            </form>
            <div className="relative mt-4 h-16 w-full max-w-xs">
              <Image
                src={getLogoUrl(hero.logo_url)}
                alt={hero.logo_alt || "Band logo"}
                fill
                unoptimized
                className="object-contain object-left"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle>Upload Band Photo</CardTitle>
            <CardDescription className="text-zinc-400">
              Stored in the shared media bucket.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={(formData) => handleUpload("band-photo", formData)}
              className="space-y-4"
            >
              <Input
                type="file"
                name="file"
                accept="image/*"
                required
                className="border-zinc-700 bg-zinc-950"
              />
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input type="checkbox" name="use_as_hero" />
                Also use as hero image
              </label>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-red-600 hover:bg-red-500"
              >
                Upload Photo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>Hero Image Settings</CardTitle>
          <CardDescription className="text-zinc-400">
            Override uploaded asset URLs and edit accessibility metadata.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={handleHeroUpdate}
            className="grid gap-4 md:grid-cols-2"
            onChange={() => setHeroSaved(false)}
          >
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                name="logo_url"
                defaultValue={hero.logo_url}
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_alt">Logo alt text</Label>
              <Input
                id="logo_alt"
                name="logo_alt"
                defaultValue={hero.logo_alt}
                placeholder="Tinnitus logo"
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_image_url">Hero Image URL</Label>
              <Input
                id="hero_image_url"
                name="hero_image_url"
                defaultValue={hero.hero_image_url}
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_alt">Hero alt text</Label>
              <Input
                id="hero_alt"
                name="hero_alt"
                defaultValue={hero.hero_alt}
                placeholder="Tinnitus live on stage"
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-red-600 hover:bg-red-500 md:w-fit"
              >
                {isPending ? "Saving…" : "Save Hero Settings"}
              </Button>
              {heroSaved ? (
                <span className="text-sm text-emerald-400">Saved</span>
              ) : null}
            </div>
          </form>
          {hero.hero_image_url ? (
            <div className="relative mt-6 h-56 w-full overflow-hidden rounded-lg border border-zinc-800">
              <Image
                src={hero.hero_image_url}
                alt={hero.hero_alt || "Hero preview"}
                fill
                className="object-cover"
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>Band Photos</CardTitle>
          <CardDescription className="text-zinc-400">
            Edit alt text and captions for each uploaded photo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bandPhotos.photos.length === 0 ? (
            <p className="text-sm text-zinc-400">No band photos uploaded yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bandPhotos.photos.map((photo, index) => (
                <BandPhotoCard
                  key={photo.url}
                  photo={photo}
                  index={index}
                  onSave={handlePhotoMetadataUpdate}
                  onRemove={() => handleRemovePhoto(photo.url)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </div>
  );
}
