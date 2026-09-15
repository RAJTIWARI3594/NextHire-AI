import React from "react";
import type { ResumeData } from "@/types/resume";

export function ProfessionalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="w-full space-y-5 rounded-sm border bg-white p-8 font-sans text-xs leading-relaxed text-slate-900 shadow-lg">
      <div className="flex items-center justify-between rounded-md bg-slate-900 p-5 text-white">
        <div>
          <h1 className="text-xl font-bold">{personalInfo.fullName}</h1>
          <p className="text-xs text-indigo-300">
            {personalInfo.professionalTitle}
          </p>
        </div>
        <div className="text-right text-[10px] text-slate-300">
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
          <p>{personalInfo.location}</p>
        </div>
      </div>

      {summary && <p className="leading-normal text-slate-700">{summary}</p>}

      {experience.length > 0 && (
        <div>
          <h2 className="mb-2 border-b-2 border-slate-900 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold">
                  <span>
                    {exp.role} | {exp.company}
                  </span>
                  <span className="font-normal text-slate-500">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>
                <p className="mt-1 text-slate-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h2 className="mb-1.5 border-b-2 border-slate-900 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
            Technical Skills
          </h2>
          <p className="text-slate-800">
            {skills.map((s) => s.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
