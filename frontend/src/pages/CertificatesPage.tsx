import { Link } from "react-router-dom";
import { Award, CheckCircle2, Clock, FileText, Lock, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { exams, getCourseById, getPathById, issuedCertificates } from "@/data/mockData";
import { useLearningState } from "@/lib/learning-state";
import { cn } from "@/lib/utils";

export function CertificatesPage() {
  const { pathProgress } = useLearningState();

  return (
    <div className="space-y-10">
      <PageHeader title="Certificates & Exams" description="Earn course certificates, then prove job-ready skills with a certification exam." />

      <section>
        <h2 className="mb-1 text-lg font-semibold">Certification Exams</h2>
        <p className="mb-4 text-sm text-muted-foreground">Each exam unlocks when you complete its job-role path.</p>
        <div className="grid gap-4 lg:grid-cols-3">
          {exams.map((exam) => {
            const path = getPathById(exam.pathId);
            const progress = path ? pathProgress(path) : 0;
            const eligible = progress === 100;
            return (
              <Card key={exam.id} className={cn("flex flex-col", eligible && "border-primary/40")}>
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 font-mono text-xs font-bold text-primary">
                      {exam.code}
                    </span>
                    <Badge variant={eligible ? "default" : "outline"}>{eligible ? "Eligible" : "Locked"}</Badge>
                  </div>
                  <h3 className="mt-4 font-semibold">{exam.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{exam.description}</p>
                  <div className="mt-4 space-y-1.5 font-mono text-[11px] text-muted-foreground">
                    <p className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{exam.format}</p>
                    <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{exam.duration}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exam.skills.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                  {path && (
                    <Link to={`/learning-paths/${path.id}`} className="mt-5 block rounded-md border p-3 transition-colors hover:border-primary/40">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          {eligible ? <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> : <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                          {path.title} path
                        </span>
                        <span className="font-mono font-bold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </Link>
                  )}
                  <Button className="mt-4" variant={eligible ? "default" : "outline"} disabled title="Exam booking opens in a later phase">
                    {eligible ? "Book exam — coming soon" : "Complete the path to unlock"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold">Course Certificates</h2>
        <p className="mb-4 text-sm text-muted-foreground">Issued when you pass a course's skills assessment.</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {issuedCertificates.map((cert) => {
            const course = getCourseById(cert.courseId);
            if (!course) return null;
            return (
              <Card key={cert.id} className="bg-grid relative overflow-hidden">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-violet/20 blur-2xl" aria-hidden />
                <CardContent className="relative p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="eyebrow text-[10px] text-primary">Certificate of Completion</span>
                  </div>
                  <Link to={`/courses/${course.slug}`} className="mt-3 block font-semibold hover:text-primary">
                    {course.title}
                  </Link>
                  <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] text-muted-foreground">
                    <div>
                      <p className="eyebrow text-[9px]">Issued</p>
                      <p className="text-foreground">{cert.issuedOn}</p>
                    </div>
                    <div>
                      <p className="eyebrow text-[9px]">Credential ID</p>
                      <p className="text-foreground">{cert.credentialId}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" disabled title="PDF download arrives with the certificates API">
                    <Award /> Download PDF — soon
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
