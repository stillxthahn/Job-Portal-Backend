import { CV } from "../interface/interface";
import { del, get, patch, post } from "../utilities/request";

export const getCVByIdCompany = async (id: number | undefined) => {
  const result = await get(`cv?idCompany=${id}`)
  return result
}

export const getCV = async (id: number | string) => {
  const result = await get(`cv/${id}`)
  return result
}
export const createCV = async (values: CV) => {
  const result = await post(`cv`, values);
  return result;
};

export const deleteCV = async (id: number) => {
  const result = await del(`cv/${id}`)
  return result
}

export const changeCVStatus = async (id: number | string, option: object) => {
  const result = await patch(`cv/${id}`, option)
  return result
}