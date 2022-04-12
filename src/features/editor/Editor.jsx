import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { EditorSidebar } from './sidebar/EditorSidebar.jsx';
import './Editor.css'
import { useParams } from 'react-router-dom';
import EditorSchedule from './schedule/EditorGrid.jsx';

const editor = {
  display: 'flex',
  height: 'calc(100vh - 110px)',
}
export const ItemTypes = {
  BOX: 'box'
}

export default function Editor(props) {
  const params = useParams();
  const id = params.id

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={editor}>
        <EditorSchedule {...props} projectId={id} />
        <EditorSidebar projectId={id} />
      </div>
    </DndProvider>
  );
}
