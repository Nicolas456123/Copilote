export default function Spinner({ size = 20 }) {
  return (
    <div
      className="rounded-full border-3 border-gray-200 border-t-coral animate-spin mx-auto"
      style={{ width: size, height: size }}
    />
  );
}
