import { Job } from "../interface/interface"
import { del, get, patch, post } from "../utilities/request"

export const getJob = async (id?: number | undefined) => {
    const query = id ? `jobs/${id}` : "jobs"
    const response = await get(query)
    return response
}

export const createJob = async (values: Job) => {
    const result = await post("jobs", values)
    return result
}

export const updateJob = async (id: string | number, options: Job) => {
    const result = await patch(`jobs/${id}`, options)
    return result
}

export const deleteJob = async (id: number | undefined) => {
    const result = await del(`jobs/${id}`)
    return result
}

export const getJobsByCompanyId = async (id: number | undefined) => {
    const response = await get(`jobs?idCompany=${id}`)
    return response
}

export const getJobList = async (start?: number | string, end?: number | string) => {
    const query = start && end ? `jobs?_start=${start}&_end=${end}` : "jobs"
    const response = await get(query)
    return response
}