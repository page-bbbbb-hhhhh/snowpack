const babel = require('@babel/core');

module.exports = function plugin() {
  return {
    name: '@snowpack/plugin-babel',
    async transform({contents, fileExt, filePath}) {
      if (!filePath || fileExt !== '.js') return;

      const result = await babel.transformAsync(contents, {
        filename: filePath,
        cwd: process.cwd(),
        ast: false,
        compact: false,
      });
      let code = result.code;
      if (code) {
        // Some Babel plugins assume process.env exists, but Snowpack
        // uses import.meta.env instead. Handle this here since it
        // seems to be pretty common.
        // See: https://www.pika.dev/npm/snowpack/discuss/496
        code = code.replace(/process\.env/g, 'import.meta.env');
      }
      return code;
    },
  };
};
