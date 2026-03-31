const { execSync } = require('child_process');

try {
  console.log('Running npm install...');
  const out = execSync('npm install ngx-toastr @angular/animations --save', { encoding: 'utf-8' });
  console.log('Success:', out);
} catch (err) {
  console.error('Error installing:', err.message);
  if (err.stdout) console.error('stdout:', err.stdout);
  if (err.stderr) console.error('stderr:', err.stderr);
}
