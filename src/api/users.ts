import axiosInstance, { endpoints } from "src/lib/axios";
import { CreateOrUpdateUserDto, UserResponse } from "src/types/user";

export async function getUsers(params?: string): Promise<UserResponse> {
    const URL = endpoints.users.list(params);
    const { data } = await axiosInstance.get<UserResponse>(URL);
    return data;
}

export async function createUser(bodyPayload: CreateOrUpdateUserDto) {
    const URL = endpoints.users.list('');
    const { data } = await axiosInstance.post(URL, bodyPayload);
    return data;
}

export async function updateUser(id: string, bodyPayload: CreateOrUpdateUserDto) {
    const URL = endpoints.users.byId(id);
    const { data } = await axiosInstance.patch(URL, bodyPayload);
    return data;
}