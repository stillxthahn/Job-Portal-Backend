// LOCAL DATABASE
// const API_DOMAIN = "http://localhost:3002/";

// ONLINE DATABASE
const API_DOMAIN = "https://dummy-database-job-portal.vercel.app/";

export const get = async (path: string) => {
    const respone = fetch(API_DOMAIN + path);
    const result = (await respone).json();
    return result;
};

export const post = async (path: string, option: object) => {
    const response = fetch(API_DOMAIN + path, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(option),
    })
    const result = (await response).json();
    return result;
}

export const del = async (path: string) => {
    const respone = await fetch(API_DOMAIN + path, {
        method: "DELETE",
    });
    const result = await respone.json();
    return result;
}

export const patch = async (path: string, options = {}) => {
 const response = await fetch(API_DOMAIN + path, {
  method: "PATCH",
  headers: {
   Accept: "application/json",
   "Content-Type": "application/json",
  },
  body: JSON.stringify(options),
 });
 const result = await response.json();
 return result;
};





