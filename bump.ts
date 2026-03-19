const version = process.argv[2];
if (!version) {
  console.error("Please provide a version (e.g. bun run bump.ts 1.0.1)");
  process.exit(1);
}

// Update package.json
const pkg = await Bun.file("package.json").json();
pkg.version = version;
await Bun.write("package.json", JSON.stringify(pkg, null, 2));

// Update tauri.conf.json
const tauri = await Bun.file("src-tauri/tauri.conf.json").json();
tauri.version = version;
await Bun.write("src-tauri/tauri.conf.json", JSON.stringify(tauri, null, 2));

console.log(`Version bumped to ${version} in all files!`);

export {};
