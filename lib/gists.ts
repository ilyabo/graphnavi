import axios from "axios";

// Files we need data.csv, edges.sql, nodes.sql
const FILES = ["data.csv", "edges.sql", "nodes.sql"];

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
