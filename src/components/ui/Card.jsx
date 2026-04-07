export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
