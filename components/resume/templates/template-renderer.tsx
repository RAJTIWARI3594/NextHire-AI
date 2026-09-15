import React from "react";
import type { ResumeData, TemplateVariant } from "@/types/resume";
import { ClassicTemplate } from "./classic-template";
import { ModernTemplate } from "./modern-template";
import { ProfessionalTemplate } from "./professional-template";
import { MinimalTemplate } from "./minimal-template";
import { CreativeTemplate } from "./creative-template";

interface TemplateRendererProps {
  data: ResumeData;
  template?: TemplateVariant;
}

export function TemplateRenderer({ data, template }: TemplateRendererProps) {
  const active = template || data.template || "modern";

  switch (active) {
    case "classic":
      return <ClassicTemplate data={data} />;
    case "professional":
      return <ProfessionalTemplate data={data} />;
    case "minimal":
      return <MinimalTemplate data={data} />;
    case "creative":
      return <CreativeTemplate data={data} />;
    case "modern":
    default:
      return <ModernTemplate data={data} />;
  }
}
