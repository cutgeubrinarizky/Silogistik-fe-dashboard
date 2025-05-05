#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Dapatkan __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk mengubah file .tsx menjadi .jsx
function convertTsxToJsx(filePath) {
  // Baca konten file
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Nama file baru dengan ekstensi .jsx
  const newFilePath = filePath.replace('.tsx', '.jsx');
  
  // Transformasi konten - hapus tipe data TypeScript
  let newContent = content
    // Hapus deklarasi tipe interface dan type
    .replace(/^(export\s+)?(interface|type)\s+\w+(\s*<.*>)?(\s+extends\s+\w+(\s*<.*>)?)?\s*{[\s\S]*?}(\s*;)?$/gm, '')
    // Hapus parameter tipe generic
    .replace(/<[^<>]*>/g, '')
    // Hapus tipe parameter dan return function
    .replace(/:\s*([A-Za-z0-9_$]+(\[\])?)(\s*\|\s*([A-Za-z0-9_$]+(\[\])?))*(?=\s*[,)])/g, '')
    // Hapus anotasi tipe variabel
    .replace(/:\s*([A-Za-z0-9_$]+(\[\])?)(\s*\|\s*([A-Za-z0-9_$]+(\[\])?))*(?=\s*[=;])/g, '')
    // Hapus non-null assertion operator (!)
    .replace(/!(?=\s*[.)\]}])/g, '')
    // Ubah import dari .tsx menjadi .jsx
    .replace(/from\s+['"](.*)\.tsx['"]/g, 'from "$1.jsx"');
  
  // Tulis ke file baru dengan ekstensi .jsx
  fs.writeFileSync(newFilePath, newContent, 'utf8');
  console.log(`Converted: ${filePath} -> ${newFilePath}`);
  
  // Hapus file TSX original
  // fs.unlinkSync(filePath);
  // console.log(`Deleted original: ${filePath}`);
}

// Fungsi rekursif untuk menemukan semua file TSX
function findTsxFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath); // Rekursi untuk direktori
    } else if (path.extname(file) === '.tsx') {
      convertTsxToJsx(filePath);
    }
  });
}

// Direktori utama proyek
const rootDir = path.resolve('./src');

// Mulai konversi
console.log('Starting conversion of TSX files to JSX...');
findTsxFiles(rootDir);
console.log('Conversion completed!');

// Perbaharui import statements di semua file jsx yang baru
console.log('Updating import statements in JSX files...');
execSync('find src -name "*.jsx" -exec sed -i "" "s/\\.tsx/\\.jsx/g" {} \\;', { stdio: 'inherit' });
console.log('Import statements updated!');

console.log('Don\'t forget to delete the TypeScript configuration files if they are no longer needed.');
console.log('Run "npm uninstall typescript @types/react @types/react-dom @types/node typescript-eslint" to remove TypeScript dependencies.'); 