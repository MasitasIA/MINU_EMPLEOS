import { JobSearchCatalog } from "@/components/job-portal/JobSearchCatalog";
import { getAllJobs } from "@/app/actions/jobs";

export const metadata = {
  title: "Ofertas de Empleo | Minú Empleos",
  description: "Encuentra tu próximo trabajo en empresas locales.",
};

export default async function EmpleosPage() {
  const jobs = await getAllJobs();

  return (
    <main>
      <JobSearchCatalog initialJobs={jobs} />
    </main>
  );
}
