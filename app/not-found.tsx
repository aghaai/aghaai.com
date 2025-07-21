import Image from "next/image";

export default function Custom404() {
  return (
    <div className="flex items-center justify-center lg:-my-[9rem]">
      <Image
        width={1000}
        height={1000}
        src="/4004.gif"
        alt="Page Not Found"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}
