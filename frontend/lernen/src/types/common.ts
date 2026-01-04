export interface Country {
    code: string;
    name: string;
    flag: string;
}

export interface Language {
    code: string;
    name: string;
}

export interface Category {
    id: string;
    name?: string; // For backward compatibility
    nameVi: string;
    nameEn: string;
}

export interface Subject {
    id: string;
    name?: string; // For backward compatibility
    nameVi: string;
    nameEn: string;
    categoryId: string;
}

export interface Timezone {
    code: string;
    name: string;
    offset: string;
}
