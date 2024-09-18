import { TbLoader3 } from "react-icons/tb";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <TbLoader3 className="animate-spin size-20 text-primary-font" />
    </div>
  );
}
