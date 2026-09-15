import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-card/40 p-8 text-center ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-secondary/80 text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="mt-3 text-sm font-semibold text-foreground">{title}</h4>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actionLabel && (onAction || actionHref) && (
        <div className="mt-4">
          {actionHref ? (
            <a href={actionHref}>
              <Button size="sm" variant="secondary">
                {actionLabel}
              </Button>
            </a>
          ) : (
            <Button size="sm" variant="secondary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
