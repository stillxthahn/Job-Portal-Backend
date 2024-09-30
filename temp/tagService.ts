import { get } from "../utilities/request";

export const getListTag = async(suggested? : boolean) => {
    const query = suggested ? `tags/?_start=1&_end=10` : "tags"
    const result = await get(query)
    return result;
}