import axiosInstance, { endpoints } from "src/lib/axios";
import { UserResponse } from "src/types/user";

export async function getUsers(params?: string): Promise<UserResponse> {
    const URL = endpoints.users.list(params);
    const { data } = await axiosInstance.get<UserResponse>(URL);
    return data;
}