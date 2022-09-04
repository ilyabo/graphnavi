import axios from "axios";

// Files we need data.csv, edges.sql, nodes.sql
const FILES = [
  'data.csv',
  'edges.sql',
  'nodes.sql'
];

async function readFilesContent(fileUrl: string) {
  const resp = await axios({
    url: fileUrl,
    method: 'GET',
    responseType: 'blob',
  })
  const content = await resp.data.text();
  return content
}

export async function importFiles(gist_id: string, file?: string) {
  try {
    const resp = await axios.get('https://api.github.com/gists/' + gist_id, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLIENT_TOKEN}`,
      }
    })

    for (const file of FILES) {
      if (!(file in resp.data.files)) {
        throw new Error((`Missing ${file}`))
      }
    }
    if (file) {
      return { 
        file, 
        content: await readFilesContent(resp.data.files[file].raw_url),
      }
    }
    const filesContent = await Promise.all(FILES.map(async file => {
      return { 
        file, 
        content: await readFilesContent(resp.data.files[file].raw_url),
      }
    }))
    return filesContent;
  } catch (error) {
    console.log(error);
    console.log('Invalid gist');
  }
}

export { };