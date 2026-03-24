import React from "react";

interface ArrowWithLabelProps {
  label: React.ReactNode;
  width?: number;
  className?: string;
}

export function LabelledArrow({
  label,
  width = 32,
  className = "",
}: ArrowWithLabelProps) {
  return (
    <div
      className={`relative flex items-center ml-2 mr-2 w-${width} h-10 ${className}`}
    >
      <div className="w-full h-0.5 bg-slate-600 rounded-full" />

      <div className="absolute right-0 w-2 h-2 border-t-2 border-r-2 border-slate-600 rotate-45 transform -translate-y-[0.5px]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`px-2 text-[12px] bg-transparent font-bold uppercase tracking-widest text-cyan-400 transform -translate-y-2`}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
