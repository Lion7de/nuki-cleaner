import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const NUKI_WEB_TOKEN = process.env.NUKI_WEB_TOKEN;
const SMARTLOCK_ID = process.env.SMARTLOCK_ID;

const nukiApi = axios.create({
  baseURL: 'https://api.nuki.io',
  headers: {
    Authorization: `Bearer ${NUKI_WEB_TOKEN}`,
  },
});

nukiApi.get(`/smartlock/${SMARTLOCK_ID}/auth`).then(async (response) => {
  const expiredAuthorizations = response.data
    .filter((authorization) => authorization.name.startsWith('anny'))
    .filter((authorization) => new Date(authorization.allowedUntilDate) < new Date());

  console.log('Length:', expiredAuthorizations.length);

  for (const authorization of expiredAuthorizations) {
    console.log(`Deleting authorization ${authorization.name} for ${authorization.allowedUntilDate}`);
    await nukiApi.delete(`/smartlock/${SMARTLOCK_ID}/auth/${authorization.id}`);
  }
});
