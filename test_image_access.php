<?php
/**
 * Test script to check if uploaded images are accessible
 */

$imageUrl = 'https://fremnatoscharity.org/storage/news/images/N92rcO9fuG6PKRirF2UnrDaBFl3bDdf0NKGt4gTe.png';

echo "Testing image access: " . $imageUrl . "\n\n";

// Check if file exists in Laravel storage
$laravelPath = '../fremnatos/storage/app/public/news/images/N92rcO9fuG6PKRirF2UnrDaBFl3bDdf0NKGt4gTe.png';
if (file_exists($laravelPath)) {
    echo "✓ File exists in Laravel storage: " . $laravelPath . "\n";
    echo "File size: " . filesize($laravelPath) . " bytes\n";
    echo "File permissions: " . substr(sprintf('%o', fileperms($laravelPath)), -4) . "\n";
} else {
    echo "✗ File NOT found in Laravel storage: " . $laravelPath . "\n";
}

// Check if file exists in public_html storage
$publicPath = __DIR__ . '/storage/news/images/N92rcO9fuG6PKRirF2UnrDaBFl3bDdf0NKGt4gTe.png';
if (file_exists($publicPath)) {
    echo "✓ File exists in public storage: " . $publicPath . "\n";
    echo "File size: " . filesize($publicPath) . " bytes\n";
} else {
    echo "✗ File NOT found in public storage: " . $publicPath . "\n";
}

// List all files in news/images directory
echo "\nFiles in Laravel storage/news/images/:\n";
$laravelDir = '../fremnatos/storage/app/public/news/images/';
if (is_dir($laravelDir)) {
    $files = scandir($laravelDir);
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            echo "- " . $file . "\n";
        }
    }
} else {
    echo "Directory not found: " . $laravelDir . "\n";
}

echo "\nFiles in public_html/storage/news/images/:\n";
$publicDir = __DIR__ . '/storage/news/images/';
if (is_dir($publicDir)) {
    $files = scandir($publicDir);
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            echo "- " . $file . "\n";
        }
    }
} else {
    echo "Directory not found: " . $publicDir . "\n";
}

// Test HTTP access
echo "\nTesting HTTP access...\n";
$context = stream_context_create([
    'http' => [
        'method' => 'HEAD',
        'timeout' => 10
    ]
]);

$headers = @get_headers($imageUrl, 1, $context);
if ($headers && strpos($headers[0], '200') !== false) {
    echo "✓ Image is accessible via HTTP\n";
} else {
    echo "✗ Image is NOT accessible via HTTP\n";
    if ($headers) {
        echo "HTTP Response: " . $headers[0] . "\n";
    }
}
?>
