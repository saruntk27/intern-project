import axios from 'axios'

const authAxios = (token) => {
    return axios.create({
        baseURL: process.env.REACT_APP_URL,
        headers: {
            "x-auth-token" : token
        }
    })
}

export const authAxiosTest = (token) => {
    return axios.create({
        baseURL: "http://localhost:5000",
        headers: {
            "x-auth-token" : token
        }
    })
}

export default authAxios
