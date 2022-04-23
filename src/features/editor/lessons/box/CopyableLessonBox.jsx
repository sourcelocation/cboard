import React from "react"
import { DragPreviewImage, useDrag } from "react-dnd"
import { useDispatch, useSelector } from "react-redux"
import { ItemTypes } from "../../Editor"
import { lessonSet } from "../../students/studentSlice"
import { selectTeacherById } from "../../teachers/teachersSlice"
import { selectLessonById } from "../lessonsSlice"
import { LessonBox } from "./LessonBox"

export const CopyableLessonBox = React.memo(({ big, lesson, teacher }) => {
  const lessonId = lesson.id
  const teacherId = teacher.id

  const [{ }, drag, preview] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: () => {
      return { lessonId: lessonId, teacherId: teacherId }
    },
    // end: (item, monitor) => {
    //   const res = monitor.getDropResult()
    //   console.log("setting");
    //   if (res !== null) {
    //     const iTo = res.i
    //     dispatch(lessonSet({ i: iTo, lesson: { lessonId: lessonId, teacherId: teacherId } }))
    //   }
    //   console.log("set");
    // },
  }), [lessonId, teacherId])

  return <div ref={drag} style={{ transform: 'translate(0, 0)' }}>
    <LessonBox
      color={lesson.color}
      copyable
      lessonName={lesson.name}
      teacherName={teacher.name}
      style={big ? { height: '60px' } : { height: '30px' }}
    />
  </div>
})