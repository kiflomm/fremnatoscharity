<?php
/**
 * Automated file copying script
 * This script monitors Laravel storage and copies new files to public_html/storage/
 * Run this periodically via cron job or call it after each upload
 */

$sourceDir = '../fremnatos/storage/app/public';
$targetDir = __DIR__ . '/storage';

// Function to copy a single file
function copyFile($sourceFile, $targetFile) {
    $targetDir = dirname($targetFile);
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }
    return copy($sourceFile, $targetFile);
}

// Function to sync directories
function syncDirectory($src, $dst) {
    $copiedCount = 0;
    $dir = opendir($src);
    
    while (($file = readdir($dir)) !== false) {
        if ($file != '.' && $file != '..') {
            $srcFile = $src . '/' . $file;
            $dstFile = $dst . '/' . $file;
            
            if (is_dir($srcFile)) {
                if (!is_dir($dstFile)) {
                    mkdir($dstFile, 0755, true);
                }
                $copiedCount += syncDirectory($srcFile, $dstFile);
            } else {
                // Only copy if target doesn't exist or source is newer
                if (!file_exists($dstFile) || filemtime($srcFile) > filemtime($dstFile)) {
                    if (copyFile($srcFile, $dstFile)) {
                        echo "✓ Synced: " . basename($file) . "\n";
                        $copiedCount++;
                    }
                }
            }
        }
    }
    closedir($dir);
    return $copiedCount;
}

echo "Syncing files from Laravel storage to public_html...\n";
echo "Source: " . $sourceDir . "\n";
echo "Target: " . $targetDir . "\n\n";

if (!is_dir($sourceDir)) {
    echo "ERROR: Source directory not found: " . $sourceDir . "\n";
    exit;
}

$syncedFiles = syncDirectory($sourceDir, $targetDir);
echo "\n✓ Synced $syncedFiles files\n";

echo "\nSync completed! Files should be accessible at:\n";
echo "https://fremnatoscharity.org/storage/news/images/\n";
echo "https://fremnatoscharity.org/storage/stories/images/\n";
?>
