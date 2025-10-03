<?php
/**
 * Test script to verify public_path() points to the correct directory
 * Upload this to your public_html directory and run it
 */

// Include Laravel bootstrap to get access to helpers
require_once '../fremnatos/vendor/autoload.php';
$app = require_once '../fremnatos/bootstrap/app.php';

echo "=== Public Path Test ===\n\n";

// Test public_path() helper
$publicPath = public_path();
echo "public_path(): " . $publicPath . "\n";

// Test if it points to public_html
$expectedPath = '/home/sog2hcsbpmox/public_html';
echo "Expected path: " . $expectedPath . "\n";

if ($publicPath === $expectedPath) {
    echo "✓ public_path() is pointing to the correct directory!\n";
} else {
    echo "✗ public_path() is NOT pointing to public_html\n";
    echo "Current working directory: " . getcwd() . "\n";
    echo "Script location: " . __DIR__ . "\n";
}

echo "\n=== Directory Structure Test ===\n";

// Test if we can create a file in the expected location
$testFile = public_path('storage/test.txt');
$testDir = dirname($testFile);

echo "Test file path: " . $testFile . "\n";
echo "Test directory: " . $testDir . "\n";

// Create directory if it doesn't exist
if (!is_dir($testDir)) {
    if (mkdir($testDir, 0755, true)) {
        echo "✓ Created test directory: " . $testDir . "\n";
    } else {
        echo "✗ Failed to create test directory: " . $testDir . "\n";
    }
} else {
    echo "✓ Test directory exists: " . $testDir . "\n";
}

// Try to create a test file
if (file_put_contents($testFile, 'Test content')) {
    echo "✓ Successfully created test file: " . $testFile . "\n";
    
    // Test if file is accessible via web
    $webUrl = 'https://fremnatoscharity.org/storage/test.txt';
    echo "Testing web access: " . $webUrl . "\n";
    
    $headers = @get_headers($webUrl);
    if ($headers && strpos($headers[0], '200') !== false) {
        echo "✓ File is accessible via web!\n";
    } else {
        echo "✗ File is NOT accessible via web\n";
        if ($headers) {
            echo "HTTP Response: " . $headers[0] . "\n";
        }
    }
    
    // Clean up test file
    unlink($testFile);
    echo "✓ Cleaned up test file\n";
} else {
    echo "✗ Failed to create test file: " . $testFile . "\n";
}

echo "\n=== Recommendations ===\n";

if ($publicPath !== $expectedPath) {
    echo "If public_path() is not pointing to public_html, you can:\n";
    echo "1. Use the absolute path in your services:\n";
    echo "   \$publicPath = '/home/sog2hcsbpmox/public_html/storage/' . \$path;\n";
    echo "2. Or update your Laravel configuration to point to the correct public directory\n";
} else {
    echo "✓ Everything looks good! public_path() is working correctly.\n";
}
?>
