/**
 * Script di migrazione automatica da ES5 a ES6+
 * Converte: var -> const/let, aggiunge export, converte object literals in classi
 */

const fs = require('fs');
const path = require('path');

const CONVERSIONS = [
    {
        // Converte var PALETTE, CANVAS_W, etc. in export const
        pattern: /^(var\s+)(PALETTE|CANVAS_W|CANVAS_H|PLAYER_SPEED|PLAYER_W|PLAYER_H|VERSION)\s*=/gm,
        replacement: 'export const $2 ='
    },
    {
        // Converte var gameState in export let
        pattern: /^(var\s+)(gameState)\s*=/gm,
        replacement: 'export let $2 ='
    },
    {
        // Converte funzioni globali in export function
        pattern: /^(function\s+)(\w+\s*\()/gm,
        replacement: 'export function $2'
    },
    {
        // Rimuove "use strict" (non necessario in ES6 modules)
        pattern: /^"use strict";\s*\n/m,
        replacement: ''
    },
    {
        // Converte var -> const per oggetti/array non riassegnati
        pattern: /^(var\s+)(\w+\s*=\s*(\{|\[|Object\.freeze))/gm,
        replacement: 'const $2'
    }
];

function convertFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    CONVERSIONS.forEach(({ pattern, replacement }) => {
        const newContent = content.replace(pattern, replacement);
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }
    });

    // Aggiungi export default se è un index/module principale
    if (filePath.includes('index.js') && !content.includes('export default')) {
        const match = content.match(/(var|const|let)\s+(\w+)\s*=\s*\{/);
        if (match) {
            content += `\n\nexport default ${match[2]};\n`;
            modified = true;
        }
    }

    if (modified) {
        const newPath = filePath.replace('.js', '.mjs');
        fs.writeFileSync(newPath, content, 'utf8');
        console.log(`✓ Converted: ${filePath} -> ${newPath}`);
        return true;
    }

    return false;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    let count = 0;

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            count += processDirectory(fullPath);
        } else if (file.endsWith('.js') && !file.endsWith('.mjs')) {
            if (convertFile(fullPath)) {
                count++;
            }
        }
    });

    return count;
}

// Esegui conversione
const targetDir = process.argv[2] || './src';
console.log(`Starting ES6+ conversion in: ${targetDir}\n`);
const converted = processDirectory(targetDir);
console.log(`\n✅ Conversion complete: ${converted} files converted`);
