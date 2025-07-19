import React, { useState, useEffect } from 'react';

interface EmployeeAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
};

export default function EmployeeAvatar({ 
  src, 
  name, 
  size = 'md', 
  className = '' 
}: EmployeeAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Reset error and loading state when src changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(false);
    
    if (src) {
      // Check if the URL is complete or needs base URL
      let fullUrl = src;
      
      if (!src.startsWith('http')) {
        // Get API base URL and remove /api suffix for storage access
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const storageBaseUrl = apiBaseUrl.replace('/api', '');
        
        // Handle both storage/employees/file.jpg and employees/file.jpg formats
        if (src.startsWith('employees/')) {
          fullUrl = `${storageBaseUrl}/storage/${src}`;
        } else if (src.startsWith('storage/')) {
          fullUrl = `${storageBaseUrl}/${src}`;
        } else {
          fullUrl = `${storageBaseUrl}/storage/employees/${src}`;
        }
      }
      
      // Test if the image URL is accessible
      setImageLoading(true);
      const img = new Image();
      img.onload = () => {
        setImageSrc(fullUrl);
        setImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        // Only log in development to reduce console noise
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Avatar image failed to load: ${fullUrl}`);
        }
        setImageError(true);
        setImageLoading(false);
        setImageSrc(null);
      };
      img.src = fullUrl;
    } else {
      setImageSrc(null);
    }
  }, [src]);

  const handleImageError = () => {
    // Only log in development to reduce console noise
    if (process.env.NODE_ENV === 'development') {
      console.warn('Avatar image error handled');
    }
    setImageError(true);
    setImageLoading(false);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getBackgroundColor = (name: string): string => {
    // Generate consistent color based on name
    const colors = [
      'bg-indigo-500',
      'bg-purple-500', 
      'bg-pink-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-violet-500',
      'bg-fuchsia-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Loading state
  if (imageLoading) {
    return (
      <div className={`${sizeClasses[size]} ${getBackgroundColor(name)} rounded-full flex items-center justify-center text-white font-semibold border-2 border-white dark:border-gray-700 shadow-sm animate-pulse ${className}`}>
        <span>{getInitials(name)}</span>
      </div>
    );
  }

  // If image exists and loaded successfully, show image
  if (imageSrc && !imageError) {
    return (
      <img
        src={imageSrc}
        alt={`Avatar of ${name}`}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm ${className}`}
        onError={handleImageError}
      />
    );
  }

  // Fallback to initials avatar (no image or image failed to load)
  return (
    <div className={`${sizeClasses[size]} ${getBackgroundColor(name)} rounded-full flex items-center justify-center text-white font-semibold border-2 border-white dark:border-gray-700 shadow-sm ${className}`}>
      <span>{getInitials(name)}</span>
    </div>
  );
} 