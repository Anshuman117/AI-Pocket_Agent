const fs = require('fs');
const path = require('path');

const specPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@clerk',
  'expo',
  'src',
  'specs',
  'NativeClerkModule.ts'
);

const oldLine = "export default TurboModuleRegistry?.get<Spec>('ClerkExpo') ?? null;";
const newLine = "export default TurboModuleRegistry.get<Spec>('ClerkExpo');";

if (!fs.existsSync(specPath)) {
  console.log('[postinstall] Clerk codegen patch skipped: spec file not found.');
  process.exit(0);
}

const source = fs.readFileSync(specPath, 'utf8');

if (source.includes(newLine)) {
  console.log('[postinstall] Clerk codegen patch already applied.');
  process.exit(0);
}

if (!source.includes(oldLine)) {
  console.warn('[postinstall] Clerk codegen patch skipped: expected source line not found.');
  process.exit(0);
}

fs.writeFileSync(specPath, source.replace(oldLine, newLine));
console.log('[postinstall] Applied Clerk codegen compatibility patch for React Native 0.81.');
