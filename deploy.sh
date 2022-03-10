rm -rf dist &&
yarn build &&
cd dist &&
git init &&
git add . &&
git commit -m "deploy" &&
git remote add github git@github.com:TravisWongX/canvas-drawing-web.git &&
git push -f github master &&
git remote add gitee git@gitee.com:xmix/canvas-drawing-web.git &&
git push -f gitee master
cd -