import React from "react";
import type { ResumeData } from "@/types/resume";

export function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, projects } =
    data;

  return (
    <div className="w-full space-y-5 rounded-sm border bg-white p-8 font-sans text-xs leading-relaxed text-slate-900 shadow-lg">
      {/* Accent Header */}
      <div className="space-y-1 border-l-4 border-indigo-600 py-1 pl-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-indigo-950">
          {personalInfo.fullName}
        </h1>
        <p className="text-sm font-semibold text-indigo-600">
          {personalInfo.professionalTitle}
        </p>
        <p className="text-[11px] text-slate-500">
          {personalInfo.email} • {personalInfo.phone} • {personalInfo.location}
        </p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-slate-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-2">
          <h2 className="border-b border-indigo-200 pb-1 text-xs font-bold uppercase tracking-wider text-indigo-900">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>
                    {exp.role}{" "}
                    <span className="text-indigo-600">@ {exp.company}</span>
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>
                <p className="text-slate-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-2">
          <h2 className="border-b border-indigo-200 pb-1 text-xs font-bold uppercase tracking-wider text-indigo-900">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between">
              <div>
                <span className="font-bold text-slate-900">{edu.degree}</span>{" "}
                in {edu.fieldOfStudy}
                <p className="text-slate-600">
                  {edu.institution} • {edu.grade}
                </p>
              </div>
              <span className="text-slate-500">
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="space-y-2">
          <h2 className="border-b border-indigo-200 pb-1 text-xs font-bold uppercase tracking-wider text-indigo-900">
            Core Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className="rounded border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-900"
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
