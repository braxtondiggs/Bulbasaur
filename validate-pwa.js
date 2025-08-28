#!/usr/bin/env node

/**
 * PWA Validation Script
 * Validates the PWA configuration and files
 */

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');

console.log('🔍 Validating PWA Configuration...\n');

// Check required PWA files
const requiredFiles = ['index.html', 'manifest.webmanifest', 'ngsw-worker.js', 'ngsw.json', 'safety-worker.js'];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// Validate manifest.webmanifest
console.log('\n📋 Validating Web App Manifest:');
try {
  const manifestPath = path.join(distPath, 'manifest.webmanifest');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color', 'background_color', 'icons'];
  const bestPracticeFields = ['id', 'description', 'scope', 'lang', 'dir', 'categories', 'shortcuts'];

  requiredFields.forEach(field => {
    const exists = manifest[field] !== undefined;
    console.log(`${exists ? '✅' : '❌'} ${field}: ${exists ? '✓' : 'Missing'}`);
  });

  console.log('\n🌟 Best Practice Fields:');
  bestPracticeFields.forEach(field => {
    const exists = manifest[field] !== undefined;
    console.log(`${exists ? '✅' : '⚠️ '} ${field}: ${exists ? '✓' : 'Optional but recommended'}`);
  });

  // Check icons
  console.log('\n🖼️  Icon Validation:');
  if (manifest.icons && manifest.icons.length > 0) {
    console.log(`✅ Icons defined: ${manifest.icons.length} icons`);

    const hasRequiredSizes = ['192x192', '512x512'].every(size => manifest.icons.some(icon => icon.sizes === size));
    console.log(`${hasRequiredSizes ? '✅' : '⚠️ '} Required icon sizes (192x192, 512x512)`);

    const hasMaskableIcons = manifest.icons.some(icon => icon.purpose && icon.purpose.includes('maskable'));
    console.log(`${hasMaskableIcons ? '✅' : '⚠️ '} Maskable icons defined`);
  } else {
    console.log('❌ No icons defined');
  }
} catch (error) {
  console.log('❌ Error reading manifest:', error.message);
}

// Validate service worker configuration
console.log('\n⚙️  Service Worker Validation:');
try {
  const ngsaConfig = path.join(distPath, 'ngsw.json');
  const swConfig = JSON.parse(fs.readFileSync(ngsaConfig, 'utf8'));

  console.log(`✅ Asset groups: ${swConfig.assetGroups ? swConfig.assetGroups.length : 0}`);
  console.log(`✅ Navigation URLs configured: ${swConfig.navigationUrls ? 'Yes' : 'No'}`);

  if (swConfig.assetGroups) {
    swConfig.assetGroups.forEach(group => {
      console.log(`  - ${group.name}: ${group.installMode}/${group.updateMode}`);
    });
  }
} catch (error) {
  console.log('❌ Error reading service worker config:', error.message);
}

console.log('\n🎉 PWA Validation Complete!');
console.log('\n💡 Recommendations:');
console.log('1. Test PWA installation on mobile devices');
console.log('2. Validate with Lighthouse PWA audit');
console.log('3. Test offline functionality');
console.log('4. Verify service worker updates work correctly');
