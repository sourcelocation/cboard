import React from "react"
import { useDrag } from "react-dnd"
import { ItemTypes } from "../../Editor"
import { LessonBox } from "./LessonBox"
import { useState } from "react";
import { roomsForScheduleLessonI } from "../../schedule/scheduleInfoSlice"
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
    <div ref={drag} style={{ opacity: isDragging ? 0 : 1 }}>
      <LessonBox lessonName={lesson.name} teacherName={teacher.name} color={lesson.color} room={roomName} copyable={false} selectRoom={roomSelect} style={{height: '60px', width: '180px'}} />
    </div>
  )
})