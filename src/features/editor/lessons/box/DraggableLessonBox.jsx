import React from "react"
import { useDrag } from "react-dnd"
import { useDispatch, useSelector } from "react-redux"
import { ItemTypes } from "../../Editor"
import { selectTeacherById } from "../../teachers/teachersSlice"
import { selectLessonById } from "../lessonsSlice"
import { LessonBox } from "./LessonBox"
import { Button, Modal, } from 'antd';
import { useState } from "react";
import { selectRoomsForLessonI } from "../../schedule/scheduleInfoSlice"
import { lessonDeleted, lessonMoved, lessonRoomAdded } from "../../students/studentSlice"

export const DraggableLessonBox = React.memo(({ lesson, teacher, roomName, i }) => {
  const lessonId = lesson.id
  const teacherId = teacher.id

  const dispatch = useDispatch()
  const [modalShown, setmodalShown] = useState(false)
  
  const roomNames = [] 

  const [{ isDragging, isOver }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: () => {
      return { lessonId: lessonId, teacherId: teacherId, i: i }
    },
    collect: (monitor) => {
      return ({
        isDragging: !!monitor.isDragging(),
        isOver: !!monitor.isOver
      })
    },
  }), [lessonId, teacherId, i])

  const roomSelect = () => {
    setmodalShown(true)
  }

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0 : 1 }}>
      <LessonBox lessonName={lesson.name} teacherName={teacher.name} color={lesson.color} room={roomName} copyable={false} selectRoom={roomSelect} />
      <Modal visible={modalShown} title="Выбор кабинета" onCancel={() => setmodalShown(false)} footer={[
        <Button key="back" onClick={() => {
          setmodalShown(false)
          dispatch(lessonRoomAdded({ lessonI: i.lessonI, dayI: i.dayI, studentId: i.studentId, roomName: null }))
        }} type='dashed'>
          Без кабинета
        </Button>,
        <Button key="back" onClick={() => {
          // dispatch(lessonDeleted({ lessonI: droppedI.lessonI, dayI: droppedI.dayI, studentId: droppedI.studentId }))
          setmodalShown(false)
          // setdroppedI(null)
        }}>
          Отмена
        </Button>
      ]}>
        {roomNames && roomNames.map(room => {
          return <Button key={room.name} shape='circle' style={{ margin: '4pt' }} disabled={!room.available} onClick={() => {
            dispatch(lessonRoomAdded({ lessonI: i.lessonI, dayI: i.dayI, studentId: i.studentId, roomName: room.name }))
            setmodalShown(false)
          }}>
            {room.name}
          </Button>
        })}
      </Modal>
    </div>
  )
})