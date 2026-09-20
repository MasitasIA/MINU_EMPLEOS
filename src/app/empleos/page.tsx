import { JobSearchCatalog } from "@/components/job-portal/JobSearchCatalog";
import { getAllJobs } from "@/app/actions/jobs";
import { getAllCategories } from "@/app/actions/categories";
import { getAllLocalities } from "@/app/actions/localities";

export const metadata = {
  title: "Ofertas de Empleo | Minú Empleos",
  description: "Encuentra tu próximo trabajo en empresas locales.",
};

export default async function EmpleosPage() {
  const jobs = await getAllJobs();
  const categories = await getAllCategories();
  const localities = await getAllLocalities();

  return (
    <main>
      <JobSearchCatalog initialJobs={jobs} categories={categories} localities={localities} />
    </main>
  );
}
