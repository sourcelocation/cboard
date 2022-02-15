import React, { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { EditorSidebar } from './EditorSidebar.jsx';
import './Editor.css'
import EditorSchedule from './schedule/EditorSchedule.jsx';
import { useParams } from 'react-router-dom';
import { store } from '../../app/store'
import { apiSlice } from '../api/apiSlice.js';

const editor = {
  display: 'flex'
}
export const ItemTypes = {
  BOX: 'box'
}

export default function Editor(props) {
  const params = useParams();
  const id = params.id
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={editor} >
          <EditorSchedule {...props} projectId={id} />
          <EditorSidebar projectId={id} />
        </div>
      </div>
    </DndProvider>
  );
}
