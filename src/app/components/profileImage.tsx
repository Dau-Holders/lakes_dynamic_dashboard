import Image from "next/image";

export default function ProfileImage() {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden">
      <Image
        src="/default-profile.png"
        alt="Profile"
        width={32}
        height={32}
        className="object-cover"
      />
    </div>
  );
}
