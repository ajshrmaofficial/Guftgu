import RNFS from 'react-native-fs';
import storageClient from ".";
import useUserStore from "../store/userStore";
import base64 from 'react-native-base64';
import { updateFriendProfilePicInDB } from '../dbModel/db';

interface FileType {
    name: string;
    type: string;
    uri: string;  // local file path
}

interface FileUploadOptions {
    fileData: FileType | FileType[];
    isProfilePicture?: boolean;
}

const allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

const isImage = (type: string): boolean => {
    return type.startsWith('image/');
};

const getDownloadPath = (fileName: string, fileType: string): string => {
    const baseDir = RNFS.DocumentDirectoryPath;
    const isImageFile = isImage(fileType);
    
    // Create directories if they don't exist
    const guftguDir = `${baseDir}/guftgu`;
    const guftguImagesDir = `${guftguDir}/images`;
    const guftguDocsDir = `${guftguDir}/documents`;
    
    RNFS.mkdir(guftguDir);
    RNFS.mkdir(guftguImagesDir);
    RNFS.mkdir(guftguDocsDir);
    
    return isImageFile 
        ? `${guftguImagesDir}/${fileName}`
        : `${guftguDocsDir}/${fileName}`;
};

const base64ToArrayBuffer = (base64Str: string): ArrayBuffer => {
    const decoded = base64.decode(base64Str);
    const length = decoded.length;
    const bytes = new Uint8Array(length);
    
    for (let i = 0; i < length; i++) {
        bytes[i] = decoded.charCodeAt(i);
    }
    
    return bytes.buffer;
};

const bufferToBase64 = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            } else {
                reject(new Error('Failed to convert blob to base64'));
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
};

const uploadFile = async (options: FileUploadOptions) => {

    if(Array.isArray(options.fileData)) {
        const invalidFiles = options.fileData.filter(file => !allowedFileTypes.includes(file.type));
        if(invalidFiles.length > 0) {
            throw new Error(`Invalid file types: ${invalidFiles.map(file => file.name).join(', ')}`);
        }
    } else {
        if(!allowedFileTypes.includes(options.fileData.type)) {
            throw new Error(`Invalid file type: ${options.fileData.name}`);
        }
    }

    const username = useUserStore.getState().username;
    if(!username) {
        throw new Error('No username');
    }

    const files = options.fileData;
    if(Array.isArray(files) && files.length === 0 || !files) {
        throw new Error('No files to upload');
    }

    const uploadSingle = async (file: FileType) => {
        try {
            const fileData = await RNFS.readFile(file.uri, 'base64');
            const arrayBuffer = base64ToArrayBuffer(fileData);
            
            let fileName = file.name;
            console.log('file is: ',file)
            if (options.isProfilePicture) {
                const extension = fileName.split('.').pop() || 'jpg';
                fileName = `profile.${extension}`;
                // Store the extension in DB when uploading profile picture
                // await updateFriendProfilePicInDB(username, '', extension);
            }
            
            return storageClient.storage.from('guftgu').upload(
                `${username}/${fileName}`,
                arrayBuffer,
                {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: options.isProfilePicture // Override existing profile picture
                }
            );
        } catch (error) {
            throw new Error(`Failed to upload ${file.name}: ${error}`);
        }
    };

    if(Array.isArray(files)) {
        return Promise.all(files.map(uploadSingle));
    } else {
        return uploadSingle(files);
    }
};

const downloadFile = async (fileName: string, fileType: string) => {
    const username = useUserStore.getState().username;
    if(!fileName || !username) {
        console.log('No file name or username');
        return;
    }

    try {
        const response = await storageClient.storage
            .from('guftgu')
            .download(`${username}/${fileName}`);

        if(response.error) {
            console.log(`Failed to download ${fileName}: ${response.error}`);
            return;
        }

        if (!response.data) {
            console.log(`No data received for ${fileName}`);
            return;
        }

        const filePath = getDownloadPath(fileName, fileType);
        
        // Convert Blob to base64
        const base64Data = await bufferToBase64(response.data);
        
        // Write the file
        await RNFS.writeFile(filePath, base64Data, 'base64');
        return filePath;
    } catch (error) {
        throw new Error(`Failed to download ${fileName}: ${error}`);
    }
};

const downloadProfilePic = async (username: string, extension?: string): Promise<string | null> => {
    if (!username) {
        console.warn('No username provided for profile picture download');
        return null;
    }

    const fileExtension = extension || 'jpg';
    const fileName = `${username}-profile.${fileExtension}`;
    const filePath = getDownloadPath(fileName, `image/${fileExtension}`);

    try {
        // First check if file exists locally
        const fileExists = await RNFS.exists(filePath);
        if (fileExists) {
            return filePath;
        }

        const response = await storageClient.storage
            .from('guftgu')
            .download(`${username}/profile.${fileExtension}`);
        
        if (!response.data) {
            console.warn('Profile picture not found on server');
            return null;
        }

        // Convert Blob to base64
        const base64Data = await bufferToBase64(response.data);
        
        // Write the file
        await RNFS.writeFile(filePath, base64Data, 'base64');
        
        // Update DB with new path
        await updateFriendProfilePicInDB(username, filePath, fileExtension);
        
        return filePath;
    } catch (error) {
        console.warn(`Error in downloadProfilePic for ${username}:`, error);
        return null;
    }
};

export { uploadFile, downloadFile, downloadProfilePic };
