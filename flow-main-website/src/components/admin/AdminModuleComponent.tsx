import { useRouter } from "next/navigation";

const AdminModuleComponent = ({
  title,
  url,
  isDisabled,
}: {
  title: string;
  url: string;
  isDisabled?: boolean;
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(url)}
      className={`flow-border-color border-2 p-4 rounded-lg relative group ${
        isDisabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:shadow-lg transition-shadow"
      }`}
    >
      {!isDisabled && (
        <div className="absolute top-0 left-0 h-full w-0 group-hover:w-full flow-bg-color transition-all duration-300 -z-10 rounded-lg"></div>
      )}
      <h2
        className={`relative z-10 ${
          !isDisabled ? "group-hover:text-black" : ""
        } transition-all duration-300`}
      >
        {title} {isDisabled && "(Coming Soon)"}
      </h2>
    </div>
  );
};

export default AdminModuleComponent;
