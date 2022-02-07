import axios, { AxiosRequestConfig } from 'axios'

const { SERVICE_URL } = process.env

export const createInstance = () => {
  const config: AxiosRequestConfig = {
    baseURL: SERVICE_URL,
    headers: {
      Accept: 'application/json'
    }
  }

  return axios.create(config)
}
