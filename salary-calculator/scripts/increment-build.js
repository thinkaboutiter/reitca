const fs = require('fs');
const path = require('path');

const buildNumberPath = path.join(__dirname, '..', 'build-number.json');

try {
  const buildData = JSON.parse(fs.readFileSync(buildNumberPath, 'utf8'));
  const newBuildNumber = buildData.buildNumber + 1;
  
  buildData.buildNumber = newBuildNumber;
  
  fs.writeFileSync(buildNumberPath, JSON.stringify(buildData, null, 2));
  
  console.log(`Build number incremented to: ${newBuildNumber}`);
  process.env.REACT_APP_BUILD_NUMBER = newBuildNumber.toString();
  
} catch (error) {
  console.error('Error incrementing build number:', error);
  process.exit(1);
}