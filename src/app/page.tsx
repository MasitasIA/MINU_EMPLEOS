import { Hero } from "@/components/job-portal/Hero";
import { TopJobs } from "@/components/job-portal/TopJobs";
import { FeaturedCompanies } from "@/components/job-portal/FeaturedCompanies";
import { getAllJobs } from "@/app/actions/jobs";
import { getAllCompanies } from "@/app/actions/companies";

export default async function Home() {
  const jobs = await getAllJobs();
  const companies = await getAllCompanies();

  // Tomamos los 6 más recientes como destacados/top
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
