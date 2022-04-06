import { useSelector, useDispatch } from 'react-redux'
import { selectTeacherById } from '../../teachers/teachersSlice.js'
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../../Editor.jsx'
import { lessonSet, lessonMoved, lessonDeleted, selectLessonByI, lessonRoomAdded } from '../../students/studentSlice.js'
import useFitText from "use-fit-text";
import { selectLessonById } from '../lessonsSlice.js'
import React, { useState } from 'react'
import { selectAllRooms, selectRoomsForLessonI } from '../../schedule/scheduleInfoSlice.js'
import { IoSettingsOutline } from 'react-icons/io5'
import { colors } from '../colors'
import { applyZoom } from './DraggableLessonBox.jsx'


export const LessonBox = React.memo(({ color, lessonName, teacherName, room, copyable, selectRoom, zoom }) => {
  const colorsStyle = colors[color] || [color, "black"]

  const renderedRoom = (
    (room || copyable ?
      (<Button
        size='small'
        type='text' style={{
          color: colorsStyle[1],
          padding: '0',
          fontSize: applyZoom(10, zoom),
          fontWeight: 'bold',
          letterSpacing: '-1pt',
          width: '12%',
        }}
        onClick={selectRoom}>
        {room}
      </Button>) :
      (
        <Button
          size='small'
          type='text'
          style={{
            color: colorsStyle[1],
            fontSize: applyZoom(10, zoom),
            padding: '0',
            height: '35%',
            width: '12%'
          }}
          icon={
            <IoSettingsOutline
              size={zoom / 7}
            />}
          onClick={selectRoom}
        />
      )
    )
  )
  return (
    <div
      style={{
        alignItems: 'flex-end',
        backgroundColor: colorsStyle[0],
        borderRadius: applyZoom(9, zoom),
        display: 'flex',
        width: applyZoom(180, zoom),
        height: applyZoom(60, zoom),
        justifyContent: copyable ? 'center' : 'start'
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
            fontSize: applyZoom(13, zoom),
          }}
        >
          {lessonName}
        </div>
        <p
          style={{
            fontSize: applyZoom(10.5, zoom),
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

