"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateHomepageSeo } from "@/app/actions/admin";
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
import type { HomepageSeo } from "@/lib/types/database";

type SeoManagerProps = {
  seo: HomepageSeo;
};

export function SeoManager({ seo }: SeoManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(seo.title);
  const [description, setDescription] = useState(seo.description);

  useEffect(() => {
    setTitle(seo.title);
    setDescription(seo.description);
  }, [seo.title, seo.description]);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateHomepageSeo(formData);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">SEO</h2>
        <p className="mt-2 text-zinc-400">
          Edit the homepage meta title and description.
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>Homepage Metadata</CardTitle>
          <CardDescription className="text-zinc-400">
            These values power the public landing page SEO tags.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meta Title</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Meta Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-red-600 hover:bg-red-500"
            >
              Save SEO Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
