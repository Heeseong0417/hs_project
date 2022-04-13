import { useEffect, useState } from "react";
import { FileDrop } from "react-file-drop";
import Layout from "../components/Layout";

const IndexPage = () => {
  const [dropNotice, setDropNotice] = useState<string>(
    "Drop some Folder here!"
  );

  const [folderPath, setFloderPath] = useState<string>("");

  useEffect(() => {
    // add a listener to 'message' channel
    // global.ipcRenderer.addListener("message", (_event, args) => {
    //   alert(args);
    // });
    global.ipcRenderer.addListener("folderPath", (_event, args) => {
      setFloderPath(args);
      // alert(args);
      console.log(args);
    });
  }, []);

  // const onSayHiClick = () => {
  //   global.ipcRenderer.send("message", "hi from next");
  // };

  const onDropFolder = (files, event) => {
    if (files.length !== 1) {
      console.log("한개의 폴더만 업로드하세요.");
    } else {
      console.log(files);

      setFloderPath(files[0].path);
      global.ipcRenderer.send("folderPath", files[0].path);
    }
  };

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <h1 className="text-2xl">Hello Next.js 👋</h1>
      {/* <button onClick={onSayHiClick}>Say hi to electron</button> */}

      <div className="m-4">
        <div className="m-4 border-2 text-center">
          <FileDrop
            className="p-4"
            onFrameDragEnter={() => setDropNotice("여기로 드래그 하세요")}
            onFrameDragLeave={(event) => console.log("onFrameDragLeave", event)}
            onFrameDrop={() => setDropNotice("Drop some Folder here!")}
            onDragOver={() => setDropNotice("놓으세요~~!")}
            onDragLeave={(event) => console.log("onDragLeave", event)}
            onDrop={onDropFolder}
          >
            {dropNotice}
          </FileDrop>
        </div>
      </div>
      <div>
        <div className="whitespace-pre">{folderPath}</div>
      </div>
      {/* <button onClick={}>Say hi to electrons</button> */}
    </Layout>
  );
};

export default IndexPage;
