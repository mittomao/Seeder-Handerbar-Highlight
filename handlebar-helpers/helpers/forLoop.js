import utils from 'handlebars-utils';

function forLoop(fromIndex, toIndex, options) {
  var data = utils.createFrame(options, options.hash);
  var buffer = '';

  for (let i = fromIndex; i <= toIndex; i++) {
    data.index = i;
    buffer += options.fn({ index: i }, { data });
  }
  return buffer;
}

export default forLoop;
