git pull origin uat
git add .
echo "Please enter comment: "
read comment
git commit -m "$comment"
git push origin uat