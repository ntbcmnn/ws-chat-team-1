import { createAsyncThunk } from '@reduxjs/toolkit';
import { GlobalError, IUser, LoginMutation, RegisterMutation, RegisterResponse, ValidationError } from '../../types';
import axiosApi from '../../axiosApi.ts';
import { isAxiosError } from 'axios';
import { RootState } from '../../app/store.ts';

export const googleLogin = createAsyncThunk<
  IUser,
  string,
  { rejectValue: GlobalError }
>(
  'users/googleLogin',
  async (credential, {rejectWithValue}) => {
    try {
      const response = await axiosApi.post<RegisterResponse>('/users/google', {credential});
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  }
);

export const register = createAsyncThunk<
  RegisterResponse,
  RegisterMutation,
  { rejectValue: ValidationError }
>(
  'users/register',
  async (registerMutation: RegisterMutation, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(registerMutation) as (keyof RegisterMutation)[];

      keys.forEach((key) => {
        const value: File | null | string = registerMutation[key];
        if (value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axiosApi.post<RegisterResponse>('/users/register', formData);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const login = createAsyncThunk<
  IUser,
  LoginMutation,
  { rejectValue: GlobalError }
>(
  'users/login',
  async (loginMutation, {rejectWithValue}) => {
    try {
      const response = await axiosApi.post<RegisterResponse>('/users/sessions', loginMutation);
      return response.data.user;
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data as GlobalError);
      }
      throw error;
    }
  }
);

export const logout = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'users/logout',
  async (_, {getState}) => {
    const token = getState().users.user?.token;
    await axiosApi.delete('/users/sessions', {headers: {'Authorization': token}});
  }
);