git add .
$line = Read-Host "Enter commit"
git commit -m $line
git push origin main