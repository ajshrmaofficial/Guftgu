import ImageCropPicker, { Options, Image, Video } from "react-native-image-crop-picker";
import { pick, types, DocumentPickerResponse } from 'react-native-document-picker';

interface MediaPickerOptions {
  mediaType?: 'photo' | 'video' | 'document' | 'any';
  multiple?: boolean;
  cropping?: boolean;
  maxFiles?: number;
  compressImageQuality?: number;
  // Document specific options
  allowedDocTypes?: string[];
}

interface MediaPickerError {
  message: string;
  code: string;
}

type MediaAsset = Image | Video | DocumentPickerResponse;

const pickDocuments = async (options: MediaPickerOptions): Promise<DocumentPickerResponse[]> => {
  try {
    const response = await pick({
      type: options.allowedDocTypes || [types.allFiles],
      allowMultiSelection: options.multiple,
    });
    return Array.isArray(response) ? response : [response];
  } catch (error: any) {
    if (error.code === 'CANCEL') {
      return [];
    }
    throw error;
  }
};

const pickMediaFiles = async (options: MediaPickerOptions): Promise<(Image | Video)[]> => {
  const pickerOptions: Options = {
    mediaType: options.mediaType === 'any' ? 'any' : options.mediaType === 'photo' ? 'photo' : 'video',
    multiple: options.multiple || false,
    cropping: options.cropping || false,
    maxFiles: options.maxFiles || 1,
    compressImageQuality: options.compressImageQuality || 0.8,
  };

  try {
    if (options.multiple) {
      const response = await ImageCropPicker.openPicker(pickerOptions);
      return Array.isArray(response) ? response : [response];
    } else {
      const response = await ImageCropPicker.openPicker(pickerOptions);
      return [response];
    }
  } catch (error: unknown) {
    const pickerError = error as MediaPickerError;
    if (pickerError.code === 'E_PICKER_CANCELLED') {
      return [];
    }
    throw pickerError;
  }
};

export const pickMedia = async (options: MediaPickerOptions = {}): Promise<MediaAsset[]> => {
  try {
    if (options.mediaType === 'document') {
      return await pickDocuments(options);
    } else {
      return await pickMediaFiles(options);
    }
  } catch (error: unknown) {
    const pickerError = error as MediaPickerError;
    
    switch (pickerError.code) {
      case 'E_PERMISSION_MISSING':
        console.error('Media picker permission denied');
        throw new Error('Permission to access media library was denied');
      
      case 'E_PICKER_NO_CAMERA_PERMISSION':
        console.error('Camera permission denied');
        throw new Error('Permission to access camera was denied');
        
      case 'E_NO_LIBRARY_PERMISSION':
        console.error('Media library permission denied');
        throw new Error('Permission to access media library was denied');
        
      default:
        console.error('Media picker error:', pickerError.message || 'Unknown error occurred');
        throw new Error('Failed to pick media: ' + (pickerError.message || 'Unknown error'));
    }
  }
};
