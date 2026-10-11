import { Hero } from "@/components/job-portal/Hero";
import { TopJobs } from "@/components/job-portal/TopJobs";
import { FeaturedCompanies } from "@/components/job-portal/FeaturedCompanies";
import { getAllJobs } from "@/app/actions/jobs";
import { getAllCompanies } from "@/app/actions/companies";

// ISR en el Edge: Regenera la home en background cada 1 hora (3600s)
export const revalidate = 3600;

export default async function Home() {
  // Consultas paralelas y limitadas para no sobrecargar el payload
  const [jobs, companies] = await Promise.all([
    getAllJobs({ limit: 6 }),
    getAllCompanies(4),
  ]);

  const topJobs = jobs.slice(0, 6);
  const featuredCompanies = companies.slice(0, 4);

  return (
    <main>
      <Hero />
      <TopJobs jobs={topJobs} />
      <FeaturedCompanies companies={featuredCompanies} />
    </main>
  );
}

