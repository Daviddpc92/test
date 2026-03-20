/** Hash estable a partir del texto (misma asignatura → mismo valor). */
function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(31, h) + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Imágenes libres (Unsplash) temáticas de informática, redes, desarrollo y sistemas.
 * Misma asignatura → misma imagen de forma estable.
 */
const INFORMATICA_COVER_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1617839625591-e5a789593135?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1504639725590-04d0978d3112?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5a158158?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&h=400&fit=crop&auto=format&q=80",
];

/**
 * URL de portada por asignatura: fotografía temática de informática, estable entre visitas.
 */
export function subjectCoverImageUrl(subject: string): string {
  const idx = hashString(subject) % INFORMATICA_COVER_IMAGES.length;
  return INFORMATICA_COVER_IMAGES[idx]!;
}
