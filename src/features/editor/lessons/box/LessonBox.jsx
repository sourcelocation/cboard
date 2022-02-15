import { useSelector, useDispatch } from 'react-redux'
import { selectTeacherById } from '../../teachers/teachersSlice.js'
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../../Editor.jsx'
import { lessonSet, lessonMoved, lessonDeleted, selectLessonByI, lessonRoomAdded } from '../../students/studentSlice.js'
import useFitText from "use-fit-text";
import { selectLessonById } from '../lessonsSlice.js'
import React, { useState } from 'react'
import Modal from 'antd/lib/modal/Modal'
import { Button } from 'antd'
import { selectAllRooms, selectRoomsForLessonI } from '../../schedule/scheduleInfoSlice.js'
import { IoSettingsOutline } from 'react-icons/io5'
import { colors } from '../colors'


export const LessonBox = React.memo(({ color, lessonName, teacherName, room, copyable, selectRoom }) => {
  const colorsStyle = colors[color] || [color, "black"]
  const { fontSize: fontSize1, ref: ref1 } = useFitText();
  const { fontSize: fontSize2, ref: ref2 } = useFitText();

  const renderedRoom = (
    (room || copyable ?
      (<Button size='small' type='text' style={{ color: colorsStyle[1], margin: '0 0 -2pt 2pt', padding: '0', fontSize: '8.5pt', fontWeight: 'bold', letterSpacing: '-1pt' }} onClick={selectRoom}>{room}</Button>) :
      (
        <Button size='small' type='text' style={{ color: colorsStyle[1], margin: '0 0 -2pt 2pt', padding: '0', }} icon={<IoSettingsOutline />} onClick={selectRoom} />
      )
    )
  )
  return (
    <div style={{ backgroundColor: colorsStyle[0], borderRadius: '6pt', display: 'flex', justifyContent: copyable ? 'center' : 'space-between', alignItems: 'flex-end' }} >
      {renderedRoom}
      <div>
        <div ref={ref1} style={{ fontSize: fontSize1 }}>
          <h4 style={{ margin: '0pt', padding: `8pt 0 0 0 `, color: colorsStyle[1], fontWeight: 'bold' }}>{lessonName}</h4>
        </div>
        <div ref={ref2} style={{ fontSize: fontSize2, height: '23.5pt', width: '108pt', margin: '0', padding: '0 0 8pt 0', color: colorsStyle[1] }} >
          {teacherName}
        </div>
      </div>
      <div style={{ opacity: '0' }}>
        {renderedRoom}
      </div>
    </div>
  )
})

