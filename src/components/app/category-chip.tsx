import {
  Gem,
  Shirt,
  UtensilsCrossed,
  Plane,
  Watch,
  Palette,
  BedDouble,
  type LucideIcon,
} from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { getCategory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const categoryIcons: Record<CategorySlug, LucideIcon> = {
  joyeria: Gem,
  moda: Shirt,
  gastronomia: UtensilsCrossed,
  viajes: Plane,
  relojeria: Watch,
  arte: Palette,
  hospitalidad: BedDouble,
};

export function CategoryDot({ slug }: { slug: CategorySlug }) {
  const { color } = getCategory(slug);
  return (
    <span
      className="inline-block size-2.5 shrink-0 rounded-full"
      style={{ background: color }}
    />
  );
}

export function CategoryChip({
  slug,
  className,
  withIcon = false,
}: {
  slug: CategorySlug;
  className?: string;
  withIcon?: boolean;
}) {
  const cat = getCategory(slug);
  const Icon = categoryIcons[slug];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-label-sm font-medium",
        className,
      )}
      style={{
        color: cat.color,
        borderColor: `${cat.color}55`,
        background: `${cat.color}14`,
      }}
    >
      {withIcon ? (
        <Icon className="size-3.5" />
      ) : (
        <span
          className="size-2 rounded-full"
          style={{ background: cat.color }}
        />
      )}
      {cat.name}
    </span>
  );
}
