import React from "react";
import type { ResumeData } from "@/types/resume";

export function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="w-full space-y-4 rounded-sm border bg-white p-8 font-sans text-xs leading-relaxed text-slate-800 shadow-lg">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-black">
          {personalInfo.fullName}
        </h1>
        <p className="text-xs text-slate-500">
          {personalInfo.professionalTitle} — {personalInfo.location}
        </p>
        <p className="text-[10px] text-slate-400">
          {personalInfo.email} | {personalInfo.phone}
        </p>
      </div>

      {summary && (
        <p className="border-l-2 border-slate-300 pl-3 italic text-slate-600">
          {summary}
        </p>
      )}

      {experience.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black">
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-0.5">
              <div className="flex justify-between font-medium">
                <span>
                  {exp.role}, {exp.company}
                </span>
                <span className="text-slate-400">
                  {exp.startDate} – {exp.endDate || "Present"}
                </span>
              </div>
              <p className="text-slate-600">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-black">
            Skills
          </h2>
          <p className="text-slate-600">
            {skills.map((s) => s.name).join(" / ")}
          </p>
        </div>
      )}
    </div>
  );
}
