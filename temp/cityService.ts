import { get } from "../utilities/request"

export const getListCity = async () => {
    const response = await get('city')
    return response
}