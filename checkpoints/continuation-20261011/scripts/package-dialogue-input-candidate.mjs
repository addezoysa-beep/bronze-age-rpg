import fs from 'node:fs';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const dir=fileURLToPath(new URL('../dist/',import.meta.url)),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),manifest=JSON.parse(fs.readFileSync(dir+'dialogue-input-279-manifest.json')),zip='Wine-Dark-Sea-Dialogue-Input-279.zip';
if(hash(fs.readFileSync(dir+manifest.file))!==manifest.sha256)throw Error('Package candidate mismatch');
const pack=spawnSync('zip',['-X','-q',zip,manifest.file,'dialogue-input-279-manifest.json'],{cwd:dir});if(pack.status!==0)throw Error(String(pack.stderr));
const list=spawnSync('unzip',['-Z1',zip],{cwd:dir,encoding:'utf8'}),names=list.stdout.trim().split('\n');if(list.status!==0||names.length!==2||names[0]!==manifest.file||names[1]!=='dialogue-input-279-manifest.json')throw Error('Archive entries differ');
const unpack=spawnSync('unzip',['-p',zip,manifest.file],{cwd:dir,maxBuffer:50*1024*1024});if(unpack.status!==0||hash(unpack.stdout)!==manifest.sha256)throw Error('Extracted game mismatch');
const bytes=fs.readFileSync(dir+zip),record={file:'dist/'+zip,sha256:hash(bytes),bytes:bytes.length,entries:names,buildSha256:manifest.sha256,extractedIdentity:'passed',scope:'Exact two-entry archive; startup/browser decoding/user accessibility not tested'};fs.writeFileSync(new URL('../verification/input279-package.json',import.meta.url),JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify(record));


