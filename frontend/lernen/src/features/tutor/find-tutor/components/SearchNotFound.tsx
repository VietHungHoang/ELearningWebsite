import React from 'react';
import { useTranslation } from 'react-i18next';
import { NotFoundBookIcon } from './NotFoundBookIcon';

interface SearchNotFoundProps {
  title?: string;
  message?: string;
}

const SearchNotFound: React.FC<SearchNotFoundProps> = ({
  title,
  message
}) => {
  const { t } = useTranslation();
  const defaultTitle = title || t('findTutors.searchNotFound.title');
  const defaultMessage = message || t('findTutors.searchNotFound.message');
  return (
    <div className="bg-[#fdfaf6] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
      <NotFoundBookIcon />
      <h2 className="text-2xl font-bold text-gray-800 mt-4">{defaultTitle}</h2>
      <p className="text-gray-500 mt-2 max-w-sm">
        {defaultMessage}
      </p>
    </div>
  );
};

export default SearchNotFound;
