interface CustomIconProps {
    color: string;
  }
  
  export default function CustomIcon({ color }: CustomIconProps) {
    return (
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Outer Circle */}
        <div className="w-4 h-4 border-2 border-gray-500 rounded-full"></div>
        {/* Inner Circle with dynamic color */}
        <div className={`w-2 h-2 rounded-full absolute ${color}`}></div>
      </div>
    );
  }
  