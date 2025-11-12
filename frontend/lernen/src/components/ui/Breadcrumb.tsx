import React from 'react';

interface BreadcrumbPath {
    name: string;
    path: string;
}

interface BreadcrumbProps {
    paths: BreadcrumbPath[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
    return (
        <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center text-sm text-gray-500 ">
                {paths.map((path, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                        {index === paths.length - 1 ? (
                            <span className="font-normal text-gray-700">{path.name}</span>
                        ) : (
                            <a href={path.path} className="hover:text-gray-700">
                                {path.name}
                            </a> 
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
