const { readdirSync } = require('fs');
const { join } = require('path');
const { spawnSync } = require('child_process');

const roots = ['src', 'scripts', 'migrations'];

function listJavaScriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return listJavaScriptFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : [];
  });
}

const files = roots.flatMap(listJavaScriptFiles);
let hasError = false;

files.forEach((file) => {
  const result = spawnSync(process.execPath, ['--check', file], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    hasError = true;
    process.stderr.write(result.stderr);
  }
});

if (hasError) {
  process.exit(1);
}

console.log(`Syntax OK: ${files.length} JavaScript files checked`);
