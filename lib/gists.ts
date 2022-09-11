import axios from "axios";

// Files we need data.csv, edges.sql, nodes.sql
const FILES = ["data.csv", "edges.sql", "nodes.sql"];

export async function fetchGithubToken() {
  const code = (
    await axios({
      url: `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID}`,
      method: "GET",
    })
  ).data.text();
  console.log(code);

  const res: Response = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      // headers: new Headers({ "Content-Type": "application/json" }),
      // credentials: "same-origin",
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        code,
      }),
    }
  );
  if (!res.ok) {
    console.error("Error in postData");
    let message = res.statusText;
    try {
      message = (await res.json()).error.message;
      console.error(message);
    } finally {
      throw new Error(message);
    }
  }

  return res.json();

  //
  // const resp = fetch("https://github.com/login/oauth/access_token", {
  //   params: {
  //     client_id: process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID,
  //     client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  //     code,
  //   },
  // });
  // const content = await resp.data.json();
  // return resp;
}

async function readFilesContent(fileUrl: string) {
  const resp = await axios({
    url: fileUrl,
    method: "GET",
    responseType: "blob",
  });
  const content = await resp.data.text();
  return content;
}

export async function fetchFileFromGist(
  gistId: string,
  fileNames?: string | string[]
): Promise<{ file: string; content: any }[]> {
  try {
    const resp = await axios.get(
      "https://api.github.com/gists/" + gistId
      //   {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );

    let filesToFetch = FILES;
    if (typeof fileNames === "string") {
      filesToFetch = [fileNames];
      // return {
      //   file,
      //   content: await readFilesContent(resp.data.files[file].raw_url),
      // }
    } else if (Array.isArray(fileNames)) {
      filesToFetch = fileNames;
    }

    for (const file of filesToFetch) {
      if (!(file in resp.data.files)) {
        throw new Error(`Missing ${file}`);
      }
    }
    const filesContent = await Promise.all(
      filesToFetch.map(async (file) => {
        return {
          file,
          content: await readFilesContent(resp.data.files[file].raw_url),
        };
      })
    );
    return filesContent;
  } catch (error) {
    console.log(error);
    console.log("Invalid gist");
    return [
      {
        file: "error",
        content: "",
      },
    ];
  }
}

export async function saveToGithub(token: string, name?: string) {
  try {
    console.log("saving");
    console.log(token);
    const resp = await axios.post("https://api.github.com/gists", {
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Accept': 'application/vnd.github+json',
      },
      data: {
        public: true,
        files: {
          "name.txt": {
            content: "asd",
          },
        },
      },
    });
    console.log(resp);
  } catch (error) {
    console.log(error);
  }
}
