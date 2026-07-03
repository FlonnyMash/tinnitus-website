"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  removeBandPhoto,
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
import type { BandPhotosSettings, HeroSettings } from "@/lib/types/database";
import { getLogoUrl } from "@/lib/brand";

type MediaManagerProps = {
  hero: HeroSettings;
  bandPhotos: BandPhotosSettings;
};

export function MediaManager({ hero, bandPhotos }: MediaManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload(kind: "logo" | "band-photo", formData: FormData) {
    formData.set("kind", kind);
    startTransition(async () => {
      const result = await uploadMedia(formData);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setMessage("Upload complete.");
      router.refresh();
    });
  }

  async function handleHeroUpdate(formData: FormData) {
    startTransition(async () => {
      const result = await updateHeroSettings(formData);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setMessage("Hero settings updated.");
      router.refresh();
    });
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
          Upload the band logo, hero image, and gallery photos.
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
                alt="Band logo"
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
          <CardTitle>Hero Image URLs</CardTitle>
          <CardDescription className="text-zinc-400">
            Override uploaded asset URLs manually if needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleHeroUpdate} className="grid gap-4 md:grid-cols-2">
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
              <Label htmlFor="hero_image_url">Hero Image URL</Label>
              <Input
                id="hero_image_url"
                name="hero_image_url"
                defaultValue={hero.hero_image_url}
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-red-600 hover:bg-red-500 md:col-span-2 md:w-fit"
            >
              Save Hero Settings
            </Button>
          </form>
          {hero.hero_image_url ? (
            <div className="relative mt-6 h-56 w-full overflow-hidden rounded-lg border border-zinc-800">
              <Image
                src={hero.hero_image_url}
                alt="Hero preview"
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
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bandPhotos.urls.map((url) => (
              <div
                key={url}
                className="overflow-hidden rounded-lg border border-zinc-800"
              >
                <div className="relative h-40">
                  <Image src={url} alt="Band photo" fill className="object-cover" />
                </div>
                <div className="p-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => handleRemovePhoto(url)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </div>
  );
}
