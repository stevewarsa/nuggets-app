cd /cygdrive/c/backup/code/nuggets-app/memory
currDate=$(date +"%m-%d-%Y hh:mm:ss")
echo "Setting date/time to ${currDate}"
sed -i "s/{{todaystr}}/${currDate}/g" src/environments/environment.prod.ts
ng build --prod --base-href /nuggets/
# now put it back to the way it was...
sed -i "s/${currDate}/{{todaystr}}/g" src/environments/environment.prod.ts
# delete the existing files for this app
ssh swarsa_memoryverses@ssh.phx.nearlyfreespeech.net "cd /home/public/nuggets; ls | grep -v server | grep -v browsequotes | grep -v bibleSearch | grep -v chapterSelection | grep -v myverselist | grep -v practice | grep -v practiceSetup | grep -v viewChapter | grep -v viewPassage | grep -v browseTopic | grep -v '^main$' | xargs rm -rf"
cd dist/memory
scp -r * swarsa_memoryverses@ssh.phx.nearlyfreespeech.net:/home/public/nuggets
echo "From client side, invoking /home/private/deploy.sh ..."
ssh swarsa_memoryverses@ssh.phx.nearlyfreespeech.net "/home/private/deploy.sh"
cd /cygdrive/c/backup/code/nuggets-app/memory
