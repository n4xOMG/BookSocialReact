# PowerShell script to replace console.* statements with logger.* in Redux action files
# This script handles bulk replacements for remaining Redux action files

$ErrorActionPreference = "Stop"

# Define files to process
$files = @(
    "src\redux\comment\comment.action.js",
    "src\redux\book\book.action.js",
    "src\redux\chapter\chapter.action.js",
    "src\redux\notification\notification.action.js",
    "src\redux\post\post.action.js",
    "src\redux\chat\chat.action.js",
    "src\redux\auth\auth.action.js"
)

# Function to add logger import if not present
function Add-LoggerImport {
    param([string]$filePath, [string]$loggerName)
    
    $content = Get-Content $filePath -Raw
    
    # Check if logger import already exists
    if ($content -notmatch 'import.*createLogger.*from.*logger') {
        # Find the first import statement and add logger import after it
        $content = $content -replace '(import.*from.*[''"].*[''"];?\r?\n)', "`$1import { createLogger } from `"../../utils/logger`";`n"
        
        # Add logger instance after imports
        $content = $content -replace '(\r?\n\r?\nexport )', "`n`nconst logger = createLogger(`"$loggerName`");`n`nexport "
        
        Set-Content $filePath $content -NoNewline
        Write-Host "OK: Added logger import and instance to $filePath" -ForegroundColor Green
    } else {
        Write-Host "SKIP: Logger already imported in $filePath" -ForegroundColor Yellow
    }
}

# Function to replace console statements
function Replace-ConsoleStatements {
    param([string]$filePath)
    
    $content = Get-Content $filePath -Raw
    $originalContent = $content
    
    # Replace console.log with logger.info (for data logging)
    $content = $content -replace 'console\.log\(', 'logger.info('
    
    # Replace console.error with logger.error
    $content = $content -replace 'console\.error\(', 'logger.error('
    
    # Replace console.warn with logger.warn
    $content = $content -replace 'console\.warn\(', 'logger.warn('
    
    # Replace console.info with logger.info
    $content = $content -replace 'console\.info\(', 'logger.info('
    
    # Replace console.debug with logger.debug
    $content = $content -replace 'console\.debug\(', 'logger.debug('
    
    if ($content -ne $originalContent) {
        Set-Content $filePath $content -NoNewline
        Write-Host "OK: Replaced console statements in $filePath" -ForegroundColor Green
        return $true
    } else {
        Write-Host "INFO: No console statements found in $filePath" -ForegroundColor Cyan
        return $false
    }
}

# Main execution
Write-Host "`nStarting console.log cleanup for Redux actions...`n" -ForegroundColor Cyan

$processedCount = 0
$totalFiles = $files.Count

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot "..\$file"
    
    if (Test-Path $fullPath) {
        Write-Host "Processing: $file" -ForegroundColor White
        
        # Extract logger name from file path (e.g., comment.action.js -> CommentActions)
        $fileName = Split-Path $file -Leaf
        $moduleName = $fileName -replace '\.action\.js$', ''
        $loggerName = (Get-Culture).TextInfo.ToTitleCase($moduleName) + "Actions"
        
        # Add logger import
        Add-LoggerImport -filePath $fullPath -loggerName $loggerName
        
        # Replace console statements
        $replaced = Replace-ConsoleStatements -filePath $fullPath
        
        if ($replaced) {
            $processedCount++
        }
        
        Write-Host ""
    } else {
        Write-Host "ERROR: File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n=== Completed! Processed $processedCount out of $totalFiles files.`n" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review changes with git diff" -ForegroundColor White
Write-Host "  2. Test the application to ensure no regressions" -ForegroundColor White
Write-Host "  3. Run npm start and check console for logger output" -ForegroundColor White
