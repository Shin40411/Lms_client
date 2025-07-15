import axiosInstance, { endpoints } from "src/lib/axios";
import { ClassListResponse } from "src/types/classes";

export async function getClasses(): Promise<ClassListResponse> {
    const URL = endpoints.classes.list;
    const { data } = await axiosInstance.get<ClassListResponse>(URL);
    return data;
}