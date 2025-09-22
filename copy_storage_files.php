<?php
/**
 * Alternative: Copy storage files directly to public_html
 * This method copies uploaded files to public_html/storage/ for direct access
 */

$sourceDir = '../fremnatos/storage/app/public';
$targetDir = __DIR__ . '/storage';

echo "Copying storage files from: " . $sourceDir . "\n";
echo "To: " . $targetDir . "\n\n";

if (!is_dir($sourceDir)) {
    echo "ERROR: Source directory not found: " . $sourceDir . "\n";
    exit;
}

// Create target directory structure
$directories = [
    $targetDir,
    $targetDir . '/news',
    $targetDir . '/news/images',
    $targetDir . '/stories',
    $targetDir . '/stories/images',
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
        echo "Created: " . $dir . "\n";
    }
}

// Copy existing files
function copyDirectory($src, $dst) {
    $dir = opendir($src);
    while (($file = readdir($dir)) !== false) {
        if ($file != '.' && $file != '..') {
            $srcFile = $src . '/' . $file;
            $dstFile = $dst . '/' . $file;
            
            if (is_dir($srcFile)) {
                if (!is_dir($dstFile)) {
                    mkdir($dstFile, 0755, true);
                }
                copyDirectory($srcFile, $dstFile);
            } else {
                copy($srcFile, $dstFile);
                echo "Copied: " . $file . "\n";
            }
        }
    }
    closedir($dir);
}

copyDirectory($sourceDir, $targetDir);

echo "\nFiles copied successfully!\n";
echo "Images should now be accessible at:\n";
echo "- https://fremnatoscharity.org/storage/news/images/\n";
echo "- https://fremnatoscharity.org/storage/stories/images/\n";
?>
