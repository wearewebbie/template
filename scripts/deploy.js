import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import dotenv from 'dotenv';
import FtpDeploy from 'ftp-deploy';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.argv[2] === 'prod' ? 'prod' : 'dev';
const distPath = path.join(__dirname, `dist-${env}`);
const FTP_HOST = env === 'prod' ? process.env.FTP_HOST_PROD : process.env.FTP_HOST_DEV;
const requiredEnv = ['FTP_USERNAME', 'FTP_PASSWORD', 'REMOTE_ROOT'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (!FTP_HOST) missingEnv.push(env === 'prod' ? 'FTP_HOST_PROD' : 'FTP_HOST_DEV');

if (missingEnv.length > 0) {
    console.error(`❌ Deployment failed: Missing required .env variables for ${env} deploy:`);
    missingEnv.forEach((key) => console.error(`   - ${key}`));
    process.exit(1);
}

async function confirmProd() {
    if (env !== 'prod') return true;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('⚠️ You are about to deploy to PROD. Are you sure? (yes/no): ', (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === 'yes');
        });
    });
}

function deploySite() {
    const ftpDeploy = new FtpDeploy();
    const config = {
        host: FTP_HOST,
        user: process.env.FTP_USERNAME,
        password: process.env.FTP_PASSWORD,
        port: 21,
        localRoot: distPath,
        remoteRoot: process.env.REMOTE_ROOT,
        deleteRemote: true,
        forcePasv: true,
        include: ['*', '**/*']
    };
    return ftpDeploy.deploy(config)
        .then(() => console.log(`🚀 ${env} site deployed successfully`))
        .catch(err => console.error(`❌ ${env} deploy failed:`, err));
}

(async () => {
    try {
        const confirmed = await confirmProd();
        if (!confirmed) {
            console.log('❌ Deployment cancelled.');
            process.exit(0);
        }
        await deploySite();
    } catch (err) {
        console.error('❌ Error during deploy:', err);
    }
})();