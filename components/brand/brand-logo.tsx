import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_ASPECT = 1024 / 401;

const variantStyles = {
  header: "h-8 md:h-10",
  hero: "h-36 md:h-52",
  admin: "h-8",
} as const;

type BrandLogoProps = {
  src: string;
  variant?: keyof typeof variantStyles;
  className?: string;
  priority?: boolean;
};

function getDimensions(variant: keyof typeof variantStyles) {
  const heights = { header: 40, hero: 208, admin: 32 } as const;
  const height = heights[variant];
  return { height, width: Math.round(height * LOGO_ASPECT) };
}

export function BrandLogo({
  src,
  variant = "header",
  className,
  priority = false,
}: BrandLogoProps) {
  const { height, width } = getDimensions(variant);

  return (
    <Image
      src={src}
      alt="Tinnitus"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={cn("w-auto shrink-0 object-contain", variantStyles[variant], className)}
    />
  );
}
