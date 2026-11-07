interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 text-3xl font-bold text-white shadow-md">
        A
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-black">{title}</h1>
      <p className="mt-1.5 text-[15px] text-gray-500">{subtitle}</p>
    </div>
  );
}