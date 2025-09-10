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
}

export interface Matching {
    _id: string;
    jobId: Job;
    userId: {
        _id: string;
        name: string;
        email: string;
        skills: string[];
        location: string;
    };
    matchedBy: {
        _id: string;
        name: string;
        email: string;
    };
    status: 'Active' | 'Inactive';
    createdAt: string;
    updatedAt: string;
}