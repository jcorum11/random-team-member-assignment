export default function FilterButton({
  role,
  clickFilter,
  activeRole,
}: {
  role: string;
  clickFilter: (role: string) => void;
  activeRole: string;
}) {
  return (
    <button
      key={role}
      className={
        "outline outline-purple-500 bg-purple-400 mx-5 px-4 rounded-full hover:bg-purple-500 hover:outline-purple-500" +
        (role === activeRole ? " outline-blue-500 bg-blue-400" : "")
      }
      onClick={() => clickFilter(role)}
    >
      {role}
    </button>
  );
}
