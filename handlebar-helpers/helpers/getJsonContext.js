import { render } from '../utils/compile';

function getJsonContext(jsonData, data, context) {
  const renderedJson = render(jsonData, context ? data : null);
  return JSON.parse(renderedJson);
}

export default getJsonContext;
