import React from "react";
import type { ResumeData } from "@/types/resume";

export function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, projects } =
    data;

  return (
    <div className="w-full space-y-5 rounded-sm border bg-white p-8 font-serif text-xs leading-relaxed text-slate-900 shadow-lg">
      {/* Header */}
      <div className="space-y-1 border-b pb-4 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight">
          {personalInfo.fullName}
        </h1>
        <p className="text-sm italic text-slate-700">
          {personalInfo.professionalTitle}
        </p>
        <p className="text-[11px] text-slate-600">
          {personalInfo.location} • {personalInfo.email} • {personalInfo.phone}
        </p>
        {(personalInfo.githubUrl || personalInfo.linkedinUrl) && (
          <p className="font-sans text-[10px] text-slate-500">
            {personalInfo.linkedinUrl} • {personalInfo.githubUrl}
          </p>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div>
          <h2 className="mb-1.5 border-b border-slate-300 pb-0.5 text-xs font-bold uppercase tracking-wider">
            Professional Summary
          </h2>
          <p className="text-slate-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div>
          <h2 className="mb-2 border-b border-slate-300 pb-0.5 text-xs font-bold uppercase tracking-wider">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>
                    {exp.role} — {exp.company}
                  </span>
                  <span className="font-normal text-slate-600">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>
                <p className="mt-1 text-slate-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <h2 className="mb-2 border-b border-slate-300 pb-0.5 text-xs font-bold uppercase tracking-wider">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between">
              <div>
                <span className="font-bold">{edu.degree}</span> in{" "}
                {edu.fieldOfStudy} — {edu.institution}
              </div>
              <span className="text-slate-600">
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="mb-1.5 border-b border-slate-300 pb-0.5 text-xs font-bold uppercase tracking-wider">
            Skills & Competencies
          </h2>
          <p className="text-slate-800">
            {skills.map((s) => s.name).join(" • ")}
          </p>
        </div>
      )}
    </div>
  );
}
