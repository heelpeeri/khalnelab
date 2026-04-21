export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass p-6 ${className}`}>
      {children}
    </div>
  );
}
