const routes = {
  get: async function (url) {
    const res = await fetch(url);
    if (!res.ok) {
      const { url, status, statusText } = res;
      throw Error(`${status} ${statusText} ${url}`);
    }
    const data = await res.json();
    return data;
  },
  post: async function (url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const { url, status, statusText } = res;
      throw Error(`${status} ${statusText} ${url}`);
    }
    const data = await res.json();

    return data;
  },
  put: async function (url, body) {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const { url, status, statusText } = res;
      throw Error(`${status} ${statusText} ${url}`);
    }
    const data = await res.json();

    return data;
  },
  delete: async function (url) {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!res.ok) {
      const { url, status, statusText } = res;
      throw Error(`${status} ${statusText} ${url}`);
    }
    const data = await res.json();

    return data;
  },
};

export default routes;
