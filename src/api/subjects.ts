import axiosInstance, { endpoints } from "src/lib/axios";
import { SubjectResponse } from "src/types/subject";

export async function getSubjects(params?: string): Promise<SubjectResponse> {
    const URL = endpoints.subjects.list(params);
    const { data } = await axiosInstance.get<SubjectResponse>(URL);
    return data;
}