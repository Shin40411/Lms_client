export interface ClassListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ClassItem[];
}

export interface ClassItem {
    id: string;
    name: string;
    description: string;
    grade: string;
    homeroomTeacher: HomeroomTeacher;
}

export interface HomeroomTeacher {
    id: string;
    degree: 'BACHELOR' | 'MASTER' | 'DOCTOR' | string;
    user: TeacherUser;
}

export interface TeacherUser {
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    dob: string;
    avatar: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | string;
    code: string;
    email: string;
    phone: string;
}
