import axios from 'axios';
import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, 
  });
  try {

    const resp = await axios.get('https://github.com/login/oauth/access_token', {
      params: {
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        code: req.query.code,
      }
    });

    const data = resp.data.substring(
      resp.data.indexOf("=") + 1,
      resp.data.lastIndexOf("&scope")
    );
    res.json({ data, })
    return;
  } catch (error) {
    console.log('Error GitHub authentication');
    res.status(404).send(err);
    return;
  }
}