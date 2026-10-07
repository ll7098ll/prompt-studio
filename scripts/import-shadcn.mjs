// Import the official Radix registry once; retain source and attribution locally.
import fs from 'node:fs/promises';
import path from 'node:path';
const destination = path.resolve('src/builder/vendor/shadcn');
await fs.mkdir(destination, { recursive: true });
if (await fs.stat(path.join(destination, 'sources.json')).catch(() => null)) throw Error('Vendored sources already exist. Review local iframe and React adaptations before replacing them.');
const names = ['button','input','card','tabs','dialog','select','popover','command','sheet','sidebar','table','calendar','label','separator','tooltip','skeleton','checkbox','dropdown-menu','context-menu','menubar','navigation-menu','hover-card','alert-dialog','input-otp','carousel','resizable','scroll-area','toggle','toggle-group','drawer'];
const sources = [];
for (const name of names) {
  const url = `https://ui.shadcn.com/r/styles/new-york-v4/${name}.json`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw Error(`${name}: ${response.status}`);
  const item = await response.json();
  for (const file of item.files ?? []) {
    if (!file.path.endsWith('.tsx') || !file.content) continue;
    const filename = path.basename(file.path);
    let content = file.content.replace(/from "cn"/g, 'from "./utils"').replace(/from "@\/(?:registry\/new-york-v4|components)\/ui\/([^\"]+)"/g, 'from "./$1"').replace(/from "@\/lib\/utils"/g, 'from "./utils"').replace(/from "@\/(?:registry\/new-york-v4\/)?hooks\/use-mobile"/g, 'from "./use-mobile"');
    await fs.writeFile(path.join(destination, filename), content);
  }
  sources.push({ name, url, fetchedAt: '2026-10-06', files: item.files.map(f => f.path) });
  console.log(`Imported ${name}`);
}
await fs.writeFile(path.join(destination, 'sources.json'), JSON.stringify(sources, null, 2));
const license = await fetch('https://raw.githubusercontent.com/shadcn-ui/ui/main/LICENSE.md');
if (!license.ok) throw Error('Missing upstream license');
await fs.writeFile(path.join(destination, 'LICENSE.md'), await license.text());
