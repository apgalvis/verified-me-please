import { ArrowLeft } from "lucide-react";

const AccountHeader = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-b-3xl bg-gradient-to-br from-[hsl(var(--header-gradient-from))] to-[hsl(var(--header-gradient-to))] px-6 pb-20 pt-8 text-white">
      <button className="mb-6 flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Regresar
      </button>
      <h1 className="text-2xl font-bold tracking-tight">Mi cuenta</h1>
      <p className="mt-1 text-sm text-white/70">
        Gestiona tu información personal y de contacto
      </p>
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="absolute -right-5 top-16 h-24 w-24 rounded-full bg-white/5" />
    </div>
  );
};

export default AccountHeader;
