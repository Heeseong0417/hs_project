# passbucketDesktop

## 설치방법
build
1) 파이썬 빌드


exe   폴더 이동후 pyinstaller 이용 실행 파일 생성

pyinstaller -F main.py

1.1) 실행 파일 이동

// 개발 모드시 실행파일을 읽는 위치에 파이썬 실행 파일 복사(npm run dev 실행시)

cp exe/dist/main node_modules/electron/dist/Electron.app/Contents/Resources/extraResources

// build시 읽어오는 위치로 복사(npm run dist 실행시)

cp exe/dist/main extraResources/

2) 일렉트론 빌드

//소스코드 다운로드

git clone https://github.com/inojeon/passbucket-desktop.git

// 폴더 이동 및 외부 패키지 설치

cd passbucket-desktop

npm i

// 개발 모드 실행

npm run dev


// build

npm run dist 


## main.py의 실행을 위한 환경설정

* 개발환경에서 필요하며, main.exe빌드 후에는 필요하지 않음

pip install jsonschema

pip install lxml

pip install jsonpath-ng

[main.py의 실행]







# 세번째 탭 메뉴 - > renderer\conponent\Excels
  ## [id].tsx 경로 -> run_test
   ## index_ex.tsx 경로 -> renderer\pages\schema
