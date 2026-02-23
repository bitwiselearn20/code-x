interface fnHandler {
  fileSystem: Object;
  openFile: string[];
  socket: any;
}

function CustomEditor(prop: fnHandler) {
  return <div>CustomEditor</div>;
}

export default CustomEditor;
