import React from 'react';

interface ViewMoreProps {
  onClick?: () => void;
  text?: string;
}

const ViewMore: React.FC<ViewMoreProps> = ({ 
  onClick,
  text = "VIEW MORE" 
}) => {
  return (
    <div className="w-full flex justify-center mt-10">
      <button
        onClick={onClick}
        className="px-6 py-2 uppercase text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
      >
        {text}
      </button>
    </div>
  );
};

export default ViewMore;
