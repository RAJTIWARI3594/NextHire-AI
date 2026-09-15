import React from "react";
import type { ResumeData } from "@/types/resume";

export function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="w-full space-y-5 rounded-sm border bg-white p-8 font-sans text-xs leading-relaxed text-slate-900 shadow-lg">
      <div className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 p-6 text-white shadow-md">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {personalInfo.fullName}
        </h1>
        <p className="text-sm font-medium text-purple-200">
          {personalInfo.professionalTitle}
        </p>
        <p className="mt-2 text-[11px] text-purple-100">
          {personalInfo.email} • {personalInfo.phone} • {personalInfo.location}
        </p>
      </div>

      {summary && (
        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
          <p className="text-slate-700">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="border-b-2 border-purple-500 pb-1 text-xs font-bold uppercase tracking-wider text-purple-900">
            Experience & Achievements
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>
                  {exp.role}{" "}
                  <span className="text-purple-600">@ {exp.company}</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  {exp.startDate} - {exp.endDate || "Present"}
                </span>
              </div>
              <p className="text-slate-700">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="space-y-2">
          <h2 className="border-b-2 border-purple-500 pb-1 text-xs font-bold uppercase tracking-wider text-purple-900">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className="rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-semibold text-purple-900"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
