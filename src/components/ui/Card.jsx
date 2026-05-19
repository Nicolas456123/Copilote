export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-surface rounded-3xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
