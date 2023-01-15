import { isDevelomentEnv } from '../utils/utils';

export default (link, context) => {
  let formattedLink = link || '';
  
  if (isDevelomentEnv(context) && link && !link.startsWith('#') &&
    !link.startsWith('http://') && !link.startsWith('https://')) {
    formattedLink = `${formattedLink}.html`;
  }

  return formattedLink;
};
