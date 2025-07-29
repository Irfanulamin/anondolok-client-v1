import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
