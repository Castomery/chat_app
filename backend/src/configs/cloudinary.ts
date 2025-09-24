import {v2 as cloudinary} from 'cloudinary';
import { ENV } from './env.ts';

if(!ENV.CLOUDINARY_CLOUD_API || !ENV.CLOUDINARY_CLOUD_NAME || !ENV.CLOUDINARY_CLOUD_SECRET){
    throw new Error("Cloudinary environment variables missing");
}

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_CLOUD_API,
    api_secret: ENV.CLOUDINARY_CLOUD_SECRET,
});

export default cloudinary;

