import { getUser } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { getApplicationsForJob } from "@/app/actions/applications";
import { createClient } from "@/lib/supabase/server";
import { ApplicationsList } from "@/components/job-portal/ApplicationsList";

export const metadata = {
  title: "Gestión de Postulaciones | Minú Empleos",
};

export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await getUser();
  if (!user) {
    redirect("/iniciar");
  }

  const supabase = await createClient();
  const { data: job } = await supabase
    .from("jobs")
    .select("name, id")
    .eq("id", resolvedParams.id)
    .single();

  if (!job) {
    notFound();
  }

  const applications = await getApplicationsForJob(resolvedParams.id);

  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ApplicationsList 
          jobId={job.id} 
          jobName={job.name} 
          initialApplications={applications} 
        />
      </div>
    </div>
  );
}
