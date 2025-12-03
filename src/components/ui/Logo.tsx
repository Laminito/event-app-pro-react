import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  return (
    <svg
      viewBox="0 0 200 200"
      className={`${sizes[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Centre du logo */}
      <circle cx="100" cy="100" r="20" fill="none" stroke="#a855f7" strokeWidth="4" />
      <circle cx="100" cy="100" r="35" fill="none" stroke="#a855f7" strokeWidth="3" />
      
      {/* Rayons extérieurs */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
        const radian = (angle * Math.PI) / 180;
        const x1 = 100 + Math.cos(radian) * 35;
        const y1 = 100 + Math.sin(radian) * 35;
        const x2 = 100 + Math.cos(radian) * 60;
        const y2 = 100 + Math.sin(radian) * 60;
        const cx = 100 + Math.cos(radian) * 65;
        const cy = 100 + Math.sin(radian) * 65;
        
        return (
          <g key={angle}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a855f7" strokeWidth="3" />
            <circle cx={cx} cy={cy} r="5" fill="#a855f7" />
          </g>
        );
      })}
    </svg>
  );
};

export default Logo;
