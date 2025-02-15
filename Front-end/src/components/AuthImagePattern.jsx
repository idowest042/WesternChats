import React from 'react';

const AuthImagePattern = ({ title, subtitle }) => {
  // Reusable styles for the grid items
  const gridItemStyle = `
    aspect-square rounded-2xl 
    bg-gradient-to-br from-primary/10 to-secondary/10 
    shadow-sm hover:shadow-md 
    transition-all duration-300 ease-in-out
    hover:scale-105 hover:rotate-2
  `;

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center space-y-8">
        {/* Grid with dynamic animation */}
        <div className="grid grid-cols-3 gap-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`${gridItemStyle} ${
                i % 2 === 0 
                  ? 'animate-pulse hover:animate-none' 
                  : 'animate-bounce delay-100 hover:animate-none'
              }`}
            />
          ))}
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {title}
          </h2>
          <p className="text-base-content/80 text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;