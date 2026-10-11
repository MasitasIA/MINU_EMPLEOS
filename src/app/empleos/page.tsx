import { JobSearchCatalog } from "@/components/job-portal/JobSearchCatalog";
import { getAllJobs, getJobsForFacets } from "@/app/actions/jobs";
import { getAllCategories } from "@/app/actions/categories";
import { getAllLocalities } from "@/app/actions/localities";

export const metadata = {
  title: "Ofertas de Empleo | Minú Empleos",
  description: "Encuentra tu próximo trabajo en empresas locales.",
};

export default async function EmpleosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Ejecutamos la resolución de parámetros y las consultas cacheadas en paralelo
  const [resolvedParams, categories, localities, facetsData] = await Promise.all([
    searchParams,
    getAllCategories(),
    getAllLocalities(),
    getJobsForFacets(),
  ]);

  const catSlug = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const locSlug = typeof resolvedParams.locality === "string" ? resolvedParams.locality : undefined;

  const categoryId = catSlug ? categories.find((c: any) => c.slug === catSlug)?.id : undefined;
  const localityId = locSlug ? localities.find((l: any) => l.slug === locSlug)?.id : undefined;

  const filters = {
    q: typeof resolvedParams.q === "string" ? resolvedParams.q : undefined,
    category: categoryId,
    locality: localityId,
    job_type:
      typeof resolvedParams.job_type === "string"
        ? resolvedParams.job_type
        : undefined,
    modality:
      typeof resolvedParams.modality === "string"
        ? resolvedParams.modality
        : undefined,
  };

  const jobs = await getAllJobs(filters);

  return (
    <main>
      <JobSearchCatalog
        initialJobs={jobs}
        categories={categories}
        localities={localities}
        facetsData={facetsData}
      />
    </main>
  );
}
