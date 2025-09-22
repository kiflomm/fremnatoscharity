<?php
/**
 * Copy storage files directly to public_html
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
        if (mkdir($dir, 0755, true)) {
            echo "✓ Created: " . $dir . "\n";
        } else {
            echo "✗ Failed to create: " . $dir . "\n";
        }
    } else {
        echo "✓ Directory exists: " . $dir . "\n";
    }
}

// Copy existing files
function copyDirectory($src, $dst) {
    $dir = opendir($src);
    $copiedCount = 0;
    while (($file = readdir($dir)) !== false) {
        if ($file != '.' && $file != '..') {
            $srcFile = $src . '/' . $file;
            $dstFile = $dst . '/' . $file;
            
            if (is_dir($srcFile)) {
                if (!is_dir($dstFile)) {
                    mkdir($dstFile, 0755, true);
                }
                $copiedCount += copyDirectory($srcFile, $dstFile);
            } else {
                if (copy($srcFile, $dstFile)) {
                    echo "✓ Copied: " . $file . "\n";
                    $copiedCount++;
                } else {
                    echo "✗ Failed to copy: " . $file . "\n";
                }
            }
        }
    }
    closedir($dir);
    return $copiedCount;
}

$copiedFiles = copyDirectory($sourceDir, $targetDir);

echo "\n✓ Copied $copiedFiles files successfully!\n";
echo "Images should now be accessible at:\n";
echo "- https://fremnatoscharity.org/storage/news/images/\n";
echo "- https://fremnatoscharity.org/storage/stories/images/\n\n";

// Test one of the files
$testFile = $targetDir . '/news/images/rtUJDN2kPDL9htEUaswuez2GYefdeNppdRM7jsOz.png';
if (file_exists($testFile)) {
    echo "✓ Test file exists: " . $testFile . "\n";
    echo "✓ You can now access: https://fremnatoscharity.org/storage/news/images/rtUJDN2kPDL9htEUaswuez2GYefdeNppdRM7jsOz.png\n";
} else {
    echo "✗ Test file not found: " . $testFile . "\n";
}
?>
