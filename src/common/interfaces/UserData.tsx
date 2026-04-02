import { Status } from './ActionStatus';

export interface LoginResponse {
    companyname: string;
    firstname: string;
    isadmin: number;
    islocaladmin: number;
    ismanager: number;
    issalesperson: number;
    lastname: string;
    loginname: string;
    sessionuid: string;
    status: 'OK';
    token: string;
    username: string;
    useruid: string;
}

export interface UserInputData {
    username: string;
    password: string;
}

export interface User {
    created?: string;
    createdbyuid?: string;
    index?: number;
    parentuid?: string;
    parentusername?: string;
    updated?: string;
    username: string;
    useruid: string;
    isadmin?: number;
}

export interface UserSuccessResponse {
    user: User;
    status: Status;
}

export interface UserErrorResponse {
    error: string;
    info: string;
    loginexported: string;
    status: Status;
    useruid: string;
    warning: string;
}

export interface ShortUserInfo {
    firstName: string;
    lastName: string;
    loginname: string;
    middleName: string;
    status: 'OK' | 'Error';
    userName: string;
    useruid: string;
    warning: string;
}

export enum UsersType {
    ACTIVE = 'Dealers',
    DELETED = 'Deleted dealers',
}

export type UsersListType = UsersType;
