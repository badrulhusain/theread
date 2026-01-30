const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const localEnvPath = path.join(__dirname, '..', '.env.local');

function checkFile(filePath) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/DATABASE_URL=(.*)/);
        if (match) {
            const url = match[1].trim();
            const protocol = url.split(':')[0];
            console.log(`File: ${path.basename(filePath)}`);
            console.log(`Protocol: ${protocol}`);
            if (protocol === 'prisma') {
                console.log("WARNING: Using 'prisma' protocol without accelerate extension!");
            }
        } else {
             console.log(`File: ${path.basename(filePath)} - DATABASE_URL not found.`);
        }
    } else {
        console.log(`File: ${path.basename(filePath)} does not exist.`);
    }
}

checkFile(envPath);
checkFile(localEnvPath);
