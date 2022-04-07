import { CopyableLessonBox } from './../lessons/box/CopyableLessonBox'

export function LessonTeachers({ teachers, lesson }) {
  const filteredTeachers = teachers.filter(t => t.taughtLessons.map(l => l.id).includes(lesson.id))

  return (
    filteredTeachers.map(teacher => <div style={{ marginTop: '10pt' }}>
      <CopyableLessonBox lesson={lesson} teacher={teacher} />
    </div>
    )
  )
}