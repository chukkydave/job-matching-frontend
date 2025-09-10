export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    skills: string[];
    location: string;
    isEmailVerified: boolean;
}

export interface Job {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    location: string;
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
};