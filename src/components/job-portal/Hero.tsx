import { Tag } from "lucide-react";
import {
  getPopularCategories,
  getAllCategories,
} from "@/app/actions/categories";
import { getAllLocalities } from "@/app/actions/localities";
import { HeroSearch } from "./HeroSearch";
import Link from "next/link";

export async function Hero() {
  const popularCategories = await getPopularCategories(5);
  const allCategories = await getAllCategories();
  const localities = await getAllLocalities();

  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Fondo SVG */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-16"
        style={{ backgroundImage: "url('/HeroBackground.svg')" }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Impulsando el trabajo en el{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              interior bonaerense
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground-muted">
            Conectamos el talento local con las mejores pymes, empresas agropecuarias y comercios de la Provincia de Buenos Aires. Encuentra oportunidades laborales únicas sin irte de tu ciudad.
          </p>
        </div>

        {/* Buscador integrado en Hero */}
        <HeroSearch categories={allCategories} localities={localities} />

        {/* Categorías */}
        {popularCategories.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
            <span className="text-foreground-muted">Categorías populares:</span>
            {popularCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/empleos?category=${cat.id}`}
                className="radius-button bg-white px-4 py-1.5 text-foreground-muted shadow-sm ring-1 ring-border transition-all hover:text-primary hover:ring-primary/30 flex items-center gap-2"
              >
                {cat.icon ? (
                  <span>{cat.icon}</span>
                ) : (
                  <Tag className="h-4 w-4" />
                )}{" "}
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
