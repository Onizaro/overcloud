import { setDefaultSession } from 'react-session-api';

setDefaultSession({
  duration: 60 * 60 * 24,
  secure: true,
  sameSite: 'strict',
  persistent: true, 
});
