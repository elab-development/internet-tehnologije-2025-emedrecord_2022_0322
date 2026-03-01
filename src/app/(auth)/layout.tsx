import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="w-full md:w-1/2 h-full flex items-center justify-center px-6 py-8 bg-gradient-to-br from-background via-secondary/35 to-background">
        {children}
      </div>
      <div className="hidden md:flex w-1/2 h-full relative">
        <Image
            src="https://images.pexels.com/photos/6129437/pexels-photo-6129437.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            fill
            alt="Doctors"
            className="w-full h-full object-cover scale-105"
        />
        <div className="absolute top-0 w-full h-full bg-gradient-to-br from-[#0f172a]/80 via-[#1d4ed8]/55 to-[#38bdf8]/40 z-10 flex items-center justify-center px-10">
          <div className="w-full max-w-lg rounded-3xl border border-white/25 bg-white/10 backdrop-blur-md p-8 text-white space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Secure Healthcare Platform</p>
            <h1 className="text-4xl 2xl:text-5xl font-bold leading-tight">
              eMedRecord App
            </h1>
            <p className="text-sm 2xl:text-base text-blue-50/90">
              Modern clinical operations for records, appointments, billing and coordinated care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

