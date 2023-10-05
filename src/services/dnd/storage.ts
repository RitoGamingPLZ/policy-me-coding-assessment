export const ENDPOINT = `https://recruiting.verylongdomaintotestwith.ca/api/{RitoGamingPLZ}/character`;


export function updateData(payload: any) {
  return fetch(ENDPOINT,
    {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
}

export function getData() {
  return fetch(ENDPOINT,
    {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
}