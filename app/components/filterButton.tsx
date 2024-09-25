export default function FilterButton({
  role,
  clickFilter,
}: {
  role: string;
  clickFilter: (role: string) => void;
}) {
  return (
    <button
      key={role}
      className="outline outline-purple-500 bg-purple-400 mx-5 px-4"
      onClick={() => clickFilter(role)}
    >
      {role}
    </button>
  );
}
