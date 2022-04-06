
export function applyActionOnDraft(draft, action) {
  if (action.multipleActions) {
    for (const action1 of action.actions) {
      applyActionOnDraft(draft, JSON.parse(action1))
    }
  }
  // Schedule
  else if (action.moveScheduleLessonAction) {
    const { fromI, toI } = action
    draft.students.entities[toI.studentId].schedule[toI.dayI][toI.lessonI] = draft.students.entities[fromI.studentId].schedule[fromI.dayI][fromI.lessonI]
    draft.students.entities[fromI.studentId].schedule[fromI.dayI][fromI.lessonI] = null
  } else if (action.copyScheduleLessonAction) {
    const { toI, lessonId, teacherId } = action
    draft.students.entities[toI.studentId].schedule[toI.dayI][toI.lessonI] = { lessonId: lessonId, teacherId: teacherId }
  } else if (action.lessonFieldCountAction) {
    const { dayI, studentId, add } = action
    if (add) {
      draft.students.entities[studentId].schedule[dayI].push(null)
    } else {
      draft.students.entities[studentId].schedule[dayI].pop()
    }
  } else if (action.setScheduleLessonRoomAction) {
    const { i, room } = action
    draft.students.entities[i.studentId].schedule[i.dayI][i.lessonI].room = room
  }
  // Students
  else if (action.addStudentAction) {
    const { studentId, name, className, dayLessonCount } = action
    draft.students.entities[studentId] = { id: studentId, name: name, className: className, schedule: Array(5).fill(null).map(d => Array(dayLessonCount).fill({})) }
  } else if (action.updateStudentAction) {
    const { studentId, name, className } = action
    draft.students.entities[studentId].name = name
    draft.students.entities[studentId].className = className
  } else if (action.deleteStudentAction) {
    const { studentId } = action
    delete draft.students.entities[studentId]
  }

  // Lessons
  else if (action.addLessonAction) {
    const { lessonId, name, color, teacherIds } = action
    draft.lessons.entities[lessonId] = { id: lessonId, name: name, color: color }

    if (teacherIds) {
      for (const tId in draft.teachers.entities) {
        if (teacherIds.includes(tId)) {
          draft.teachers.entities[tId].taughtLessons.push({ id: lessonId })
        }
      }
    }
  } else if (action.updateLessonsAction) {
    const { patches } = action
    for (const lessonId in patches) {
      const patch = patches[lessonId]
      draft.lessons.entities[lessonId].name = patch.name
      if (patch.color) {
        draft.lessons.entities[lessonId].color = patch.color
      }
    }
  } else if (action.deleteLessonAction) {
    const { lessonId } = action
    delete draft.lessons.entities[lessonId]

    for (const studentId in draft.students.entities) {
      const student = draft.students.entities[studentId]
      for (const [dayI, day] of student.schedule.entries()) {
        for (const [lessonI, lesson] of day.entries()) {
          if (lesson?.lessonId == lessonId) {
            draft.students.entities[studentId].schedule[dayI][lessonI] = null
          }
        }
      }
    }
    for (const teacherId in draft.teachers.entities) {
      draft.teachers.entities[teacherId].taughtLessons = draft.teachers.entities[teacherId].taughtLessons.filter(l => l.id != lessonId)
    }
  }

  //Teachers
  else if (action.addTeacherAction) {
    const { teacherId, name, taughtLessons } = action
    draft.teachers.entities[teacherId] = { id: teacherId, name: name, taughtLessons: taughtLessons }
  } else if (action.updateTeachersAction) {
    const { patches } = action
    for (const teacherId in patches) {
      const patch = patches[teacherId]
      draft.teachers.entities[teacherId].name = patch.name
      draft.teachers.entities[teacherId].taughtLessons = patch.taughtLessons
    }
  } else if (action.deleteTeacherAction) {
    const { teacherId } = action
    delete draft.teachers.entities[teacherId]

    for (const studentId in draft.students.entities) {
      const student = draft.students.entities[studentId]
      for (const [dayI, day] of student.schedule.entries()) {
        for (const [lessonI, lesson] of day.entries()) {
          if (lesson?.teacherId == teacherId) {
            draft.students.entities[studentId].schedule[dayI][lessonI] = null
          }
        }
      }
    }
  }
}