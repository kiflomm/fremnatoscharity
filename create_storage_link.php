<?php
/**
 * Storage Link Creation Script for GoDaddy Shared Hosting
 * Run this script once after deployment to create the storage link
 */

// Define paths - adjust these based on your actual GoDaddy folder structure
$publicPath = __DIR__; // This should be your public_html directory
$laravelAppPath = '../fremnatos'; // Adjust this to your actual Laravel app folder name
$storagePath = $laravelAppPath . '/storage/app/public';

echo "Debug Information:\n";
echo "Current directory: " . __DIR__ . "\n";
echo "Public path: " . $publicPath . "\n";
echo "Laravel app path: " . $laravelAppPath . "\n";
echo "Storage path: " . $storagePath . "\n\n";

// Check if Laravel storage directory exists
if (!is_dir($storagePath)) {
    echo "ERROR: Laravel storage directory not found at: " . $storagePath . "\n";
    echo "Please check your folder structure and update the paths in this script.\n";
    echo "Common GoDaddy structures:\n";
    echo "- ../laravel_app/storage/app/public\n";
    echo "- ../fremnatos/storage/app/public\n";
    echo "- ../app/storage/app/public\n";
    exit;
}

echo "✓ Laravel storage directory found at: " . $storagePath . "\n";

// Create storage directory structure in public_html
$directories = [
    $publicPath . '/storage',
    $publicPath . '/storage/news',
    $publicPath . '/storage/news/images',
    $publicPath . '/storage/stories',
    $publicPath . '/storage/stories/images',
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        if (mkdir($dir, 0755, true)) {
            echo "✓ Created directory: " . $dir . "\n";
        } else {
            echo "✗ Failed to create directory: " . $dir . "\n";
        }
    } else {
        echo "✓ Directory already exists: " . $dir . "\n";
    }
}

// Create .htaccess file to redirect requests to Laravel storage
$htaccessContent = <<<HTACCESS
RewriteEngine On

# Handle Authorization Header
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

# Redirect to Laravel storage
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ {$laravelAppPath}/storage/app/public/$1 [L]
HTACCESS;

if (file_put_contents($publicPath . '/storage/.htaccess', $htaccessContent)) {
    echo "✓ Created .htaccess file for storage redirection\n";
} else {
    echo "✗ Failed to create .htaccess file\n";
}

// Test if we can access a sample file
$testFile = $storagePath . '/news/images';
if (is_dir($testFile)) {
    echo "✓ News images directory is accessible\n";
} else {
    echo "✗ News images directory not accessible\n";
}

echo "\nStorage link setup completed!\n";
echo "Your uploaded images should now be accessible at:\n";
echo "- https://fremnatoscharity.org/storage/news/images/\n";
echo "- https://fremnatoscharity.org/storage/stories/images/\n\n";

echo "If you're still getting errors, check:\n";
echo "1. File permissions (755 for directories)\n";
echo "2. The correct path to your Laravel app folder\n";
echo "3. That the uploaded file actually exists in the storage directory\n";
?>
