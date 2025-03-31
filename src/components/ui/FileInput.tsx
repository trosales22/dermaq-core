import { FC, useState } from 'react';
import cloudinaryConfig from 'config/cloudinaryConfig';

interface FileInputProps {
  label: string;
  accept?: string;
  maxSizeLabel?: string;
  multiple?: boolean;
  className?: string;
  onUpload: (urls: string[]) => void;
}

const FileInput: FC<FileInputProps> = ({
  onUpload,
  label,
  accept = 'image/*',
  maxSizeLabel,
  multiple = false,
  className,
}) => {
  const [uploading, setUploading] = useState(false);
  const cloudName = cloudinaryConfig.cloudName
  const uploadPreset = cloudinaryConfig.uploadPreset

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload');
      }

      const data = await response.json();
      return data.secure_url;
    });

    try {
      const urls = await Promise.all(uploadPromises);
      onUpload(urls);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleUpload(e.target.files)}
        className="mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
      />
      {maxSizeLabel && <span className="text-xs text-gray-500 mt-1">{maxSizeLabel}</span>}
      {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
    </div>
  );
};

export default FileInput;
