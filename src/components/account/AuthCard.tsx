import type { ReactNode } from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-px mx-auto flex max-w-md flex-col py-16">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mb-8 text-sm text-gray-500">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-6"}>{children}</div>
    </div>
  );
}
