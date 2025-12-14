import React from 'react';
import { NotFoundBookIcon } from './NotFoundBookIcon';

interface SearchNotFoundProps {
  title?: string;
  message?: string;
}

const SearchNotFound: React.FC<SearchNotFoundProps> = ({
  title = "Search Not Found!",
  message = "We couldn't find any results for your search. Please try different keywords."
}) => {
  return (
    <div className="bg-[#fdfaf6] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
      <NotFoundBookIcon />
      <h2 className="text-2xl font-bold text-gray-800 mt-4">{title}</h2>
      <p className="text-gray-500 mt-2 max-w-sm">
        {message}
      </p>
    </div>
  );
};

export default SearchNotFound;
