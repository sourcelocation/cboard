import React from "react"
import { useDrag } from "react-dnd"
import { useDispatch, useSelector } from "react-redux"
import { ItemTypes } from "../../Editor"
import { selectTeacherById } from "../../teachers/teachersSlice"
import { selectLessonById } from "../lessonsSlice"
import { LessonBox } from "./LessonBox"
import { useState } from "react";
import { roomsForScheduleLessonI, selectRoomsForLessonI } from "../../schedule/scheduleInfoSlice"
import { lessonDeleted, lessonMoved, lessonRoomAdded } from "../../students/studentSlice"
import { useEditorSetScheduleLessonRoomMutation } from "../../../api/apiSlice"

export const applyZoom = (size, zoom) => {
  return zoom ? `calc(${size}px * ${zoom} / 100)` : `${size}px`
}

export const DraggableLessonBox = React.memo((props) => {
  const { lesson, teacher, roomName, i, lessons, teachers, students, schedule, zoom } = props

  const [setRoom, setRoomResult] = useEditorSetScheduleLessonRoomMutation({
    fixedCacheKey: 'editor-update-teachers',
  })
  const lessonId = lesson.id
  const teacherId = teacher.id

  const [modalShown, setmodalShown] = useState(false)
  const roomNames = modalShown ? roomsForScheduleLessonI(i,Array.from(Array(27).keys()).map(i => `${i + 1}`),schedule) : []

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
    <div ref={drag} style={{ opacity: isDragging ? 0 : 1, width: applyZoom(185,zoom) }}>
      <LessonBox lessonName={lesson.name} teacherName={teacher.name} color={lesson.color} room={roomName} copyable={false} selectRoom={roomSelect} zoom={zoom} />
      <Modal visible={modalShown} title="Выбор кабинета" onCancel={() => setmodalShown(false)} footer={[
        <Button key="back" onClick={() => {
          setmodalShown(false)
          setRoom({ i: i, room: null })
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
            setRoom({ i: i, room: room.name })
            setmodalShown(false)
          }}>
            {room.name}
          </Button>
        })}
      </Modal>
    </div>
  )
})