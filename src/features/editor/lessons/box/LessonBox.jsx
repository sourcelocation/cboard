// import { useSelector, useDispatch } from 'react-redux'
// import { selectTeacherById } from '../../teachers/teachersSlice.js'
// import { useDrag } from 'react-dnd'
// import { ItemTypes } from '../../Editor.jsx'
// import { lessonSet, lessonMoved, lessonDeleted, selectLessonByI, lessonRoomAdded } from '../../students/studentSlice.js'
// import useFitText from "use-fit-text";
// import { selectLessonById } from '../lessonsSlice.js'
import { Door } from 'tabler-icons-react';
import React, { useState } from 'react'
// import { selectAllRooms, selectRoomsForLessonI } from '../../schedule/scheduleInfoSlice.js'
import { IoSettingsOutline } from 'react-icons/io5'
import { colors } from '../colors'
import { applyZoom } from './DraggableLessonBox.jsx'
import { ActionIcon, Button } from '@mantine/core';


export const LessonBox = React.memo(({ color, lessonName, teacherName, room, copyable, selectRoom, style }) => {
  const colorsStyle = colors[color] || [color, "black"]

  const renderedRoom = room || copyable ?
    <Button size='xs' variant="light" onClick={selectRoom}>
      {room}
    </Button> :
    <ActionIcon onClick={selectRoom}>
      <Door />
    </ActionIcon>
  return (
    <div
      style={{
        alignItems: 'flex-end',
        backgroundColor: colorsStyle[0],
        borderRadius: '9px',
        display: 'flex',
        justifyContent: copyable ? 'center' : 'start',
        ...style
      }}
    >
      {!copyable && renderedRoom}
      <div
        style={{
          height: '100%',
          width: '76%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            margin: '0pt',
            display: 'flex',
            justifyContent: 'flex-end',
            color: colorsStyle[1],
            fontWeight: '600',
            fontSize: '0.75em',
          }}
        >
          {lessonName}
        </div>
        <p
          style={{
            fontSize: '0.75em',
            margin: '0',
            color: colorsStyle[1],

            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {teacherName}
        </p>
      </div>
      {/* {renderedRoom} */}
    </div>
  )
})

