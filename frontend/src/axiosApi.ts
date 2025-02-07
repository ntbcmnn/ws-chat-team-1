import axios from 'axios';
import { api_URL } from './globalConstants.ts';

const axiosApi = axios.create({
  baseURL: api_URL,
});

export default axiosApi;
