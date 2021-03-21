import fetch from "node-fetch";

export default (urls: string[]): Promise<string[]> => {
    const requests = urls.map((url) => fetch(url).then((res) => res.text()));
    return Promise.all(requests);
};
